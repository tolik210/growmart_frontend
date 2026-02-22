<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h6 text-weight-bold">Contract details</div>
        <div class="text-grey-5">{{ id }}</div>
      </div>
      <q-btn flat color="grey-5" no-caps label="Назад" @click="$router.back()" />
    </div>

    <q-card class="bg-grey-10 text-white q-mb-md">
      <q-card-section class="row items-center">
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">Контракт</div>
          <div class="text-caption text-grey-5">status: {{ data?.contract?.status }}</div>
        </div>
        <div class="row q-gutter-sm">
          <q-btn unelevated color="purple-6" no-caps label="Send" :loading="actLoading" @click="onSend" />
          <q-btn unelevated color="green-6" no-caps label="Sign" :loading="actLoading" @click="onSign" />
          <q-btn outline color="grey-5" no-caps label="Refresh" :loading="loading" @click="load" />
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-5">Buyer</div>
            <div class="text-body2">{{ data?.contract?.buyer_id }}</div>
            <div class="text-caption text-grey-5 q-mt-sm">Seller</div>
            <div class="text-body2">{{ data?.contract?.seller_id }}</div>
          </div>

          <div class="col-12 col-md-6">
            <div class="text-caption text-grey-5">Product</div>
            <div class="text-body2">
              {{ data?.product?.title || '-' }} ({{ data?.product?.crop_name || '-' }})
            </div>

            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-4">
                <div class="text-caption text-grey-5">Qty</div>
                <div class="text-body2">{{ data?.contract?.qty }} {{ data?.product?.unit }}</div>
              </div>
              <div class="col-4">
                <div class="text-caption text-grey-5">Price</div>
                <div class="text-body2">{{ fmt(data?.product?.price) }}</div>
              </div>
              <div class="col-4">
                <div class="text-caption text-grey-5">Total</div>
                <div class="text-body2 text-weight-bold">
                  {{ fmt(total) }}
                </div>
              </div>
            </div>

            <div class="text-caption text-grey-6 q-mt-sm">
              (Total = qty × price, пока без currency — сделаем позже)
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card class="bg-grey-10 text-white">
      <q-card-section class="row items-center">
        <div class="col">
          <div class="text-subtitle1 text-weight-bold">Документы</div>
          <div class="text-caption text-grey-5">create/send/sign/reject</div>
        </div>

        <q-btn-dropdown color="purple-6" no-caps label="Создать документ" :disable="docLoading">
          <q-list dark class="bg-grey-10">
            <q-item clickable v-close-popup @click="createDoc('invoice')"><q-item-section>Invoice</q-item-section></q-item>
            <q-item clickable v-close-popup @click="createDoc('act')"><q-item-section>Act</q-item-section></q-item>
            <q-item clickable v-close-popup @click="createDoc('closing')"><q-item-section>Closing</q-item-section></q-item>
          </q-list>
        </q-btn-dropdown>
      </q-card-section>

      <q-separator dark />

      <q-card-section>
        <q-table
          :rows="docs"
          :columns="docCols"
          row-key="id"
          dense
          flat
          dark
          :loading="docLoading"
          no-data-label="Документов нет"
        >
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row q-gutter-xs justify-end">
                <q-btn dense flat color="purple-4" no-caps label="Send" @click="sendDoc(props.row)" />
                <q-btn dense flat color="green-5" no-caps label="Sign" @click="signDoc(props.row)" />
                <q-btn dense flat color="red-5" no-caps label="Reject" @click="rejectDoc(props.row)" />
                <q-btn
                  v-if="props.row.file_url"
                  dense flat
                  color="grey-4"
                  no-caps
                  label="Download"
                  @click="downloadUrl(props.row)"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import {
  apiGetContract,
  apiSendContract,
  apiSignContract,
  apiCreateDoc,
  apiSendDoc,
  apiSignDoc,
  apiRejectDoc
} from 'src/services/apiRoutes'

const $q = useQuasar()
const route = useRoute()
const id = route.params.id

const loading = ref(false)
const actLoading = ref(false)
const docLoading = ref(false)

const data = ref(null)

const docs = computed(() => data.value?.documents || [])

const total = computed(() => {
  const q = Number(data.value?.contract?.qty || 0)
  const p = Number(data.value?.product?.price || 0)
  return q * p
})

const docCols = [
  { name:'id', label:'ID', field:'id', align:'left' },
  { name:'doc_type', label:'Type', field:'doc_type', align:'left' },
  { name:'status', label:'Status', field:'status', align:'left' },
  { name:'file_name', label:'File', field:'file_name', align:'left' },
  { name:'uploaded_at', label:'Uploaded', field:'uploaded_at', align:'left' },
  { name:'actions', label:'', field:'actions', align:'right' }
]

function fmt(v){
  if (v === null || v === undefined) return '-'
  const n = Number(v)
  if (Number.isNaN(n)) return String(v)
  return n.toLocaleString('ru-RU')
}

async function load(){
  loading.value = true
  docLoading.value = true
  try {
    data.value = await apiGetContract(id)
  } catch (e) {
    $q.notify({ type:'negative', message: e?.message || 'Ошибка get contract' })
  } finally {
    loading.value = false
    docLoading.value = false
  }
}

async function onSend(){
  actLoading.value = true
  try {
    await apiSendContract(id)
    $q.notify({ type:'positive', message:'Contract sent' })
    await load()
  } catch(e){
    $q.notify({ type:'negative', message: e?.message || 'Send error' })
  } finally {
    actLoading.value = false
  }
}

async function onSign(){
  actLoading.value = true
  try {
    await apiSignContract(id)
    $q.notify({ type:'positive', message:'Contract signed' })
    await load()
  } catch(e){
    $q.notify({ type:'negative', message: e?.message || 'Sign error' })
  } finally {
    actLoading.value = false
  }
}

async function createDoc(type){
  docLoading.value = true
  try {
    await apiCreateDoc(id, type)
    $q.notify({ type:'positive', message:`Doc created: ${type}` })
    await load()
  } catch(e){
    $q.notify({ type:'negative', message: e?.message || 'Create doc error' })
  } finally {
    docLoading.value = false
  }
}

async function sendDoc(row){
  docLoading.value = true
  try {
    await apiSendDoc(id, row.id)
    $q.notify({ type:'positive', message:'Doc sent' })
    await load()
  } catch(e){
    $q.notify({ type:'negative', message: e?.message || 'Send doc error' })
  } finally {
    docLoading.value = false
  }
}
async function signDoc(row){
  docLoading.value = true
  try {
    await apiSignDoc(id, row.id)
    $q.notify({ type:'positive', message:'Doc sign recorded' })
    await load()
  } catch(e){
    $q.notify({ type:'negative', message: e?.message || 'Sign doc error' })
  } finally {
    docLoading.value = false
  }
}
async function rejectDoc(row){
  docLoading.value = true
  try {
    await apiRejectDoc(id, row.id)
    $q.notify({ type:'warning', message:'Doc rejected' })
    await load()
  } catch(e){
    $q.notify({ type:'negative', message: e?.message || 'Reject doc error' })
  } finally {
    docLoading.value = false
  }
}

function downloadUrl(row){
  // backend отдаёт download по /contracts/{cid}/documents/{docid}/download
  const url = (import.meta.env.VITE_API_BASE || '/api') + `/contracts/${id}/documents/${row.id}/download`
  window.open(url, '_blank')
}

load()
</script>
