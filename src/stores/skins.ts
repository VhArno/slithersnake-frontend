import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ApiResponse, Skin } from '@/types/'
import { getSkins } from '@/services/dataService'

export const useSkinsStore = defineStore('skins', () => {
    const skins = ref<Skin[]>([])
    const selectedSkin = ref<Skin>({
      id: 1,
      name: 'Skin 1',
      imgHead: 'http://localhost:8080/storage/skin1_head.svg',
      imgBody: 'http://localhost:8080/storage/skin1_body.svg'
    })

    const loadSkins = () => {
      getSkins<ApiResponse>().then((response) => {
        const loadedMaps: Skin[] = response.data.data.map((record: any) => {
          return {
            id: record.id,
            name: record.name,
            imgHead: record.image_head,
            imgBody: record.image_body,
          }
        })
        skins.value?.push(...loadedMaps)
      })
      .catch((error) => console.error(error))
    }

    return { skins, selectedSkin, loadSkins }
})