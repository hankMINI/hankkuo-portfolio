const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target._revealDelay || 0
      if (delay) {
        setTimeout(() => entry.target.classList.add('revealed'), delay)
      } else {
        entry.target.classList.add('revealed')
      }
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.15 })

const pendingEls = []
let ready = false

export function revealReady() {
  ready = true
  pendingEls.forEach((el) => observer.observe(el))
  pendingEls.length = 0
}

export const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value != null) {
      el._revealDelay = binding.value * 200
    }
    if (ready) {
      observer.observe(el)
    } else {
      pendingEls.push(el)
    }
  },
  unmounted(el) { observer.unobserve(el) }
}
