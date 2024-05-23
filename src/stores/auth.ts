import type { Player, RegisterPayload } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import router from '@/router'
import { getCsrfCookie, getUser, patchUser, postLogin, postLogout, postRegister } from '@/services/dataService'


export const useAuthStore = defineStore('auth', () => {
  const user = ref<Player | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const isAdmin = ref<boolean>(false)

  const readUserDetails = async () => {
    try {
      if (user.value !== null) {
        await initUser().catch(() => {
          user.value = null
          isAuthenticated.value = false
          isAdmin.value = false
        })
      } else {
        user.value = null
        isAuthenticated.value = false
        isAdmin.value = false
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getUserDetails = async () => {
    if (user.value) return user.value

    try {
      const {data: user} = await getUser<Player>()
      return user
    } catch (e) {
      console.error(e)
      logout()
      return null
    }
  }
  
  const initUser = async () => {
    user.value = await getUserDetails().catch()
    isAuthenticated.value = true
    if (user.value?.role == 'admin') isAdmin.value = true
  }
  
  const login = async (payload: { email: string; password: string }) => {
    try {
      user.value = null
      await getCsrfCookie()
      await postLogin(payload)
      await initUser()
      router.push({ name: 'profile' })
    } catch(err: any) {
      return err.response.data.message
    }
  }
  
  const logout = async () => {
    await postLogout().catch(() => {})

    user.value = null
    isAuthenticated.value = false
    isAdmin.value = false
    router.push({ name: 'login' })
  }
  
  const register = async (payload: RegisterPayload) => {
    try {
      await postRegister(payload)
      await login({ email: payload.email, password: payload.password })
      router.push('/profile')
    } catch (err: any) {
      return err.response.data.message
    }
  }

  const patch = async (username: string) => {
    try {
      await patchUser(username)
    } catch(err: any) {
      console.log(err.response.data.message)
      return err.response.data.message
    }
  }
  
  return { user, isAuthenticated, isAdmin, readUserDetails, getUserDetails, login, logout, register, patch }
}, 
{ persist: {
  storage: localStorage,
  paths: ['user']
}
})
