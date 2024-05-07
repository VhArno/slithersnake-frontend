import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

import HomeView from './components/pages/SgHome.vue'
import CharSelectView from './components/pages/SgCharSelect.vue'
import PlayView from './components/pages/SgPlay.vue'
import FindGame from './components/pages/SgFindGame.vue'
import CreateRoomView from './components/pages/SgCreateRoom.vue'
import SkinsView from './components/pages/SgSkins.vue'
import SettingsView from './components/pages/SgSettings.vue'
import ProfileView from './components/pages/SgProfile.vue'
import LoginView from './components/pages/SgLogin.vue'
import RegisterView from './components/pages/SgRegister.vue'
import NotFoundView from './components/pages/SgNotFound.vue'
import { useAuthStore } from './stores/auth'
import { authGuard } from './guards/authGuard'
import { loginGuard } from './guards/loginGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',
      name: 'home', 
      component: HomeView 
    },
    { 
      path: '/character-select',
      name: 'character-select', 
      component: CharSelectView 
    },
    { 
      path: '/play',
      name: 'play', 
      component: PlayView 
    },
    { 
      path: '/find-game',
      name: 'find-game', 
      component: FindGame 
    },
    { 
      path: '/create-room',
      name: 'create-room', 
      component: CreateRoomView },
    { 
  
      path: '/skins',
      name: 'skins', 
      component: SkinsView 
    },
    { 
      path: '/settings',
      name: 'settings', 
      component: SettingsView 
    },
    { 
      path: '/profile',
      name: 'profile', 
      component: ProfileView,
      meta: { requiresAuth: true },
      beforeEnter: [authGuard]
    },
    { 
      path: '/login',
      name: 'login', 
      component: LoginView,
      beforeEnter: [loginGuard]
    },
    { 
      path: '/register',
      name: 'register', 
      component: RegisterView,
      beforeEnter: [loginGuard]
    },
    {
      path: '/redirect',
      redirect: {
        name: 'login'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    }
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
    return { path: '/login' }
  }

  if (to.meta.role === 'admin' && !useAuthStore().isAdmin) {
    return { path: '/redirect' }
  }
})

export default router