<template>
  <div class="loader" :class="{ hide: hiding }">
    <div class="loader-content">
      <div class="loader-text" ref="loaderText">Hank Portfolio</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const emit = defineEmits(['done'])
const loaderText = ref(null)
const hiding = ref(false)

onMounted(async () => {
  await nextTick()
  const el = loaderText.value
  if (!el) return

  const text = el.textContent
  el.textContent = ''

  const letters = []
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span')
    span.className = text[i] === ' ' ? 'loader-letter space' : 'loader-letter'
    span.textContent = text[i] === ' ' ? '' : text[i]
    el.appendChild(span)
    letters.push(span)
  }

  // Phase 1: 文字淡入
  requestAnimationFrame(() => {
    el.classList.add('visible')
  })

  // Phase 2: 依序跳動 + 變色
  const bounceStart = 400
  const stagger = 80
  const bounceDuration = 350

  letters.forEach((letter, i) => {
    if (letter.classList.contains('space')) return
    setTimeout(() => {
      letter.classList.add('bounce')
      setTimeout(() => {
        letter.classList.add('done')
      }, bounceDuration * 0.6)
    }, bounceStart + i * stagger)
  })

  // Phase 3+4: 全部完成後放大淡出
  const lastLetterStart = bounceStart + (letters.length - 1) * stagger
  const allDoneTime = lastLetterStart + bounceDuration + 300

  setTimeout(() => {
    el.classList.add('zoom-out')
    setTimeout(() => {
      hiding.value = true
      setTimeout(() => {
        emit('done')
      }, 500)
    }, 500)
  }, allDoneTime)
})
</script>

<style scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0F1720;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: filter 2s ease-out, opacity 0.5s ease-out 1.8s;
}

.loader.hide {
  filter: blur(20px);
  opacity: 0;
  pointer-events: none;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader-text {
  font-family: var(--font-heading);
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  display: flex;
  opacity: 0;
  transition: opacity 0.8s ease, filter 1s ease;
}

.loader-text.visible {
  opacity: 1;
}

.loader-text.zoom-out {
  filter: blur(10px);
  opacity: 0;
}

:deep(.loader-letter) {
  display: inline-block;
  color: #fff;
  transition: color 0.15s ease;
}

:deep(.loader-letter.space) {
  width: 0.3em;
}

:deep(.loader-letter.bounce) {
  animation: letter-bounce 0.35s ease-out forwards;
}

:deep(.loader-letter.done) {
  color: #58FF45;
}

@keyframes letter-bounce {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-20px); }
  70%  { transform: translateY(3px); }
  100% { transform: translateY(0); }
}

@media (max-width: 767px) {
  .loader-text {
    font-size: 32px;
  }
}
</style>
