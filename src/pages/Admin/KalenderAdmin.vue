<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kalender Kegiatan</div>

        <div class="text-grey-7">
          Pantau event, rapat, dan deadline organisasi dalam satu tampilan.
        </div>
      </div>

      <div class="q-gutter-sm">
        <q-btn
          flat
          color="grey-8"
          icon="today"
          label="Hari Ini"
          rounded
          no-caps
          class="motion-btn"
          @click="goToday"
        />
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Event Bulan Ini</div>

          <div class="text-h5 text-weight-bold">6</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Rapat</div>

          <div class="text-h5 text-weight-bold text-orange">12</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Deadline</div>

          <div class="text-h5 text-weight-bold text-positive">4</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Hari Ini</div>

          <div class="text-h5 text-weight-bold text-indigo-9">3</div>
        </q-card>
      </div>
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
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

        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedView"
            :options="viewOptions"
            emit-value
            map-options
            outlined
            dense
            rounded
            label="Tampilan"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-input v-model="search" outlined dense rounded label="Cari agenda...">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </q-card>

    <!-- CALENDAR -->
    <q-card flat bordered class="rounded-card q-pa-md motion-table">
      <FullCalendar ref="calendarRef" :options="calendarOptions" />
    </q-card>

    <!-- DETAIL DIALOG -->
    <q-dialog v-model="detailDialog">
      <q-card style="min-width: 420px" class="rounded-card">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-weight-bold">
              {{ selectedEvent.title }}
            </div>

            <div class="text-caption text-grey-7">
              {{ selectedEvent.type }}
            </div>
          </div>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-sm">
            <q-icon name="event" size="18px" class="q-mr-sm" />
            {{ selectedEvent.date }}
          </div>

          <div class="q-mb-sm">
            <q-icon name="schedule" size="18px" class="q-mr-sm" />
            {{ selectedEvent.time }}
          </div>

          <div>
            <q-icon name="place" size="18px" class="q-mr-sm" />
            {{ selectedEvent.location }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Tutup" no-caps v-close-popup />

          <q-btn color="indigo-9" label="Lihat Detail" rounded no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>
     <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { animate, stagger } from 'motion'
import FooterComponent from 'src/components/FooterComponent.vue'


import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarRef = ref(null)

const search = ref('')
const selectedType = ref('all')
const selectedView = ref('month')

const detailDialog = ref(false)

const selectedEvent = ref({})

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
    label: 'Deadline',
    value: 'deadline',
  },
]

const viewOptions = [
  {
    label: 'Bulanan',
    value: 'month',
  },
  {
    label: 'Mingguan',
    value: 'week',
  },
]

const events = ref([
  {
    title: 'HMTI Fair',
    start: '2026-04-18',
    color: '#4f46e5',
    extendedProps: {
      type: 'Event',
      time: '08:00 - 17:00',
      location: 'Aula Utama',
    },
  },
  {
    title: 'Rapat Opening',
    start: '2026-04-17',
    color: '#f59e0b',
    extendedProps: {
      type: 'Rapat',
      time: '19:00',
      location: 'Ruang Sidang',
    },
  },
  {
    title: 'Deadline Sertifikat',
    start: '2026-04-25',
    color: '#10b981',
    extendedProps: {
      type: 'Deadline',
      time: '23:59',
      location: '-',
    },
  },
])

const filteredEvents = computed(() => {
  return events.value.filter((item) => {
    const matchType =
      selectedType.value === 'all' || item.extendedProps.type.toLowerCase() === selectedType.value

    const matchSearch = item.title.toLowerCase().includes(search.value.toLowerCase())

    return matchType && matchSearch
  })
})

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: selectedView.value === 'month' ? 'dayGridMonth' : 'dayGridWeek',
  height: 760,
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: '',
  },
  events: filteredEvents.value,
  eventClick: handleEventClick,
}))

const handleEventClick = (info) => {
  selectedEvent.value = {
    title: info.event.title,
    type: info.event.extendedProps.type,
    date: info.event.startStr,
    time: info.event.extendedProps.time,
    location: info.event.extendedProps.location,
  }

  detailDialog.value = true
}

const goToday = () => {
  calendarRef.value.getApi().today()
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
      delay: stagger(0.05),
      duration: 0.35,
      easing: 'ease-out',
    },
  )

  animate(
    '.motion-table',
    {
      opacity: [0, 1],
      y: [10, 0],
    },
    {
      delay: 0.18,
      duration: 0.35,
      easing: 'ease-out',
    },
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all 0.18s ease;
}
</style>
