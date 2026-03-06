<template>
  <div class="project-page" v-if="project">
    <!-- 關閉按鈕（返回上一頁，保留捲動位置） -->
    <button class="page-close" @click="goBack" aria-label="返回">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 左邊：作品圖片（可捲動） -->
    <div class="page-left">
      <div class="page-images">
        <img v-for="(src, i) in project.images" :key="i" :src="src" alt="" loading="lazy">
      </div>
    </div>

    <!-- 右邊：專案介紹（固定側欄） -->
    <div class="page-right" :class="{ 'mobile-detail-open': detailOpen }">
      <h1 class="page-title">{{ project.title }}</h1>
      <p class="page-subtitle">{{ project.subtitle }}</p>

      <!-- 標籤區 -->
      <div class="page-tags-section" v-if="project.detail">
        <div class="page-tags-group">
          <span class="page-tags-label">專案類型</span>
          <div class="page-tags-list">
            <span class="page-tag-chip" v-for="t in project.detail.projectTypes" :key="t">{{ t }}</span>
          </div>
        </div>
        <div class="page-tags-group">
          <span class="page-tags-label">產業類型</span>
          <div class="page-tags-list">
            <span class="page-tag-chip" v-for="t in project.detail.industryTypes" :key="t">{{ t }}</span>
          </div>
        </div>
        <div class="page-tags-group">
          <span class="page-tags-label">任務標籤</span>
          <div class="page-tags-list">
            <span class="page-tag-chip" v-for="t in project.detail.taskTags" :key="t">{{ t }}</span>
          </div>
        </div>
        <div class="page-tags-group" v-if="project.detail.links?.length">
          <span class="page-tags-label">連結</span>
          <div class="page-tags-list">
            <a class="page-tag-chip page-tag-link" v-for="link in project.detail.links" :key="link.label" :href="link.url" target="_blank">{{ link.label }}</a>
          </div>
        </div>
      </div>

      <!-- Meta 資訊 -->
      <div class="page-meta">
        <div class="page-meta-item">
          <span class="page-meta-label">客戶</span>
          <span class="page-meta-value">{{ project.meta.client }}</span>
        </div>
        <div class="page-meta-item">
          <span class="page-meta-label">年份</span>
          <span class="page-meta-value">{{ project.meta.year }}</span>
        </div>
        <div class="page-meta-item">
          <span class="page-meta-label">角色</span>
          <span class="page-meta-value">{{ project.meta.role }}</span>
        </div>
        <div class="page-meta-item">
          <span class="page-meta-label">團隊</span>
          <span class="page-meta-value">{{ project.meta.team }}</span>
        </div>
      </div>

      <!-- 專案目標 -->
      <template v-if="project.detail">
        <div class="page-divider"></div>
        <div class="page-section">
          <h2 class="page-section-title">專案目標</h2>
          <p class="page-section-text">{{ project.detail.goal }}</p>
        </div>

        <!-- 設計概念 -->
        <div class="page-divider"></div>
        <div class="page-section">
          <h2 class="page-section-title">設計概念</h2>
          <div class="page-design-block" v-for="(section, i) in project.detail.designSections" :key="i">
            <h3 class="page-design-subtitle">{{ section.title }}</h3>
            <p class="page-section-text">{{ section.content }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- 左右切換箭頭 -->
    <router-link
      v-if="prevProject"
      :to="`/project/${prevProject.id}`"
      class="page-arrow page-arrow-prev"
      aria-label="上一個作品"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </router-link>
    <router-link
      v-if="nextProject"
      :to="`/project/${nextProject.id}`"
      class="page-arrow page-arrow-next"
      aria-label="下一個作品"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </router-link>

    <!-- Mobile: 專案細節按鈕 -->
    <button class="mobile-detail-toggle" @click="detailOpen = !detailOpen">
      <span>{{ detailOpen ? '收起細節' : '專案細節' }}</span>
      <span class="detail-toggle-circle" :class="{ rotated: detailOpen }">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjects } from '@/composables/usePortfolioData'
import { useLenis } from '@/composables/useLenis'

const route = useRoute()
const router = useRouter()
const { projects } = useProjects()
const { destroy: destroyLenis } = useLenis()
const detailOpen = ref(false)

const project = computed(() => {
  return projects.value.find(p => p.id === route.params.slug)
})

const currentIndex = computed(() => {
  return projects.value.findIndex(p => p.id === route.params.slug)
})

const prevProject = computed(() => {
  return currentIndex.value > 0 ? projects.value[currentIndex.value - 1] : null
})

const nextProject = computed(() => {
  return currentIndex.value < projects.value.length - 1 ? projects.value[currentIndex.value + 1] : null
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') goBack()
  if (e.key === 'ArrowLeft' && prevProject.value) router.push(`/project/${prevProject.value.id}`)
  if (e.key === 'ArrowRight' && nextProject.value) router.push(`/project/${nextProject.value.id}`)
}

onMounted(() => {
  destroyLenis()
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.project-page {
  height: 100vh;
  overflow: hidden;
  background: #0F1720;
  display: flex;
  position: relative;
}

/* 關閉按鈕 */
.page-close {
  position: fixed;
  top: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: background 0.3s, color 0.3s;
}

.page-close:hover {
  background: #58FF45;
  color: #0F1720;
}

/* 左邊：圖片區域 */
.page-left {
  flex: 1;
  min-width: 0;
  margin-right: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
}

.page-left::-webkit-scrollbar {
  width: 0;
}

.page-images {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.page-images img {
  width: 100%;
  height: auto;
  display: block;
}

/* 右邊：專案介紹 */
.page-right {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  padding: 80px 40px 60px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 10;
}

.page-right::-webkit-scrollbar {
  width: 0;
}

.page-title {
  font-family: var(--font-body);
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  margin-bottom: 8px;
}

.page-subtitle {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
  margin-bottom: 28px;
}

/* 標籤區 */
.page-tags-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.page-tags-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-tags-label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.page-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.page-tag-chip {
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 13px;
  color: #fff;
  background: transparent;
}

.page-tag-link {
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.page-tag-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Meta 資訊 */
.page-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-meta-label {
  font-family: var(--font-heading);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-meta-value {
  font-family: var(--font-body);
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

/* 分隔線 */
.page-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 28px 0;
}

/* 內容段落 */
.page-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.page-section-title {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.page-section-text {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.page-design-block {
  margin-top: 16px;
}

.page-design-subtitle {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

/* 半圓形切換箭頭 */
.page-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 96px;
  border: none;
  background: #0F1720;
  color: #58FF45;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: background 0.3s, color 0.3s;
}

.page-arrow-prev {
  left: 0;
  border-radius: 0 48px 48px 0;
  padding-right: 10px;
}

.page-arrow-next {
  right: 0;
  border-radius: 48px 0 0 48px;
  padding-left: 10px;
}

.page-arrow:hover {
  background: #58FF45;
  color: #0F1720;
}

/* Mobile detail toggle — hidden on desktop */
.mobile-detail-toggle {
  display: none;
}

@media (max-width: 1199px) {
  .page-right {
    width: 360px;
    padding: 70px 32px 50px 24px;
  }
  .page-left {
    margin-right: 360px;
  }
}

@media (max-width: 767px) {
  .project-page {
    flex-direction: column;
  }
  .page-left {
    flex: none;
    height: auto;
    overflow: visible;
    margin-right: 0;
  }
  .page-close {
    top: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
    background: #0F1720;
    color: #58FF45;
    z-index: 200;
  }
  .page-close:hover {
    background: #58FF45;
    color: #0F1720;
  }
  .page-close svg {
    width: 24px;
    height: 24px;
  }
  .page-right {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    max-height: calc(100vh - 32px);
    display: block;
    padding: 24px 20px 40px 20px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    background: #1a1a2e;
    border-radius: 24px 24px 0 0;
    z-index: 150;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  }
  .page-right.mobile-detail-open {
    transform: translateY(0);
    opacity: 1;
  }
  .mobile-detail-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 14px 10px 18px;
    border: none;
    border-radius: 100px;
    background: #58FF45;
    color: #2A2A2A;
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    z-index: 200;
    transition: transform 0.3s, box-shadow 0.3s;
    white-space: nowrap;
  }
  .mobile-detail-toggle:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 8px 24px rgba(88, 255, 69, 0.3);
  }
  .detail-toggle-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: #fff;
    border-radius: 50%;
    color: #2A2A2A;
    transition: transform 0.3s;
  }
  .detail-toggle-circle.rotated {
    transform: rotate(45deg);
  }
  .page-arrow {
    width: 36px;
    height: 72px;
    z-index: 200;
  }
  .page-arrow svg {
    width: 24px;
    height: 24px;
  }
  .page-arrow-prev {
    border-radius: 0 36px 36px 0;
    padding-right: 6px;
  }
  .page-arrow-next {
    border-radius: 36px 0 0 36px;
    padding-left: 6px;
  }
}
</style>
