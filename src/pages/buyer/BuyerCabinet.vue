<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="buyer-cabinet q-pa-lg">
        <div class="row items-center q-mb-xl">
          <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/')" />
          <h4 class="text-white q-my-none text-weight-bold">Кабинет покупателя</h4>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="menu-card cursor-pointer" flat bordered @click="$router.push('/buyer/orders')">
              <q-card-section class="column items-center q-pa-xl text-center">
                <q-icon name="receipt_long" size="4em" color="red-5" class="q-mb-md" />
                <div class="text-h6 text-white text-weight-bold">Мои заказы</div>
                <div class="text-grey-5 q-mt-sm">История покупок и статусы доставки</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="menu-card cursor-pointer" flat bordered @click="$router.push('/cart')">
              <q-card-section class="column items-center q-pa-xl text-center">
                <q-icon name="shopping_cart" size="4em" color="white" class="q-mb-md" />
                <div class="text-h6 text-white text-weight-bold">Корзина</div>
                <div class="text-grey-5 q-mt-sm">Перейти к оформлению товаров</div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="menu-card cursor-pointer" flat bordered @click="$router.push('/profile')">
              <q-card-section class="column items-center q-pa-xl text-center">
                <q-icon name="manage_accounts" size="4em" color="grey-7" class="q-mb-md" />
                <div class="text-h6 text-white text-weight-bold">Профиль</div>
                <div class="text-grey-5 q-mt-sm">Личные данные и адреса доставки</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

const comingSoon = () => {
  $q.notify({
    type: 'info',
    message: 'Раздел профиля будет доступен в следующем обновлении',
    position: 'top'
  })
}
</script>

<style scoped>
.buyer-cabinet { background-color: #050505; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.menu-card { background-color: #111112; border-color: #222; border-radius: 16px; transition: all 0.3s ease; }
.menu-card:hover { border-color: #ff5252; transform: translateY(-4px); box-shadow: 0 8px 24px rgba(241, 70, 53, 0.15); }
</style>
