<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kelola Acara</div>
        <div class="text-grey-7">
          Kelola seluruh data acara organisasi dengan status otomatis berdasarkan timeline acara.
        </div>
      </div>

      <q-btn
        color="indigo-9"
        icon="add"
        label="Tambah Acara"
        no-caps
        rounded
        unelevated
        class="motion-btn"
        to="/admin/tambah-acara"
      />
    </div>

    <!-- FILTER -->
    <div class="rounded-card q-py-md motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-input v-model="search" outlined dense rounded label="Cari acara...">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            label="Filter Status"
          />
        </div>
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
      <!-- ACARA -->
      <template #body-cell-nama="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.nama }}</div>
          <div class="text-caption text-grey-7">
            {{ props.row.organisasi }}
          </div>
        </q-td>
      </template>

      <!-- PENDAFTARAN -->
      <template #body-cell-pendaftaran="props">
        <q-td :props="props">
          {{ formatDate(props.row.regStart) }} <br />
          s/d {{ formatDate(props.row.regEnd) }}
        </q-td>
      </template>

      <!-- ACARA -->
      <template #body-cell-acara="props">
        <q-td :props="props">
          {{ formatDate(props.row.start) }} <br />
          s/d {{ formatDate(props.row.end) }}
        </q-td>
      </template>

      <!-- STATUS -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip
            dense
            text-color="white"
            class="q-px-md q-py-xs"
            size="12px"
            :color="getStatusColor(getStatus(props.row))"
          >
            {{ getStatus(props.row) }}
          </q-chip>
        </q-td>
      </template>

      <!-- PUBLISH -->
      <template #body-cell-publish="props">
        <q-td :props="props">
          <q-btn
            v-if="!props.row.published"
            color="positive"
            icon="publish"
            label="Publish"
            no-caps
            size="12px"
            dense
            rounded
            unelevated
            class="motion-btn q-px-md q-py-xs"
            @click="openPublishDialog(props.row)"
          >
            <q-tooltip>Publikasikan acara</q-tooltip>
          </q-btn>

          <span v-else class="text-grey-6 text-caption"> Sudah Publish </span>
        </q-td>
      </template>

      <!-- AKSI -->
      <template #body-cell-aksi="props">
        <q-td :props="props">
          <!-- DETAIL -->
          <q-btn
            flat
            round
            dense
            icon="open_in_new"
            color="indigo-9"
            class="motion-btn"
            @click="goPreview(props.row)"
          >
            <q-tooltip>Lihat Preview Acara</q-tooltip>
          </q-btn>

          <!-- EDIT -->
          <q-btn
            flat
            round
            dense
            icon="edit"
            class="motion-btn"
            :color="canEdit(props.row) ? 'blue-8' : 'grey-5'"
            @click="editEvent(props.row)"
          >
            <q-tooltip>
              {{ canEdit(props.row) ? 'Edit Acara' : 'Acara selesai tidak dapat diedit' }}
            </q-tooltip>
          </q-btn>

          <!-- DELETE -->
          <q-btn
            flat
            round
            dense
            icon="delete"
            class="motion-btn"
            :disable="!canDelete(props.row)"
            :color="canDelete(props.row) ? 'negative' : 'grey-5'"
            @click="openDeleteDialog(props.row)"
          >
            <q-tooltip>
              {{
                canDelete(props.row)
                  ? 'Hapus Acara'
                  : 'Acara aktif / pendaftaran berjalan / Selesai tidak dapat dihapus'
              }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- MODAL PUBLISH -->
    <ConfirmDialog
      v-model="showPublishDialog"
      type="success"
      title="Publish Acara"
      message="Apakah Anda yakin ingin mempublish acara ini?"
      confirm-label="Ya, Publish"
      cancel-label="Batal"
      @confirm="confirmPublish"
    />

    <!-- MODAL DELETE -->
    <ConfirmDialog
      v-model="showDeleteDialog"
      type="danger"
      title="Hapus Acara"
      message="Data acara akan dihapus permanen. Lanjutkan?"
      confirm-label="Ya, Hapus"
      cancel-label="Batal"
      @confirm="confirmDelete"
    />

    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { animate, stagger } from 'motion'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import FooterComponent from 'src/components/FooterComponent.vue'

const $q = useQuasar()
const router = useRouter()

const search = ref('')
const selectedStatus = ref('all')

const showPublishDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedRow = ref(null)

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Menunggu Dibuka', value: 'Menunggu Dibuka' },
  { label: 'Pendaftaran Dibuka', value: 'Pendaftaran Dibuka' },
  { label: 'Pendaftaran Ditutup', value: 'Pendaftaran Ditutup' },
  { label: 'Sedang Berlangsung', value: 'Sedang Berlangsung' },
  { label: 'Selesai', value: 'Selesai' },
]

const columns = [
  { name: 'nama', label: 'Acara', field: 'nama', align: 'left' },
  { name: 'pendaftaran', label: 'Pendaftaran', field: 'pendaftaran', align: 'center' },
  { name: 'acara', label: 'Pelaksanaan', field: 'acara', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'publish', label: 'Publish', field: 'publish', align: 'center' },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center' },
]

const rows = ref([
  {
    id: 1,
    nama: 'HMTI Fair',
    organisasi: 'HMTI',
    regStart: '2026-01-01',
    regEnd: '2026-01-10',
    start: '2026-01-20',
    end: '2026-01-22',
    published: true,
  },
  {
    id: 2,
    nama: 'Seminar AI',
    organisasi: 'BEM Teknik',
    regStart: '2026-02-01',
    regEnd: '2026-02-15',
    start: '2026-02-20',
    end: '2026-02-20',
    published: false,
  },
  {
    id: 3,
    nama: 'Workshop UIUX',
    organisasi: 'UKM Digital',
    regStart: '2026-04-01',
    regEnd: '2026-04-05',
    start: '2026-05-10',
    end: '2026-05-12',
    published: true,
  },
])

const today = () => new Date().toISOString().slice(0, 10)

const getStatus = (row) => {
  if (!row.published) return 'Draft'

  const now = today()

  if (now < row.regStart) return 'Menunggu Dibuka'
  if (now <= row.regEnd) return 'Pendaftaran Dibuka'
  if (now < row.start) return 'Pendaftaran Ditutup'
  if (now <= row.end) return 'Sedang Berlangsung'

  return 'Selesai'
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Draft':
      return 'orange'
    case 'Menunggu Dibuka':
      return 'grey'
    case 'Pendaftaran Dibuka':
      return 'blue'
    case 'Pendaftaran Ditutup':
      return 'deep-orange'
    case 'Sedang Berlangsung':
      return 'indigo'
    case 'Selesai':
      return 'green'
    default:
      return 'grey'
  }
}

const filteredRows = computed(() => {
  return rows.value.filter((row) => {
    const status = getStatus(row)

    const matchSearch = row.nama.toLowerCase().includes(search.value.toLowerCase())

    const matchStatus = selectedStatus.value === 'all' || status === selectedStatus.value

    return matchSearch && matchStatus
  })
})

const canEdit = (row) => {
  return getStatus(row) !== 'Selesai'
}

const canDelete = (row) => {
  const status = getStatus(row)

  return status === 'Draft' || status === 'Menunggu Dibuka'
}

const goPreview = () => {
  router.push('/admin/preview-acara')
}

const editEvent = (row) => {
  if (!canEdit(row)) {
    $q.notify({
      type: 'warning',
      message: 'Acara selesai tidak dapat diedit',
    })
    return
  }

  router.push('/admin/edit-acara')
}

const openPublishDialog = (row) => {
  selectedRow.value = row
  showPublishDialog.value = true
}

const confirmPublish = () => {
  selectedRow.value.published = true
  showPublishDialog.value = false

  $q.notify({
    type: 'positive',
    message: 'Acara berhasil dipublish',
  })
}

const openDeleteDialog = (row) => {
  if (!canDelete(row)) return

  selectedRow.value = row
  showDeleteDialog.value = true
}

const confirmDelete = () => {
  rows.value = rows.value.filter((item) => item.id !== selectedRow.value.id)

  showDeleteDialog.value = false

  $q.notify({
    type: 'positive',
    message: 'Acara berhasil dihapus',
  })
}

const formatDate = (val) => {
  return new Date(val).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/* MOTION */
onMounted(async () => {
  await nextTick()

  animate('.motion-card', { opacity: [0, 1], y: [16, 0] }, { delay: stagger(0.06), duration: 0.35 })

  animate('.motion-table', { opacity: [0, 1], y: [14, 0] }, { delay: 0.2, duration: 0.35 })

  document.querySelectorAll('.motion-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      animate(el, { scale: 1.05, y: -1 }, { duration: 0.14 })
    })

    el.addEventListener('mouseleave', () => {
      animate(el, { scale: 1, y: 0 }, { duration: 0.14 })
    })
  })
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.q-table tbody tr {
  transition: background-color 0.2s ease;
}

.q-table tbody tr:hover {
  background: #f8fafc;
}
</style>
