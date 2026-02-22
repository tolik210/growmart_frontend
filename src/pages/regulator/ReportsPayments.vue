<template>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h2>Regulator: Payments report</h2>
      <button class="btn" @click="load" :disabled="loading">{{ loading ? "..." : "Reload" }}</button>
    </div>

    <p v-if="err" class="small" style="color:#b91c1c">{{ err }}</p>

    <table v-if="items.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Contract</th>
          <th>Status</th>
          <th>Amount</th>
          <th>Currency</th>
          <th>Method</th>
          <th>Provider</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in items" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.contract_id }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.amount }}</td>
          <td>{{ p.currency }}</td>
          <td>{{ p.method }}</td>
          <td>{{ p.provider }}</td>
          <td>{{ p.created_at }}</td>
        </tr>
      </tbody>
    </table>

    <details v-else>
      <summary>No items / show raw</summary>
      <pre class="small">{{ raw }}</pre>
    </details>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { reportPayments } from "../../api/regulator"

const items = ref([])
const raw = ref(null)
const loading = ref(false)
const err = ref("")

async function load(){
  loading.value = true
  err.value = ""
  try{
    const res = await reportPayments()
    raw.value = res
    items.value = Array.isArray(res) ? res : (res.items || [])
  }catch(e){
    err.value = e.message || "error"
  }finally{
    loading.value = false
  }
}

onMounted(load)
</script>
