import type { Keybinds, Localstorage } from '@/types'
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

    const saveKeybinds = () => {
        localStorage.setItem('keybinds', JSON.stringify(keybinds))
        console.log("saving keybinds in localstorage")
    }

    const loadKeybinds = () => {
        const savedKeybinds = localStorage.getItem('keybinds');
        if (savedKeybinds) {
            const parsedKeybinds = JSON.parse(savedKeybinds);
            keybinds.value = parsedKeybinds._value || {};
        }
    }

    return { keybinds, volume, darkMode, saveKeybinds, loadKeybinds }
})