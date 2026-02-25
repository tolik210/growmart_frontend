<template>
  <q-page class="seller-cabinet q-pa-lg">
    <div class="row items-center q-mb-xl">
      <h4 class="text-white q-my-none text-weight-bold">Кабинет фермера</h4>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="menu-card cursor-pointer" flat bordered @click="$router.push('/seller/products')">
          <q-card-section class="column items-center q-pa-xl text-center">
            <q-icon name="inventory_2" size="4em" color="green-5" class="q-mb-md" />
            <div class="text-h6 text-white text-weight-bold">Управление товарами</div>
            <div class="text-grey-5 q-mt-sm">Добавление урожая, цены и объемы</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="menu-card cursor-pointer" flat bordered @click="$router.push('/seller/orders')">
          <q-card-section class="column items-center q-pa-xl text-center">
            <q-icon name="local_shipping" size="4em" color="blue-5" class="q-mb-md" />
            <div class="text-h6 text-white text-weight-bold">Заказы клиентов</div>
            <div class="text-grey-5 q-mt-sm">Сделки, договоры и отгрузка</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4">
        <q-card class="menu-card cursor-pointer" flat bordered @click="$router.push('/seller/analytics')">
          <q-card-section class="column items-center q-pa-xl text-center">
            <q-icon name="trending_up" size="4em" color="grey-7" class="q-mb-md" />
            <div class="text-h6 text-white text-weight-bold">Аналитика продаж</div>
            <div class="text-grey-5 q-mt-sm">Статистика доходов (скоро)</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
const $q = useQuasar()

const comingSoon = () => {
  $q.notify({ type: 'info', message: 'Аналитика появится в следующем обновлении', position: 'top' })
}
</script>

<style scoped>
.seller-cabinet { background-color: #050505; min-height: 100vh; }
.menu-card { background-color: #111112; border-color: #222; border-radius: 16px; transition: all 0.3s ease; }
.menu-card:hover { border-color: #7b61ff; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(123, 97, 255, 0.15); }
</style>
