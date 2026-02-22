<template>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h2>Payment Details</h2>
      <div class="row">
        <router-link class="btn" to="/partner/bank/payments">Back</router-link>
        <button class="btn" @click="load" :disabled="loading">{{ loading ? "..." : "Reload" }}</button>
      </div>
    </div>

    <p v-if="err" class="small" style="color:#b91c1c">{{ err }}</p>

    <div v-if="pay" class="card" style="margin-top:10px">
      <div class="row">
        <div><strong>ID:</strong> {{ pay.id }}</div>
        <div><strong>Status:</strong> {{ pay.status }}</div>
      </div>
      <div class="row" style="margin-top:8px">
        <div><strong>Contract:</strong> {{ pay.contract_id }}</div>
        <div><strong>Amount:</strong> {{ pay.amount }} {{ pay.currency }}</div>
      </div>
      <div class="row" style="margin-top:8px">
        <div><strong>Method:</strong> {{ pay.method }}</div>
        <div><strong>Provider:</strong> {{ pay.provider }}</div>
      </div>
      <div class="row" style="margin-top:8px">
        <div><strong>Created:</strong> {{ pay.created_at }}</div>
      </div>

      <details style="margin-top:10px">
        <summary>Raw JSON</summary>
        <pre class="small">{{ pay }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useRoute } from "vue-router"
import { partnerBankPaymentDetails } from "../../api/partner"

const route = useRoute()
const loading = ref(false)
const err = ref("")
const pay = ref(null)

async function load(){
  loading.value = true
  err.value = ""
  try{
    const res = await partnerBankPaymentDetails(route.params.id)
    pay.value = res
  }catch(e){
    err.value = e.message || "error"
  }finally{
    loading.value = false
  }
}

watch(() => route.params.id, load)
onMounted(load)
</script>
