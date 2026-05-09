<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kelola Divisi</div>

        <div class="text-grey-7">
          Kelola divisi acara dan lihat detail peserta masing-masing divisi
        </div>
      </div>

      <q-btn
        @click="openTambah"
        color="indigo-9"
        rounded
        no-caps
        icon="add"
        label="Tambah Divisi"
        class="motion-btn"
      />
    </div>

    <!-- FILTER -->
    <div class="rounded-card q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-5">
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

        <!-- <div class="col-12 col-md-3">
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
        </div> -->

        <div class="col-12 col-md-7">
          <q-input v-model="search" outlined dense rounded label="Cari divisi...">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Total Divisi</div>
          <div class="text-h5 text-weight-bold">
            {{ filteredRows.length }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Belum Ada Pendaftar</div>
          <div class="text-h5 text-weight-bold text-orange">
            {{ emptyCount }}
          </div>
        </q-card>
      </div>
    </div>

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
      <!-- DIVISI -->
      <template #body-cell-nama="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            {{ props.row.nama }}
          </div>
        </q-td>
      </template>

      <!-- ACTION -->
      <template #body-cell-aksi="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            icon="visibility"
            color="indigo-9"
            class="motion-btn"
            @click="openDetail(props.row)"
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
            icon="delete"
            color="negative"
            class="motion-btn"
            @click="openDeleteDialog()"
          >
            <q-tooltip>Hapus</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
    <ConfirmDialog
      v-model="showDeleteDialog"
      type="danger"
      title="Hapus Divisi"
      message="Data divisi akan dihapus permanen. Lanjutkan?"
      confirm-label="Ya, Hapus"
      cancel-label="Batal"
      @confirm="confirmDelete"
    />
    <TambahDivisi
      v-model="dialogDivisi"
      :mode="dialogMode"
      :data-edit="selectedRow"
      :events="eventOptions.filter((e) => e.value !== 'all')"
      :selected-event="selectedEvent"
      @save="handleRefresh"
    />
    <FooterComponent />
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import { animate, stagger } from 'motion'
import { useRouter } from 'vue-router'
import TambahDivisi from 'src/components/Admin/KelolaDivisi/TambahDivisi.vue'
import FooterComponent from 'src/components/FooterComponent.vue'
import { getDivisi } from 'src/services/divisi.api'
import { getEvents } from 'src/services/event.api'

const router = useRouter()
const search = ref('')
const selectedEvent = ref('all')
const selectedStatus = ref('all')
const showDeleteDialog = ref(false)
const dialogDivisi = ref(false)
const dialogMode = ref('add')
const selectedRow = ref(null)

const rows = ref([])
const events = ref([])
const eventOptions = ref([])
const handleRefresh = async () => {
  await fetchDivisi()
}
const fetchEvents = async () => {
  const res = await getEvents()

  events.value = res.data.data.events

  eventOptions.value = [
    { label: 'Semua Acara', value: 'all' },
    ...events.value.map((e) => ({
      label: e.title,
      value: e.id,
    })),
  ]
}
const fetchDivisi = async () => {
  const res = await getDivisi()

  const divisions = res.data.data.divisions

  // mapping ke table
  rows.value = divisions.map((e) => ({
    id: e.id,
    nama: e.name,
    acara: e.event?.title || 'No Event',
    event_id: e.event?.id || null,
    peserta: 0,
    status: 'Draft', // sementara (kalau belum ada di API)
    terisi: 0,
  }))
}
onMounted(async () => {
  await fetchEvents()
  await fetchDivisi()
})

const openEdit = (row) => {
  dialogMode.value = 'edit'
  selectedRow.value = row
  dialogDivisi.value = true
}

const openTambah = () => {
  dialogMode.value = 'add'
  selectedRow.value = null
  dialogDivisi.value = true
}

const openDetail = (row) => {
  router.push(`/admin/detail-divisi/${row.id}`)
}

const openDeleteDialog = () => {
  showDeleteDialog.value = true
}

// const statusOptions = [
//   { label: 'Semua Status', value: 'all' },
//   { label: 'Draft', value: 'Draft' },
//   { label: 'Menunggu Dibuka', value: 'Menunggu Dibuka' },
//   { label: 'Pendaftaran Dibuka', value: 'Pendaftaran Dibuka' },
//   { label: 'Pendaftaran Ditutup', value: 'Pendaftaran Ditutup' },
//   { label: 'Sedang Berlangsung', value: 'Sedang Berlangsung' },
//   { label: 'Selesai', value: 'Selesai' },
// ]

const columns = [
  {
    name: 'nama',
    label: 'Divisi',
    field: 'nama',
    align: 'left',
  },
  {
    name: 'acara',
    label: 'Acara',
    field: 'acara',
    align: 'left',
  },
  {
    name: 'peserta',
    label: 'Jumlah Peserta',
    field: 'peserta',
    align: 'left',
  },
  {
    name: 'aksi',
    label: 'Aksi',
    field: 'aksi',
    align: 'center',
  },
]

const filteredRows = computed(() => {
  return rows.value.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(search.value.toLowerCase())

    const matchEvent = selectedEvent.value === 'all' || item.event_id === selectedEvent.value

    const matchStatus = selectedStatus.value === 'all' || item.status === selectedStatus.value

    return matchSearch && matchEvent && matchStatus
  })
})

const emptyCount = computed(() => filteredRows.value.filter((item) => item.terisi === 0).length)

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
        y: [14, 0],
      },
      {
        delay: stagger(0.06),
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
        y: [12, 0],
      },
      {
        delay: 0.22,
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
        {
          duration: 0.14,
        },
      )
    })

    btn.addEventListener('mouseleave', () => {
      animate(
        btn,
        {
          scale: 1,
          y: 0,
        },
        {
          duration: 0.14,
        },
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
        {
          duration: 0.18,
        },
      )
    })

    row.addEventListener('mouseleave', () => {
      animate(
        row,
        {
          backgroundColor: 'rgba(255,255,255,1)',
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
