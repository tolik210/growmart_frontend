<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="product-page q-pa-lg">
        <div class="row items-center justify-between q-mb-lg">
          <div class="row items-center">
            <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/')" />
            <h5 class="text-white q-my-none text-weight-bold">Детали товара</h5>
          </div>
          <q-btn flat color="white" icon="shopping_cart" label="Перейти в корзину" @click="$router.push('/cart')" />
        </div>

        <div v-if="loading" class="flex flex-center q-pa-xl">
          <q-spinner color="red-5" size="3em" />
        </div>

        <div v-else-if="product" class="row q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <q-card class="transparent-card" flat bordered>
              <q-img :src="product.image ? ('https://v1.growmart.ltd/uploads/' + product.image.split('/').pop()) : '/no-image.png'" class="product-image" fit="cover" />
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-badge color="red-5" text-color="white" class="q-pa-sm text-subtitle2 q-mb-md" :label="product.crop_name || 'Свежий урожай'" />
            <h3 class="text-white text-weight-bold q-mt-none q-mb-sm">{{ product.title }}</h3>
            <div class="text-h4 text-white text-weight-bold q-mb-md">{{ product.price }} ₸ <span class="text-h6 text-grey-5">/ {{ product.unit === 'ton' ? 'т' : 'кг' }}</span></div>
            
            <div class="stock-box q-pa-md q-mb-lg">
              <div class="text-grey-5">В наличии:</div>
              <div class="text-white text-h6">{{ product.stock }} {{ product.unit === 'ton' ? 'т' : 'кг' }}</div>
            </div>

            <div class="q-my-md text-grey-4 text-body1">
              {{ product.description || 'Фермер не добавил подробного описания к этому товару.' }}
            </div>

            <q-separator dark class="q-my-lg" />

            <h6 class="text-white q-my-md text-weight-bold">Характеристики и локация</h6>
            <div class="row q-col-gutter-sm text-body2">
              <div class="col-12"><div class="text-grey-5">Регион</div><div class="text-white">{{ product.region }} {{ product.district ? ', ' + product.district : '' }} {{ product.city ? ', ' + product.city : '' }}</div></div>
            </div>

            <q-separator dark class="q-my-lg" />

            <div class="row q-gutter-md q-mt-lg">
              <q-btn size="lg" color="red-5" text-color="white" icon="shopping_cart" label="В корзину" class="col-grow text-weight-bold cart-btn" unelevated @click="addToCart" />
              <q-btn size="lg" color="grey-9" text-color="white" icon="chat" label="Связаться" class="col-grow text-weight-bold" outline />
            </div>
          </div>
        </div>
        
        <div v-else class="text-center text-white q-pa-xl">
          <q-icon name="error_outline" size="4em" color="grey-6" />
          <div class="text-h6 q-mt-md">Товар не найден или снят с продажи</div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const route = useRoute()
const $q = useQuasar()
const loading = ref(true)
const product = ref(null)

const fetchProduct = async () => {
  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data
  } catch (e) {
    console.error('Ошибка загрузки товара:', e)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!product.value) return;
  
  let cart = JSON.parse(localStorage.getItem('growmart_cart') || '[]')
  const existingItem = cart.find(item => item.id === product.value.id)
  
  if (existingItem) {
    $q.notify({ type: 'info', message: 'Этот товар уже есть в вашей корзине', position: 'top' })
  } else {
    // Формируем красивую строку с адресом
    const locationStr = [product.value.region, product.value.district, product.value.city].filter(Boolean).join(', ') || 'Не указано';

    cart.push({
      id: product.value.id,
      title: product.value.title,
      price: product.value.price,
      image: product.value.image,
      unit: product.value.unit,
      owner_id: product.value.owner_id,
      order_quantity: 1,
      location: locationStr // <-- СОХРАНЯЕМ АДРЕС!
    })
    
    localStorage.setItem('growmart_cart', JSON.stringify(cart))
    
    $q.notify({ type: 'positive', message: 'Товар успешно добавлен в корзину!', position: 'top', icon: 'shopping_cart' })
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-page { background-color: #050505; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.transparent-card { background-color: transparent; border-color: #222; border-radius: 16px; overflow: hidden; }
.product-image { width: 100%; max-height: 500px; border-radius: 16px; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }
.stock-box { background-color: #111112; border: 1px solid #222; border-radius: 12px; display: inline-block; min-width: 200px; }
.cart-btn { transition: all 0.3s ease; }
.cart-btn:hover { background-color: #ff5252 !important; box-shadow: 0 4px 15px rgba(241, 70, 53, 0.4); }
</style>
