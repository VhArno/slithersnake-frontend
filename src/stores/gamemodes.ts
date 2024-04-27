import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Map, GameMode, ApiResponse } from '@/types/'
import { getGamemodes } from '@/services/dataService'

export const useGamemodesStore = defineStore('gamemodes', () => {
    const modes = ref<GameMode[]>([])

    const loadModes = () => {
        getGamemodes<ApiResponse>().then((response) => {
          const loadedMaps: Map[] = response.data.data.map((record: any) => {
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