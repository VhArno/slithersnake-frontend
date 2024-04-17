<script setup lang="ts">
import SgSkin from "../molecules/SgSkin.vue"
import { useSkinsStore } from "@/stores/skins";
import type { Skin } from "@/types";
import { storeToRefs } from 'pinia'

// skins store
const skinStore = useSkinsStore()
skinStore.loadSkins()

const { skins } = storeToRefs(skinStore)

const handleClick = (skin: Skin) => {
    skinStore.selectedSkin = skin
}

const isSelected = (skin: Skin) => {
    if (skinStore.selectedSkin === skin) {
        return true
    }
    return false
}
</script>

<template>
    <section class="skin-section">
        <h2>Skins</h2>
        <div class="skin-list">
            <SgSkin @click="handleClick(skin)" :class="{ selected: isSelected(skin)}" :skin="skin" v-for="skin in skins" :key="skin.id"></SgSkin>
        </div>
    </section>
</template>

<style scoped lang="scss">
.skin-section {
    width: 80%;
    color: var(--default-text-dark);
    background-color: var(--bg2-dark);
    margin: 1rem auto;
    padding: 1rem;
    border-radius: 10px;

    h2 {
        text-align: center;
    }

    .skin-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr); 
        gap: 2rem; 
        justify-content: center; 
        align-items: center; 
        text-align: center;
        margin: 1rem; 
    }
}


/* BREAKPOINTS */
@media (width >= 65em) {
    .skin-section {
        width: 60%;
        .skin-list {
            grid-template-columns: repeat(3, 1fr); 
        }
    }
}
</style>