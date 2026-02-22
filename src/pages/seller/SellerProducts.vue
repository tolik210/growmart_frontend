<template>
  <q-page class="products-page q-pa-lg">
    
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center q-gutter-x-md">
        <q-btn flat round dense icon="arrow_back" color="white" class="bg-dark-btn" @click="$router.back()" />
        <h5 class="text-white q-my-none text-weight-bold">Управление товарами</h5>
      </div>
      <q-btn label="Создать и опубликовать" color="indigo-4" icon="add" class="create-btn text-weight-bold" @click="onSubmit" />
    </div>

    <div class="row q-col-gutter-xl">
      
      <div class="col-12 col-lg-5">
        <div class="section-title q-mb-md">Добавить новую культуру</div>
        <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
          
          <div class="col-6">
            <div class="field-label">Область</div>
            <q-select v-model="form.region" :options="regions" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Район</div>
            <q-select v-model="form.district" :options="districts" dark borderless dense class="custom-field">
              <template v-slot:append><q-icon name="edit" size="xs" color="white" /></template>
            </q-select>
          </div>

          <div class="col-6">
            <div class="field-label">Город / Село</div>
            <q-select v-model="form.city" :options="cities" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6"></div> <div class="col-6">
            <div class="field-label">Семейство</div>
            <q-select v-model="form.family" :options="families" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Культура</div>
            <q-select v-model="form.crop" :options="crops" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Сорт</div>
            <q-select v-model="form.variety" :options="['Летняя', 'Зимняя', 'Ранняя']" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Фракция</div>
            <q-select v-model="form.fraction" :options="['Крупная', 'Средняя', 'Мелкая']" dark borderless dense class="custom-field" />
          </div>

          <div class="col-6">
            <div class="field-label">Объем</div>
            <div class="row no-wrap">
              <q-input v-model="form.quantity" type="number" dark borderless dense class="custom-field full-width q-mr-xs" />
              <q-select v-model="form.unit" :options="['т', 'кг', 'ц']" dark borderless dense class="custom-field" style="width: 80px" />
            </div>
          </div>

          <div class="col-6">
            <div class="field-label">Цена за ед. (₸)</div>
            <q-input v-model="form.price" type="number" dark borderless dense class="custom-field" />
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-7">
        <div class="section-title q-mb-md">Активные товары в продаже</div>
        <q-table
          dark flat
          :rows="myProducts"
          :columns="columns"
          row-key="id"
          class="bg-transparent custom-table"
          no-data-label="Список пуст"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.isPublished ? 'green-5' : 'grey-7'" rounded class="q-mr-xs" />
              <span :class="props.row.isPublished ? 'text-green-5' : 'text-grey-5'">
                {{ props.row.isPublished ? 'В продаже' : 'Снят' }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="grey-5" icon="more_vert">
                <q-menu dark>
                  <q-list style="min-width: 150px">
                    <q-item clickable v-close-popup @click="toggleStatus(props.row)">
                      <q-item-section>{{ props.row.isPublished ? 'Снять с продажи' : 'Опубликовать' }}</q-item-section>
                    </q-item>
                    <q-separator dark />
                    <q-item clickable v-close-popup class="text-negative" @click="deleteProduct(props.row.id)">
                      <q-item-section>Удалить</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Справочники
const regions = ['Туркестанская обл.', 'Алматинская обл.', 'Жамбылская обл.']
const districts = ['Сайрамский', 'Тюлькубасский', 'Ордабасинский']
const cities = ['Шымкент', 'Аксукент', 'Карабулак']
const families = ['Бахчевые', 'Зерновые', 'Овощные']
const crops = ['Тыква', 'Арбуз', 'Пшеница']

const form = ref({
  region: 'Туркестанская обл.', district: 'Сайрамский', city: 'Шымкент',
  family: 'Бахчевые', crop: 'Тыква', variety: 'Летняя', fraction: 'Крупная',
  quantity: 10, unit: 'т', price: 85000
})

const myProducts = ref([
  { id: 1, name: 'Тыква', variety: 'Летняя', volume: '10 т', price: '85 000 ₸', isPublished: true }
])

const columns = [
  { name: 'name', align: 'left', label: 'Культура', field: 'name', style: 'font-weight: bold' },
  { name: 'volume', align: 'left', label: 'Объем', field: 'volume' },
  { name: 'price', align: 'left', label: 'Цена', field: 'price' },
  { name: 'status', align: 'center', label: 'Статус', field: 'status' },
  { name: 'actions', align: 'right', label: '', field: 'actions' }
]

const onSubmit = () => {
  myProducts.value.unshift({
    id: Date.now(),
    name: form.value.crop,
    variety: form.value.variety,
    volume: `${form.value.quantity} ${form.value.unit}`,
    price: `${form.value.price.toLocaleString()} ₸`,
    isPublished: true
  })
  $q.notify({ type: 'positive', message: 'Товар опубликован!' })
}

const toggleStatus = (row) => { row.isPublished = !row.isPublished }
const deleteProduct = (id) => { myProducts.value = myProducts.value.filter(p => p.id !== id) }
</script>

<style scoped>
.products-page { background-color: #050505; min-height: 100vh; color: white; }
.section-title { font-size: 18px; font-weight: 700; color: #7b61ff; }
.field-label { font-size: 12px; font-weight: 700; margin-bottom: 6px; color: #ffffff; opacity: 0.8; }
:deep(.custom-field .q-field__control) { background-color: #1a1a1c !important; border-radius: 20px !important; height: 44px; padding: 0 16px; }
:deep(.custom-field .q-field__native) { color: #ffffff !important; }
.bg-dark-btn { background-color: #1a1a1c !important; }
.create-btn { border-radius: 20px; padding: 8px 32px; background-color: #3b3c6a !important; text-transform: none; }
.custom-table { background-color: #111112 !important; border-radius: 24px; padding: 10px; border: 1px solid #1a1a1c; }
</style>
