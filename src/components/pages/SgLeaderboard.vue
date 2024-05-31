<script setup lang="ts">
import { useLeaderboardStore } from '@/stores/leaderboard';
import { storeToRefs } from 'pinia';
import { ref, watch, watchEffect } from 'vue';

const sort = ref<string>('')

// leaderboard store
const leaderboardStore = useLeaderboardStore()
leaderboardStore.loadLeaderboard(sort.value)
const { leaderboard } = storeToRefs(leaderboardStore)

const calcWinRate = (played: number, won: number) => {
    const gamesWon = won ?? 0;
  let gamesPlayed = played ?? 1;

  gamesPlayed = gamesPlayed === 0 ? 1 : gamesPlayed;
  
  return gamesWon / gamesPlayed;
}

watch(sort, () => {
    leaderboardStore.loadLeaderboard(sort.value)
})
</script>

<template>
    <section class="content">
        <h1>Global leaderboard</h1>

        <table class="leaderboard">
            <thead>
                <tr class="table-head">
                    <th>#</th>
                    <th>Username</th>
                    <th class="sort" :class="{selected: sort === 'level'}" @click="sort = 'level'"><span>Level</span><i class="fa-solid fa-chevron-up"></i></th>
                    <th class="sort" :class="{selected: sort === 'highscore'}" @click="sort = 'highscore'"><span>Highscore</span><i class="fa-solid fa-chevron-up"></i></th>
                    <th>Played games</th>
                    <th class="sort" :class="{selected: sort === 'winrate'}" @click="sort = 'winrate'"><span>win rate</span><i class="fa-solid fa-chevron-up"></i></th>
                </tr>
            </thead>
            <tbody class="table-body">
                <tr v-for="(player, index) in leaderboard" :key="player.id">
                    <td>{{ index+1 }}</td>
                    <td>{{ player.username }}</td>
                    <td>{{ player.level }}</td>
                    <td>{{ player.highscore }}</td>
                    <td>{{ player.games_played }}</td>
                    <td>{{ calcWinRate(player.games_played, player.games_won) }}%</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<style scoped lang="scss">
.content {
    margin: 2rem auto;
    width: 80%;
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    padding: 1rem;
    border-radius: 10px;

    .leaderboard {
        margin-top: 1rem;
        width: 100%;
        text-align: center;
        border-collapse: collapse;

        .table-head {
            th {
                position: sticky;
                top: 0px;
                border-bottom: 2px solid var(--btn-hover);
                padding-bottom: 0.5rem;
                
                span {
                    margin-right: 0.5rem;
                }
            }

            .sort:hover {
                cursor: pointer;
            }

            .selected {
                color: var(--accent);
            }
        }

        .table-body {
            td {
                padding: 0.5rem 0;
            }
        }
    }
}
</style>