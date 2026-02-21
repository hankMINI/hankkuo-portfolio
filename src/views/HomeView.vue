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
        <ProjectsSection ref="projectsRef" :is-visible="projectsVisible" @open-modal="openModal" />
        <ExperiencesSection ref="experiencesRef" :is-visible="experiencesVisible" />
      </div>

      <AppFooter ref="footerRef" :is-visible="footerVisible" />
    </main>

    <!-- Modal -->
    <ProjectModal ref="projectModal" />

    <!-- Resume Button -->
    <ResumeButton />

    <!-- Go to Top -->
    <GoToTop />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useLenis } from '@/composables/useLenis'
import AppLoader from '@/components/AppLoader.vue'
import AppNav from '@/components/AppNav.vue'
import HeroSection from '@/components/HeroSection.vue'
import ExpertiseSection from '@/components/ExpertiseSection.vue'
import MarqueeStrip from '@/components/MarqueeStrip.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import ExperiencesSection from '@/components/ExperiencesSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import ProjectModal from '@/components/ProjectModal.vue'
import GoToTop from '@/components/GoToTop.vue'
import ResumeButton from '@/components/ResumeButton.vue'

const { init: initLenis } = useLenis()

// 狀態
const showLoader = ref(true)
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
const projectModal = ref(null)

// Observer
let observer = null

function isInViewport(el) {
  if (!el) return false
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

function openModal(projectId) {
  projectModal.value?.openProject(projectId)
}

function onLoadingDone() {
  showLoader.value = false
  document.body.classList.remove('loading')
  document.body.classList.add('loaded')
  triggerSequentialFadeIn()
}

function triggerSequentialFadeIn() {
  // Hero 依序出場
  setTimeout(() => { heroVisible.value = true }, 0)
  setTimeout(() => { navVisible.value = true }, 300)
  setTimeout(() => { heroVisible.value = true }, 600)

  // 主內容區
  let delay = 900
  const sections = [
    { ref: expertiseRef, visible: () => { expertiseVisible.value = true } },
    { ref: marqueeRef, visible: () => { marqueeVisible.value = true } },
    { ref: projectsRef, visible: () => { projectsVisible.value = true } },
    { ref: experiencesRef, visible: () => { experiencesVisible.value = true } },
    { ref: footerRef, visible: () => { footerVisible.value = true } },
  ]

  sections.forEach((section) => {
    const el = section.ref.value?.$el || section.ref.value
    if (el && isInViewport(el)) {
      setTimeout(() => section.visible(), delay)
      delay += 100
    }
  })

  // 用 IntersectionObserver 處理不在畫面中的區塊
  nextTick(() => setupObserver())
}

function setupObserver() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target

        if (el === (expertiseRef.value?.$el || expertiseRef.value)) {
          expertiseVisible.value = true
        } else if (el === marqueeRef.value) {
          marqueeVisible.value = true
          // marquee 出現後延遲讓 projects 也出現
          if (!projectsVisible.value) {
            setTimeout(() => { projectsVisible.value = true }, 500)
          }
        } else if (el === (projectsRef.value?.$el || projectsRef.value)) {
          // 確保 marquee 先出現
          if (!marqueeVisible.value) {
            marqueeVisible.value = true
            setTimeout(() => { projectsVisible.value = true }, 500)
          } else {
            projectsVisible.value = true
          }
        } else if (el === (experiencesRef.value?.$el || experiencesRef.value)) {
          experiencesVisible.value = true
        } else if (el === (footerRef.value?.$el || footerRef.value)) {
          footerVisible.value = true
        }
      } else {
        // 離開畫面可選擇重置（保持與原版一致的重播效果）
        const el = entry.target
        if (el === (expertiseRef.value?.$el || expertiseRef.value)) {
          // expertise 保持 visible（sticky 行為）
        } else if (el === (projectsRef.value?.$el || projectsRef.value)) {
          projectsVisible.value = false
        } else if (el === (experiencesRef.value?.$el || experiencesRef.value)) {
          experiencesVisible.value = false
        } else if (el === (footerRef.value?.$el || footerRef.value)) {
          footerVisible.value = false
        }
      }
    })
  }, { threshold: 0.1 })

  const targets = [expertiseRef, marqueeRef, projectsRef, experiencesRef, footerRef]
  targets.forEach(r => {
    const el = r.value?.$el || r.value
    if (el) observer.observe(el)
  })
}

// 重新整理強制回到頂部
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

onMounted(() => {
  window.scrollTo(0, 0)
  initLenis()
  document.body.classList.add('loading')
})

onUnmounted(() => {
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
