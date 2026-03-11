<template>
  <section class="expertise">
    <!-- 毛玻璃裝飾 -->
    <div class="glass-decoration"></div>

    <div class="expertise-inner">
      <!-- 左上背景裝飾 -->
      <img :src="bgDeco" class="bg-deco" alt="">
      <div class="expertise-header" v-reveal>
        <h2>Expertise & Skills</h2>
        <p class="subtitle">核心能力</p>
        <p class="desc">從策略洞察到產品落地，以邏輯驅動設計，創造兼具美學與商業價值的數位體驗</p>
      </div>

      <div class="skill-carousel">
        <div class="skill-cards" ref="skillCardsRef">
          <div
            v-for="(card, i) in skillCards"
            :key="card.label"
            class="skill-card"
            :class="{ 'skill-card-highlight': card.highlight }"
            ref="cardRefs"
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useSkillCards } from '@/composables/usePortfolioData'

const { skillCards } = useSkillCards()
import MarqueeStrip from './MarqueeStrip.vue'
import bgDeco from '@/assets/bg-decoration.png'
import arrowIcon from '@/assets/fe_arrow-left.svg'

const skillCardsRef = ref(null)
const cardRefs = ref([])

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

onMounted(() => {
  if (skillCardsRef.value) {
    skillCardsRef.value.scrollTo({ left: 0 })
    skillCardsRef.value.addEventListener('scroll', onCarouselScroll, { passive: true })
  }

  // 卡片進場動畫：只在首次滾動到此區塊時觸發
  const cards = cardRefs.value
  if (cards.length && skillCardsRef.value) {
    cards.forEach(el => el.classList.add('reveal'))
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cards.forEach((el, i) => {
            setTimeout(() => el.classList.add('revealed'), i * 200)
          })
          sectionObserver.disconnect()
        }
      })
    }, { threshold: 0.15 })
    sectionObserver.observe(skillCardsRef.value)
  }
})
onUnmounted(() => {
  if (skillCardsRef.value) {
    skillCardsRef.value.removeEventListener('scroll', onCarouselScroll)
  }
})
</script>

<style scoped>
.expertise {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0;
}

.glass-decoration {
  position: absolute;
  top: 21px;
  left: 48%;
  transform: translateX(-44%) rotate(18deg) scale(0.9);
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
  align-items: stretch;
}

.skill-card {
  background: #fff;
  border-radius: 32px;
  padding: 48px 32px 28px;
  flex: 1 1 0;
  min-width: 0;
  position: relative;
  color: #000;
  display: flex;
  flex-direction: column;
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
  flex-wrap: nowrap;
  margin-top: auto;
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
    position: relative;
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
