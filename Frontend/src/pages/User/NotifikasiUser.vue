<template>
  <q-page class="q-pa-xl flex justify-center bg-indigo-1">
    <div style="width: 900px; max-width: 100%">
      <!-- HEADER -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <div class="text-h5 text-weight-bold">Notifikasi</div>
          <div class="text-grey-7">Informasi terbaru terkait acara dan tugas Anda</div>
        </div>

        <q-btn
          flat
          icon="done_all"
          label="Tandai semua sudah dibaca"
          class="text-indigo-9"
          no-caps
          :loading="markingAll"
          :disable="unreadCount === 0"
          @click="handleMarkAllAsRead"
        />
      </div>

      <div v-if="unreadCount > 0" class="q-mb-md">
        <q-chip color="indigo-9" text-color="white" icon="notifications" size="sm">
          {{ unreadCount }} belum dibaca
        </q-chip>
      </div>

      <div v-if="loading" class="text-center q-py-xl">
        <q-spinner-dots size="40px" color="indigo-9" />
        <div class="text-grey-6 q-mt-sm">Memuat notifikasi...</div>
      </div>

      <div v-else-if="!notifications.length" class="text-center q-py-xl">
        <q-icon name="notifications_none" size="64px" color="grey-4" />
        <div class="text-grey-6 q-mt-md text-subtitle1">Tidak ada notifikasi</div>
      </div>

      <div v-else>
        <div
          v-for="notif in notifications"
          :key="notif.id"
          class="notif-card"
          :class="{ 'notif-new': !notif.read_at }"
          @click="handleMarkOneAsRead(notif)"
        >
          <div class="row items-start">
            <q-icon
              :name="getNotifIcon(notif.type)"
              size="20px"
              class="notif-icon q-mr-sm"
              :class="getNotifIconClass(notif.type)"
            />

            <div class="col">
              <div class="text-subtitle2 text-weight-bold">
                {{ getNotifTitle(notif.type) }}
              </div>

              <div class="notif-message">{{ notif.message }}</div>

              <div class="notif-time">{{ formatTime(notif.created_at) }}</div>
            </div>

            <!-- Indikator belum dibaca -->
            <div v-if="!notif.read_at" class="unread-dot" />
          </div>
        </div>
      </div>
    </div>

    <StatusDialog
      v-model="showMarkAllSuccess"
      type="success"
      title="Semua Dibaca"
      message="Semua notifikasi telah ditandai sebagai dibaca."
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from 'src/services/notification.api'

import StatusDialog from 'src/components/StatusDialog.vue'

const notifications = ref([])
const loading = ref(false)
const markingAll = ref(false)
const showMarkAllSuccess = ref(false)

const unreadCount = computed(() => notifications.value.filter((n) => !n.read_at).length)

const NOTIF_MAP = {
  new_event: { icon: 'campaign', title: 'Acara Baru', cls: 'text-indigo-8' },
  registration_pending: { icon: 'how_to_reg', title: 'Peserta Baru', cls: 'text-amber-9' },
  registration_approved: { icon: 'check_circle', title: 'Pendaftaran Diterima', cls: 'text-positive' },
  registration_rejected: { icon: 'cancel', title: 'Pendaftaran Ditolak', cls: 'text-negative' },
  meeting_today: { icon: 'event', title: 'Rapat Hari Ini', cls: 'text-indigo-8' },
  meeting_no_notes: { icon: 'edit_note', title: 'Notulen Belum Disubmit', cls: 'text-deep-orange-8' },
  certificate_published: { icon: 'workspace_premium', title: 'Sertifikat Tersedia', cls: 'text-positive' },
}

function getNotifIcon(type) {
  return NOTIF_MAP[type]?.icon ?? 'notifications'
}
function getNotifTitle(type) {
  return NOTIF_MAP[type]?.title ?? 'Notifikasi'
}
function getNotifIconClass(type) {
  return NOTIF_MAP[type]?.cls ?? 'text-indigo-8'
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`
  if (diff < 172800) return 'Kemarin'
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function fetchNotifications() {
  loading.value = true
  try {
    const res = await getNotifications({ limit: 50, sort: 'created_at', order: 'DESC' })
    notifications.value = res.data?.data?.notifications ?? []
  } catch (e) {
    console.error('Gagal fetch notifikasi:', e)
  } finally {
    loading.value = false
  }
}

async function handleMarkAllAsRead() {
  markingAll.value = true
  try {
    await markAllNotificationsAsRead()
    notifications.value = notifications.value.map((n) => ({ ...n, read_at: new Date().toISOString() }))
    window.dispatchEvent(new CustomEvent('notifications-updated'))
    showMarkAllSuccess.value = true
  } catch (e) {
    console.error('Gagal mark all as read:', e)
  } finally {
    markingAll.value = false
  }
}

async function handleMarkOneAsRead(notif) {
  if (notif.read_at) return
  try {
    await markNotificationAsRead(notif.id)
    const idx = notifications.value.findIndex((n) => n.id === notif.id)
    if (idx !== -1) {
      notifications.value[idx] = { ...notifications.value[idx], read_at: new Date().toISOString() }
    }
    window.dispatchEvent(new CustomEvent('notifications-updated'))
  } catch (e) {
    console.error('Gagal mark as read:', e)
  }
}

onMounted(fetchNotifications)
</script>

<style scoped>
.notif-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #eef2f7;
  transition: all 0.25s ease;
  cursor: pointer;
  position: relative;
}

.notif-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.notif-new {
  border-left: 4px solid #3949ab;
  background: #f8f9ff;
}

.notif-icon {
  color: #3949ab;
  margin-top: 2px;
  flex-shrink: 0;
}

.notif-message {
  font-size: 13px;
  color: #555;
  margin-top: 3px;
  line-height: 1.5;
}

.notif-time {
  font-size: 11px;
  color: #9aa0a6;
  margin-top: 5px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3949ab;
  margin-top: 6px;
  flex-shrink: 0;
}
</style>
