<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs -->
    <div class="q-mb-md q-gutter-sm motion-card">
      <q-breadcrumbs class="text-brown">
        <template #separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>

        <q-breadcrumbs-el label="Kelola Rapat" icon="groups" class="text-grey-9" />

        <q-breadcrumbs-el label="Notulen" icon="description" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

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
          label="Export PDF"
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
      v-if="meeting?.status === 'Selesai' && !minutes"
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
            @click="saveMinutes"
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

    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

import { animate, stagger } from 'motion'
import RichTextEditor from 'src/components/RichTextEditor.vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import FooterComponent from 'src/components/FooterComponent.vue'

import { getMeetingById } from 'src/services/meeting.api'

import {
  getMeetingNotes,
  createMeetingNote,
  updateMeetingNote,
} from 'src/services/meeting-note.api'

const route = useRoute()

const profile = JSON.parse(localStorage.getItem('user'))

const userDivisionId = ref(profile?.division_id || null)

const isEdit = ref(false)
const pdfContent = ref(null)
const meeting = ref(null)

const noteId = ref(null)

const minutes = ref('')
const exportPdf = async () => {
  const element = pdfContent.value
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  })

  /**
   * PDF A4
   */
  const pdf = new jsPDF('p', 'mm', 'a4')

  /**
   * Ukuran halaman A4
   */
  const pageWidth = 210
  const pageHeight = 297

  /**
   * Margin 3 cm = 30 mm
   */
  const margin = 30

  /**
   * Area konten cetak per halaman
   */
  const contentWidth = pageWidth - margin * 2
  const contentHeight = pageHeight - margin * 2

  /**
   * Konversi tinggi area konten ke dalam piksel canvas
   * Karena lebar canvas (canvas.width) dipetakan ke contentWidth (150 mm),
   * maka tinggi konten yang pas untuk satu halaman dalam piksel adalah:
   */
  const pageHeightPx = Math.floor(canvas.width * (contentHeight / contentWidth))

  let remainingHeightPx = canvas.height
  let currentYPx = 0
  let isFirstPage = true

  while (remainingHeightPx > 0) {
    const sliceHeightPx = Math.min(pageHeightPx, remainingHeightPx)

    // Buat canvas sementara untuk memotong bagian halaman ini
    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = sliceHeightPx
    const sliceCtx = sliceCanvas.getContext('2d')

    sliceCtx.fillStyle = '#ffffff'
    sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)

    sliceCtx.drawImage(
      canvas,
      0,
      currentYPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      sliceCanvas.width,
      sliceHeightPx,
    )

    const sliceImgData = sliceCanvas.toDataURL('image/png')
    const sliceHeightMm = sliceHeightPx * (contentWidth / canvas.width)

    if (!isFirstPage) {
      pdf.addPage()
    }
    isFirstPage = false

    // Tambahkan potongan gambar ke halaman PDF dengan margin 3cm setiap sisi
    pdf.addImage(
      sliceImgData,
      'PNG',
      margin,
      margin,
      contentWidth,
      sliceHeightMm,
    )

    currentYPx += pageHeightPx
    remainingHeightPx -= pageHeightPx
  }

  pdf.save('notulen.pdf')
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
      return status
  }
}

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

const formatTime = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
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

      /**
       * raw datetime
       * untuk hitung durasi
       */
      rawStartedAt: data.started_at,

      rawEndedAt: data.ended_at,

      /**
       * formatted display
       */
      startedAt: formatTime(data.started_at),

      endedAt: formatTime(data.ended_at),
    }
  } catch (error) {
    console.log(error)
  }
}

const fetchMeetingNote = async () => {
  try {
    const meetingId = route.params.id

    const res = await getMeetingNotes({
      meeting_id: meetingId,
    })

    const note = res.data.data.notes?.[0]

    if (note) {
      noteId.value = note.id

      minutes.value = note.content || ''
    }
  } catch (error) {
    console.log(error)
  }
}

const canManageMinutes = computed(() => {
  /**
   * Meeting harus selesai
   */
  if (meeting.value?.status !== 'Selesai') {
    return false
  }

  /**
   * Admin organisasi
   * hanya manage rapat umum
   */
  if (profile?.role === 0) {
    return meeting.value?.meeting_type === 1
  }

  /**
   * Coordinator
   * hanya manage
   * divisinya
   */
  if (profile?.role === 1) {
    return meeting.value?.meeting_type === 2 && meeting.value?.division_id === userDivisionId.value
  }

  return false
})

const saveMinutes = async () => {
  try {
    /**
     * update
     */
    if (noteId.value) {
      await updateMeetingNote(noteId.value, {
        content: minutes.value,
      })
    } else {
      /**
       * create
       */
      const res = await createMeetingNote({
        meeting_id: meeting.value.id,

        content: minutes.value,
      })

      noteId.value = res.data.data.meetingNote.id
    }

    isEdit.value = false

    await fetchMeetingNote()
  } catch (error) {
    console.log(error)
  }
}

const toggleEdit = () => {
  if (!canManageMinutes.value) {
    return
  }

  isEdit.value = !isEdit.value
}

const durationText = computed(() => {
  const startedAt = meeting.value?.rawStartedAt

  const endedAt = meeting.value?.rawEndedAt

  if (!startedAt || !endedAt) {
    return '-'
  }

  const start = new Date(startedAt)

  const end = new Date(endedAt)

  /**
   * validasi invalid date
   */
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '-'
  }

  const diffMs = end - start

  /**
   * kalau negatif
   */
  if (diffMs < 0) {
    return '-'
  }

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

/* Motion One */
onMounted(async () => {
  await fetchMeeting()

  await fetchMeetingNote()

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
    '.motion-btn',
    {
      opacity: [0, 1],
      scale: [0.96, 1],
    },
    {
      delay: 0.15,
      duration: 0.25,
    },
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

  /**
   * Lebar area cetak untuk margin 3cm di kertas A4 (150mm setara dengan 567px)
   */
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

/* Paragraph */
.pdf-rich-content :deep(p) {
  margin-bottom: 18px;
}

/* Heading */
.pdf-rich-content :deep(h1) {
  font-size: 24px;
  font-weight: 700;
  margin: 32px 0 18px;
  color: #111827;
}

.pdf-rich-content :deep(h2) {
  font-size: 20px;
  font-weight: 700;
  margin: 28px 0 16px;
  color: #111827;
}

.pdf-rich-content :deep(h3) {
  font-size: 17px;
  font-weight: 600;
  margin: 24px 0 14px;
  color: #111827;
}
.pdf-rich-content :deep(h1),
.pdf-rich-content :deep(h2),
.pdf-rich-content :deep(h3) {
  font-size: 14pt;
  font-weight: 700;
  margin: 24px 0 16px;
  color: #000000;
}

/* List */
.pdf-rich-content :deep(ul),
.pdf-rich-content :deep(ol) {
  padding-left: 24px;
  margin: 16px 0 20px;
}

.pdf-rich-content :deep(li) {
  margin-bottom: 8px;
}

/* Bold */
.pdf-rich-content :deep(strong) {
  font-weight: 700;
  color: #111827;
}

/* Italic */
.pdf-rich-content :deep(em) {
  font-style: italic;
}

/* Image */
.pdf-rich-content :deep(img) {
  max-width: 100%;
  margin: 20px 0;
  border-radius: 8px;
}
.pdf-footer-space {
  height: 120px;
}
</style>
