<script setup lang="ts">
import SgHeader from './components/molecules/SgHeader.vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  console.log('connected')

  socket.emit('message', socket.id)
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

<style scoped lang="scss"></style>
