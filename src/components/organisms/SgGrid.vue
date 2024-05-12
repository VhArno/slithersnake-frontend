<script setup lang="ts">
import { useSkinsStore } from '@/stores/skins';
import { storeToRefs } from 'pinia';
import { defineProps } from 'vue'

defineProps<{
  gameGrid: string[][]
}>()

const skinStore = useSkinsStore()
const { selectedSkin } = storeToRefs(skinStore)
</script>

<template>
  <div class="grid">
    <div v-for="(row, rowIndex) in gameGrid" :key="rowIndex" class="row">
      <div v-for="(cell, colIndex) in row" ref="cells" :key="colIndex" 
        :class="['cell', cell, { 'snake': cell === 'snake', 'snake-head': cell === 'snake-head' }]" 
        :style="[cell === 'snake' ? { 
          backgroundImage: `url(${selectedSkin.imgBody})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        } : null, cell === 'snake-head' ? { 
          backgroundImage: `url(${selectedSkin.imgHead})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover' 
        } : null]"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid {
  background-image: url('/src/assets/img/playBg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  border: 10px solid green;
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
  border: 1px solid #ffffff3b;
}

.food {
  background-color: red; /* Color for food cell */
}

.powerUp{
  background-color: yellow;
}
</style>
