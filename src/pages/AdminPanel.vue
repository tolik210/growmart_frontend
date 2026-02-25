<template>
  <q-page class="q-pa-md bg-black text-white">
    <div class="row items-center q-mb-lg">
      <q-icon name="admin_panel_settings" size="md" color="blue-5" class="q-mr-sm" />
      <h4 class="text-h4 text-weight-bolder q-ma-none">Панель управления</h4>
    </div>

    <q-tabs v-model="tab" dark class="text-grey" active-color="blue-5" indicator-color="blue-5" align="left">
      <q-tab name="users" icon="people" label="Пользователи" />
      <q-tab name="orders" icon="shopping_cart" label="Все заказы" />
    </q-tabs>

    <q-separator dark />

    <q-tab-panels v-model="tab" animated class="bg-transparent q-mt-md">
      <q-tab-panel name="users">
        <q-table
          :rows="users"
          :columns="userColumns"
          row-key="id"
          dark
          flat
          bordered
          :loading="loading"
          class="admin-table"
        >
          <template v-slot:body-cell-is_verified="props">
            <q-td :props="props">
              <q-chip
                :color="props.value ? 'green-9' : 'orange-9'"
                text-color="white"
                dense
                square
                class="text-weight-bold"
              >
                {{ props.value ? 'ВЕРИФИЦИРОВАН' : 'ОЖИДАЕТ' }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                v-if="!props.row.is_verified"
                flat
                round
                dense
                color="green-4"
                icon="check_circle"
                @click="verifyUser(props.row.id)"
              >
                <q-tooltip>Подтвердить пользователя</q-tooltip>
              </q-btn>
              
              <q-btn
                flat
                round
                dense
                color="red-5"
                icon="delete_forever"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Удалить навсегда</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="orders">
        <q-table :rows="orders" :columns="orderColumns" row-key="id" dark flat bordered :loading="loading" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const $q = useQuasar()
const tab = ref('users')
const users = ref([])
const orders = ref([])
const loading = ref(false)

const userColumns = [
  { name: 'date', label: 'Дата рег.', field: 'date', align: 'left' },
  { name: 'name', label: 'Имя / Организация', field: 'name', align: 'left', sortable: true },
  { name: 'iin', label: 'ИИН/БИН', field: 'iin', align: 'left' },
  { name: 'role', label: 'Роль', field: 'role', align: 'center' },
  { name: 'is_verified', label: 'Статус', field: 'is_verified', align: 'center' },
  { name: 'actions', label: 'Действия', align: 'right' }
]

const orderColumns = [
  { name: 'date', label: 'Дата', field: 'date', align: 'left' },
  { name: 'id', label: 'ID Заказа', field: 'id', align: 'left' },
  { name: 'total_amount', label: 'Сумма', field: 'total_amount', align: 'right' },
  { name: 'status', label: 'Статус', field: 'status', align: 'center' }
]

const loadData = async () => {
  loading.value = true
  try {
    const [uRes, oRes] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/orders')
    ])
    users.value = uRes.data
    orders.value = oRes.data
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка загрузки данных' })
  } finally {
    loading.value = false
  }
}

const verifyUser = async (id) => {
  try {
    await api.post(`/admin/users/${id}/verify`)
    $q.notify({ type: 'positive', message: 'Пользователь подтвержден' })
    loadData()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка верификации' })
  }
}

const confirmDelete = (user) => {
  $q.dialog({
    title: 'Удаление',
    message: `Вы действительно хотите удалить ${user.name}? Это действие нельзя отменить.`,
    cancel: true,
    persistent: true,
    dark: true
  }).onOk(async () => {
    try {
      await api.delete(`/admin/users/${user.id}`)
      $q.notify({ type: 'positive', message: 'Пользователь удален' })
      loadData()
    } catch (e) {
      $q.notify({ type: 'negative', message: 'Не удалось удалить пользователя' })
    }
  })
}

onMounted(loadData)
</script>

<style scoped>
.admin-table {
  background-color: #0a0a0c !important;
  border-radius: 12px;
}
</style>
