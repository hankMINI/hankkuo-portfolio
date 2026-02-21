import { onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(targetRef, callback, options = {}) {
  let observer = null

  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options,
  }

  onMounted(() => {
    const el = targetRef.value?.$el || targetRef.value
    if (!el) return

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        callback(entry)
      })
    }, defaultOptions)

    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { observer }
}
