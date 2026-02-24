<template>
  <q-page class="orders-page q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/seller')" />
      <h4 class="text-white q-my-none text-weight-bold">Входящие заказы</h4>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="blue-5" size="3em" />
    </div>

    <div v-else-if="orders.length === 0" class="text-center q-pa-xl">
      <q-icon name="inbox" size="6em" color="grey-8" />
      <h5 class="text-grey-5 q-mt-md">У вас пока нет новых заказов</h5>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-md-8 offset-md-2" v-for="order in orders" :key="order.id">
        <q-card class="order-card" flat bordered>
          <q-card-section class="row justify-between items-center bg-dark-header q-pa-md">
            <div>
              <div class="text-grey-5 text-subtitle2 q-mb-xs">Заказ № {{ order.id.split('-')[0] }}...</div>
              <div class="text-white text-h6">{{ order.date }}</div>
            </div>
            <div class="text-right">
              <q-badge :color="statusColor(order.status)" class="q-pa-sm text-subtitle2 q-mb-xs text-weight-bold">
                {{ statusText(order.status) }}
              </q-badge>
              <div class="text-blue-4 text-h5 text-weight-bold">{{ order.total_amount }} ₸</div>
            </div>
          </q-card-section>
          
          <q-separator dark />
          
          <q-card-section class="q-pa-md">
            <div class="text-grey-5 q-mb-md text-weight-bold text-subtitle1">Заказанные товары:</div>
            <div v-for="(item, idx) in order.items" :key="idx" class="row items-center no-wrap q-mb-md q-pl-md" style="border-left: 3px solid #333;">
              <q-avatar rounded size="50px" class="q-mr-md bg-grey-9">
                <img v-if="item.image" :src="'https://v1.growmart.ltd/uploads/' + item.image.split('/').pop()" />
                <q-icon v-else name="image" color="grey-6" />
              </q-avatar>
              <div class="col">
                <div class="text-white text-subtitle1 text-weight-bold">{{ item.title }}</div>
              </div>
              <div class="col-auto text-white text-weight-bold text-subtitle1">
                {{ item.order_quantity }} {{ item.unit === 'ton' ? 'т' : 'кг' }}
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="q-pa-md bg-dark-header justify-end">
            <div v-if="order.status === 'pending'" class="text-orange-5 text-weight-bold row items-center">
              <q-icon name="schedule" size="sm" class="q-mr-sm"/> Ожидает подписания договора покупателем
            </div>
            
            <div v-else-if="order.status === 'processing'" class="row items-center q-gutter-md">
              <div class="text-green-4 text-weight-bold"><q-icon name="verified" size="sm" /> Договор подписан!</div>
              <q-btn color="blue-6" icon="local_shipping" label="Отгрузить товар (Завершить)" class="text-weight-bold" @click="completeOrder(order.id)" :loading="actionLoading === order.id" />
            </div>

            <div v-else-if="order.status === 'completed'" class="text-grey-5 text-weight-bold row items-center">
              <q-icon name="done_all" size="sm" class="q-mr-sm"/> Сделка успешно завершена
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const $q = useQuasar()
const loading = ref(true)
const actionLoading = ref(null)
const orders = ref([])

const fetchOrders = async () => {
  try {
    const res = await api.get('/seller/orders')
    orders.value = res.data.orders || []
  } catch (e) {
    console.error('Ошибка:', e)
  } finally {
    loading.value = false
  }
}

const statusColor = (status) => {
  const map = { 'pending': 'orange-8', 'processing': 'blue-8', 'completed': 'green-8', 'cancelled': 'red-8' }
  return map[status] || 'grey-8'
}

const statusText = (status) => {
  const map = { 'pending': 'Ждем покупателя', 'processing': 'Нужно собрать', 'completed': 'Отгружен', 'cancelled': 'Отменен' }
  return map[status] || status
}

const completeOrder = async (orderId) => {
  actionLoading.value = orderId
  try {
    await api.post(`/orders/${orderId}/complete`)
    $q.notify({ type: 'positive', message: 'Сделка завершена! Товар отгружен.', icon: 'done_all', position: 'top' })
    await fetchOrders()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка при завершении заказа', position: 'top' })
  } finally {
    actionLoading.value = null
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page { background-color: #050505; min-height: 100vh; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.order-card { background-color: #111112; border-color: #222; border-radius: 16px; overflow: hidden; }
.bg-dark-header { background-color: #161618; }
</style>
