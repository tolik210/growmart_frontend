<template>
  <q-page class="cart-page q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/')" />
      <h4 class="text-white q-my-none text-weight-bold">Корзина</h4>
    </div>

    <div v-if="cart.length === 0" class="text-center q-pa-xl flex flex-center column">
      <q-icon name="remove_shopping_cart" size="6em" color="grey-8" />
      <h5 class="text-grey-5 q-mt-md">Ваша корзина пуста</h5>
      <q-btn class="q-mt-lg" color="blue-6" label="Перейти в каталог" @click="$router.push('/catalog')" />
    </div>

    <div v-else class="row q-col-gutter-xl">
      <div class="col-12 col-md-8">
        <div class="text-h6 text-white text-weight-bold q-mb-md">Товары к оформлению</div>
        
        <q-card class="cart-item-card q-mb-md" flat bordered v-for="(item, index) in cart" :key="index">
          <q-card-section class="row items-center no-wrap">
            <q-avatar rounded size="80px" class="q-mr-md bg-dark-header">
              <img v-if="item.image" :src="'https://v1.growmart.ltd' + item.image" style="object-fit: cover;" />
              <q-icon v-else name="image" color="grey-6" size="2em" />
            </q-avatar>
            
            <div class="col">
              <div class="text-white text-h6 text-weight-bold">{{ item.title || item.crop_name }}</div>
              <div class="text-grey-5 text-caption q-mb-xs">Продавец: {{ item.seller_company || item.seller_name || 'Не указан' }}</div>
              <div class="text-blue-4 text-subtitle2">{{ item.price ? item.price.toLocaleString() + ' ₸' : 'Договорная' }} / {{ item.price_unit === 'ton' ? 'т' : 'кг' }}</div>
            </div>

            <div class="col-auto text-right q-mr-md">
              <div class="text-grey-5 text-caption">Объем:</div>
              <div class="text-white text-h6 text-weight-bold">{{ item.order_quantity }} {{ item.unit === 'ton' ? 'т' : 'кг' }}</div>
            </div>

            <div class="col-auto text-right q-mr-md" style="min-width: 120px;">
              <div class="text-grey-5 text-caption">Сумма:</div>
              <div class="text-white text-h6 text-weight-bold">{{ (item.price * item.order_quantity).toLocaleString() }} ₸</div>
            </div>

            <div class="col-auto">
              <q-btn flat round color="red-5" icon="delete" @click="removeItem(index)">
                <q-tooltip class="bg-dark text-white">Удалить из корзины</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="checkout-card" flat bordered>
          <q-card-section class="q-pa-lg">
            <div class="text-h6 text-white text-weight-bold q-mb-lg">Детали заказа</div>
            
            <div class="row justify-between q-mb-sm text-grey-5">
              <span>Всего товаров:</span>
              <span class="text-white">{{ cart.length }} шт.</span>
            </div>
            <div class="row justify-between q-mb-md text-grey-5">
              <span>Общий вес:</span>
              <span class="text-white">{{ totalWeight }}</span>
            </div>
            
            <q-separator dark class="q-my-md" />
            
            <div class="row justify-between items-end q-mb-xl">
              <span class="text-h6 text-white">Итого к оплате:</span>
              <span class="text-h4 text-blue-4 text-weight-bold">{{ totalPrice.toLocaleString() }} ₸</span>
            </div>

            <q-btn color="blue-6" size="lg" class="full-width text-weight-bold" label="Оформить заказ" icon="check_circle" @click="checkout" :loading="loading" />
            <div class="text-center text-grey-6 text-caption q-mt-md">
              <q-icon name="security" /> Безопасная сделка с подписанием ЭЦП
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const router = useRouter()
const $q = useQuasar()
const cart = ref([])
const loading = ref(false)

const loadCart = () => {
  cart.value = JSON.parse(localStorage.getItem('growmart_cart') || '[]')
}

const removeItem = (index) => {
  cart.value.splice(index, 1)
  localStorage.setItem('growmart_cart', JSON.stringify(cart.value))
  $q.notify({ type: 'info', message: 'Товар удален из корзины', position: 'top' })
}

const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.order_quantity), 0)
})

const totalWeight = computed(() => {
  let tons = 0
  let kg = 0
  cart.value.forEach(item => {
    if (item.unit === 'ton') tons += item.order_quantity
    else kg += item.order_quantity
  })
  if (tons > 0 && kg > 0) return `${tons} т и ${kg} кг`
  if (tons > 0) return `${tons} т`
  return `${kg} кг`
})

const checkout = async () => {
  // Проверяем авторизацию
  if (!localStorage.getItem('token')) {
    $q.notify({ type: 'warning', message: 'Для оформления заказа необходимо войти в систему', position: 'top' })
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const payload = {
      total: totalPrice.value,
      items: cart.value
    }

    await api.post('/orders', payload)
    
    // Очищаем корзину после успешного заказа
    localStorage.removeItem('growmart_cart')
    cart.value = []
    
    $q.notify({ 
      type: 'positive', 
      message: 'Заказ успешно создан! Товар забронирован.', 
      icon: 'verified', 
      position: 'top',
      timeout: 3000
    })
    
    // Перекидываем в кабинет покупателя, чтобы он подписал договор
    router.push('/buyer/orders')
  } catch (e) {
    const errorMsg = e.response?.data?.error || 'Ошибка при оформлении заказа'
    $q.notify({ type: 'negative', message: errorMsg, position: 'top', timeout: 5000 })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCart()
})
</script>

<style scoped>
.cart-page { background-color: #050505; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.bg-dark-header { background-color: #161618; }

.cart-item-card { background-color: #111112; border-color: #222; border-radius: 12px; transition: border-color 0.2s; }
.cart-item-card:hover { border-color: #3b82f6; }

.checkout-card { background-color: #0a0a0c; border-color: #1e3a8a; border-radius: 16px; position: sticky; top: 20px; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.05); }

@media (max-width: 768px) {
  .checkout-card { position: static; margin-top: 24px; }
  .cart-item-card .row { flex-direction: column; align-items: flex-start; }
  .cart-item-card .q-avatar { margin-bottom: 16px; }
  .cart-item-card .text-right { text-align: left !important; margin-top: 8px; }
}
</style>
