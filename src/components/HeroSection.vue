<template>
  <header class="hero">
    <!-- 背景光暈 -->
    <div class="hero-bg" :class="{ visible: isVisible }">
      <div class="orb orb-blue" ref="orbBlue"></div>
      <div class="orb orb-green" ref="orbGreen"></div>
      <div class="orb orb-ambient" ref="orbAmbient"></div>
    </div>

    <!-- 主內容 -->
    <div class="hero-content" ref="heroContent" :class="{ visible: isVisible }">
      <!-- 標題區塊 -->
      <div class="title-wrapper">
        <!-- 燈泡 + 搜尋裝飾 -->
        <div class="deco-bulb" ref="decoBulb">
          <img :src="bulbImg" class="deco-bulb-img" alt="">
          <img :src="searchImg" class="deco-bulb-search" alt="">
          <div class="deco-bulb-glass"></div>
        </div>

        <!-- 藍色線條裝飾 -->
        <img :src="titleLines" class="deco-lines" alt="">

        <!-- 游標 + Hank 標籤 -->
        <div class="deco-cursor" ref="decoCursor">
          <img :src="cursorHank" alt="">
        </div>

        <!-- 標題文字 -->
        <h1>
          <span v-for="line in profile.title" :key="line">{{ line }}</span>
        </h1>
      </div>

      <!-- 頭貼 (mobile only) -->
      <div class="mobile-avatar">
        <img :src="avatarImg" alt="Hank">
      </div>

      <!-- 介紹文字 -->
      <p class="intro">{{ profile.intro }}</p>

      <!-- 技能標籤 -->
      <div class="skill-tags">
        <span class="tag" v-for="skill in profile.skills" :key="skill">{{ skill }}</span>
      </div>

      <!-- CTA 按鈕 (desktop/tablet inline) -->
      <CtaButton class="hero-cta-inline" href="/resume" @click.prevent="goToResume">查看我的履歷</CtaButton>
    </div>
  </header>

  <!-- Mobile fixed CTA — Teleport to body so hero-content opacity won't hide it -->
  <Teleport to="body">
    <a class="mobile-fixed-cta" :class="{ visible: ctaFixedVisible }" href="/resume" @click.prevent="goToResume">
      <span>查看我的履歷</span>
      <span class="mobile-cta-arrow">
        <img :src="arrowIcon" alt="">
      </span>
    </a>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfile } from '@/composables/usePortfolioData'

const { profile } = useProfile()
import { useLenis } from '@/composables/useLenis'
import CtaButton from './CtaButton.vue'

import bulbImg from '@/assets/燈泡圖片.png'
import searchImg from '@/assets/search.png'
import titleLines from '@/assets/title-lines.svg'
import cursorHank from '@/assets/cursor-hank.svg'
import avatarImg from '@/assets/avatar.png'
import arrowIcon from '@/assets/arrow-icon.svg'

defineProps({
  isVisible: { type: Boolean, default: false }
})

const router = useRouter()
const { scrollTo } = useLenis()

const heroContent = ref(null)
const decoBulb = ref(null)
const decoCursor = ref(null)
const orbBlue = ref(null)
const orbGreen = ref(null)
const orbAmbient = ref(null)

// Mobile fixed CTA: show on scroll down, hide on scroll up
const ctaFixedVisible = ref(false)
let lastScrollY = 0

function goToResume() {
  router.push('/resume')
}

// Scroll animation state
let currentScale = 1, targetScale = 1
let currentOpacity = 1, targetOpacity = 1
let currentBlur = 0, targetBlur = 0
let currentBlueX = 0, currentBlueY = 0, targetBlueX = 0, targetBlueY = 0
let currentGreenX = 0, currentGreenY = 0, targetGreenX = 0, targetGreenY = 0
let currentAmbientX = 0, currentAmbientY = 0, targetAmbientX = 0, targetAmbientY = 0
let currentOrbOpacity = 1, targetOrbOpacity = 1
let currentBulbY = 0, targetBulbY = 0
let currentCursorY = 0, targetCursorY = 0
let transitionCleared = false
let rafId = null

function lerp(start, end, factor) {
  return start + (end - start) * factor
}

function updateEffect() {
  const el = heroContent.value
  if (!el) { rafId = requestAnimationFrame(updateEffect); return }

  if (!transitionCleared && el.classList.contains('visible')) {
    setTimeout(() => { el.style.transition = 'none' }, 1000)
    transitionCleared = true
  }

  const time = Date.now() * 0.001
  const hero = el.closest('.hero')
  if (!hero) { rafId = requestAnimationFrame(updateEffect); return }
  const heroHeight = hero.offsetHeight
  const scrollProgress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1)

  // Hero Content 縮小 + 淡出
  targetScale = 1 - scrollProgress * 0.15
  currentScale = lerp(currentScale, targetScale, 0.18)

  const projects = document.querySelector('#projects')
  if (projects) {
    const fadeStart = heroHeight * 0.3
    const fadeEnd = heroHeight
    const fadeProgress = Math.min(Math.max((window.scrollY - fadeStart) / (fadeEnd - fadeStart), 0), 1)
    targetOpacity = 1 - fadeProgress
    targetBlur = fadeProgress * 12
  }
  currentOpacity = lerp(currentOpacity, targetOpacity, 0.15)
  currentBlur = lerp(currentBlur, targetBlur, 0.15)

  if (el.classList.contains('visible')) {
    el.style.transform = `scale(${currentScale})`
    el.style.opacity = currentOpacity
    el.style.filter = `blur(${currentBlur}px)`
  }

  // 光暈動態
  const bBlue = Math.sin(time * 0.3) * 12
  const bGreen = Math.sin(time * 0.25 + 1.2) * 10
  const bAmbient = Math.sin(time * 0.2 + 2.5) * 8

  targetBlueX = scrollProgress * -60 + bBlue
  targetBlueY = scrollProgress * -80 + bBlue * 0.7
  targetGreenX = scrollProgress * 50 + bGreen
  targetGreenY = scrollProgress * -180 + bGreen * 0.8
  targetAmbientX = scrollProgress * -30 + bAmbient
  targetAmbientY = scrollProgress * -120 + bAmbient * 0.6

  currentBlueX = lerp(currentBlueX, targetBlueX, 0.08)
  currentBlueY = lerp(currentBlueY, targetBlueY, 0.08)
  currentGreenX = lerp(currentGreenX, targetGreenX, 0.14)
  currentGreenY = lerp(currentGreenY, targetGreenY, 0.14)
  currentAmbientX = lerp(currentAmbientX, targetAmbientX, 0.1)
  currentAmbientY = lerp(currentAmbientY, targetAmbientY, 0.1)

  if (orbBlue.value) orbBlue.value.style.transform = `translate(${currentBlueX}px, ${currentBlueY}px) scale(${1 + scrollProgress * 0.1})`
  if (orbGreen.value) orbGreen.value.style.transform = `translate(${currentGreenX}px, ${currentGreenY}px) scale(${1 + scrollProgress * 0.08})`
  if (orbAmbient.value) orbAmbient.value.style.transform = `translate(${currentAmbientX}px, ${currentAmbientY}px) scale(${1 + scrollProgress * 0.15})`

  targetOrbOpacity = 1 - scrollProgress * 0.8
  currentOrbOpacity = lerp(currentOrbOpacity, targetOrbOpacity, 0.12)
  if (orbBlue.value) orbBlue.value.style.opacity = 0.5 * currentOrbOpacity
  if (orbGreen.value) orbGreen.value.style.opacity = 0.3 * currentOrbOpacity
  if (orbAmbient.value) orbAmbient.value.style.opacity = 0.25 * currentOrbOpacity

  // 裝飾元素往上浮
  targetBulbY = window.scrollY * -0.15
  currentBulbY = lerp(currentBulbY, targetBulbY, 0.15)
  if (decoBulb.value) decoBulb.value.style.transform = `translateY(${currentBulbY}px)`

  targetCursorY = window.scrollY * -0.2
  currentCursorY = lerp(currentCursorY, targetCursorY, 0.15)
  if (decoCursor.value) decoCursor.value.style.transform = `translateY(${currentCursorY}px)`

  // Mobile fixed CTA: detect scroll direction in RAF (Lenis may not fire native scroll events)
  const currentY = window.scrollY
  if (currentY > 100 && currentY > lastScrollY + 2) {
    ctaFixedVisible.value = true
  } else if (currentY < lastScrollY - 2) {
    ctaFixedVisible.value = false
  }
  lastScrollY = currentY

  rafId = requestAnimationFrame(updateEffect)
}

onMounted(() => {
  updateEffect()
})
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.hero {
  position: sticky;
  top: 0;
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60px;
  width: 100%;
  padding-top: 75px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  background: #0F1720;
  opacity: 0;
  filter: blur(10px);
  transition: opacity 1s cubic-bezier(0.25, 0, 0.25, 1), filter 1s cubic-bezier(0.25, 0, 0.25, 1);
}

.hero-bg.visible {
  opacity: 1;
  filter: blur(0px);
}

.orb {
  position: absolute;
  border-radius: 50%;
  will-change: transform;
  pointer-events: none;
}

.orb-blue {
  width: 1200px;
  height: 1200px;
  top: 10%;
  right: -5%;
  background: radial-gradient(circle, rgba(49, 111, 255, 0.5) 0%, transparent 70%);
  filter: blur(80px);
}

.orb-green {
  width: 800px;
  height: 800px;
  bottom: 10%;
  left: 5%;
  background: radial-gradient(circle, rgba(88, 255, 69, 0.3) 0%, transparent 70%);
  filter: blur(100px);
}

.orb-ambient {
  width: 1600px;
  height: 1600px;
  top: 20%;
  left: 30%;
  background: radial-gradient(circle, rgba(43, 104, 248, 0.25) 0%, transparent 70%);
  filter: blur(120px);
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 150px;
  max-width: 908px;
  text-align: center;
  will-change: transform;
  opacity: 0;
  filter: blur(10px);
  transition: opacity 1.5s cubic-bezier(0.25, 0, 0.25, 1), filter 1.5s cubic-bezier(0.25, 0, 0.25, 1);
}

.hero-content.visible {
  opacity: 1;
  filter: blur(0px);
}

.title-wrapper {
  position: relative;
  width: 100%;
}

.deco-bulb {
  position: absolute;
  left: 121px;
  top: -50px;
  width: 210px;
  height: 210px;
  pointer-events: none;
  will-change: transform;
}

.deco-bulb-glass {
  position: absolute;
  width: 100px;
  height: 100px;
  right: 21px;
  bottom: 48px;
  z-index: -1;
  transform: rotate(-37deg);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 32px;
  pointer-events: none;
}

.deco-bulb-img {
  position: absolute;
  width: 220px;
  height: auto;
  top: -14px;
  left: 13px;
  z-index: 2;
  filter: drop-shadow(0px 4px 40px rgba(240, 210, 66, 0.56));
}

.deco-bulb-search {
  position: absolute;
  width: 60px;
  height: auto;
  bottom: 36px;
  right: 43px;
  z-index: 2;
  transform: rotate(-1deg);
}

.deco-lines {
  position: absolute;
  left: 287px;
  top: -9px;
  width: 215px;
  pointer-events: none;
  z-index: -1;
}

.deco-cursor {
  position: absolute;
  right: 220px;
  top: 80px;
  pointer-events: none;
  will-change: transform;
}

h1 {
  position: relative;
  z-index: 1;
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 40px;
  line-height: 64px;
  color: #fff;
}

h1 span {
  display: block;
}

.intro {
  font-size: 18px;
  line-height: 2;
  color: #fff;
  max-width: 791px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.tag {
  background: #0C233D;
  padding: 12px 20px;
  border-radius: 32px;
  font-size: 14px;
  font-weight: 600;
}

/* Avatar — hidden on desktop, shown on mobile */
.mobile-avatar {
  display: none;
}

@media (max-width: 1199px) {
  .hero {
    padding-bottom: 0px;
  }
  .hero-content {
    margin-top: 20px;
    max-width: 700px;
    padding: 0 40px;
  }
  .title-wrapper {
    display: none;
  }
  .mobile-avatar {
    display: block;
  }
  .mobile-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  .deco-bulb,
  .deco-lines,
  .deco-cursor {
    display: none;
  }
  .intro {
    font-size: 16px;
  }
  .orb-blue { width: 800px; height: 800px; }
  .orb-green { width: 500px; height: 500px; }
  .orb-ambient { width: 1000px; height: 1000px; }
}

@media (max-width: 767px) {
  .hero {
    position: sticky;
    top: 0;
    padding-top: 60px;
    padding-bottom: 30px;
  }
  .hero-content {
    margin-top: 10px;
    max-width: 100%;
    padding: 0 20px;
    gap: 10px;
  }
  .title-wrapper {
    display: none;
  }
  .mobile-avatar {
    display: block;
  }
  .mobile-avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }
  .intro {
    font-size: 16px;
    line-height: 1.8;
    max-width: 100%;
  }
  .skill-tags {
    display: none;
  }
  .hero-cta-inline {
    /* inline CTA visible on mobile too */
  }
  .deco-bulb,
  .deco-lines,
  .deco-cursor {
    display: none;
  }
  .orb-blue { width: 500px; height: 500px; }
  .orb-green { width: 350px; height: 350px; }
  .orb-ambient { width: 600px; height: 600px; }
}
</style>

<!-- Unscoped styles for Teleported mobile CTA -->
<style>
.mobile-fixed-cta {
  display: none;
}

@media (max-width: 767px) {
  .mobile-fixed-cta {
    display: none;
  }
}
</style>
