<template>
  <nav class="nav" :class="{ visible: isVisible, 'menu-open': menuOpen }">
    <div class="nav-inner">
      <div class="logo">Hank Portfolio</div>

      <!-- Hamburger (mobile) -->
      <button class="hamburger" :class="{ open: menuOpen }" @click="toggleMenu" aria-label="選單">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Desktop menu -->
      <ul class="menu desktop-menu">
        <li><a href="#projects" @click.prevent="scrollToSection('#projects')">MyProject</a></li>
        <li><a href="#resume" @click.prevent="scrollToSection('#resume')">My Experiences</a></li>
      </ul>
    </div>
  </nav>

  <!-- Mobile fullscreen overlay — Teleport to body so backdrop-filter works -->
  <Teleport to="body">
    <div class="mobile-overlay" :class="{ active: menuOpen }">
      <div class="mobile-backdrop" @click="closeMenu"></div>
      <ul class="mobile-menu">
        <li
          v-for="(item, i) in menuItems"
          :key="item.label"
          class="mobile-menu-item"
          :class="{ show: itemsVisible[i] }"
          :style="{ transitionDelay: itemsVisible[i] ? (i * 0.12) + 's' : '0s' }"
        >
          <a :href="item.href" @click.prevent="scrollToSection(item.href)">{{ item.label }}</a>
        </li>
      </ul>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useLenis } from '@/composables/useLenis'

defineProps({
  isVisible: { type: Boolean, default: false }
})

const { scrollTo } = useLenis()
const menuOpen = ref(false)
const itemsVisible = ref([false, false])

const menuItems = [
  { label: 'MyProject', href: '#projects' },
  { label: 'My Experiences', href: '#resume' }
]

function toggleMenu() {
  if (menuOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

function openMenu() {
  menuOpen.value = true
  nextTick(() => {
    menuItems.forEach((_, i) => {
      setTimeout(() => { itemsVisible.value[i] = true }, i * 120)
    })
  })
}

function closeMenu() {
  for (let i = menuItems.length - 1; i >= 0; i--) {
    itemsVisible.value[i] = false
  }
  setTimeout(() => {
    menuOpen.value = false
  }, 300)
}

function scrollToSection(selector) {
  const target = document.querySelector(selector)
  if (target) {
    closeMenu()
    setTimeout(() => {
      scrollTo(target, { offset: -80, duration: 1.5 })
    }, 400)
  }
}
</script>

<style scoped>
.nav {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(15, 23, 32, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0;
  filter: blur(10px);
  transition: opacity 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              filter 1.5s cubic-bezier(0.25, 0, 0.25, 1),
              background 0.6s cubic-bezier(0.25, 0, 0.25, 1),
              backdrop-filter 0.6s cubic-bezier(0.25, 0, 0.25, 1),
              -webkit-backdrop-filter 0.6s cubic-bezier(0.25, 0, 0.25, 1);
}

.nav.visible {
  opacity: 1;
  filter: blur(0px);
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px;
  position: relative;
  z-index: 1002;
}

.logo {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 24px;
  color: #fff;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1003;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: transform 0.4s cubic-bezier(0.25, 0, 0.25, 1),
              opacity 0.4s cubic-bezier(0.25, 0, 0.25, 1);
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Desktop menu */
.desktop-menu {
  display: flex;
  gap: 24px;
}

.desktop-menu a {
  font-family: var(--font-heading);
  font-size: 20px;
  padding: 12px 24px;
  border-radius: 100px;
  transition: background 0.3s, color 0.3s;
}

.desktop-menu a:hover {
  color: #58FF45;
}

@media (max-width: 1199px) {
  .nav-inner {
    padding: 24px;
  }
  .desktop-menu a {
    font-size: 16px;
    padding: 10px 16px;
  }
}

@media (max-width: 767px) {
  .nav-inner {
    padding: 16px 20px;
  }
  .logo {
    font-size: 20px;
  }
  .hamburger {
    display: flex;
  }
  .desktop-menu {
    display: none;
  }
  .nav.menu-open {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    z-index: 1002;
  }
}

@media (min-width: 1920px) {
  .nav-inner {
    max-width: none;
    padding: 32px 120px;
  }
}
</style>

<!-- Unscoped styles for Teleported overlay -->
<style>
.mobile-overlay {
  display: none;
}

@media (max-width: 767px) {
  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 1001;
    pointer-events: none;
    visibility: hidden;
    transition: visibility 0s 0.6s;
  }

  .mobile-overlay.active {
    pointer-events: auto;
    visibility: visible;
    transition: visibility 0s 0s;
  }

  .mobile-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    background: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
    transition: background 0.8s cubic-bezier(0.25, 0, 0.25, 1),
                backdrop-filter 0.8s cubic-bezier(0.25, 0, 0.25, 1),
                -webkit-backdrop-filter 0.8s cubic-bezier(0.25, 0, 0.25, 1);
  }

  .mobile-overlay.active .mobile-backdrop {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-menu-item {
    opacity: 0;
    transform: translateY(30px);
    filter: blur(8px);
    transition: opacity 0.5s cubic-bezier(0.25, 0, 0.25, 1),
                transform 0.5s cubic-bezier(0.25, 0, 0.25, 1),
                filter 0.5s cubic-bezier(0.25, 0, 0.25, 1);
  }

  .mobile-menu-item.show {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0px);
  }

  .mobile-menu-item a {
    display: block;
    font-family: var(--font-heading);
    font-size: 28px;
    font-weight: 600;
    color: #fff;
    padding: 20px 40px;
    text-decoration: none;
    transition: color 0.3s;
  }

  .mobile-menu-item a:hover,
  .mobile-menu-item a:active {
    color: #58FF45;
  }
}
</style>
