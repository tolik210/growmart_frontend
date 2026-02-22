<template>
  <q-page padding class="cabinet-page">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h4 class="text-white q-my-none text-weight-bold">Кабинет покупателя (B2B)</h4>
        <div class="text-grey-5 q-mt-sm">Панель управления закупками GrowMart</div>
      </div>
      <q-btn color="primary" icon="search" label="Перейти в каталог" class="action-btn" to="/buyer/catalog" />
    </div>

    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card dark class="stat-card">
          <q-card-section>
            <div class="text-grey-5 text-subtitle2">Активные контракты</div>
            <div class="text-h4 text-white text-weight-bold q-mt-sm">0</div>
            <div class="text-warning text-caption q-mt-xs">
              Ожидают оплаты: 0
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card dark class="stat-card">
          <q-card-section>
            <div class="text-grey-5 text-subtitle2">Закупки за месяц</div>
            <div class="text-h4 text-white text-weight-bold q-mt-sm">0 ₸</div>
            <div class="text-grey-5 text-caption q-mt-xs">
              Завершено сделок: 0
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card dark class="stat-card">
          <q-card-section>
            <div class="text-grey-5 text-subtitle2">Избранные фермеры</div>
            <div class="text-h4 text-white text-weight-bold q-mt-sm">0</div>
            <div class="text-grey-5 text-caption q-mt-xs">
              Новых предложений: 0
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card dark class="table-card">
          <q-card-section>
            <div class="text-h6 text-white q-mb-md">История закупок</div>
            <q-table
              dark
              flat
              class="bg-transparent"
              :rows="recentPurchases"
              :columns="columns"
              row-key="id"
              hide-bottom
              no-data-label="Вы еще ничего не заказывали"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const recentPurchases = ref([])

const columns = [
  { name: 'id', align: 'left', label: 'ID Контракта', field: 'id' },
  { name: 'date', align: 'left', label: 'Дата', field: 'date' },
  { name: 'seller', align: 'left', label: 'Поставщик (Фермер)', field: 'seller' },
  { name: 'status', align: 'left', label: 'Статус', field: 'status' },
  { name: 'amount', align: 'right', label: 'Сумма (₸)', field: 'amount' }
]
</script>

<style scoped>
.cabinet-page {
  background-color: #050505;
  min-height: 100vh;
}
.action-btn {
  border-radius: 12px;
  background: #7b61ff !important;
}
.stat-card {
  background: #1c1c1e;
  border-radius: 16px;
  border: 1px solid #2c2c2e;
}
.table-card {
  background: #1c1c1e;
  border-radius: 16px;
  border: 1px solid #2c2c2e;
}
</style>
