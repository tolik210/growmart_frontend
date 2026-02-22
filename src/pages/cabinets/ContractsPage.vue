<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-sm">Контракты</div>
    <div class="text-grey-5 q-mb-md">/contracts</div>

    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-6">
        <q-select filled dark v-model="roleParam" :options="roleOptions" label="role param" bg-color="grey-10" color="purple-4"/>
      </div>
      <div class="col-6">
        <q-input filled dark v-model="status" label="status (draft/sent/active...)" bg-color="grey-10" color="purple-4"/>
      </div>
    </div>

    <q-btn unelevated color="purple-6" label="Загрузить" no-caps :loading="loading" @click="load" class="q-mb-md"/>

    <q-card class="bg-grey-10 text-white">
      <q-card-section>
        <q-table
          :rows="rows"
          :columns="cols"
          row-key="id"
          dense
          flat
          dark
          :loading="loading"
          no-data-label="Пусто"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                dense flat no-caps
                color="purple-4"
                label="Открыть"
                @click="$router.push('/cabinet/contracts/' + props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { apiListContracts } from 'src/services/apiRoutes'

const $q = useQuasar()
const loading = ref(false)
const rows = ref([])

const roleOptions = ['buyer', 'seller']
const roleParam = ref('buyer')
const status = ref('')

const cols = [
  { name:'id', label:'ID', field:'id', align:'left' },
  { name:'product_id', label:'Product', field:'product_id', align:'left' },
  { name:'qty', label:'Qty', field:'qty', align:'right' },
  { name:'status', label:'Status', field:'status', align:'left' },
  { name:'docs_count', label:'Docs', field:'docs_count', align:'right' },
  { name:'created_at', label:'Created', field:'created_at', align:'left' },
  { name:'actions', label:'', field:'actions', align:'right' }
]

async function load () {
  loading.value = true
  try {
    const data = await apiListContracts(roleParam.value, status.value)
    rows.value = data?.items || []
  } catch (e) {
    $q.notify({ type: 'negative', message: e?.message || 'Ошибка contracts' })
  } finally {
    loading.value = false
  }
}

load()
</script>
