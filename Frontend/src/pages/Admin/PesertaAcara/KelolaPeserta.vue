<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kelola Peserta</div>

        <div class="text-grey-7">Kelola seluruh peserta dari berbagai acara organisasi.</div>
      </div>
    </div>

    <q-card flat class="q-mb-lg rounded-card motion-card">
      <div class="row q-col-gutter-md">
        <!-- Pilih Acara -->
        <div class="col-12 col-md-4">
          <q-select
            outlined
            dense
            rounded
            v-model="selectedEvent"
            :options="eventOptions"
            label="Pilih Acara"
            emit-value
            map-options
            class="custom-field-search"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            outlined
            dense
            rounded
            v-model="selectedStatus"
            :options="statusOptions"
            label="Status"
            emit-value
            map-options
            class="custom-field-search"
          />
        </div>

        <div class="col-12 col-md-5">
          <q-input
            outlined
            dense
            rounded
            v-model="search"
            label="Cari peserta..."
            class="custom-field-search"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </q-card>

    <q-banner rounded class="bg-blue-1 text-blue-9 q-mb-md" v-if="selectedEvent !== 'all'">
      <div class="row items-center justify-between">
        <div>
          <div class="text-caption">Status: {{ selectedEventStatus }}</div>
        </div>

        <q-chip
          dense
          :color="eventStatusColor(selectedEventStatus)"
          text-color="white"
          size="12px"
          class="q-px-md"
        >
          {{ selectedEventStatus }}
        </q-chip>
      </div>
    </q-banner>

    <div class="row q-col-gutter-md q-mb-lg motion-card">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="q-pa-md rounded-card" style="border-radius: 12px">
          <div class="text-caption text-grey-7">Total Peserta</div>
          <div class="text-h5 text-weight-bold">
            {{ filteredRows.length }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="q-pa-md rounded-card bg-orange-1" style="border-radius: 12px">
          <div class="text-caption text-grey-7">Menunggu</div>
          <div class="text-h5 text-weight-bold text-orange">
            {{ pendingCount }}
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="q-pa-md rounded-card bg-green-1" style="border-radius: 12px">
          <div class="text-caption text-grey-7">Disetujui</div>
          <div class="text-h5 text-weight-bold text-positive">
            {{ approvedCount }}
          </div>
        </q-card>
      </div>
    </div>

    <!-- TOOLBAR ACTION MASSAL -->
    <q-slide-transition>
      <div v-show="selected.length > 0" class="row items-center justify-between q-pa-sm q-mb-md">
        <div class="text-weight-medium text-indigo-9">{{ selected.length }} peserta dipilih</div>

        <div class="row q-gutter-sm">
          <q-btn
            color="positive"
            icon="check_circle"
            label="Approve"
            style="border-radius: 12px"
            no-caps
            :disable="!canBulkAction"
            @click="showApproveDialog = true"
          />

          <q-btn
            color="negative"
            icon="cancel"
            label="Reject"
            style="border-radius: 12px"
            no-caps
            :disable="!canBulkAction"
            @click="showRejectDialog = true"
          />
        </div>
      </div>
    </q-slide-transition>

    <div class="q-py-sm text-caption text-grey-6">
      Peserta yang bisa di setujui atau di tolak hanya peserta dengan status "Menunggu"
    </div>
    <!-- TABLE -->
    <q-table
      flat
      bordered
      row-key="id"
      :rows="filteredRows"
      :columns="columns"
      selection="multiple"
      v-model:selected="selected"
      separator="horizontal"
      class="rounded-card motion-table"
    >
      <!-- NAMA -->
      <template #body-cell-nama="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar size="40px" color="indigo-1" text-color="indigo-9" class="q-mr-sm">
              {{ props.row.nama.charAt(0) }}
            </q-avatar>

            <div>
              <div class="text-weight-medium">
                {{ props.row.nama }}
              </div>

              <div class="text-caption text-grey-7">
                {{ props.row.email }}
              </div>
            </div>
          </div>
        </q-td>
      </template>

      <!-- STATUS -->
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip
            dense
            size="12px"
            class="q-px-md"
            text-color="white"
            :color="statusColor(props.row.status)"
          >
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>

      <!-- SELECT CHECKBOX KHUSUS -->
      <template #body-selection="scope">
        <q-checkbox
          v-model="scope.selected"
          :disable="scope.row.status !== 'Menunggu'"
          color="indigo"
        />
      </template>
      <template #body-cell-aksi="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            dense
            icon="visibility"
            color="indigo-9"
            class="motion-btn"
            @click="goToDetail(props.row)"
          >
            <q-tooltip>Detail</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- DIALOG APPROVE DENGAN PILIH POSITION -->
    <q-dialog v-model="showApproveDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Approve Peserta</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="text-body2 q-mb-lg">
            Apakah Anda yakin ingin menyetujui {{ selected.length }} peserta?
          </div>

          <div>
            <div class="text-caption text-grey-7 q-mb-sm">Pilih Posisi Peserta</div>
            <q-select
              v-model="selectedPosition"
              :options="positionOptions"
              outlined
              dense
              emit-value
              map-options
              label="Posisi"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" v-close-popup />
          <q-btn flat label="Ya, Approve" color="positive" @click="confirmApprove" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <ConfirmDialog
      v-model="showRejectDialog"
      type="danger"
      title="Tolak Peserta"
      message="Apakah Anda yakin ingin menolak peserta ini?"
      confirm-label="Ya, Tolak"
      cancel-label="Batal"
      @confirm="confirmReject"
    />
    <FooterComponent />
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { animate, stagger } from 'motion'

import FooterComponent from 'src/components/FooterComponent.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import { getEvents } from 'src/services/event.api'
import { getEventRegistrations, updateEventRegistration } from 'src/services/event-member.api'

const router = useRouter()
const $q = useQuasar()

const selected = ref([])
const selectedPosition = ref('Anggota')

const positionOptions = [
  { label: 'Anggota', value: 'Anggota' },
  { label: 'Koordinator', value: 'Koordinator' },
]

const canBulkAction = computed(() => {
  return selected.value.length > 0 && selected.value.every((item) => item.status === 'Menunggu')
})

const fetchEvents = async () => {
  const res = await getEvents()

  events.value = res.data.data.events.filter((e) => e.status !== 0)

  eventOptions.value = [
    { label: 'Semua Acara', value: 'all' },
    ...events.value.map((e) => ({
      label: e.title,
      value: e.id,
    })),
  ]
}

const confirmApprove = async () => {
  const itemsToApprove = selected.value.filter((item) => item.status === 'Menunggu')

  if (!itemsToApprove.length) {
    showApproveDialog.value = false
    return
  }

  try {
    await Promise.all(
      itemsToApprove.map((item) =>
        updateEventRegistration(item.id, { status: 1, position: selectedPosition.value }),
      ),
    )

    itemsToApprove.forEach((item) => {
      item.status = 'Disetujui'
    })

    $q.notify({
      type: 'positive',
      message: 'Peserta berhasil disetujui.',
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Gagal menyetujui peserta. Silakan coba lagi.',
    })
  } finally {
    selected.value = []
    selectedPosition.value = 'Anggota'
    showApproveDialog.value = false
  }
}

const confirmReject = async () => {
  const itemsToReject = selected.value.filter((item) => item.status === 'Menunggu')

  if (!itemsToReject.length) {
    showRejectDialog.value = false
    return
  }

  try {
    await Promise.all(itemsToReject.map((item) => updateEventRegistration(item.id, { status: 2 })))

    itemsToReject.forEach((item) => {
      item.status = 'Ditolak'
    })

    $q.notify({
      type: 'positive',
      message: 'Peserta berhasil ditolak.',
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Gagal menolak peserta. Silakan coba lagi.',
    })
  } finally {
    selected.value = []
    showRejectDialog.value = false
  }
}

const goToDetail = (row) => {
  router.push(`/admin/detail-peserta/${row.id}`)
}

// Dialog state
const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
// const selectedRow = ref(null)

const search = ref('')
const selectedEvent = ref('all')
const selectedStatus = ref('all')

const selectedEventStatus = computed(() => {
  const event = events.value.find((e) => e.id === selectedEvent.value)
  return event?.status_name || ''
})

const eventStatusColor = (status) => {
  switch (status) {
    case 'Pendaftaran Dibuka':
      return 'blue'
    case 'Pendaftaran Ditutup':
      return 'deep-orange'
    case 'Sedang Berlangsung':
      return 'indigo'
    case 'Selesai':
      return 'green'
    default:
      return 'grey'
  }
}

// Dropdown options
const eventOptions = ref([])
const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Menunggu', value: 'Menunggu' },
  { label: 'Disetujui', value: 'Disetujui' },
  { label: 'Ditolak', value: 'Ditolak' },
]

const columns = [
  { name: 'nama', label: 'Peserta', field: 'nama', align: 'left' },
  { name: 'acara', label: 'Acara', field: 'acara', align: 'left' },
  { name: 'divisi', label: 'Divisi', field: 'divisi', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'aksi', label: 'Aksi', field: 'aksi', align: 'center' },
]

const rows = ref([])
const events = ref([])

const fetchMembers = async () => {
  try {
    const params = {}

    if (selectedEvent.value !== 'all') {
      params.event_id = selectedEvent.value
    }

    const res = await getEventRegistrations(params)

    const registrations = res.data.data.event_registrations || []

    rows.value = registrations.map((item) => ({
      id: item.id,

      nama: item.user?.name || '-',

      email: item.user?.email || '-',

      acara: item.event?.title || '-',

      event_id: item.event?.id,

      divisi: item.division?.name || '-',

      status: item.status === 0 ? 'Menunggu' : item.status === 1 ? 'Disetujui' : 'Ditolak',
    }))
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await fetchEvents()
  await fetchMembers()
})

watch(selectedEvent, () => {
  fetchMembers()
})

const filteredRows = computed(() =>
  rows.value.filter((item) => {
    const keyword = search.value.toLowerCase()

    const matchSearch =
      item.nama.toLowerCase().includes(keyword) || item.email.toLowerCase().includes(keyword)

    const matchEvent = selectedEvent.value === 'all' || item.event_id === selectedEvent.value

    const matchStatus = selectedStatus.value === 'all' || item.status === selectedStatus.value

    return matchSearch && matchEvent && matchStatus
  }),
)

const pendingCount = computed(
  () => filteredRows.value.filter((item) => item.status === 'Menunggu').length,
)

const approvedCount = computed(
  () => filteredRows.value.filter((item) => item.status === 'Disetujui').length,
)

// const openApproveDialog = (row) => {
//   selectedRow.value = row
//   showApproveDialog.value = true
// }

// const openRejectDialog = (row) => {
//   selectedRow.value = row
//   showRejectDialog.value = true
// }

// const confirmApprove = () => {
//   if (!selectedRow.value) return

//   selectedRow.value.status = 'Disetujui'
//   showApproveDialog.value = false
//   selectedRow.value = null
// }

// const confirmReject = () => {
//   if (!selectedRow.value) return

//   selectedRow.value.status = 'Ditolak'
//   showRejectDialog.value = false
//   selectedRow.value = null
// }

const statusColor = (status) => {
  switch (status) {
    case 'Disetujui':
      return 'positive'
    case 'Menunggu':
      return 'orange'
    case 'Ditolak':
      return 'negative'
    default:
      return 'grey'
  }
}

onMounted(async () => {
  await nextTick()
  runEnterAnimation()
  bindHoverMotion()
})

const runEnterAnimation = () => {
  const cards = document.querySelectorAll('.motion-card')
  const table = document.querySelector('.motion-table')

  if (cards.length) {
    animate(
      cards,
      { opacity: [0, 1], y: [12, 0] },
      {
        delay: stagger(0.05),
        duration: 0.35,
        easing: 'ease-out',
      },
    )
  }

  if (table) {
    animate(
      table,
      { opacity: [0, 1], y: [10, 0] },
      {
        delay: 0.18,
        duration: 0.35,
        easing: 'ease-out',
      },
    )
  }
}

const bindHoverMotion = () => {
  document.querySelectorAll('.motion-btn').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      animate(el, { scale: 1.05, y: -1 }, { duration: 0.14 })
    })

    el.addEventListener('mouseleave', () => {
      animate(el, { scale: 1, y: 0 }, { duration: 0.14 })
    })
  })

  document.querySelectorAll('.q-table tbody tr').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      animate(row, { backgroundColor: 'rgba(99,102,241,0.03)' }, { duration: 0.18 })
    })

    row.addEventListener('mouseleave', () => {
      animate(row, { backgroundColor: 'rgba(255,255,255,1)' }, { duration: 0.18 })
    })
  })
}
</script>

<style>
.custom-field-search .q-field__control {
  border-radius: 25px;
}
</style>
