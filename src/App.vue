<template>
  <router-view />
</template>

<script setup>
</script>

<style>
@import './styles/variables.css';
@import './styles/base.css';
@import './styles/animations.css';

/* Modal open 狀態 */
body.modal-open {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
</style>
