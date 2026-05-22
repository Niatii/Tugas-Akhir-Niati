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
      <!-- SEARCH -->
      <div class="row q-col-gutter-md">
        <div class="col-12 q-mb-md col-md-8">
          <q-input
            v-model="search"
            clearable
            debounce="20"
            outlined
            dense
            rounded
            label="Cari rapat..."
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <!-- EVENT -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedEvent"
            :options="filteredEventOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            use-input
            clearable
            fill-input
            hide-selected
            input-debounce="0"
            :label="selectedEvent ? undefined : 'Pilih Acara'"
            @filter="filterEvents"
          />
        </div>

        <!-- TYPE -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedType"
            :options="typeOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            :label="selectedType ? undefined : 'Jenis Rapat'"
          />
        </div>

        <!-- STATUS -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            :label="selectedStatus ? undefined : 'Status'"
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
            v-if="canEdit(props.row)"
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
            icon="delete"
            :disable="!canDelete(props.row)"
            :color="canDelete(props.row) ? 'negative' : 'grey-5'"
            @click="openDeleteDialog(props.row)"
          >
            <q-tooltip>
              {{ getDeleteTooltip(props.row) }}
            </q-tooltip>
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
    <ConfirmDialog
      v-model="showDeleteDialog"
      type="danger"
      title="Hapus Rapat"
      message="Data rapat akan dihapus permanen. Lanjutkan?"
      confirm-label="Ya, Hapus"
      cancel-label="Batal"
      @confirm="confirmDelete"
    />
    <TambahRapat
      v-model="dialogRapat"
      :mode="dialogMode"
      :edit-data="selectedRow"
      :user-role="userRole"
      :user-division-id="userDivisionId"
      @save="handleSave"
    />
    <StatusDialog
      v-model="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { animate, stagger } from 'motion'
import TambahRapat from 'src/components/Admin/KelolaRapat/KelolaRapat.vue'
import StatusDialog from 'src/components/StatusDialog.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import { getMeetings, deleteMeeting } from 'src/services/meeting.api'
import { getEvents } from 'src/services/event.api'

const dialogRapat = ref(false)
const dialogMode = ref('add')
const selectedRow = ref(null)
const router = useRouter()
const events = ref([])
const eventOptions = ref([])
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const showDeleteDialog = ref(false)

const search = ref('')
const selectedEvent = ref('all')
const selectedType = ref('all')
const selectedStatus = ref('all')
const filteredEventOptions = ref([])

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

  filteredEventOptions.value = eventOptions.value
}

const filterEvents = (val, update) => {
  update(() => {
    if (val === '') {
      filteredEventOptions.value = eventOptions.value
      return
    }

    const needle = val.toLowerCase()

    filteredEventOptions.value = eventOptions.value.filter((v) =>
      v.label.toLowerCase().includes(needle),
    )
  })
}

const loading = ref(false)

const fetchMeetings = async () => {
  loading.value = true

  try {
    const res = await getMeetings()

    const meetings = res.data.data.meetings

    rows.value = meetings.map((e) => ({
      id: e.id,

      title: e.title || '-',

      event: e.event?.title || '-',

      event_id: e.event?.id || null,

      division: e.division?.name || '-',

      division_id: e.division_id || null,

      type: e.meeting_type_name || '-',

      meeting_type: e.meeting_type,

        status: e.status_name,

      date: formatDateTime(e.schedule_date),

      /**
       * RAW DATA UNTUK EDIT
       */
      raw_schedule_date: e.schedule_date,

      location: e.location || '',

      notes: e.notes || '',

      created_at: e.created_at || null,
    }))
  } finally {
    loading.value = false
  }
}

const formatDateTime = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

let interval = null

onMounted(async () => {
  await fetchEvents()
  await fetchMeetings()

  interval = setInterval(() => {
    fetchMeetings()
  }, 30000) // 30 detik
})

onUnmounted(() => {
  clearInterval(interval)
})

const handleSave = async () => {
  dialogRapat.value = false
  await fetchMeetings()
}

const statusColor = (status) => {
  switch (status) {
    case 'Scheduled':
    case 'Akan Datang':
      return 'blue'

    case 'In Progress':
    case 'Berlangsung':
      return 'orange'

    case 'Done':
    case 'Selesai':
      return 'positive'

    default:
      return 'grey'
  }
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

const rows = ref([])

const filteredRows = computed(() => {
  return rows.value
    .filter((item) => {
      const keyword = (search.value || '').toLowerCase()

      const matchSearch = item.title?.toLowerCase().includes(keyword) || false

      const matchEvent =
        selectedEvent.value == null ||
        selectedEvent.value === 'all' ||
        item.event_id === selectedEvent.value

      const matchType = selectedType.value === 'all' || item.type === selectedType.value

      const matchStatus = selectedStatus.value === 'all' || item.status === selectedStatus.value

      return matchSearch && matchEvent && matchType && matchStatus
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const todayCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]

  return rows.value.filter((item) => {
    if (!item.date) return false

    return item.date.toString().includes(today)
  }).length
})

const openTambah = () => {
  dialogMode.value = 'add'
  selectedRow.value = null
  dialogRapat.value = true
}

// const openEdit = (row) => {
//   dialogMode.value = 'edit'
//   selectedRow.value = row
//   dialogRapat.value = true
// }

const unfinishedMinutes = computed(() => {
  return rows.value.filter((item) => item.status !== 'Selesai').length
})

const userRole = ref('admin') // placeholder
const userDivisionId = ref(1) // placeholder

const canEdit = (row) => {
  if (userRole.value === 'admin') {
    return row.division_id === null
  } else if (userRole.value === 'coordinator') {
    return row.division_id !== null && row.division_id === userDivisionId.value
  }
  return false
}

const canDelete = (row) => {
  /**
   * Hanya meeting akan datang
   * yang bisa dihapus
   */
  if (row.status !== 'Akan Datang') {
    return false
  }

  /**
   * Admin hanya delete
   * meeting umum
   */
  if (userRole.value === 'admin') {
    return row.division_id === null
  }

  /**
   * Coordinator hanya delete
   * meeting divisinya
   */
  if (userRole.value === 'coordinator') {
    return row.division_id !== null && row.division_id === userDivisionId.value
  }

  return false
}

const getDeleteTooltip = (row) => {
  /**
   * Meeting sudah berlangsung/selesai
   */
  if (row.status !== 'Akan Datang') {
    return 'Rapat yang sedang berlangsung atau selesai tidak dapat dihapus'
  }

  /**
   * Admin
   */
  if (userRole.value === 'admin') {
    if (row.division_id !== null) {
      return 'Admin hanya dapat menghapus rapat umum'
    }
  }

  /**
   * Coordinator
   */
  if (userRole.value === 'coordinator') {
    if (row.division_id === null) {
      return 'Koordinator tidak dapat menghapus rapat umum'
    }

    if (row.division_id !== userDivisionId.value) {
      return 'Koordinator hanya dapat menghapus rapat divisinya sendiri'
    }
  }

  return 'Hapus rapat'
}
const openDeleteDialog = (row) => {
  selectedRow.value = row
  showDeleteDialog.value = true
}
const confirmDelete = async () => {
  try {
    await deleteMeeting(selectedRow.value.id)
    dialogType.value = 'success'
    dialogTitle.value = 'Rapat Berhasil Dihapus'
    dialogMessage.value = 'Rapat telah berhasil dihapus.'
    showDialog.value = true
    showDeleteDialog.value = false

    await fetchMeetings()
  } catch (error) {
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value =
      error.response?.data?.message || 'Terjadi kesalahan saat menghapus divisi. Silakan coba lagi.'
    showDialog.value = true
  }
}

const goToDetail = (row) => {
  router.push({
    path: `/admin/detail-rapat/${row.id}`,
  })
}
const goToNotulen = (row) => {
  router.push({
    path: `/admin/notulen-rapat/${row.id}`,
  })
}
const goToAbsensi = (row) => {
  router.push({
    path: `/admin/absensi-rapat/${row.id}`,
  })
}

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
