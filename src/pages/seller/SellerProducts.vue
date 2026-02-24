<template>
  <q-page class="products-page q-pa-lg">
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center q-gutter-x-md">
        <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn" @click="$router.back()" />
        <h5 class="text-white q-my-none text-weight-bold">Управление товарами</h5>
      </div>
      <q-btn label="Создать товар" color="indigo-4" icon="add" class="create-btn text-weight-bold" @click="onSubmit" :loading="loading" />
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-5">
        <div class="section-title q-mb-md">Добавить новую культуру</div>
        <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
          
          <div class="col-12">
            <div class="field-label">Фотография урожая</div>
            <q-file v-model="form.image" dark borderless dense class="custom-field file-field" accept="image/*" label="Выбрать фото" @update:model-value="onImageChange" />
            <div v-if="imagePreview" class="q-mt-sm text-center preview-container">
              <img :src="imagePreview" class="preview-img" style="max-width: 100%; max-height: 200px; border-radius: 8px; margin-top: 10px;" />
            </div>
          </div>

          <div class="col-6">
            <div class="field-label">Область</div>
            <q-select v-model="form.region_id" :options="regions" option-value="id" option-label="name" emit-value map-options dark borderless dense class="custom-field" @update:model-value="loadDistricts" />
          </div>

          <div class="col-6">
            <div class="field-label">Район / Г.О.</div>
            <q-select v-model="form.district_id" :options="districts" option-value="id" option-label="name" emit-value map-options :disable="!form.region_id" dark borderless dense class="custom-field" @update:model-value="loadCities" />
          </div>

          <div class="col-6">
            <div class="field-label">Город / Село</div>
            <q-select v-model="form.city_id" :options="cities" option-value="id" option-label="name" emit-value map-options :disable="!form.district_id" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Местоположение (Адрес)</div>
            <q-input v-model="form.address" dark borderless dense class="custom-field" placeholder="Улица, трасса" />
          </div>
          
          <div class="col-6">
            <div class="field-label">Семейство</div>
            <q-select v-model="form.crop_family_id" :options="families" option-value="id" option-label="name" emit-value map-options dark borderless dense class="custom-field" @update:model-value="loadCrops" />
          </div>

          <div class="col-6">
            <div class="field-label">Культура</div>
            <q-select v-model="form.crop_id" :options="crops" option-value="id" option-label="name" emit-value map-options :disable="!form.crop_family_id" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Сорт</div>
            <q-input v-model="form.variety" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Фракция</div>
            <q-select v-model="form.fraction" :options="['Крупная', 'Средняя', 'Мелкая']" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Объем</div>
            <div class="row no-wrap">
              <q-input v-model.number="form.quantity" type="number" dark borderless dense class="custom-field full-width q-mr-xs" />
              <q-select v-model="form.unit" :options="[{label: 'т', value: 'ton'}, {label: 'кг', value: 'kg'}]" emit-value map-options dark borderless dense class="custom-field" style="width: 80px" />
            </div>
          </div>

          <div class="col-6">
            <div class="field-label">Цена (₸)</div>
            <q-input v-model.number="form.price" type="number" dark borderless dense class="custom-field" />
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <div class="section-title q-mb-md">Мои товары</div>
        <q-table dark flat :rows="myProducts" :columns="columns" row-key="id" class="custom-table" :loading="tableLoading">
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'published' ? 'green-5' : 'grey-7'" :label="props.row.status === 'published' ? 'В продаже' : 'Черновик'" />
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn v-if="props.row.status === 'draft'" size="sm" color="green-6" label="Опубликовать" @click="toggleStatus(props.row)" unelevated />
              <q-btn v-else size="sm" color="orange-6" label="Снять с продажи" @click="toggleStatus(props.row)" outline />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import api from 'src/services/api'

const $q = useQuasar()
const loading = ref(false)
const tableLoading = ref(false)

const regions = ref([])
const districts = ref([])
const cities = ref([])
const families = ref([])
const crops = ref([])
const myProducts = ref([])
const imagePreview = ref(null)

const form = ref({
  image: null, region_id: null, district_id: null, city_id: null, address: '',
  crop_family_id: null, crop_id: null, variety: '', fraction: 'Средняя',
  quantity: null, unit: 'ton', price: null
})

const columns = [
  { name: 'title', align: 'left', label: 'Описание', field: 'title' },
  { name: 'volume', align: 'left', label: 'Объем', field: row => `${row.stock || 0} ${row.unit || 'kg'}` },
  { name: 'price', align: 'left', label: 'Цена', field: row => `${row.price || 0} ₸` },
  { name: 'status', align: 'center', label: 'Статус', field: 'status' },
  { name: 'actions', align: 'center', label: 'Действия', field: 'actions' }
]

const onImageChange = (val) => {
  if (val) { imagePreview.value = URL.createObjectURL(val) } 
  else { imagePreview.value = null }
}

const loadInitialDictionaries = async () => {
  try {
    const [resReg, resFam] = await Promise.all([
      api.get('/dictionaries/regions'),
      api.get('/dictionaries/families')
    ])
    regions.value = resReg.data || []
    families.value = resFam.data || []
  } catch (e) { console.error('Ошибка словарей', e) }
}

const loadDistricts = async (regionId) => {
  form.value.district_id = null; districts.value = []
  if (regionId) {
    const res = await api.get(`/dictionaries/districts?region_id=${regionId}`)
    districts.value = res.data || []
  }
}

const loadCities = async (districtId) => {
  form.value.city_id = null; cities.value = []
  if (districtId) {
    const res = await api.get(`/dictionaries/cities?district_id=${districtId}`)
    cities.value = res.data || []
  }
}

const loadCrops = async (familyId) => {
  form.value.crop_id = null; crops.value = []
  if (familyId) {
    const res = await api.get(`/dictionaries/crops?family_id=${familyId}`)
    crops.value = res.data || []
  }
}

const fetchMyProducts = async () => {
  tableLoading.value = true
  try {
    const res = await api.get('/products')
    myProducts.value = res.data.products || []
  } catch (e) { console.error('Ошибка загрузки', e) }
  finally { tableLoading.value = false }
}

const toggleStatus = async (row) => {
  try {
    if (row.status === 'draft') {
      await api.post(`/products/${row.id}/publish`)
      $q.notify({ type: 'positive', message: 'Товар опубликован!' })
    } else {
      await api.post(`/products/${row.id}/unpublish`)
      $q.notify({ type: 'info', message: 'Снят с продажи' })
    }
    fetchMyProducts()
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Ошибка изменения статуса' })
  }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const onSubmit = async () => {
  loading.value = true
  try {
    let base64Image = ""
    if (form.value.image && form.value.image instanceof File) {
      base64Image = await fileToBase64(form.value.image)
    }

    const payload = { 
      ...form.value, stock: form.value.quantity, 
      title: `${form.value.variety} (${form.value.fraction})`, image: base64Image 
    }

    await api.post('/products', payload)
    $q.notify({ type: 'positive', message: 'Готово! Товар сохранен.' })
    
    form.value.quantity = null; form.value.price = null; form.value.variety = '';
    form.value.image = null; imagePreview.value = null;

    fetchMyProducts()
  } catch (e) { $q.notify({ type: 'negative', message: 'Ошибка при сохранении' }) } 
  finally { loading.value = false }
}

onMounted(() => {
  loadInitialDictionaries()
  fetchMyProducts()
})
</script>

<style scoped>
.products-page { background-color: #050505; min-height: 100vh; color: white; }
.section-title { font-size: 18px; font-weight: 700; color: #7b61ff; }
.field-label { font-size: 12px; font-weight: 700; margin-bottom: 6px; opacity: 0.8; }
:deep(.custom-field .q-field__control) { background-color: #1a1a1c !important; border-radius: 12px !important; }
.custom-table { background-color: #111112 !important; border-radius: 16px; }
</style>
