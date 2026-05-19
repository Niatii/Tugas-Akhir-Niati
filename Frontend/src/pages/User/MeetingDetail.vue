<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs-->
    <div class="q-mb-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el
          label="Detail Acara Saya"
          icon="event"
          class="text-grey-9"
          :to="`/user/detail-acara-saya/${id}`"
        />
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
        <!-- Jika Akan Datang / Berlangsung (Coordinator) -->
        <q-btn
          v-if="['Akan Datang', 'Berlangsung'].includes(meeting.status) && isCoordinator"
          outline
          color="indigo-9"
          icon="checklist"
          label="Kelola Absensi"
          rounded
          no-caps
          @click="router.push(`/user/absensi-rapat/${meeting.id}`)"
        />

        <!-- Jika Akan Datang (Coordinator) -->
        <q-btn
          v-if="meeting.status === 'Akan Datang' && isCoordinator"
          color="indigo-9"
          icon="play_arrow"
          label="Mulai Rapat"
          rounded
          no-caps
          @click="startMeetingHandler"
        />

        <!-- Jika Berlangsung (Coordinator) -->
        <q-btn
          v-if="meeting.status === 'Berlangsung' && isCoordinator"
          color="negative"
          icon="stop_circle"
          label="Selesaikan Rapat"
          rounded
          no-caps
          @click="finishMeetingHandler"
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
          <div
            class="row q-col-gutter-md q-mb-md"
            v-if="isCoordinator && meeting.type === 'Divisi'"
          >
            <div class="col-12 col-md-4">
              <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
                <div class="text-caption text-grey-7">Hadir</div>
                <div class="text-h6 text-weight-bold text-positive">
                  {{ attendanceSummary.hadir }}
                </div>
              </q-card>
            </div>

            <div class="col-12 col-md-4">
              <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
                <div class="text-caption text-grey-7">Izin</div>
                <div class="text-h6 text-weight-bold text-orange">
                  {{ attendanceSummary.izin }}
                </div>
              </q-card>
            </div>

            <div class="col-12 col-md-4">
              <q-card flat bordered class="rounded-card q-pa-md motion-card bg-red-1">
                <div class="text-caption text-grey-7">Tidak Hadir</div>
                <div class="text-h6 text-weight-bold text-negative">
                  {{ attendanceSummary.tidakHadir }}
                </div>
              </q-card>
            </div>
          </div>

          <!-- TABEL KEHADIRAN UNTUK KOORDINATOR -->
          <q-table
            v-if="isCoordinator && meeting.type === 'Divisi'"
            flat
            :rows="participants"
            :columns="columns"
            row-key="id"
            separator="horizontal"
          >
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

          <!-- KEHADIRAN PRIBADI UNTUK ANGGOTA BIASA -->
          <div v-else class="text-center q-pa-xl">
            <div class="text-subtitle1 text-weight-medium q-mb-sm">Status Kehadiran Anda</div>
            <q-badge
              size="16px"
              class="q-px-lg q-py-sm"
              :color="attendanceColor(myAttendanceStatus)"
              rounded
            >
              {{ myAttendanceStatus }}
            </q-badge>
          </div>
        </q-tab-panel>

        <!-- MINUTES -->
        <q-tab-panel name="minutes">
          <div v-if="loadingNote" class="text-grey-6">Memuat notulen...</div>

          <div v-else-if="meeting.status !== 'Selesai'" class="text-grey-6">
            Notulen tersedia setelah rapat selesai.
          </div>

          <div v-else-if="!meetingNote" class="text-grey-6">
            <div class="q-mb-md">Notulen belum dibuat.</div>
            <q-btn
              v-if="isCoordinator"
              color="indigo-9"
              icon="add"
              label="Buat Notulen"
              no-caps
              rounded
              @click="goToNotulen"
            />
          </div>

          <div v-else>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle2 text-weight-bold">Hasil Rapat</div>
              <q-btn
                v-if="isCoordinator"
                color="indigo-9"
                icon="edit"
                label="Edit Notulen"
                flat
                dense
                no-caps
                @click="goToNotulen"
              />
            </div>

            <div class="text-grey-8 rich-content" v-html="meetingNote.content" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FooterComponent from 'src/components/FooterComponent.vue'
import { getMeetingById, startMeeting, finishMeeting } from 'src/services/meeting.api'
import { getAttendances } from 'src/services/attendance.api'
import { getMeetingNotes } from 'src/services/meeting-note.api'
import { getMyEvents } from 'src/services/event.api'

const router = useRouter()
const route = useRoute()
const meetingNote = ref(null)
const loadingNote = ref(false)
const tab = ref('attendance')
const userRegistration = ref(null)
const currentUser = ref(null)

const attendanceStatusMap = {
  0: 'Tidak Hadir',
  1: 'Hadir',
  2: 'Izin',
}

const meeting = ref({
  id: null,
  event_id: null,
  title: '-',
  event: '-',
  type: '-',
  date: '-',
  location: '-',
  division: '-',
  status: '-',
  createdBy: '-',
})

const isCoordinator = computed(() => {
  return userRegistration.value?.position?.toLowerCase() === 'koordinator'
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

const fetchMeetingNote = async () => {
  try {
    loadingNote.value = true
    const meetingId = route.params.id
    const res = await getMeetingNotes({
      meeting_id: meetingId,
    })
    const notes = res.data.data.notes || []
    meetingNote.value = notes.length > 0 ? notes[0] : null
  } catch (error) {
    console.log(error)
  } finally {
    loadingNote.value = false
  }
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
      event_id: data.event?.id,
      title: data.title || '-',
      event: data.event?.title || '-',
      type: data.meeting_type_name || '-',
      date: formatDateTime(data.schedule_date),
      location: data.location || '-',
      division: data.division?.name || '-',
      status: mapStatusLabel(data.status_name),
      createdBy: data.event?.user?.name || '-',
    }

    if (data.event?.id) {
      await fetchUserRegistration(data.event.id)
    }
  } catch (error) {
    console.log(error)
  }
}

const fetchUserRegistration = async (eventId) => {
  try {
    const res = await getMyEvents()
    const registrations = res.data.data.events || []
    const myRegistration = registrations.find((reg) => reg.event?.id === eventId)

    if (myRegistration) {
      userRegistration.value = myRegistration
    }
  } catch (error) {
    console.log(error)
  }
}

const attendanceSummary = computed(() => {
  return {
    hadir: participants.value.filter((item) => item.status === 'Hadir').length,
    izin: participants.value.filter((item) => item.status === 'Izin').length,
    tidakHadir: participants.value.filter((item) => item.status === 'Tidak Hadir').length,
  }
})

const myAttendanceStatus = computed(() => {
  if (!currentUser.value?.id) return 'Tidak Hadir'
  const myRecord = participants.value.find((p) => p.user_id === currentUser.value.id)
  return myRecord ? myRecord.status : 'Tidak Hadir'
})

onMounted(async () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    currentUser.value = JSON.parse(userData)
  }

  await fetchMeetingDetail()
  await fetchAttendances()
  await fetchMeetingNote()
})

const participants = ref([])
const fetchAttendances = async () => {
  try {
    const meetingId = route.params.id
    const res = await getAttendances(meetingId)

    participants.value = res.data.data.attendances.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      name: item.user?.name || '-',
      division: item.user?.division?.name || '-',
      status: attendanceStatusMap[item.status],
    }))
  } catch (error) {
    console.log(error)
  }
}

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

const startMeetingHandler = async () => {
  try {
    const meetingId = route.params.id
    await startMeeting(meetingId)
    await fetchMeetingDetail()
  } catch (error) {
    console.log(error)
  }
}

const finishMeetingHandler = async () => {
  try {
    const meetingId = route.params.id
    await finishMeeting(meetingId)
    await fetchMeetingDetail()
    router.push({
      path: `/user/notulen-rapat/${meetingId}`,
    })
  } catch (error) {
    console.log(error)
  }
}

const goToNotulen = () => {
  const meetingId = route.params.id
  router.push({
    path: `/user/notulen-rapat/${meetingId}`,
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
.rich-content {
  line-height: 1.6;
}
</style>
