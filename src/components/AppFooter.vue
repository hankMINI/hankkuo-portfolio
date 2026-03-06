<template>
  <footer class="footer" ref="sectionRef" :class="{ visible: isVisible }">
    <!-- Thanks For Watching 區塊 -->
    <div class="thanks-section">
      <div class="thanks-pill thanks-green" :class="{ 'fade-in': childrenVisible[0] }">Thanks</div>
      <div class="thanks-pill thanks-blue" :class="{ 'fade-in': childrenVisible[1] }">For</div>
      <div class="thanks-pill thanks-black" :class="{ 'fade-in': childrenVisible[2] }">Watching</div>
    </div>

    <!-- 聯絡資訊 -->
    <div class="contact-bar" :class="{ 'fade-in': childrenVisible[3] }">
      <div class="contact-bar-inner">
        <div class="contact-title">GET IN<br>TOUCH</div>
        <div class="contact-info">
          <span class="contact-label">Phone</span>
          <span class="contact-value">{{ profile.contact.phone }}</span>
        </div>
        <div class="contact-info">
          <span class="contact-label">Mail</span>
          <span class="contact-value">{{ profile.contact.email }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useProfile } from '@/composables/usePortfolioData'

const { profile } = useProfile()

const props = defineProps({
  isVisible: { type: Boolean, default: false }
})

const childrenVisible = ref([false, false, false, false])

watch(() => props.isVisible, (val) => {
  if (val) {
    childrenVisible.value.forEach((_, i) => {
      setTimeout(() => { childrenVisible.value[i] = true }, i * 300)
    })
  } else {
    childrenVisible.value = [false, false, false, false]
  }
})
</script>

<style scoped>
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
  padding-top: 80px;
  opacity: 0;
  filter: blur(10px);
  transform: translateY(30px);
  transition: opacity 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              filter 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              transform 1.5s cubic-bezier(0.25, 0, 0.25, 1);
}

.footer.visible {
  opacity: 1;
  filter: blur(0px);
  transform: translateY(0);
}

.thanks-section {
  position: relative;
  width: 440px;
  height: 348px;
  margin-left: auto;
  margin-right: auto;
}

.thanks-pill {
  position: absolute;
  padding: 16px 42px;
  border-radius: 86px;
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 52px;
  line-height: 72px;
  white-space: nowrap;
}

.thanks-green {
  top: 0;
  left: 45px;
  background: linear-gradient(236deg, #58FF45 23%, #99FF8E 102%);
  color: #0F1720;
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
  transition: opacity 1s cubic-bezier(0.25, 0, 0.25, 1), filter 1s cubic-bezier(0.25, 0, 0.25, 1), transform 1s cubic-bezier(0.25, 0, 0.25, 1);
}

.thanks-green.fade-in {
  opacity: 1;
  filter: blur(0px);
  transform: translateY(0);
}

.thanks-blue {
  top: 109px;
  left: 108px;
  background: linear-gradient(205deg, #316FFF 4%, #2B68F8 57%, #0039C8 110%);
  color: #fff;
  opacity: 0;
  filter: blur(10px);
  transform: rotate(-25deg) translateY(20px);
  transition: opacity 1s cubic-bezier(0.25, 0, 0.25, 1), filter 1s cubic-bezier(0.25, 0, 0.25, 1), transform 1s cubic-bezier(0.25, 0, 0.25, 1);
}

.thanks-blue.fade-in {
  opacity: 1;
  filter: blur(0px);
  transform: rotate(-25deg) translateY(0);
}

.thanks-black {
  top: 224px;
  left: 0;
  background: #000;
  color: #58FF45;
  opacity: 0;
  filter: blur(10px);
  transform: rotate(4deg) translateY(20px);
  transition: opacity 1s cubic-bezier(0.25, 0, 0.25, 1), filter 1s cubic-bezier(0.25, 0, 0.25, 1), transform 1s cubic-bezier(0.25, 0, 0.25, 1);
}

.thanks-black.fade-in {
  opacity: 1;
  filter: blur(0px);
  transform: rotate(4deg) translateY(0);
}

.contact-bar {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 200px;
  padding: 24px 80px;
  opacity: 0;
  filter: blur(10px);
  transform: translateY(20px);
  transition: opacity 1s cubic-bezier(0.25, 0, 0.25, 1), filter 1s cubic-bezier(0.25, 0, 0.25, 1), transform 1s cubic-bezier(0.25, 0, 0.25, 1);
}

.contact-bar.fade-in {
  opacity: 1;
  filter: blur(0px);
  transform: translateY(0);
}

.contact-bar-inner {
  width: 100%;
  max-width: 1440px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 80px;
}

.contact-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  line-height: 42px;
  color: #fff;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-label {
  font-family: var(--font-heading);
  font-size: 18px;
  color: #fff;
}

.contact-value {
  font-family: var(--font-heading);
  font-size: 26px;
  color: #fff;
}

@media (max-width: 1199px) {
  .footer {
    gap: 48px;
    padding-top: 60px;
  }
  .thanks-section {
    width: 320px;
    height: 260px;
  }
  .thanks-pill {
    font-size: 40px;
    line-height: 56px;
    padding: 12px 32px;
  }
  .thanks-blue {
    top: 80px;
    left: 80px;
  }
  .thanks-black {
    top: 168px;
  }
  .contact-bar {
    gap: 80px;
    padding: 24px 40px;
  }
  .contact-bar-inner {
    padding: 0 40px;
  }
  .contact-value {
    font-size: 22px;
  }
}

@media (max-width: 767px) {
  .footer {
    gap: 32px;
    padding-top: 40px;
  }
  .thanks-section {
    width: 220px;
    height: 180px;
  }
  .thanks-pill {
    font-size: 28px;
    line-height: 40px;
    padding: 8px 24px;
  }
  .thanks-green {
    left: 50%;
    transform: translateX(-50%) translateY(20px);
  }
  .thanks-green.fade-in {
    transform: translateX(-50%) translateY(0);
  }
  .thanks-blue {
    top: 36px;
    left: 44%;
    transform: rotate(-25deg) translateX(-30%) translateY(20px);
  }
  .thanks-blue.fade-in {
    transform: rotate(-25deg) translateX(-30%) translateY(0);
  }
  .thanks-black {
    top: 112px;
    left: 58%;
    transform: rotate(4deg) translateX(-60%) translateY(20px);
  }
  .thanks-black.fade-in {
    transform: rotate(4deg) translateX(-60%) translateY(0);
  }
  .contact-bar {
    padding: 24px 20px;
  }
  .contact-bar-inner {
    flex-direction: column;
    align-items: center;
    gap: 24px;
    padding: 0 12px;
    text-align: center;
  }
  .contact-info {
    align-items: center;
  }
  .contact-title {
    font-size: 20px;
    line-height: 32px;
  }
  .contact-label {
    font-size: 14px;
  }
  .contact-value {
    font-size: 18px;
    word-break: break-all;
  }
}

@media (min-width: 1920px) {
  .contact-bar-inner {
    max-width: none;
    width: calc(100% - 240px);
  }
}
</style>
