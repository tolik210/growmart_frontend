<template>
  <q-page class="q-pa-md bg-black text-white">
    <div class="text-h5 text-weight-bold q-mb-md">🏦 Кабинет партнёра</div>

    <q-tabs v-model="tab" dense class="text-purple-4" active-color="purple-4" indicator-color="purple-4">
      <q-tab name="bank" label="Банк" />
      <q-tab name="logistics" label="Логистика" />
    </q-tabs>

    <q-separator dark class="q-my-md" />

    <div v-if="loading" class="text-grey-5">Загрузка...</div>
    <div v-else-if="error" class="text-negative">{{ error }}</div>

    <div v-else>
      <pre class="json-box">{{ pretty(data) }}</pre>
    </div>

    <q-btn class="q-mt-md" color="purple-6" label="Обновить" @click="load()" />
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { apiGet } from "../services/api";

const tab = ref("bank");
const loading = ref(false);
const error = ref("");
const data = ref({});

function pretty(x) {
  try { return JSON.stringify(x, null, 2); } catch { return String(x); }
}

async function load() {
  loading.value = true;
  error.value = "";
  data.value = {};
  try {
    const url =
      tab.value === "logistics"
        ? "/api/partner/logistics/shipments"
        : "/api/partner/bank/payments";
    data.value = await apiGet(url);
  } catch (e) {
    error.value = e?.message || "Ошибка";
  } finally {
    loading.value = false;
  }
}

watch(tab, () => load(), { immediate: true });
</script>

<style scoped>
.json-box{
  background:#0f0f0f;
  border:1px solid #222;
  border-radius:16px;
  padding:12px;
  overflow:auto;
  max-height:60vh;
  color:#ddd;
}
</style>
