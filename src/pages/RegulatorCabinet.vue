<template>
  <q-page class="q-pa-md bg-black text-white">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">🏛️ Кабинет регулятора</div>
        <div class="text-grey-6">Обзор системы и отчёты</div>
      </div>
      <q-btn color="purple-6" label="Обновить" @click="load()" :loading="loading" unelevated />
    </div>

    <q-tabs v-model="tab" dense class="text-purple-4" active-color="purple-4" indicator-color="purple-4">
      <q-tab name="dashboard" label="Дашборд" />
      <q-tab name="contracts" label="Контракты" />
      <q-tab name="payments" label="Платежи" />
      <q-tab name="stock" label="Остатки" />
    </q-tabs>

    <q-separator dark class="q-my-md" />

    <div v-if="loading" class="text-grey-5">Загрузка…</div>
    <div v-else-if="error" class="text-negative">{{ error }}</div>

    <!-- DASHBOARD -->
    <div v-else-if="tab==='dashboard'">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>
              <div class="text-grey-5">Пользователи</div>
              <div class="text-h4 text-weight-bold">{{ data.users ?? 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>
              <div class="text-grey-5">Товары</div>
              <div class="text-h4 text-weight-bold">{{ data.products ?? 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>
              <div class="text-grey-5">Контракты</div>
              <div class="text-h4 text-weight-bold">{{ data.contracts ?? 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card class="kpi-card">
            <q-card-section>
              <div class="text-grey-5">Платежи</div>
              <div class="text-h4 text-weight-bold">{{ data.payments ?? 0 }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card class="q-mt-md panel-card">
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div class="text-subtitle1 text-weight-bold">Завершение контрактов</div>
              <div class="text-grey-6">completed / total</div>
            </div>
            <div class="text-right">
              <div class="text-h6 text-weight-bold">{{ data.completed_contracts ?? 0 }} / {{ data.contracts ?? 0 }}</div>
            </div>
          </div>

          <q-linear-progress
            class="q-mt-sm"
            :value="completionRate"
            color="purple-6"
            track-color="grey-9"
            rounded
          />
          <div class="text-grey-6 q-mt-xs">{{ Math.round(completionRate*100) }}%</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- REPORTS -->
    <div v-else>
      <q-card class="panel-card">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">
            {{ tabTitle }}
          </div>

          <q-table
            v-if="Array.isArray(items)"
            :rows="items"
            :columns="columns"
            row-key="id"
            dark
            flat
            class="bg-grey-10"
            :rows-per-page-options="[10,25,50,100]"
          />

          <div v-else class="text-grey-6">Нет данных</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { apiGet } from "src/services/api";

const tab = ref("dashboard");
const loading = ref(false);
const error = ref("");
const data = ref({});
const items = ref([]);

const completionRate = computed(() => {
  const total = Number(data.value.contracts || 0);
  const done = Number(data.value.completed_contracts || 0);
  if (!total) return 0;
  return Math.max(0, Math.min(1, done / total));
});

const tabTitle = computed(() => {
  if (tab.value === "contracts") return "Отчёт по контрактам";
  if (tab.value === "payments") return "Отчёт по платежам";
  if (tab.value === "stock") return "Отчёт по остаткам";
  return "Дашборд";
});

const columns = computed(() => {
  if (tab.value === "contracts") {
    return [
      { name: "id", label: "ID", field: "id", align: "left" },
      { name: "status", label: "Status", field: "status", align: "left" },
      { name: "total_amount", label: "Amount", field: "total_amount", align: "left" },
      { name: "currency", label: "Cur", field: "currency", align: "left" },
      { name: "created_at", label: "Created", field: "created_at", align: "left" },
    ];
  }
  if (tab.value === "payments") {
    return [
      { name: "id", label: "ID", field: "id", align: "left" },
      { name: "contract_id", label: "Contract", field: "contract_id", align: "left" },
      { name: "status", label: "Status", field: "status", align: "left" },
      { name: "amount", label: "Amount", field: "amount", align: "left" },
      { name: "currency", label: "Cur", field: "currency", align: "left" },
      { name: "created_at", label: "Created", field: "created_at", align: "left" },
    ];
  }
  if (tab.value === "stock") {
    return [
      { name: "id", label: "ID", field: "id", align: "left" },
      { name: "title", label: "Title", field: "title", align: "left" },
      { name: "stock", label: "Stock", field: "stock", align: "left" },
      { name: "reserved", label: "Reserved", field: "reserved", align: "left" },
      { name: "available", label: "Available", field: "available", align: "left" },
      { name: "created_at", label: "Created", field: "created_at", align: "left" },
    ];
  }
  return [];
});

async function load() {
  loading.value = true;
  error.value = "";
  data.value = {};
  items.value = [];

  try {
    const map = {
      dashboard: "/api/regulator/dashboard",
      contracts: "/api/regulator/reports/contracts",
      payments: "/api/regulator/reports/payments",
      stock: "/api/regulator/reports/stock",
    };
    const url = map[tab.value] || map.dashboard;
    const res = await apiGet(url);

    if (tab.value === "dashboard") data.value = res || {};
    else items.value = res?.items || [];
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || "Ошибка";
  } finally {
    loading.value = false;
  }
}

watch(tab, () => load(), { immediate: true });
</script>

<style scoped>
.kpi-card{
  background:#0f0f0f;
  border:1px solid #1f1f1f;
  border-radius:18px;
}
.panel-card{
  background:#0f0f0f;
  border:1px solid #1f1f1f;
  border-radius:18px;
}
</style>
