<script setup lang="ts">
import SgHeader from './components/molecules/SgHeader.vue'
</script>

<template>
  <header>
    <SgHeader></SgHeader>
  </header>

  <main>
    <RouterView />
  </main>

  <footer></footer>
</template>

<style scoped lang="scss">
</style>
