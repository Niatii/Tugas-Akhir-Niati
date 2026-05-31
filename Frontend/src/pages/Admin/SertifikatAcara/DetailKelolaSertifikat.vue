<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- BREADCRUMB -->
    <div class="q-mb-md motion-card">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" color="grey-6" size="1.1em" />
        </template>
        <q-breadcrumbs-el
          label="Kelola Sertifikat"
          icon="workspace_premium"
          class="text-grey-8 cursor-pointer"
          @click="$router.push('/admin/sertifikat')"
        />
        <q-breadcrumbs-el :label="eventTitle" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">{{ eventTitle }}</div>
        <div class="text-grey-7">Kelola generate & distribusi sertifikat peserta.</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn
          outline
          color="deep-purple"
          icon="style"
          label="Kelola Template"
          rounded
          no-caps
          class="motion-btn"
          @click="$router.push(`/admin/template-sertifikat/${eventId}`)"
        />
        <q-btn
          color="indigo-9"
          icon="bolt"
          label="Bulk Generate"
          rounded
          no-caps
          :loading="bulkLoading"
          :disable="!isEventCompleted"
          class="motion-btn"
          @click="openBulkGenerate"
        />
        <q-btn
          color="positive"
          icon="publish"
          label="Publish Semua"
          rounded
          no-caps
          :loading="publishAllLoading"
          :disable="summary.generated === 0"
          class="motion-btn"
          @click="openPublishAll"
        />
      </div>
    </div>

    <!-- EVENT NOT COMPLETED WARNING -->
    <q-banner
      v-if="!isEventCompleted && !loading"
      class="bg-orange-1 text-orange-9 q-mb-lg rounded-card motion-card"
      rounded
    >
      <template #avatar><q-icon name="warning" color="orange" size="28px" /></template>
      <strong>Event belum selesai.</strong> Tombol generate dan publish hanya aktif jika status event = Selesai.
    </q-banner>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-6 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Total Peserta Aktif</div>
          <div class="text-h5 text-weight-bold">{{ summary.total }}</div>
        </q-card>
      </div>
      <div class="col-6 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Layak (&gt;75%)</div>
          <div class="text-h5 text-weight-bold text-positive">{{ summary.eligible }}</div>
        </q-card>
      </div>
      <div class="col-6 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">Sudah Generate</div>
          <div class="text-h5 text-weight-bold text-indigo-9">{{ summary.generated }}</div>
        </q-card>
      </div>
      <div class="col-6 col-md-3">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-teal-1">
          <div class="text-caption text-grey-7">Sudah Publish</div>
          <div class="text-h5 text-weight-bold text-teal">{{ summary.published }}</div>
        </q-card>
      </div>
    </div>

    <!-- FILTER -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="search" outlined dense rounded label="Cari nama peserta...">
            <template #prepend><q-icon name="search" /></template>
          </q-input>
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedStatus"
            :options="statusOptions"
            emit-value map-options
            outlined dense rounded label="Status Sertifikat"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="eligibleFilter"
            :options="eligibleOptions"
            emit-value map-options
            outlined dense rounded label="Kelayakan"
          />
        </div>
      </div>
    </q-card>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="indigo-9" size="50px" />
    </div>

    <!-- TABLE -->
    <q-table
      v-else
      flat
      bordered
      row-key="user_id"
      :rows="filteredRows"
      :columns="columns"
      separator="horizontal"
      class="rounded-card motion-table"
      no-data-label="Tidak ada peserta ditemukan."
    >
      <!-- NAMA -->
      <template #body-cell-name="props">
        <q-td :props="props">
          <div class="row items-center no-wrap">
            <q-avatar size="32px" color="indigo-1" text-color="indigo-9" class="q-mr-sm">
              {{ props.row.name?.charAt(0) }}
            </q-avatar>
            <div>
              <div class="text-weight-medium">{{ props.row.name }}</div>
              <div class="text-caption text-grey-7">{{ props.row.position }} · {{ props.row.division }}</div>
            </div>
          </div>
        </q-td>
      </template>

      <!-- KEHADIRAN -->
      <template #body-cell-attendance="props">
        <q-td :props="props" class="text-center">
          <q-badge
            :color="props.row.attendance_percentage > 75 ? 'positive' : 'red'"
            rounded class="q-px-sm"
          >
            {{ props.row.attendance_percentage }}%
          </q-badge>
        </q-td>
      </template>

      <!-- STATUS SERTIFIKAT -->
      <template #body-cell-cert_status="props">
        <q-td :props="props" class="text-center">
          <q-badge
            :color="certStatusColor(props.row.certificate?.status)"
            rounded class="q-px-md q-py-xs"
          >
            {{ props.row.certificate?.status_name || 'Belum Generate' }}
          </q-badge>
          <div v-if="props.row.certificate?.is_manual" class="text-caption text-orange q-mt-xs">
            <q-icon name="upload_file" size="12px" /> Manual
          </div>
        </q-td>
      </template>

      <!-- ACTION -->
      <template #body-cell-action="props">
        <q-td :props="props" class="text-center">
          <!-- Generate -->
          <q-btn
            flat round dense icon="auto_awesome" color="indigo-9"
            :disable="!isEventCompleted || !props.row.is_eligible"
            :loading="generatingId === props.row.user_id"
            class="motion-btn"
            @click="generateOne(props.row)"
          >
            <q-tooltip>Generate Sertifikat</q-tooltip>
          </q-btn>

          <!-- Publish -->
          <q-btn
            flat round dense icon="publish" color="positive"
            :disable="!props.row.certificate || props.row.certificate.status === 0 || props.row.certificate.status === 2"
            class="motion-btn"
            @click="publishOne(props.row)"
          >
            <q-tooltip>Publish Sertifikat</q-tooltip>
          </q-btn>

          <!-- Upload Manual -->
          <q-btn
            flat round dense icon="upload_file" color="orange"
            class="motion-btn"
            @click="openManualUpload(props.row)"
          >
            <q-tooltip>Upload Sertifikat Manual</q-tooltip>
          </q-btn>

          <!-- Download -->
          <q-btn
            flat round dense icon="download" color="teal"
            :disable="!props.row.certificate?.file_url"
            class="motion-btn"
            @click="downloadCert(props.row)"
          >
            <q-tooltip>Download Sertifikat</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <!-- BULK GENERATE RESULT DIALOG -->
    <q-dialog v-model="showBulkResult" persistent>
      <q-card style="min-width:560px;border-radius:18px">
        <q-card-section class="row items-center bg-indigo-9 text-white" style="border-radius:18px 18px 0 0">
          <q-icon name="bolt" size="24px" class="q-mr-sm" />
          <div class="text-h6">Hasil Bulk Generate</div>
          <q-space />
          <q-btn flat round dense icon="close" color="white" v-close-popup />
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-card flat bordered class="rounded-card q-pa-md bg-green-1 text-center">
                <div class="text-h4 text-positive text-weight-bold">{{ bulkResult?.generated }}</div>
                <div class="text-caption text-grey-7">Berhasil</div>
              </q-card>
            </div>
            <div class="col-6">
              <q-card flat bordered class="rounded-card q-pa-md bg-red-1 text-center">
                <div class="text-h4 text-negative text-weight-bold">{{ bulkResult?.failed }}</div>
                <div class="text-caption text-grey-7">Gagal</div>
              </q-card>
            </div>
          </div>
          <div v-if="bulkResult?.failed_list?.length">
            <div class="text-subtitle2 text-weight-bold q-mb-sm text-negative">
              <q-icon name="error_outline" /> Daftar Gagal Generate:
            </div>
            <q-list bordered separator class="rounded-card">
              <q-item v-for="item in bulkResult.failed_list" :key="item.user_id" dense>
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption class="text-negative">{{ item.reason }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge color="orange">{{ item.attendance_percentage }}%</q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="indigo-9" label="Tutup" v-close-popup @click="fetchData" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- MANUAL UPLOAD DIALOG -->
    <q-dialog v-model="showManualDialog">
      <q-card style="min-width:400px;border-radius:18px">
        <q-card-section class="bg-orange text-white" style="border-radius:18px 18px 0 0">
          <div class="text-h6"><q-icon name="upload_file" class="q-mr-sm"/>Upload Sertifikat Manual</div>
        </q-card-section>
        <q-card-section>
          <div class="text-grey-7 q-mb-md">
            Untuk: <strong>{{ manualTarget?.name }}</strong>
          </div>
          <q-file
            v-model="manualFile"
            label="Pilih File PDF / JPG / PNG"
            accept=".pdf,.jpg,.jpeg,.png"
            outlined
            dense
          >
            <template #prepend><q-icon name="attach_file" /></template>
          </q-file>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="grey" label="Batal" v-close-popup />
          <q-btn
            color="orange"
            label="Upload"
            :loading="manualLoading"
            :disable="!manualFile"
            @click="submitManualUpload"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- STATUS DIALOG -->
    <StatusDialog
      v-model="showStatusDialog"
      :type="statusType"
      :title="statusTitle"
      :message="statusMessage"
    />

    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { animate, stagger } from 'motion'
import {
  getCertificatesForEvent,
  generateCertificate,
  bulkGenerateCertificates,
  publishCertificate,
  publishAllCertificates,
  uploadManualCertificate,
  downloadCertificateAdmin,
} from 'src/services/certificate.api'
import { getEventById } from 'src/services/event.api'
import FooterComponent from 'src/components/FooterComponent.vue'
import StatusDialog from 'src/components/StatusDialog.vue'

const route = useRoute()
const eventId = computed(() => route.params.eventId)

const loading = ref(false)
const bulkLoading = ref(false)
const publishAllLoading = ref(false)
const generatingId = ref(null)
const manualLoading = ref(false)

const event = ref(null)
const members = ref([])
const summary = ref({ total: 0, eligible: 0, generated: 0, published: 0, not_generated: 0 })

const search = ref('')
const selectedStatus = ref('all')
const eligibleFilter = ref('all')

const showBulkResult = ref(false)
const bulkResult = ref(null)

const showManualDialog = ref(false)
const manualTarget = ref(null)
const manualFile = ref(null)

const showStatusDialog = ref(false)
const statusType = ref('success')
const statusTitle = ref('')
const statusMessage = ref('')

const eventTitle = computed(() => event.value?.title || 'Detail Sertifikat')
const isEventCompleted = computed(() => event.value?.status === 5)

const statusOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Belum Generate', value: '0' },
  { label: 'Generated', value: '1' },
  { label: 'Published', value: '2' },
]
const eligibleOptions = [
  { label: 'Semua', value: 'all' },
  { label: 'Layak (>75%)', value: 'eligible' },
  { label: 'Tidak Layak', value: 'not_eligible' },
]

const columns = [
  { name: 'name', label: 'Peserta', field: 'name', align: 'left' },
  { name: 'attendance', label: 'Kehadiran', align: 'center' },
  { name: 'cert_status', label: 'Status Sertifikat', align: 'center' },
  { name: 'action', label: 'Aksi', align: 'center' },
]

const filteredRows = computed(() => {
  return members.value.filter((m) => {
    const matchSearch = m.name?.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus =
      selectedStatus.value === 'all' ||
      String(m.certificate?.status ?? 'null') === selectedStatus.value ||
      (selectedStatus.value === '0' && !m.certificate)
    const matchEligible =
      eligibleFilter.value === 'all' ||
      (eligibleFilter.value === 'eligible' && m.is_eligible) ||
      (eligibleFilter.value === 'not_eligible' && !m.is_eligible)
    return matchSearch && matchStatus && matchEligible
  })
})

const certStatusColor = (status) => {
  if (status === 2) return 'teal'
  if (status === 1) return 'blue'
  return 'grey'
}

const fetchData = async () => {
  loading.value = true
  try {
    const [eventRes, certRes] = await Promise.all([
      getEventById(eventId.value),
      getCertificatesForEvent(eventId.value),
    ])
    event.value = eventRes.data.data
    const data = certRes.data.data
    members.value = data.members || []
    summary.value = data.summary || {}
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const generateOne = async (member) => {
  generatingId.value = member.user_id
  try {
    await generateCertificate(eventId.value, member.user_id)
    showStatus('success', 'Berhasil', `Sertifikat untuk ${member.name} berhasil digenerate.`)
    await fetchData()
  } catch (e) {
    showStatus('error', 'Gagal', e.response?.data?.message || 'Gagal generate sertifikat.')
  } finally {
    generatingId.value = null
  }
}

const openBulkGenerate = () => {
  bulkLoading.value = true
  bulkGenerateCertificates(eventId.value)
    .then((res) => {
      bulkResult.value = res.data.data
      showBulkResult.value = true
    })
    .catch((e) => {
      showStatus('error', 'Gagal', e.response?.data?.message || 'Gagal bulk generate.')
    })
    .finally(() => {
      bulkLoading.value = false
    })
}

const publishOne = async (member) => {
  try {
    await publishCertificate(eventId.value, member.certificate.id)
    showStatus('success', 'Dipublish', `Sertifikat ${member.name} berhasil dipublish.`)
    await fetchData()
  } catch (e) {
    showStatus('error', 'Gagal', e.response?.data?.message || 'Gagal publish.')
  }
}

const openPublishAll = async () => {
  publishAllLoading.value = true
  try {
    const res = await publishAllCertificates(eventId.value)
    showStatus('success', 'Publish Semua', res.data.message)
    await fetchData()
  } catch (e) {
    showStatus('error', 'Gagal', e.response?.data?.message || 'Gagal publish semua.')
  } finally {
    publishAllLoading.value = false
  }
}

const openManualUpload = (member) => {
  manualTarget.value = member
  manualFile.value = null
  showManualDialog.value = true
}

const submitManualUpload = async () => {
  manualLoading.value = true
  try {
    await uploadManualCertificate(eventId.value, manualTarget.value.user_id, manualFile.value)
    showManualDialog.value = false
    showStatus('success', 'Upload Berhasil', `Sertifikat manual untuk ${manualTarget.value.name} berhasil diupload.`)
    await fetchData()
  } catch (e) {
    showStatus('error', 'Gagal Upload', e.response?.data?.message || 'Gagal upload sertifikat.')
  } finally {
    manualLoading.value = false
  }
}

const downloadCert = async (member) => {
  try {
    const res = await downloadCertificateAdmin(eventId.value, member.certificate.id)
    const mimeType = res.headers['content-type'] || 'application/pdf'
    const ext = mimeType.includes('pdf') ? 'pdf' : mimeType.includes('png') ? 'png' : 'jpg'
    const url = URL.createObjectURL(new Blob([res.data], { type: mimeType }))
    const link = document.createElement('a')
    link.href = url
    link.download = `Sertifikat_${member.name}.${ext}`
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    showStatus('error', 'Gagal', 'Gagal download sertifikat.')
  }
}

const showStatus = (type, title, message) => {
  statusType.value = type
  statusTitle.value = title
  statusMessage.value = message
  showStatusDialog.value = true
}

onMounted(async () => {
  await fetchData()
  await nextTick()
  animate('.motion-card', { opacity: [0, 1], y: [12, 0] }, { delay: stagger(0.05), duration: 0.35, easing: 'ease-out' })
  animate('.motion-table', { opacity: [0, 1], y: [10, 0] }, { delay: 0.18, duration: 0.35, easing: 'ease-out' })
})
</script>

<style scoped>
.rounded-card { border-radius: 18px; }
.motion-btn { transition: all 0.18s ease; }
</style>
