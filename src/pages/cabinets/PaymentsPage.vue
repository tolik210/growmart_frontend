<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-sm">Платежи</div>
    <div class="text-grey-5 q-mb-md">/payments</div>

    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12">
        <q-input filled dark v-model="contractId" label="contract_id (uuid)" bg-color="grey-10" color="purple-4"/>
      </div>
    </div>

    <q-btn unelevated color="purple-6" label="Загрузить" no-caps :loading="loading" @click="load" class="q-mb-md"/>

    <q-card class="bg-grey-10 text-white">
      <q-card-section>
        <pre class="pre">{{ data }}</pre>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { apiListPayments } from 'src/services/apiRoutes'

const $q = useQuasar()
const loading = ref(false)
const data = ref({})

const contractId = ref('')

async function load () {
  loading.value = true
  try {
    data.value = await apiListPayments(contractId.value)
  } catch (e) {
    $q.notify({ type: 'negative', message: e?.message || 'Ошибка payments' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.pre {
  white-space: pre-wrap;
  word-break: break-word;
  background: #0b0b0b;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #222;
}
</style>
