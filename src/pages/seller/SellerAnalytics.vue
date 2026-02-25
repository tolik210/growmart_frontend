<template>
  <q-page class="analytics-page q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/seller')" />
      <h4 class="text-white q-my-none text-weight-bold">Аналитика продаж</h4>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="blue-5" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-card class="stat-card" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-grey-5">Общая выручка</div>
              <q-icon name="account_balance_wallet" size="2em" color="green-5" />
            </div>
            <div class="text-h3 text-white text-weight-bold">{{ stats.total_revenue?.toLocaleString() || 0 }} ₸</div>
            <div class="text-green-4 q-mt-sm row items-center">
              <q-icon name="trending_up" class="q-mr-xs"/> За все время работы
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="stat-card" flat bordered @click="$router.push('/seller/orders')" style="cursor: pointer;">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-grey-5">Заказы в работе</div>
              <q-icon name="local_shipping" size="2em" color="blue-5" />
            </div>
            <div class="text-h3 text-white text-weight-bold">{{ stats.active_orders || 0 }}</div>
            <div class="text-blue-4 q-mt-sm">Ожидают отгрузки или подписи</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="stat-card" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-grey-5">Успешные сделки</div>
              <q-icon name="handshake" size="2em" color="purple-5" />
            </div>
            <div class="text-h3 text-white text-weight-bold">{{ stats.completed_orders || 0 }}</div>
            <div class="text-purple-4 q-mt-sm">Товар доставлен и оплачен</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="stat-card" flat bordered @click="$router.push('/seller/products')" style="cursor: pointer;">
          <q-card-section class="q-pa-lg">
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-grey-5">Товары на витрине</div>
              <q-icon name="inventory_2" size="2em" color="orange-5" />
            </div>
            <div class="text-h3 text-white text-weight-bold">{{ stats.total_products || 0 }}</div>
            <div class="text-orange-4 q-mt-sm">Опубликовано и в черновиках</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from 'src/services/api'

const loading = ref(true)
const stats = ref({})

const fetchAnalytics = async () => {
  try {
    const res = await api.get('/seller/analytics')
    stats.value = res.data || {}
  } catch (e) {
    console.error('Ошибка загрузки аналитики:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnalytics()
})
</script>

<style scoped>
.analytics-page { background-color: #050505; min-height: 100vh; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.stat-card { background-color: #111112; border-color: #222; border-radius: 16px; transition: all 0.3s ease; }
.stat-card:hover { border-color: #3b82f6; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1); }
</style>
