<template>
  <div class="q-pa-md min-height-screen" style="background-color: #050505; color: white;">
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-btn flat round color="purple-4" icon="arrow_back" @click="$router.push('/buyer')" class="q-mr-md" />
        <div>
          <div class="text-h4 text-weight-bold text-white">🌾 Каталог продукции</div>
          <div class="text-grey-5">Предложения от фермеров и поставщиков</div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-xl">
      <q-spinner color="purple-4" size="3em" />
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4" v-for="p in products" :key="p.id">
        <q-card class="product-card shadow-24">
          
          <q-img
            :src="p.image || 'https://placehold.co/600x400/1c1c1e/7b61ff?text=Нет+фото'"
            style="height: 200px; border-top-left-radius: 20px; border-top-right-radius: 20px;"
            fit="cover"
          >
            <div class="absolute-bottom-right bg-transparent q-pa-none q-ma-sm">
              <q-badge color="purple-6" class="q-pa-sm text-subtitle2 text-weight-bold shadow-4" style="border-radius: 8px;">
                {{ p.price ? p.price + ' ₸' : 'Договорная' }}
              </q-badge>
            </div>
          </q-img>

          <q-card-section>
            <div class="text-h6 text-green-4 text-weight-bold q-mb-xs">{{ p.title || p.crop_name }}</div>
            <div class="text-caption text-grey-5 q-mb-sm" style="line-height: 1.2;">
              <q-icon name="place" /> {{ p.region || 'Регион не указан' }} 
              <span v-if="p.district">, {{ p.district }}</span>
              <span v-if="p.city">, {{ p.city }}</span>
            </div>
            
            <div v-if="p.description" class="text-caption text-grey-6 ellipsis-2-lines q-mb-sm">
              {{ p.description }}
            </div>

            <div class="row justify-between q-mt-sm">
              <span class="text-grey-5">Культура:</span>
              <span class="text-white">{{ p.crop_name }}</span>
            </div>
            <div class="row justify-between q-mb-xs">
              <span class="text-grey-5">В наличии:</span>
              <span class="text-white text-weight-bold">{{ p.stock }} {{ p.unit || 'kg' }}</span>
            </div>
          </q-card-section>

          <q-card-actions align="stretch" class="q-pa-md">
            <q-btn unelevated color="purple-6" class="full-width text-weight-bold" style="border-radius: 12px; height: 45px;" label="Предложить контракт" @click="openContractModal(p)" />
          </q-card-actions>
        </q-card>
      </div>

      <div v-if="products.length === 0" class="col-12 text-center text-grey-5 q-pa-xl">
        <q-icon name="inventory_2" size="4em" class="q-mb-md" />
        <div class="text-h6">Пока нет доступных товаров</div>
        <div>Фермеры еще не опубликовали свою продукцию.</div>
      </div>
    </div>

    <q-dialog v-model="showModal">
      <q-card style="width: 400px; max-width: 90vw; background: #111; color: white; border-radius: 20px; border: 1px solid #222;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Оформление контракта</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-grey-5 q-mb-md">Товар: <span class="text-white text-weight-bold">{{ selectedProduct?.title || selectedProduct?.crop_name }}</span></div>
          
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <div class="input-label">Объем ({{ selectedProduct?.unit || 'kg' }})</div>
              <q-input v-model.number="form.volume" type="number" borderless class="custom-input" :rules="[val => val <= selectedProduct?.stock || 'Превышает остаток', val => val > 0 || 'Введите объем']" />
            </div>
            <div class="col-6">
              <div class="input-label">Цена (₸)</div>
              <q-input v-model.number="form.price" type="number" borderless class="custom-input" />
            </div>
          </div>

          <div class="q-mt-lg text-right">
            <div class="text-caption text-grey-5">Итоговая сумма:</div>
            <div class="text-h5 text-purple-4 text-weight-bold">{{ (form.volume * form.price) || 0 }} ₸</div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Отмена" color="grey" v-close-popup />
          <q-btn unelevated label="Отправить оффер" color="purple-6" style="border-radius: 12px; padding: 8px 20px;" @click="submitContract" :loading="creatingContract" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const $q = useQuasar()
const router = useRouter()
const products = ref([])
const loading = ref(false)

const showModal = ref(false)
const selectedProduct = ref(null)
const creatingContract = ref(false)
const form = reactive({ volume: 0, price: 0 })

async function loadCatalog() {
  loading.value = true
  try {
    const res = await api.get('/products')
    const rawData = res.data || res
    products.value = rawData.products || rawData.items || rawData.data || (Array.isArray(rawData) ? rawData : [])
  } catch (e) {
    console.error("ОШИБКА АПИ:", e)
    $q.notify({ type: 'negative', message: 'Ошибка загрузки каталога' })
  } finally {
    loading.value = false
  }
}

function openContractModal(product) {
  selectedProduct.value = product
  form.volume = product.stock || 0
  form.price = product.price || 0
  showModal.value = true
}

async function submitContract() {
  if (form.volume <= 0 || form.volume > selectedProduct.value.stock) {
    $q.notify({ type: 'warning', message: 'Некорректный объем' })
    return
  }

  creatingContract.value = true
  try {
    await api.post('/contracts', {
      product_id: selectedProduct.value.id,
      seller_id: selectedProduct.value.owner_id,
      volume: form.volume,
      price: form.price,
      currency: 'KZT'
    })
    $q.notify({ type: 'positive', message: 'Черновик контракта успешно создан!' })
    showModal.value = false
    router.push('/buyer/contracts')
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: e?.response?.data?.error || 'Ошибка при создании контракта' })
  } finally {
    creatingContract.value = false
  }
}

onMounted(() => {
  loadCatalog()
})
</script>

<style scoped>
.product-card { 
  background: #111; 
  border-radius: 20px; 
  border: 1px solid #222; 
  transition: transform 0.2s, box-shadow 0.2s; 
}
.product-card:hover { 
  transform: translateY(-5px); 
  border-color: #7b61ff; 
  box-shadow: 0 10px 20px rgba(123, 97, 255, 0.1);
}
.input-label { font-size: 12px; font-weight: bold; color: #888; margin-bottom: 6px; margin-left: 4px; }
.custom-input { background: #1c1c1e; border-radius: 12px; padding: 0 16px; transition: all 0.3s; border: 1px solid transparent; }
.custom-input:focus-within { border-color: #7b61ff; }
:deep(.q-field__native), :deep(.q-field__input) { color: white !important; font-size: 15px; }
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
