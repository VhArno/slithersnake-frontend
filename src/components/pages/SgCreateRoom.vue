<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core'

const params = useUrlSearchParams('history')
params.id = "4762ga47gf932a8-4548a"
</script>

<template>
    <section class="create">
        <div class="settings">
            <div class="bg-gray players">
                <div>
                    <h2>Players</h2> 
                    <ul class="player-list">
                        <li>You (lvl. <span>11</span>)</li>
                        <li>Player 1 (lvl. <span>9</span>)</li>
                    </ul>
                </div>

                <button>Invite</button>
            </div>

            <div class="bg-gray options">
                <h2>Game options</h2>
                <div class="game-options">
                    <div>
                        <h3>Map</h3>
                        <div class="map-select">
                            <button id="prevBtn"><i class="fa-solid fa-chevron-left"></i></button>
                            <div class="maps">
                                <div class="map">Normal</div>
                                <div class="map">Hexagon</div>
                                <div class="map">Larger</div>
                            </div>
                            <button id="nextBtn"><i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>
                    
                    <div>
                        <h3>Gamemode</h3>
                        <div class="gamemode-select">
                            <button id="prev-btn"><i class="fa-solid fa-chevron-left"></i></button>
                            <div class="gamemodes">
                                <div class="gamemode">Normal</div>
                                <div class="gamemode">Power-ups</div>
                                <div class="gamemode">Walls</div>
                            </div>
                            <button id="next-btn"><i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div> 
                <button>Play</button>
            </div>
        </div>
        <p>Sound <span><i class="fa-solid fa-volume-high"></i></span></p>
        <button>Start game</button>
        <button>Leave game</button>
    </section>
</template>

<style lang="scss">
.create {
    display: flex;
    flex-flow: column;
    gap: 1rem;
    width: 80%;
    margin: 1rem;
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

                button {
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