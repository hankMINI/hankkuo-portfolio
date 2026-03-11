<template>
  <section class="projects" id="projects">
    <div class="section-header" v-reveal>
      <h2>My Project</h2>
      <CtaButton href="#" class="header-cta">更多作品</CtaButton>
      <div class="nav-arrows">
        <button class="arrow-btn project-prev" ref="prevBtn" @click="swiperInstance?.slidePrev()">
          <img :src="arrowLeft" alt="上一個">
        </button>
        <button class="arrow-btn active project-next" ref="nextBtn" @click="swiperInstance?.slideNext()">
          <img :src="arrowRight" alt="下一個">
        </button>
      </div>
    </div>

    <div class="swiper project-swiper" ref="swiperEl">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(project, i) in displayProjects" :key="project.id + '-' + i" ref="slideRefs">
          <router-link
            :to="`/project/${project.id}`"
            class="project-card"
            :data-project="project.id"
          >
            <span class="card-tag">{{ project.tag }}</span>
            <div class="card-image">
              <img :src="project.coverImage" alt="">
            </div>
            <div class="card-info">
              <h3>{{ project.title }}</h3>
              <p>{{ project.subtitle }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Mobile carousel nav -->
    <div class="mobile-project-nav">
      <button class="mobile-nav-arrow" :class="{ disabled: currentSlide <= 0 }" @click="swiperInstance?.slidePrev()" aria-label="上一個">
        <img :src="arrowNavLeft" alt="">
      </button>
      <span class="mobile-nav-indicator">{{ currentSlide + 1 }} / {{ totalSlides }}</span>
      <button class="mobile-nav-arrow mobile-nav-arrow-right" :class="{ disabled: currentSlide >= totalSlides - 1 }" @click="swiperInstance?.slideNext()" aria-label="下一個">
        <img :src="arrowNavLeft" alt="">
      </button>
    </div>

    <CtaButton href="#" style="margin-top: 32px;" class="bottom-cta">更多作品</CtaButton>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swiper from 'swiper'
import 'swiper/css'
import { useProjects } from '@/composables/usePortfolioData'
import CtaButton from './CtaButton.vue'
import arrowLeft from '@/assets/fe_arrow-left.svg'
import arrowRight from '@/assets/fe_arrow-right.svg'
import arrowNavLeft from '@/assets/fe_arrow-left.svg'

const { projects } = useProjects()

const swiperEl = ref(null)
const prevBtn = ref(null)
const nextBtn = ref(null)
const swiperInstance = ref(null)
const currentSlide = ref(0)
const totalSlides = ref(1)
const slideRefs = ref([])

// 顯示的專案列表（包括重複卡片，跟原版一致）
const displayProjects = computed(() => {
  const list = [...projects.value]
  // 原版有重複的卡片
  if (projects.value.length >= 4) {
    list.push(projects.value[0]) // 重複第 1 個
    list.push(projects.value[0]) // 再重複
    list.push(projects.value[3]) // 重複第 4 個
  }
  return list
})

function updateButtons(swiper) {
  if (prevBtn.value) {
    prevBtn.value.disabled = swiper.isBeginning
    prevBtn.value.classList.toggle('active', !swiper.isBeginning)
  }
  if (nextBtn.value) {
    nextBtn.value.disabled = swiper.isEnd
    nextBtn.value.classList.toggle('active', !swiper.isEnd)
  }
  currentSlide.value = swiper.activeIndex
  totalSlides.value = swiper.slides ? swiper.slides.length : 1
}

onMounted(() => {
  if (swiperEl.value) {
    swiperInstance.value = new Swiper(swiperEl.value, {
      slidesPerView: 'auto',
      spaceBetween: 32,
      on: {
        init(s) { updateButtons(s) },
        slideChange(s) { updateButtons(s) },
      }
    })
  }

  // 卡片進場動畫：只在首次滾動到此區塊時觸發，切換 slide 不再重複動畫
  const slides = slideRefs.value
  if (slides.length) {
    slides.forEach(el => el.classList.add('reveal'))
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          slides.forEach((el, i) => {
            setTimeout(() => el.classList.add('revealed'), i * 200)
          })
          sectionObserver.disconnect()
        }
      })
    }, { threshold: 0.15 })
    sectionObserver.observe(swiperEl.value)
  }
})

</script>

<style scoped>
.projects {
  margin: 0 auto;
  padding: 280px 80px 80px 80px;
  margin-top: -450px;
  position: relative;
  z-index: 4;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 56px;
}

.section-header h2 {
  font-family: var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  color: #0F1720;
}

.nav-arrows {
  display: flex;
  gap: 24px;
  position: relative;
  z-index: 100;
}

.arrow-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: rgba(196, 205, 213, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  position: relative;
  z-index: 100;
}

.arrow-btn img {
  width: 20px;
  height: 20px;
  opacity: 0.5;
  transition: opacity 0.3s, filter 0.3s;
  pointer-events: none;
}

.arrow-btn.active {
  background: #58FF45;
}

.arrow-btn.active img {
  opacity: 1;
  filter: brightness(0);
}

.arrow-btn:disabled {
  cursor: not-allowed;
  background: rgba(196, 205, 213, 0.5);
}

.arrow-btn:disabled img {
  opacity: 0.5;
  filter: none;
}

.arrow-btn:hover:not(:disabled) {
  background: #0F1720;
}

.arrow-btn:hover:not(:disabled) img {
  opacity: 1;
  filter: brightness(0) invert(73%) sepia(87%) saturate(2506%) hue-rotate(73deg) brightness(104%) contrast(102%);
}

/* Header CTA — hidden on desktop, shown on mobile */
.header-cta {
  display: none;
}

/* Swiper */
.swiper {
  overflow: visible !important;
}

.project-swiper {
  overflow-x: clip !important;
  overflow-y: visible !important;
}

.project-swiper :deep(.swiper-slide) {
  width: 280px;
}

.project-card {
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
  width: 280px;
  background: #fff;
  border-radius: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.card-tag {
  position: absolute;
  top: -19.5px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 30px;
  border-radius: 48px 48px 48px 0;
  font-family: var(--font-heading), var(--font-body);
  font-size: 20px;
  font-weight: 700;
  line-height: 48px;
}

.card-image {
  padding: 20px;
}

.card-image img {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 32px;
  pointer-events: none;
  user-select: none;
}

.card-info {
  padding: 0 20px 20px;
  color: #000;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-info h3 {
  font-family: 'Poppins', var(--font-body);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
}

.card-info p {
  font-family: 'Poppins', var(--font-body);
  font-size: 16px;
  color: #000;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 60px;
}

/* Mobile project nav - hidden on desktop */
.mobile-project-nav {
  display: none;
}

@media (max-width: 1199px) {
  .projects {
    padding: 180px 60px 50px 60px;
    margin-top: -350px;
  }
  .section-header h2 {
    font-size: 32px;
  }
  .section-header {
    margin-bottom: 32px;
  }
  .swiper-slide {
    margin-right: 24px;
  }
}

@media (max-width: 767px) {
  .projects {
    padding: 40px 20px 30px 20px;
    margin-top: -84px;
  }
  .section-header h2 {
    font-size: 24px;
  }
  .section-header {
    margin-bottom: 40px;
  }
  .header-cta {
    display: inline-flex;
  }
  .bottom-cta {
    display: none !important;
  }
  .nav-arrows {
    display: none;
  }
  .project-swiper :deep(.swiper-slide) {
    width: 240px;
    margin-right: 24px !important;
  }
  .project-card {
    width: 100%;
    border-radius: 16px;
  }
  .card-image {
    padding: 20px;
    padding-bottom: 12px;
  }
  .card-image img {
    height: auto;
    width: 100%;
    border-radius: 16px;
  }
  .card-tag {
    font-size: 16px;
    padding: 6px 20px;
    line-height: 36px;
  }
  .card-info h3 {
    font-size: 16px;
  }
  .card-info p {
    font-size: 14px;
    height: 48px;
  }
  .mobile-project-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  .mobile-nav-arrow {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: #58FF45;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s, filter 0.3s;
  }
  .mobile-nav-arrow img {
    width: 18px;
    height: 18px;
    filter: brightness(0);
    pointer-events: none;
    transition: filter 0.3s;
  }
  .mobile-nav-arrow-right {
    transform: rotate(180deg);
  }
  .mobile-nav-arrow:hover:not(.disabled) {
    background: #0F1720;
  }
  .mobile-nav-arrow:hover:not(.disabled) img {
    filter: brightness(0) invert(73%) sepia(87%) saturate(2506%) hue-rotate(73deg) brightness(104%) contrast(102%);
  }
  .mobile-nav-arrow.disabled {
    background: rgba(196, 205, 213, 0.5);
    cursor: not-allowed;
  }
  .mobile-nav-arrow.disabled img {
    filter: none;
    opacity: 0.5;
  }
  .mobile-nav-indicator {
    font-family: var(--font-heading);
    font-size: 16px;
    font-weight: 600;
    color: #0F1720;
  }
}
</style>
