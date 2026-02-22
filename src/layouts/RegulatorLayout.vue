<template>
  <NavBar />
  <div class="container">
    <div class="row" style="margin:12px 0;">
      <router-link class="btn" to="/regulator">Dashboard</router-link>
      <router-link class="btn" to="/regulator/reports/contracts">Contracts</router-link>
      <router-link class="btn" to="/regulator/reports/payments">Payments</router-link>
      <router-link class="btn" to="/regulator/reports/stock">Stock</router-link>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import NavBar from "../components/NavBar.vue"
</script>
