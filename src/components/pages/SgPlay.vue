<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import SgGrid from '@/components/organisms/SgGrid.vue'
import { usePlayStore } from '@/stores/play'
import SgSoundRange from '../atoms/SgSoundRange.vue'
import SgButton from '../atoms/SgButton.vue'
import { Socket } from 'socket.io-client'
//import { watch } from 'fs'

//audios

const gameMusic = ref()
const pickupSound = ref()
const endGameSound = ref()
const gameStatus = ref<boolean>(false)

const playStore = usePlayStore()
const settingsStore = useSettingsStore()
const { volume } = storeToRefs(settingsStore)

//creeer timer van 3 seconden wanneer dit pagina is geladen
const timer = ref(3)

// Initialiseer het spel wanneer het component is gemount
onMounted(() => {
  const socket: Socket = inject('socket') as Socket
  playStore.setGameMusic(gameMusic.value)
  playStore.setPickupSound(pickupSound.value)
  playStore.setEndGameSound(endGameSound.value)

  playStore.initializeGame()
  playStore.initializeSocket(socket)

  const interval = setInterval(() => {
    timer.value--
    if (timer.value === 0) {
      if (gameStatus.value === true) {
        return
      } else {
        playStore.startGameLoop()
        gameStatus.value = true
        clearInterval(interval)
      }
    }
  }, 1000)

  /* got rid of click to play
  const grid = document.getElementById('grid')
  grid?.addEventListener('click', () => {
    if (gameStatus.value === 'started') {
      return
    }
    playStore.startGameLoop()
    gameStatus.value = 'started'
  })*/
})
</script>

<template>
  <section class="main-sec">
    <div class="countdown" v-if="timer > 0">
      {{ timer }}
    </div>
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

  .countdown {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 3rem;
    padding: 1rem 2rem;

    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

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
