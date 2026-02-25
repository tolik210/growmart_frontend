<template>
  <q-page class="q-pa-lg">
    <h4 class="text-white q-mt-none q-mb-lg text-weight-bold">Продажи (Заказы)</h4>
    <q-table :rows="orders" :columns="columns" dark flat bordered class="bg-dark-table">
      
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge v-if="props.row.status === 'pending'" color="grey" label="Ждем покупателя" />
          <q-badge v-if="props.row.status === 'buyer_signed'" color="orange" label="Требуется ваша подпись" />
          <q-badge v-if="props.row.status === 'processing'" color="blue" label="В работе" />
          <q-badge v-if="props.row.status === 'completed'" color="green" label="Завершен" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn v-if="props.row.status === 'buyer_signed'" size="sm" color="blue-6" label="Подписать ЭЦП" @click="sign(props.row.id)" />
          <q-btn v-if="props.row.status === 'processing'" size="sm" color="green-6" label="Отгрузить товар" @click="complete(props.row.id)" />
          <q-btn flat round color="blue-4" icon="chat" @click="openChat(props.row.id)">
            <q-tooltip>Чат с покупателем</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="chatOpen" position="right" maximized>
      <q-card style="width: 400px; max-width: 100vw; background-color: #0a0a0c; border-left: 1px solid #1e3a8a;" class="column text-white">
        <q-card-section class="row items-center bg-dark-header">
          <q-icon name="chat" size="sm" color="blue-4" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold">Чат сделки</div>
          <q-space />
          <q-btn icon="close" flat round dense color="grey-5" v-close-popup />
        </q-card-section>
        <q-separator dark />
        <q-card-section class="col scroll" ref="chatScroll">
          <div v-if="messages.length === 0" class="text-center text-grey-6 q-mt-xl">Нет сообщений...</div>
          <q-chat-message v-for="m in messages" :key="m.id" :name="m.sender_id === myUid ? 'Вы' : m.sender_name" :text="[m.message]" :stamp="m.time" :sent="m.sender_id === myUid" :bg-color="m.sender_id === myUid ? 'blue-8' : 'grey-9'" text-color="white" />
        </q-card-section>
        <q-separator dark />
        <q-card-actions class="bg-dark-header q-pa-sm row no-wrap">
          <q-input v-model="newMessage" dark dense outlined placeholder="Сообщение..." class="col q-mr-sm" @keyup.enter="sendMsg" />
          <q-btn round color="blue-6" icon="send" @click="sendMsg" :disable="!newMessage" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/services/api'

const $q = useQuasar()
const router = useRouter()
const orders = ref([])
const columns = [
  { name: 'date', label: 'Дата', field: 'date', align: 'left' },
  { name: 'total_amount', label: 'Сумма (₸)', field: 'total_amount', align: 'left' },
  { name: 'status', label: 'Статус', field: 'status', align: 'left' },
  { name: 'actions', label: 'Действия', align: 'center' }
]

const chatOpen = ref(false)
const messages = ref([])
const newMessage = ref('')
const activeOrderId = ref(null)
const myUid = localStorage.getItem('uid')
const chatScroll = ref(null)
let chatInterval = null

const fetchOrders = async () => {
  const res = await api.get('/seller/orders')
  orders.value = res.data.orders || []
}

const sign = (id) => {
  router.push(`/order/${id}/sign`)
}

const complete = async (id) => {
  try {
    await api.post(`/orders/${id}/complete`)
    $q.notify({ type: 'positive', message: 'Заказ успешно завершен и отгружен!' })
    fetchOrders()
  } catch(e) {
    $q.notify({ type: 'negative', message: 'Ошибка при отгрузке' })
  }
}

const openChat = async (orderId) => {
  activeOrderId.value = orderId
  chatOpen.value = true
  await loadMessages()
  if (chatInterval) clearInterval(chatInterval)
  chatInterval = setInterval(loadMessages, 5000)
}

const loadMessages = async () => {
  if (!activeOrderId.value || !chatOpen.value) return
  const res = await api.get(`/orders/${activeOrderId.value}/chat`)
  messages.value = res.data.messages || []
  nextTick(() => { if (chatScroll.value) chatScroll.value.$el.scrollTop = chatScroll.value.$el.scrollHeight })
}

const sendMsg = async () => {
  if (!newMessage.value.trim()) return
  await api.post(`/orders/${activeOrderId.value}/chat`, { message: newMessage.value })
  newMessage.value = ''
  await loadMessages()
}

onMounted(fetchOrders)
</script>

<style scoped>
.bg-dark-table { background-color: #111112; border-radius: 12px; }
.bg-dark-header { background-color: #161618; }
</style>
