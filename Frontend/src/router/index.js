import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import UserRoleEnum from 'src/enums/UserRoleEnum'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  /* 🔥 ROUTE GUARD DISINI */
  const SESSION_DURATION = 24 * 60 * 60 * 1000 // 1 hari (sama dengan idle-logout)

  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user') || '{}'
    const user = JSON.parse(userStr)

    // ⏰ Cek apakah sesi sudah expired
    if (token) {
      const loginTime = parseInt(localStorage.getItem('loginTime') || '0')
      const now = Date.now()
      if (now - loginTime > SESSION_DURATION) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('loginTime')
        if (to.meta.requiresAuth) {
          return next('/auth/login')
        }
        return next()
      }
    }

    // 🔐 belum login - jika route butuh auth tapi tidak ada token
    if (to.meta.requiresAuth && !token) {
      return next('/auth/login')
    }

    // 🔐 cek role - jika sudah login, validasi role
    if (to.meta.role !== undefined && token) {
      // Jika user tidak sesuai role yang dibutuhkan
      if (user.role !== to.meta.role) {
        switch (user.role) {
          case UserRoleEnum.ADMIN:
            return next('/admin/beranda')

          case UserRoleEnum.COORDINATOR:
            return next('/koordinator/detail-acara-saya')

          case UserRoleEnum.COMMITTEE:
            return next('/user/beranda')

          default:
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return next('/auth/login')
        }
      }
    }

    // Jika user tidak ada tapi token ada (state inconsistent), cleanup
    if (token && (!user || user.role === undefined || user.role === null)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return next('/auth/login')
    }

    next()
  })

  return Router
})
