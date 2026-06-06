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
  const SESSION_DURATION = 60 * 60 * 1000 // 1 jam (sama dengan idle-logout)

  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user') || '{}'
    const user = JSON.parse(userStr)

    console.log('Route Guard:', {
      to: to.path,
      from: from.path,
      token: !!token,
      user: user.username || 'no user',
      userRole: user.role,
      requiredRole: to.meta.role,
      requiresAuth: to.meta.requiresAuth,
    })

    // ⏰ Cek apakah sesi sudah expired
    if (token) {
      const loginTime = parseInt(localStorage.getItem('loginTime') || '0')
      const now = Date.now()
      if (now - loginTime > SESSION_DURATION) {
        console.log('Session expired, cleanup and redirect to login')
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
      console.log('Blocked: requiresAuth tapi no token')
      return next('/auth/login')
    }

    // 🔐 cek role - jika sudah login, validasi role
    if (to.meta.role !== undefined && token) {
      // Jika user tidak sesuai role yang dibutuhkan
      if (user.role !== to.meta.role) {
        console.log('Role mismatch:', user.role, '!==', to.meta.role)
        
        switch (user.role) {
          case UserRoleEnum.ADMIN:
            console.log('Redirecting ADMIN to /admin/beranda')
            return next('/admin/beranda')

          case UserRoleEnum.COORDINATOR:
            console.log('Redirecting COORDINATOR to /koordinator/detail-acara-saya')
            return next('/koordinator/detail-acara-saya')

          case UserRoleEnum.COMMITTEE:
            console.log('Redirecting COMMITTEE to /user/beranda')
            return next('/user/beranda')

          default:
            // User tidak memiliki role valid, redirect ke login
            console.log('Invalid role, cleanup and redirect to login')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            return next('/auth/login')
        }
      }
    }

    // Jika user tidak ada tapi token ada (state inconsistent), cleanup
    if (token && (!user || user.role === undefined || user.role === null)) {
      console.log('Inconsistent state: token ada tapi user invalid')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return next('/auth/login')
    }

    console.log('Route allowed')
    next()
  })

  return Router
})