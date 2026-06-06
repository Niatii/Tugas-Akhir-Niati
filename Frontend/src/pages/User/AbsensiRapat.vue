<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs-->
    <div class="q-mb-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el label="Absensi" icon="checklist" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>
    <!-- ERROR STATE -->
    <div v-if="hasError" class="column items-center justify-center q-pa-xl text-center bg-white rounded-card shadow-1 q-my-md" style="min-height: 50vh;">
      <q-icon name="gpp_bad" size="80px" color="negative" class="q-mb-md" />
      <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">Akses Ditolak</div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg" style="max-width: 500px;">
        {{ errorMessage || 'Anda tidak memiliki akses ke absensi rapat ini.' }}
      </div>
      <q-btn color="indigo-9" label="Kembali ke Acara Saya" no-caps rounded @click="router.push('/user/acara-saya')" />
    </div>

    <div v-else-if="meeting">
      <!-- HEADER -->
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h5 text-weight-bold">Absensi Rapat</div>

          <div class="text-grey-7">Kelola kehadiran peserta berdasarkan rapat yang dipilih.</div>
        </div>
      </div>

      <!-- SEARCH -->
      <div class="q-my-md">
        <q-input
          v-model="search"
          outlined
          dense
          rounded
          clearable
          label="Cari peserta..."
          style="max-width: 500px"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- INFO RAPAT -->
      <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <div class="text-caption text-grey-7">Nama Rapat</div>

            <div class="text-subtitle1 text-weight-bold">
              {{ meeting.title }}
            </div>
          </div>

          <div class="col-12 col-md-3">
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

          <div class="col-12 col-md-2">
            <div class="text-caption text-grey-7">Status</div>

            <q-badge size="12px" class="q-px-md q-py-xs" :color="statusColor(meeting.status)" rounded>
              {{ meeting.status }}
            </q-badge>
          </div>
        </div>
      </q-card>

      <!-- ACTION -->
      <q-card
        v-if="canManageAttendance"
        flat
        bordered
        class="rounded-card q-pa-md q-mb-lg motion-card"
      >
        <div class="row items-center justify-between">
          <div class="text-subtitle2 text-weight-bold">Kelola Kehadiran</div>

          <div class="q-gutter-sm">
            <q-btn
              color="positive"
              icon="done_all"
              label="Hadir Semua"
              rounded
              no-caps
              class="motion-btn"
              @click="markAllPresent"
            />

            <q-btn
              color="indigo-9"
              icon="download"
              label="Ekspor"
              rounded
              no-caps
              class="motion-btn"
              @click="handleExportAttendance"
            />
          </div>
        </div>
      </q-card>

      <!-- VIEW ONLY -->
      <q-banner
        v-if="!canManageAttendance"
        rounded
        class="bg-orange-1 text-orange q-mb-lg"
      >
        Anda hanya memiliki akses lihat untuk absensi rapat ini.
      </q-banner>

      <q-table
        flat
        bordered
        :loading="loading"
        row-key="id"
        :rows="filteredParticipants"
        :columns="columns"
        class="rounded-card motion-table"
      >
        <!-- HADIR -->
        <template #body-cell-hadir="props">
          <q-td :props="props" align="center">
            <q-radio
              v-model="props.row.status"
              val="Hadir"
              :disable="!canManageAttendance"
              color="positive"
            />
          </q-td>
        </template>

        <!-- IZIN -->
        <template #body-cell-izin="props">
          <q-td :props="props" align="center">
            <q-radio
              v-model="props.row.status"
              val="Izin"
              :disable="!canManageAttendance"
              color="orange"
            />
          </q-td>
        </template>

        <!-- ABSEN -->
        <template #body-cell-absen="props">
          <q-td :props="props" align="center">
            <q-radio
              v-model="props.row.status"
              val="Tidak Hadir"
              :disable="!canManageAttendance"
              color="negative"
            />
          </q-td>
        </template>
      </q-table>
      
      <!-- SAVE -->
      <div v-if="canManageAttendance" class="text-right q-mt-lg">
        <q-btn
          color="indigo-9"
          icon="save"
          label="Simpan Absensi"
          rounded
          no-caps
          class="motion-btn"
          @click="opeenSaveDialog()"
        />
      </div>

      <ConfirmDialog
        v-model="showSaveDialog"
        type="success"
        title="Simpan Absensi"
        message="Apakah Anda yakin ingin menyimpan absensi ini?"
        confirm-label="Ya, Simpan"
        cancel-label="Batal"
        @confirm="saveAttendance"
      />

      <!-- SAVING OVERLAY -->
      <q-dialog v-model="saving" persistent>
        <q-card flat class="saving-overlay-card">
          <q-card-section class="flex column items-center q-pa-xl q-gutter-md">
            <q-spinner-oval color="indigo-9" size="52px" />
            <div class="text-subtitle1 text-weight-medium text-grey-8">Menyimpan absensi...</div>
            <div class="text-caption text-grey-6">Mohon tunggu sebentar</div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>

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
import FooterComponent from 'src/components/FooterComponent.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'
import { useRoute, useRouter } from 'vue-router'
import { getMeetingById } from 'src/services/meeting.api'
import { getAttendances, bulkUpdateAttendance, exportAttendance } from 'src/services/attendance.api'
import { getMyEvents } from 'src/services/event.api'

const search = ref('')
const route = useRoute()
const router = useRouter()
const userRegistration = ref(null)

const handleExportAttendance = async () => {
  try {
    const meetingId = route.params.id

    const response = await exportAttendance(meetingId)

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    const disposition = response.headers['content-disposition']

    let fileName = 'attendance.xlsx'

    if (disposition) {
      const match = disposition.match(/filename="?(.+)"?/)
      if (match?.[1]) {
        fileName = match[1]
      }
    }

    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Export failed:', error)
  }
}

const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const showSaveDialog = ref(false)
const loading = ref(false)

const canFillAttendance = computed(() => {
  return (
    meeting.value?.status === 'Berlangsung' ||
    meeting.value?.status === 'Selesai'
  )
})

const isCoordinator = computed(() => {
  return userRegistration.value?.position?.toLowerCase() === 'koordinator'
})

const canManageAttendance = computed(() => {
  if (!canFillAttendance.value) return false
  
  // Hanya koordinator yang bisa mengubah absensi divisi di halaman user
  if (isCoordinator.value && meeting.value?.meeting_type === 2) {
    return true
  }

  return false
})

const saving = ref(false)

const opeenSaveDialog = () => {
  showSaveDialog.value = true
}

const saveAttendance = async () => {
  // 1. Tutup modal konfirmasi segera
  showSaveDialog.value = false

  // 2. Tampilkan overlay loading
  saving.value = true

  try {
    // 3. Satu request bulk update
    const updates = participants.value.map((item) => ({
      id: item.id,
      status: attendanceStatusValue[item.status],
    }))

    await bulkUpdateAttendance(updates)

    // 4. Refresh data di background
    await fetchAttendances()

    // 5. Tampilkan sukses
    dialogType.value = 'success'
    dialogTitle.value = 'Berhasil'
    dialogMessage.value = 'Absensi berhasil disimpan'
    showDialog.value = true
  } catch (error) {
    console.error('Error saving attendance:', error)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value = 'Gagal menyimpan absensi. Coba lagi.'
    showDialog.value = true
  } finally {
    saving.value = false
  }
}

const participants = ref([])

const columns = [
  { name: 'name', label: 'Nama', field: 'name', align: 'left' },
  { name: 'division', label: 'Divisi', field: 'division', align: 'left' },
  { name: 'hadir', label: 'Hadir', align: 'center' },
  { name: 'izin', label: 'Izin', align: 'center' },
  { name: 'absen', label: 'Absen', align: 'center' },
]

const meeting = ref(null)

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
      return status
  }
}

const attendanceStatusMap = {
  0: 'Tidak Hadir',
  1: 'Hadir',
  2: 'Izin',
}

const attendanceStatusValue = {
  'Tidak Hadir': 0,
  Hadir: 1,
  Izin: 2,
}

const getMeetingTypeLabel = (meetingType) => {
  if (meetingType === 1 || meetingType === 'GENERAL') return 'Umum'
  if (meetingType === 2 || meetingType === 'DIVISION') return 'Divisi'
  return '-'
}

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

const fetchMeeting = async () => {
  try {
    const meetingId = route.params.id
    const res = await getMeetingById(meetingId)
    const data = res.data.data

    meeting.value = {
      id: data.id,
      title: data.title,
      type: getMeetingTypeLabel(data.meeting_type),
      meeting_type: data.meeting_type,
      division_id: data.division_id,
      date: formatDateTime(data.schedule_date),
      status: mapStatusLabel(data.status_name),
    }
    
    if (data.event?.id) {
      await fetchUserRegistration(data.event.id)
    }
  } catch (error) {
    console.error(error)
    const errorMsg = error.response?.data?.message || 'Anda tidak memiliki akses ke absensi rapat ini.'
    hasError.value = true
    errorMessage.value = errorMsg
    dialogType.value = 'error'
    dialogTitle.value = 'Akses Ditolak'
    dialogMessage.value = errorMsg
    showDialog.value = true
  }
}

const fetchAttendances = async () => {
  loading.value = true
  const meetingId = route.params.id
  const res = await getAttendances(meetingId)

  participants.value = res.data.data.attendances.map((item) => ({
    id: item.id,
    name: item.user?.name || '-',
    division: item.user?.division?.name || '-',
    status: attendanceStatusMap[item.status],
    rawStatus: item.status,
  }))
  loading.value = false
}

const filteredParticipants = computed(() => {
  const query = (search.value || '').toLowerCase()
  return participants.value.filter((item) => {
    return item.name.toLowerCase().includes(query)
  })
})

const markAllPresent = () => {
  filteredParticipants.value.forEach((item) => {
    item.status = 'Hadir'
  })
}

const statusColor = (status) => {
  if (status === 'Berlangsung') return 'orange'
  if (status === 'Selesai') return 'positive'
  if (status === 'Akan Datang') return 'blue'
  return 'grey'
}

onMounted(async () => {
  await fetchMeeting()
  if (meeting.value) {
    await fetchAttendances()
  }
  await nextTick()

  runEnterAnimation()
  bindHoverAnimation()
})

const runEnterAnimation = () => {
  const cards = document.querySelectorAll('.motion-card')
  if (cards.length) {
    animate(
      cards,
      { opacity: [0, 1], y: [12, 0] },
      { delay: stagger(0.05), duration: 0.35, easing: 'ease-out' },
    )
  }

  const table = document.querySelector('.motion-table')
  if (table) {
    animate(
      table,
      { opacity: [0, 1], y: [10, 0] },
      { delay: 0.18, duration: 0.35, easing: 'ease-out' },
    )
  }
}

const bindHoverAnimation = () => {
  const buttons = document.querySelectorAll('.motion-btn')
  buttons.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      animate(btn, { scale: 1.04, y: -1 }, { duration: 0.14 })
    })
    btn.addEventListener('mouseleave', () => {
      animate(btn, { scale: 1, y: 0 }, { duration: 0.14 })
    })
  })

  const rows = document.querySelectorAll('.q-table tbody tr')
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      animate(row, { backgroundColor: 'rgba(99,102,241,0.03)' }, { duration: 0.18 })
    })
    row.addEventListener('mouseleave', () => {
      animate(row, { backgroundColor: 'rgba(255,255,255,1)' }, { duration: 0.18 })
    })
  })
}
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all 0.2s ease;
}

.q-table tbody tr {
  transition: background-color 0.2s ease;
}

.saving-overlay-card {
  border-radius: 20px;
  min-width: 260px;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.18);
}
</style>
