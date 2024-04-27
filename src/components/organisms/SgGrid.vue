<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  gameGrid: string[][]
}>()
</script>

<template>
  <div class="grid">
    <div v-for="(row, rowIndex) in gameGrid" :key="rowIndex" class="row">
      <div v-for="(cell, colIndex) in row" :key="colIndex" :class="['cell', cell]"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#app {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.row {
  display: flex;
}

.cell {
  border: 1px solid #ccc;
}

.powerUp{
  background-color: yellow;
}

.snake {
  background-color: green;
}

.food {
  background-color: red;
}

p {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: red;
}
.row {
  display: flex;
}

.cell {
  width: 20px; /* Adjust based on desired cell size */
  height: 20px; /* Adjust based on desired cell size */
  border: 1px solid #ccc; /* Optional: Add borders for visualization */
}

.snake {
  background-color: green; /* Color for snake cells */
}

.food {
  background-color: red; /* Color for food cell */
}
</style>
