<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- BREADCRUMB -->
    <div class="q-mb-md motion-card">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" color="grey-6" size="1.1em" />
        </template>

        <q-breadcrumbs-el label="Kelola Sertifikat" icon="workspace_premium" class="text-grey-8" />

        <q-breadcrumbs-el label="Detail Event" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Sertifikat Event</div>

        <div class="text-grey-7">HMTI Fair • Kelola upload sertifikat Panitia.</div>
      </div>

      <div class="q-gutter-sm">
        <q-btn
          color="indigo-9"
          icon="download"
          label="Export Data"
          rounded
          no-caps
          class="motion-btn"
        />
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Panitia Layak</div>

          <div class="text-h5 text-weight-bold">120</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Sudah Upload</div>

          <div class="text-h5 text-weight-bold text-indigo-9">98</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Belum Upload</div>

          <div class="text-h5 text-weight-bold text-orange">22</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Terkirim</div>

          <div class="text-h5 text-weight-bold text-positive">76</div>
        </q-card>
      </div>
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input v-model="search" outlined dense rounded label="Cari nama Panitia...">
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            emit-value
            map-options
            outlined
            dense
            rounded
            label="Status Sertifikat"
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
      <!-- STATUS -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="statusColor(props.row.status)" rounded class="q-px-md q-py-xs">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>

      <!-- FILE -->
      <template #body-cell-file="props">
        <q-td :props="props">
          <span v-if="props.row.file" class="text-indigo-9 text-weight-medium">
            {{ props.row.file }}
          </span>

          <span v-else class="text-grey-6"> - </span>
        </q-td>
      </template>

      <!-- ACTION -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn flat round dense icon="upload" color="orange" class="motion-btn">
            <q-tooltip> Upload Sertifikat </q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            dense
            icon="download"
            color="positive"
            class="motion-btn"
            :disable="!props.row.file"
          >
            <q-tooltip> Unduh </q-tooltip>
          </q-btn>

          <!-- <q-btn
            flat
            round
            dense
            icon="mail"
            color="indigo-9"
            class="motion-btn"
            :disable="!props.row.file"
          >
            <q-tooltip> Kirim </q-tooltip>
          </q-btn> -->
        </q-td>
      </template>
    </q-table>
     <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { animate, stagger } from 'motion'
import FooterComponent from 'src/components/FooterComponent.vue'

const search = ref('')
const selectedStatus = ref('all')

const statusOptions = [
  {
    label: 'Semua',
    value: 'all',
  },
  {
    label: 'Belum Upload',
    value: 'pending',
  },
  {
    label: 'Sudah Upload',
    value: 'uploaded',
  },
  {
    label: 'Terkirim',
    value: 'sent',
  },
]

const columns = [
  {
    name: 'name',
    label: 'Nama Panitia',
    field: 'name',
    align: 'left',
  },
  {
    name: 'role',
    label: 'Kategori',
    field: 'role',
    align: 'left',
  },
  {
    name: 'attendance',
    label: 'Kehadiran',
    field: 'attendance',
    align: 'center',
  },
  {
    name: 'file',
    label: 'File',
    field: 'file',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
  },
  {
    name: 'action',
    label: 'Aksi',
    field: 'action',
    align: 'center',
  },
]

const rows = ref([
  {
    id: 1,
    name: 'Andi Saputra',
    role: 'Panitia',
    attendance: '100%',
    file: 'andi.pdf',
    status: 'Sudah Upload',
  },
  {
    id: 2,
    name: 'Budi Pratama',
    role: 'Panitia',
    attendance: '82%',
    file: '',
    status: 'Belum Upload',
  },
  {
    id: 3,
    name: 'Citra Lestari',
    role: 'Panitia',
    attendance: '100%',
    file: 'citra.pdf',
    status: 'Terkirim',
  },
])

const filteredRows = computed(() => {
  return rows.value.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.value.toLowerCase())

    const matchStatus =
      selectedStatus.value === 'all' ||
      (selectedStatus.value === 'pending' && item.status === 'Belum Upload') ||
      (selectedStatus.value === 'uploaded' && item.status === 'Sudah Upload') ||
      (selectedStatus.value === 'sent' && item.status === 'Terkirim')

    return matchSearch && matchStatus
  })
})

const statusColor = (status) => {
  if (status === 'Belum Upload') return 'orange'

  if (status === 'Sudah Upload') return 'blue'

  if (status === 'Terkirim') return 'positive'

  return 'grey'
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
