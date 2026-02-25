<template>
  <q-page class="catalog-page q-pa-lg">
    <div class="row items-center q-mb-xl">
      <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn q-mr-md" @click="$router.push('/')" />
      <h4 class="text-white q-my-none text-weight-bold">Каталог АПК</h4>
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-3">
        <q-card class="filter-card" flat bordered>
          <q-card-section>
            <div class="text-h6 text-white text-weight-bold q-mb-md">Фильтры</div>
            
            <div class="field-label">Поиск по названию</div>
            <q-input v-model="filters.search" dark borderless dense class="custom-field q-mb-md" placeholder="Пшеница, Картофель..." clearable @keyup.enter="applyFilters" />

            <div class="field-label">Область</div>
            <q-select v-model="filters.region_id" :options="regions" option-value="id" option-label="name" emit-value map-options dark borderless dense class="custom-field q-mb-md" clearable placeholder="Все регионы" />

            <div class="field-label">Семейство культур</div>
            <q-select v-model="filters.family_id" :options="families" option-value="id" option-label="name" emit-value map-options dark borderless dense class="custom-field q-mb-md" clearable placeholder="Все семейства" @update:model-value="loadCrops" />

            <div class="field-label">Культура</div>
            <q-select v-model="filters.crop_id" :options="crops" option-value="id" option-label="name" emit-value map-options :disable="!filters.family_id" dark borderless dense class="custom-field q-mb-lg" clearable placeholder="Все культуры" />

            <q-btn color="blue-6" class="full-width text-weight-bold" label="Применить фильтры" @click="applyFilters" :loading="loading" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-9">
        <div v-if="loading" class="flex flex-center q-pa-xl">
          <q-spinner color="blue-5" size="3em" />
        </div>
        
        <div v-else-if="products.length === 0" class="text-center q-pa-xl">
          <q-icon name="search_off" size="6em" color="grey-8" />
          <h5 class="text-grey-5 q-mt-md">По вашему запросу ничего не найдено</h5>
          <q-btn class="q-mt-lg" color="grey-8" outline label="Сбросить фильтры" @click="resetFilters" />
        </div>

        <div v-else class="products-grid">
          <div class="product-card cursor-pointer" v-for="product in products" :key="product.id" @click="$router.push('/product/' + product.id)">
            <div class="product-image">
              <img v-if="product.image" :src="'https://v1.growmart.ltd' + product.image" alt="Товар" />
              <q-icon v-else name="image" size="3em" color="grey-8" />
            </div>
            <div class="product-info">
              <h4 class="product-title">{{ product.title || product.crop_name || 'Без названия' }}</h4>
              <div class="product-price">{{ product.price ? product.price + ' ₸' : 'Договорная' }} / {{ product.price_unit === 'ton' ? 'т' : 'кг' }}</div>
              <div class="product-meta">
                {{ product.region || 'Регион не указан' }}<br>
                В наличии: {{ product.available || 0 }} {{ product.unit === 'ton' ? 'т' : 'кг' }}
              </div>
              <q-btn class="buy-btn text-weight-bold" unelevated>Смотреть детали</q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from 'src/services/api'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const products = ref([])

// Словари для фильтров
const regions = ref([])
const families = ref([])
const crops = ref([])

// Текущие фильтры
const filters = ref({
  search: '',
  region_id: null,
  family_id: null,
  crop_id: null
})

// Подгрузка словарей (сразу при загрузке страницы)
const loadDictionaries = async () => {
  try {
    const [resReg, resFam] = await Promise.all([
      api.get('/dictionaries/regions'),
      api.get('/dictionaries/families')
    ])
    regions.value = resReg.data || []
    families.value = resFam.data || []
  } catch (e) { console.error('Ошибка словарей', e) }
}

const loadCrops = async (familyId) => {
  filters.value.crop_id = null
  crops.value = []
  if (familyId) {
    const res = await api.get(`/dictionaries/crops?family_id=${familyId}`)
    crops.value = res.data || []
  }
}

// Загрузка товаров с бэкенда с учетом фильтров
const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.region_id) params.region_id = filters.value.region_id
    if (filters.value.crop_id) params.crop_id = filters.value.crop_id

    const res = await api.get('/products/published', { params })
    products.value = res.data.products || []
  } catch (e) {
    console.error('Ошибка загрузки каталога:', e)
  } finally {
    loading.value = false
  }
}

// Нажатие на кнопку "Применить фильтры" (обновляет URL, чтобы можно было делиться ссылкой)
const applyFilters = () => {
  const query = {}
  if (filters.value.search) query.search = filters.value.search
  if (filters.value.region_id) query.region_id = filters.value.region_id
  if (filters.value.family_id) query.family_id = filters.value.family_id
  if (filters.value.crop_id) query.crop_id = filters.value.crop_id
  router.push({ path: '/catalog', query })
}

const resetFilters = () => {
  filters.value = { search: '', region_id: null, family_id: null, crop_id: null }
  applyFilters()
}

// Если поменялся URL (например, ввели поиск на главной странице) - обновляем фильтры и ищем
watch(() => route.query, (newQuery) => {
  filters.value.search = newQuery.search || ''
  filters.value.region_id = newQuery.region_id || null
  filters.value.family_id = newQuery.family_id || null
  filters.value.crop_id = newQuery.crop_id || null
  
  if (filters.value.family_id && crops.value.length === 0) {
    loadCrops(filters.value.family_id)
  }
  
  fetchProducts()
}, { immediate: true })

onMounted(() => {
  loadDictionaries()
})
</script>

<style scoped>
.catalog-page { background-color: #050505; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.bg-dark-btn { background-color: #1a1a1c !important; border: 1px solid #333; }

/* Карточка фильтров */
.filter-card { background-color: #111112; border-color: #222; border-radius: 16px; position: sticky; top: 20px; }
.field-label { font-size: 12px; font-weight: 700; margin-bottom: 6px; color: #aaa; }
:deep(.custom-field .q-field__control) { background-color: #1a1a1c !important; border-radius: 8px !important; border: 1px solid #333; }
:deep(.custom-field.q-field--focused .q-field__control) { border-color: #3b82f6; }

/* Сетка товаров */
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.product-card { background: #111112; border: 1px solid #222; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s; }
.product-card:hover { transform: translateY(-4px); border-color: #3b82f6; box-shadow: 0 8px 24px rgba(59, 130, 246, 0.1); }
.product-image { width: 100%; height: 180px; background: #1a1a1c; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.product-image img { width: 100%; height: 100%; object-fit: cover; }
.product-info { padding: 16px; display: flex; flex-direction: column; flex: 1; }
.product-title { font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #fff; line-height: 1.3; }
.product-price { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.product-meta { font-size: 12px; color: #888; margin-bottom: 16px; flex: 1; line-height: 1.5; }
.buy-btn { background: #1e3a8a; color: #fff; border: none; padding: 10px; border-radius: 8px; transition: background 0.2s; width: 100%; }
.buy-btn:hover { background: #3b82f6; }

@media (max-width: 768px) {
  .filter-card { position: static; margin-bottom: 24px; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .product-image { height: 140px; }
  .product-title { font-size: 14px; }
  .product-price { font-size: 16px; }
}
</style>
