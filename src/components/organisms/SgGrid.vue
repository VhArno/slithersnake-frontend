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
  /*border-width: 30px;
  border-style: solid; 
  border-image-source: url('/src/assets/img/playBg.jpg'); 
  border-image-slice: 20; 
  border-image-repeat: no-repeat;
  background-size: contain;*/

  background-image: url('/src/assets/img/playBg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  border: 10px solid green;
}

.row {
  display: flex;
  //background-color: #ccc;
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
  //border: 1px solid var(--main-bg-dark); /* Optional: Add borders for visualization */

  border: 1px solid #ffffff3b;
}

.food {
  background-color: red; /* Color for food cell */
}
</style>
