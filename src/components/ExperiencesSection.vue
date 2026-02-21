<template>
  <section class="experiences" id="resume" ref="sectionRef" :class="{ visible: isVisible }">
    <div class="section-header child-fade" :class="{ 'fade-in': childrenVisible[0] }">
      <h2>My Experiences</h2>
    </div>

    <div class="experience-list">
      <div
        v-for="(exp, i) in experiences"
        :key="exp.id"
        :ref="el => cardRefs[exp.id] = el"
        class="experience-card child-fade"
        :class="{ expanded: expandedId === exp.id, 'fade-in': childrenVisible[i + 1] }"
      >
        <div class="exp-header" @click="toggle(exp.id)">
          <span class="company-dot"></span>
          <div class="exp-info">
            <h3>{{ exp.company }}</h3>
            <span class="exp-role">{{ exp.role }}  {{ exp.dateRange }}</span>
          </div>
          <button class="expand-btn">
            <img :src="arrowRight" alt="">
          </button>
        </div>
        <div class="exp-content" v-show="expandedId === exp.id" v-if="exp.highlights.length || exp.responsibilities.length || exp.works">
          <div class="exp-block highlights-block" v-if="exp.highlights.length">
            <span class="block-label">核心亮點</span>
            <ul>
              <li v-for="item in exp.highlights" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="exp-block" v-if="exp.responsibilities.length">
            <span class="block-label">主要職責</span>
            <ul>
              <li v-for="item in exp.responsibilities" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="exp-block works-block" v-if="exp.works">
            <span class="block-label">代表作品</span>
            <p v-html="exp.works.replace(/\n/g, '<br>')"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { useExperiences } from '@/composables/usePortfolioData'
import { useLenis } from '@/composables/useLenis'
import arrowRight from '@/assets/fe_arrow-right.svg'

const { scrollTo } = useLenis()
const { experiences } = useExperiences()

const props = defineProps({
  isVisible: { type: Boolean, default: false }
})

const expandedId = ref(experiences.value[0]?.id || null)
const childrenVisible = ref(Array(experiences.value.length + 1).fill(false))
const cardRefs = reactive({})

function toggle(id) {
  expandedId.value = expandedId.value === id ? null : id
  if (expandedId.value && cardRefs[expandedId.value]) {
    nextTick(() => {
      scrollTo(cardRefs[expandedId.value], { offset: -100 })
    })
  }
}

// 當 experiences 數量變化時，更新動畫陣列和預設展開項
watch(experiences, (val) => {
  childrenVisible.value = Array(val.length + 1).fill(false)
  if (!expandedId.value && val.length) {
    expandedId.value = val[0].id
  }
})

watch(() => props.isVisible, (val) => {
  if (val) {
    childrenVisible.value.forEach((_, i) => {
      setTimeout(() => { childrenVisible.value[i] = true }, i * 300)
    })
  } else {
    childrenVisible.value = Array(experiences.value.length + 1).fill(false)
  }
})
</script>

<style scoped>
.experiences {
  color: #0F1720;
  margin: 0 auto;
  padding: 0px 80px 120px 80px;
  position: relative;
  opacity: 0;
  filter: blur(10px);
  transform: translateY(30px);
  transition: opacity 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              filter 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              transform 1.5s cubic-bezier(0.25, 0, 0.25, 1);
}

.experiences.visible {
  opacity: 1;
  filter: blur(0px);
  transform: translateY(0);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 42px;
}

.section-header h2 {
  font-family: var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  color: #0F1720;
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.experience-card {
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  color: #0F1720;
  padding: 32px;
}

.exp-header {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.company-dot {
  width: 12px;
  height: 12px;
  min-width: 12px;
  background: #22C55E;
  border-radius: 50%;
}

.exp-info {
  flex: 1;
}

.exp-info h3 {
  font-size: 22px;
  font-weight: 600;
}

.exp-role {
  font-size: 16px;
  color: #7A7A7A;
  line-height: 30px;
}

.expand-btn {
  width: 74px;
  height: 74px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: transform 0.3s;
}

.expand-btn img {
  width: 24px;
  height: 24px;
  transform: rotate(90deg);
  transition: transform 0.3s;
}

.experience-card.expanded .expand-btn img {
  transform: rotate(-90deg);
}

.exp-content {
  margin-top: 20px;
}

.exp-block {
  margin-bottom: 20px;
}

.exp-block:last-child {
  margin-bottom: 0;
}

.block-label {
  display: inline-block;
  background: #0F1720;
  color: #fff;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 900;
  line-height: 30px;
  margin-bottom: 12px;
}

.exp-block ul {
  list-style: disc;
  padding-left: 24px;
}

.exp-block li {
  font-size: 18px;
  line-height: 36px;
  color: #0F1720;
}

.exp-block p {
  font-size: 16px;
  line-height: 30px;
  color: #0F1720;
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
  .experiences {
    padding: 0 60px 80px 60px;
  }
  .section-header h2 {
    font-size: 32px;
  }
  .experience-list {
    gap: 24px;
  }
  .section-header {
    margin-bottom: 40px;
  }
  .experience-card {
    padding: 36px;
  }
}

@media (max-width: 767px) {
  .experiences {
    padding: 0 20px 60px 20px;
  }
  .section-header {
    margin-bottom: 24px;
  }
  .section-header h2 {
    font-size: 24px;
  }
  .experience-list {
    gap: 16px;
  }
  .experience-card {
    padding: 24px;
    border-radius: 16px;
  }
  .exp-header {
    flex-wrap: wrap;
  }
  .company-dot {
    width: 10px;
    height: 10px;
    min-width: 10px;
  }
  .exp-info h3 {
    font-size: 16px;
  }
  .exp-role {
    font-size: 14px;
    line-height: 20px;
  }
  .expand-btn {
    width: 48px;
    height: 48px;
  }
  .block-label {
    font-size: 14px;
    line-height: 24px;
  }
  .exp-block li {
    font-size: 16px;
    line-height: 28px;
  }
  .exp-block p {
    font-size: 16px;
    line-height: 28px;
  }
}
</style>
