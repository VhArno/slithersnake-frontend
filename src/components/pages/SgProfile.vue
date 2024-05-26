<script setup lang="ts">
import type { Player } from '@/types'
import SgButton from '@/components/atoms/SgButton.vue'
import SgPrompt from '@/components/molecules/SgPrompt.vue'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const winPerc = computed(() => {
  const gamesWon = user.value?.games_won ?? 0;
  let gamesPlayed = user.value?.games_played ?? 1;

  gamesPlayed = gamesPlayed === 0 ? 1 : gamesPlayed;
  
  return gamesWon / gamesPlayed;
});


// username prompt
const showPrompt = ref<boolean>(false)
const newUsername = ref<String>(user.value?.username ? user.value.username : '')

const updateUserInfo = (newName: string) => {
  console.log("update username")
  if (user.value) {
    user.value.username = newName
  }
}

function logout() {
  authStore.logout()
}
</script>

<template>
  <SgPrompt @updateUsername="updateUserInfo" v-show="showPrompt" v-model:showPrompt="showPrompt" v-model:modelValue="newUsername"></SgPrompt>
  <section class="profile">
    <div class="user-profile">
        <div class="user-info">
          <div class="user-name">
            <h2>{{ user?.username }}</h2>
            <p>Lvl. {{ user?.level }}</p>
          </div>

          <img src="/img/profile-picture.jpg" alt="user_profile">
        </div>
        
        <SgButton @click="() => showPrompt = true">Change name</SgButton>
    </div>

    <div class="user-stats">
        <ul>          
          <li>
            <h3>Highscore</h3>
            <p>{{ user?.highscore }}</p>
          </li>
          <li>
            <h3>Games played</h3>
            <p>{{ user?.games_played }}</p>
          </li>
          <li>
            <h3>Games won</h3>
            <p>{{ user?.games_won }}</p>
          </li>
          <li>
            <h3>Win percentage</h3>
            <p>{{ winPerc }}%</p>
          </li>
          <li>
            <h3>Kills</h3>
            <p>{{ user?.players_killed }}</p>
          </li>
          <li>
            <h3>Skins unlocked</h3>
            <p>{{ user?.skins?.length }}</p>
          </li>
        </ul>
    </div>
    <div>
      <SgButton @click="logout">Logout</SgButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile {
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    margin: 2rem;
    padding: 1.5rem;
    border-radius: 10px;
    width: 80%;
    margin-left: auto;
    margin-right: auto;

    .user-profile {
        display: flex;
        flex-flow: column;
        align-items: first baseline;
        justify-content: space-between;
        gap: 1rem;

        .user-info {
            display: flex;
            gap: 0.5rem;

            .user-name {
                order: 1;
            }

            > img {
                width: 5rem;
            }
        }

        button {
            background-color: var(--accent);
            color: var(--default-text-dark);
            border: none;
            border-radius: 10px;
            padding: 0.4rem 2rem;
        }
    }

    .user-stats {
        margin: 2rem 0rem 0rem 0rem;
        > ul {
            display: flex;
            flex-flow: column;
            gap: 0.5rem;
            list-style-type: none;
            padding: 0;
        }
    }
}

/* BREAKPOINTS */
@media (width >= 65em) {
.profile {
    width: 60%;

    .user-profile {
      flex-flow: row;
      align-items: flex-start;

      .user-info {
          flex: 3;
      }

      button {
          flex: 1;
      }
    }
  }
}
</style>