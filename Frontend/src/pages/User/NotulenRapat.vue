<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs -->
    <div class="q-mb-md q-gutter-sm motion-card">
      <q-breadcrumbs class="text-brown">
        <template #separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el label="Notulen" icon="description" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <!-- ERROR STATE -->
    <div v-if="hasError" class="column items-center justify-center q-pa-xl text-center bg-white rounded-card shadow-1 q-my-md" style="min-height: 50vh;">
      <q-icon name="gpp_bad" size="80px" color="negative" class="q-mb-md" />
      <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">Akses Ditolak</div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg" style="max-width: 500px;">
        {{ errorMessage || 'Anda tidak memiliki akses ke notulen rapat ini.' }}
      </div>
      <q-btn color="indigo-9" label="Kembali ke Acara Saya" no-caps rounded @click="router.push('/user/acara-saya')" />
    </div>

    <div v-else-if="meeting">
      <!-- HEADER -->
      <div class="row items-center justify-between q-mb-lg motion-card">
        <div>
          <div class="text-h5 text-weight-bold">Notulen Rapat</div>

          <div class="text-grey-7">Dokumentasi hasil rapat dan tindak lanjut.</div>
        </div>

        <div class="q-gutter-sm">
          <q-btn
            color="indigo-9"
            icon="download"
            label="Ekspor PDF"
            rounded
            no-caps
            class="motion-btn"
            @click="exportPdf"
          />
        </div>
      </div>

      <!-- INFO RAPAT -->
      <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <div class="text-caption text-grey-7">Nama Rapat</div>

            <div class="text-subtitle1 text-weight-bold">
              {{ meeting?.title || '-' }}
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Event</div>

            <div class="text-weight-medium">
              {{ meeting?.event || '-' }}
            </div>
          </div>

          <div class="col-12 col-md-2">
            <div class="text-caption text-grey-7">Jenis</div>

            <q-badge
              size="12px"
              class="q-py-xs q-px-md"
              :color="meeting?.type === 'Umum' ? 'indigo-9' : 'orange'"
              rounded
            >
              {{ meeting?.type || '-' }}
            </q-badge>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Tanggal</div>

            <div class="text-weight-medium">
              {{ meeting?.date || '-' }}
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-lg q-mt-md">
          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Status</div>

            <q-badge
              size="12px"
              class="q-py-xs q-px-md"
              :color="statusColor(meeting?.status)"
              rounded
            >
              {{ meeting?.status || '-' }}
            </q-badge>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Mulai Nyata</div>

            <div class="text-weight-medium">
              {{ meeting?.startedAt || '-' }}
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Selesai</div>

            <div class="text-weight-medium">
              {{ meeting?.endedAt || '-' }}
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="text-caption text-grey-7">Durasi</div>

            <div class="text-weight-medium">
              {{ durationText }}
            </div>
          </div>
        </div>
      </q-card>

      <!-- READ ONLY -->
      <q-banner
        v-if="meeting?.status === 'Selesai' && !canManageMinutes"
        rounded
        class="bg-orange-1 text-orange q-mb-lg"
      >
        Anda hanya memiliki akses lihat untuk notulen rapat ini.
      </q-banner>

      <!-- BELUM SELESAI -->
      <q-banner
        v-if="meeting?.status !== 'Selesai'"
        rounded
        class="bg-orange-1 text-orange q-mb-lg motion-card"
      >
        Rapat belum selesai. Notulen dapat diisi setelah rapat ditandai selesai.
      </q-banner>

      <!-- SUDAH SELESAI -->
      <q-banner
        v-if="meeting?.status === 'Selesai' && !minutes && canManageMinutes"
        rounded
        class="bg-green-1 text-positive q-mb-lg motion-card"
      >
        Rapat selesai. Silakan isi notulen sekarang.
      </q-banner>

      <!-- FORM -->
      <q-card flat bordered class="rounded-card motion-card">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-subtitle1 text-weight-bold">Isi Notulen</div>

            <div class="text-caption text-grey-7">Ringkasan hasil rapat dan tindak lanjut.</div>
          </div>

          <q-btn
            v-if="canManageMinutes"
            flat
            color="indigo-9"
            :icon="isEdit ? 'close' : 'edit'"
            :label="isEdit ? 'Batal Mengubah' : 'Mengubah'"
            no-caps
            class="motion-btn"
            @click="toggleEdit"
          />
        </q-card-section>

        <q-separator />

        <!-- EDIT -->
        <q-card-section v-if="isEdit && canManageMinutes">
          <RichTextEditor v-model="minutes" placeholder="Tulis notulen rapat..." class="q-mb-md" />

          <div class="text-right q-mt-md">
            <q-btn
              color="indigo-9"
              icon="save"
              label="Simpan Notulen"
              rounded
              no-caps
              class="motion-btn"
              @click="showConfirmDialog"
            />
          </div>
        </q-card-section>

        <!-- VIEW -->
        <q-card-section v-else>
          <!-- VIEW NORMAL -->
          <div v-if="minutes" class="text-grey-8 rich-content" v-html="minutes" />

          <div v-else-if="meeting?.status === 'Selesai'" class="text-grey-6">
            Belum ada notulen rapat.
          </div>

          <div v-else class="text-grey-6">Menunggu rapat selesai.</div>

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

            <div class="pdf-rich-content" v-html="minutes"></div>
            <div class="pdf-footer-space" />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- CONFIRM DIALOG -->
    <ConfirmDialog
      v-model="showConfirm"
      type="info"
      title="Simpan Notulen"
      :message="`Apakah Anda yakin ingin menyimpan notulen rapat <strong>${meeting?.title || ''}</strong>?`"
      confirm-label="Ya, Simpan"
      cancel-label="Batal"
      :loading="saving"
      @confirm="handleConfirmSave"
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
import { animate, stagger } from 'motion'
import RichTextEditor from 'src/components/RichTextEditor.vue'
import { useRoute, useRouter } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import FooterComponent from 'src/components/FooterComponent.vue'
import { getMeetingById } from 'src/services/meeting.api'
import { getMeetingNotes, createMeetingNote, updateMeetingNote } from 'src/services/meeting-note.api'
import { getMyEvents } from 'src/services/event.api'
import StatusDialog from 'src/components/StatusDialog.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const userRegistration = ref(null)

const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const hasError = ref(false)
const errorMessage = ref('')

const isEdit = ref(false)
const pdfContent = ref(null)
const meeting = ref(null)
const noteId = ref(null)
const minutes = ref('')
const showConfirm = ref(false)
const saving = ref(false)

const isCoordinator = computed(() => {
  return userRegistration.value?.position?.toLowerCase() === 'koordinator'
})

const canManageMinutes = computed(() => {
  if (meeting.value?.status !== 'Selesai') {
    return false
  }

  // Hanya koordinator yang bisa mengedit notulen rapat divisinya
  if (isCoordinator.value && meeting.value?.meeting_type === 2) {
    return true
  }

  return false
})

const fetchUserRegistration = async (eventId) => {
  try {
    const res = await getMyEvents()
    const registrations = res.data.data.events || []
    const myRegistration = registrations.find(reg => reg.event?.id === eventId)
    
    if (myRegistration) {
      userRegistration.value = myRegistration
    }
  } catch (error) {
    console.log(error)
  }
}

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

const mapStatusLabel = (status) => {
  switch (status) {
    case 'Scheduled': return 'Akan Datang'
    case 'Ongoing': return 'Berlangsung'
    case 'Completed': return 'Selesai'
    default: return status
  }
}

const formatDateTime = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const fetchMeeting = async () => {
  try {
    const meetingId = route.params.id
    const res = await getMeetingById(meetingId)
    const data = res.data.data

    meeting.value = {
      id: data.id,
      title: data.title,
      event: data.event?.title || '-',
      type: data.meeting_type_name || '-',
      meeting_type: data.meeting_type,
      division_id: data.division_id,
      date: formatDateTime(data.schedule_date),
      status: mapStatusLabel(data.status_name),
      rawStartedAt: data.started_at,
      rawEndedAt: data.ended_at,
      startedAt: formatDateTime(data.started_at),
      endedAt: formatDateTime(data.ended_at),
    }

    if (data.event?.id) {
      await fetchUserRegistration(data.event.id)
    }
  } catch (error) {
    console.error(error)
    const errorMsg = error.response?.data?.message || 'Anda tidak memiliki akses ke notulen rapat ini.'
    hasError.value = true
    errorMessage.value = errorMsg
    dialogType.value = 'error'
    dialogTitle.value = 'Akses Ditolak'
    dialogMessage.value = errorMsg
    showDialog.value = true
  }
}

const fetchMeetingNote = async () => {
  try {
    const meetingId = route.params.id
    const res = await getMeetingNotes({ meeting_id: meetingId })
    const note = res.data.data.notes?.[0]

    if (note) {
      noteId.value = note.id
      minutes.value = note.content || ''
    }
  } catch (error) {
    console.log(error)
  }
}

const showConfirmDialog = () => {
  showConfirm.value = true
}

const handleConfirmSave = async () => {
  try {
    saving.value = true
    if (noteId.value) {
      await updateMeetingNote(noteId.value, { content: minutes.value })
    } else {
      const res = await createMeetingNote({ meeting_id: meeting.value.id, content: minutes.value })
      noteId.value = res.data.data.meetingNote.id
    }
    showConfirm.value = false
    isEdit.value = false

    dialogType.value = 'success'
    dialogTitle.value = 'Berhasil Disimpan'
    dialogMessage.value = 'Notulen rapat berhasil disimpan.'
    showDialog.value = true

    await fetchMeetingNote()
  } catch (error) {
    console.log(error)
    showConfirm.value = false

    const msg = error.response?.data?.message || 'Gagal menyimpan notulen. Silakan coba lagi.'
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal Menyimpan'
    dialogMessage.value = msg
    showDialog.value = true
  } finally {
    saving.value = false
  }
}

const toggleEdit = () => {
  if (!canManageMinutes.value) return
  isEdit.value = !isEdit.value
}

const durationText = computed(() => {
  const startedAt = meeting.value?.rawStartedAt
  const endedAt = meeting.value?.rawEndedAt

  if (!startedAt || !endedAt) return '-'

  const start = new Date(startedAt)
  const end = new Date(endedAt)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-'

  const diffMs = end - start
  if (diffMs < 0) return '-'

  const totalMinutes = Math.floor(diffMs / 1000 / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}j ${minutes}m`
})

const statusColor = (status) => {
  if (status === 'Berlangsung') return 'orange'
  if (status === 'Selesai') return 'positive'
  if (status === 'Akan Datang') return 'blue'
  return 'grey'
}

onMounted(async () => {
  await fetchMeeting()
  if (meeting.value) {
    await fetchMeetingNote()
  }
  await nextTick()

  animate(
    '.motion-card',
    { opacity: [0, 1], y: [12, 0] },
    { delay: stagger(0.05), duration: 0.35, easing: 'ease-out' }
  )

  animate(
    '.motion-btn',
    { opacity: [0, 1], scale: [0.96, 1] },
    { delay: 0.15, duration: 0.25 }
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all 0.2s ease;
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
