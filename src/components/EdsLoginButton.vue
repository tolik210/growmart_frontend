<template>
  <div class="eds-wrapper">
    <button @click.prevent="loginWithEDS" :disabled="isLoading" class="eds-btn">
      {{ isLoading ? 'Подключение к NCALayer...' : 'Войти с помощью ЭЦП' }}
    </button>
    <p v-if="errorMessage" class="eds-error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { signWithNCALayer } from '@/services/ncalayer'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref('')

const loginWithEDS = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // Уникальная строка для защиты от replay-атак
    const payload = `growmart_login_${Date.now()}`
    
    // Вызываем NCALayer
    const cmsBase64 = await signWithNCALayer(payload)
    
    // Отправляем на наш C++ бэкенд
    const res = await api.post('/auth/eds/login', {
      payload: payload,
      cms_base64: cmsBase64
    })
    
    if (res.data.success) {
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
      }
      alert(res.data.message || 'Успешный вход!')
      // Перекидываем в кабинет
      router.push('/seller') 
    } else {
      errorMessage.value = res.data.error || 'Ошибка авторизации'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Произошла неизвестная ошибка'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.eds-wrapper {
  margin-top: 15px;
  text-align: center;
}
.eds-btn {
  width: 100%;
  padding: 12px;
  background-color: #005b9f;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.eds-btn:hover:not(:disabled) {
  background-color: #00457a;
}
.eds-btn:disabled {
  background-color: #a0c4df;
  cursor: not-allowed;
}
.eds-error {
  color: #d32f2f;
  margin-top: 10px;
  font-size: 14px;
}
</style>
