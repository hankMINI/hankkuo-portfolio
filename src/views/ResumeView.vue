<template>
  <!-- 關閉按鈕（放在 overlay 外面，避免 backdrop-filter 影響 fixed 定位） -->
  <button class="resume-close" @click="close" aria-label="關閉">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </svg>
  </button>

  <div class="resume-overlay" @click.self="close">
    <div class="resume-container">
      <!-- 履歷卡片 -->
      <div class="resume-card">
        <!-- 左側欄 -->
        <div class="resume-left">
          <div class="left-bg"></div>
          <div class="left-content">
            <!-- Hello + 頭貼 + 姓名 -->
            <div class="profile-header">
              <span class="hello-text">Hello</span>
              <div class="avatar-wrap">
                <img :src="avatarImg" alt="Hank" class="avatar">
              </div>
              <div class="name-block">
                <h1 class="name-zh">{{ resume.name }}</h1>
                <p class="name-en">{{ resume.nameEn }}</p>
              </div>
            </div>

            <!-- 自介 -->
            <div class="intro-block">
              <p v-for="(p, i) in resume.intro" :key="i">{{ p }}</p>
            </div>

            <!-- 專業技能 -->
            <div class="section-block">
              <h2 class="section-title">
                <span class="blue-dot-title"></span>
                專業技能
              </h2>
              <div class="skill-group" v-for="group in resume.skills" :key="group.category">
                <div class="skill-category">
                  <span class="blue-dot"></span>
                  <strong>{{ group.category }}</strong>
                </div>
                <p class="skill-item" v-for="item in group.items" :key="item">{{ item }}</p>
              </div>
            </div>

            <!-- 學歷 -->
            <div class="section-block">
              <h2 class="section-title">
                <span class="blue-dot-title"></span>
                學歷
              </h2>
              <p class="edu-item" v-for="edu in resume.education" :key="edu">{{ edu }}</p>
            </div>
          </div>
        </div>

        <!-- 右側欄 -->
        <div class="resume-right">
          <!-- 代表作品 -->
          <div class="section-block">
            <h2 class="section-title">
              <span class="blue-dot-title"></span>
              代表作品
            </h2>
            <div class="work-item" v-for="work in resume.featuredWorks" :key="work.company">
              <div class="work-company">
                <span class="blue-dot"></span>
                {{ work.company }}
              </div>
              <p class="work-desc">{{ work.description }}</p>
              <!-- 單一成果 -->
              <template v-if="work.result">
                <p class="work-result" v-for="(line, i) in work.result.split('\n')" :key="i">{{ line }}</p>
              </template>
              <!-- 多個成果 -->
              <template v-if="work.results">
                <p class="work-result-label">成果 :</p>
                <p class="work-result" v-for="(r, i) in work.results" :key="i">{{ r }}</p>
              </template>
            </div>
          </div>

          <!-- 工作經歷 -->
          <div class="section-block">
            <h2 class="section-title">
              <span class="blue-dot-title"></span>
              工作經歷
            </h2>
            <div class="exp-item" v-for="exp in resume.workExperience" :key="exp.company">
              <div class="exp-header">
                <span class="blue-dot"></span>
                <div>
                  <h3 class="exp-company">{{ exp.company }}</h3>
                  <p class="exp-role">{{ exp.role }}  {{ exp.dateRange }}</p>
                </div>
              </div>
              <ol class="exp-list">
                <li v-for="(item, i) in exp.items" :key="i">{{ item }}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- 固定下載按鈕（放在 overlay 外面，避免 backdrop-filter 影響 fixed 定位） -->
  <div class="download-bar">
    <a class="download-btn" href="#" target="_blank" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6.5 14L10 17.5L13.5 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 10V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M17.5 15C18.3 14.5 18.9 13.7 19.2 12.8C19.5 11.9 19.5 10.9 19.1 10C18.8 9.1 18.1 8.4 17.2 7.9C16.4 7.5 15.4 7.4 14.5 7.5H14C13.6 5.8 12.7 4.3 11.3 3.2C10 2.2 8.3 1.7 6.6 1.8C4.9 1.9 3.3 2.7 2.2 3.9C1 5.2 0.4 6.8 0.5 8.5C0.5 10.2 1.2 11.7 2.4 12.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>下載我的履歷</span>
    </a>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useResume } from '@/composables/usePortfolioData'
import { useLenis } from '@/composables/useLenis'
import avatarImg from '@/assets/avatar.png'

const router = useRouter()
const { resume } = useResume()
const { destroy, init } = useLenis()

onMounted(() => {
  destroy()
})

onUnmounted(() => {
  init()
})

function close() {
  router.push('/')
}
</script>

<style scoped>
.resume-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  padding: 40px 40px 100px;
}

.resume-container {
  position: relative;
  width: 100%;
  max-width: 1680px;
}

.resume-close {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 2002;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(15, 23, 32, 0.8);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.resume-close:hover {
  background: rgba(15, 23, 32, 1);
}

/* 履歷卡片 */
.resume-card {
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.25);
  background: linear-gradient(159deg, rgb(223, 233, 255) 4%, rgb(198, 230, 255) 103%);
}

/* 左側欄 */
.resume-left {
  position: relative;
  width: 37.8%;
  flex-shrink: 0;
}

.left-bg {
  position: absolute;
  inset: 0;
  background: rgba(85, 170, 255, 0.12);
}

.left-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 70px 50px 70px 80px;
}

/* Hello + 頭貼 + 姓名 */
.profile-header {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: start;
  gap: 0;
}

.hello-text {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 60px;
  color: #0F1720;
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  line-height: 1;
  align-self: start;
  margin-right: 12px;
}

.avatar-wrap {
  width: 134px;
  height: 134px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 16px;
  align-self: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name-block {
  align-self: end;
  padding-bottom: 8px;
}

.name-zh {
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 35px;
  color: #0F1720;
  line-height: 1.2;
  letter-spacing: 0.6px;
}

.name-en {
  font-family: var(--font-body);
  font-size: 22px;
  color: #7A7A7A;
  opacity: 0.9;
  line-height: 28px;
}

/* 自介 */
.intro-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.intro-block p {
  font-family: var(--font-body);
  font-size: 19px;
  line-height: 30px;
  color: #0F1720;
  opacity: 0.9;
}

/* 區塊標題 */
.section-title {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 28px;
  color: #0F1720;
  letter-spacing: 0.6px;
  position: relative;
  padding-left: 0;
  margin-bottom: 14px;
}

.blue-dot-title {
  position: absolute;
  left: -21px;
  top: 3px;
  width: 12px;
  height: 20px;
  background: #0060D5;
  border-radius: 23px;
}

/* 藍色圓點 */
.blue-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  min-width: 12px;
  background: #0060D5;
  border-radius: 50%;
  position: absolute;
  left: -21px;
  top: 10px;
}

/* 技能 */
.skill-group {
  margin-bottom: 8px;
}

.skill-category {
  position: relative;
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 19px;
  line-height: 30px;
  color: #0F1720;
  opacity: 0.9;
}

.skill-item {
  font-family: var(--font-body);
  font-size: 19px;
  line-height: 30px;
  color: #0F1720;
  opacity: 0.9;
}

/* 學歷 */
.edu-item {
  font-family: var(--font-body);
  font-size: 19px;
  line-height: 30px;
  color: #0F1720;
  opacity: 0.9;
}

/* 右側欄 */
.resume-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 80px 80px 80px 60px;
}

/* 代表作品 */
.work-item {
  margin-bottom: 14px;
  padding-left: 0;
  position: relative;
}

.work-company {
  position: relative;
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 21px;
  line-height: 28px;
  color: #0F1720;
  opacity: 0.9;
  letter-spacing: 0.6px;
  margin-bottom: 14px;
}

.work-desc {
  font-family: var(--font-body);
  font-size: 19px;
  line-height: 35px;
  color: #0F1720;
  opacity: 0.9;
  margin-bottom: 9px;
}

.work-result-label {
  font-family: var(--font-body);
  font-size: 19px;
  line-height: 35px;
  color: #0F1720;
  opacity: 0.9;
}

.work-result {
  font-family: var(--font-body);
  font-size: 19px;
  line-height: 35px;
  color: #0F1720;
  opacity: 0.9;
}

/* 工作經歷 */
.exp-item {
  margin-bottom: 12px;
}

.exp-header {
  display: flex;
  align-items: flex-start;
  gap: 0;
  position: relative;
  margin-bottom: 12px;
}

.exp-company {
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 20px;
  line-height: 28px;
  color: #0F1720;
  opacity: 0.9;
  letter-spacing: 0.6px;
}

.exp-role {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 28px;
  color: #7A7A7A;
  opacity: 0.9;
}

.exp-list {
  list-style: decimal;
  padding-left: 28px;
}

.exp-list li {
  font-family: var(--font-body);
  font-size: 19px;
  line-height: 30px;
  color: #0F1720;
  opacity: 0.9;
  margin-bottom: 12px;
}

/* 固定下載按鈕 */
.download-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  background: rgba(15, 23, 32, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 16px 40px;
  display: flex;
  justify-content: center;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(236deg, #58FF45 23%, #99FF8E 102%);
  color: #0F1720;
  padding: 14px 40px;
  border-radius: 100px;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(88, 255, 69, 0.3);
}

/* section-block 通用 */
.section-block {
  padding-left: 21px;
}
</style>
