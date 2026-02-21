<template>
  <Teleport to="body">
    <div class="project-modal" :class="{ active: isOpen }">
      <div class="modal-backdrop" @click="onBackdropClick"></div>
      <button class="modal-close" @click="close" aria-label="關閉" v-show="!detailOpen">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="modal-container">
        <div class="modal-content" ref="modalContent" :class="{ 'detail-blurred': detailOpen }" @wheel.stop>
          <template v-if="currentProject">
            <!-- 左邊：作品圖片（可捲動） -->
            <div class="modal-left">
              <div class="modal-images">
                <img v-for="(src, i) in currentProject.images" :key="i" :src="src" alt="" loading="lazy">
              </div>
            </div>

          </template>
        </div>
      </div>

      <!-- 專案介紹（桌機：右側固定；手機：底部彈窗） -->
      <div class="modal-right" ref="modalRight" :class="{ 'mobile-detail-open': detailOpen }" v-if="currentProject" @touchmove.stop @wheel.stop>
        <!-- Bottom sheet header (mobile) -->
        <div class="sheet-header">
          <div class="sheet-handle"><span></span></div>
          <button class="sheet-close" @click="detailOpen = false" aria-label="關閉細節">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <!-- 標題區 -->
        <h1 class="modal-title">{{ currentProject.title }}</h1>
        <p class="modal-subtitle">{{ currentProject.subtitle }}</p>

        <!-- 標籤區 -->
        <div class="modal-tags-section" v-if="currentProject.detail">
          <div class="modal-tags-group">
            <span class="modal-tags-label">專案類型</span>
            <div class="modal-tags-list">
              <span class="modal-tag-chip" v-for="t in currentProject.detail.projectTypes" :key="t">{{ t }}</span>
            </div>
          </div>
          <div class="modal-tags-group">
            <span class="modal-tags-label">產業類型</span>
            <div class="modal-tags-list">
              <span class="modal-tag-chip" v-for="t in currentProject.detail.industryTypes" :key="t">{{ t }}</span>
            </div>
          </div>
          <div class="modal-tags-group">
            <span class="modal-tags-label">任務標籤</span>
            <div class="modal-tags-list">
              <span class="modal-tag-chip" v-for="t in currentProject.detail.taskTags" :key="t">{{ t }}</span>
            </div>
          </div>
          <div class="modal-tags-group" v-if="currentProject.detail.links?.length">
            <span class="modal-tags-label">連結</span>
            <div class="modal-tags-list">
              <a class="modal-tag-chip modal-tag-link" v-for="link in currentProject.detail.links" :key="link.label" :href="link.url" target="_blank">{{ link.label }}</a>
            </div>
          </div>
        </div>

        <!-- Meta 資訊 -->
        <div class="modal-meta">
          <div class="modal-meta-item">
            <span class="modal-meta-label">客戶</span>
            <span class="modal-meta-value">{{ currentProject.meta.client }}</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">年份</span>
            <span class="modal-meta-value">{{ currentProject.meta.year }}</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">角色</span>
            <span class="modal-meta-value">{{ currentProject.meta.role }}</span>
          </div>
          <div class="modal-meta-item">
            <span class="modal-meta-label">團隊</span>
            <span class="modal-meta-value">{{ currentProject.meta.team }}</span>
          </div>
        </div>

        <!-- 專案目標 -->
        <template v-if="currentProject.detail">
          <div class="modal-divider"></div>
          <div class="modal-section">
            <h2 class="modal-section-title">專案目標</h2>
            <p class="modal-section-text">{{ currentProject.detail.goal }}</p>
          </div>

          <!-- 設計概念 -->
          <div class="modal-divider"></div>
          <div class="modal-section">
            <h2 class="modal-section-title">設計概念</h2>
            <div class="modal-design-block" v-for="(section, i) in currentProject.detail.designSections" :key="i">
              <h3 class="modal-design-subtitle">{{ section.title }}</h3>
              <p class="modal-section-text">{{ section.content }}</p>
            </div>
          </div>
        </template>
      </div>

      <!-- Mobile: Bottom sheet 遮罩 -->
      <div class="sheet-backdrop" :class="{ active: detailOpen }" @click="closeDetail"></div>

      <!-- Mobile: 專案細節按鈕（fixed 底部） -->
      <button class="mobile-detail-toggle" :class="{ active: detailOpen }" @click="detailOpen = !detailOpen">
        <span>{{ detailOpen ? '收起細節' : '專案細節' }}</span>
        <span class="detail-toggle-circle" :class="{ rotated: detailOpen }">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </button>

      <!-- 左右切換箭頭（半圓形，貼齊螢幕邊緣） -->
      <button class="modal-arrow modal-arrow-prev" :class="{ disabled: !prevProjectId }" :disabled="!prevProjectId" @click.stop="prevProjectId && openProject(prevProjectId)" aria-label="上一個作品">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="modal-arrow modal-arrow-next" :class="{ disabled: !nextProjectId }" :disabled="!nextProjectId" @click.stop="nextProjectId && openProject(nextProjectId)" aria-label="下一個作品">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useProjects } from '@/composables/usePortfolioData'
import { useLenis } from '@/composables/useLenis'

const { projects } = useProjects()
const { stop, start } = useLenis()

const isOpen = ref(false)
const currentProjectId = ref(null)
const modalContent = ref(null)
const detailOpen = ref(false)
let scrollPosition = 0

const projectIds = computed(() => projects.value.map(p => p.id))

const currentProject = computed(() => {
  return projects.value.find(p => p.id === currentProjectId.value)
})

const currentIndex = computed(() => projectIds.value.indexOf(currentProjectId.value))
const prevProjectId = computed(() => currentIndex.value > 0 ? projectIds.value[currentIndex.value - 1] : null)
const nextProjectId = computed(() => currentIndex.value < projectIds.value.length - 1 ? projectIds.value[currentIndex.value + 1] : null)

function openProject(id) {
  currentProjectId.value = id
  detailOpen.value = false
  if (!isOpen.value) {
    scrollPosition = window.scrollY
    isOpen.value = true
    document.body.classList.add('modal-open')
    stop()
  }
  nextTick(() => {
    if (modalContent.value) modalContent.value.scrollTop = 0
  })
}

function close() {
  detailOpen.value = false
  isOpen.value = false
  document.body.classList.remove('modal-open')
  start()
  window.scrollTo(0, scrollPosition)
  setTimeout(() => { currentProjectId.value = null }, 400)
}

function closeDetail() {
  detailOpen.value = false
}

function onBackdropClick() {
  if (detailOpen.value) {
    detailOpen.value = false
  } else {
    close()
  }
}

function onKeydown(e) {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowLeft' && prevProjectId.value) openProject(prevProjectId.value)
  if (e.key === 'ArrowRight' && nextProjectId.value) openProject(nextProjectId.value)
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

defineExpose({ openProject })
</script>

<style scoped>
.project-modal {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  visibility: hidden;
  transition: visibility 0s 0.8s;
}

.project-modal.active {
  visibility: visible;
  pointer-events: auto;
  transition: visibility 0s 0s;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  transition: background 0.8s ease, backdrop-filter 0.8s ease, -webkit-backdrop-filter 0.8s ease;
}

.project-modal.active .modal-backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.modal-close {
  position: absolute;
  top: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2002;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s 0.2s, transform 0.3s 0.2s, background 0.3s, color 0.3s;
}

.project-modal.active .modal-close {
  opacity: 1;
  transform: scale(1);
}

.modal-close:hover {
  background: #58FF45;
  color: #0F1720;
}

.modal-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
  transform: scale(0.95);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s;
  z-index: 2000;
  overflow: hidden;
}

.project-modal.active .modal-container {
  transform: scale(1);
  opacity: 1;
}

.modal-content {
  display: flex;
  height: 100%;
}

/* 左邊：圖片區域，可捲動 */
.modal-left {
  flex: 1;
  min-width: 0;
  margin-right: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
}

.modal-left::-webkit-scrollbar {
  width: 0;
}

.modal-images {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.modal-images img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 0;
}

/* 右邊：專案介紹，固定寬度 */
.modal-right {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  padding: 80px 40px 60px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 2001;
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 0.4s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-modal.active .modal-right {
  opacity: 1;
  transform: scale(1);
}

.modal-right::-webkit-scrollbar {
  width: 0;
}

.modal-title {
  font-family: var(--font-body);
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  margin-bottom: 8px;
}

.modal-subtitle {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
  margin-bottom: 28px;
}

/* 標籤區 */
.modal-tags-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}

.modal-tags-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-tags-label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
}

.modal-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-tag-chip {
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 13px;
  color: #fff;
  background: transparent;
}

.modal-tag-link {
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.modal-tag-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Meta 資訊 */
.modal-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-meta-label {
  font-family: var(--font-heading);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modal-meta-value {
  font-family: var(--font-body);
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

/* 分隔線 */
.modal-divider {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 28px 0;
}

/* 內容段落 */
.modal-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-section-title {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.modal-section-text {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.modal-design-block {
  margin-top: 16px;
}

.modal-design-subtitle {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.modal-design-block .modal-section-text {
  margin-top: 0;
}

/* 半圓形切換箭頭 — 貼齊螢幕邊緣 */
.modal-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 96px;
  border: none;
  background: #0F1720;
  color: #58FF45;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2002;
  transition: background 0.3s, color 0.3s, opacity 0.3s;
}

.modal-arrow-prev {
  left: 0;
  border-radius: 0 48px 48px 0;
  padding-right: 10px;
}

.modal-arrow-next {
  right: 0;
  border-radius: 48px 0 0 48px;
  padding-left: 10px;
}

.modal-arrow:hover:not(:disabled) {
  background: #58FF45;
  color: #0F1720;
}

.modal-arrow:disabled,
.modal-arrow.disabled {
  background: rgba(171, 191, 168, 0.4);
  color: rgba(0, 0, 0, 0.3);
  cursor: not-allowed;
}

@media (max-width: 1199px) {
  .modal-right {
    width: 360px;
    padding: 70px 32px 50px 24px;
  }
  .modal-left {
    margin-right: 360px;
  }
}

/* Mobile only — hidden on desktop */
.mobile-detail-toggle {
  display: none;
}
.sheet-handle {
  display: none;
}
.sheet-header {
  display: none;
}
.sheet-close {
  display: none;
}
.sheet-backdrop {
  display: none;
}

@media (max-width: 767px) {
  .modal-content {
    flex-direction: column;
    overflow-y: auto;
  }
  .modal-left {
    flex: none;
    max-height: none;
    overflow: visible;
    margin-right: 0;
  }
  .modal-content.detail-blurred {
    filter: blur(10px);
    transition: filter 0.4s ease;
  }
  .sheet-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 2003;
    pointer-events: none;
    transition: background 0.4s ease;
  }
  .sheet-backdrop.active {
    background: rgba(0, 0, 0, 0.5);
    pointer-events: auto;
  }
  .modal-right,
  .project-modal.active .modal-right {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    max-height: calc(100vh - 32px);
    flex: none;
    display: block;
    padding: 24px 20px 40px 20px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    touch-action: pan-y;
    background: #1a1a2e;
    border-radius: 24px 24px 0 0;
    z-index: 2004;
    transform: translateY(100%);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  }
  .modal-right::-webkit-scrollbar {
    width: 4px;
  }
  .modal-right::-webkit-scrollbar-track {
    background: transparent;
  }
  .modal-right::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
  .project-modal.active .modal-right.mobile-detail-open {
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
    z-index: 2003;
    transition: transform 0.3s, box-shadow 0.3s;
    white-space: nowrap;
    text-decoration: none;
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
  .sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0 12px;
    position: sticky;
    top: -24px;
    z-index: 1;
    background: #1a1a2e;
    margin: -24px -20px 0px;
    padding: 12px 12px 12px 20px;
    border-radius: 24px 24px 0 0;
  }
  .sheet-handle {
    display: flex;
    flex: 1;
    justify-content: center;
    padding: 8px 0;
    cursor: pointer;
  }
  .sheet-handle span {
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
  }
  .sheet-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: #0F1720;
    color: #58FF45;
    cursor: pointer;
    flex-shrink: 0;
    transition: background 0.3s, color 0.3s;
  }
  .sheet-close:hover {
    background: #58FF45;
    color: #0F1720;
  }
  .modal-close {
    top: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
    background: #0F1720;
    color: #58FF45;
    z-index: 2005;
  }
  .modal-close:hover {
    background: #58FF45;
    color: #0F1720;
  }
  .modal-close svg {
    width: 24px;
    height: 24px;
  }
  .modal-title {
    font-size: 20px;
  }
  .modal-section-title {
    font-size: 16px;
  }
  .modal-arrow {
    width: 36px;
    height: 72px;
    z-index: 2005;
  }
  .modal-arrow svg {
    width: 24px;
    height: 24px;
  }
  .modal-arrow-prev {
    border-radius: 0 36px 36px 0;
    padding-right: 6px;
  }
  .modal-arrow-next {
    border-radius: 36px 0 0 36px;
    padding-left: 6px;
  }
}
</style>
