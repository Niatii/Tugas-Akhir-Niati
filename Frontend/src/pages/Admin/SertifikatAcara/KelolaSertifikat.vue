<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- BREADCRUMB -->
    <div class="q-mb-md motion-card">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" color="grey-6" size="1.1em" />
        </template>
        <q-breadcrumbs-el label="Kelola Sertifikat" icon="workspace_premium" class="text-grey-8" />
      </q-breadcrumbs>
    </div>

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kelola Sertifikat</div>
        <div class="text-grey-7">
          Hasilkan dan distribusikan sertifikat kepada peserta yang telah menyelesaikan event.
        </div>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Acara Selesai</div>
          <div class="text-h5 text-weight-bold">{{ completedEvents.length }}</div>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Total Layak</div>
          <div class="text-h5 text-weight-bold text-positive">{{ totalEligible }}</div>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Sudah Dihasilkan</div>
          <div class="text-h5 text-weight-bold text-indigo-9">{{ totalGenerated }}</div>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Sudah Publikasi</div>
          <div class="text-h5 text-weight-bold text-orange">{{ totalPublished }}</div>
        </q-card>
      </div>
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input v-model="search" outlined dense rounded label="Cari nama acara..." clearable>
            <template #prepend><q-icon name="search" /></template>
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
            label="Status"
          />
        </div>
      </div>
    </q-card>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="indigo-9" size="50px" />
    </div>

    <!-- TABLE EVENT -->
    <q-table
      v-else
      flat
      bordered
      row-key="id"
      :rows="filteredRows"
      :columns="columns"
      separator="horizontal"
      class="rounded-card motion-table"
      no-data-label="Tidak ada event yang selesai."
    >
      <!-- PROGRESS -->
      <template #body-cell-progress="props">
        <q-td :props="props">
          <div class="text-weight-medium">
            {{ props.row.summary?.generated ?? 0 }} / {{ props.row.summary?.eligible ?? 0 }}
          </div>
          <div class="text-caption text-grey-7">
            Publish: {{ props.row.summary?.published ?? 0 }}
          </div>
        </q-td>
      </template>

      <!-- STATUS -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="getStatusColor(props.row)"
            rounded
            class="q-px-md q-py-xs"
          >
            {{ getStatusLabel(props.row) }}
          </q-badge>
        </q-td>
      </template>

      <!-- ACTION -->
      <template #body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            icon="manage_accounts"
            color="indigo-9"
            class="motion-btn"
            @click="openDetail(props.row)"
          >
            <q-tooltip>Kelola Sertifikat</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            dense
            icon="style"
            color="deep-purple"
            class="motion-btn"
            @click="openTemplate(props.row)"
          >
            <q-tooltip>Kelola Template</q-tooltip>
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
import { getEvents } from 'src/services/event.api'
import { getCertificatesForEvent } from 'src/services/certificate.api'
import FooterComponent from 'src/components/FooterComponent.vue'

const router = useRouter()
const loading = ref(false)
const search = ref('')
const selectedStatus = ref('all')
const events = ref([])

const statusOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Lengkap (Semua Publish)', value: 'complete' },
  { label: 'Sebagian', value: 'partial' },
]

const columns = [
  { name: 'name', label: 'Nama Acara', field: 'title', align: 'left' },
  { name: 'date', label: 'Tanggal', field: (r) => formatDate(r.start_date), align: 'left' },
  { name: 'progress', label: 'Dihasilkan / Publikasi', align: 'center' },
  { name: 'status', label: 'Status', align: 'center' },
  { name: 'action', label: 'Aksi', align: 'center' },
]

// Only show COMPLETED events (status = 5)
const completedEvents = computed(() => events.value.filter((e) => e.status === 5))

const filteredRows = computed(() => {
  return completedEvents.value.filter((e) => {
    const keyword = (search.value || '').toLowerCase()
    const matchSearch = e.title?.toLowerCase().includes(keyword)
    const summary = e.summary
    const isComplete = summary && summary.eligible > 0 && summary.published >= summary.eligible
    const matchStatus =
      selectedStatus.value === 'all' ||
      (selectedStatus.value === 'complete' && isComplete) ||
      (selectedStatus.value === 'partial' && !isComplete)
    return matchSearch && matchStatus
  })
})

const totalEligible = computed(() => completedEvents.value.reduce((s, e) => s + (e.summary?.eligible ?? 0), 0))
const totalGenerated = computed(() => completedEvents.value.reduce((s, e) => s + (e.summary?.generated ?? 0), 0))
const totalPublished = computed(() => completedEvents.value.reduce((s, e) => s + (e.summary?.published ?? 0), 0))

const getStatusColor = (event) => {
  const s = event.summary
  if (!s || s.eligible === 0) return 'grey'
  if (s.published >= s.eligible) return 'positive'
  if (s.generated > 0) return 'blue'
  return 'orange'
}

const getStatusLabel = (event) => {
  const s = event.summary
  if (!s || s.eligible === 0) return 'Tidak ada peserta'
  if (s.published >= s.eligible) return 'Lengkap'
  if (s.generated > 0) return 'Proses'
  return 'Belum Dihasilkan'
}

const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const fetchEvents = async () => {
  loading.value = true
  try {
    const res = await getEvents()
    const allEvents = res.data.data?.events || []
    events.value = allEvents

    // Fetch certificate summary for each completed event
    const completed = allEvents.filter((e) => e.status === 5)
    await Promise.all(
      completed.map(async (event) => {
        try {
          const certRes = await getCertificatesForEvent(event.id)
          event.summary = certRes.data.data?.summary || null
        } catch {
          event.summary = null
        }
      }),
    )

    // Trigger reactivity
    events.value = [...allEvents]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const openDetail = (event) => {
  router.push(`/admin/detail-sertifikat/${event.id}`)
}

const openTemplate = (event) => {
  router.push(`/admin/template-sertifikat/${event.id}`)
}

onMounted(async () => {
  await fetchEvents()
  await nextTick()
  animate('.motion-card', { opacity: [0, 1], y: [12, 0] }, { delay: stagger(0.05), duration: 0.35, easing: 'ease-out' })
  animate('.motion-table', { opacity: [0, 1], y: [10, 0] }, { delay: 0.18, duration: 0.35, easing: 'ease-out' })
})
</script>

<style scoped>
.rounded-card { border-radius: 18px; }
.motion-btn { transition: all 0.18s ease; }
</style>
