<script setup lang="ts">
import type { Skin } from "@/types";
import SgSkin from "../molecules/SgSkin.vue"
import { ref } from "vue";

const skins = ref<Skin[]>([])
</script>

<template>
    <section class="skin-section">
        <h2>Skins</h2>
        <div class="skin-list">
            <SgSkin :skin="skin" v-for="skin in skins" :key="skin.id"></SgSkin>
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