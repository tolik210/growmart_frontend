<template>
  <div class="q-pa-md">
    <div class="row items-center q-col-gutter-md">
      <div class="col">
        <div class="text-h5 text-weight-bold">🏛️ Кабинет регулятора</div>
        <div class="text-grey-6">Дашборд и отчёты (MVP)</div>
      </div>
      <div class="col-auto">
        <q-btn color="purple-6" label="Logout" unelevated no-caps @click="logout" />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <q-card flat bordered class="bg-grey-10 text-white">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1">Вы вошли как: <b>{{ roleLabel }}</b></div>
          <div class="text-caption text-grey-5">iin/bin: {{ iinBin || '—' }}</div>
        </div>
        <q-btn outline color="purple-4" label="Обновить" no-caps @click="loadAll" :loading="loading" />
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-md-4">
        <q-card bordered class="bg-grey-10 text-white">
          <q-card-section>
            <div class="text-subtitle1">📄 Contracts report</div>
            <div class="text-caption text-grey-5">/regulator/reports/contracts</div>
          </q-card-section>
          <q-card-section>
            <pre class="json">{{ pretty(contractsReport) }}</pre>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card bordered class="bg-grey-10 text-white">
          <q-card-section>
            <div class="text-subtitle1">💳 Payments report</div>
            <div class="text-caption text-grey-5">/regulator/reports/payments</div>
          </q-card-section>
          <q-card-section>
            <pre class="json">{{ pretty(paymentsReport) }}</pre>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card bordered class="bg-grey-10 text-white">
          <q-card-section>
            <div class="text-subtitle1">📦 Stock report</div>
            <div class="text-caption text-grey-5">/regulator/reports/stock</div>
          </q-card-section>
          <q-card-section>
            <pre class="json">{{ pretty(stockReport) }}</pre>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-banner v-if="error" class="bg-red-10 text-white q-mt-md" rounded>
      {{ error }}
    </q-banner>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

const loading = ref(false);
const error = ref("");

const contractsReport = ref(null);
const paymentsReport = ref(null);
const stockReport = ref(null);

const iinBin = localStorage.getItem("growmart_iin_bin") || "";
const role = localStorage.getItem("growmart_role") || "gov";
const roleLabel = computed(() => role === "gov" ? "gov (Регулятор)" : role);

function authHeaders() {
  const t = localStorage.getItem("access_token") || "";
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function pretty(v) {
  if (!v) return "";
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}

async function apiGet(path) {
  const res = await fetch(path, { headers: { ...authHeaders() } });
  const txt = await res.text();
  let data = null;
  try { data = JSON.parse(txt); } catch { data = { raw: txt }; }
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

async function loadAll() {
  loading.value = true;
  error.value = "";
  try {
    // если nginx проксирует /api -> 8080, то ходим через /api/...
    contractsReport.value = await apiGet("/api/regulator/reports/contracts");
    paymentsReport.value = await apiGet("/api/regulator/reports/payments");
    stockReport.value = await apiGet("/api/regulator/reports/stock");
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    loading.value = false;
  }
}

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("growmart_role");
  $q.notify({ type: "positive", message: "Вы вышли из системы" });
  router.push("/");
}

loadAll();
</script>

<style scoped>
.json {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  margin: 0;
}
</style>
