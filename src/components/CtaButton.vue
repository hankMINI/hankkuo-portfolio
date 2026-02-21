<template>
  <a :href="href" class="cta-button" @click="$emit('click', $event)">
    <span><slot /></span>
    <span class="arrow-circle">
      <img :src="arrowIcon" alt="">
    </span>
  </a>
</template>

<script setup>
import arrowIcon from '@/assets/arrow-icon.svg'

defineProps({
  href: { type: String, default: '#' }
})

defineEmits(['click'])
</script>

<style scoped>
.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  background: #58FF45;
  color: #2A2A2A;
  padding: 12px 16px 12px 20px;
  border-radius: 100px;
  font-size: 18px;
  font-weight: 600;
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(88, 255, 69, 0.3);
}

.arrow-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #fff;
  border-radius: 50%;
}

.arrow-circle img {
  width: 12px;
  height: auto;
}

@media (max-width: 767px) {
  .cta-button {
    font-size: 15px;
    padding: 10px 14px 10px 18px;
    margin-top: 0;
  }
  .arrow-circle {
    width: 30px;
    height: 30px;
  }
  .arrow-circle img {
    width: 10px;
  }
}
</style>
