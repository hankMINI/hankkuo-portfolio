import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation(callback) {
  let rafId = null

  function loop() {
    callback()
    rafId = requestAnimationFrame(loop)
  }

  onMounted(() => {
    loop()
  })

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })
}
