<script setup lang="ts">
import type { Skin } from '@/types';

defineProps<{
    skin: Skin
}>()
</script>

<template>
    <div class="skin">
        <p>{{ skin.name }}</p>
        <img :src="skin.img" :alt="skin.name">
    </div>
</template>

<style lang="scss">
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