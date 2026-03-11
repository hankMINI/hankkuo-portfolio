<template>
  <div>
    <!-- Loading -->
    <AppLoader v-if="showLoader" @done="onLoadingDone" />

    <!-- 導航列 -->
    <AppNav />

    <HeroSection />

    <!-- 主要內容區 -->
    <main class="main-content">
      <ExpertiseSection />

      <!-- 黑色跑馬燈 -->
      <div class="marquee-wrapper">
        <MarqueeStrip color="black" />
      </div>

      <!-- Content Wrap -->
      <div class="content-wrap">
        <ProjectsSection />
        <ExperiencesSection />
      </div>

      <AppFooter />
    </main>

    <!-- Resume Button -->
    <ResumeButton />

    <!-- Go to Top -->
    <GoToTop />
  </div>
</template>

<script>
let hasLoaded = false
</script>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { revealReady } from '@/directives/reveal'
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

const showLoader = ref(!hasLoaded)

function onLoadingDone() {
  hasLoaded = true
  showLoader.value = false
  document.body.classList.remove('loading')
  document.body.classList.add('loaded')
  nextTick(() => revealReady())
}

onMounted(() => {
  if (hasLoaded) {
    document.body.classList.remove('loading')
    document.body.classList.add('loaded')
    revealReady()
  } else {
    window.scrollTo(0, 0)
    document.body.classList.add('loading')
  }
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
