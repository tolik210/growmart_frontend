<template>
  <div style="border-bottom:1px solid #eee; background:#fff;">
    <div class="container row" style="justify-content:space-between;">
      <div class="row">
        <strong>GrowMart</strong>
        <span class="small">role: {{ role || 'guest' }}</span>
      </div>
      <div class="row">
        <router-link class="btn" to="/">Home</router-link>
        <router-link v-if="role==='buyer_b2b'||role==='buyer_c2b'||role==='admin'" class="btn" to="/app/buyer">Buyer</router-link>
        <router-link v-if="role==='farmer'||role==='admin'" class="btn" to="/app/seller">Seller</router-link>
        <router-link v-if="role==='gov'||role==='admin'" class="btn" to="/regulator">Regulator</router-link>
        <router-link v-if="role==='bank'||role==='logistic_partner'||role==='admin'" class="btn" to="/partner">Partner</router-link>
        <router-link v-if="role==='admin'" class="btn" to="/admin">Admin</router-link>
        <button v-if="logged" class="btn" @click="doLogout">Logout</button>
        <router-link v-else class="btn primary" to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { getRole, isLoggedIn, logout } from "../utils/jwt"
import { useRouter } from "vue-router"

const router = useRouter()
const role = computed(() => getRole())
const logged = computed(() => isLoggedIn())

function doLogout(){
  logout()
  router.push("/login")
}
</script>
