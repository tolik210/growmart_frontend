<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">RFQ: {{ id }}</div>
      <q-space />
      <q-btn flat color="purple-4" label="Назад" @click="$router.push('/seller/rfq')" />
    </div>

    <q-banner v-if="error" class="bg-red-10 text-white q-mb-md">{{ error }}</q-banner>

    <q-card class="bg-grey-10 text-white q-mb-md" v-if="rfq">
      <q-card-section>
        <div><b>Статус:</b> {{ rfq.status }}</div>
        <div><b>Кол-во:</b> {{ rfq.qty }}</div>
        <div><b>Комментарий:</b> {{ rfq.note || '-' }}</div>
      </q-card-section>
    </q-card>

    <q-card class="bg-grey-10 text-white">
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Сделать предложение</div>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-md-4">
            <q-input filled dark v-model.number="offer.price" label="Цена" type="number" bg-color="grey-9" />
          </div>
          <div class="col-12 col-md-4">
            <q-input filled dark v-model.number="offer.qty" label="Кол-во" type="number" bg-color="grey-9" />
          </div>
          <div class="col-12 col-md-4">
            <q-input filled dark v-model="offer.currency" label="Валюта" bg-color="grey-9" />
          </div>
          <div class="col-12">
            <q-btn color="purple-4" label="Отправить оффер" :loading="sending" @click="sendOffer" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { getRfq, createOffer } from "@/services/rfq";

const $q = useQuasar();
const route = useRoute();
const id = route.params.id;

const rfq = ref(null);
const error = ref("");
const sending = ref(false);

const offer = ref({ price: 0, qty: 0, currency: "KZT" });

async function load() {
  error.value = "";
  try {
    rfq.value = await getRfq(id);
    if (!offer.value.qty && rfq.value?.qty) offer.value.qty = rfq.value.qty;
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || "load error";
  }
}

async function sendOffer() {
  error.value = "";
  if (!offer.value.price || offer.value.price <= 0) return $q.notify({ type: "warning", message: "Укажи цену" });
  if (!offer.value.qty || offer.value.qty <= 0) return $q.notify({ type: "warning", message: "Укажи количество" });

  sending.value = true;
  try {
    await createOffer(id, {
      price: Number(offer.value.price),
      qty: Number(offer.value.qty),
      currency: offer.value.currency || "KZT",
    });
    $q.notify({ type: "positive", message: "Оффер отправлен" });
    await load();
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || "offer error";
  } finally {
    sending.value = false;
  }
}

onMounted(load);
</script>
