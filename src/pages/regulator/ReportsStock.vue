<template>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h2>Regulator: Stock report</h2>
      <button class="btn" @click="load" :disabled="loading">{{ loading ? "..." : "Reload" }}</button>
    </div>

    <p v-if="err" class="small" style="color:#b91c1c">{{ err }}</p>

    <table v-if="items.length">
      <thead>
        <tr>
          <th>Product</th>
          <th>Title</th>
          <th>Crop</th>
          <th>Unit</th>
          <th>Stock</th>
          <th>Reserved</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in items" :key="s.id || s.product_id">
          <td>{{ s.id || s.product_id }}</td>
          <td>{{ s.title }}</td>
          <td>{{ s.crop_name }}</td>
          <td>{{ s.unit }}</td>
          <td>{{ s.stock }}</td>
          <td>{{ s.reserved }}</td>
          <td>{{ s.price }}</td>
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
import { reportStock } from "../../api/regulator"

const items = ref([])
const raw = ref(null)
const loading = ref(false)
const err = ref("")

async function load(){
  loading.value = true
  err.value = ""
  try{
    const res = await reportStock()
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
