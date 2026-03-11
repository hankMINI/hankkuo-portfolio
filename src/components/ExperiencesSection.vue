<template>
  <section class="experiences" id="resume">
    <div class="section-header" v-reveal>
      <h2>My Experiences</h2>
    </div>

    <div class="timeline">
      <div
        v-for="(exp, i) in experiences"
        :key="exp.id"
        class="timeline-item"
        v-reveal
      >
        <!-- 時間軸圓點 -->
        <div class="timeline-dot"></div>

        <!-- 內容 -->
        <div class="timeline-content">
          <h3 class="timeline-company">{{ exp.company }}</h3>
          <span class="timeline-role">{{ exp.role }}｜{{ exp.dateRange }}</span>

          <div class="timeline-block" v-if="exp.highlights.length">
            <span class="block-label">核心亮點</span>
            <ul>
              <li v-for="item in exp.highlights" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="timeline-block" v-if="exp.responsibilities.length">
            <span class="block-label">主要職責</span>
            <ul>
              <li v-for="item in exp.responsibilities" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="timeline-block" v-if="exp.works">
            <span class="block-label">代表作品</span>
            <p v-html="exp.works.replace(/\n/g, '<br>')"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useExperiences } from '@/composables/usePortfolioData'

const { experiences } = useExperiences()
</script>

<style scoped>
.experiences {
  color: #0F1720;
  margin: 0 auto;
  padding: 0px 80px 120px 80px;
  position: relative;
}

.section-header {
  margin-bottom: 48px;
}

.section-header h2 {
  font-family: var(--font-heading);
  font-size: 40px;
  font-weight: 600;
  color: #0F1720;
}

/* 時間軸 */
.timeline {
  position: relative;
  padding-left: 32px;
}

/* 時間軸線 */
.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 0;
  width: 0;
  border-left: 2px dashed rgba(15, 23, 32, 0.2);
}

.timeline-item {
  position: relative;
  padding-bottom: 48px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

/* 圓點：中間實心 + 外圈光暈 */
.timeline-dot {
  position: absolute;
  left: -32px;
  top: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-4px);
  z-index: 1;
}

.timeline-dot::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(144, 238, 144, 0.25);
  border-radius: 50%;
}

.timeline-dot::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #7AE858;
  border-radius: 50%;
}

/* 內容 */
.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 16px;
}

.timeline-company {
  font-size: 22px;
  font-weight: 700;
  color: #0F1720;
  line-height: 1.4;
}

.timeline-role {
  font-size: 15px;
  color: #7A7A7A;
  margin-top: 4px;
  margin-bottom: 20px;
}

.timeline-block {
  margin-bottom: 16px;
}

.timeline-block:last-child {
  margin-bottom: 0;
}

.block-label {
  display: inline-block;
  background: #0F1720;
  color: #fff;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 10px;
}

.timeline-block ul {
  list-style: disc;
  padding-left: 20px;
}

.timeline-block li {
  font-size: 16px;
  line-height: 32px;
  color: #0F1720;
}

.timeline-block p {
  font-size: 16px;
  line-height: 30px;
  color: #0F1720;
}

@media (max-width: 1199px) {
  .experiences {
    padding: 0 60px 80px 60px;
  }
  .section-header h2 {
    font-size: 32px;
  }
  .section-header {
    margin-bottom: 40px;
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
  .timeline {
    padding-left: 24px;
  }
  .timeline::before {
    left: 4px;
  }
  .timeline-dot {
    left: -24px;
    transform: translateX(-5px);
  }
  .timeline-dot::before {
    width: 18px;
    height: 18px;
  }
  .timeline-dot::after {
    width: 8px;
    height: 8px;
  }
  .timeline-item {
    padding-bottom: 36px;
  }
  .timeline-company {
    font-size: 18px;
  }
  .timeline-role {
    font-size: 14px;
  }
  .timeline-block li {
    font-size: 15px;
    line-height: 28px;
  }
  .timeline-block p {
    font-size: 15px;
    line-height: 28px;
  }
}
</style>
