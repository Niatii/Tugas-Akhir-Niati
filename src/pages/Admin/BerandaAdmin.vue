<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-md">
      <!-- KPI Cards -->
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
        <!-- Donut -->
        <div class="col-12 col-md-5">
          <q-card class="chart-card full-height">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Status Acara</div>

              <ApexChart type="donut" height="320" :options="donutOptions" :series="donutSeries" />
            </q-card-section>
          </q-card>
        </div>

        <!-- Bar -->
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

          <q-btn flat dense no-caps class="view-all-btn">
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
                <q-badge color="orange-2" text-color="orange-9" rounded> Pending </q-badge>
              </q-td>
            </template>

            <!-- Action -->
            <template #body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  dense
                  round
                  flat
                  icon="check_circle"
                  color="positive"
                  @click="approve(props.row)"
                />

                <q-btn dense round flat icon="cancel" color="negative" @click="reject(props.row)" />
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
import { ref } from 'vue'
import ApexChart from 'vue3-apexcharts'
import FooterComponent from 'src/components/FooterComponent.vue'

/* KPI */
const statsCards = ref([
  {
    title: 'Total Acara',
    value: 12,
    icon: 'event',
  },
  {
    title: 'Rata-rata Kehadiran',
    value: '87%',
    icon: 'groups',
  },
  {
    title: 'Acara Mendatang',
    value: 5,
    icon: 'schedule',
  },
])

/* DONUT */
const donutSeries = ref([12, 5, 8])

const donutOptions = ref({
  labels: ['Selesai', 'Draft', 'Aktif'],

  chart: {
    toolbar: {
      show: false,
    },
  },

  legend: {
    position: 'bottom',
  },

  dataLabels: {
    enabled: true,
  },

  stroke: {
    width: 0,
  },

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
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
            },
          },
        },
      },
    },
  },
})

/* BAR */
const barSeries = ref([
  {
    name: 'Kehadiran',
    data: [120, 145, 138, 165, 180, 172, 190, 210, 198, 220, 205, 230],
  },
])

const barOptions = ref({
  chart: {
    toolbar: {
      show: false,
    },
  },

  colors: ['#001BB7'],

  dataLabels: {
    enabled: false,
  },

  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '48%',
    },
  },

  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ],
  },

  yaxis: {
    title: {
      text: 'Peserta',
    },
  },

  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4,
  },

  tooltip: {
    y: {
      formatter: (val) => `${val} peserta`,
    },
  },
})

const pendingParticipants = ref([
  {
    id: 1,
    name: 'Ahmad Fauzi',
    event: 'Seminar AI',
    date: '10 menit lalu',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    event: 'Workshop UI/UX',
    date: '25 menit lalu',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Citra Dewi',
    event: 'Bootcamp Vue',
    date: '1 jam lalu',
    status: 'Pending',
  },
])

const columns = [
  {
    name: 'name',
    label: 'Nama',
    field: 'name',
    align: 'left',
  },
  {
    name: 'event',
    label: 'Acara',
    field: 'event',
    align: 'left',
  },
  {
    name: 'date',
    label: 'Waktu',
    field: 'date',
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

function approve(row) {
  console.log('Approve:', row)
}

function reject(row) {
  console.log('Reject:', row)
}
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
