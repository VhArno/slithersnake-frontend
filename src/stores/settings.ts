import type { Keybinds } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    const keybinds = ref<Keybinds>({
        left: 'ArrowLeft',
        right: 'ArrowRight',
        up: 'ArrowUp',
        down: 'ArrowDown'
    })
    const volume = ref<number>(50)
    const darkMode = ref<boolean>(true)

    return { keybinds, volume, darkMode }
})