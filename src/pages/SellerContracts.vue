<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Мои контракты (Продавец)</div>
    
    <q-table
      :rows="contracts"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="props.value === 'draft' ? 'orange' : 'green'" text-color="white">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>
      
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn color="primary" label="Открыть" :to="'/contracts/' + props.row.id" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'

const contracts = ref([])
const loading = ref(true)

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'total_amount', label: 'Сумма', field: 'total_amount', align: 'center' },
  { name: 'currency', label: 'Валюта', field: 'currency', align: 'center' },
  { name: 'status', label: 'Статус', field: 'status', align: 'center' },
  { name: 'actions', label: 'Действие', field: 'id', align: 'right' }
]

const loadContracts = async () => {
  try {
    const res = await api.get('/contracts')
    contracts.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadContracts)
</script>
