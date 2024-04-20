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

const routes = [
  { path: '/', component: HomeView },
  { path: '/character-select', component: CharSelectView },
  { path: '/play', component: PlayView },
  { path: '/find-game', component: FindGame },
  { path: '/create-room', component: CreateRoomView },
  { path: '/skins', component: SkinsView },
  { path: '/settings', component: SettingsView },
  { path: '/profile', component: ProfileView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router