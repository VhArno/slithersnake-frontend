import type { RegisterPayload, User } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { myAxios } from '@/instances/myAxios'
import router from '@/router'
import { getUser, postLogin } from '@/services/dataService'


export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const getUserDetails = async () => {
    if (user.value) return user.value

    try {
        const {data: user} = await getUser<User>()
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
    // todo: redirect with vue-router?
    router.push('/profile')
  }
  
  const logout = async () => {
    await myAxios.post('/logout')
    user.value = null
    // todo: redirect with vue-router?
    router.push('/login')
  }
  
  const register = async (payload: RegisterPayload) => {
    await myAxios.post('/register', payload)
    await login({email: payload.email, password: payload.password})
    // todo: redirect with vue-router?
    router.push('/profile')
  }
  
  return { login, logout, register }
})
