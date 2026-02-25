<template>
  <q-page class="q-pa-md contract-page">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        
        <div class="row items-center q-mb-md">
          <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.back()" />
          <h5 class="text-white q-my-none text-weight-bold">Подписание договора</h5>
        </div>

        <q-card v-if="loading" dark flat bordered class="q-pa-xl text-center" style="background: #0a0a0c;">
          <q-spinner color="blue-5" size="3em" />
          <div class="q-mt-md text-grey-5">Формирование документа...</div>
        </q-card>

        <q-card v-else-if="order" dark flat bordered class="contract-card q-pa-lg">
          <h5 class="text-center text-weight-bold q-mt-none q-mb-md">ДОГОВОР КУПЛИ-ПРОДАЖИ СЕЛЬХОЗПРОДУКЦИИ</h5>
          <div class="row justify-between text-grey-5 q-mb-lg">
            <span>г. Шымкент</span>
            <span>{{ currentDate }}</span>
          </div>

          <q-separator dark class="q-mb-lg" />

          <div class="contract-text text-body1 text-grey-3">
            <p>Настоящий договор устанавливает обязательства сторон. Платформа GrowMart выступает гарантом сделки.</p>
            <p class="text-weight-bold q-mt-md">1. ПРЕДМЕТ ДОГОВОРА</p>
            <p>1.1. Продавец обязуется передать Товар, а Покупатель принять и оплатить его.</p>
            
            <q-markup-table dark flat bordered class="q-my-md" style="background: #111112;">
              <thead>
                <tr>
                  <th class="text-left">Наименование</th>
                  <th class="text-right">Объем</th>
                  <th class="text-right">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in order.items" :key="idx">
                  <td class="text-left">{{ item.title || item.crop_name }}</td>
                  <td class="text-right">{{ item.order_quantity }} {{ item.unit === 'ton' ? 'т' : 'кг' }}</td>
                  <td class="text-right">{{ (item.price * item.order_quantity).toLocaleString() }} ₸</td>
                </tr>
              </tbody>
            </q-markup-table>

            <p class="text-weight-bold q-mt-md">2. СУММА ДОГОВОРА</p>
            <p>Общая сумма составляет: <strong class="text-blue-4">{{ order.total_amount.toLocaleString() }} тенге</strong>.</p>
          </div>

          <q-separator dark class="q-my-lg" />

          <div class="bg-dark-header q-pa-md rounded-borders">
            <q-checkbox dark v-model="agreed" color="green-5">
              <template v-slot:default>
                <div class="text-weight-bold">Я внимательно ознакомился с текстом договора</div>
                <div class="text-caption text-grey-5">Подтверждаю согласие и подписываю документ ЭЦП</div>
              </template>
            </q-checkbox>
          </div>

          <div class="row justify-end q-mt-xl q-gutter-x-md">
            <q-btn flat color="red-4" label="Отказаться" @click="$router.back()" />
            <q-btn color="blue-6" icon="draw" label="Подписать (ЭЦП)" :disable="!agreed" :loading="signing" @click="signContract" />
          </div>

        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const orderId = route.params.id
const loading = ref(true)
const signing = ref(false)
const order = ref(null)
const agreed = ref(false)

const currentDate = computed(() => new Date().toLocaleDateString('ru-RU'))

const fetchOrder = async () => {
  try {
    const role = localStorage.getItem('role')
    const endpoint = (role === 'seller' || role === 'farmer') ? '/seller/orders' : '/orders'
    
    const res = await api.get(endpoint)
    const found = res.data.orders.find(o => o.id === orderId)
    
    if (found) order.value = found
    else {
      $q.notify({ type: 'negative', message: 'Заказ не найден' })
      router.back()
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка загрузки договора' })
  } finally {
    loading.value = false
  }
}

const signContract = async () => {
  signing.value = true
  try {
    await api.post(`/orders/${orderId}/sign`)
    $q.notify({ type: 'positive', message: 'Договор успешно подписан!', icon: 'verified', position: 'top' })
    
    const role = localStorage.getItem('role')
    if (role === 'seller' || role === 'farmer') router.push('/seller/orders')
    else router.push('/buyer/orders')
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка при подписании' })
  } finally {
    signing.value = false
  }
}

onMounted(() => { fetchOrder() })
</script>

<style scoped>
.contract-page { background-color: #050505; min-height: 100vh; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.bg-dark-header { background-color: #111112; border: 1px solid #222; }
.contract-card { background-color: #0a0a0c; border-color: #222; border-radius: 12px; }
.contract-text p { line-height: 1.6; margin-bottom: 8px; }
</style>
