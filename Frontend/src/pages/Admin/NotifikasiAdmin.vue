<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Notifikasi</div>

        <div class="text-grey-7">
          Pantau pemberitahuan penting terkait event, rapat, sertifikat, dan aktivitas organisasi.
        </div>
      </div>

      <div class="q-gutter-sm">
        <q-btn
          flat
          color="indigo-9"
          icon="done_all"
          label="Tandai Semua Dibaca"
          rounded
          no-caps
          class="motion-btn"
          :disable="unreadCount === 0 || loading"
          @click="markAllRead"
        />
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Total Notifikasi</div>

          <div class="text-h5 text-weight-bold">
            {{ notifications.length }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Belum Dibaca</div>

          <div class="text-h5 text-weight-bold text-orange">
            {{ unreadCount }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Hari Ini</div>

          <div class="text-h5 text-weight-bold text-indigo-9">
            {{ todayCount }}
          </div>
        </q-card>
      </div>
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="search" outlined dense rounded label="Cari notifikasi...">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedType"
            :options="typeOptions"
            emit-value
            map-options
            outlined
            dense
            rounded
            label="Kategori"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedRead"
            :options="readOptions"
            emit-value
            map-options
            outlined
            dense
            rounded
            label="Status"
          />
        </div>
      </div>
    </q-card>

    <!-- LOADING -->
    <div v-if="loading" class="text-center q-py-xl">
      <q-spinner-dots size="40px" color="indigo-9" />
      <div class="text-grey-6 q-mt-sm">Memuat notifikasi...</div>
    </div>

    <!-- KOSONG -->
    <div v-else-if="!filteredNotifications.length" class="text-center q-py-xl">
      <q-icon name="notifications_none" size="64px" color="grey-4" />
      <div class="text-grey-6 q-mt-md text-subtitle1">Tidak ada notifikasi</div>
    </div>

    <!-- LIST -->
    <div v-else class="column q-gutter-md">
      <q-card
        v-for="item in filteredNotifications"
        :key="item.id"
        flat
        bordered
        class="rounded-card q-pa-md motion-card notification-item"
        :class="{
          unread: !item.read_at,
        }"
      >
        <div class="row items-start justify-between">
          <div class="row no-wrap">
            <q-avatar
              size="48px"
              :color="iconColor(item.type)"
              text-color="white"
              :icon="iconName(item.type)"
              class="q-mr-md"
            />

            <div>
              <div class="text-subtitle2 text-weight-bold">
                {{ notifTitle(item.type) }}
              </div>

              <div class="text-grey-7 q-mt-xs">
                {{ item.message }}
              </div>

              <div class="text-caption text-grey-6 q-mt-sm">
                {{ formatTime(item.created_at) }}
              </div>
            </div>
          </div>

          <div class="q-gutter-xs">
            <q-btn
              flat
              round
              dense
              icon="done"
              color="positive"
              class="motion-btn"
              v-if="!item.read_at"
              @click="markRead(item)"
            >
              <q-tooltip> Tandai Dibaca </q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              class="motion-btn"
              @click="removeNotif(item.id)"
            >
              <q-tooltip> Hapus </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card>
    </div>
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import FooterComponent from 'src/components/FooterComponent.vue'
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from 'src/services/notification.api'
import { animate, stagger } from 'motion'

const search = ref('')
const selectedType = ref('all')
const selectedRead = ref('all')
const notifications = ref([])
const loading = ref(false)

const typeOptions = [
  {
    label: 'Semua',
    value: 'all',
  },
  {
    label: 'Acara',
    value: 'event',
  },
  {
    label: 'Rapat',
    value: 'meeting',
  },
]

const readOptions = [
  {
    label: 'Semua',
    value: 'all',
  },
  {
    label: 'Belum Dibaca',
    value: 'unread',
  },
  {
    label: 'Sudah Dibaca',
    value: 'read',
  },
]

const filteredNotifications = computed(() => {
  return notifications.value.filter((item) => {
    const title = notifTitle(item.type)
    const matchSearch =
      title.toLowerCase().includes(search.value.toLowerCase()) ||
      item.message.toLowerCase().includes(search.value.toLowerCase())

    let category = 'system'
    if (
      [
        'new_event',
        'registration_pending',
        'registration_approved',
        'registration_rejected',
      ].includes(item.type)
    ) {
      category = 'event'
    } else if (['meeting_today', 'meeting_no_notes'].includes(item.type)) {
      category = 'meeting'
    } else if (item.type === 'certificate_published') {
      category = 'certificate'
    }

    const matchType = selectedType.value === 'all' || category === selectedType.value

    const matchRead =
      selectedRead.value === 'all' ||
      (selectedRead.value === 'read' && item.read_at) ||
      (selectedRead.value === 'unread' && !item.read_at)

    return matchSearch && matchType && matchRead
  })
})

const unreadCount = computed(() => {
  return notifications.value.filter((item) => !item.read_at).length
})

const todayCount = computed(() => {
  const todayStr = new Date().toDateString()
  return notifications.value.filter(
    (item) => new Date(item.created_at).toDateString() === todayStr,
  ).length
})

// Fetch notifications from real API
const fetchNotifications = async () => {
  loading.value = true
  try {
    const res = await getNotifications({ limit: 100, sort: 'created_at', order: 'DESC' })
    notifications.value = res.data?.data?.notifications ?? []
  } catch (error) {
    console.error('Error fetching notifications:', error)
  } finally {
    loading.value = false
  }
}

const markRead = async (item) => {
  if (item.read_at) return
  try {
    await markNotificationAsRead(item.id)
    item.read_at = new Date().toISOString()
    window.dispatchEvent(new CustomEvent('notifications-updated'))
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const markAllRead = async () => {
  try {
    await markAllNotificationsAsRead()
    notifications.value = notifications.value.map((item) => ({
      ...item,
      read_at: new Date().toISOString(),
    }))
    window.dispatchEvent(new CustomEvent('notifications-updated'))
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

const removeNotif = async (id) => {
  try {
    await deleteNotification(id)
    notifications.value = notifications.value.filter((item) => item.id !== id)
    window.dispatchEvent(new CustomEvent('notifications-updated'))
  } catch (error) {
    console.error('Error removing notification:', error)
  }
}

const notifTitle = (type) => {
  if (type === 'new_event') return 'Acara Baru'
  if (type === 'registration_pending') return 'Peserta Baru'
  if (type === 'registration_approved') return 'Pendaftaran Diterima'
  if (type === 'registration_rejected') return 'Pendaftaran Ditolak'
  if (type === 'meeting_today') return 'Rapat Hari Ini'
  if (type === 'meeting_no_notes') return 'Notulen Belum Disubmit'
  if (type === 'certificate_published') return 'Sertifikat Tersedia'
  return 'Notifikasi'
}

const iconName = (type) => {
  if (type === 'new_event') return 'campaign'
  if (type === 'registration_pending') return 'how_to_reg'
  if (type === 'registration_approved') return 'check_circle'
  if (type === 'registration_rejected') return 'cancel'
  if (type === 'meeting_today') return 'event'
  if (type === 'meeting_no_notes') return 'edit_note'
  if (type === 'certificate_published') return 'workspace_premium'
  return 'notifications'
}

const iconColor = (type) => {
  if (
    [
      'new_event',
      'registration_pending',
      'registration_approved',
      'registration_rejected',
    ].includes(type)
  ) {
    return 'indigo-9'
  }
  if (['meeting_today', 'meeting_no_notes'].includes(type)) return 'orange'
  if (type === 'certificate_published') return 'positive'
  return 'grey-7'
}

const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Baru saja'
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`
  if (diff < 172800) return 'Kemarin'
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* Motion */
onMounted(async () => {
  await fetchNotifications()
  await nextTick()

  animate(
    '.motion-card',
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: stagger(0.04),
      duration: 0.3,
      easing: 'ease-out',
    },
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.notification-item.unread {
  border-left: 4px solid #4f46e5;
}

.motion-btn {
  transition: all 0.18s ease;
}
</style>
