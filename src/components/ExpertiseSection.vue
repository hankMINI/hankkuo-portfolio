<template>
  <section class="expertise" ref="sectionRef" :class="{ visible: isVisible }">
    <!-- 毛玻璃裝飾 -->
    <div class="glass-decoration" ref="glassDeco"></div>

    <div class="expertise-inner" ref="expertiseInner">
      <!-- 左上背景裝飾 -->
      <img :src="bgDeco" class="bg-deco" alt="">
      <div class="expertise-header">
        <h2 class="child-fade" :class="{ 'fade-in': childrenVisible[0] }">Expertise & Skills</h2>
        <p class="subtitle child-fade" :class="{ 'fade-in': childrenVisible[1] }">核心能力</p>
        <p class="desc child-fade" :class="{ 'fade-in': childrenVisible[2] }">從策略洞察到產品落地，以邏輯驅動設計，創造兼具美學與商業價值的數位體驗</p>
      </div>

      <div class="skill-carousel">
        <div class="skill-cards" ref="skillCardsRef">
          <div
            v-for="(card, i) in skillCards"
            :key="card.label"
            class="skill-card child-fade"
            :class="{ 'skill-card-highlight': card.highlight, 'fade-in': childrenVisible[3 + i] }"
          >
            <div class="card-label" :class="{ 'card-label-green': card.highlight }">{{ card.label }}</div>
            <ul class="card-list">
              <li v-for="item in card.items" :key="item">{{ item }}</li>
            </ul>
            <div class="card-tools">
              <span class="tool-tag" v-for="tool in card.tools" :key="tool">{{ tool }}</span>
            </div>
          </div>
        </div>
        <!-- Mobile carousel arrows -->
        <div class="carousel-nav">
          <button class="carousel-arrow" :class="{ disabled: currentCard <= 0 }" @click="prevCard" aria-label="上一張">
            <img :src="arrowIcon" alt="">
          </button>
          <span class="carousel-indicator">{{ currentCard + 1 }} / {{ skillCards.length }}</span>
          <button class="carousel-arrow carousel-arrow-right" :class="{ disabled: currentCard >= skillCards.length - 1 }" @click="nextCard" aria-label="下一張">
            <img :src="arrowIcon" alt="">
          </button>
        </div>
      </div>
    </div>

    <!-- 綠色跑馬燈 -->
    <MarqueeStrip color="green" />
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSkillCards } from '@/composables/usePortfolioData'

const { skillCards } = useSkillCards()
import MarqueeStrip from './MarqueeStrip.vue'
import bgDeco from '@/assets/bg-decoration.png'
import arrowIcon from '@/assets/fe_arrow-left.svg'

const props = defineProps({
  isVisible: { type: Boolean, default: false }
})

const sectionRef = ref(null)
const glassDeco = ref(null)
const expertiseInner = ref(null)
const skillCardsRef = ref(null)
const childrenVisible = ref(Array(6).fill(false))

// Mobile carousel
const currentCard = ref(0)

function scrollToCard(index) {
  const container = skillCardsRef.value
  if (!container) return
  const cards = container.querySelectorAll('.skill-card')
  if (!cards[index]) return
  currentCard.value = index
  const card = cards[index]
  const scrollLeft = card.offsetLeft - container.offsetLeft
  container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
}

function prevCard() {
  if (currentCard.value > 0) scrollToCard(currentCard.value - 1)
}

function nextCard() {
  if (currentCard.value < skillCards.value.length - 1) scrollToCard(currentCard.value + 1)
}

function onCarouselScroll() {
  const container = skillCardsRef.value
  if (!container) return
  const cards = container.querySelectorAll('.skill-card')
  if (!cards.length) return
  const containerLeft = container.scrollLeft
  const containerWidth = container.offsetWidth
  let closest = 0
  let minDist = Infinity
  cards.forEach((card, i) => {
    const cardCenter = card.offsetLeft - container.offsetLeft + card.offsetWidth / 2
    const dist = Math.abs(cardCenter - (containerLeft + containerWidth / 2))
    if (dist < minDist) { minDist = dist; closest = i }
  })
  currentCard.value = closest
}

// 子元素依序進場
watch(() => props.isVisible, (val) => {
  if (val) {
    childrenVisible.value.forEach((_, i) => {
      setTimeout(() => { childrenVisible.value[i] = true }, i * 300)
    })
  } else {
    childrenVisible.value = Array(6).fill(false)
  }
})

// Glass decoration + expertise 3D 堆疊效果
let currentGlassRotate = 18, targetGlassRotate = 18
let currentGlassScale = 0.9, targetGlassScale = 0.9
let currentExpRotateX = 0, targetExpRotateX = 0
let currentExpTranslateY = 0, targetExpTranslateY = 0
let rafId = null

function lerp(a, b, t) { return a + (b - a) * t }

function isMobile() {
  return window.innerWidth <= 767
}

// 手機版動態計算 sticky top
// stickyBuffer: 提前 stick 的距離，讓 section 停留一段才被蓋過
const STICKY_BUFFER = -100
function updateStickyTop() {
  const section = sectionRef.value
  if (!section || !isMobile()) {
    if (section) section.style.top = ''
    return
  }
  const sectionHeight = section.offsetHeight
  const viewportHeight = window.innerHeight
  if (sectionHeight > viewportHeight) {
    section.style.top = `${-(sectionHeight - viewportHeight) + STICKY_BUFFER}px`
  } else {
    section.style.top = `${STICKY_BUFFER}px`
  }
}

function onResize() {
  updateStickyTop()
}

function updateGlassEffect() {
  const section = sectionRef.value
  if (!section) { rafId = requestAnimationFrame(updateGlassEffect); return }

  const mobile = isMobile()
  const expRect = section.getBoundingClientRect()

  // Glass decoration（桌面版才有）
  if (!mobile && glassDeco.value) {
    const expProgress = Math.min(Math.max(1 - expRect.top / window.innerHeight, 0), 1)
    targetGlassRotate = 18 - expProgress * 12
    targetGlassScale = 0.9 + expProgress * 0.15
    currentGlassRotate = lerp(currentGlassRotate, targetGlassRotate, 0.2)
    currentGlassScale = lerp(currentGlassScale, targetGlassScale, 0.2)
    glassDeco.value.style.transform = `translateX(-44%) rotate(${currentGlassRotate}deg) scale(${currentGlassScale})`
  }

  // 被蓋過時淡出（桌面 + 手機都要）
  const contentWrap = document.querySelector('.content-wrap')
  if (contentWrap && section.classList.contains('visible')) {
    const contentWrapRect = contentWrap.getBoundingClientRect()
    const expHeight = expRect.height
    const startThreshold = expHeight * 0.35
    const fadeRange = expHeight * 0.3
    const overlap = expRect.bottom - contentWrapRect.top

    if (overlap <= startThreshold) {
      section.style.opacity = ''
      targetExpRotateX = 0
      targetExpTranslateY = 0
    } else if (overlap >= startThreshold + fadeRange) {
      section.style.opacity = '0'
      targetExpRotateX = 4
      targetExpTranslateY = -50
    } else {
      const fadeProgress = (overlap - startThreshold) / fadeRange
      section.style.opacity = 1 - fadeProgress
      targetExpRotateX = fadeProgress * 4
      targetExpTranslateY = fadeProgress * -50
    }

    if (!mobile) {
      // 桌面版：3D 旋轉
      currentExpRotateX = lerp(currentExpRotateX, targetExpRotateX, 0.15)
      if (expertiseInner.value) {
        expertiseInner.value.style.transform = `perspective(800px) rotateX(${currentExpRotateX}deg)`
      }
    } else {
      // 手機版：往上推動
      currentExpTranslateY = lerp(currentExpTranslateY, targetExpTranslateY, 0.15)
      if (expertiseInner.value) {
        expertiseInner.value.style.transform = `translateY(${currentExpTranslateY}px)`
      }
    }
  }

  rafId = requestAnimationFrame(updateGlassEffect)
}

onMounted(() => {
  updateGlassEffect()
  updateStickyTop()
  window.addEventListener('resize', onResize, { passive: true })
  if (skillCardsRef.value) {
    skillCardsRef.value.scrollTo({ left: 0 })
    skillCardsRef.value.addEventListener('scroll', onCarouselScroll, { passive: true })
  }
})
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  if (skillCardsRef.value) {
    skillCardsRef.value.removeEventListener('scroll', onCarouselScroll)
  }
})
</script>

<style scoped>
.expertise {
  position: sticky;
  top: 20px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0;
  opacity: 0;
  filter: blur(10px);
  transition: opacity 1.5s cubic-bezier(0.25, 0, 0.25, 1), filter 1.5s cubic-bezier(0.25, 0, 0.25, 1);
}

.expertise.visible {
  opacity: 1;
  filter: blur(0px);
}

.glass-decoration {
  position: absolute;
  top: 21px;
  left: 48%;
  transform: translateX(-44%) rotate(18deg) scale(0.9);
  will-change: transform;
  width: 1450px;
  height: 1152px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12.444px);
  -webkit-backdrop-filter: blur(12.444px);
  border-radius: 64px;
  z-index: 2;
  pointer-events: none;
}

.expertise-inner {
  position: relative;
  z-index: 3;
  width: 95%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  padding: 100px 60px 280px 60px;
  border-radius: 64px 64px 0 0;
  background: linear-gradient(208.488deg, rgb(49, 111, 255) 4.17%, rgb(43, 104, 248) 57.5%, rgb(0, 57, 200) 109.81%);
  overflow: hidden;
  transform-origin: bottom center;
  will-change: transform;
}

.bg-deco {
  position: absolute;
  left: 0;
  top: 0;
  width: 628px;
  height: 741px;
  object-fit: cover;
  pointer-events: none;
  z-index: 0;
}

.expertise-header {
  position: relative;
  z-index: 1;
  text-align: center;
  width: 847px;
}

.expertise-header h2 {
  font-family: var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  color: #fff;
  line-height: 56px;
}

.expertise-header .subtitle {
  font-family: var(--font-heading), var(--font-body);
  font-size: 16px;
  line-height: 30px;
  color: #ffffffa1;
}

.expertise-header .desc {
  font-family: var(--font-heading), var(--font-body);
  font-size: 21px;
  line-height: 40px;
  color: #fff;
}

.skill-carousel {
  width: 100%;
}

.skill-cards {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 32px;
  align-items: center;
}

.skill-card {
  background: #fff;
  border-radius: 32px;
  padding: 48px 32px 28px;
  width: 100%;
  position: relative;
  color: #000;
}

.skill-card-highlight {
  margin-top: -40px;
}

.card-label {
  position: absolute;
  top: -19.5px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 30px;
  border-radius: 48px 48px 48px 0;
  font-family: var(--font-heading), var(--font-body);
  font-weight: 700;
  font-size: 18px;
  line-height: 40px;
}

.card-list {
  list-style: disc;
  padding-left: 30px;
  margin-bottom: 8px;
}

.card-list li {
  font-family: var(--font-heading), var(--font-body);
  font-size: 18px;
  line-height: 36px;
  color: #000;
}

.card-tools {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tool-tag {
  background: #ECF1FF;
  padding: 8px 16px;
  border-radius: 32px;
  font-family: 'PingFang TC', var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

/* Carousel — hidden on desktop, visible on mobile */
.carousel-nav {
  display: none;
}

/* child-fade */
.child-fade {
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
  transition: opacity 1s cubic-bezier(0.25, 0, 0.25, 1),
              filter 1s cubic-bezier(0.25, 0, 0.25, 1),
              transform 1s cubic-bezier(0.25, 0, 0.25, 1);
}

.child-fade.fade-in {
  opacity: 1;
  filter: blur(0px);
  transform: translateY(0);
}

@media (max-width: 1199px) {
  .expertise-inner {
    padding: 60px 40px 200px 40px;
    gap: 48px;
    border-radius: 40px 40px 0 0;
  }
  .expertise-header {
    width: 100%;
  }
  .expertise-header h2 {
    font-size: 32px;
    line-height: 44px;
  }
  .expertise-header .desc {
    font-size: 18px;
    line-height: 36px;
  }
  .skill-cards {
    gap: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .skill-card {
    width: calc(50% - 12px);
    min-width: 280px;
  }
  .skill-card-highlight {
    margin-top: 0;
  }
  .skill-card:nth-child(3) {
    margin-top: 24px;
  }
  .glass-decoration {
    width: 1000px;
    height: 800px;
  }
  .bg-deco {
    width: 400px;
    height: auto;
  }
}

@media (max-width: 767px) {
  .expertise {
    position: sticky;
    /* top 由 JS 動態計算 */
    transform: translateY(30px);
    transition: opacity 1.5s cubic-bezier(0.25, 0, 0.25, 1),
                filter 1.5s cubic-bezier(0.25, 0, 0.25, 1),
                transform 1.5s cubic-bezier(0.25, 0, 0.25, 1);
  }
  .expertise.visible {
    transform: translateY(0);
  }
  .expertise-inner {
    width: 100%;
    padding: 30px 20px 120px 20px;
    gap: 24px;
    border-radius: 24px 24px 0 0;
  }
  .expertise-header h2 {
    font-size: 24px;
    line-height: 36px;
  }
  .expertise-header .subtitle {
    font-size: 14px;
  }
  .expertise-header .desc {
    font-size: 16px;
    line-height: 30px;
  }
  .skill-carousel {
    width: calc(100% + 20px);
    margin-right: -20px;
    position: relative;
    z-index: 1;
  }
  .skill-cards {
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: flex-start;
    gap: 24px;
    width: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-top: 24px;
    padding-bottom: 8px;
  }
  .skill-cards::-webkit-scrollbar {
    display: none;
  }
  .skill-card {
    flex: 0 0 240px;
    min-width: 240px;
    scroll-snap-align: start;
    padding: 40px 24px 20px;
    border-radius: 16px;
  }
  .card-label {
    font-size: 16px;
    padding: 6px 20px;
    line-height: 32px;
  }
  .card-list li {
    font-size: 16px;
    line-height: 30px;
  }
  .tool-tag {
    font-size: 12px;
    padding: 6px 12px;
  }
  .carousel-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }
  .carousel-arrow {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: #58FF45;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
    padding: 0;
  }
  .carousel-arrow img {
    width: 18px;
    height: 18px;
    filter: brightness(0);
    pointer-events: none;
    transition: filter 0.3s;
  }
  .carousel-arrow-right {
    transform: rotate(180deg);
  }
  .carousel-arrow:hover:not(.disabled) {
    background: #0F1720;
  }
  .carousel-arrow:hover:not(.disabled) img {
    filter: brightness(0) invert(73%) sepia(87%) saturate(2506%) hue-rotate(73deg) brightness(104%) contrast(102%);
  }
  .carousel-arrow.disabled {
    background: rgba(196, 205, 213, 0.5);
    cursor: not-allowed;
    pointer-events: none;
  }
  .carousel-arrow.disabled img {
    filter: none;
    opacity: 0.5;
  }
  .carousel-indicator {
    font-family: var(--font-heading);
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
  }
  :deep(.marquee) {
    display: none;
  }
  .glass-decoration {
    display: none;
  }
  .bg-deco {
    width: 280px;
    height: auto;
  }
}

@media (min-width: 1920px) {
  .expertise-inner {
    width: calc(100% - 240px);
    max-width: none;
  }
}
</style>
