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
.grid {
  border: 20px solid green;
  width: fit-content;
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

.snake:first-child {
  background-image: url('/public/img/skin1_head.svg');
}

.snake {
  background-image: url('/public/img/skin1_body.svg');
}

.snake-head {
  background-image: url('/public/img/skin1_head.svg');
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

.food {
  background-color: red; /* Color for food cell */
}
</style>
