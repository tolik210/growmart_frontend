<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="orders-page q-pa-lg">
        <div class="row items-center q-mb-xl">
          <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/buyer')" />
          <h4 class="text-white q-my-none text-weight-bold">История заказов</h4>
        </div>

        <div v-if="loading" class="flex flex-center q-pa-xl">
          <q-spinner color="red-5" size="3em" />
        </div>

        <div v-else-if="orders.length === 0" class="text-center q-pa-xl">
          <q-icon name="receipt_long" size="6em" color="grey-8" />
          <h5 class="text-grey-5 q-mt-md">У вас пока нет заказов</h5>
          <q-btn class="q-mt-lg" color="red-5" label="Перейти к покупкам" @click="$router.push('/')" />
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
                  <div class="text-red-4 text-h5 text-weight-bold">{{ order.total_amount }} ₸</div>
                </div>
              </q-card-section>
              
              <q-separator dark />
              
              <q-card-section class="q-pa-md">
                <div class="text-grey-5 q-mb-md text-weight-bold text-subtitle1">Состав заказа:</div>
                <div v-for="(item, idx) in order.items" :key="idx" class="row items-center no-wrap q-mb-md q-pl-md" style="border-left: 3px solid #333;">
                  <q-avatar rounded size="50px" class="q-mr-md bg-grey-9">
                    <img v-if="item.image" :src="'https://v1.growmart.ltd/uploads/' + item.image.split('/').pop()" />
                    <q-icon v-else name="image" color="grey-6" />
                  </q-avatar>
                  <div class="col">
                    <div class="text-white text-subtitle1 text-weight-bold">{{ item.title }}</div>
                    <div class="text-grey-5 text-caption">{{ item.location || 'Локация не указана' }}</div>
                  </div>
                  <div class="col-auto text-white text-weight-bold text-subtitle1">
                    {{ item.order_quantity }} {{ item.unit === 'ton' ? 'т' : 'кг' }} <span class="text-grey-6 q-mx-sm">x</span> {{ item.price }} ₸
                  </div>
                </div>
              </q-card-section>

              <q-card-actions class="q-pa-md bg-dark-header justify-end" v-if="order.status === 'pending'">
                <q-btn color="red-5" icon="history_edu" label="Ознакомиться и подписать договор" class="text-weight-bold" @click="openContract(order)" />
              </q-card-actions>

            </q-card>
          </div>
        </div>

        <q-dialog v-model="contractDialog" persistent>
          <q-card class="contract-modal">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6 text-weight-bold text-white">Электронный договор купли-продажи</div>
              <q-space />
              <q-btn icon="close" flat round dense color="grey-5" v-close-popup />
            </q-card-section>

            <q-card-section class="contract-text-container scroll q-mt-md">
              <h6 class="text-center text-white q-mt-none">ДОГОВОР № {{ selectedOrder?.id.split('-')[0].toUpperCase() }}</h6>
              <p class="text-center text-grey-5">Дата формирования: {{ selectedOrder?.date }}</p>
              
              <p>Настоящий договор (далее - "Договор") заключается с использованием электронной торговой площадки Growmart.kz.</p>
              
              <p class="text-weight-bold text-white q-mt-md">1. ПРЕДМЕТ ДОГОВОРА</p>
              <p>1.1. Продавец обязуется передать в собственность Покупателю сельскохозяйственную продукцию, а Покупатель обязуется принять и оплатить продукцию на условиях настоящего Договора.</p>
              <p>1.2. Наименование и объем продукции:</p>
              <ul>
                <li v-for="item in selectedOrder?.items" :key="item.id" class="text-red-3">
                  {{ item.title }} — {{ item.order_quantity }} {{ item.unit === 'ton' ? 'тонн' : 'кг' }}
                </li>
              </ul>

              <p class="text-weight-bold text-white q-mt-md">2. СУММА ДОГОВОРА И ПОРЯДОК РАСЧЕТОВ</p>
              <p>2.1. Общая сумма по настоящему Договору составляет: <span class="text-white text-weight-bold">{{ selectedOrder?.total_amount }} тенге</span>.</p>
              <p>2.2. Оплата производится безналичным путем либо иным согласованным между сторонами способом.</p>

              <p class="text-weight-bold text-white q-mt-md">3. ПОДПИСАНИЕ И ЭЦП</p>
              <p>3.1. Нажимая кнопку "Подписать", Покупатель подтверждает свое согласие со всеми условиями Договора, и данное действие приравнивается к собственноручной подписи.</p>
            </q-card-section>

            <q-card-actions align="right" class="q-pa-md bg-dark-header">
              <q-btn flat label="Отмена" color="white" v-close-popup />
              <q-btn label="Подписать (ЭЦП)" color="green-6" class="text-weight-bold" icon="check_circle" @click="signContract" :loading="signing" />
            </q-card-actions>
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const $q = useQuasar()
const loading = ref(true)
const orders = ref([])

// Для модального окна договора
const contractDialog = ref(false)
const selectedOrder = ref(null)
const signing = ref(false)

const fetchOrders = async () => {
  try {
    const res = await api.get('/orders')
    orders.value = res.data.orders || []
  } catch (e) {
    console.error('Ошибка загрузки заказов:', e)
  } finally {
    loading.value = false
  }
}

const statusColor = (status) => {
  const map = { 'pending': 'orange-8', 'processing': 'blue-8', 'completed': 'green-8', 'cancelled': 'red-8' }
  return map[status] || 'grey-8'
}

const statusText = (status) => {
  const map = { 'pending': 'В обработке', 'processing': 'Собирается продавцом', 'completed': 'Завершен', 'cancelled': 'Отменен' }
  return map[status] || status
}

const openContract = (order) => {
  selectedOrder.value = order
  contractDialog.value = true
}

const signContract = async () => {
  if (!selectedOrder.value) return
  signing.value = true
  
  try {
    await api.post(`/orders/${selectedOrder.value.id}/sign`)
    
    $q.notify({
      type: 'positive',
      message: 'Договор подписан! Заказ передан на сборку.',
      icon: 'verified',
      position: 'center',
      timeout: 4000
    })
    
    contractDialog.value = false
    await fetchOrders() // Обновляем список, чтобы статус стал "Собирается продавцом"
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка при подписании договора', position: 'top' })
  } finally {
    signing.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page { background-color: #050505; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.order-card { background-color: #111112; border-color: #222; border-radius: 16px; overflow: hidden; transition: transform 0.2s; }
.order-card:hover { border-color: #444; }
.bg-dark-header { background-color: #161618; }

/* Стили модального окна с договором */
.contract-modal { background-color: #111112; border: 1px solid #333; min-width: 600px; max-width: 90vw; color: #ccc; }
.contract-text-container { max-height: 60vh; background-color: #0a0a0a; border: 1px solid #222; border-radius: 8px; margin: 0 16px 16px 16px; padding: 24px; font-size: 14px; line-height: 1.6; }
@media (max-width: 600px) { .contract-modal { min-width: 100vw; height: 100vh; border-radius: 0; } }
</style>
