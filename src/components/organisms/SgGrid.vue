<script setup lang="ts">
import { useSkinsStore } from '@/stores/skins'
import { storeToRefs } from 'pinia'
import { defineProps } from 'vue'

defineProps<{
  gameGrid: string[][]
}>()

const skinStore = useSkinsStore()
const { selectedSkin } = storeToRefs(skinStore)

const handleKeyDown = (event: KeyboardEvent) => {
  if (
    event.key === 'ArrowUp' ||
    event.key === 'ArrowDown' ||
    event.key === 'ArrowLeft' ||
    event.key === 'ArrowRight' ||
    event.key === ' '
  ) {
    event.preventDefault()
  }
}
</script>

<template>
  <div class="grid" tabindex="0" @keydown.prevent="handleKeyDown">
    <div v-for="(row, rowIndex) in gameGrid" :key="rowIndex" class="row">
      <div
        v-for="(cell, colIndex) in row"
        ref="cells"
        :key="colIndex"
        :class="['cell', cell, { snake: cell === 'snake', 'snake-head': cell === 'snake-head' }]"
        :style="[
          cell === 'snake'
            ? {
                backgroundImage: `url(${selectedSkin.imgBody})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }
            : null,
          cell === 'snake-head'
            ? {
                backgroundImage: `url(${selectedSkin.imgHead})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }
            : null
        ]"
      ></div>
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
  background-color: aqua;
}

.grid {
  background-image: url('/src/assets/img/playBg.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  border: 10px solid green;
}

.enemy {
  background-color: orange;
}

.ghostedSnakeHead {
  background-color: rgba(131, 195, 131, 0.649);
}

.ghostedSnake {
  background-color: rgba(131, 195, 131, 0.649);
}

.ghostedEnemy {
  background-color: rgba(131, 195, 131, 0.649);
}

.invisibleEnemy{
  background-color: rgba(0, 0, 255, 0);
}

.food {
  background-image: url('../../assets/img/apple.png');
  background-size: cover;
}

.obstacles {
  background-image: url('../../assets/img/obstacle.jpg');
  background-size: cover;
}

.magnet {
  background-image: url('../../assets/img/magnet.png');
  background-size: cover;
}

.swiftness {
  background-image: url('../../assets/img/swiftness.png');
  background-size: cover;
}

.ghost {
  background-image: url('../../assets/img/ghost.png');
  background-size: cover;
}

.invisibility {
  background-image: url('../../assets/img/invisibility.png');
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
  width: 30px; /* Adjust based on desired cell size */
  height: 30px; /* Adjust based on desired cell size */
  border: 1px solid #ffffff3b;
}
</style>
