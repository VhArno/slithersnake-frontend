<script setup lang="ts">
import { useUrlSearchParams, useClipboard  } from '@vueuse/core'
import SgButton from '../atoms/SgButton.vue'
import { ref } from 'vue'
import type { Map, GameMode, Player } from '@/types/'
import SgToast from '../atoms/SgToast.vue'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router'
import { useMapsStore } from '@/stores/maps'
import { useGamemodesStore } from '@/stores/gamemodes'
import { storeToRefs } from 'pinia'
import SgSoundRange from '../atoms/SgSoundRange.vue'
import { useSettingsStore } from '@/stores/settings'

// pinia
/* maps store */
const mapsStore = useMapsStore()
mapsStore.loadMaps()
const { maps } = storeToRefs(mapsStore)

/* modes store */
const modesStore = useGamemodesStore()
modesStore.loadModes()
const { modes } = storeToRefs(modesStore)

/* settings store */
const settingsStore = useSettingsStore()
const { volume } = storeToRefs(settingsStore)

// router
const router = useRouter()

// Generate a random GUID
const randomGuid: string = uuidv4();
const params = useUrlSearchParams('history')
params.id = randomGuid

/* toast settigns */
const showToast = ref<boolean>(false);

const toggleToast = () => {
    showToast.value = !showToast.value;
}

const players = ref<Player[]>([
    {
    id: 1,
    username: 'test user',
    email: '',
    level: 1,
    highscore: 0,
    played: 0,
    won: 0,
    killed: 0,
    skins: []
},
    {
    id: 2,
    username: 'test user 2',
    email: '',
    level: 5,
    highscore: 0,
    played: 0,
    won: 0,
    killed: 0,
    skins: []
}
])

const selectedMap = ref<Map>(maps.value[0])
const selectedMode = ref<GameMode>(modes.value[0])

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
    const currentIndex = maps.value.findIndex(map => map === selectedMap.value);
    const newIndex = (currentIndex - 1 + maps.value.length) % maps.value.length;
    selectedMap.value = maps.value[newIndex];
}

// Method to switch to the next map
const nextMap = () => {
    const currentIndex = maps.value.findIndex(map => map === selectedMap.value);
    const newIndex = (currentIndex + 1) % maps.value.length;
    selectedMap.value = maps.value[newIndex];
}

// Method to switch to the previous game mode
const prevMode = () => {
    const currentIndex = modes.value.findIndex(mode => mode === selectedMode.value);
    const newIndex = (currentIndex - 1 + modes.value.length) % modes.value.length;
    selectedMode.value = modes.value[newIndex];
}

// Method to switch to the next game mode
const nextMode = () => {
    const currentIndex = modes.value.findIndex(mode => mode === selectedMode.value);
    const newIndex = (currentIndex + 1) % modes.value.length;
    selectedMode.value = modes.value[newIndex];
}

/* actions buttons */
const startGame = () => {
    router.push('/play')
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
                        <li v-for="player in players" :key="player.id">{{ player.username }} (lvl. <span>{{ player.level }}</span>)</li>
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
                                    <img :src="selectedMap?.img" alt="map image">
                                </div>
                            </div>
                            <SgButton @click="nextMap"><i class="fa-solid fa-chevron-right"></i></SgButton>
                        </div>
                    </div>
                    
                    <div>
                        <h3>Gamemode</h3>
                        <div class="gamemode-select">
                            <SgButton @click="prevMode" id="prev-btn"><i class="fa-solid fa-chevron-left"></i></SgButton>
                            <div class="gamemodes">
                                <div>
                                    <p>{{ selectedMode?.name }}</p>
                                    <img :src="selectedMode?.img" alt="mode image">
                                </div>
                            </div>
                            <SgButton @click="nextMode" id="next-btn"><i class="fa-solid fa-chevron-right"></i></SgButton>
                        </div>
                    </div>
                </div> 
                <SgButton>Play</SgButton>
            </div>
        </div>
        <SgSoundRange class="sound-range" v-model:modelValue="volume"></SgSoundRange>
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

            .gamemode-select, .map-select {
                display: flex;
                flex-flow: row;
                align-items: center;
                margin-top: 1rem;

                .gamemodes, .maps {
                    flex-grow: 1;
                    width: 100%;
                    text-align: center;
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

        .sound-range {
            width: 30%
        }
    }
}
</style>