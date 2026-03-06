<template>
  <div>
    <!-- Loading -->
    <AppLoader v-if="showLoader" @done="onLoadingDone" />

    <!-- 導航列 -->
    <AppNav :is-visible="navVisible" />

    <HeroSection :is-visible="heroVisible" />

    <!-- 主要內容區 -->
    <main class="main-content">
      <ExpertiseSection ref="expertiseRef" :is-visible="expertiseVisible" />

      <!-- 黑色跑馬燈 -->
      <div class="marquee-wrapper" ref="marqueeRef" :class="{ visible: marqueeVisible }">
        <MarqueeStrip color="black" />
      </div>

      <!-- Content Wrap -->
      <div class="content-wrap">
        <ProjectsSection ref="projectsRef" :is-visible="projectsVisible" />
        <ExperiencesSection ref="experiencesRef" :is-visible="experiencesVisible" />
      </div>

      <AppFooter ref="footerRef" :is-visible="footerVisible" />
    </main>

    <!-- Resume Button -->
    <ResumeButton />

    <!-- Go to Top -->
    <GoToTop />
  </div>
</template>

<script>
// 模組層級變數：跨組件掛載持續存在
let hasLoaded = false
let savedScrollY = 0
</script>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useLenis } from '@/composables/useLenis'
import { gsap } from 'gsap'
import AppLoader from '@/components/AppLoader.vue'
import AppNav from '@/components/AppNav.vue'
import HeroSection from '@/components/HeroSection.vue'
import ExpertiseSection from '@/components/ExpertiseSection.vue'
import MarqueeStrip from '@/components/MarqueeStrip.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ExperiencesSection from '@/components/ExperiencesSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import GoToTop from '@/components/GoToTop.vue'
import ResumeButton from '@/components/ResumeButton.vue'

const { init: initLenis, scrollTo: lenisScrollTo } = useLenis()

// 狀態：永遠從 false 開始，返回時在 onMounted 中觸發 watch
const showLoader = ref(!hasLoaded)
const navVisible = ref(false)
const heroVisible = ref(false)
const expertiseVisible = ref(false)
const marqueeVisible = ref(false)
const projectsVisible = ref(false)
const experiencesVisible = ref(false)
const footerVisible = ref(false)

// Refs
const expertiseRef = ref(null)
const marqueeRef = ref(null)
const projectsRef = ref(null)
const experiencesRef = ref(null)
const footerRef = ref(null)
// Observer
let observer = null

function isInViewport(el) {
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

function onLoadingDone() {
  hasLoaded = true
  showLoader.value = false
  document.body.classList.remove('loading')
  document.body.classList.add('loaded')
  triggerSequentialFadeIn()
}

function triggerSequentialFadeIn() {
  const tl = gsap.timeline()

  // Hero 動畫序列
  tl.to({}, { duration: 0.1 }) // 初始延遲
    .to(heroVisible, { value: true, duration: 0 }, 0)
    .to(navVisible, { value: true, duration: 0 }, 0.3)
    .to(heroVisible, { value: true, duration: 0 }, 0.6)

  // 主內容區動畫 - 使用 stagger 效果
  const sections = [
    { ref: expertiseRef, visible: expertiseVisible },
    { ref: marqueeRef, visible: marqueeVisible },
    { ref: projectsRef, visible: projectsVisible },
    { ref: experiencesRef, visible: experiencesVisible },
    { ref: footerRef, visible: footerVisible },
  ]

  sections.forEach((section, index) => {
    const el = section.ref.value?.$el || section.ref.value
    if (el && isInViewport(el)) {
      tl.to(section.visible, { value: true, duration: 0 }, 0.9 + index * 0.2)
    }
  })

  // 設置滾動觀察器
  nextTick(() => setupObserver())
}

// 返回時：跳過動畫，立刻顯示所有區塊（從 false → true 觸發子組件 watch）
function showAllImmediately() {
  navVisible.value = true
  heroVisible.value = true
  expertiseVisible.value = true
  marqueeVisible.value = true
  projectsVisible.value = true
  experiencesVisible.value = true
  footerVisible.value = true
}

function setupObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target

        if (el === (expertiseRef.value?.$el || expertiseRef.value)) {
          gsap.to(expertiseVisible, { value: true, duration: 0.5, ease: "power2.out" })
        } else if (el === marqueeRef.value) {
          gsap.to(marqueeVisible, { value: true, duration: 0.5, ease: "power2.out" })
          if (!projectsVisible.value) {
            gsap.to(projectsVisible, { value: true, duration: 0.5, ease: "power2.out", delay: 0.3 })
          }
        } else if (el === (projectsRef.value?.$el || projectsRef.value)) {
          if (!marqueeVisible.value) {
            gsap.to(marqueeVisible, { value: true, duration: 0.5, ease: "power2.out" })
            gsap.to(projectsVisible, { value: true, duration: 0.5, ease: "power2.out", delay: 0.3 })
          } else {
            gsap.to(projectsVisible, { value: true, duration: 0.5, ease: "power2.out" })
          }
        } else if (el === (experiencesRef.value?.$el || experiencesRef.value)) {
          gsap.to(experiencesVisible, { value: true, duration: 0.5, ease: "power2.out" })
        } else if (el === (footerRef.value?.$el || footerRef.value)) {
          gsap.to(footerVisible, { value: true, duration: 0.5, ease: "power2.out" })
        }
      }
    })
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  })

  // 觀察所有區塊
  const sections = [expertiseRef, marqueeRef, projectsRef, experiencesRef, footerRef]
  sections.forEach(section => {
    const el = section.value?.$el || section.value
    if (el) observer.observe(el)
  })
}

// 重新整理強制回到頂部
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

onMounted(() => {
  initLenis()
  if (hasLoaded) {
    // 從子頁面返回：不跑 Loader，立刻顯示所有區塊
    document.body.classList.remove('loading')
    document.body.classList.add('loaded')
    // nextTick 確保 DOM 就緒後再設 visible（觸發子組件 watch）
    nextTick(() => {
      showAllImmediately()
      nextTick(() => {
        // 恢復離開時的滾動位置
        window.scrollTo(0, savedScrollY)
        setupObserver()
      })
    })
  } else {
    // 首次載入：從頂部開始、顯示 Loader
    window.scrollTo(0, 0)
    document.body.classList.add('loading')
  }
})

onUnmounted(() => {
  // 離開前保存滾動位置
  savedScrollY = window.scrollY
  observer?.disconnect()
})
</script>

<style scoped>
.main-content {
  position: relative;
  margin-top: 100px;
  z-index: 2;
}

.marquee-wrapper {
  position: relative;
  padding: 40px 0;
  z-index: 10;
  margin-bottom: -80px;
  pointer-events: none;
  opacity: 0;
  filter: blur(10px);
  transform: translateY(30px);
  transition: opacity 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              filter 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              transform 1.5s cubic-bezier(0.25, 0, 0.25, 1);
}

.marquee-wrapper.visible {
  opacity: 1;
  filter: blur(0px);
  transform: translateY(0);
}

.content-wrap {
  background: #DFE9FF;
  position: relative;
  max-width: 1680px;
  width: 95%;
  margin: 0 auto;
  border-radius: 60px;
  z-index: 9;
}

@media (max-width: 1199px) {
  .main-content {
    margin-top: 80px;
  }
  .content-wrap {
    width: 92%;
    border-radius: 40px;
  }
  .marquee-wrapper {
    margin-bottom: -60px;
  }
}

@media (max-width: 767px) {
  .main-content {
    margin-top: 0px;
  }
  .content-wrap {
    width: 100%;
    border-radius: 24px 24px 0 0;
  }
  .marquee-wrapper {
    display: none;
  }
}

@media (min-width: 1920px) {
  .content-wrap {
    width: calc(100% - 80px);
    max-width: none;
  }
}
</style>
