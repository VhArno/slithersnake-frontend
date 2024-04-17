<script setup lang="ts">
import { useUrlSearchParams, useClipboard } from '@vueuse/core'
import SgButton from '../atoms/SgButton.vue'
import { inject, ref, watchEffect } from 'vue'
import type { Room, Map, GameMode, Player } from '@/types/'
import SgToast from '../atoms/SgToast.vue'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'
import { io, Socket } from 'socket.io-client'

const socket: Socket = inject('socket') as Socket
const router = useRouter()
const players = ref<Player[]>([])

const player = ref<Player>({
  id: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
  username: 'test user',
  email: '',
  level: 1,
  highscore: 0,
  played: 0,
  won: 0,
  killed: 0
})

watchEffect(() => {
  if (sessionStorage.getItem('creator')) {
    const randomGuid: string = uuidv4()
    const params = useUrlSearchParams('history')
    params.id = randomGuid
    console.log(params.id)
    socket.emit('createRoom', params.id, player)
  }

  socket.on('joinedRoom', (room: Room) => {
    const params = useUrlSearchParams('history')
    if (params.id === room.id) {
      players.value = room.players
      console.log(players.value)
    }
  })
})

const params = useUrlSearchParams('history')
socket.emit('getPlayers', params.id)
socket.on('players', (room: Room) => {
  players.value = room.players
})

if (!sessionStorage.getItem('creator')) {
  const params = useUrlSearchParams('history')
  console.log(params.id)
  socket.emit('joinRoom', params.id, player)
}

// Generate a random GUID

/* toast settigns */
const showToast = ref<boolean>(false)

const toggleToast = () => {
  showToast.value = !showToast.value
}

/* getters */
const maps = ref<Map[]>([
  {
    id: 1,
    name: 'map1'
  },
  {
    id: 2,
    name: 'map2'
  },
  {
    id: 3,
    name: 'map3'
  }
])
const modes = ref<GameMode[]>([
  {
    id: 1,
    name: 'mode1'
  },
  {
    id: 2,
    name: 'mode2'
  },
  {
    id: 3,
    name: 'mode3'
  }
])

const selectedMap = ref<Map>(maps.value[0])
const selectedMode = ref<GameMode>(modes.value[0])

/* invite button */
const source = ref('Hello')
const { text, copy, copied, isSupported } = useClipboard({ source })

const invite = () => {
  copy(window.location.href)
  if (copied) {
    toggleToast()
  }
}

/* Previous and next buttons */
// Method to switch to the previous map
const prevMap = () => {
  const currentIndex = maps.value.findIndex((map) => map === selectedMap.value)
  const newIndex = (currentIndex - 1 + maps.value.length) % maps.value.length
  selectedMap.value = maps.value[newIndex]
}

// Method to switch to the next map
const nextMap = () => {
  const currentIndex = maps.value.findIndex((map) => map === selectedMap.value)
  const newIndex = (currentIndex + 1) % maps.value.length
  selectedMap.value = maps.value[newIndex]
}

// Method to switch to the previous game mode
const prevMode = () => {
  const currentIndex = modes.value.findIndex((mode) => mode === selectedMode.value)
  const newIndex = (currentIndex - 1 + modes.value.length) % modes.value.length
  selectedMode.value = modes.value[newIndex]
}

// Method to switch to the next game mode
const nextMode = () => {
  const currentIndex = modes.value.findIndex((mode) => mode === selectedMode.value)
  const newIndex = (currentIndex + 1) % modes.value.length
  selectedMode.value = modes.value[newIndex]
}

/* actions buttons */
const startGame = () => {
  router.push('/play')
  socket.emit('startGame', selectedMap.value.name, selectedMode.value.name)
}

const leaveGame = () => {
  router.push('/')
}
</script>

<template>
  <section class="create">
    <div>
      <SgToast v-if="showToast" :content="'Game link copied!'" :duration="5000"></SgToast>
    </div>

    <div class="settings">
      <div class="bg-gray players">
        <div>
          <h2>Players</h2>
          <ul class="player-list">
            <li v-for="player in players" :key="player.id">
              {{ player.username }} (lvl. <span>{{ player.level }}</span
              >)
            </li>
          </ul>
        </div>

        <SgButton @click="invite">Invite</SgButton>
      </div>

      <div class="bg-gray options">
        <h2>Game options</h2>
        <div class="game-options">
          <div>
            <h3>Map</h3>
            <div class="map-select">
              <SgButton @click="prevMap"><i class="fa-solid fa-chevron-left"></i></SgButton>
              <div class="maps">
                <div>
                  <p>{{ selectedMap?.name }}</p>
                  <img :src="selectedMap?.img" alt="map image" />
                </div>
              </div>
              <SgButton @click="nextMap"><i class="fa-solid fa-chevron-right"></i></SgButton>
            </div>
          </div>

          <div>
            <h3>Gamemode</h3>
            <div class="gamemode-select">
              <SgButton @click="prevMode" id="prev-btn"
                ><i class="fa-solid fa-chevron-left"></i
              ></SgButton>
              <div class="gamemodes">
                <div>
                  <p>{{ selectedMode?.name }}</p>
                  <img :src="selectedMode?.img" alt="mode image" />
                </div>
              </div>
              <SgButton @click="nextMode" id="next-btn"
                ><i class="fa-solid fa-chevron-right"></i
              ></SgButton>
            </div>
          </div>
        </div>
        <SgButton>Play</SgButton>
      </div>
    </div>
    <p>
      Sound <span><i class="fa-solid fa-volume-high"></i></span>
    </p>
    <SgButton @click="startGame">Start game</SgButton>
    <SgButton @click="leaveGame">Leave game</SgButton>
  </section>
</template>

<style scoped lang="scss">
.create {
  display: flex;
  flex-flow: column;
  gap: 1rem;
  width: 80%;
  margin: 1rem auto;
  padding: 1rem;
  border-radius: 10px;
  color: var(--default-text-dark);
  background-color: var(--bg2-dark);

  .settings {
    display: flex;
    flex-flow: column;
    gap: 1rem;

    .bg-gray {
      padding: 1rem;
      border-radius: 10px;
      background-color: var(--dark-gray);
    }

    .players {
      display: flex;
      flex-flow: column;
    }

    .options {
      .game-options {
        display: flex;
        flex-flow: column;
        gap: 1rem;
        margin: 1em 0em;
      }

      .gamemode-select,
      .map-select {
        display: flex;
        flex-flow: row;
        align-items: center;
        margin-top: 1rem;

        .gamemodes,
        .maps {
          flex-grow: 1;
          width: 100%;
          text-align: center;
        }

        SgButton {
          flex-shrink: 3;
          padding: 0;
          background-color: transparent;
        }
      }
    }
  }
}

/* BREAKPOINTS */
@media (width >= 65em) {
  .create {
    width: 60%;
    margin: 2rem auto;

    .settings {
      flex-flow: row;

      .bg-gray {
        flex: 1;
        width: 100%;
      }

      .players {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
      }
    }
  }
}
</style>
