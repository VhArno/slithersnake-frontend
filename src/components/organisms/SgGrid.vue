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

.powerUp {
  background-image: url('../../assets/img/swiftness.png');
  background-size: cover;
}

.snake {
  background-color: green;
}

.food {
  background-image: url('../../assets/img/apple.png');
  background-size: cover;
}

.obstacles {
  background-image: url('../../assets/img/obstacle.jpg');
  background-size: cover;
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
</style>
