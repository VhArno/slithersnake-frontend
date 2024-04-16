<script setup lang="ts">
import { onMounted } from 'vue';
import SgHeader from './components/molecules/SgHeader.vue'
import { useSettingsStore } from './stores/settings';

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.loadData()
})

settingsStore.$subscribe(() => {
  settingsStore.saveData()
})
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
