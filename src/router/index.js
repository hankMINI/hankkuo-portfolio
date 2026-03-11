import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// 防止瀏覽器自動恢復滾動位置，由 Vue Router scrollBehavior 統一管理
history.scrollRestoration = 'manual'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/project/:slug',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue'),
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('@/views/ResumeView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 返回首頁：恢復離開時的位置
    if (to.name === 'Home' && savedHomeScrollY !== null) {
      const top = savedHomeScrollY
      savedHomeScrollY = null
      return new Promise((resolve) => {
        setTimeout(() => resolve({ top }), 1050)
      })
    }
    // 前進導航：等淡出結束再滾到頂部
    if (from.name) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ top: 0 }), 1050)
      })
    }
    // 初次載入 / 重新整理：立即到頂部
    return { top: 0 }
  },
})

// 離開首頁時記住滾動位置
let savedHomeScrollY = null

router.beforeEach((to, from) => {
  // 重新整理 / 直接輸入網址：不在首頁就導回首頁
  if (from === START_LOCATION && to.path !== '/') {
    return '/'
  }
  // 離開首頁時記住滾動位置
  if (from.name === 'Home' && to.name !== 'Home') {
    savedHomeScrollY = window.scrollY
  }
})

export default router
