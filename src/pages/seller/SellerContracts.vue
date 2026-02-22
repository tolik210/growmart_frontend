<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Контракты на подпись</div>
    
    <q-table
      :rows="contracts"
      :columns="columns"
      row-key="id"
      :loading="loading"
      flat
      bordered
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="props.value === 'draft' ? 'orange' : 'green'" text-color="white" size="sm">
            {{ props.value === 'draft' ? 'Ожидает подписи' : props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn 
            color="primary" 
            label="Открыть и подписать" 
            :to="'/seller/contracts/' + props.row.id" 
            outline
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// ПОПРАВИЛИ ТУТ: используем твой стандартный путь к api
import api from 'src/services/api'

const contracts = ref([])
const loading = ref(true)

const columns = [
  { name: 'created_at', label: 'Дата', field: 'created_at', align: 'left', format: val => new Date(val).toLocaleDateString() },
  { name: 'total_amount', label: 'Сумма', field: 'total_amount', align: 'center' },
  { name: 'currency', label: 'Валюта', field: 'currency', align: 'center' },
  { name: 'status', label: 'Статус', field: 'status', align: 'center' },
  { name: 'actions', label: '', field: 'id', align: 'right' }
]

const loadContracts = async () => {
  try {
    const res = await api.get('/contracts')
    contracts.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки контрактов:', e)
  } finally {
    loading.value = false
  }
}

onMounted(loadContracts)
</script>
