<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="cart-page q-pa-lg">
        <div class="row items-center q-mb-xl">
          <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/')" />
          <h4 class="text-white q-my-none text-weight-bold">Моя корзина</h4>
        </div>

        <div v-if="cart.length === 0" class="text-center q-pa-xl">
          <q-icon name="remove_shopping_cart" size="6em" color="grey-8" />
          <h5 class="text-grey-5 q-mt-md">Ваша корзина пуста</h5>
          <q-btn class="q-mt-lg" color="red-5" label="Вернуться к покупкам" @click="$router.push('/')" />
        </div>

        <div v-else class="row q-col-gutter-xl">
          <div class="col-12 col-md-7">
            <q-card v-for="(item, index) in cart" :key="item.id" class="cart-item-card q-mb-md" flat bordered>
              <q-card-section class="row items-center no-wrap">
                <q-avatar rounded size="80px" class="q-mr-md bg-grey-9">
                  <img v-if="item.image" :src="'https://v1.growmart.ltd/uploads/' + item.image.split('/').pop()" />
                  <q-icon v-else name="image" color="grey-6" />
                </q-avatar>
                <div class="col">
                  <div class="text-h6 text-white">{{ item.title }}</div>
                  <div class="text-red-4 text-weight-bold">{{ item.price }} ₸ / {{ item.unit === 'ton' ? 'т' : 'кг' }}</div>
                </div>
                <div class="col-auto row items-center q-gutter-x-md">
                  <div class="quantity-control row items-center no-wrap">
                    <q-btn round dense flat color="white" icon="remove" @click="updateQty(index, -1)" />
                    <div class="text-white q-px-md text-weight-bold">{{ item.order_quantity }}</div>
                    <q-btn round dense flat color="white" icon="add" @click="updateQty(index, 1)" />
                  </div>
                  <q-btn flat round color="grey-6" icon="delete" @click="removeItem(index)" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-5">
            <q-card class="checkout-card" flat bordered>
              <q-card-section>
                <h5 class="text-white q-mt-none q-mb-lg text-weight-bold">Сумма заказа</h5>
                <div class="text-grey-4 text-weight-bold q-mb-md text-subtitle1">Товары:</div>
                <div v-for="(item, index) in cart" :key="'summary-' + item.id" class="q-mb-lg q-pl-md" style="border-left: 2px solid #333;">
                  <div class="text-white text-subtitle1 text-weight-bold">{{ index + 1 }}. {{ item.title }}</div>
                  <div class="text-grey-5 q-mt-xs">Цена: <span class="text-white">{{ item.price }} ₸</span></div>
                  <div class="text-grey-5">Количество: <span class="text-white">{{ item.order_quantity }} {{ item.unit === 'ton' ? 'т' : 'кг' }}</span></div>
                  <div class="text-grey-5">Локация: <span class="text-white">{{ item.location || 'Не указано' }}</span></div>
                </div>
                <div class="row justify-between q-mb-md text-grey-4 q-mt-xl text-subtitle1">
                  <span>Доставка:</span><span class="text-white">Рассчитывается</span>
                </div>
                <q-separator dark class="q-my-md" />
                <div class="row justify-between items-center q-mb-lg">
                  <span class="text-white text-h5 text-weight-bold">Итого:</span>
                  <span class="text-red-5 text-h4 text-weight-bold">{{ totalSum }} ₸</span>
                </div>
                <q-btn :loading="loading" class="full-width text-weight-bold checkout-btn" color="red-5" size="lg" label="Оформить заказ" @click="checkout" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import api from 'src/services/api'

const $q = useQuasar()
const router = useRouter()
const cart = ref([])
const loading = ref(false)

onMounted(() => {
  cart.value = JSON.parse(localStorage.getItem('growmart_cart') || '[]')
})

const updateQty = (index, change) => {
  const newQty = cart.value[index].order_quantity + change
  if (newQty > 0) {
    cart.value[index].order_quantity = newQty
    saveCart()
  }
}

const removeItem = (index) => {
  cart.value.splice(index, 1)
  saveCart()
}

const saveCart = () => {
  localStorage.setItem('growmart_cart', JSON.stringify(cart.value))
}

const totalSum = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.order_quantity), 0)
})

const checkout = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    $q.notify({ type: 'warning', message: 'Для оформления заказа необходимо войти в систему', position: 'top' })
    router.push('/login')
    return
  }

  loading.value = true
  try {
    await api.post('/orders', {
      items: cart.value,
      total: totalSum.value
    })
    
    cart.value = []
    localStorage.removeItem('growmart_cart')
    
    $q.notify({
      type: 'positive',
      message: 'Заказ успешно оформлен! Продавец скоро свяжется с вами.',
      icon: 'check_circle',
      position: 'center',
      timeout: 4000
    })
    router.push('/buyer')
  } catch (e) {
    // ВОТ ЗДЕСЬ МЫ ЛОВИМ ТОЧНЫЙ ТЕКСТ ОШИБКИ И ПОКАЗЫВАЕМ ЕГО ТЕБЕ
    const errorData = e.response?.data
    let errorMsg = 'Ошибка на сервере'
    if (errorData) {
      if (typeof errorData === 'string') errorMsg = errorData
      else if (errorData.error) errorMsg = errorData.error
    }
    console.error('SERVER RESPONDED:', errorData)
    $q.notify({ type: 'negative', message: `Сбой: ${errorMsg}`, position: 'top', timeout: 8000 })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.cart-page { background-color: #050505; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.cart-item-card { background-color: #111112; border-color: #222; border-radius: 12px; }
.checkout-card { background-color: #111112; border-color: #222; border-radius: 16px; position: sticky; top: 20px; }
.quantity-control { background-color: #1a1a1c; border: 1px solid #333; border-radius: 8px; padding: 2px; }
.checkout-btn { transition: all 0.3s ease; }
.checkout-btn:hover { background-color: #ff5252 !important; box-shadow: 0 4px 15px rgba(241, 70, 53, 0.4); }
</style>
