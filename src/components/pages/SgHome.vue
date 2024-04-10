<script setup lang="ts">
import { useRouter } from 'vue-router'
import SgButton from '../atoms/SgButton.vue'

const router = useRouter()

const goToPlay = () => {
  router.push('/play')
}
const goFindGame = () => {
  router.push('/find-game')
}
const goCreateRoom = () => {
  router.push('/create-room')
}
const goSkins = () => {
  router.push('/skins')
}
const goSettings = () => {
  router.push('/settings')
}
</script>

<template>
    <section class="main-window">
        <ul class="main-menu">
          <SgButton @click="goFindGame"><RouterLink to="/find-game">Play</RouterLink></SgButton>
          <SgButton @click="goCreateRoom"><RouterLink to="/create-room">Create room</RouterLink></SgButton>
          <SgButton @click="goSkins"><RouterLink to="/skins">Skins</RouterLink></SgButton>
          <SgButton @click="goSettings"><RouterLink to="/settings">Settings</RouterLink></SgButton>
        </ul>
    </section>
</template>

<style scoped lang="scss">
.main-window {
  margin: 2rem auto;
  padding: 0.5rem;

  .main-menu {
    button {
      background-color: var(--dark-gray);

      a {
        text-decoration: none;      
        color: var(--default-text-dark);
      }

      &:hover {
        background-color: #6e6e6e;
      }
    }
  }
}
</style>