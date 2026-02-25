<template>
  <q-layout view="hHh lpR fFf" style="background-color: #050505; color: white;">

    <q-header class="bg-dark-header">
      <q-toolbar class="q-py-sm px-responsive row items-center no-wrap">

        <div class="logo cursor-pointer row items-center q-mr-sm-lg q-mr-xs-sm" @click="$router.push('/')">
          <span class="text-white text-h5 text-weight-bolder">grow</span><span class="text-purple-accent text-h5 text-weight-bolder">mart</span>
        </div>

        <q-input
          v-model="searchQuery"
          dark
          dense
          outlined
          placeholder="Поиск..."
          class="col global-search"
          @keyup.enter="doSearch"
        >
          <template v-slot:append>
            <q-icon v-if="searchQuery" name="close" @click="searchQuery = ''" class="cursor-pointer" size="xs" />
            <q-btn flat round dense icon="search" color="purple-accent" @click="doSearch" size="sm" />
          </template>
        </q-input>

        <div class="nav-actions row items-center q-gutter-x-xs">

          <q-btn flat round color="grey-4" icon="shopping_cart" size="md" @click="$router.push('/cart')">
            <q-badge v-if="cartCount > 0" color="purple-accent" floating rounded>{{ cartCount }}</q-badge>
          </q-btn>

          <q-btn v-if="isLoggedIn" flat round color="grey-4" icon="notifications" size="md" @click="openNotifications">
            <q-badge v-if="unreadCount > 0" color="purple-accent" floating rounded pulse>{{ unreadCount }}</q-badge>
          </q-btn>

          <template v-if="!isLoggedIn">
            <q-btn color="purple-accent" label="Вход" class="text-weight-bold gt-xs" unelevated @click="$router.push('/login')" />
            <q-btn color="purple-accent" icon="login" flat round class="lt-sm" @click="$router.push('/login')" />
          </template>

          <template v-else>
            <div class="row items-center gt-xs q-ml-sm">
              <div class="column items-end q-mr-sm cursor-pointer" @click="goToCabinet">
                <span class="text-purple-4 text-caption text-weight-bold" style="line-height: 1">Привет,</span>
                <span class="text-white text-weight-bolder">{{ userName || 'Профиль' }}</span>
              </div>
              <q-avatar size="32px" color="purple-10" text-color="white" icon="person" class="cursor-pointer" @click="goToCabinet" />
              <q-btn flat round color="grey-6" icon="logout" size="sm" class="q-ml-xs" @click="logout" />
            </div>

            <div class="row items-center lt-sm q-ml-xs">
              <q-avatar size="28px" color="purple-10" text-color="white" icon="person" @click="goToCabinet" />
              <q-btn flat round color="grey-6" icon="logout" size="sm" @click="logout" />
            </div>
          </template>

        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="notifDialog" position="right" maximized transition-show="slide-left" transition-hide="slide-right">
      <q-card style="width: 380px; max-width: 100vw; background-color: #0a0a0c; border-left: 1px solid #7b61ff;" class="text-white column">
        <q-card-section class="row items-center q-pa-md bg-dark-header">
          <div class="text-h6 text-weight-bold">Уведомления</div>
          <q-space />
          <q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>
        <q-separator dark />
        <q-card-section class="col scroll q-pa-none">
          <div v-if="!notifications || notifications.length === 0" class="text-center q-pa-xl text-grey-6">
            <q-icon name="notifications_off" size="4em" class="q-mb-md" color="grey-9" />
            <div>Нет уведомлений</div>
          </div>
          <q-list v-else dark separator>
            <q-item v-for="n in notifications" :key="n.id" clickable v-ripple @click="handleNotifClick(n)"
              :class="n.is_read ? 'opacity-60' : 'bg-purple-10 bg-opacity-10'">
              <q-item-section avatar>
                <q-icon name="notifications" :color="n.is_read ? 'grey-7' : 'purple-accent'" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ n.title }}</q-item-label>
                <q-item-label caption class="text-grey-4">{{ n.message }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from 'src/services/api'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const userName = ref('')
const cartCount = ref(0)
const notifDialog = ref(false)
const notifications = ref([])
const unreadCount = ref(0)
const searchQuery = ref('')
let pollInterval = null

const checkAuth = () => {
  isLoggedIn.value = !!localStorage.getItem('token')
  userName.value = localStorage.getItem('name') || ''
  const cart = JSON.parse(localStorage.getItem('growmart_cart') || '[]')
  cartCount.value = cart.length
  if (isLoggedIn.value) {
    fetchNotifications()
    if (!pollInterval) pollInterval = setInterval(fetchNotifications, 15000)
  }
}

const doSearch = () => {
  if (searchQuery.value.trim()) router.push({ path: '/catalog', query: { search: searchQuery.value } })
  else router.push('/catalog')
}

const fetchNotifications = async () => {
  try {
    const res = await api.get('/notifications')
    if (res.data && res.data.notifications) {
        notifications.value = res.data.notifications
        unreadCount.value = notifications.value.filter(n => !n.is_read).length
    }
  } catch (e) {
    notifications.value = []
  }
}

const openNotifications = () => { notifDialog.value = true; fetchNotifications(); }

const handleNotifClick = async (n) => {
  if (!n.is_read) { try { await api.post(`/notifications/${n.id}/read`); n.is_read = true; unreadCount.value--; } catch (e) {} }
}

const goToCabinet = () => {
  const role = localStorage.getItem('role')
  if (role === 'seller' || role === 'farmer') router.push('/seller')
  else if (role === 'admin') router.push('/admin')
  else router.push('/buyer')
}

const logout = () => { 
  localStorage.clear(); 
  isLoggedIn.value = false; 
  if (pollInterval) clearInterval(pollInterval); 
  router.push('/login'); 
}

watch(route, () => { checkAuth() })
onMounted(() => { checkAuth() })
onUnmounted(() => { if (pollInterval) clearInterval(pollInterval) })
</script>

<style scoped>
.bg-dark-header { background-color: rgba(10, 10, 12, 0.95); backdrop-filter: blur(10px); }
.px-responsive { padding-left: 2%; padding-right: 2%; }
@media (min-width: 600px) {
  .px-responsive { padding-left: 5%; padding-right: 5%; }
}
.global-search { max-width: 500px; min-width: 80px; }
.text-purple-accent { color: #7b61ff; }
.bg-purple-accent { background-color: #7b61ff !important; }
.bg-opacity-10 { background-color: rgba(123, 97, 255, 0.1) !important; }
.opacity-60 { opacity: 0.6; }
</style>
