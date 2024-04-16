<script setup lang="ts">
import SgButton from "../atoms/SgButton.vue";
import SgGrid from "../organisms/SgGrid.vue"
import { onKeyStroke } from '@vueuse/core'
import { useSettingsStore } from '@/stores/settings';
import { storeToRefs } from 'pinia'

// settings store
const settingsStore = useSettingsStore()
const { keybinds } = storeToRefs(settingsStore)

// keybinds
// => gebruik om snake te laten bewegen naar bepaalde richting
// beneden
onKeyStroke(keybinds.value.down, (s) => {
    console.log("Snake move down")
    s.preventDefault()
})
// boven
onKeyStroke(keybinds.value.up, (w) => {
    console.log("Snake move up")
    w.preventDefault()
})
// links
onKeyStroke(keybinds.value.left, (a) => {
    console.log("Snake move left")
    a.preventDefault()
})
// rechts
onKeyStroke(keybinds.value.right, (d) => {
    console.log("Snake move right")
    d.preventDefault()
})
</script>

<template>
    <section class="main-sec">
        <SgGrid></SgGrid>

        <div class="scoreboard">
            <div class="players">
                <h3>Scoreboard</h3>
                
                <div class="player-1">
                    <p>You (lvl. 11)</p>
                    <span>0</span>
                </div>
                <div class="player-2">
                    <p>Player 1(lvl. 9)</p>
                    <span>0</span>
                </div>
            </div>

            <div class="score-settings">
                <div class="sound-div">
                    <p>Sound <span><i class="fa-solid fa-volume-high"></i></span></p>
                </div>
                <SgButton class="leave-btn">Leave</SgButton>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.main-sec {
    display: flex;
    flex-flow: row;

    .grid {
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