<script setup lang="ts">
import SgHeader from "./components/molecules/SgHeader.vue"
</script>

<template>
  <header>
    <SgHeader></SgHeader>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
  </footer>
</template>

<style scoped lang="scss">
#logo {
  color: var(--default-text-dark);
  text-decoration: none;
}

header {
  border-bottom: 3px solid var(--bg2-dark);
  padding: 0 2rem;
}
</style>
