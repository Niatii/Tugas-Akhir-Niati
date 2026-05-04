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
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    // 🔐 belum login
    if (to.meta.requiresAuth && !token) {
      return next('/auth/login')
    }

    // 🔐 cek role
    if (to.meta.role !== undefined) {
      if (user.role !== to.meta.role) {

        switch (user.role) {
          case UserRoleEnum.ADMIN:
            return next('/admin/beranda')

          case UserRoleEnum.COORDINATOR:
            return next('/koordinator/detail-acara-saya')

          case UserRoleEnum.COMMITTEE:
            return next('/user/beranda')

          default:
            return next('/auth/login')
        }
      }
    }

    next()
  })

  return Router
})