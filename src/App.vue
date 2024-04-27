<script setup lang="ts">
import { onMounted } from 'vue'
import SgHeader from './components/molecules/SgHeader.vue'
import { useSettingsStore } from './stores/settings'
import { provide } from 'vue'

import { io, Socket } from 'socket.io-client'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.loadData()
})

settingsStore.$subscribe(() => {
  settingsStore.saveData()
})

const socket: Socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('Connected to server')
})

if (socket) {
  provide('socket', socket)
}
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

<style scoped lang="scss"></style>
