<template>
  <q-page class="profile-page q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.back()" />
      <h4 class="text-white q-my-none text-weight-bold">Мой профиль</h4>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="blue-5" size="3em" />
    </div>

    <div v-else class="row justify-center">
      <div class="col-12 col-md-6">
        <q-card class="profile-card" flat bordered>
          <q-card-section class="column items-center q-pt-xl q-pb-md">
            <q-avatar size="100px" color="blue-9" text-color="white" class="q-mb-md text-h3 text-weight-bold">
              {{ profile.name ? profile.name.charAt(0).toUpperCase() : 'U' }}
            </q-avatar>
            <div class="text-h6 text-white">{{ profile.email }}</div>
            <q-badge color="blue-6" class="q-mt-sm q-px-sm q-py-xs text-weight-bold">
              Роль: {{ profile.role === 'seller' || profile.role === 'farmer' ? 'Продавец (Фермер)' : 'Покупатель' }}
            </q-badge>
          </q-card-section>

          <q-separator dark inset />

          <q-card-section class="q-pa-lg">
            <div class="field-label">Ваше Имя / ФИО</div>
            <q-input v-model="profile.name" dark borderless dense class="custom-field q-mb-md" placeholder="Иван Иванов" />

            <div class="field-label">Номер телефона</div>
            <q-input v-model="profile.phone" dark borderless dense class="custom-field q-mb-md" placeholder="+7 (700) 000-00-00" mask="+7 (###) ###-##-##" unmasked-value />

            <div class="field-label">Название Компании / КХ (необязательно)</div>
            <q-input v-model="profile.company_name" dark borderless dense class="custom-field q-mb-xl" placeholder="ТОО АгроПром" />

            <q-btn color="blue-6" class="full-width text-weight-bold" size="lg" label="Сохранить изменения" @click="saveProfile" :loading="saving" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const $q = useQuasar()
const loading = ref(true)
const saving = ref(false)
const profile = ref({ name: '', phone: '', company_name: '', email: '', role: '' })

const fetchProfile = async () => {
  try {
    const res = await api.get('/profile')
    profile.value = res.data
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Ошибка загрузки профиля', position: 'top' })
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  saving.value = true
  try {
    await api.post('/profile', {
      name: profile.value.name,
      phone: profile.value.phone,
      company_name: profile.value.company_name
    })
    $q.notify({ type: 'positive', message: 'Профиль успешно обновлен!', position: 'top', icon: 'check_circle' })
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка при сохранении', position: 'top' })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile-page { background-color: #050505; min-height: 100vh; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.profile-card { background-color: #111112; border-color: #222; border-radius: 16px; }
.field-label { font-size: 13px; font-weight: 700; margin-bottom: 6px; color: #aaa; }
:deep(.custom-field .q-field__control) { background-color: #1a1a1c !important; border-radius: 8px !important; border: 1px solid #333; }
:deep(.custom-field.q-field--focused .q-field__control) { border-color: #3b82f6; }
</style>
