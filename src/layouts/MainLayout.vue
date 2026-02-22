<template>
  <q-layout view="lHh Lpr lFf" :class="isSeller ? 'seller-theme' : 'buyer-theme'">
    <q-header elevated :class="isSeller ? 'bg-green-10' : 'bg-dark'">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold row items-center">
          GrowMart
          <q-badge :color="isSeller ? 'green-4' : 'blue-4'" class="q-ml-sm text-black text-weight-bolder">
            @{{ roleLabel }}
          </q-badge>
        </q-toolbar-title>

        <q-btn flat round icon="notifications" :to="isSeller ? '/seller/notifications' : '/buyer/notifications'" />
        <q-btn flat round icon="account_circle" :to="isSeller ? '/seller/profile' : '/buyer/profile'" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'

// ИСПРАВИЛИ: теперь читаем правильный ключ 'user_role'
const role = localStorage.getItem('user_role') || 'buyer'
const isSeller = computed(() => role === 'seller' || role === 'farmer')
const roleLabel = computed(() => isSeller.value ? 'фермер' : 'покупатель')
</script>

<style>
.seller-theme {
  background: linear-gradient(180deg, #050505 0%, #0a1a0a 100%) !important;
}
.buyer-theme {
  background: #050505 !important;
}
/* Плавное свечение для фермера */
.seller-theme .q-header {
  border-bottom: 1px solid #2e7d32;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.1);
}
</style>
