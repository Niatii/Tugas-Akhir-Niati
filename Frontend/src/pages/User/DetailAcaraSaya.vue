<template>
  <q-page class="q-pa-xl">
    <!-- HEAD -->
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Acara Saya" icon="event" />
        <q-breadcrumbs-el label="Detail Acara Saya" />
      </q-breadcrumbs>
    </div>
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="indigo-9" size="50px" />
    </div>
    <div class="bg-blue-3 q-pa-md" style="border-radius: 16px">
      <div class="row items-center justify-between q-my-sm text-white">
        <q-chip
          dense
          :color="eventStatusUI?.color"
          text-color="white"
          :icon="eventStatusUI?.icon"
          class="q-pa-md"
        >
          {{ eventStatusUI?.label }}
        </q-chip>

        <q-chip dense outline text-color="white" icon="badge" class="q-pa-md">
          {{ detail?.position }}
        </q-chip>
      </div>

      <div class="q-pa-md text-white">
        <div class="text-h5 text-bold">{{ detail?.event?.title }}</div>
        <div class="row items-center q-mt-xs">
          <q-icon name="groups" size="18px" class="q-mr-xs" />
          {{ detail?.event?.user?.name }}
        </div>
        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-6">
            <div class="bg-white q-pa-md" style="border-radius: 16px">
              <div class="text-caption text-grey-7">Tanggal Acara</div>
              <div class="text-weight-medium text-indigo-9">
                {{ formatDate(detail?.event?.start_date) }}
                -
                {{ formatDate(detail?.event?.end_date) }}
              </div>
            </div>
          </div>

          <div class="col-6">
            <div class="bg-white q-pa-md" style="border-radius: 16px">
              <div class="text-caption text-grey-7">Divisi Anda</div>
              <div class="text-weight-medium text-indigo-9">{{ detail?.division?.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2 -->
    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <q-card flat class="tabs-container">
          <q-tabs
            v-model="tab"
            class="custom-tabs"
            active-color="white"
            indicator-color="transparent"
            align="justify"
          >
            <!-- <q-tab name="informasi" icon="info" label="Informasi" no-caps /> -->
            <q-tab name="rapat" icon="meeting_room" label="Rapat" no-caps />

            <q-tab name="anggota" icon="groups" label="Anggota Divisi" no-caps />

            <q-tab name="sertifikat" icon="verified" label="Sertifikat" no-caps />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <!-- INFORMASI -->
            <!-- <q-tab-panel name="informasi">
              <div class="row q-pa-md q-col-gutter-md q-mt-md">
                <div
                  class="col-4 bg-indigo-1 shadow-2"
                  style="border-radius: 16px; max-height: 500px"
                >
                  <div class="q-pa-md">
                    <div class="row items-center q-my-sm text-h6 text-weight-bold text-indigo-8">
                      <q-icon name="notifications" size="24px" class="q-mr-sm" />
                      Notifikasi Baru
                    </div>

                    <div class="notif-card notif-new">
                      <div class="row items-start">
                        <div class="col">
                          <div class="text-subtitle2 text-weight-bold">Pengumuman Baru</div>

                          <div class="notif-message">
                            Rapat panitia HMTI Fair akan dilaksanakan besok pukul 19.00.
                          </div>

                          <div class="notif-time">5 menit yang lalu</div>
                        </div>
                      </div>
                    </div>
                    <div class="notif-card notif-new">
                      <div class="row items-start">
                        <div class="col">
                          <div class="text-subtitle2 text-weight-bold">Tugas Baru</div>

                          <div class="notif-message">
                            Anda mendapat tugas baru pada acara HMTI Fair.
                          </div>

                          <div class="notif-time">20 menit yang lalu</div>
                        </div>
                      </div>
                    </div>
                    <div class="notif-card">
                      <div class="row items-start">
                        <div class="col">
                          <div class="text-subtitle2 text-weight-bold">Update Acara</div>

                          <div class="notif-message">Jadwal acara HMTI Fair telah diperbarui.</div>

                          <div class="notif-time">Kemarin</div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="detail-link flex justify-end items-center q-my-md text-indigo-9 cursor-pointer"
                      @click="goDetailNotifikasi"
                    >
                      <span class="text-weight-medium">Lihat Semua Notifikasi</span>
                      <q-icon name="arrow_forward" size="16px" class="q-ml-xs arrow-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel> -->

            <!-- RAPAT -->
            <q-tab-panel name="rapat" class="q-px-xl">
              <!-- HEADER -->
              <div class="row items-center justify-between q-mb-md">
                <div>
                  <div class="row items-center text-h6 text-bold text-indigo-9">
                    <q-icon name="co_present" size="32px" class="q-mr-sm" />
                    Jadwal & Rapat Divisi
                  </div>

                  <div class="text-grey-7 q-mt-xs">
                    Daftar rapat, notulen, dan absensi kehadiran.
                  </div>
                </div>

                <!-- CREATE -->
                <q-btn
                  v-if="isCoordinator"
                  color="indigo-9"
                  icon="add"
                  label="Tambah Rapat"
                  unelevated
                  no-caps
                  rounded
                  @click="openCreateMeetingDialog"
                />
              </div>

              <!-- SEARCH & FILTER -->
              <div class="row q-col-gutter-md q-mb-md">
                <!-- Search -->
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="meetingSearch"
                    outlined
                    dense
                    rounded
                    clearable
                    placeholder="Cari rapat..."
                  >
                    <template #prepend>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>

                <!-- Type Filter -->
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="meetingTypeFilter"
                    :options="meetingTypeOptions"
                    outlined
                    dense
                    rounded
                    emit-value
                    map-options
                    label="Jenis Rapat"
                  />
                </div>

                <!-- Status Filter -->
                <div class="col-12 col-md-4">
                  <q-select
                    v-model="meetingStatusFilter"
                    :options="meetingStatusOptions"
                    outlined
                    dense
                    rounded
                    emit-value
                    map-options
                    label="Status"
                  />
                </div>
              </div>

              <!-- TABLE -->
              <q-table
                flat
                bordered
                :rows="meetingRows"
                :columns="meetingColumns"
                row-key="id"
                class="rounded-card"
              >
                <!-- NO -->
                <template #body-cell-no="props">
                  <q-td :props="props">
                    {{ props.pageIndex + 1 }}
                  </q-td>
                </template>

                <!-- RAPAT -->
                <template #body-cell-title="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">
                      {{ props.row.title }}
                    </div>

                    <div class="text-caption text-grey-7">
                      {{ props.row.type }}
                    </div>
                  </q-td>
                </template>

                <!-- STATUS -->
                <template #body-cell-status="props">
                  <q-td align="center">
                    <q-chip
                      dense
                      size="12px"
                      class="q-px-sm"
                      :color="props.row.statusColor"
                      text-color="white"
                    >
                      {{ props.row.status }}
                    </q-chip>
                  </q-td>
                </template>

                <!-- ATTENDANCE -->
                <template #body-cell-attendance="props">
                  <q-td align="center">
                    <!-- KOORDINATOR PADA RAPAT DIVISI -->
                    <template v-if="isCoordinator && props.row.division_id !== null">
                      <div class="column items-center">
                        <q-chip dense size="12px" color="positive" text-color="white">
                          {{ props.row.percentage }}%
                        </q-chip>

                        <div class="text-caption text-grey-7 q-mt-xs">
                          {{ props.row.hadir }} H | {{ props.row.izin }} I | {{ props.row.absen }} A
                        </div>
                      </div>
                    </template>

                    <!-- ANGGOTA / RAPAT UMUM -->
                    <template v-else>
                      <q-chip dense :color="props.row.myAttendanceColor" text-color="white">
                        {{ props.row.myAttendance }}
                      </q-chip>
                    </template>
                  </q-td>
                </template>

                <!-- ACTION -->
                <template #body-cell-action="props">
                  <q-td :props="props">
                    <!-- DETAIL -->
                    <q-btn
                      flat
                      round
                      dense
                      icon="visibility"
                      color="indigo-9"
                      @click="openMeetingDetail(props.row)"
                    >
                      <q-tooltip> Detail Rapat </q-tooltip>
                    </q-btn>

                    <q-btn
                      v-if="isCoordinator && props.row.division_id !== null"
                      flat
                      round
                      dense
                      icon="edit"
                      color="blue-9"
                      @click="openEdit(props.row)"
                    >
                      <q-tooltip> Edit Rapat </q-tooltip>
                    </q-btn>

                    <q-btn
                      v-if="isCoordinator && props.row.division_id !== null"
                      flat
                      round
                      dense
                      icon="delete"
                      color="negative"
                      @click="openDelete(props.row)"
                    >
                      <q-tooltip> Hapus Rapat </q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="isCoordinator && props.row.division_id !== null"
                      flat
                      round
                      dense
                      icon="groups"
                      color="positive"
                      @click="goToAbsensi(props.row)"
                    >
                      <q-tooltip> Absensi </q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="isCoordinator && props.row.division_id !== null"
                      flat
                      round
                      dense
                      class="motion-btn"
                      icon="description"
                      color="orange"
                      @click="goToNotulen(props.row)"
                    >
                      <q-tooltip>Notulen</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>

                <!-- EMPTY -->
                <template #no-data>
                  <div class="full-width q-pa-xl text-center text-grey-6">
                    Belum ada rapat tersedia.
                  </div>
                </template>
              </q-table>
            </q-tab-panel>

            <!-- ANGGOTA -->
            <q-tab-panel name="anggota" class="q-px-xl">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="groups" size="32px" class="q-mr-xs" />
                Anggota Acara
              </div>

              <div class="text-grey-7 q-mt-xs q-mb-md">
                Berikut daftar anggota yang terdaftar pada acara ini.
              </div>

              <q-table
                flat
                bordered
                class="motion-item rounded-card"
                :rows="rowsAnggota"
                :columns="columnsAnggota"
                row-key="id"
              >
                <!-- NO -->
                <template #body-cell-no="props">
                  <q-td :props="props">
                    {{ props.pageIndex + 1 }}
                  </q-td>
                </template>

                <!-- NAMA -->
                <template #body-cell-nama="props">
                  <q-td :props="props">
                    <div class="row items-center no-wrap">
                      <q-avatar size="34px" color="indigo-1" text-color="indigo-9" class="q-mr-sm">
                        {{ props.row.nama?.charAt(0) }}
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

                <!-- DIVISI -->
                <template #body-cell-divisi="props">
                  <q-td :props="props">
                    <q-chip size="12px" dense color="blue-1" text-color="blue-9" class="q-px-sm">
                      {{ props.row.divisi }}
                    </q-chip>
                  </q-td>
                </template>

                <!-- ROLE -->
                <template #body-cell-role="props">
                  <q-td :props="props">
                    <q-chip
                      dense
                      size="12px"
                      class="q-px-sm"
                      :color="props.row.role === 'Koordinator' ? 'indigo' : 'grey-6'"
                      text-color="white"
                    >
                      {{ props.row.role }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>

              <div v-if="rowsAnggota.length === 0" class="text-center text-grey-6 q-pa-xl">
                Belum ada anggota yang terdaftar.
              </div>
            </q-tab-panel>

            <!-- SERTIFIKAT -->
            <q-tab-panel name="sertifikat" class="q-px-xl">
              <div class="row items-center q-mb-md">
                <q-icon name="workspace_premium" size="32px" color="indigo-9" class="q-mr-sm" />
                <div>
                  <div class="text-h6 text-bold text-indigo-9">Sertifikat Kegiatan</div>
                  <div class="text-grey-7 text-caption">
                    Status sertifikat Anda untuk acara ini.
                  </div>
                </div>
              </div>

              <!-- Event not completed -->
              <q-card
                v-if="detail?.event?.status !== 5"
                flat
                bordered
                class="rounded-card q-pa-xl text-center"
              >
                <q-icon name="hourglass_empty" size="56px" color="grey-4" />
                <div class="text-h6 text-grey-6 q-mt-md">Sertifikat Belum Tersedia</div>
                <div class="text-grey-5 q-mt-sm">
                  Sertifikat akan tersedia setelah acara dinyatakan selesai oleh admin.
                </div>
              </q-card>

              <!-- Event completed — loading cert -->
              <div v-else-if="certLoading" class="flex flex-center q-py-xl">
                <q-spinner color="indigo-9" size="40px" />
              </div>

              <!-- Certificate available -->
              <q-card v-else-if="myCert" flat bordered class="rounded-card overflow-hidden">
                <div class="cert-tab-banner">
                  <q-icon name="workspace_premium" size="56px" color="white" style="opacity: 0.9" />
                </div>
                <q-card-section>
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <div class="info-block">
                        <div class="text-caption text-grey-6">Nomor Sertifikat</div>
                        <div class="text-body2 text-weight-bold text-indigo-9 text-mono">
                          {{ myCert.certificate_number }}
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="info-block">
                        <div class="text-caption text-grey-6">Status</div>
                        <q-badge color="positive" rounded class="q-mt-xs">
                          <q-icon name="check_circle" size="12px" class="q-mr-xs" />
                          Dipublikasikan
                        </q-badge>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="info-block">
                        <div class="text-caption text-grey-6">Kehadiran Anda</div>
                        <div class="row items-center q-mt-xs">
                          <q-badge
                            :color="myCert.attendance_percentage > 75 ? 'positive' : 'orange'"
                            rounded
                          >
                            {{ myCert.attendance_percentage }}%
                          </q-badge>
                          <span class="text-caption text-grey-6 q-ml-xs"> (syarat: &gt;75%) </span>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-6">
                      <div class="info-block">
                        <div class="text-caption text-grey-6">Tanggal Terbit</div>
                        <div class="text-body2">{{ formatDate(myCert.issued_at) }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="row q-mt-lg q-gutter-sm">
                    <q-btn
                      color="indigo-9"
                      icon="download"
                      label="Unduh"
                      no-caps
                      rounded
                      :loading="certDownloading"
                      @click="downloadMyCert"
                    />
                    <!-- <q-btn
                      outline
                      color="indigo-9"
                      icon="qr_code_scanner"
                      label="Verifikasi"
                      no-caps
                      rounded
                      @click="$router.push(`/verify/${myCert.certificate_number}`)"
                    /> -->
                  </div>
                </q-card-section>
              </q-card>

              <!-- Not eligible -->
              <q-card
                v-else-if="certChecked"
                flat
                bordered
                class="rounded-card q-pa-xl text-center"
              >
                <q-icon name="sentiment_dissatisfied" size="56px" color="orange-4" />
                <div class="text-h6 text-grey-7 q-mt-md">Sertifikat Tidak Tersedia</div>
                <div class="text-grey-6 q-mt-sm">
                  Anda belum memenuhi syarat kehadiran minimal 75% atau sertifikat belum
                  dipublikasikan oleh admin.
                </div>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>

  <ModalKelolaRapat
    v-model="dialogRapat"
    :mode="dialogMode"
    :edit-data="selectedMeeting"
    :event-id="detail?.event?.id"
    :event-start-date="detail?.event?.start_date"
    @save="handleSaveMeeting"
  />

  <ConfirmDialog
    v-model="showDeleteDialog"
    type="danger"
    title="Hapus Rapat"
    message="Data rapat akan dihapus permanen. Lanjutkan?"
    confirm-label="Ya, Hapus"
    cancel-label="Batal"
    @confirm="confirmDelete"
  />

  <StatusDialog
    v-model="showDialog"
    :type="dialogType"
    :title="dialogTitle"
    :message="dialogMessage"
  />

  <FooterComponent />
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getStatusUI } from 'src/utils/EventEnumStatus'
import { getMyEventDetail } from 'src/services/event.api'
import { getMyCertificates, downloadMyCertificate } from 'src/services/certificate.api'
import { deleteMeeting } from 'src/services/meeting.api'
import FooterComponent from 'src/components/FooterComponent.vue'
import ModalKelolaRapat from 'src/components/User/ModalKelolaRapat.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)

// ─── Certificate State ───────────────────────────────────────
const certLoading = ref(false)
const certChecked = ref(false)
const certDownloading = ref(false)
const myCert = ref(null)

const fetchMyCert = async () => {
  if (!detail.value?.event?.id) return
  certLoading.value = true
  certChecked.value = false
  try {
    const res = await getMyCertificates()
    const certs = res.data.data?.certificates || []
    myCert.value = certs.find((c) => c.event_id === detail.value.event.id) || null
  } catch {
    myCert.value = null
  } finally {
    certLoading.value = false
    certChecked.value = true
  }
}

const downloadMyCert = async () => {
  if (!myCert.value) return
  certDownloading.value = true
  try {
    const res = await downloadMyCertificate(myCert.value.id)
    const mimeType = res.headers['content-type'] || 'application/pdf'
    const ext = mimeType.includes('pdf')
      ? 'pdf'
      : mimeType.includes('png')
        ? 'png'
        : mimeType.includes('gif')
          ? 'gif'
          : 'jpg'
    const url = URL.createObjectURL(new Blob([res.data], { type: mimeType }))
    const link = document.createElement('a')
    link.href = url
    link.download = `Sertifikat_${detail.value?.event?.title || myCert.value.id}.${ext}`
    link.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error(e)
  } finally {
    certDownloading.value = false
  }
}
// ─────────────────────────────────────────────────────────────

const detail = ref(null)
const tab = ref('rapat')
const meetingSearch = ref('')
const meetingTypeFilter = ref('all')
const meetingStatusFilter = ref('all')

const meetingTypeOptions = [
  { label: 'Semua Jenis', value: 'all' },
  { label: 'Umum', value: 'Umum' },
  { label: 'Divisi', value: 'Divisi' },
]

const meetingStatusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Akan Datang', value: 'Akan Datang' },
  { label: 'Berlangsung', value: 'Berlangsung' },
  { label: 'Selesai', value: 'Selesai' },
]

const columnsAnggota = [
  {
    name: 'no',
    label: 'No',
    field: 'no',
    align: 'left',
  },

  {
    name: 'nama',
    label: 'Nama',
    field: 'nama',
    align: 'left',
  },

  {
    name: 'divisi',
    label: 'Divisi',
    field: 'divisi',
    align: 'left',
  },

  {
    name: 'role',
    label: 'Role',
    field: 'role',
    align: 'center',
  },
]

const rowsAnggota = computed(() => {
  const divisions = detail.value?.event?.divisions || []

  return divisions.flatMap((division) => {
    const members = division.members || []

    return members.map((member) => ({
      id: member.id,

      nama: member.user?.name || '-',

      email: member.user?.email || '-',

      divisi: division.name || '-',

      role: member.position || 'Anggota',
    }))
  })
})
const fetchDetail = async () => {
  loading.value = true

  try {
    const id = route.params.id

    if (!id) {
      throw new Error('ID acara tidak ditemukan')
    }

    const response = await getMyEventDetail(id)

    detail.value = response.data.data

    // Auto-fetch certificate if event is completed
    if (detail.value?.event?.status === 5) {
      fetchMyCert()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  fetchDetail()
})

// Reload cert when switching to sertifikat tab
watch(tab, (val) => {
  if (val === 'sertifikat' && detail.value?.event?.status === 5 && !certChecked.value) {
    fetchMyCert()
  }
})

const isCoordinator = computed(() => {
  return detail.value?.position?.toLowerCase() === 'koordinator'
})

const eventStatusUI = computed(() => {
  return getStatusUI(detail.value?.event?.status)
})
const openMeetingDetail = (meeting) => {
  router.push(`/user/meeting-detail/${meeting.id}`)
}

// Meeting Dialog States
const dialogRapat = ref(false)
const dialogMode = ref('add')
const selectedMeeting = ref(null)

const showDeleteDialog = ref(false)
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')

const openEdit = (meeting) => {
  dialogMode.value = 'edit'
  selectedMeeting.value = meeting
  dialogRapat.value = true
}

const openCreateMeetingDialog = () => {
  dialogMode.value = 'add'
  selectedMeeting.value = null
  dialogRapat.value = true
}

const openDelete = (meeting) => {
  selectedMeeting.value = meeting
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await deleteMeeting(selectedMeeting.value.id)
    dialogType.value = 'success'
    dialogTitle.value = 'Rapat Berhasil Dihapus'
    dialogMessage.value = 'Rapat telah berhasil dihapus.'
    showDialog.value = true
    showDeleteDialog.value = false

    await fetchDetail()
  } catch (error) {
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value =
      error.response?.data?.message || 'Terjadi kesalahan saat menghapus rapat. Silakan coba lagi.'
    showDialog.value = true
  }
}

const handleSaveMeeting = async () => {
  dialogRapat.value = false
  await fetchDetail()
}

const goToAbsensi = (meeting) => {
  router.push(`/user/absensi-rapat/${meeting.id}`)
}

const goToNotulen = (meeting) => {
  router.push(`/user/notulen-rapat/${meeting.id}`)
}
const meetingColumns = [
  {
    name: 'no',
    label: 'No',
    field: 'no',
    align: 'left',
  },

  {
    name: 'title',
    label: 'Rapat',
    field: 'title',
    align: 'left',
  },

  {
    name: 'date',
    label: 'Tanggal',
    field: 'date',
    align: 'left',
  },

  {
    name: 'location',
    label: 'Lokasi',
    field: 'location',
    align: 'left',
  },

  {
    name: 'attendance',
    label: 'Kehadiran',
    field: 'attendance',
    align: 'center',
  },

  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
  },

  // {
  //   name: 'notulen',
  //   label: 'Notulen',
  //   field: 'notulen',
  //   align: 'left',
  // },

  {
    name: 'action',
    label: 'Aksi',
    field: 'action',
    align: 'center',
  },
]

const meetingRows = computed(() => {
  const meetings = detail.value?.event?.meetings || []
  const myDivisionId = detail.value?.division?.id || null
  const visibleMeetings = meetings.filter((meeting) => {
    if (meeting.meeting_type === 2 || meeting.division_id !== null) {
      return meeting.division_id === myDivisionId
    }
    return true // Rapat Umum
  })

  // Filter berdasarkan pencarian dan dropdown filter
  const keyword = (meetingSearch.value || '').trim().toLowerCase()
  const filteredMeetings = visibleMeetings.filter((meeting) => {
    const matchSearch = meeting.title?.toLowerCase().includes(keyword)

    const matchType =
      meetingTypeFilter.value === 'all' || meeting.meeting_type_name === meetingTypeFilter.value

    const matchStatus =
      meetingStatusFilter.value === 'all' || meeting.status_name === meetingStatusFilter.value

    return matchSearch && matchType && matchStatus
  })

  return filteredMeetings.map((meeting) => {
    const attendances = meeting.attendances || []

    /**
     * SUMMARY
     */
    const hadir = attendances.filter((x) => x.status === 1).length

    const izin = attendances.filter((x) => x.status === 2).length

    const absen = attendances.filter((x) => x.status === 3).length

    const total = attendances.length

    const percentage = total ? Math.round((hadir / total) * 100) : 0

    /**
     * MEMBER ATTENDANCE
     */
    const myAttendance = attendances[0]

    let myAttendanceLabel = 'Belum Absen'
    let myAttendanceColor = 'grey'

    if (myAttendance?.status === 1) {
      myAttendanceLabel = 'Hadir'
      myAttendanceColor = 'positive'
    }

    if (myAttendance?.status === 2) {
      myAttendanceLabel = 'Izin'
      myAttendanceColor = 'orange'
    }

    if (myAttendance?.status === 3) {
      myAttendanceLabel = 'Tidak Hadir'
      myAttendanceColor = 'negative'
    }

    /**
     * STATUS COLOR
     */
    let statusColor = 'blue'

    if (meeting.status_name === 'Selesai') {
      statusColor = 'positive'
    }

    if (meeting.status_name === 'Berlangsung') {
      statusColor = 'orange'
    }

    return {
      id: meeting.id,

      title: meeting.title,

      division_id: meeting.division_id,

      date: formatDateTime(meeting.schedule_date),

      raw_schedule_date: meeting.schedule_date,

      time: `${formatTime(meeting.started_at)} - ${formatTime(meeting.ended_at)}`,

      location: meeting.location || '-',

      type: meeting.meeting_type_name || '-',

      status: meeting.status_name || '-',

      statusColor,

      notulen: meeting.notulen || '',

      hadir,
      izin,
      absen,

      percentage,

      myAttendance: myAttendanceLabel,

      myAttendanceColor,
    }
  })
})
const formatDateTime = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
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
const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>
<style>
.tabs-container {
  background: transparent;
}

.rounded-card {
  border-radius: 18px;
}

.custom-tabs {
  background: #f5f8fe;
  border-radius: 40px;
  padding: 6px;
}

.custom-tabs .q-tab {
  border-radius: 30px;
  min-height: 48px;
  font-weight: 600;
  color: #5f6b7a;
}
.summary-card {
  border-radius: 16px;
}

.rounded-card {
  border-radius: 16px;
  overflow: hidden;
}

.custom-tabs .q-tab--active {
  background: #243261;
  color: white;
}

.notif-card {
  background: white;
  border-radius: 12px;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid #eef2f7;
  transition: all 0.25s ease;
  cursor: pointer;
}

.notif-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.notif-new {
  border-left: 4px solid #3949ab;
  background: #f8f9ff;
}

.notif-icon {
  color: #3949ab;
}

.notif-message {
  font-size: 12px;
  color: #555;
  margin-top: 2px;
}

.notif-time {
  font-size: 10px;
  color: #9aa0a6;
  margin-top: 4px;
}

.certificate-wrapper {
  padding: 40px;
  display: flex;
  justify-content: center;
}

.certificate-card {
  width: 100%;
  max-width: 900px;
  padding: 60px 40px;
  border-radius: 28px;
  border: 2px dashed #cfd8dc;
  background: #f8fafc;
}

.certificate-desc {
  max-width: 500px;
  margin: auto;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.download-btn {
  color: white;
  padding: 16px 36px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 16px;
}

.download-btn:hover {
  background: #2f4c8d;
}

.user-info {
  background: #eef2f7;
  padding: 20px;
  border-radius: 16px;
}

.avatar-box {
  width: 48px;
  height: 48px;
  background: #3b5aa3;
  border-radius: 12px;
}

.cert-tab-banner {
  height: 100px;
  background: linear-gradient(135deg, #5c6bc0 0%, #7c4dff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-block {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
}

.rounded-card {
  border-radius: 18px;
}
.text-mono {
  font-family: 'Courier New', monospace;
}
</style>
