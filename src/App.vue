<template>
  <!-- 頁面轉場動畫：用 v-slot 取得當前路由組件，搭配 :key 確保每次路由切換都觸發轉場 -->
  <!-- mode="out-in"：舊頁面先淡出完成，新頁面才開始淡入（避免兩頁同時顯示） -->
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>

<script setup>
</script>

<style>
@import './styles/variables.css';
@import './styles/base.css';
@import './styles/animations.css';

/* ===== 頁面轉場動畫 ===== */

/* 進場過程 & 離場過程：定義過渡的時間和緩動函數 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

/* 進場起始狀態（opacity: 0 → 1）& 離場結束狀態（opacity: 1 → 0） */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
