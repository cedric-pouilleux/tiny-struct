import { type Scale } from '~/server/db/schema'
import { getItemsScale } from '~/services/itemScaleService'

export const useScaleStore = defineStore('scales', () => {
  const scales = ref<Scale[]>([])

  async function fetchScales(): Promise<void> {
    if (scales.value.length) {
      return
    }
    try {
      scales.value = await getItemsScale()
    } catch (error: any) {
      console.log(error)
    }
  }

  async function refreshScales() {
    try {
      scales.value = await getItemsScale()
    } catch (error: any) {
      console.log(error)
    }
  }

  return {
    scales,
    fetchScales,
    refreshScales
  }
})
