<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs-->
    <div class="q-mb-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el label="Kelola Rapat" icon="people" class="text-grey-9" />
        <q-breadcrumbs-el label="Detail Rapat" icon="people" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Detail Rapat</div>

        <div class="text-grey-7">Informasi rapat, kehadiran peserta, dan notulen rapat.</div>
      </div>

      <div class="q-gutter-sm">
        <!-- Jika Akan Datang -->
        <q-btn
          v-if="meeting.status === 'Akan Datang'"
          color="indigo-9"
          icon="play_arrow"
          label="Mulai Rapat"
          rounded
          no-caps
          @click="startMeeting"
        />

        <!-- Jika Berlangsung -->
        <q-btn
          v-if="meeting.status === 'Berlangsung'"
          color="negative"
          icon="stop_circle"
          label="Selesaikan Rapat"
          rounded
          no-caps
          @click="finishMeeting"
        />

        <!-- Jika Selesai -->
        <q-badge
          v-if="meeting.status === 'Selesai'"
          color="positive"
          class="q-px-md q-py-sm"
          rounded
        >
          Rapat Telah Selesai
        </q-badge>
      </div>
    </div>

    <!-- INFO -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <div class="text-caption text-grey-7">Nama Rapat</div>

          <div class="text-subtitle1 text-weight-bold">
            {{ meeting.title }}
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Event</div>

          <div class="text-weight-medium">
            {{ meeting.event }}
          </div>
        </div>

        <div class="col-12 col-md-2">
          <div class="text-caption text-grey-7">Jenis</div>

          <q-badge
            size="12px"
            class="q-px-md q-py-xs"
            :color="meeting.type === 'Umum' ? 'indigo-9' : 'orange'"
            rounded
          >
            {{ meeting.type }}
          </q-badge>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Tanggal</div>

          <div class="text-weight-medium">
            {{ meeting.date }}
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mt-md">
        <div class="col-12 col-md-4">
          <div class="text-caption text-grey-7">Lokasi</div>

          <div class="text-weight-medium">
            {{ meeting.location }}
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Divisi</div>

          <div class="text-weight-medium">
            {{ meeting.division }}
          </div>
        </div>

        <div class="col-12 col-md-2">
          <div class="text-caption text-grey-7">Status</div>

          <q-badge size="12px" class="q-px-md q-py-xs" :color="statusColor(meeting.status)" rounded>
            {{ meeting.status }}
          </q-badge>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Dibuat Oleh</div>

          <div class="text-weight-medium">
            {{ meeting.createdBy }}
          </div>
        </div>
      </div>
    </q-card>

    <!-- TABS -->
    <q-card flat bordered class="rounded-card">
      <q-tabs
        v-model="tab"
        dense
        active-color="indigo-9"
        indicator-color="indigo-9"
        class="text-grey q-py-sm"
      >
        <q-tab name="attendance" label="Kehadiran" no-caps />
        <q-tab name="minutes" label="Notulen" no-caps />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- ATTENDANCE -->
        <q-tab-panel name="attendance">
          <!-- SUMMARY -->
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-4">
              <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
                <div class="text-caption text-grey-7">Hadir</div>

                <div class="text-h6 text-weight-bold text-positive">12</div>
              </q-card>
            </div>

            <div class="col-12 col-md-4">
              <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
                <div class="text-caption text-grey-7">Izin</div>

                <div class="text-h6 text-weight-bold text-orange">1</div>
              </q-card>
            </div>

            <div class="col-12 col-md-4">
              <q-card flat bordered class="rounded-card q-pa-md motion-card bg-red-1">
                <div class="text-caption text-grey-7">Tidak Hadir</div>

                <div class="text-h6 text-weight-bold text-negative">0</div>
              </q-card>
            </div>
          </div>
          <q-table flat :rows="participants" :columns="columns" row-key="id" separator="horizontal">
            <template #body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  size="12px"
                  class="q-px-md q-py-xs"
                  :color="attendanceColor(props.row.status)"
                  rounded
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- MINUTES -->
        <q-tab-panel name="minutes">
          <div v-if="meeting.status !== 'Selesai'" class="text-grey-6">
            Notulen tersedia setelah rapat selesai.
          </div>

          <div v-else>
            <div class="text-subtitle2 text-weight-bold q-mb-sm">Hasil Rapat</div>

            <div class="text-grey-8">
              {{ meeting.minutes }}
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FooterComponent from 'src/components/FooterComponent.vue'
import { getMeetingById } from 'src/services/meeting.api'

const router = useRouter()

const tab = ref('attendance')
const route = useRoute()
const meeting = ref({
  id: null,
  title: '-',
  event: '-',
  type: '-',
  date: '-',
  location: '-',
  division: '-',
  status: '-',
  createdBy: '-',
  startedAt: '',
  endedAt: '',
  minutes: '-',
})

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

const mapStatusLabel = (status) => {
  switch (status) {
    case 'Scheduled':
      return 'Akan Datang'

    case 'Ongoing':
      return 'Berlangsung'

    case 'Completed':
      return 'Selesai'

    default:
      return status || '-'
  }
}

const fetchMeetingDetail = async () => {
  try {
    const meetingId = route.params.id

    const res = await getMeetingById(meetingId)

    const data = res.data.data

    meeting.value = {
      id: data.id,

      title: data.title || '-',

      event: data.event?.title || '-',

      type: data.meeting_type_name || '-',

      date: formatDateTime(data.schedule_date),

      location: data.location || '-',

      division: data.division?.name || '-',

      status: mapStatusLabel(data.status_name),

      createdBy: data.event?.user?.name || '-',

      startedAt: '',

      endedAt: '',

      minutes: data.minutes || '-',
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await fetchMeetingDetail()
})

const participants = ref([
  {
    id: 1,
    name: 'Andi Saputra',
    division: 'Acara',
    status: 'Hadir',
  },
  {
    id: 2,
    name: 'Budi Pratama',
    division: 'Pubdok',
    status: 'Izin',
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
    name: 'division',
    label: 'Divisi',
    field: 'division',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Kehadiran',
    field: 'status',
    align: 'left',
  },
]

/* =========================
   ACTION START / FINISH
========================= */

const getCurrentTime = () => {
  const now = new Date()

  const hour = String(now.getHours()).padStart(2, '0')

  const minute = String(now.getMinutes()).padStart(2, '0')

  return `${hour}:${minute}`
}

const startMeeting = () => {
  meeting.value.status = 'Berlangsung'
  meeting.value.startedAt = getCurrentTime()
}

const finishMeeting = () => {
  meeting.value.status = 'Selesai'
  meeting.value.endedAt = getCurrentTime()

  router.push({
    path: '/admin/notulen-rapat',
    query: {
      meeting_id: meeting.value.id,
    },
  })
}

/* =========================
   HELPER
========================= */

const statusColor = (status) => {
  if (status === 'Berlangsung') return 'orange'

  if (status === 'Selesai') return 'positive'

  if (status === 'Akan Datang') return 'blue'

  return 'grey'
}

const attendanceColor = (status) => {
  if (status === 'Hadir') return 'positive'

  if (status === 'Izin') return 'warning'

  if (status === 'Tidak Hadir') return 'negative'

  return 'grey'
}
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}
</style>
