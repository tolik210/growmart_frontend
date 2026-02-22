<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">📨 RFQ</div>
      <q-space />
      <q-btn flat color="purple-4" label="Назад" @click="$router.push('/seller')" />
    </div>

    <q-card class="bg-grey-10 text-white">
      <q-card-section>
        <q-banner v-if="error" class="bg-red-10 text-white q-mb-md">{{ error }}</q-banner>

        <q-table
          :rows="rows"
          :columns="cols"
          row-key="id"
          dark
          flat
          class="bg-grey-10"
          :loading="loading"
          @row-click="(_, r) => $router.push('/seller/rfq/' + r.id)"
        />
        <div class="text-grey-6 q-mt-sm">Клик по строке — открыть RFQ.</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { listRfq } from "@/services/rfq";

const loading = ref(false);
const error = ref("");
const rows = ref([]);

const cols = [
  { name: "id", label: "ID", field: "id", align: "left" },
  { name: "status", label: "Статус", field: "status", align: "left" },
  { name: "qty", label: "Кол-во", field: "qty", align: "left" },
  { name: "created_at", label: "Создано", field: "created_at", align: "left" },
];

async function load() {
  error.value = "";
  loading.value = true;
  try {
    const data = await listRfq();
    rows.value = Array.isArray(data) ? data : (data.items || []);
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || "load error";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>
