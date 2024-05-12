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
  sessionStorage.setItem('creator', "true")
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
      <div class="main-menu">
        <SgButton @click="goFindGame"><RouterLink to="/find-game">Play</RouterLink></SgButton>
        <SgButton @click="goCreateRoom"><RouterLink to="/create-room">Create room</RouterLink></SgButton>
        <SgButton @click="goSkins"><RouterLink to="/skins">Skins</RouterLink></SgButton>
        <SgButton @click="goSettings"><RouterLink to="/settings">Settings</RouterLink></SgButton>
      </div>
  </section>
</template>

<style scoped lang="scss">
.main-window {
  background-image: url('/src/assets/img/SgBackground.jpg');
  background-size: cover;
  height: 76vh;
  padding-top: 10rem;

  .main-menu {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 80%;
    margin: auto;
    padding: 2rem 0rem;
    border-radius: 10px;
    background-color: var(--bg2-dark);

    button {
      width: 80%;
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

/* Breakpoints */
@media (width >= 65em) {
  .main-window {
    padding: 5rem 0rem;
    background-size: cover;
    height: 76vh;

    .main-menu {
      width: 30%;
      padding: 2rem 0rem;
      border-radius: 10px;
      background-color: var(--bg2-dark);

      button {
        width: 80%;
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
}
</style>