import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Room, Map, GameMode, Player } from '@/types/'
import { getGamemodes } from '@/services/dataService'

export const useGamemodesStore = defineStore('gamemodes', () => {
    const modes = ref<GameMode[]>([])

    const loadModes = () => {
        getGamemodes<GameMode[]>().then((response) => {
          const loadedMaps: Map[] = response.data.map((record: any) => {
            return {
              id: record.id,
              name: record.name,
              image: record.image
            }
          })
          modes.value?.push(...loadedMaps)
        })
        .catch((error) => console.error(error))
      }

    return { modes, loadModes }
})