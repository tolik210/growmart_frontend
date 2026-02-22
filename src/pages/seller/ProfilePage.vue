<template>
  <div class="q-pa-lg text-white" style="background: #050505; min-height: 100vh;">
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" @click="$router.push('/seller')" color="green-4" class="q-mr-md" />
        <div class="text-h4 text-weight-bold">🏢 Профиль @{{ roleLabel }}</div>
      </div>
    </div>

    <q-card style="background: #111; border-radius: 20px; border: 1px solid #222;" class="q-pa-lg">
      <q-form @submit="saveProfile" class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <div class="input-label text-green-4">БИН / ИИН (eGov)</div>
            <q-input v-model="form.bin_iin" mask="############" borderless class="custom-input" placeholder="Введите 12 цифр">
              <template v-slot:append>
                <q-btn flat round color="orange-4" icon="verified_user" @click="verifyWithEcp">
                  <q-tooltip>Проверить через ЭЦП</q-tooltip>
                </q-btn>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-8">
            <div class="input-label">Название организации</div>
            <q-input v-model="form.org_name" borderless class="custom-input" placeholder="ТОО ..." />
          </div>
        </div>
        <q-btn label="Сохранить всё" type="submit" color="green-7" class="full-width q-mt-md" unelevated />
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const $q = useQuasar()
const roleLabel = computed(() => localStorage.getItem('role') === 'seller' ? 'фермер' : 'покупатель')
const form = reactive({ bin_iin: '', org_name: '' })

async function verifyWithEcp() {
  $q.notify({ message: 'Ожидание NCALayer...', color: 'orange' })
  // Здесь будет вызов NCALayer. Пока имитируем для теста связи
  try {
    const res = await api.get(`/api/integrations/egov/lookup/${form.bin_iin}`)
    form.org_name = res.data.name
    $q.notify({ type: 'positive', message: 'Данные подтянуты' })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка связи с API' })
  }
}

async function saveProfile() {
  await api.post('/api/company', form)
  $q.notify({ type: 'positive', message: 'Профиль сохранен' })
}

onMounted(async () => {
  const res = await api.get('/api/company')
  if (res.data) Object.assign(form, res.data)
})
</script>

<style scoped>
.input-label { font-size: 12px; font-weight: bold; margin-bottom: 4px; }
.custom-input { background: #1c1c1e; border-radius: 12px; padding: 0 16px; border: 1px solid #333; }
:deep(.q-field__native) { color: white !important; }
</style>
