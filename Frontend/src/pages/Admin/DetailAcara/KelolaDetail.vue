<template>
  <q-page class="q-pa-lg bg-grey-1">
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

    <div class="rounded-card q-py-md motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input v-model="search" clearable outlined dense rounded :label="search ? undefined : 'Cari acara...'">
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
            :label="selectedStatus ? undefined : 'Filter Status'"
          />
        </div>
      </div>
    </div>

    <q-table
      flat
      bordered
      row-key="id"
      :rows="filteredRows"
      :columns="columns"
      separator="horizontal"
      class="rounded-card motion-table"
    >
      <template #body-cell-nama="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.nama }}</div>
          <div class="text-caption text-grey-7">
            {{ props.row.organisasi }}
          </div>
        </q-td>
      </template>

      <template #body-cell-pendaftaran="props">
        <q-td :props="props">
          <template v-if="props.row.regStart && props.row.regEnd">
            {{ formatDate(props.row.regStart) }} <br />
            s/d {{ formatDate(props.row.regEnd) }}
          </template>

          <template v-else> - </template>
        </q-td>
      </template>

      <template #body-cell-acara="props">
        <q-td :props="props">
          <template v-if="props.row.start && props.row.end">
            {{ formatDate(props.row.start) }} <br />
            s/d {{ formatDate(props.row.end) }}
          </template>

          <template v-else> - </template>
        </q-td>
      </template>

      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip
            dense
            class="q-px-md q-py-xs"
            size="12px"
            :color="getStatusUI(props.row.status).color"
            text-color="white"
            :icon="getStatusUI(props.row.status).icon"
          >
            {{ getStatusUI(props.row.status).label }}
          </q-chip>
        </q-td>
      </template>

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
            <q-tooltip>Lihat Tinjauan Acara</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            icon="edit"
            class="motion-btn"
            :color="canEdit(props.row) ? 'blue-8' : 'grey-5'"
            :disable="!canEdit(props.row)"
            @click="editEvent(props.row)"
          >
            <q-tooltip>
              {{
                canEdit(props.row)
                  ? 'Edit Acara'
                  : `Acara dengan status ${getStatusLabel(EventStatusEnum.COMPLETED)} tidak dapat diedit`
              }}
            </q-tooltip>
          </q-btn>

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
                  : `Acara selain status ${getStatusLabel(EventStatusEnum.DRAFT)} tidak dapat dihapus`
              }}
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <ConfirmDialog
      v-model="showPublishDialog"
      type="success"
      title="Publish Acara"
      message="Apakah Anda yakin ingin mempublish acara ini?"
      confirm-label="Ya, Publish"
      cancel-label="Batal"
      @confirm="confirmPublish"
    />

    <ConfirmDialog
      v-model="showDeleteDialog"
      type="danger"
      title="Hapus Acara"
      message="Data acara akan dihapus permanen. Lanjutkan?"
      confirm-label="Ya, Hapus"
      cancel-label="Batal"
      @confirm="handleDelete"
    />

    <StatusDialog
      v-model="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
    />
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { animate, stagger } from 'motion'

import { getStatusUI, EventStatusEnum, getStatusLabel, isEventEditable, isEventDeletable, } from 'src/utils/EventEnumStatus'
import { getEvents, deleteEvent, publishEvent } from 'src/services/event.api'

import StatusDialog from 'src/components/StatusDialog.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import FooterComponent from 'src/components/FooterComponent.vue'

const $q = useQuasar()
const router = useRouter()

const search = ref('')
const selectedStatus = ref('all')
const showPublishDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedRow = ref(null)
const selectedEvent = ref(null)
const rows = ref([])
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  ...Object.values(EventStatusEnum).map((val) => ({
    label: getStatusLabel(val),
    value: val,
  })),
]

const columns = [
  { name: 'nama', label: 'Acara', field: 'nama', align: 'left' },
  { name: 'pendaftaran', label: 'Pendaftaran', align: 'center' },
  { name: 'acara', label: 'Pelaksanaan', align: 'center' },
  { name: 'status', label: 'Status', align: 'center' },
  { name: 'publish', label: 'Publish', align: 'center' },
  { name: 'aksi', label: 'Aksi', align: 'center' },
]

const filteredRows = computed(() => {
  return rows.value
    .filter((row) => {
      const matchSearch = row.nama.toLowerCase().includes(search.value.toLowerCase())
      const matchStatus = selectedStatus.value === 'all' || row.status === selectedStatus.value
      return matchSearch && matchStatus
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const canEdit = (row) => isEventEditable(row.status)
const editEvent = (row) => {
  if (!canEdit(row)) {
    $q.notify({ type: 'warning', message: 'Acara selesai tidak dapat diedit' })
    return
  }
  router.push(`/admin/edit-acara/${row.id}`)
}

const canDelete = (row) => isEventDeletable(row.status)
const openDeleteDialog = (row) => {
  selectedEvent.value = row
  showDeleteDialog.value = true
}

const goPreview = (row) => router.push(`/admin/preview-acara/${row.id}`)

const openPublishDialog = (row) => {
  selectedRow.value = row
  showPublishDialog.value = true
}

const formatDate = (val) => {
  if (!val) return '-'

  const date = new Date(val)

  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const confirmPublish = async () => {
  try {
    await publishEvent(selectedRow.value.id)

    showPublishDialog.value = false
    dialogType.value = 'success'
    dialogTitle.value = 'Acara Berhasil Dipublish'
    showDialog.value = true
    showPublishDialog.value = false

    await fetchEvents()
  } catch (error) {
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value =
      error.response?.data?.message || 'Terjadi kesalahan saat menyimpan acara. Silakan coba lagi.'

    showDialog.value = true
  }
}

const fetchEvents = async () => {
  try {
    const response = await getEvents()

    const events = response.data.data.events

    rows.value = events.map((item) => ({
      id: item.id,
      nama: item.title,
      organisasi: item.user?.name || '-',

      regStart: item.registration_start ? item.registration_start : '-',
      regEnd: item.registration_end ? item.registration_end : '-',

      start: item.start_date ? item.start_date : '-',
      end: item.end_date ? item.end_date : '-',

      status: item.status,
      status_name: item.status_name,
      published: item.status !== EventStatusEnum.DRAFT,

      created_at: item.created_at || null,
    }))
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = async () => {
  try {
    await deleteEvent(selectedEvent.value.id)

    dialogType.value = 'success'
    dialogTitle.value = 'Acara Berhasil Dihapus'
    dialogMessage.value = 'Acara telah berhasil dihapus.'
    showDialog.value = true
    showDeleteDialog.value = false

    await fetchEvents()
  } catch (error) {
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value = error?.response?.data?.message || 'Gagal menghapus acara'
    showDialog.value = true
  }
}

onMounted(async () => {
  await nextTick()

  animate('.motion-card', { opacity: [0, 1], y: [16, 0] }, { delay: stagger(0.06) })
  animate('.motion-table', { opacity: [0, 1], y: [14, 0] }, { delay: 0.2 })

  document.querySelectorAll('.motion-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => animate(el, { scale: 1.05 }))
    el.addEventListener('mouseleave', () => animate(el, { scale: 1 }))
  })

  await fetchEvents()
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
