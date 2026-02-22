<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">🌾 Кабинет фермера</div>
    <div class="text-grey-5 q-mb-md">Товары + RFQ.</div>

    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-card class="bg-grey-10 text-white">
          <q-card-section>
            <div class="text-subtitle1">🧺 Мои товары</div>
            <div class="text-grey-5">Создание / публикация / снятие.</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="purple-4" label="Открыть" @click="$router.push('/seller/products')" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="bg-grey-10 text-white">
          <q-card-section>
            <div class="text-subtitle1">📨 RFQ (заявки покупателей)</div>
            <div class="text-grey-5">Список → открыть → отправить оффер.</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="purple-4" label="Открыть" @click="$router.push('/seller/rfq')" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="q-mt-lg">
      <q-btn flat color="purple-4" label="Выйти" @click="logout" />
    </div>
  </div>
</template>

<script setup>
const logout = () => { localStorage.clear(); window.location.href = "/" }
</script>
