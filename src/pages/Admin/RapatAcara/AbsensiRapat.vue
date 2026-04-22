<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs-->
    <div class="q-mb-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el label="Kelola Rapat" icon="people" class="text-grey-9" />
        <q-breadcrumbs-el label="Absensi" icon="people" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>
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
        label="Cari peserta..."
        style="max-width: 500px"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- INFO RAPAT -->
    <q-card v-if="meeting" flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
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
    <q-card v-if="meeting && isGeneralMeeting" flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
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

          <q-btn color="indigo-9" icon="download" label="Export" rounded no-caps class="motion-btn" />
        </div>
      </div>
    </q-card>

    <!-- VIEW ONLY -->
    <q-banner v-if="meeting && !isGeneralMeeting" rounded class="bg-orange-1 text-orange q-mb-lg">
      Absensi rapat divisi hanya dapat diisi oleh Koordinator Divisi. Admin hanya dapat melihat data
      kehadiran.
    </q-banner>

    <q-table
      flat
      bordered
      row-key="id"
      :rows="filteredParticipants"
      :columns="columns"
      class="rounded-card motion-table"
    >
      <!-- HADIR -->
      <template #body-cell-hadir="props">
        <q-td :props="props" align="center">
          <q-radio v-model="props.row.status" val="Hadir" color="positive" />
        </q-td>
      </template>

      <!-- IZIN -->
      <template #body-cell-izin="props">
        <q-td :props="props" align="center">
          <q-radio v-model="props.row.status" val="Izin" color="warning" />
        </q-td>
      </template>

      <!-- ABSEN -->
      <template #body-cell-absen="props">
        <q-td :props="props" align="center">
          <q-radio v-model="props.row.status" val="Tidak Hadir" color="negative" />
        </q-td>
      </template>
    </q-table>
    <!-- SAVE -->
    <div v-if="meeting && isGeneralMeeting" class="text-right q-mt-lg">
      <q-btn color="indigo-9" icon="save" label="Simpan Absensi" rounded no-caps class="motion-btn" @click="opeenSaveDialog()" />
    </div>
     <ConfirmDialog
      v-model="showSaveDialog"
      type="success"
      title="Simpan Absensi"
      message="Apakah Anda yakin ingin menyimpan absensi ini?"
      confirm-label="Ya, Simpan"
      cancel-label="Batal"
      @confirm="confirmApprove"
    />
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { animate, stagger } from 'motion'
import FooterComponent from 'src/components/FooterComponent.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'

const search = ref('')
const selectedMeetingId = ref(1)
const showSaveDialog = ref(false)

const opeenSaveDialog = () => {
  showSaveDialog.value = true
}
const meetings = ref([
  {
    id: 1,
    event: 'HMTI Fair',
    title: 'Rapat Opening',
    type: 'Umum',
    date: '18 Apr 2026',
    status: 'Berlangsung',
  },
  {
    id: 2,
    event: 'HMTI Fair',
    title: 'Rapat Divisi Acara',
    type: 'Divisi',
    date: '19 Apr 2026',
    status: 'Akan Datang',
  },
])

const participants = ref([
  {
    id: 1,
    meetingId: 1,
    name: 'Andi Saputra',
    division: 'Acara',
    status: 'Hadir',
  },
  {
    id: 2,
    meetingId: 1,
    name: 'Budi Pratama',
    division: 'Pubdok',
    status: 'Tidak Hadir',
  },
])

const columns = [
  { name: 'name', label: 'Nama', field: 'name', align: 'left' },
  { name: 'division', label: 'Divisi', field: 'division', align: 'left' },
  { name: 'hadir', label: 'Hadir', align: 'center' },
  { name: 'izin', label: 'Izin', align: 'center' },
  { name: 'absen', label: 'Absen', align: 'center' },
]

const meeting = computed(() => {
  return meetings.value.find(
    (item) => item.id === selectedMeetingId.value
  )
})

const isGeneralMeeting = computed(() => {
  return meeting.value?.type === 'Umum'
})

const filteredParticipants = computed(() => {
  return participants.value.filter((item) => {
    const sameMeeting =
      item.meetingId === selectedMeetingId.value

    const matchSearch =
      item.name.toLowerCase().includes(
        search.value.toLowerCase()
      )

    return sameMeeting && matchSearch
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

/* MOTION ONE */
onMounted(async () => {
  await nextTick()

  runEnterAnimation()
  bindHoverAnimation()
})

const runEnterAnimation = () => {
  const cards =
    document.querySelectorAll('.motion-card')

  if (cards.length) {
    animate(
      cards,
      {
        opacity: [0, 1],
        y: [12, 0],
      },
      {
        delay: stagger(0.05),
        duration: 0.35,
        easing: 'ease-out',
      }
    )
  }

  const table =
    document.querySelector('.motion-table')

  if (table) {
    animate(
      table,
      {
        opacity: [0, 1],
        y: [10, 0],
      },
      {
        delay: 0.18,
        duration: 0.35,
        easing: 'ease-out',
      }
    )
  }
}

const bindHoverAnimation = () => {
  const buttons =
    document.querySelectorAll('.motion-btn')

  buttons.forEach((btn) => {
    btn.addEventListener(
      'mouseenter',
      () => {
        animate(
          btn,
          {
            scale: 1.04,
            y: -1,
          },
          {
            duration: 0.14,
          }
        )
      }
    )

    btn.addEventListener(
      'mouseleave',
      () => {
        animate(
          btn,
          {
            scale: 1,
            y: 0,
          },
          {
            duration: 0.14,
          }
        )
      }
    )
  })

  const rows = document.querySelectorAll(
    '.q-table tbody tr'
  )

  rows.forEach((row) => {
    row.addEventListener(
      'mouseenter',
      () => {
        animate(
          row,
          {
            backgroundColor:
              'rgba(99,102,241,0.03)',
          },
          {
            duration: 0.18,
          }
        )
      }
    )

    row.addEventListener(
      'mouseleave',
      () => {
        animate(
          row,
          {
            backgroundColor:
              'rgba(255,255,255,1)',
          },
          {
            duration: 0.18,
          }
        )
      }
    )
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
</style>

