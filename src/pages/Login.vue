<template>
  <div class="container">
    <div class="card" style="max-width:520px">
      <h2>Login</h2>
      <div class="row" style="margin-top:10px">
        <input v-model="iin_bin" placeholder="IIN/BIN" />
        <input v-model="password" placeholder="password" type="password" />
        <button class="btn primary" @click="doLogin" :disabled="loading">
          {{ loading ? "..." : "Login" }}
        </button>
      </div>
      <p class="small" v-if="err" style="color:#b91c1c">{{ err }}</p>

      <div style="margin-top:14px" class="small">
        Тестовые роли (как в БД users_role_check):
        <div>buyer_b2b / buyer_c2b / farmer / gov / bank / logistic_partner / admin</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { login } from "../api/auth.js"
import { parseJwt } from "../utils/jwt"
import { useRouter } from "vue-router"

const router = useRouter()
const iin_bin = ref("990101300011")
const password = ref("123456")
const loading = ref(false)
const err = ref("")

async function doLogin(){
  loading.value = true
  err.value = ""
  try{
    const res = await login(iin_bin.value, password.value)
    localStorage.setItem("access_token", res.access_token)
    localStorage.setItem("refresh_token", res.refresh_token || "")
    const p = parseJwt(res.access_token)
    const r = p?.role || ""

    if(r === "gov") return router.push("/regulator")
    if(r === "bank" || r === "logistic_partner") return router.push("/partner")
    if(r === "admin") return router.push("/admin")
    if(r === "farmer") return router.push("/app/seller")
    if(r === "buyer_b2b" || r === "buyer_c2b") return router.push("/app/buyer")
    router.push("/")
  } catch(e){
    err.value = e.message || "login error"
  } finally {
    loading.value = false
  }
}
</script>
