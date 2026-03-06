<template>
  <button class="go-to-top" :class="{ visible: isVisible }" :style="{ bottom: bottomPx }" @click="goTop" aria-label="回到頂部">
    <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
      <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke="#58FF45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLenis } from '@/composables/useLenis'

const { scrollTo } = useLenis()
const isVisible = ref(false)
const bottomPx = ref('30px')

function onScroll() {
  const isMobile = window.innerWidth <= 767
  if (isMobile) {
    isVisible.value = window.scrollY > 300
  } else {
    const ctaBtn = document.querySelector('.cta-button')
    const mainContent = document.querySelector('.main-content')
    if (ctaBtn && mainContent) {
      const ctaRect = ctaBtn.getBoundingClientRect()
      const mainRect = mainContent.getBoundingClientRect()
      isVisible.value = mainRect.top <= ctaRect.bottom
    } else {
      isVisible.value = window.scrollY > 300
    }
  }

  const footer = document.querySelector('.footer')
  if (footer) {
    const footerRect = footer.getBoundingClientRect()
    const footerVisible = window.innerHeight - footerRect.top
    if (footerVisible > 0) {
      bottomPx.value = (footerVisible + 30) + 'px'
    } else {
      bottomPx.value = '30px'
    }
  }
}

function goTop() {
  scrollTo(0, { duration: 1.5 })
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.go-to-top {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #000;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s, background 0.3s;
  z-index: 999;
}

@media (min-width: 1920px) {
  .go-to-top {
    right: 70px;
  }
}

.go-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.go-to-top:hover {
  background: #58FF45;
}

.go-to-top:hover :deep(svg path) {
  stroke: #000;
}

@media (max-width: 767px) {
  .go-to-top {
    width: 50px;
    height: 50px;
    right: 16px;
  }
}
</style>
