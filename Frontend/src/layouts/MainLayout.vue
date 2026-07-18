<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header class="bg-white header-modern" elevated>
      <q-toolbar class="q-px-lg">
        <q-btn
          flat
          round
          dense
          icon="menu"
          color="grey-8"
          size="md"
          @click="toggleLeftDrawer"
          class="menu-toggle-btn"
        >
          <q-tooltip>Buka/Tutup Sidebar</q-tooltip>
        </q-btn>

        <div v-if="!leftDrawerOpen" class="row items-center q-ml-sm">
          <q-avatar size="38px" class="q-mr-sm logo-avatar">
            <img src="~assets/image/evoma_icon.png" />
          </q-avatar>

          <div class="text-h6 text-weight-bold text-black">EVOMA</div>
        </div>

        <q-space />

        <div class="row items-center q-gutter-md">
          <q-btn flat round dense icon="notifications_none" color="grey-7" size="md" @click="router.push('/admin/notifikasi')">
            <q-badge v-if="unreadNotificationsCount > 0" color="red" floating>{{ unreadNotificationsCount }}</q-badge>
            <q-tooltip>Notifikasi</q-tooltip>
          </q-btn>

          <q-btn flat no-caps class="user-menu-btn">
            <div class="row items-center no-wrap">
              <q-avatar size="36px" color="primary" text-color="white" class="q-mr-sm">
                <img :src="userAvatar" alt="avatar" @error="onAvatarError" />
              </q-avatar>
              <div class="column items-start org-name-wrapper">
                <div class="text-dark org-name-text">{{ userName }}</div>
              </div>
            </div>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="drawer-modern column no-wrap"
      :width="280"
      :breakpoint="768"
    >
      <div class="drawer-header">
        <div class="drawer-logo">
          <q-avatar size="48px" class="logo-circle">
            <img src="~assets/image/evoma_icon.png" />
          </q-avatar>
          <div class="drawer-brand">
            <div class="brand-name">EVOMA</div>
            <div class="brand-role">Event Organizer Management</div>
          </div>
        </div>
      </div>

      <q-scroll-area class="col drawer-scroll">
        <q-list padding class="q-mt-sm">
          <q-item
            clickable
            v-ripple
            to="/admin/beranda"
            class="drawer-item"
            active-class="drawer-item-active"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" size="22px" />
            </q-item-section>
            <q-item-section class="text-weight-medium"> Beranda </q-item-section>
          </q-item>

          <q-expansion-item
            icon="event"
            label="Manajemen Acara"
            class="drawer-item-expansion drawer-expansion"
            :default-opened="isManajemenAcara"
            :header-class="isManajemenAcara ? 'drawer-item-active' : 'drawer-item-expansion'"
            active-class="drawer-item-active"
            expand-icon-class="text-grey-6"
            expand-separator
          >
            <q-item
              clickable
              v-ripple
              :class="{ 'drawer-item-active': isKelolaAcara }"
              to="/admin/detail"
              class="drawer-subitem"
              active-class="drawer-item-active"
            >
              <q-item-section avatar>
                <q-icon name="description" size="20px" />
              </q-item-section>
              <q-item-section>Kelola Acara</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :class="{ 'drawer-item-active': isKelolaPeserta }"
              to="/admin/peserta"
              class="drawer-subitem"
              active-class="drawer-item-active"
            >
              <q-item-section avatar>
                <q-icon name="groups" size="20px" />
              </q-item-section>
              <q-item-section>Kelola Peserta</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :class="{ 'drawer-item-active': isKelolaDivisi }"
              to="/admin/divisi"
              class="drawer-subitem"
              active-class="drawer-item-active"
            >
              <q-item-section avatar>
                <q-icon name="apartment" size="20px" />
              </q-item-section>
              <q-item-section>Kelola Divisi</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :class="{ 'drawer-item-active': isKelolaRapat }"
              to="/admin/rapat"
              class="drawer-subitem"
              active-class="drawer-item-active"
            >
              <q-item-section avatar>
                <q-icon name="groups_2" size="20px" />
              </q-item-section>
              <q-item-section>Kelola Rapat</q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :class="{ 'drawer-item-active': isKelolaSertifikat }"
              to="/admin/sertifikat"
              class="drawer-subitem"
              active-class="drawer-item-active"
            >
              <q-item-section avatar>
                <q-icon name="workspace_premium" size="20px" />
              </q-item-section>
              <q-item-section>Kelola Sertifikat</q-item-section>
            </q-item>
          </q-expansion-item>

          <q-item
            clickable
            v-ripple
            to="/admin/notifikasi"
            class="drawer-item"
            active-class="drawer-item-active"
          >
            <q-item-section avatar>
              <q-icon name="notifications" />
            </q-item-section>

            <q-item-section> Notifikasi </q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            to="/admin/profil"
            class="drawer-item"
            active-class="drawer-item-active"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>

            <q-item-section> Profil Organisasi </q-item-section>
          </q-item>
          <q-separator spaced class="q-my-md" />
        </q-list>
      </q-scroll-area>

      <div class="drawer-footer">
        <div class="footer-content">
          <q-btn
            outline
            color="indigo-9"
            label="Keluar"
            no-caps
            icon="logout"
            rounded
            style="min-width: 240px"
            class="q-px-xl q-my-md bg-white"
            @click="showLogoutConfirm = true"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container class="page-container">
      <router-view />
    </q-page-container>
  </q-layout>

  <ConfirmDialog
    v-model="showLogoutConfirm"
    type="warning"
    title="Konfirmasi Keluar"
    message="Anda akan keluar dari sistem. Lanjutkan?"
    confirm-label="Ya, Keluar"
    cancel-label="Batal"
    @confirm="handleLogout"
  />
  <!-- Dialog -->
  <StatusDialog
    v-model="showDialog"
    :type="dialogType"
    :title="dialogTitle"
    :message="dialogMessage"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { animate, stagger } from 'motion'
import { useRoute, useRouter } from 'vue-router'
import defaultProfileImage from 'src/assets/image/default_profil.jpg'
import StatusDialog from 'src/components/StatusDialog.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import { getNotifications } from 'src/services/notification.api'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const userName = computed(() => {
  return user.value?.name || 'User'
})

function loadUser() {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
}

const showDialog = ref(false)
const showLogoutConfirm = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('loginTime')

  dialogType.value = 'success'
  dialogTitle.value = 'Berhasil Keluar'
  dialogMessage.value = 'Sampai jumpa lagi'

  showDialog.value = true

  showLogoutConfirm.value = false

  setTimeout(() => {
    router.push('/auth/login')
  }, 1200)
}

const unreadNotificationsCount = ref(0)

const fetchUnreadCount = async () => {
  try {
    const res = await getNotifications({ limit: 100, sort: 'created_at', order: 'DESC' })
    const notifications = res.data?.data?.notifications ?? []
    unreadNotificationsCount.value = notifications.filter((item) => !item.read_at).length
  } catch (error) {
    console.error('Error fetching unread notification count:', error)
  }
}

let intervalId = null

const userAvatar = computed(() => {
  return user.value?.url || defaultProfileImage
})

function onAvatarError(e) {
  e.target.src = defaultProfileImage
}
/* GROUP MANAJEMEN ACARA */
const isManajemenAcara = computed(() => {
  const paths = [
    '/admin/detail',
    '/admin/edit-acara',
    '/admin/preview-acara',
    '/admin/tambah-acara',

    '/admin/peserta',
    '/admin/detail-peserta',

    '/admin/divisi',
    '/admin/detail-divisi',

    '/admin/rapat',
    '/admin/detail-rapat',
    '/admin/notulen-rapat',
    '/admin/absensi-rapat',

    '/admin/sertifikat',
    '/admin/detail-sertifikat',
  ]

  return paths.includes(route.path)
})

/* SUB MENU KELOLA ACARA */
const isKelolaAcara = computed(() => {
  return [
    '/admin/detail',
    '/admin/edit-acara',
    '/admin/preview-acara',
    '/admin/tambah-acara',
  ].includes(route.path)
})

// SUB MENU KELOLA PESERTA
const isKelolaPeserta = computed(() => {
  return ['/admin/peserta', '/admin/detail-peserta'].includes(route.path)
})

// SUB MENU KELOLA DIVISI
const isKelolaDivisi = computed(() => {
  return ['/admin/divisi', '/admin/detail-divisi'].includes(route.path)
})

// SUB MENU KELOLA SERTIFIKAT
const isKelolaSertifikat = computed(() => {
  return ['/admin/sertifikat', '/admin/detail-sertifikat'].includes(route.path)
})

// SUB MENU KELOLA RAPAT
const isKelolaRapat = computed(() => {
  return [
    '/admin/rapat',
    '/admin/detail-rapat',
    '/admin/notulen-rapat',
    '/admin/absensi-rapat',
  ].includes(route.path)
})

const leftDrawerOpen = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value

  animate(
    '.drawer-modern',
    { width: leftDrawerOpen.value ? 280 : 72 },
    { duration: 0.28, easing: 'ease-in-out' },
  )
}

onMounted(() => {
  loadUser()

  fetchUnreadCount()
  intervalId = setInterval(fetchUnreadCount, 30000)
  window.addEventListener('notifications-updated', fetchUnreadCount)
  window.addEventListener('user-profile-updated', loadUser)

  animate(
    '.drawer-item, .drawer-item-expansion',
    { opacity: [0, 1], x: [-14, 0] },
    {
      delay: stagger(0.04),
      duration: 0.35,
      easing: 'ease-out',
    },
  )

  animate('.header-modern', { opacity: [0, 1], y: [-12, 0] }, { duration: 0.35 })

  animate('.user-menu-btn', { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.28, delay: 0.2 })
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  window.removeEventListener('notifications-updated', fetchUnreadCount)
  window.removeEventListener('user-profile-updated', loadUser)
})
</script>

<style scoped>
.header-modern {
  height: 64px;
  border-bottom: 1px solid #eef2f7;
  background: #ffffff;
}

:deep(.q-toolbar) {
  min-height: 64px;
}

.menu-toggle-btn,
.user-menu-btn,
.drawer-item,
.drawer-item-expansion,
.drawer-subitem {
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.user-menu-btn {
  border-radius: 999px;
  padding: 0 12px;
  height: 48px;
  background: #f8fafc;
  border: 1px solid #edf2f7;
}

.user-menu-btn:hover {
  background: #f1f5f9;
}

.drawer-modern {
  background: #fff;
  border-right: 1px solid #edf2f7;
  overflow: hidden;
}

.drawer-header {
  padding: 24px;
  border-bottom: 1px solid #edf2f7;
}

.drawer-scroll {
  padding: 8px 12px;
}

.drawer-footer {
  padding: 16px 20px;
  border-top: 1px solid #edf2f7;
  background: #fafbff;
}

.drawer-item,
.drawer-item-expansion {
  border-radius: 14px;
  margin: 4px 8px;
  color: #475569;
}

.drawer-item:hover,
.drawer-item-expansion:hover,
.drawer-subitem:hover {
  background: #f8fafc;
  color: #3949ab;
}

.drawer-item-active {
  background: #eef4ff !important;
  color: #3949ab !important;
  font-weight: 600;
}

.drawer-subitem {
  margin: 2px 8px 2px 20px;
  border-radius: 12px;
  color: #64748b;
}

.org-name-wrapper {
  width: 200px;
}

.org-name-text {
  font-size: 12px;
  line-height: 1.2;
  white-space: normal;
  text-align: left;
}

.page-container {
  background: #f8fafc;
  min-height: 100vh;
}

:deep(.q-scrollarea__thumb) {
  background: #cbd5e1;
  border-radius: 10px;
}

.drawer-header {
  padding: 24px;
  border-bottom: 1px solid #edf2f7;
}

.drawer-logo {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-circle {
  border-radius: 50%;
  background: linear-gradient(135deg, #3949ab, #5c6bc0);
  box-shadow: 0 10px 24px rgba(57, 73, 171, 0.18);
}

:deep(.logo-circle img) {
  object-fit: cover;
}

.drawer-brand {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
}

.brand-role {
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
}

.org-name-wrapper {
  width: 200px;
}

.org-name-text {
  font-size: 12px;
  line-height: 1.25;
  color: #111827;
  text-align: left;
  white-space: normal;
}
</style>
