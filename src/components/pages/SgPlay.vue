<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { onKeyStroke, useUrlSearchParams } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import SgGrid from '@/components/organisms/SgGrid.vue'
import { usePlayStore } from '@/stores/play'
import SgSoundRange from '../atoms/SgSoundRange.vue'
import SgButton from '../atoms/SgButton.vue'
import { Socket } from 'socket.io-client'
import router from '@/router'
//import { watch } from 'fs'

//audios

const gameMusic = ref()
const pickupSound = ref()
const endGameSound = ref()
const gameStatus = ref()

const playStore = usePlayStore()
const settingsStore = useSettingsStore()
const { volume } = storeToRefs(settingsStore)

const socket: Socket = inject('socket') as Socket
// Initialiseer het spel wanneer het component is gemount
onMounted(() => {
  playStore.setGameMusic(gameMusic.value)
  playStore.setPickupSound(pickupSound.value)
  playStore.setEndGameSound(endGameSound.value)

  playStore.initializeGame()
  playStore.initializeSocket(socket)

  const grid = document.getElementById('grid')
  grid?.addEventListener('click', () => {
    if (gameStatus.value === 'started') {
      return
    }
    playStore.startGameLoop()
    gameStatus.value = 'started'
  })
})

socket.on('evacuateRoom', (roomId: string) => {
  if (roomId === useUrlSearchParams('history').id) {
    router.push('/')
  }
})

socket.on('gameOver', () => {
  router.push('/')
})
</script>

<template>
  <section class="main-sec">
    <SgGrid id="grid" :gameGrid="playStore.gameGrid"></SgGrid>

    <div class="scoreboard">
      <div v-if="playStore.remainingTime != 0">Time left: {{ playStore.remainingTime }}</div>
      <div class="players">
        <h3>Scorebord</h3>

        <div class="player-1">
          <p>Jij (lvl. 11)</p>
          <span>{{ playStore.score }}</span>
        </div>
        <!-- Andere spelerscores -->
      </div>

      <div class="score-settings">
        <SgSoundRange v-model:modelValue="playStore.volume"></SgSoundRange>
        <SgButton class="leave-btn" @click="playStore.leaveGame">Verlaten</SgButton>
      </div>
    </div>
    <audio
      ref="endGameSound"
      hidden
      preload="auto"
      src="/src/assets/sounds/game_end-defeat.wav"
      :volume="volume / 100"
    ></audio>
    <audio
      ref="gameMusic"
      hidden
      loop
      preload="auto"
      src="/src/assets/sounds/game_music.wav"
      :volume="volume / 100"
    ></audio>
    <audio
      ref="pickupSound"
      hidden
      preload="auto"
      src="/src/assets/sounds/power-up_pickup.wav"
      :volume="volume / 100"
    ></audio>
  </section>
</template>

<style scoped lang="scss">
.main-sec {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  position: relative;
  margin-top: 2rem;
  gap: 2rem;

  .scoreboard {
    position: absolute;
    right: 2rem;
    height: calc(100% - 2rem);

    display: flex;
    flex-flow: column;
    justify-content: space-between;
    padding: 1rem;
    border-radius: 10px;
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);

    .players {
      display: flex;
      flex-flow: column;
      gap: 1rem;

      > div {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
      }
    }

    .score-settings {
      display: flex;
      flex-flow: column;
      gap: 1rem;
    }
  }
}

@media (max-width: 1400px) {
  .scoreboard {
    position: static !important;
    height: auto !important;
    width: 60%;
  }
}
</style>
