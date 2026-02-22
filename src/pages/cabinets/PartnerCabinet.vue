<template>
  <div class="q-pa-md">
    <div class="row items-center q-col-gutter-md">
      <div class="col">
        <div class="text-h5 text-weight-bold">🏦 Кабинет партнёра</div>
        <div class="text-grey-6">Банк / Логистика (MVP)</div>
      </div>
      <div class="col-auto">
        <q-btn color="purple-6" label="Logout" unelevated no-caps @click="logout" />
      </div>
    </div>

    <q-separator class="q-my-md" />

    <q-tabs v-model="tab" dense class="text-purple-4" active-color="purple-4" indicator-color="purple-4" align="left">
      <q-tab name="bank" label="Банк" />
      <q-tab name="logistics" label="Логистика" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="q-mt-md">
      <q-tab-panel name="bank">
        <q-card bordered class="bg-grey-10 text-white">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle1">💳 Платежи банка</div>
              <div class="text-caption text-grey-5">/partner/bank/payments</div>
            </div>
            <q-btn outline color="purple-4" label="Обновить" no-caps @click="loadBank" :loading="loading" />
          </q-card-section>
          <q-card-section>
            <pre class="json">{{ pretty(bankPayments) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="logistics">
        <q-card bordered class="bg-grey-10 text-white">
          <q-card-section class="row items-center justify-between">
            <div>
              <div class="text-subtitle1">🚚 Отгрузки логистики</div>
              <div class="text-caption text-grey-5">/partner/logistics/shipments</div>
            </div>
            <q-btn outline color="purple-4" label="Обновить" no-caps @click="loadShipments" :loading="loading" />
          </q-card-section>
          <q-card-section>
            <pre class="json">{{ pretty(shipments) }}</pre>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <q-banner v-if="error" class="bg-red-10 text-white q-mt-md" rounded>
      {{ error }}
    </q-banner>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

const tab = ref("bank");
const loading = ref(false);
const error = ref("");

const bankPayments = ref(null);
const shipments = ref(null);

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

async function loadBank() {
  loading.value = true;
  error.value = "";
  try {
    bankPayments.value = await apiGet("/api/partner/bank/payments");
  } catch (e) {
    error.value = e?.message || String(e);
  } finally {
    loading.value = false;
  }
}

async function loadShipments() {
  loading.value = true;
  error.value = "";
  try {
    shipments.value = await apiGet("/api/partner/logistics/shipments");
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

loadBank();
</script>

<style scoped>
.json {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 12px;
  margin: 0;
}
</style>
