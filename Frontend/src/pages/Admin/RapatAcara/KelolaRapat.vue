<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kelola Rapat</div>

        <div class="text-grey-7">
          Atur jadwal rapat, kehadiran peserta, notulen, dan laporan rapat.
        </div>
      </div>

      <q-btn
        color="indigo-9"
        icon="add"
        label="Buat Rapat"
        no-caps
        rounded
        class="motion-btn"
        @click="openTambah"
      />
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Total Rapat</div>
          <div class="text-h5 text-weight-bold">
            {{ rows.length }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Rapat Hari Ini</div>
          <div class="text-h5 text-weight-bold text-indigo-9">
            {{ todayCount }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Belum Isi Notulen</div>
          <div class="text-h5 text-weight-bold text-orange">
            {{ unfinishedMinutes }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Event Aktif</div>
          <div class="text-h5 text-weight-bold text-positive">
            {{ eventOptions.length - 1 }}
          </div>
        </q-card>
      </div>
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <!-- SEARCH -->
        <div class="col-12 col-md-3">
          <q-input v-model="search" outlined dense rounded label="Cari rapat...">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- EVENT -->
        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedEvent"
            :options="eventOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            label="Pilih Acara"
          />
        </div>

        <!-- TYPE -->
        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedType"
            :options="typeOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            label="Jenis Rapat"
          />
        </div>

        <!-- STATUS -->
        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            label="Status"
          />
        </div>
      </div>
    </q-card>

    <!-- TABLE -->
    <q-table
      flat
      bordered
      row-key="id"
      :rows="filteredRows"
      :columns="columns"
      separator="horizontal"
      class="rounded-card motion-table"
    >
      <!-- EVENT -->
      <template #body-cell-event="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            {{ props.row.event }}
          </div>
        </q-td>
      </template>

      <!-- TYPE -->
      <template #body-cell-type="props">
        <q-td :props="props">
          <q-badge
            size="12px"
            class="q-px-md q-py-xs"
            :color="props.row.type === 'Umum' ? 'indigo-9' : 'orange'"
            rounded
          >
            {{ props.row.type }}
          </q-badge>
        </q-td>
      </template>

      <!-- STATUS -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            size="12px"
            class="q-px-md q-py-xs"
            :color="statusColor(props.row.status)"
            rounded
          >
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>

      <!-- ACTION -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            class="motion-btn"
            dense
            icon="visibility"
            color="indigo-9"
            @click="goToDetail(props.row)"
          >
            <q-tooltip>Detail</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            icon="edit"
            color="blue-8"
            class="motion-btn"
            @click="openEdit(props.row)"
          >
            <q-tooltip>Edit</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            class="motion-btn"
            icon="groups"
            color="positive"
            @click="goToAbsensi(props.row)"
          >
            <q-tooltip>Absensi</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            class="motion-btn"
            icon="description"
            color="orange"
            @click="goToNotulen(props.row)"
          >
            <q-tooltip>Notulen</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <TambahRapat v-model="dialogRapat" :mode="dialogMode" :data-edit="selectedRow" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { animate, stagger } from 'motion'
import TambahRapat from 'src/components/Admin/KelolaRapat/KelolaRapat.vue'
import { getMeetings } from 'src/services/meeting.api'
import { getEvents } from 'src/services/event.api'

const dialogRapat = ref(false)
const dialogMode = ref('add')
const selectedRow = ref(null)
const router = useRouter()
const events = ref([])
const eventOptions = ref([])

const search = ref('')
const selectedEvent = ref('all')
const selectedType = ref('all')
const selectedStatus = ref('all')

const openEdit = (row) => {
  dialogMode.value = 'edit'
  selectedRow.value = row
  dialogRapat.value = true
}

const fetchEvents = async () => {
  const res = await getEvents()

  events.value = res.data.data.events.filter((e) => e.status !== 0)

  eventOptions.value = [
    { label: 'Semua Acara', value: 'all' },
    ...events.value.map((e) => ({
      label: e.title,
      value: e.id,
    })),
  ]
}

const fetchMeetings = async () => {
  const res = await getMeetings()

  const meetings = res.data.data.meetings
  rows.value = meetings
    .filter((e) => e.event && e.event.status !== 0)
    .map((e) => ({
      id: e.id,
      nama: e.name,
      acara: e.event?.title || 'No Event',

      event_id: e.event?.id || null,
      event_status: e.event?.status,

      peserta: e.members?.length || 0,

      terisi: e.members?.length || 0,
    }))
}

onMounted(async () => {
  await fetchEvents()
  await fetchMeetings()
})

const openTambah = () => {
  dialogMode.value = 'add'
  selectedRow.value = null
  dialogRapat.value = true
}

const typeOptions = [
  { label: 'Semua Jenis', value: 'all' },
  { label: 'Umum', value: 'Umum' },
  { label: 'Divisi', value: 'Divisi' },
]

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Akan Datang', value: 'Akan Datang' },
  { label: 'Berlangsung', value: 'Berlangsung' },
  { label: 'Selesai', value: 'Selesai' },
]

const columns = [
  { name: 'event', label: 'Event', field: 'event', align: 'left' },
  { name: 'title', label: 'Nama Rapat', field: 'title', align: 'left' },
  { name: 'type', label: 'Jenis', field: 'type', align: 'left' },
  { name: 'division', label: 'Divisi', field: 'division', align: 'left' },
  { name: 'date', label: 'Tanggal', field: 'date', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'action', label: 'Aksi', field: 'action', align: 'center' },
]

const rows = ref([
  {
    id: 1,
    event: 'HMTI Fair',
    title: 'Rapat Persiapan Opening',
    type: 'Umum',
    division: '-',
    date: '18 Apr 2026, 12.00',
    status: 'Akan Datang',
  },
  {
    id: 2,
    event: 'HMTI Fair',
    title: 'Rapat Internal Acara',
    type: 'Divisi',
    division: 'Acara',
    date: '19 Apr 2026, 14.00',
    status: 'Berlangsung',
  },
  {
    id: 3,
    event: 'Seminar AI',
    title: 'Evaluasi Hari Pertama',
    type: 'Umum',
    division: '-',
    date: '15 Apr 2026, 16.00',
    status: 'Selesai',
  },
])

const filteredRows = computed(() => {
  return rows.value.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.value.toLowerCase())

    const matchEvent = selectedEvent.value === 'all' || item.event === selectedEvent.value

    const matchType = selectedType.value === 'all' || item.type === selectedType.value

    const matchStatus = selectedStatus.value === 'all' || item.status === selectedStatus.value

    return matchSearch && matchEvent && matchType && matchStatus
  })
})

const todayCount = computed(() => {
  return rows.value.filter((item) => item.date.includes('18 Apr 2026')).length
})

const unfinishedMinutes = computed(() => {
  return rows.value.filter((item) => item.status === 'Selesai').length
})

const statusColor = (status) => {
  if (status === 'Akan Datang') return 'blue'
  if (status === 'Berlangsung') return 'orange'
  if (status === 'Selesai') return 'positive'
  return 'grey'
}

const goToDetail = () => router.push('/admin/detail-rapat')
const goToNotulen = () => router.push('/admin/notulen-rapat')
const goToAbsensi = () => router.push('/admin/absensi-rapat')

onMounted(async () => {
  await nextTick()
  runEnterAnimation()
  bindHoverAnimation()
})

const runEnterAnimation = () => {
  const cards = document.querySelectorAll('.motion-card')

  if (cards.length) {
    animate(
      cards,
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
  }

  const table = document.querySelector('.motion-table')

  if (table) {
    animate(
      table,
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
  }
}

const bindHoverAnimation = () => {
  const buttons = document.querySelectorAll('.motion-btn')

  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      animate(
        btn,
        {
          scale: 1.05,
          y: -1,
        },
        { duration: 0.14 },
      )
    })

    btn.addEventListener('mouseleave', () => {
      animate(
        btn,
        {
          scale: 1,
          y: 0,
        },
        { duration: 0.14 },
      )
    })
  })

  const rows = document.querySelectorAll('.q-table tbody tr')

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      animate(
        row,
        {
          backgroundColor: 'rgba(99,102,241,0.03)',
        },
        { duration: 0.18 },
      )
    })

    row.addEventListener('mouseleave', () => {
      animate(
        row,
        {
          backgroundColor: 'rgba(255,255,255,1)',
        },
        { duration: 0.18 },
      )
    })
  })
}
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all 0.2s ease;
}

.q-table tbody tr {
  transition: background-color 0.2s ease;
}
</style>
