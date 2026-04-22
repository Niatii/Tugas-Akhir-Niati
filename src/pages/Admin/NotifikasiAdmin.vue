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
          color="grey-8"
          icon="done_all"
          label="Tandai Semua Dibaca"
          rounded
          no-caps
          class="motion-btn"
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

    <!-- LIST -->
    <div class="column q-gutter-md">
      <q-card
        v-for="item in filteredNotifications"
        :key="item.id"
        flat
        bordered
        class="rounded-card q-pa-md motion-card notification-item"
        :class="{
          unread: !item.read,
        }"
      >
        <div class="row items-start justify-between">
          <div class="row no-wrap">
            <q-avatar
              size="48px"
              :color="iconColor(item.type)"
              text-color="white"
              icon="notifications"
              class="q-mr-md"
            />

            <div>
              <div class="text-subtitle2 text-weight-bold">
                {{ item.title }}
              </div>

              <div class="text-grey-7 q-mt-xs">
                {{ item.message }}
              </div>

              <div class="text-caption text-grey-6 q-mt-sm">
                {{ item.time }}
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
              v-if="!item.read"
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

import { animate, stagger } from 'motion'

const search = ref('')
const selectedType = ref('all')
const selectedRead = ref('all')

const typeOptions = [
  {
    label: 'Semua',
    value: 'all',
  },
  {
    label: 'Event',
    value: 'event',
  },
  {
    label: 'Rapat',
    value: 'meeting',
  },
  {
    label: 'Sertifikat',
    value: 'certificate',
  },
  {
    label: 'Sistem',
    value: 'system',
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

const notifications = ref([
  {
    id: 1,
    type: 'meeting',
    title: 'Rapat Opening Dimulai',
    message: 'Rapat Persiapan Opening sedang berlangsung sekarang.',
    time: '10 menit lalu',
    read: false,
  },
  {
    id: 2,
    type: 'event',
    title: 'Event Baru Ditambahkan',
    message: 'Seminar AI berhasil dijadwalkan pada 22 Mei 2026.',
    time: '1 jam lalu',
    read: false,
  },
  {
    id: 3,
    type: 'certificate',
    title: 'Sertifikat Siap Diunduh',
    message: '120 sertifikat HMTI Fair telah berhasil diupload.',
    time: 'Hari ini, 09:00',
    read: true,
  },
  {
    id: 4,
    type: 'system',
    title: 'Backup Sistem Berhasil',
    message: 'Data organisasi berhasil dicadangkan otomatis.',
    time: 'Kemarin',
    read: true,
  },
])

const filteredNotifications = computed(() => {
  return notifications.value.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.value.toLowerCase()) ||
      item.message.toLowerCase().includes(search.value.toLowerCase())

    const matchType = selectedType.value === 'all' || item.type === selectedType.value

    const matchRead =
      selectedRead.value === 'all' ||
      (selectedRead.value === 'read' && item.read) ||
      (selectedRead.value === 'unread' && !item.read)

    return matchSearch && matchType && matchRead
  })
})

const unreadCount = computed(() => {
  return notifications.value.filter((item) => !item.read).length
})

const todayCount = computed(() => {
  return 3
})


const markRead = (item) => {
  item.read = true
}

const markAllRead = () => {
  notifications.value.forEach((item) => {
    item.read = true
  })
}

const removeNotif = (id) => {
  notifications.value = notifications.value.filter((item) => item.id !== id)
}

const iconColor = (type) => {
  if (type === 'event') return 'indigo-9'

  if (type === 'meeting') return 'orange'

  if (type === 'certificate') return 'positive'

  return 'grey-7'
}

/* Motion */
onMounted(async () => {
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
