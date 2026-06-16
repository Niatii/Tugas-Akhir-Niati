<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-md">
      <div class="row q-col-gutter-md q-mb-md">
        <div v-for="item in statsCards" :key="item.title" class="col-12 col-sm-6 col-md-4">
          <q-card class="stats-card">
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <q-icon :name="item.icon" size="24px" class="q-mr-sm text-indigo-9" />

                <div class="text-subtitle1 text-weight-medium">
                  {{ item.title }}
                </div>
              </div>

              <div class="text-h4 text-weight-bold text-grey-9">
                {{ item.value }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Charts -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-5">
          <q-card class="chart-card full-height">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Status Acara</div>

              <ApexChart type="donut" height="320" :options="donutOptions" :series="donutSeries" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-7">
          <q-card class="chart-card full-height">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Kehadiran Bulanan</div>

              <ApexChart type="bar" height="320" :options="barOptions" :series="barSeries" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card class="pending-card q-mt-md">
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6 text-weight-bold">Peserta Menunggu Persetujuan</div>
          <q-badge color="indigo-9" text-color="white" rounded class="q-ml-sm">
            {{ pendingParticipants.length }}
          </q-badge>

          <q-space />

          <q-btn flat dense no-caps class="view-all-btn" @click="goToManageParticipants">
            <span class="text-indigo-9 text-weight-medium"> Lihat Semua </span>

            <q-icon name="arrow_forward" size="16px" class="q-ml-xs text-indigo-9" />
          </q-btn>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-table
            flat
            bordered
            :rows="pendingParticipants"
            :columns="columns"
            row-key="id"
            hide-bottom
            class="pending-table"
          >
            <!-- Status -->
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  dense
                  size="12px"
                  class="q-px-md"
                  text-color="white"
                  :color="REGISTRATION_STATUS_COLOR[props.row.status] || 'orange'"
                >
                  {{ REGISTRATION_STATUS_LABEL[props.row.status] || 'Menunggu' }}
                </q-chip>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import ApexChart from 'vue3-apexcharts'
import FooterComponent from 'src/components/FooterComponent.vue'
import {
  REGISTRATION_STATUS,
  REGISTRATION_STATUS_LABEL,
  REGISTRATION_STATUS_COLOR,
} from 'src/enums/registration-status.enum'

import { getEventRegistrations } from 'src/services/event-member.api'
import { getAdminDashboard } from 'src/services/dashboard.api'

const statsCards = ref([
  { title: 'Total Acara', value: '-', icon: 'event' },
  { title: 'Rata-rata Kehadiran', value: '-', icon: 'groups' },
  { title: 'Acara Mendatang', value: '-', icon: 'schedule' },
])

const donutSeries = ref([0, 0, 0])

const donutOptions = ref({
  labels: ['Selesai', 'Draft', 'Aktif'],
  chart: { toolbar: { show: false } },
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
  stroke: { width: 0 },
  colors: ['#10B981', '#F59E0B', '#0066CC'],
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
          },
        },
      },
    },
  },
})

const barSeries = ref([{ name: 'Kehadiran', data: Array(12).fill(0) }])

const barOptions = ref({
  chart: { toolbar: { show: false } },
  colors: ['#001BB7'],
  dataLabels: { enabled: false },
  plotOptions: { bar: { borderRadius: 6, columnWidth: '48%' } },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
  },
  yaxis: { title: { text: 'Peserta' } },
  grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
  tooltip: { y: { formatter: (val) => `${val} peserta` } },
})

const router = useRouter()
const pendingParticipants = ref([])

const columns = [
  { name: 'name', label: 'Nama', field: 'name', align: 'left' },
  { name: 'event', label: 'Acara', field: 'event', align: 'left' },
  { name: 'date', label: 'Waktu', field: 'date', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
]

const fetchDashboard = async () => {
  try {
    const res = await getAdminDashboard()
    const payload = res.data?.data
    if (!payload) return

    const { kpi, donut, bar } = payload

    statsCards.value = [
      { title: 'Total Acara', value: kpi.totalEvents ?? 0, icon: 'event' },
      { title: 'Rata-rata Kehadiran', value: `${kpi.avgAttendance ?? 0}%`, icon: 'groups' },
      { title: 'Acara Mendatang', value: kpi.upcomingEvents ?? 0, icon: 'schedule' },
    ]

    donutSeries.value = donut.series ?? [0, 0, 0]

    barSeries.value = [{ name: 'Kehadiran', data: bar.series ?? Array(12).fill(0) }]
  } catch (error) {
    console.error('Failed to fetch admin dashboard', error)
  }
}

const fetchPendingParticipants = async () => {
  try {
    const res = await getEventRegistrations()
    const regs = res.data?.data?.event_registrations || []

    pendingParticipants.value = regs
      .filter((r) => r.status === REGISTRATION_STATUS.PENDING)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3)
      .map((item) => ({
        id: item.id,
        name: item.user?.name || '-',
        event: item.event?.title || '-',
        date: item.created_at ? new Date(item.created_at).toLocaleString() : '-',
        status: item.status,
      }))
  } catch (error) {
    console.error('Failed to fetch pending participants', error)
  }
}

const goToManageParticipants = () => router.push('/admin/peserta')

onMounted(() => {
  fetchDashboard()
  fetchPendingParticipants()
})
</script>

<style scoped>
.stats-card,
.chart-card {
  border-radius: 18px;
  border: 1px solid #edf2f7;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.stats-card {
  transition: all 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
}

.chart-card {
  padding: 6px;
}

.pending-card {
  border-radius: 18px;
  border: 1px solid #edf2f7;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.pending-table {
  border-radius: 0 0 18px 18px;
}

:deep(.q-table thead tr) {
  background: #f8fafc;
}

:deep(.q-table th) {
  font-weight: 700;
  color: #475569;
}

:deep(.q-table tbody tr:hover) {
  background: #f8fafc;
}
</style>
