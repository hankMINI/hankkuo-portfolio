<template>
  <header class="hero">
    <!-- 背景光暈 -->
    <div class="hero-bg">
      <div class="orb orb-blue"></div>
      <div class="orb orb-green"></div>
      <div class="orb orb-ambient"></div>
    </div>

    <!-- 主內容 -->
    <div class="hero-content">
      <!-- 標題區塊 -->
      <div class="title-wrapper" v-reveal>
        <!-- 燈泡 + 搜尋裝飾 -->
        <div class="deco-bulb">
          <img :src="bulbImg" class="deco-bulb-img" alt="">
          <img :src="searchImg" class="deco-bulb-search" alt="">
          <div class="deco-bulb-glass"></div>
        </div>

        <!-- 藍色線條裝飾 -->
        <img :src="titleLines" class="deco-lines" alt="">

        <!-- 游標 + Hank 標籤 -->
        <div class="deco-cursor">
          <img :src="cursorHank" alt="">
        </div>

        <!-- 標題文字 -->
        <h1>
          <span v-for="line in profile.title" :key="line">{{ line }}</span>
        </h1>
      </div>

      <!-- 頭貼 (mobile only) -->
      <div class="mobile-avatar" v-reveal>
        <img :src="avatarImg" alt="Hank">
      </div>

      <!-- 介紹文字 -->
      <p class="intro" v-reveal>{{ profile.intro }}</p>

      <!-- 技能標籤 -->
      <div class="skill-tags" v-reveal>
        <span class="tag" v-for="skill in profile.skills" :key="skill">{{ skill }}</span>
      </div>

      <!-- CTA 按鈕 (desktop/tablet inline) -->
      <CtaButton v-reveal class="hero-cta-inline" href="/resume" @click.prevent="goToResume">查看我的履歷</CtaButton>
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
import { useRouter } from 'vue-router'
import { useProfile } from '@/composables/usePortfolioData'

const { profile } = useProfile()
import CtaButton from './CtaButton.vue'

import bulbImg from '@/assets/燈泡圖片.png'
import searchImg from '@/assets/search.png'
import titleLines from '@/assets/title-lines.svg'
import cursorHank from '@/assets/cursor-hank.svg'
import avatarImg from '@/assets/avatar.png'
import arrowIcon from '@/assets/arrow-icon.svg'

const router = useRouter()

function goToResume() {
  router.push('/resume')
}
</script>

<style scoped>
.hero {
  position: relative;
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
  background: #0F1720;
}

.orb {
  position: absolute;
  border-radius: 50%;
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
    position: relative;
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
