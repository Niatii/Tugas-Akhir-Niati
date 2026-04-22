<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kelola Sertifikat</div>

        <div class="text-grey-7">
          Upload dan distribusikan sertifikat kepada peserta yang telah menyelesaikan event.
        </div>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Event Selesai</div>

          <div class="text-h5 text-weight-bold">4</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Peserta Layak</div>

          <div class="text-h5 text-weight-bold text-positive">520</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Sudah Upload</div>

          <div class="text-h5 text-weight-bold text-indigo-9">401</div>
        </q-card>
      </div>

      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Belum Upload</div>

          <div class="text-h5 text-weight-bold text-orange">119</div>
        </q-card>
      </div>
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input v-model="search" outlined dense rounded label="Cari nama event...">
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
            label="Status Upload"
          />
        </div>
      </div>
    </q-card>

    <!-- TABLE EVENT -->
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
          <q-badge
            :color="props.row.pending === 0 ? 'positive' : 'orange'"
            rounded
            class="q-px-md q-py-xs"
          >
            {{ props.row.pending === 0 ? 'Lengkap' : 'Proses Upload' }}
          </q-badge>
        </q-td>
      </template>

      <!-- PROGRESS -->
      <template #body-cell-progress="props">
        <q-td :props="props">
          <div class="text-weight-medium">{{ props.row.uploaded }}/{{ props.row.eligible }}</div>
        </q-td>
      </template>

      <!-- ACTION -->
      <template #body-cell-action="props">
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
            <q-tooltip> Kelola Peserta </q-tooltip>
          </q-btn>

          <q-btn flat round dense icon="download" color="positive" class="motion-btn">
            <q-tooltip> Export Data </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
     <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { animate, stagger } from 'motion'
import FooterComponent from 'src/components/FooterComponent.vue'

const router = useRouter()

const search = ref('')
const selectedStatus = ref('all')

const statusOptions = [
  {
    label: 'Semua',
    value: 'all',
  },
  {
    label: 'Lengkap',
    value: 'complete',
  },
  {
    label: 'Proses Upload',
    value: 'pending',
  },
]

const columns = [
  {
    name: 'name',
    label: 'Nama Event',
    field: 'name',
    align: 'left',
  },
  {
    name: 'date',
    label: 'Tanggal',
    field: 'date',
    align: 'left',
  },
  {
    name: 'eligible',
    label: 'Layak',
    field: 'eligible',
    align: 'center',
  },
  {
    name: 'progress',
    label: 'Upload',
    field: 'progress',
    align: 'center',
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
    name: 'HMTI Fair',
    date: '18 Apr 2026',
    eligible: 120,
    uploaded: 100,
    pending: 20,
  },
  {
    id: 2,
    name: 'Seminar AI',
    date: '22 Mei 2026',
    eligible: 300,
    uploaded: 300,
    pending: 0,
  },
  {
    id: 3,
    name: 'Dies Natalis',
    date: '10 Jun 2026',
    eligible: 100,
    uploaded: 1,
    pending: 99,
  },
])

const filteredRows = computed(() => {
  return rows.value.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.value.toLowerCase())

    const matchStatus =
      selectedStatus.value === 'all' ||
      (selectedStatus.value === 'complete' && item.pending === 0) ||
      (selectedStatus.value === 'pending' && item.pending > 0)

    return matchSearch && matchStatus
  })
})

const openDetail = () => {
  router.push('/admin/detail-sertifikat')
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
