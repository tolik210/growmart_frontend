<template>
  <div class="card">
    <h2>Regulator Cabinet</h2>
    <p class="small">Отчёты по договорам/платежам/остаткам.</p>
    <div class="row" style="margin-top:10px">
      <router-link class="btn" to="/regulator/reports/contracts">Contracts</router-link>
      <router-link class="btn" to="/regulator/reports/payments">Payments</router-link>
      <router-link class="btn" to="/regulator/reports/stock">Stock</router-link>
    </div>
  </div>
</template>
