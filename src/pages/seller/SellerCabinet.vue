<template>
  <div class="q-pa-md text-white" style="background: #050505; min-height: 100vh;">
    <div class="text-h4 text-weight-bold q-mb-xl">Кабинет Продавца</div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-4">
        <q-card class="menu-card shadow-24" @click="$router.push('/seller/products')">
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="inventory_2" size="4rem" color="green-4" />
            <div class="text-h6 q-mt-md">Мои товары</div>
            <div class="text-grey-5">Управление каталогом и остатками</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="menu-card shadow-24" @click="$router.push('/seller/profile')">
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="business" size="4rem" color="purple-4" />
            <div class="text-h6 q-mt-md">Профиль компании</div>
            <div class="text-grey-5">БИН, реквизиты и контакты</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="menu-card shadow-24" @click="$router.push('/seller/contracts')">
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="assignment" size="4rem" color="orange-4" />
            <div class="text-h6 q-mt-md">Сделки и контракты</div>
            <div class="text-grey-5">Входящие заказы от покупателей</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-center q-mt-xl">
      <q-btn flat color="negative" label="Выйти из системы" icon="logout" @click="logout" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { setAccessToken } from 'src/services/tokenMemory'

const router = useRouter()

function logout() {
  setAccessToken('')
  localStorage.removeItem('role')
  localStorage.removeItem('iin_bin')
  router.push('/')
}
</script>

<style scoped>
.menu-card {
  background: #111;
  border-radius: 24px;
  border: 1px solid #222;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.menu-card:hover {
  transform: translateY(-10px);
  border-color: #7b61ff;
  box-shadow: 0 15px 30px rgba(123, 97, 255, 0.2);
}
</style>
