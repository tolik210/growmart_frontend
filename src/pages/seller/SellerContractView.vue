<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Подписание договора</div>
    <q-card v-if="contract" flat bordered>
      <q-card-section>
        <div class="text-h6">Контракт №{{ contract.id.split('-')[0] }}</div>
        <div class="text-subtitle1">Сумма: {{ contract.total_amount }} {{ contract.currency }}</div>
        <div class="text-caption text-grey">Статус: {{ contract.status }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn 
          color="primary" 
          label="Подписать через ЭЦП" 
          icon="vpn_key" 
          :loading="signing"
          @click="handleSign" 
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import api from 'src/services/api'
import { signData } from 'src/services/ncalayer'

const route = useRoute()
const $q = useQuasar()
const contract = ref(null)
const signing = ref(false)

const loadContract = async () => {
  try {
    const res = await api.get(`/contracts/${route.params.id}`)
    contract.value = res.data
  } catch (e) { $q.notify({ color: 'negative', message: 'Ошибка загрузки' }) }
}

const handleSign = async () => {
  signing.value = true
  try {
    // 1. Получаем данные для подписи
    const { data } = await api.get(`/contracts/${route.params.id}/signing-payload`)
    
    // 2. Вызываем реальный NCALayer (выскочит окно выбора ключа)
    const realSignature = await signData(data.data_to_sign)
    
    // 3. Отправляем реальную подпись на бэкенд
    await api.post(`/contracts/${route.params.id}/sign`, { signature: realSignature })
    
    $q.notify({ color: 'positive', message: 'Договор успешно подписан!' })
    loadContract()
  } catch (err) {
    $q.notify({ color: 'negative', message: err.toString() })
  } finally {
    signing.value = false
  }
}

onMounted(loadContract)
</script>
