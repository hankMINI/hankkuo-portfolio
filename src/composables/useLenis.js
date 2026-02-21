import { ref, onMounted, onUnmounted } from 'vue'
import Lenis from 'lenis'

const lenisInstance = ref(null)

export function useLenis() {
  function init() {
    if (lenisInstance.value) return

    lenisInstance.value = new Lenis({
      duration: 2.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenisInstance.value?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }

  function scrollTo(target, options = {}) {
    lenisInstance.value?.scrollTo(target, options)
  }

  function stop() {
    lenisInstance.value?.stop()
  }

  function start() {
    lenisInstance.value?.start()
  }

  function destroy() {
    lenisInstance.value?.destroy()
    lenisInstance.value = null
  }

  return { lenis: lenisInstance, init, scrollTo, stop, start, destroy }
}
