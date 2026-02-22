<template>
  <NavBar />
  <div class="container">
    <div class="row" style="margin:12px 0;">
      <router-link class="btn" to="/partner">Dashboard</router-link>
      <router-link class="btn" to="/partner/bank/payments">Bank Payments</router-link>
      <router-link class="btn" to="/partner/logistics/shipments">Shipments</router-link>
    </div>
    <router-view />
  </div>
</template>
<script setup>
import NavBar from "../components/NavBar.vue"
</script>
