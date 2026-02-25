<template>
  <q-page class="product-page q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.back()" />
      <h4 class="text-white q-my-none text-weight-bold">Детали товара</h4>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner color="blue-5" size="3em" />
    </div>

    <div v-else-if="product" class="row q-col-gutter-xl">
      
      <div class="col-12 col-md-6">
        <q-card class="image-card" flat bordered>
          <img v-if="product.image" :src="'https://v1.growmart.ltd' + product.image" class="full-width-img" />
          <div v-else class="flex flex-center bg-dark-header full-height-placeholder">
            <q-icon name="image_not_supported" size="6em" color="grey-8" />
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <h3 class="text-white text-weight-bold q-mt-none q-mb-sm">{{ product.title || product.crop_name }}</h3>
        <div class="text-grey-5 text-h6 q-mb-lg">
          <q-icon name="place" color="blue-5" /> {{ product.address || 'Точный адрес не указан' }}
        </div>

        <q-card class="price-card q-pa-lg q-mb-lg" flat bordered>
          <div class="row justify-between items-center">
            <div>
              <div class="text-grey-5 text-subtitle1">Стоимость:</div>
              <div class="text-h3 text-white text-weight-bold text-blue-4">
                {{ product.price ? product.price.toLocaleString() + ' ₸' : 'Договорная' }}
                <span class="text-h5 text-grey-5"> / {{ product.price_unit === 'ton' ? 'тонну' : 'кг' }}</span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-grey-5 text-subtitle1">В наличии:</div>
              <div class="text-h5 text-white">{{ product.available || 0 }} {{ product.unit === 'ton' ? 'т' : 'кг' }}</div>
            </div>
          </div>
          
          <q-separator dark class="q-my-md" />
          
          <div class="row items-center q-gutter-x-md q-mb-md">
            <div class="text-white text-subtitle1">Укажите объем:</div>
            <q-input v-model.number="orderQuantity" type="number" dark borderless dense class="custom-field" style="width: 150px" :rules="[val => val <= product.available || 'Превышает остаток']" />
            <div class="text-white text-subtitle1">{{ product.unit === 'ton' ? 'тонн' : 'кг' }}</div>
          </div>

          <q-btn color="blue-6" size="lg" class="full-width text-weight-bold" icon="shopping_cart" label="Добавить в корзину" @click="addToCart" />
        </q-card>

        <q-card class="info-card q-mb-lg" flat bordered>
          <q-card-section>
            <div class="text-h6 text-white text-weight-bold q-mb-md">Характеристики и происхождение</div>
            <div class="row q-col-gutter-y-sm text-white">
              <div class="col-6 text-grey-5">Кадастровый номер:</div><div class="col-6">{{ product.cadastral_number || 'Не указан' }}</div>
              <div class="col-6 text-grey-5">Точный адрес поля:</div><div class="col-6">{{ product.address || 'Не указан' }}</div>
              <div class="col-6 text-grey-5">Описание:</div><div class="col-6">{{ product.description || 'Нет описания' }}</div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="seller-card" flat bordered>
          <q-card-section class="row items-center">
            <q-avatar size="60px" color="blue-9" text-color="white" class="q-mr-md text-weight-bold text-h5">
              {{ product.seller_name ? product.seller_name.charAt(0).toUpperCase() : 'U' }}
            </q-avatar>
            <div>
              <div class="text-grey-5 text-caption">Продавец (Производитель)</div>
              <div v-if="product.seller_reviews_count > 0" class="row items-center q-my-xs">
                <q-icon name="star" color="amber" size="sm" class="q-mr-xs"/>
                <span class="text-white text-weight-bold">{{ product.seller_rating.toFixed(1) }}</span>
                <span class="text-grey-5 q-ml-xs">({{ product.seller_reviews_count }} отзывов)</span>
              </div>
              <div v-else class="text-grey-6 text-caption q-my-xs">Новый продавец (нет отзывов)</div>

              <div class="text-white text-h6 text-weight-bold">{{ product.seller_company || product.seller_name }}</div>
              <div class="text-blue-3"><q-icon name="phone" /> {{ product.seller_phone }}</div>
            </div>
          </q-card-section>
        </q-card>

      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const loading = ref(true)
const product = ref(null)
const orderQuantity = ref(1)

const fetchProduct = async () => {
  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'Товар не найден', position: 'top' })
    router.push('/catalog')
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (orderQuantity.value <= 0 || orderQuantity.value > product.value.available) {
    $q.notify({ type: 'warning', message: 'Некорректный объем!', position: 'top' })
    return
  }

  // Берем корзину из LocalStorage
  let cart = JSON.parse(localStorage.getItem('growmart_cart') || '[]')
  
  // Добавляем текущий товар с выбранным объемом
  const item = { ...product.value, order_quantity: orderQuantity.value }
  cart.push(item)
  
  localStorage.setItem('growmart_cart', JSON.stringify(cart))
  
  $q.notify({ type: 'positive', message: 'Товар добавлен в корзину!', icon: 'shopping_cart', position: 'top' })
  router.push('/cart')
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.product-page { background-color: #050505; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }

.image-card { background-color: #111112; border-color: #222; border-radius: 16px; overflow: hidden; height: 100%; display: flex; align-items: center; justify-content: center; }
.full-width-img { width: 100%; height: auto; max-height: 600px; object-fit: cover; }
.full-height-placeholder { width: 100%; min-height: 400px; }

.price-card { background-color: #0a0a0c; border-color: #1e3a8a; border-radius: 16px; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.05); }
.info-card { background-color: #111112; border-color: #222; border-radius: 16px; }
.seller-card { background-color: #111112; border-color: #222; border-radius: 16px; }

:deep(.custom-field .q-field__control) { background-color: #1a1a1c !important; border-radius: 8px !important; border: 1px solid #333; }
:deep(.custom-field.q-field--focused .q-field__control) { border-color: #3b82f6; }
</style>
