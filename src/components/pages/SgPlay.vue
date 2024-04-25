<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import SgGrid from '@/components/organisms/SgGrid.vue'
import { usePlayStore } from '@/stores/play'
import SgButton from '../atoms/SgButton.vue'
import SgSoundRange from '../atoms/SgSoundRange.vue'

// Audios
const gameMusic = ref()
const pickupSound = ref()
const endGameSound = ref()

const playStore = usePlayStore()
const settingsStore = useSettingsStore()
const { volume } = storeToRefs(settingsStore)

// Initialiseer het spel wanneer het component is gemount
onMounted(() => {
  playStore.setGameMusic(gameMusic.value)
  playStore.setPickupSound(pickupSound.value)
  playStore.setEndGameSound(endGameSound.value)

  playStore.initializeGame()
  playStore.startGameLoop()
})

</script>

<template>
  <section class="main-sec">
    <SgGrid :gameGrid="playStore.gameGrid"></SgGrid>

    <div class="scoreboard">
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
        <SgButton class="leave-btn"  @click="playStore.leaveGame">Verlaten</SgButton>
      </div>
    </div>
    <audio ref="endGameSound" hidden preload="auto" src="/src/assets/sounds/game_end-defeat.wav" :volume="volume / 100"></audio>
    <audio ref="gameMusic" hidden loop preload="auto" src="/src/assets/sounds/game_music.wav" :volume="volume / 100"></audio>
    <audio ref="pickupSound" hidden preload="auto" src="/src/assets/sounds/power-up_pickup.wav" :volume="volume / 100"></audio>
  </section>
</template>

<style scoped lang="scss">
.main-sec {
  display: flex;
  flex-flow: row;

  .grid {
    margin: 2rem;
    flex: 4;
    height: 100%;
  }

  .scoreboard {
    flex: 1;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin: 2rem;
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
</style>
