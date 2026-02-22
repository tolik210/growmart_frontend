<template>
  <div class="card">
    <div class="row" style="justify-content:space-between">
      <h2>Logistics Shipments</h2>
      <button class="btn" @click="load" :disabled="loading">{{ loading ? "..." : "Reload" }}</button>
    </div>

    <p v-if="err" class="small" style="color:#b91c1c">{{ err }}</p>

    <div class="card" style="margin-top:10px">
      <h3>Create shipment</h3>
      <div class="row">
        <input v-model="contract_id" placeholder="contract_id (uuid)" style="min-width:340px" />
        <input v-model="pickup_addr" placeholder="pickup address" style="min-width:240px" />
        <input v-model="dropoff_addr" placeholder="dropoff address" style="min-width:240px" />
        <button class="btn primary" @click="create" :disabled="creating">{{ creating ? "..." : "Create" }}</button>
      </div>
      <p class="small">Если backend ожидает другие поля — скажи, подгоним под твой контроллер.</p>
    </div>

    <table v-if="items.length" style="margin-top:10px">
      <thead>
        <tr>
          <th>ID</th>
          <th>Contract</th>
          <th>Status</th>
          <th>Provider</th>
          <th>Provider shipment</th>
          <th>Updated</th>
          <th>Change status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in items" :key="s.id">
          <td>{{ s.id }}</td>
          <td>{{ s.contract_id }}</td>
          <td>{{ s.status }}</td>
          <td>{{ s.provider }}</td>
          <td>{{ s.provider_shipment_id }}</td>
          <td>{{ s.updated_at || s.created_at }}</td>
          <td>
            <div class="row">
              <select v-model="statusMap[s.id]">
                <option value="created">created</option>
                <option value="in_transit">in_transit</option>
                <option value="delivered">delivered</option>
                <option value="cancelled">cancelled</option>
              </select>
              <button class="btn" @click="setStatus(s.id)" :disabled="savingId===s.id">
                {{ savingId===s.id ? "..." : "Save" }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="small" style="margin-top:10px">No shipments.</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { listShipments, createShipment, updateShipmentStatus } from "../../api/partner"

const items = ref([])
const loading = ref(false)
const creating = ref(false)
const savingId = ref("")
const err = ref("")

const contract_id = ref("")
const pickup_addr = ref("")
const dropoff_addr = ref("")
const statusMap = reactive({})

async function load(){
  loading.value = true
  err.value = ""
  try{
    const res = await listShipments()
    items.value = Array.isArray(res) ? res : (res.items || [])
    // init status map
    for(const s of items.value){
      statusMap[s.id] = s.status || "created"
    }
  }catch(e){
    err.value = e.message || "error"
  }finally{
    loading.value = false
  }
}

async function create(){
  if(!contract_id.value) { err.value = "contract_id required"; return }
  creating.value = true
  err.value = ""
  try{
    await createShipment({
      contract_id: contract_id.value,
      pickup_addr: pickup_addr.value,
      dropoff_addr: dropoff_addr.value
    })
    contract_id.value = ""
    pickup_addr.value = ""
    dropoff_addr.value = ""
    await load()
  }catch(e){
    err.value = e.message || "error"
  }finally{
    creating.value = false
  }
}

async function setStatus(id){
  savingId.value = id
  err.value = ""
  try{
    await updateShipmentStatus(id, { status: statusMap[id] })
    await load()
  }catch(e){
    err.value = e.message || "error"
  }finally{
    savingId.value = ""
  }
}

onMounted(load)
</script>
