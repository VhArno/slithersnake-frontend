<script setup lang="ts">
import type { Skin } from '@/types';

defineProps<{
    skin: Skin
}>()
</script>

<template>
    <div class="skin">
        <p>{{ skin.name }}</p>
        <div class="images">
            <img :src="skin.imgHead" :alt="skin.name">
            <img :src="skin.imgBody" :alt="skin.name">
            <img :src="skin.imgBody" :alt="skin.name">
            <img :src="skin.imgBody" :alt="skin.name">
        </div>
    </div>
</template>

<style scoped lang="scss">
.skin {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 2rem;
    background-color: var(--dark-gray);
    border-radius: 10px;
    margin: 0 auto;

    .images {
        display: flex;
        flex-flow: row;

        img {
            transform: rotate(-90deg);
        }
    }

    &:not(.selected):hover {
        cursor: pointer;
        border: 3px solid var(--accent);
    }
}

.selected {
    cursor: pointer;
    border: 3px solid var(--selected);
}
</style>