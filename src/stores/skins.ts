import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Skin } from '@/types/'
import { getSkins } from '@/services/dataService'

export const useSkinsStore = defineStore('skins', () => {
    const skins = ref<Skin[]>([
      {
        id: 545,
        name: 'skin1'
      },
      {
        id: 564,
        name: 'skin2'
      },
      {
        id: 972,
        name: 'skin3'
      },
    ])
    const selectedSkin = ref<Skin>()

    const loadSkins = () => {
        getSkins<Skin[]>().then((response) => {
          const loadedMaps: Skin[] = response.data.map((record: any) => {
            return {
              id: record.id,
              name: record.name,
              image: record.image
            }
          })
          skins.value?.push(...loadedMaps)
        })
        .catch((error) => console.error(error))
      }

    return { skins, selectedSkin, loadSkins }
})