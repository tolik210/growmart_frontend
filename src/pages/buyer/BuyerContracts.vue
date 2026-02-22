<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Мои контракты (Buyer)</div>
      <q-btn flat color="purple-4" label="Назад" @click="$router.push('/buyer')" />
    </div>

    <q-card v-for="c in items" :key="c.id" class="q-mb-sm bg-grey-10 text-white">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold">#{{ c.id.slice(0,8) }} • {{ c.status }}</div>
          <div class="text-grey-5">Сумма: {{ c.total_amount }} {{ c.currency || 'KZT' }}</div>
        </div>

        <q-btn color="purple-4" label="Открыть" @click="$router.push('/buyer/contracts/' + c.id)" />
      </q-card-section>
    </q-card>

    <div v-if="!items.length" class="text-grey-6">Пока нет контрактов.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useQuasar } from "quasar";
import { apiMyContracts } from "src/services/contracts";

const $q = useQuasar();
const items = ref([]);

onMounted(async () => {
  try {
    const data = await apiMyContracts();
    items.value = data.items || data || [];
  } catch (e) {
    $q.notify({ type: "negative", message: e?.message || "Не удалось загрузить контракты" });
  }
});
</script>
