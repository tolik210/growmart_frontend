<template>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h2>Bank Payments</h2>
      <button class="btn" @click="load" :disabled="loading">{{ loading ? "..." : "Reload" }}</button>
    </div>

    <p v-if="err" class="small" style="color:#b91c1c">{{ err }}</p>

    <table v-if="items.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Contract</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Status</th>
          <th>Method</th>
          <th>Provider</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in items" :key="p.id">
          <td><router-link :to="`/partner/bank/payments/${p.id}`">{{ p.id }}</router-link></td>
          <td>{{ p.contract_id }}</td>
          <td>{{ p.amount }}</td>
          <td>{{ p.currency }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.method }}</td>
          <td>{{ p.provider }}</td>
          <td>{{ p.created_at }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="small">No data.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { partnerBankPayments } from "../../api/partner"

const items = ref([])
const loading = ref(false)
const err = ref("")

async function load(){
  loading.value = true
  err.value = ""
  try{
    const res = await partnerBankPayments()
    // ожидаем {items:[...]} либо [...]
    items.value = Array.isArray(res) ? res : (res.items || [])
  }catch(e){
    err.value = e.message || "error"
  }finally{
    loading.value = false
  }
}

onMounted(load)
</script>
