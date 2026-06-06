<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Kelola Peserta</div>

        <div class="text-grey-7">Kelola seluruh peserta dari berbagai acara organisasi.</div>
      </div>
    </div>

    <q-banner
      rounded
      class="bg-blue-1 text-blue-9 q-mb-md"
      v-if="selectedEvent != null && selectedEvent !== 'all'"
    >
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

    <q-card flat class="q-mb-lg rounded-card motion-card">
      <div class="row q-col-gutter-md">
        <!-- Pilih Acara -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedEvent"
            :options="filteredEventOptions"
            outlined
            dense
            rounded
            emit-value
            map-options
            use-input
            clearable
            fill-input
            hide-selected
            input-debounce="0"
            :label="selectedEvent ? undefined : 'Pilih Acara'"
            @filter="filterEvents"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-select
            outlined
            dense
            rounded
            v-model="selectedStatus"
            :options="statusOptions"
            :label="selectedStatus ? undefined : 'Pilih Status'"
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
            clearable
            debounce="20"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </q-card>

    <!-- TOOLBAR ACTION MASSAL -->
    <q-slide-transition>
      <div v-show="selected.length > 0" class="row items-center justify-between q-pa-sm q-mb-md">
        <div class="text-weight-medium text-indigo-9">{{ selected.length }} peserta dipilih</div>

        <div class="row q-gutter-sm">
          <q-btn
            outline
            color="negative"
            icon="close"
            label="Tolak"
            style="border-radius: 12px"
            no-caps
            :disable="!canBulkAction"
            @click="showRejectDialog = true"
          />

          <q-btn
            color="indigo-9"
            icon="check"
            label="Setujui"
            style="border-radius: 12px"
            no-caps
            :disable="!canBulkAction"
            @click="showApproveDialog = true"
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
            <q-avatar size="40px" class="q-mr-sm">
              <img :src="props.row.foto || defaultProfileImage" style="object-fit: cover" />
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
            :color="REGISTRATION_STATUS_COLOR[props.row.status]"
          >
            {{ REGISTRATION_STATUS_LABEL[props.row.status] }}
          </q-chip>
        </q-td>
      </template>

      <!-- SELECT CHECKBOX KHUSUS -->
      <template #body-selection="scope">
        <div>
          <q-checkbox
            v-model="scope.selected"
            :disable="scope.row.status !== REGISTRATION_STATUS.PENDING || scope.row.event_status !== EventStatusEnum.REGISTRATION_OPEN"
            color="indigo"
          />
          <q-tooltip v-if="scope.row.status !== REGISTRATION_STATUS.PENDING">
            Peserta ini sudah {{ scope.row.status === REGISTRATION_STATUS.APPROVED ? 'disetujui' : 'ditolak' }}, tidak dapat diubah.
          </q-tooltip>
          <q-tooltip v-else-if="scope.row.event_status !== EventStatusEnum.REGISTRATION_OPEN">
            Aksi hanya tersedia saat status acara "Pendaftaran Dibuka".
          </q-tooltip>
        </div>
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

    <ConfirmDialog
      v-model="showApproveDialog"
      type="success"
      title="Setujui Peserta"
      message="Apakah Anda yakin ingin menyetujui peserta terpilih?"
      confirm-label="Ya, Setujui"
      cancel-label="Batal"
      @confirm="confirmApprove"
    />

    <ConfirmDialog
      v-model="showRejectDialog"
      type="danger"
      title="Tolak Peserta"
      message="Apakah Anda yakin ingin menolak peserta ini?"
      confirm-label="Ya, Tolak"
      cancel-label="Batal"
      @confirm="confirmReject"
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { animate, stagger } from 'motion'

import FooterComponent from 'src/components/FooterComponent.vue'
import defaultProfileImage from 'src/assets/image/default_profil.jpg'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'
import { getEvents } from 'src/services/event.api'
import { EventStatusEnum } from 'src/utils/EventEnumStatus'
import {
  REGISTRATION_STATUS,
  REGISTRATION_STATUS_LABEL,
  REGISTRATION_STATUS_COLOR,
  REGISTRATION_STATUS_OPTIONS,
} from 'src/enums/registration-status.enum'
import { getEventRegistrations, updateEventRegistration } from 'src/services/event-member.api'

const router = useRouter()

const selected = ref([])
const selectedPosition = ref('Anggota')
const filteredEventOptions = ref([])

const canBulkAction = computed(() => {
  return (
    selected.value.length > 0 &&
    selected.value.every((item) => item.status === REGISTRATION_STATUS.PENDING)
  )
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

  filteredEventOptions.value = eventOptions.value
}

const filterEvents = (val, update) => {
  update(() => {
    if (val === '') {
      filteredEventOptions.value = eventOptions.value
      return
    }

    const needle = val.toLowerCase()

    filteredEventOptions.value = eventOptions.value.filter((v) =>
      v.label.toLowerCase().includes(needle),
    )
  })
}

const confirmApprove = async () => {
  const itemsToApprove = selected.value.filter(
    (item) => item.status === REGISTRATION_STATUS.PENDING,
  )

  if (!itemsToApprove.length) {
    showApproveDialog.value = false
    return
  }

  try {
    await Promise.all(
      itemsToApprove.map((item) =>
        updateEventRegistration(item.id, {
          status: REGISTRATION_STATUS.APPROVED,
          position: selectedPosition.value || 'Anggota',
        }),
      ),
    )

    itemsToApprove.forEach((item) => {
      item.status = REGISTRATION_STATUS.APPROVED

      item.position = selectedPosition.value || 'Anggota'
    })

    dialogType.value = 'success'
    dialogTitle.value = 'Peserta Disetujui'
    dialogMessage.value = `${itemsToApprove.length} peserta berhasil disetujui.`
    showDialog.value = true
  } catch (error) {
    console.error(error)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value = 'Gagal menyetujui peserta. Silakan coba lagi.'
    showDialog.value = true
  } finally {
    selected.value = []
    selectedPosition.value = 'Anggota'
    showApproveDialog.value = false
  }
}

const confirmReject = async () => {
  const itemsToReject = selected.value.filter((item) => item.status === REGISTRATION_STATUS.PENDING)

  if (!itemsToReject.length) {
    showRejectDialog.value = false
    return
  }

  try {
    await Promise.all(
      itemsToReject.map((item) =>
        updateEventRegistration(item.id, { status: REGISTRATION_STATUS.REJECTED }),
      ),
    )

    itemsToReject.forEach((item) => {
      item.status = REGISTRATION_STATUS.REJECTED
    })

    dialogType.value = 'success'
    dialogTitle.value = 'Peserta Ditolak'
    dialogMessage.value = `${itemsToReject.length} peserta berhasil ditolak.`
    showDialog.value = true
  } catch (error) {
    console.error(error)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value = 'Gagal menolak peserta. Silakan coba lagi.'
    showDialog.value = true
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
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
// const selectedRow = ref(null)

const search = ref('')
const selectedEvent = ref('all')
const selectedStatus = ref('all')

const selectedEventStatus = computed(() => {
  const event = events.value.find((e) => e.id === selectedEvent.value)
  return event?.status_name || '-'
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
const statusOptions = REGISTRATION_STATUS_OPTIONS

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
    const params = { limit: 10000 }

    if (selectedEvent.value && selectedEvent.value !== 'all') {
      params.event_id = selectedEvent.value
    }

    const res = await getEventRegistrations(params)

    const registrations = res.data.data.event_registrations || []

    rows.value = registrations.map((item) => ({
      id: item.id,

      nama: item.user?.name || '-',

      email: item.user?.email || '-',

      foto: item.user?.url || null,

      acara: item.event?.title || '-',

      event_id: item.event?.id,

      event_status: events.value.find((e) => e.id === item.event?.id)?.status ?? null,

      divisi: item.division?.name || '-',

      status: item.status,

      created_at: item.created_at || null,
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
  rows.value
    .filter((item) => {
      const keyword = String(search.value || '').toLowerCase()

      const matchSearch =
        item.nama.toLowerCase().includes(keyword) || item.email.toLowerCase().includes(keyword)

      const matchEvent =
        selectedEvent.value == null ||
        selectedEvent.value === 'all' ||
        item.event_id === selectedEvent.value

      const matchStatus = selectedStatus.value === 'all' || item.status === selectedStatus.value

      return matchSearch && matchEvent && matchStatus
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
)

const pendingCount = computed(
  () => filteredRows.value.filter((item) => item.status === REGISTRATION_STATUS.PENDING).length,
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
