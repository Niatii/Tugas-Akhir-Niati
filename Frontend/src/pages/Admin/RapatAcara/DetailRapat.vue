<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs-->
    <div class="q-mb-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el
          label="Kelola Rapat"
          icon="people"
          class="text-grey-9"
          to="/admin/rapat"
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
        <!-- Jika Akan Datang -->
        <q-btn
          v-if="meeting.status === 'Akan Datang' && meeting.type !== 'Divisi'"
          color="indigo-9"
          icon="play_arrow"
          label="Mulai Rapat"
          rounded
          no-caps
          @click="startMeetingHandler"
        />

        <!-- Jika Berlangsung -->
        <q-btn
          v-if="meeting.status === 'Berlangsung' && meeting.type !== 'Divisi'"
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
          <div class="row q-col-gutter-md q-mb-md">
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

                <div class="text-h6 text-weight-bold text-orange">{{ attendanceSummary.izin }}</div>
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
        <!-- MINUTES -->
        <q-tab-panel name="minutes">
          <div v-if="loadingNote" class="text-grey-6">Memuat notulen...</div>

          <div v-else-if="meeting.status !== 'Selesai'" class="text-grey-6">
            Notulen tersedia setelah rapat selesai.
          </div>

          <div v-else-if="!meetingNote" class="text-grey-6">Notulen belum dibuat.</div>

          <div v-else>
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle2 text-weight-bold">Hasil Rapat</div>
              <q-btn
                v-if="meeting.meeting_type === 2"
                color="indigo-9"
                icon="download"
                label="Unduh"
                rounded
                no-caps
                @click="exportPdf"
              />
            </div>

            <div class="text-grey-8 rich-content" v-html="meetingNote.content" />

            <!-- HIDDEN PDF CONTENT -->
            <div ref="pdfContent" class="pdf-content">
              <div class="pdf-header">
                <div class="pdf-title">Notulen Rapat</div>

                <div class="pdf-subtitle">
                  {{ meeting?.title || '-' }}
                </div>

                <div class="pdf-subtitle">
                  {{ meeting?.date || '-' }}
                </div>
              </div>

              <div class="pdf-rich-content" v-html="meetingNote.content"></div>
              <div class="pdf-footer-space" />
            </div>
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
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import FooterComponent from 'src/components/FooterComponent.vue'
import { getMeetingById, startMeeting, finishMeeting } from 'src/services/meeting.api'
import { getAttendances } from 'src/services/attendance.api'
import { getMeetingNotes } from 'src/services/meeting-note.api'
const meetingNote = ref(null)

const loadingNote = ref(false)
const router = useRouter()
const attendanceStatusMap = {
  0: 'Tidak Hadir',
  1: 'Hadir',
  2: 'Izin',
}
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

      title: data.title || '-',

      event: data.event?.title || '-',

      type: data.meeting_type_name || '-',

      meeting_type: data.meeting_type,

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
const attendanceSummary = computed(() => {
  return {
    hadir: participants.value.filter((item) => item.status === 'Hadir').length,

    izin: participants.value.filter((item) => item.status === 'Izin').length,

    tidakHadir: participants.value.filter((item) => item.status === 'Tidak Hadir').length,
  }
})
onMounted(async () => {
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

// const getCurrentTime = () => {
//   const now = new Date()

//   const hour = String(now.getHours()).padStart(2, '0')

//   const minute = String(now.getMinutes()).padStart(2, '0')

//   return `${hour}:${minute}`
// }

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
      path: `/admin/notulen-rapat/${meetingId}`,
    })
  } catch (error) {
    console.log(error)
  }
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
const pdfContent = ref(null)
const exportPdf = async () => {
  const element = pdfContent.value
  if (!element) return

  const canvas = await html2canvas(element, { scale: 2, useCORS: true })
  const pdf = new jsPDF('p', 'mm', 'a4')

  const pageWidth = 210
  const pageHeight = 297
  const margin = 30
  const contentWidth = pageWidth - margin * 2
  const contentHeight = pageHeight - margin * 2

  const pageHeightPx = Math.floor(canvas.width * (contentHeight / contentWidth))

  let remainingHeightPx = canvas.height
  let currentYPx = 0
  let isFirstPage = true

  while (remainingHeightPx > 0) {
    const sliceHeightPx = Math.min(pageHeightPx, remainingHeightPx)
    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = sliceHeightPx
    const sliceCtx = sliceCanvas.getContext('2d')

    sliceCtx.fillStyle = '#ffffff'
    sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
    sliceCtx.drawImage(
      canvas,
      0, currentYPx, canvas.width, sliceHeightPx,
      0, 0, sliceCanvas.width, sliceHeightPx,
    )

    const sliceImgData = sliceCanvas.toDataURL('image/png')
    const sliceHeightMm = sliceHeightPx * (contentWidth / canvas.width)

    if (!isFirstPage) pdf.addPage()
    isFirstPage = false

    pdf.addImage(sliceImgData, 'PNG', margin, margin, contentWidth, sliceHeightMm)
    currentYPx += pageHeightPx
    remainingHeightPx -= pageHeightPx
  }
  pdf.save('notulen.pdf')
}
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.pdf-content {
  position: fixed;
  left: -99999px;
  top: 0;
  width: 567px;
  background: #ffffff;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  color: #000000;
}

.pdf-header {
  margin-bottom: 40px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 20px;
}

.pdf-title {
  font-size: 18pt;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.pdf-subtitle {
  font-size: 12pt;
  text-align: center;
  margin-bottom: 6px;
  color: #000000;
}

.pdf-rich-content {
  font-size: 12pt;
  line-height: 1.8;
  text-align: justify;
  color: #000000;
}

.pdf-rich-content :deep(p) {
  margin-bottom: 18px;
}

.pdf-rich-content :deep(h1),
.pdf-rich-content :deep(h2),
.pdf-rich-content :deep(h3) {
  font-size: 14pt;
  font-weight: 700;
  margin: 24px 0 16px;
  color: #000000;
}

.pdf-rich-content :deep(ul),
.pdf-rich-content :deep(ol) {
  padding-left: 24px;
  margin: 16px 0 20px;
}

.pdf-rich-content :deep(li) {
  margin-bottom: 8px;
}

.pdf-rich-content :deep(strong) {
  font-weight: 700;
  color: #111827;
}

.pdf-rich-content :deep(em) {
  font-style: italic;
}

.pdf-rich-content :deep(img) {
  max-width: 100%;
  margin: 20px 0;
  border-radius: 8px;
}

.pdf-footer-space {
  height: 120px;
}
</style>
