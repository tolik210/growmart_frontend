<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">🏢/🧑 Кабинет покупателя</div>
    <div class="text-grey-5 q-mb-md">Дальше подключим контракты/платежи.</div>

    <q-btn color="purple-4" label="Контракты" @click="$router.push('/contracts')" />
    <q-btn flat color="purple-4" label="Выйти" class="q-ml-sm" @click="logout" />
  </div>
</template>

<script setup>
const logout = () => { localStorage.clear(); window.location.href = "/" }
</script>
