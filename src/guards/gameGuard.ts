import { usePlayStore } from '@/stores/play'
import type { RouteLocation } from 'vue-router'

export function resetIntervalGuard(to: RouteLocation, from: RouteLocation) {
  usePlayStore().gameLoopInterval = setInterval(() => {})
  clearInterval(usePlayStore().gameLoopInterval)
  usePlayStore().socketInterval = setInterval(() => {})
  clearInterval(usePlayStore().socketInterval)
}