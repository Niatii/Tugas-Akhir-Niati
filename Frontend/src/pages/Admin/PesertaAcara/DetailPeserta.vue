<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs-->
    <div class="q-py-md q-gutter-sm">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" size="1.2em" color="grey-6" />
        </template>
        <q-breadcrumbs-el
          label="Kelola Peserta"
          icon="people"
          class="text-grey-9"
          to="/admin/peserta"
        />
        <q-breadcrumbs-el label="Detail Peserta" icon="person" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Detail Peserta</div>
        <div class="text-grey-7">Detail data pendaftaran peserta acara.</div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner-dots color="indigo-9" size="40px" />
    </div>

    <div v-else class="row q-col-gutter-lg">
      <!-- LEFT -->
      <div class="col-12 col-md-4">
        <!-- PROFILE CARD -->
        <q-card flat bordered class="rounded-card q-pa-lg q-mb-lg">
          <div class="column items-center text-center">
            <q-avatar size="120px" class="shadow-2">
              <img
                :src="registration?.user?.url || 'https://cdn.quasar.dev/img/avatar.png'"
                style="object-fit: cover; width: 100%; height: 100%"
              />
            </q-avatar>

            <div class="text-h6 text-weight-bold q-mt-md">
              {{ registration?.user?.name || '-' }}
            </div>

            <q-chip
              dense
              :color="registrationStatusColor"
              size="12px"
              class="q-px-md q-mt-sm"
              text-color="white"
            >
              {{ registrationStatusLabel }}
            </q-chip>
          </div>

          <q-separator class="q-my-md" />

          <div class="q-gutter-y-sm">
            <div class="row justify-between">
              <span class="text-grey-7">NIM</span>
              <span class="text-weight-medium">{{ registration?.user?.nim || '-' }}</span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Angkatan</span>
              <span class="text-weight-medium">{{ registration?.user?.batch_year || '-' }}</span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Email</span>
              <span class="text-weight-medium" style="font-size: 13px">
                {{ registration?.user?.email || '-' }}
              </span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Telepon</span>
              <span class="text-weight-medium">
                {{ registration?.user?.phone_number || '-' }}
              </span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Jurusan</span>
              <span
                class="text-weight-medium"
                style="font-size: 13px; text-align: right; max-width: 60%"
              >
                {{ registration?.user?.jurusan?.name || '-' }}
              </span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Prodi</span>
              <span
                class="text-weight-medium"
                style="font-size: 13px; text-align: right; max-width: 60%"
              >
                {{ registration?.user?.prodi?.name || '-' }}
              </span>
            </div>
          </div>
        </q-card>

        <!-- POSISI DITERIMA (jika sudah approved) -->
        <q-card
          v-if="registration?.status === REGISTRATION_STATUS.APPROVED"
          flat
          bordered
          class="rounded-card q-pa-md q-mb-lg bg-indigo-1"
        >
          <div class="row items-center q-mb-sm">
            <q-icon name="workspace_premium" color="indigo-9" size="22px" class="q-mr-sm" />
            <div class="text-subtitle2 text-weight-bold text-indigo-9">Posisi Diterima</div>
          </div>
          <div class="text-h6 text-weight-bold text-indigo-10">
            {{ registration?.position || 'Anggota' }}
          </div>
          <div class="text-caption text-grey-7 q-mt-xs">
            Divisi: {{ registration?.division?.name || '-' }}
          </div>
        </q-card>
      </div>

      <!-- RIGHT -->
      <div class="col-12 col-md-8">
        <!-- DATA PENDAFTARAN -->
        <q-card flat bordered class="rounded-card q-pa-lg q-mb-sm">
          <div class="text-subtitle1 text-weight-bold q-mb-md">Informasi Pendaftaran</div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-7">Nama Acara</div>
              <div class="text-weight-medium">{{ registration?.event?.title || '-' }}</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-7">Divisi Dipilih</div>
              <q-chip dense color="indigo-1" text-color="indigo-9">
                {{ registration?.division?.name || '-' }}
              </q-chip>
            </div>

            <div class="col-12 col-md-6 q-mt-xs">
              <div class="text-caption text-grey-7">Posisi</div>
              <div class="text-weight-medium">{{ registration?.position || 'Anggota' }}</div>
            </div>

            <div class="col-12 col-md-6 q-mt-xs">
              <div class="text-caption text-grey-7">Tanggal Daftar</div>
              <div class="text-weight-medium">{{ formatDate(registration?.created_at) }}</div>
            </div>

            <div class="col-12 col-md-6 q-mt-xs">
              <div class="text-caption text-grey-7">Status</div>
              <q-chip
                dense
                :color="registrationStatusColor"
                size="12px"
                class="q-px-md"
                text-color="white"
              >
                {{ registrationStatusLabel }}
              </q-chip>
            </div>
          </div>
        </q-card>

        <!-- ALASAN -->
        <q-card flat bordered class="rounded-card q-pa-lg q-mb-sm">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Alasan Mengikuti Acara</div>
          <div class="text-grey-8" style="line-height: 1.7">
            {{ registration?.reason || '-' }}
          </div>
        </q-card>

        <!-- ACTION BUTTONS -->
        <div class="row justify-end q-gutter-sm q-mt-md" v-if="canManageRegistration">
          <q-btn
            outline
            rounded
            color="negative"
            icon="close"
            label="Tolak"
            no-caps
            @click="openRejectDialog()"
          />
          <q-btn
            rounded
            color="indigo-9"
            icon="check"
            label="Setujui"
            no-caps
            @click="openApproveDialog()"
          />
        </div>
      </div>
    </div>

    <FooterComponent />

    <!-- DIALOG APPROVE KONFIRMASI LANGSUNG -->
    <ConfirmDialog
      v-model="showApproveDialog"
      type="success"
      title="Setujui Peserta"
      message="Apakah Anda yakin ingin menyetujui peserta ini?"
      confirm-label="Ya, Setujui"
      cancel-label="Batal"
      :loading="loadingConfirm"
      @confirm="confirmApprove"
    />

    <ConfirmDialog
      v-model="showRejectDialog"
      type="danger"
      title="Tolak Peserta"
      message="Apakah Anda yakin ingin menolak peserta ini?"
      confirm-label="Ya, Tolak"
      cancel-label="Batal"
      :loading="loadingConfirm"
      @confirm="confirmReject"
    />

    <StatusDialog
      v-model="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
    />
  </q-page>
</template>

<script setup>
import FooterComponent from 'src/components/FooterComponent.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { EventStatusEnum } from 'src/utils/EventEnumStatus'

import {
  REGISTRATION_STATUS,
  REGISTRATION_STATUS_LABEL,
  REGISTRATION_STATUS_COLOR,
} from 'src/enums/registration-status.enum'

import { getEventRegistrationDetail, updateEventRegistration } from 'src/services/event-member.api'

const route = useRoute()

const loading = ref(false)
const registration = ref(null)

const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const showDialog = ref(false)
const loadingConfirm = ref(false)

const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')

// ── Computed ───────────────────────────────────────────────────
const registrationStatusLabel = computed(() => {
  if (!registration.value) return '-'
  return REGISTRATION_STATUS_LABEL[registration.value.status] || '-'
})

const registrationStatusColor = computed(() => {
  if (!registration.value) return 'grey'
  return REGISTRATION_STATUS_COLOR[registration.value.status] || 'grey'
})

const eventStatus = computed(() => {
  return registration.value?.event?.status
})

const canManageRegistration = computed(() => {
  if (!registration.value) return false
  return (
    eventStatus.value === EventStatusEnum.REGISTRATION_OPEN &&
    registration.value.status === REGISTRATION_STATUS.PENDING
  )
})

// ── Fetch ──────────────────────────────────────────────────────
const fetchDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id
    const res = await getEventRegistrationDetail(id)
    registration.value = res.data.data.event_registration
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})

// ── Actions ────────────────────────────────────────────────────
const openApproveDialog = () => {
  if (!canManageRegistration.value) return
  showApproveDialog.value = true
}

const openRejectDialog = () => {
  if (!canManageRegistration.value) return
  showRejectDialog.value = true
}

const confirmApprove = async () => {
  if (!registration.value) return
  loadingConfirm.value = true
  try {
    await updateEventRegistration(registration.value.id, {
      status: REGISTRATION_STATUS.APPROVED,
      position: 'Anggota',
    })

    registration.value.status = REGISTRATION_STATUS.APPROVED
    registration.value.position = 'Anggota'

    dialogType.value = 'success'
    dialogTitle.value = 'Peserta Berhasil Disetujui'
    dialogMessage.value = `${registration.value.user?.name} berhasil disetujui sebagai Anggota di divisi ${registration.value.division?.name}.`
    showDialog.value = true
    showApproveDialog.value = false
  } catch (error) {
    console.error(error)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal Menyetujui'
    dialogMessage.value = error?.response?.data?.message || 'Gagal menyetujui peserta.'
    showDialog.value = true
  } finally {
    loadingConfirm.value = false
  }
}

const confirmReject = async () => {
  if (!registration.value) return
  loadingConfirm.value = true
  try {
    await updateEventRegistration(registration.value.id, {
      status: REGISTRATION_STATUS.REJECTED,
    })

    registration.value.status = REGISTRATION_STATUS.REJECTED

    dialogType.value = 'success'
    dialogTitle.value = 'Peserta Berhasil Ditolak'
    dialogMessage.value = 'Peserta telah ditolak.'
    showDialog.value = true
    showRejectDialog.value = false
  } catch (error) {
    console.error(error)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal Menolak'
    dialogMessage.value = error?.response?.data?.message || 'Gagal menolak peserta.'
    showDialog.value = true
  } finally {
    loadingConfirm.value = false
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}
</style>
