<template>
    <button><slot></slot></button>
</template>

<style scoped lang="scss">
    button {
        font-size: 1.1em;
        cursor: pointer;
        color: var(--default-text-dark);
        background-color: var(--accent);
        border: none;
        padding: 0.6rem 2rem;
        border-radius: 10px;
        width: 100%;

        &:hover {
            background-color: var(--accent-light);
        }

        &:disabled {
            cursor: not-allowed;

            &:hover {
                background-color: var(--accent-dark);
            }
        }
    }
</style>