<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Hai {{ userName }} 👋</div>

        <div class="text-grey-7">
          Selamat datang kembali. Berikut ringkasan aktivitas panitia hari ini.
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Acara Aktif</div>

          <div class="text-h5 text-weight-bold">
            {{ activeEventsCount }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Rapat Minggu Ini</div>

          <div class="text-h5 text-weight-bold text-indigo-9">
            {{ meetingsThisWeekCount }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Notifikasi Baru</div>

          <div class="text-h5 text-weight-bold text-positive">
            {{ unreadNotificationsCount }}
          </div>
        </q-card>
      </div>
    </div>

    <!-- MAIN -->
    <div class="row q-col-gutter-lg">
      <!-- LEFT -->
      <div class="col-12 col-md-8">
        <!-- EVENT AKTIF -->
        <q-card flat class="q-pa-md q-mb-lg" style="border-radius: 14px;">
          <div class="row items-center justify-between q-mb-md">
            <div>
              <div class="text-h6 text-weight-bold">Acara Aktif Saya</div>

              <div class="text-caption text-grey-7">Acara yang sedang kamu jalankan saat ini.</div>
            </div>
          </div>

          <template v-if="currentActiveEvent">
            <q-card flat class="bg-blue-1 q-pa-lg" style="border-radius: 12px;">
              <div class="row items-start justify-between">
                <div>
                  <div class="text-h6 text-weight-bold">
                    {{ currentActiveEvent.event.title }}
                  </div>

                  <div class="text-grey-7 q-mt-xs text-weight-medium">
                    {{ currentActiveEvent.position }} • Divisi
                    {{ currentActiveEvent.division.name }}
                  </div>
                </div>

                <q-chip
                  dense
                  size="12px"
                  class="q-px-md"
                  color="green-5"
                  text-color="white"
                  icon="play_circle"
                >
                  {{ currentActiveEvent.event.status_name }}
                </q-chip>
              </div>

              <div class="q-mt-md text-grey-8">
                <div class="q-mb-sm">
                  <q-icon name="event" class="q-mr-sm" />
                  {{ formatDate(currentActiveEvent.event.start_date) }} -
                  {{ formatDate(currentActiveEvent.event.end_date) }}
                </div>
              </div>

              <div class="q-mt-lg">
                <q-btn
                  color="indigo-9"
                  icon="open_in_new"
                  label="Lihat Detail"
                  rounded
                  no-caps
                  class="motion-btn"
                  :to="`/user/detail-acara-saya/${currentActiveEvent.id}`"
                />
              </div>
            </q-card>
          </template>

          <template v-else>
            <div
              class="empty-active-state text-center q-pa-xl rounded-card"
              style="border: 2px dashed #e2e8f0; background: #fafbff; border-radius: 18px"
            >
              <q-icon name="event_busy" size="64px" color="indigo-2" />
              <div class="text-subtitle1 text-weight-bold q-mt-sm">Belum Ada Acara Aktif</div>
              <div class="text-caption text-grey-6 q-mt-xs q-mb-md">
                Kamu sedang tidak aktif di kepanitiaan event manapun saat ini.
              </div>
              <q-btn
                color="indigo-9"
                label="Cari Event"
                icon="search"
                no-caps
                rounded
                class="motion-btn"
                to="/user/daftar-acara"
              />
            </div>
          </template>
        </q-card>

        <!-- EVENT BARU -->
        <q-card flat bordered class=" q-pa-md motion-card" style="border-radius: 12px;">
          <div class="text-h6 text-weight-bold">Acara Terbuka</div>

          <div class="text-caption text-grey-7 q-mb-md">
            Kesempatan bergabung pada kegiatan baru.
          </div>

          <div class="row q-col-gutter-md">
            <template v-if="openEvents.length > 0">
              <div class="col-12 col-md-6" v-for="item in openEvents" :key="item.id">
                <div
                  class="shadow-2 q-py-xs q-px-md motion-card"
                  style="border-radius: 16px; background: white"
                >
                  <!-- STATUS -->
                  <div class="flex justify-end q-my-sm">
                    <q-chip class="q-px-lg text-white bg-green-5" style="font-size: 12px">
                      {{ item.status_name }}
                    </q-chip>
                  </div>

                  <!-- IMAGE -->
                  <q-img
                    :src="item.image_url || 'https://cdn.quasar.dev/img/parallax1.jpg'"
                    :ratio="16 / 9"
                    style="height: 100px; border-radius: 12px"
                  />

                  <!-- CONTENT -->
                  <div class="q-px-sm">
                    <div class="text-subtitle1 text-bold q-my-sm text-indigo-9 text-ellipsis">
                      {{ item.title }}
                    </div>

                    <div
                      style="
                        font-size: 12px;
                        height: 36px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                      "
                      class="text-grey-9"
                    >
                      {{
                        item.description
                          ? stripHtml(item.description)
                          : 'Bergabunglah dalam kepanitiaan dan dapatkan pengalaman berharga.'
                      }}
                    </div>

                    <div class="text-grey-7" style="font-size: 10px">
                      {{ formatDate(item.start_date) }}
                      -
                      {{ formatDate(item.end_date) }}
                    </div>
                  </div>

                  <!-- ACTION -->
                  <div
                    class="detail-link flex justify-end items-center q-my-md text-indigo-9 cursor-pointer"
                    @click="goPublicDetail(item.id)"
                  >
                    <span class="text-weight-medium" style="font-size: 13px"> Lihat Detail </span>
                    <q-icon name="arrow_forward" size="16px" class="q-ml-xs arrow-icon" />
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="col-12 text-center q-py-xl text-grey-5">
                <q-icon name="event" size="48px" class="q-mb-sm" />
                <div>Tidak ada event terbuka saat ini.</div>
              </div>
            </template>
          </div>
        </q-card>
      </div>

      <!-- RIGHT -->
      <div class="col-12 col-md-4">
        <!-- NOTIF -->
        <q-card flat bordered class="rounded-card q-pa-md motion-card" style="min-height: 250px;">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-subtitle1 text-weight-bold">Notifikasi Penting</div>

            <q-btn flat dense no-caps color="indigo-9" label="Lihat Semua" to="/user/notifikasi" />
          </div>

          <template v-if="notifications.length > 0">
            <div v-for="item in notifications" :key="item.id" class="notif-item">
              <div class="text-weight-medium">
                {{ notifTitle(item.type) }}
              </div>

              <div class="text-caption text-grey-7 q-mt-xs">
                {{ item.message }}
              </div>

              <div class="text-caption text-grey-5 q-mt-xs">
                {{ formatTime(item.created_at) }}
              </div>
            </div>
          </template>
          <template v-else>
            <div class="text-center q-py-xl text-grey-5">
              <q-icon name="notifications_none" size="48px" class="q-mb-sm" />
              <div>Tidak ada notifikasi penting saat ini.</div>
            </div>
          </template>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { animate } from 'motion'
import { getMyEvents, getMyEventDetail, getPublicEvents } from 'src/services/event.api'
import { getNotifications } from 'src/services/notification.api'

const router = useRouter()

const user = ref(null)
const events = ref([])
const meetings = ref([])
const openEvents = ref([])
const notifications = ref([])
const loading = ref(false)

const userName = computed(() => {
  return user.value?.name || 'User'
})

const activeEvents = computed(() => {
  return events.value.filter(
    (e) =>
      e.event.status_name === 'Sedang Berlangsung' && e.registration_status_name === 'Diterima',
  )
})

const activeEventsCount = computed(() => activeEvents.value.length)

const currentActiveEvent = computed(() => {
  // Try to find one that is "Sedang Berlangsung"
  let event = activeEvents.value[0]
  // Fallback to any event with "Diterima" that is not "Selesai"
  if (!event) {
    event = events.value.find(
      (e) => e.registration_status_name === 'Diterima' && e.event.status_name !== 'Selesai',
    )
  }
  return event || null
})

const meetingsThisWeek = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return meetings.value.filter((m) => {
    if (!m.schedule_date) return false
    const sched = new Date(m.schedule_date)
    return sched >= startOfWeek && sched <= endOfWeek
  })
})

const meetingsThisWeekCount = computed(() => meetingsThisWeek.value.length)

const unreadNotificationsCount = computed(() => {
  return notifications.value.filter((n) => !n.read_at).length
})

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

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const goPublicDetail = (id) => {
  router.push(`/user/detail-acara/${id}`)
}

const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

const fetchDashboardData = async () => {
  loading.value = true
  try {
    // 1. Fetch user profile
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }

    // 2. Fetch my events
    const res = await getMyEvents()
    events.value = res.data.data.events

    // For each accepted event, fetch its details to get meetings
    const acceptedEvents = events.value.filter((e) => e.registration_status_name === 'Diterima')
    const detailPromises = acceptedEvents.map(async (item) => {
      try {
        const detailRes = await getMyEventDetail(item.id)
        return detailRes.data.data.event?.meetings || []
      } catch (err) {
        console.error('Error fetching detail for event', item.id, err)
        return []
      }
    })

    const allMeetingsResults = await Promise.all(detailPromises)
    meetings.value = allMeetingsResults.flat()

    // 3. Fetch open public events
    const publicRes = await getPublicEvents()
    const allPublicEvents = publicRes.data.data.events || []
    // Get up to 2 public events
    openEvents.value = allPublicEvents.slice(0, 2)

    // 4. Fetch latest 5 notifications
    try {
      const notifRes = await getNotifications({ limit: 5, sort: 'created_at', order: 'DESC' })
      notifications.value = notifRes.data?.data?.notifications ?? []
    } catch (notifErr) {
      console.error('Error fetching dashboard notifications:', notifErr)
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchDashboardData()
  await nextTick()

  // Clean, sleek group entry animation with minimal slide-up offset
  animate(
    '.motion-card',
    {
      opacity: [0, 1],
      y: [6, 0],
    },
    {
      duration: 0.3,
      easing: 'ease-out',
    },
  )

  // Hover effects for detail-link and arrow-icon
  const links = document.querySelectorAll('.detail-link')
  links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      animate(link.querySelector('.arrow-icon'), { x: 5 }, { duration: 0.15 })
    })
    link.addEventListener('mouseleave', () => {
      animate(link.querySelector('.arrow-icon'), { x: 0 }, { duration: 0.15 })
    })
  })
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #e2e8f0;
}

.rounded-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  border-color: #3949ab;
}

.motion-btn {
  transition: all 0.2s ease;
}

.motion-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(57, 73, 171, 0.25);
}

.agenda-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.notif-item {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  margin-bottom: 10px;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-link {
  transition: all 0.2s ease;
}

.detail-link:hover {
  opacity: 0.85;
}

.arrow-icon {
  transition: transform 0.2s ease;
}
</style>
