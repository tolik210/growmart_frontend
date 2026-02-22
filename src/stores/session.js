import { reactive } from 'vue'

export const session = reactive({
  user: null, // {uid, role, iin_bin}
})

export const setUser = (u) => { session.user = u }
export const clearUser = () => { session.user = null }
