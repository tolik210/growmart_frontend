<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="auth-page flex flex-center">
        <div class="auth-container">
          <div class="logo-section text-center q-mb-lg">
            <div class="text-h3 text-weight-bold">
              <span class="text-white">grow</span><span class="kz-badge">kz</span><br>
              <span class="text-purple-accent">mart</span>
            </div>
          </div>

          <div class="toggle-container q-mb-lg">
            <div class="toggle-btn" :class="{ active: mode === 'login' }" @click="mode = 'login'">Вход</div>
            <div class="toggle-btn" :class="{ active: mode === 'register' }" @click="mode = 'register'">Регистрация</div>
          </div>

          <q-form @submit.prevent="onSubmit" class="q-gutter-y-md">
            <q-input
              v-model="form.iin"
              dark
              filled
              label="ИИН / БИН"
              mask="############"
              :rules="[val => !!val || 'Введите ИИН/БИН', val => val.length === 12 || 'Должно быть 12 цифр']"
              class="custom-input"
            >
              <template v-slot:prepend><q-icon name="badge" color="purple-4" /></template>
            </q-input>

            <q-input v-model="form.password" dark filled label="Пароль" type="password" class="custom-input">
              <template v-slot:prepend><q-icon name="lock" color="purple-4" /></template>
            </q-input>

            <template v-if="mode === 'register'">
              <q-select v-model="form.role" :options="roleOptions" dark filled label="Роль" emit-value map-options class="custom-input" />
              <q-input v-model="form.phone" dark filled label="Телефон" mask="+7 (###) ###-##-##" class="custom-input" />
              <q-input v-model="form.name" dark filled label="Организация / ФИО" class="custom-input" />
            </template>

            <q-btn
              :label="mode === 'login' ? 'Войти' : 'Создать аккаунт'"
              type="submit"
              color="primary"
              class="full-width submit-btn q-mt-md"
              :loading="loading"
            />
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/services/api'

const $q = useQuasar()
const router = useRouter()
const mode = ref('login')
const loading = ref(false)

const form = ref({
  iin: '',
  password: '',
  role: 'farmer',
  phone: '',
  name: ''
})

const roleOptions = [
  { value: 'farmer', label: 'Farmer (Продавец)' },
  { value: 'buyer_b2b', label: 'Buyer B2B (Юр. лицо)' },
  { value: 'buyer_c2b', label: 'Buyer C2B (Физ. лицо)' }
]

const generateUUID = () => {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const onSubmit = async () => {
  loading.value = true
  const url = mode.value === 'login' ? '/auth/login' : '/auth/register'

  try {
    let payload = {
      iin_bin: form.value.iin,
      password: form.value.password
    }

    if (mode.value === 'register') {
      payload = {
        ...payload,
        id: generateUUID(),
        role: form.value.role,
        phone: form.value.phone.replace(/\D/g, ''),
        name: form.value.name || '',
        city: '',
        region: '',
        salt: ''
      }
    }

    const res = await api.post(url, payload)

    // 1. Сохраняем токен
    localStorage.setItem('token', res.data.access_token)

    // 2. Сохраняем роль (унифицируем ключи: role и user_role)
    const userRole = res.data.role || form.value.role || 'farmer'
    localStorage.setItem('role', userRole)
    localStorage.setItem('user_role', userRole)

    // 3. СОХРАНЯЕМ ИМЯ (Берем из ответа бэкенда)
    const userName = res.data.name || form.value.name || 'Пользователь'
    localStorage.setItem('name', userName)
    localStorage.setItem('uid', res.data.id || '')

    $q.notify({ type: 'positive', message: `Привет, ${userName}!` })

    if (userRole === 'farmer' || userRole === 'seller') {
      router.push('/seller')
    } else if (userRole.includes('buyer')) {
      router.push('/buyer')
    } else if (userRole === 'admin') {
      router.push('/admin')
    } else {
      router.push('/')
    }

  } catch (err) {
    console.error('Ошибка auth:', err.response?.data)
    const errorMsg = err.response?.status === 401 ? 'Неверный ИИН или пароль' : (err.response?.data?.error || 'Ошибка доступа')
    $q.notify({ type: 'negative', message: errorMsg })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page { background-color: #050505; min-height: 100vh; }
.auth-container { width: 100%; max-width: 400px; padding: 20px; }
.text-purple-accent { color: #7b61ff; }
.kz-badge { font-size: 12px; border: 1px solid white; border-radius: 50%; padding: 2px 4px; vertical-align: super; margin-left: 2px; }
.toggle-container { background: #1c1c1e; border-radius: 16px; padding: 4px; display: flex; }
.toggle-btn { flex: 1; text-align: center; padding: 10px; cursor: pointer; color: #666; border-radius: 12px; transition: 0.3s; }
.toggle-btn.active { background: #7b61ff; color: white; font-weight: bold; }
.custom-input { margin-bottom: 8px; }
.submit-btn { border-radius: 16px; height: 54px; background: #7b61ff !important; font-size: 16px; font-weight: 600; }
</style>
