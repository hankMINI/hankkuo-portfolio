<template>
  <div class="project-page" v-if="project">
    <!-- 頂部導航 -->
    <nav class="project-nav">
      <router-link to="/" class="back-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>返回</span>
      </router-link>
      <div class="project-nav-title">{{ project.title }}</div>
      <div class="project-nav-spacer"></div>
    </nav>

    <!-- 作品內容 -->
    <main class="project-content">
      <section class="project-hero">
        <div class="project-hero-inner">
          <span class="project-tag">{{ project.tag }}</span>
          <h1>{{ project.title }}</h1>
          <p class="project-subtitle">{{ project.subtitle }}</p>
          <div class="project-meta">
            <div class="meta-item">
              <span class="meta-label">客戶</span>
              <span class="meta-value">{{ project.meta.client }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">年份</span>
              <span class="meta-value">{{ project.meta.year }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">角色</span>
              <span class="meta-value">{{ project.meta.role }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">團隊</span>
              <span class="meta-value">{{ project.meta.team }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="project-gallery">
        <div class="gallery-item" v-for="(img, i) in project.images" :key="i">
          <img :src="img" :alt="project.title">
        </div>
      </section>

      <!-- 下一個專案 -->
      <section class="project-next-section" v-if="nextProject">
        <span class="next-label">下一個專案</span>
        <router-link :to="`/project/${nextProject.id}`" class="next-project">
          <h3>{{ nextProject.title }}</h3>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
      </section>
    </main>

    <footer class="project-footer">
      <p>&copy; 2024 Hank Portfolio. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjects } from '@/composables/usePortfolioData'

const route = useRoute()
const { projects } = useProjects()

const project = computed(() => {
  return projects.value.find(p => p.id === route.params.slug)
})

const nextProject = computed(() => {
  const idx = projects.value.findIndex(p => p.id === route.params.slug)
  return idx < projects.value.length - 1 ? projects.value[idx + 1] : null
})
</script>

<style scoped>
.project-page {
  min-height: 100vh;
  background: #0F1720;
}

.project-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 40px;
  background: rgba(15, 23, 32, 0.9);
  backdrop-filter: blur(20px);
  z-index: 100;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 16px;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #58FF45;
}

.project-nav-title {
  font-family: var(--font-body);
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.project-nav-spacer {
  width: 80px;
}

.project-content {
  padding-top: 100px;
}

.project-hero {
  text-align: center;
  padding: 60px 40px;
}

.project-hero-inner {
  max-width: 800px;
  margin: 0 auto;
}

.project-tag {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 6px 20px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
}

.project-hero h1 {
  font-family: var(--font-body);
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.project-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 40px;
}

.project-meta {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

.meta-value {
  font-size: 15px;
  color: #fff;
}

.project-gallery {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gallery-item img {
  width: 100%;
  max-width: 1400px;
  height: auto;
  display: block;
}

.project-next-section {
  text-align: center;
  padding: 80px 40px;
}

.next-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  display: block;
  margin-bottom: 16px;
}

.next-project {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  transition: color 0.3s;
}

.next-project:hover {
  color: #58FF45;
}

.next-project h3 {
  font-size: 24px;
}

.project-footer {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
}
</style>
