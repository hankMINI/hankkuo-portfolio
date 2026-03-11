<template>
  <div
    class="resume-button"
    :class="{ visible: isVisible }"
    :style="{ bottom: bottomPx }"
    @click="goToResume"
    aria-label="查看我的履歷"
  >
    <!-- 綠色漸層圓形背景 -->
    <svg class="resume-circle" viewBox="0 0 284 284" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="142" cy="142" r="142" fill="url(#resumeGradient)" />
      <defs>
        <linearGradient id="resumeGradient" x1="195.25" y1="-21.419" x2="-68.1962" y2="48.8119" gradientUnits="userSpaceOnUse">
          <stop stop-color="#58FF45" />
          <stop offset="1" stop-color="#99FF8E" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 下載雲端圖示 -->
    <svg class="resume-icon" viewBox="0 0 134.797 134.797" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clipDownload)">
        <path d="M44.9337 95.4804L67.3999 117.947L89.866 95.4804" stroke="black" stroke-width="11.2331" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M67.3984 67.3984V117.947" stroke="black" stroke-width="11.2331" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M117.268 101.6C122.151 98.1665 125.812 93.2661 127.722 87.6103C129.631 81.9544 129.688 75.8373 127.885 70.1466C126.082 64.456 122.513 59.4879 117.695 55.9634C112.877 52.4389 107.061 50.5412 101.092 50.5459H94.0152C92.3259 43.9626 89.1653 37.8483 84.771 32.6633C80.3768 27.4783 74.8636 23.3577 68.6465 20.6118C62.4293 17.8658 55.6702 16.566 48.878 16.8103C42.0859 17.0545 35.4376 18.8365 29.4337 22.0219C23.4299 25.2074 18.2269 29.7133 14.2165 35.2006C10.2061 40.6878 7.49274 47.0134 6.28074 53.701C5.06874 60.3886 5.38967 67.2641 7.21937 73.8097C9.04907 80.3554 12.3398 86.4007 16.844 91.4905" stroke="black" stroke-width="11.2331" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <defs>
        <clipPath id="clipDownload">
          <rect width="134.797" height="134.797" fill="white" />
        </clipPath>
      </defs>
    </svg>

    <!-- 黑色膠囊按鈕 -->
    <div class="resume-label">
      <span>我的履歷</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToResume() {
  router.push('/resume')
}

const isVisible = ref(false)
const bottomPx = ref('126px')

function getBaseBottom() {
  return window.innerWidth <= 767 ? 102 : 126
}

function onScroll() {
  isVisible.value = window.scrollY > 300

  const base = getBaseBottom()
  const footer = document.querySelector('.footer')
  if (footer) {
    const footerRect = footer.getBoundingClientRect()
    const footerVisible = window.innerHeight - footerRect.top
    if (footerVisible > 0) {
      bottomPx.value = (footerVisible + base) + 'px'
    } else {
      bottomPx.value = base + 'px'
    }
  } else {
    bottomPx.value = base + 'px'
  }
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.resume-button {
  position: fixed;
  right: 30px;
  bottom: 126px;
  width: 80px;
  height: 92px;
  z-index: 999;
  cursor: pointer;
  text-decoration: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s, box-shadow 0.3s;
}

@media (min-width: 1920px) {
  .resume-button {
    right: 70px;
  }
}

.resume-button.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.resume-button:hover {
  transform: translateY(-2px);
}

.resume-button:hover .resume-label {
  background: var(--color-green);
}

.resume-button:hover .resume-label span {
  color: #000;
}

/* 綠色圓形背景 */
.resume-circle {
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
}

/* 下載圖示 */
.resume-icon {
  position: absolute;
  width: 38px;
  height: 38px;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
}

/* 黑色膠囊標籤 */
.resume-label {
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 0;
  background: #000;
  border-radius: 200px;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s cubic-bezier(0.25, 0, 0.25, 1);
}

.resume-label span {
  font-family: var(--font-heading), var(--font-body), sans-serif;
  font-weight: 900;
  font-size: 13px;
  color: #fff;
  white-space: nowrap;
  line-height: 1;
  transition: color 0.3s cubic-bezier(0.25, 0, 0.25, 1);
}

@media (max-width: 767px) {
  .resume-button {
    width: 50px;
    height: 62px;
    right: 16px;
    bottom: 102px;
  }
  .resume-circle {
    width: 50px;
    height: 50px;
  }
  .resume-icon {
    width: 24px;
    height: 24px;
    top: 11px;
  }
  .resume-label {
    left: -2px;
    right: -2px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .resume-label span {
    font-size: 11px;
  }
}
</style>
