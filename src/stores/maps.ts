import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Room, Map, GameMode, Player } from '@/types/'
import { getMaps } from '@/services/dataService'

export const useMapsStore = defineStore('maps', () => {
  const maps = ref<Map[]>([])

  const loadMaps = () => {
    getMaps<Map[]>().then((response) => {
      const loadedMaps: Map[] = response.data.map((record: any) => {
        return {
          id: record.id,
          name: record.name,
          image: record.image
        }
      })
      maps.value?.push(...loadedMaps)
    })
    .catch((error) => console.error(error))
  }

  return { maps, loadMaps }
})