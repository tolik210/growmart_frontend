<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Контракт #{{ id.slice(0,8) }}</div>
      <q-btn flat color="purple-4" label="Назад" @click="$router.push('/buyer/contracts')" />
    </div>

    <q-card class="bg-grey-10 text-white q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">Статус: <b>{{ c.status }}</b></div>
        <div class="text-grey-5">Сумма: {{ c.total_amount }} {{ c.currency || 'KZT' }}</div>
      </q-card-section>
    </q-card>

    <q-card class="bg-grey-10 text-white q-mb-md">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold q-mb-sm">Pipeline</div>
        <div class="text-grey-5">draft → signed → active → delivered → completed</div>

        <div class="q-mt-md row q-gutter-sm">
          <q-btn v-if="c.status === 'draft' || c.status === 'signed'" color="purple-4" label="Подписать" @click="sign" :loading="loading.sign" />
          <q-btn v-if="c.status === 'signed'" color="green-6" label="Оплатить (init+capture)" @click="pay" :loading="loading.pay" />
          <q-btn v-if="c.status === 'active'" color="blue-6" label="Доставка (create+deliver)" @click="deliver" :loading="loading.ship" />
          <q-btn v-if="c.status === 'delivered'" color="amber-8" label="ЭСФ (issue)" @click="issueEsf" :loading="loading.esf" />
          <q-btn flat color="grey-5" label="Обновить" @click="load" />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="bg-grey-10 text-white">
      <q-card-section>
        <div class="text-subtitle2 text-weight-bold q-mb-sm">Подписи</div>
        <div v-for="s in sigs" :key="s.id" class="text-grey-5 q-mb-xs">
          {{ s.signer_role }} • verified={{ s.verified }} • {{ s.iin_bin || '-' }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { apiContract, apiContractSignatures, apiSigningPayload, apiContractSign } from "src/services/contracts";
import { apiPaymentInit, apiPaymentCapture } from "src/services/payments";
import { apiShipmentCreate, apiShipmentDeliver } from "src/services/shipments";
import { apiEsfIssue } from "src/services/esf";

const $q = useQuasar();
const route = useRoute();
const id = route.params.id;

const c = ref({ status: "draft" });
const sigs = ref([]);

const loading = ref({ sign:false, pay:false, ship:false, esf:false });

async function load() {
  const data = await apiContract(id);
  c.value = data;
  const s = await apiContractSignatures(id);
  sigs.value = s.items || [];
}

function mockSignatureBase64(payloadSha) {
  // mock подпись: просто base64("MOCK:" + sha)
  return btoa("MOCK:" + payloadSha);
}

async function sign() {
  loading.value.sign = true;
  try {
    const p = await apiSigningPayload(id);
    const sig = mockSignatureBase64(p.payload_sha256 || "");
    await apiContractSign(id, sig, "");
    $q.notify({ type: "positive", message: "Подписано (mock) ✅" });
    await load();
  } catch (e) {
    $q.notify({ type: "negative", message: e?.message || "Ошибка подписи" });
  } finally {
    loading.value.sign = false;
  }
}

async function pay() {
  loading.value.pay = true;
  try {
    const init = await apiPaymentInit(id);
    const paymentId = init.payment_id || init.id;
    await apiPaymentCapture(paymentId);
    $q.notify({ type: "positive", message: "Оплата captured ✅" });
    await load();
  } catch (e) {
    $q.notify({ type: "negative", message: e?.message || "Ошибка оплаты" });
  } finally {
    loading.value.pay = false;
  }
}

async function deliver() {
  loading.value.ship = true;
  try {
    const sh = await apiShipmentCreate(id);
    const shipmentId = sh.shipment_id || sh.id;
    await apiShipmentDeliver(shipmentId);
    $q.notify({ type: "positive", message: "Доставка delivered ✅" });
    await load();
  } catch (e) {
    $q.notify({ type: "negative", message: e?.message || "Ошибка доставки" });
  } finally {
    loading.value.ship = false;
  }
}

async function issueEsf() {
  loading.value.esf = true;
  try {
    await apiEsfIssue(id);
    $q.notify({ type: "positive", message: "ЭСФ issued ✅" });
    await load();
  } catch (e) {
    $q.notify({ type: "negative", message: e?.message || "Ошибка ЭСФ" });
  } finally {
    loading.value.esf = false;
  }
}

onMounted(async () => {
  try { await load(); } catch (e) {
    $q.notify({ type: "negative", message: e?.message || "Не удалось загрузить контракт" });
  }
});
</script>
