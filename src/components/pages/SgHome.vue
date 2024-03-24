<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPlay = () => {
  router.push('/play')
}
</script>

<template>
    <section class="main-window">
        <ul class="main-menu">
          <li><RouterLink to="/play">Play</RouterLink></li>
          <li><RouterLink to="/create-room">Create room</RouterLink></li>
          <li><RouterLink to="/skins">Skins</RouterLink></li>
          <li><RouterLink to="/settings">Settings</RouterLink></li>
        </ul>
    </section>
</template>

<style lang="scss">
</style>