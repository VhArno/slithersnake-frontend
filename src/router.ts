import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './components/pages/SgHome.vue'
import PlayView from './components/pages/SgPlay.vue'
import CreateRoomView from './components/pages/SgCreateRoom.vue'
import SkinsView from './components/pages/SgSkins.vue'
import SettingsView from './components/pages/SgSettings.vue'
import ProfileView from './components/pages/SgProfile.vue'
import LoginView from './components/pages/SgLogin.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/play', component: PlayView },
  { path: '/create-room', component: CreateRoomView },
  { path: '/skins', component: SkinsView },
  { path: '/settings', component: SettingsView },
  { path: '/profile', component: ProfileView },
  { path: '/login', component: LoginView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router