<script setup lang="ts">
import { defineProps, ref } from 'vue'

const props = defineProps<{
  gameGrid: string[][]
}>()
</script>

<template>
  <div class="grid">
    <div v-for="(row, rowIndex) in gameGrid" :key="rowIndex" class="row">
      <div v-for="(cell, colIndex) in row" ref="cells" :key="colIndex" :class="['cell', cell]"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid {
  border-width: 30px; /* Set border width */
  border-style: solid; /* Set border style */
  border-image-source: url('/src/assets/img/360_F_270217079_JhxcnAedqOXr8sHNpbAk7zTAryQitbL2.jpg'); /* Specify the path to your image */
  border-image-slice: 20; /* Define how the image should be sliced */
  border-image-repeat: no-repeat; /* Specify how the image should be repeated */
  background-size: contain;
}

.row {
  display: flex;
  background-color: #ccc;
}

.powerUp{
  background-color: yellow;
}

.snake-head{
  background-image: url('/public/img/skin1_head.svg');
}

.snake {
  background-image: url('/public/img/skin1_body.svg');
  background-repeat: no-repeat;
  background-size: cover;
}

.snake-head {
  background-image: url('/public/img/skin1_head.svg');
  background-repeat: no-repeat;
  background-size: cover;
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
  width: 30px; /* Adjust based on desired cell size */
  height: 30px; /* Adjust based on desired cell size */
  border: 1px solid var(--main-bg-dark); /* Optional: Add borders for visualization */
}

.food {
  background-color: red; /* Color for food cell */
}
</style>
