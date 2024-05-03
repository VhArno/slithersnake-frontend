import type { Player, RegisterPayload } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { myAxios } from '@/instances/myAxios'
import router from '@/router'
import { getUser, postLogin, postLogout, postRegister } from '@/services/dataService'


export const useAuthStore = defineStore('auth', () => {
  const user = ref<Player | null>(null)

  const getUserDetails = async () => {
    if (user.value) return user.value

    try {
        const {data: user} = await getUser<Player>()
        return user
    } catch (e) {
        return null
    }
  }
  
  const initUser = async () => {
    user.value = await getUserDetails()
  }
  
  const login = async (payload: {email: string, password: string}) => {
    await postLogin(payload)
    await initUser()
    router.push('/profile')
  }
  
  const logout = async () => {
    await postLogout()
    user.value = null
    router.push('/login')
  }
  
  const register = async (payload: RegisterPayload) => {
    await postRegister(payload)
    await login({email: payload.email, password: payload.password})
    router.push('/profile')
  }
  
  return { user, login, logout, register }
})
