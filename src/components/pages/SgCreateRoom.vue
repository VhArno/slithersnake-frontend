<script setup lang="ts">
import { useUrlSearchParams, useClipboard } from '@vueuse/core'
import SgButton from '../atoms/SgButton.vue'
import { computed, inject, ref, watchEffect } from 'vue'
import type { Room, Map, GameMode, Player } from '@/types/'
import SgToast from '../atoms/SgToast.vue'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'
import { useMapsStore } from '@/stores/maps'
import { useGamemodesStore } from '@/stores/gamemodes'
import { storeToRefs } from 'pinia'
import SgSoundRange from '../atoms/SgSoundRange.vue'
import { useSettingsStore } from '@/stores/settings'
import { Socket } from 'socket.io-client'
import { watch } from 'fs'

// pinia
/* maps store */
const mapsStore = useMapsStore()
const { selectedMap, maps } = storeToRefs(mapsStore)
selectedMap.value = maps.value[0]

let creator = false
watchEffect(() => {
  creator = sessionStorage.getItem('creator') === 'true'
})

/* modes store */
const modesStore = useGamemodesStore()
const { selectedMode, modes } = storeToRefs(modesStore)
selectedMode.value = modes.value[0]

/* settings store */
const settingsStore = useSettingsStore()
const { volume } = storeToRefs(settingsStore)

const currentRoom = ref<Room | null>(null)

// router

const socket: Socket = inject('socket') as Socket
const router = useRouter()
const players = ref<Player[]>([])

const player = ref<Player>({
  id: 'player' + Math.floor(Math.random() * (10000 - 0 + 1)) + 0,
  // id: 'player' + 0,
  username: 'test user',
  email: '',
  level: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
  highscore: 0,
  games_played: 0,
  games_won: 0,
  players_killed: 0,
  skins: [],
  role: ''
})

if (sessionStorage.getItem('creator')) {
  const randomGuid: string = uuidv4()
  const params = useUrlSearchParams('history')
  params.id = randomGuid

  setTimeout(() => {
    socket.emit('createRoom', currentRoom.value, player, params.id)
  }, 1000)
}

socket.on('gameBusy', (gId, pId) => {
  if (socket.id === pId) {
    router.push('/')
  }
})

socket.on('joinedRoom', (room: Room) => {
  const params = useUrlSearchParams('history')
  sessionStorage.setItem('players', JSON.stringify(room.players))
  console.log('player joined room')
  console.log(room)
  console.log(params.id)
  if (params.id === room.id) {
    players.value = room.players
    console.log(players.value)
    socket.emit('getPlayers', params.id)
  }
})

socket.on('newCreator', (plId) => {
  console.log('new creator')
  console.log(plId)
  console.log(socket.id)
  if (socket.id === plId) {
    sessionStorage.setItem('creator', 'true')
    creator = true
  }
})

socket.on('playerLeft', (room: Room) => {
  players.value = room.players
})

const params = useUrlSearchParams('history')
socket.emit('getPlayers', params.id)
socket.on('players', (room: Room) => {
  currentRoom.value = room
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

/* invite button */
const source = ref('Hello')
const { copy, copied } = useClipboard({ source })

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
  // router.push('/character-select')
  // router.push('/play')
  const params = useUrlSearchParams('history')
  if (params.id) {
    socket.emit('startGame', currentRoom.value)
  }
}

socket.on('gameStarted', (roomId: string) => {
  console.log(roomId)
  console.log('game started')
  console.log(player.value.id)
  const params = useUrlSearchParams('history')
  if (params.id && roomId) {
    if (roomId === params.id) {
      router.push('/play?id=' + roomId + '&playerId=' + player.value.id)
    }
  }
})

watchEffect(() => {
  selectedMap.value = maps.value[0]
  selectedMode.value = modes.value[0]
})

watchEffect(() => {
  const params = useUrlSearchParams('history')
  currentRoom.value = {
    id: params.id + '',
    name: 'test room',
    map: selectedMap.value ? selectedMap.value : maps.value[0],
    mode: selectedMode.value ? selectedMode.value : modes.value[0],
    players: players.value,
    ping: 0
  }

  if (sessionStorage.getItem('creator')) {
    socket.emit('settingsChanged', currentRoom.value)
  }
})

socket.on('settingsChanged', (room: Room) => {
  if (room.id === currentRoom.value?.id) {
    selectedMap.value = room.map
    selectedMode.value = room.mode
  }
})

const leaveGame = async () => {
  await socket.emit('leaveRoom', socket.id)
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
        <h2>Players</h2>
        <ul class="player-list">
          <li v-for="player in players" :key="player.id">
            {{ player.username }} (lvl. <span>{{ player.level }}</span
            >)
          </li>
        </ul>
        <div>
          <SgButton @click="invite">Invite</SgButton>
        </div>
      </div>

      <div class="bg-gray options">
        <h2>Game options</h2>
        <div class="game-options">
          <div>
            <h3>Map</h3>
            <div class="map-select">
              <SgButton v-if="creator" @click="prevMap" class="select-btn"
                ><i class="fa-solid fa-chevron-left"></i
              ></SgButton>
              <div class="maps">
                <div>
                  <p>{{ selectedMap?.name }}</p>
                  <img :src="selectedMap?.image" alt="map image" />
                </div>
              </div>
              <SgButton v-if="creator" @click="nextMap" class="select-btn"
                ><i class="fa-solid fa-chevron-right"></i
              ></SgButton>
            </div>
          </div>
          <div>
            <h3>Gamemode</h3>
            <div class="gamemode-select">
              <SgButton v-if="creator" @click="prevMode" class="select-btn"
                ><i class="fa-solid fa-chevron-left"></i
              ></SgButton>
              <div class="gamemodes">
                <div>
                  <p>{{ selectedMode?.name }}</p>
                  <img :src="selectedMode?.image" alt="mode image" />
                </div>
              </div>
              <SgButton v-if="creator" @click="nextMode" class="select-btn"
                ><i class="fa-solid fa-chevron-right"></i
              ></SgButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="controls">
      <SgSoundRange class="sound-range" v-model:modelValue="volume"></SgSoundRange>
      <SgButton v-if="creator" @click="startGame">Start game</SgButton>
      <SgButton @click="leaveGame">Leave game</SgButton>
    </div>
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
        justify-content: space-between;

        .gamemodes,
        .maps {
          flex: 5;
          width: 100%;
          text-align: center;

          img {
            height: 10em;
            width: 100%;
            object-fit: contain;
          }
        }

        .select-btn {
          flex: 1;
        }
      }
    }
  }
  .controls {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }
}

/* BREAKPOINTS */
@media (width >=65em) {
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

    .sound-range {
      width: 30%;
    }
  }
}
</style>
