<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';


</script>
<template>
    <nav>
    <button aria-expanded="false" class="toggle hamburger hidden" id="menu">
        <span aria-hidden="true" class="icon">
        <span></span><span></span><span></span>
        </span>
    </button>
    <RouterLink to="/" id="logo" href="/" aria-label="logo" tabindex="0">
        <h1>Slithersnake</h1>
    </RouterLink>
    <ul class="menu-list">
        <li><RouterLink :to="{ name: 'leaderboard'}">Leaderboard <i class="fa-solid fa-trophy"></i></RouterLink></li>
        <li v-if="useAuthStore().isAuthenticated"><RouterLink :to="{ name: 'profile'}">Profile <i class="fa-solid fa-user"></i></RouterLink></li>
        <li v-if="!useAuthStore().isAuthenticated"><RouterLink :to="{ name: 'login'}">Login<i class="fa-solid fa-right-to-bracket"></i></RouterLink></li>
        <li><RouterLink :to="{ name: 'settings'}">Settings <i class="fa-solid fa-gear"></i></RouterLink></li>
    </ul>
    </nav>
</template>

<style scoped lang="scss">
nav {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;

    .menu-list {
        list-style-type: none;
        display: flex;
        flex-flow: row;
        gap: 1.5rem;
        padding: 0;

        li a {
            display: flex;
            flex-flow: row;
            align-items: center;
            justify-content: center;
            gap: 0.5em;
            text-decoration: none;
            color: var(--default-text-dark);

            &:hover {
                text-decoration: underline;
            }
        }
        
        i {
            color: var(--default-text-dark);
            font-size: 24px;
        }
    }
}

/* Hamburger */
.hamburger {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    transition: all;
    border: none;
    background-color: transparent;
    color: var(--main);
    font-weight: bold;
    cursor: pointer;
}
  
.icon {
    display: inline-block;
    cursor: pointer;
}
  
.icon span {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    transition: all 0.5s;
    background-color: var(--accent);
}
  
.visible {
    animation: show-menu 0.4s ease-in-out forwards;
}
  
.hamburger[aria-expanded="true"] .icon span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
}
  
.hamburger[aria-expanded="true"] .icon span:nth-child(2) {
    opacity: 0;
}
  
.hamburger[aria-expanded="true"] .icon span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
    background-color: var(--accent);
}
</style>