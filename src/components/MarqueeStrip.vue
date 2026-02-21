<template>
  <div class="marquee" :class="[`marquee-${color}`]">
    <div class="marquee-track" ref="track">
      <span class="marquee-item" v-for="n in 16" :key="n">
        <img :src="starIcon" alt=""> Portfolio
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import starIcon from '@/assets/star-icon.svg'

defineProps({
  color: { type: String, default: 'green' } // 'green' or 'black'
})

const track = ref(null)

onMounted(() => {
  if (track.value) {
    const content = track.value.innerHTML
    track.value.innerHTML = content + content
  }
})
</script>

<style scoped>
.marquee {
  padding: 28px;
  overflow: hidden;
  position: relative;
  left: 50%;
  transform: translateX(-32%) translateY(-450%) rotate(4deg);
  width: 130vw;
}

.marquee-green {
  background: #58FF45;
  color: #000;
  position: relative;
  z-index: 1;
}

.marquee-black {
  background: #000;
  color: #fff;
  transform: translateX(-50%) translateY(-270%) rotate(-5deg);
  position: relative;
  z-index: 10;
}

.marquee-black .marquee-track {
  animation: marquee-reverse 71s linear infinite;
}

.marquee-black :deep(.marquee-item img) {
  filter: brightness(0) invert(1);
}

.marquee-track {
  display: flex;
  gap: 59px;
  animation: marquee 71s linear infinite;
  width: max-content;
}

.marquee-item {
  display: flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 500;
  white-space: nowrap;
}

.marquee-item img {
  width: 38px;
  height: 38px;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

@media (max-width: 1199px) {
  .marquee {
    padding: 22px;
  }
  .marquee-item {
    font-size: 22px;
  }
  .marquee-item img {
    width: 32px;
    height: 32px;
  }
  .marquee-track {
    gap: 40px;
  }
}

@media (max-width: 767px) {
  .marquee {
    padding: 16px;
  }
  .marquee-item {
    font-size: 18px;
  }
  .marquee-item img {
    width: 26px;
    height: 26px;
  }
  .marquee-track {
    gap: 30px;
  }
}
</style>
