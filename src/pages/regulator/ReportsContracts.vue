<template>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h2>Regulator: Contracts report</h2>
      <button class="btn" @click="load" :disabled="loading">{{ loading ? "..." : "Reload" }}</button>
    </div>

    <p v-if="err" class="small" style="color:#b91c1c">{{ err }}</p>

    <table v-if="items.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Buyer</th>
          <th>Seller</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Currency</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in items" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.status }}</td>
          <td>{{ c.buyer_id }}</td>
          <td>{{ c.seller_id }}</td>
          <td>{{ c.qty }}</td>
          <td>{{ c.total_amount }}</td>
          <td>{{ c.currency }}</td>
          <td>{{ c.created_at }}</td>
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
import { reportContracts } from "../../api/regulator"

const items = ref([])
const raw = ref(null)
const loading = ref(false)
const err = ref("")

async function load(){
  loading.value = true
  err.value = ""
  try{
    const res = await reportContracts()
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
