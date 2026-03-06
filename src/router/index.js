import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
  scrollBehavior() {
    // 首頁滾動位置由 HomeView 自行管理（savedScrollY）
    // 其他頁面一律捲到頂部
    return { top: 0 }
  },
})

export default router
