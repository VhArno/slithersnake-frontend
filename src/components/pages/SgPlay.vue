<script setup lang="ts">
import { ref, onMounted, inject, watchEffect } from 'vue'
import { onKeyStroke, useUrlSearchParams } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import SgGrid from '@/components/organisms/SgGrid.vue'
import { usePlayStore } from '@/stores/play'
import SgSoundRange from '../atoms/SgSoundRange.vue'
import SgButton from '../atoms/SgButton.vue'
import { Socket } from 'socket.io-client'
import router from '@/router'
import { v4 as uuidv4 } from 'uuid'
import { useAuthStore } from '@/stores/auth'

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
const gameOver = ref<boolean>(false)

const socket: Socket = inject('socket') as Socket
const duelId = ref<number>(0)

const isCreator = sessionStorage.getItem('crt')
sessionStorage.removeItem('crt')
console.log(isCreator)
if (isCreator) {
  const randomGuid: string = uuidv4()
  socket.emit('nextGameUrl', useUrlSearchParams('history').id, randomGuid)
}
// sessionStorage.removeItem('creator')

// Initialiseer het spel wanneer het component is gemount
onMounted(() => {
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

  socket.on('nextGameUrl', (roomId: string, newRoomId: string) => {
    console.log(roomId)
    console.log(useUrlSearchParams('history').id)
    console.log(newRoomId)

    if (roomId === useUrlSearchParams('history').id) {
      sessionStorage.setItem('newRoom', newRoomId)
    }
  })

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

socket.on('evacuateRoom', (roomId: string) => {
  if (roomId === useUrlSearchParams('history').id) {
    console.log('evacuating')
    router.push('/')
  }
})

socket.on('evacuateOthers', (roomId: string) => {
  if (roomId === useUrlSearchParams('history').id) {
    console.log('evacuating ohters')
    router.push('/')
  }
})

socket.on('duelId', (duel: number) => {
  duelId.value = duel
})

const backToLobby = () => {
  console.log('back to lobby')
  sessionStorage.setItem('creator', 'true')
  console.log('---Play Session Storage---')
  console.log(sessionStorage.getItem('newRoom'))
  socket.emit('evacuateOthers', useUrlSearchParams('history').id)
  socket.emit('prepNewRoom', useUrlSearchParams('history').id, socket.id)
  router.push('/')
}

const postUserData = () => {
  if (useAuthStore().isAuthenticated) {
    playStore.saveUserDuelData({ 
      duel_id: duelId.value, 
      score: playStore.score,
      won: false,
      kills: playStore.kills
    })
  }
}

watchEffect(() => {
  if (playStore.gameOver) {
    postUserData()
  }
})
</script>

<template>
  <section class="main-sec">
    <div class="countdown" v-if="timer > 0">
      {{ timer }}
    </div>

    <div class="game-over countdown" v-if="playStore.gameOver">
      <p>Game over!</p>
      <SgButton v-if="isCreator" @click="backToLobby()">Go back to lobby</SgButton>
    </div>

    <SgGrid id="grid" :gameGrid="playStore.gameGrid"></SgGrid>

    <div class="scoreboard">
      <div v-if="playStore.remainingTime != 0">Time left: {{ playStore.remainingTime }}</div>
      <div class="players">
        <h3>Scorebord</h3>

        <div class="player-1">
          <p>Jij (lvl. {{ useAuthStore().user?.level }})</p>
          <span>{{ playStore.score }}</span>
        </div>
        <!-- Andere spelerscores -->
      </div>

      <div class="score-settings">
        <SgSoundRange class="sound-range" v-model:modelValue="playStore.volume"></SgSoundRange>
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
  position: relative;
  position: relative;
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

    button {
      font-size: 0.5em;
    }
  }

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

    button {
      font-size: 0.5em;
    }
  }

  .scoreboard {
    position: absolute;
    right: 2rem;
    height: calc(100% - 2rem);

    display: flex;
    flex-flow: column;
    justify-content: space-between;
    gap: 1rem;
    gap: 1rem;
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

    .score-settings {
      .sound-range {
        width: 60%;
      }
    }

    .score-settings {
      .sound-range {
        width: 60%;
      }
    }
  }
}
</style>
