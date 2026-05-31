<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- NAVBAR -->
    <q-header
      elevated
      class="text-black q-pa-sm modern-header"
      style="height: 70px; background-color: white"
    >
      <q-toolbar class="justify-between">
        <!-- JUDUL APLIKASI -->
        <div class="flex items-center">
          <q-avatar size="40px" class="bg-white q-mr-sm">
            <img src="~assets/image/evoma_icon.png" />
          </q-avatar>
          <div class="text-h6 text-weight-bold">EVOMA</div>
        </div>

        <!-- MENU NAVBAR -->
        <q-tabs dense class="text-grey-8" active-color="indigo-9" indicator-color="indigo-9">
          <q-route-tab label="Beranda" to="/user/beranda" no-caps class="motion-tab" />
          <q-route-tab label="Daftar Acara" to="/user/daftar-acara" no-caps class="motion-tab" />
          <q-route-tab label="Acara Saya" to="/user/acara-saya" no-caps class="motion-tab" />
          <q-route-tab label="Kalender" to="/user/acara-saya" no-caps class="motion-tab" />
        </q-tabs>

        <!-- NOTIFIKASI & PROFIL -->
        <div class="flex items-center q-gutter-md">
          <div class="cursor-pointer" @click="$router.push('/user/notifikasi')">
            <q-icon
              name="notifications"
              color="indigo-9"
              size="25px"
              class="cursor-pointer motion-icon"
            />
          </div>

          <q-btn flat no-caps class="user-menu-btn">
            <div class="row items-center no-wrap">
              <!-- AVATAR -->
              <q-avatar size="36px" class="q-mr-sm">
                <img :src="userAvatar" alt="avatar" />
              </q-avatar>

              <!-- USER INFO -->
              <div class="column items-start">
                <div class="text-weight-bold text-dark">{{ userName }}</div>
              </div>

              <q-icon name="arrow_drop_down" size="20px" color="grey-7" class="q-ml-sm" />
            </div>

            <!-- DROPDOWN MENU -->
            <q-menu style="border-radius: 12px">
              <q-list style="min-width: 200px">
                <!-- PROFIL -->
                <q-item clickable v-close-popup to="/user/profil-saya">
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="indigo-9" />
                  </q-item-section>
                  <q-item-section class="text-weight-medium"> Profil Saya </q-item-section>
                </q-item>

                <q-separator />

                <!-- LOGOUT -->
                <q-item clickable @click="showLogoutConfirm = true">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>

                  <q-item-section class="text-negative"> Keluar </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
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
import { ref, onMounted, computed } from 'vue'
import { animate, stagger } from 'motion'
import { useRouter } from 'vue-router'
import defaultAvatar from 'src/assets/image/profil.jpg'
import StatusDialog from 'src/components/StatusDialog.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'

const router = useRouter()
const user = ref(null)
const userName = computed(() => {
  return user.value?.name || 'User'
})

const showDialog = ref(false)
const showLogoutConfirm = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  dialogType.value = 'success'
  dialogTitle.value = 'Berhasil Keluar'
  dialogMessage.value = 'Sampai jumpa lagi'

  showDialog.value = true

  showLogoutConfirm.value = false

  setTimeout(() => {
    router.push('/auth/login')
  }, 1200)
}
const userAvatar = computed(() => {
  return user.value?.url || defaultAvatar
})
onMounted(() => {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
  /**
   * HEADER ENTER
   */
  animate(
    '.modern-header',
    {
      opacity: [0, 1],
      y: [-12, 0],
    },
    {
      duration: 0.35,
      easing: 'ease-out',
    },
  )

  /**
   * NAV MENU
   */
  animate(
    '.motion-tab',
    {
      opacity: [0, 1],
      y: [-8, 0],
    },
    {
      delay: stagger(0.05),
      duration: 0.3,
      easing: 'ease-out',
    },
  )

  /**
   * PROFILE BUTTON
   */
  animate(
    '.user-menu-btn',
    {
      opacity: [0, 1],
      scale: [0.96, 1],
    },
    {
      duration: 0.25,
      delay: 0.2,
    },
  )

  bindHoverAnimation()
})

const bindHoverAnimation = () => {
  /**
   * TAB HOVER
   */
  const tabs = document.querySelectorAll('.motion-tab')

  tabs.forEach((tab) => {
    tab.addEventListener('mouseenter', () => {
      animate(
        tab,
        {
          y: -2,
          scale: 1.02,
        },
        {
          duration: 0.15,
        },
      )
    })

    tab.addEventListener('mouseleave', () => {
      animate(
        tab,
        {
          y: 0,
          scale: 1,
        },
        {
          duration: 0.15,
        },
      )
    })
  })

  /**
   * ICON HOVER
   */
  const icons = document.querySelectorAll('.motion-icon')

  icons.forEach((icon) => {
    icon.addEventListener('mouseenter', () => {
      animate(
        icon,
        {
          scale: 1.12,
          rotate: -8,
        },
        {
          duration: 0.18,
        },
      )
    })

    icon.addEventListener('mouseleave', () => {
      animate(
        icon,
        {
          scale: 1,
          rotate: 0,
        },
        {
          duration: 0.18,
        },
      )
    })
  })
}
</script>

<style scoped>
.q-tab--active {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 18px;
}

.q-tab {
  transition: all 0.2s ease;
}

.q-tab:hover {
  transform: translateY(-2px);
}

.modern-header {
  border-bottom: 1px solid #eef2f7;
  backdrop-filter: blur(12px);
}

.user-menu-btn {
  border-radius: 999px;
  padding: 0 10px;
  height: 46px;
  background: #f8fafc;
  border: 1px solid #edf2f7;
  transition: all 0.2s ease;
}

.user-menu-btn:hover {
  background: #f1f5f9;
}

.motion-tab {
  border-radius: 14px;
  transition: all 0.2s ease;
}

.motion-icon {
  transition: all 0.2s ease;
}

.q-tab--active {
  background: rgba(57, 73, 171, 0.08);
  border-radius: 14px;
}

.q-tab {
  transition: all 0.2s ease;
}
</style>
