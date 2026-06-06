<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="q-mb-lg">
      <div class="text-h5 text-weight-bold">Sertifikat Saya</div>
      <div class="text-grey-7">Daftar sertifikat yang telah diterbitkan untuk Anda.</div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="indigo-9" size="50px" />
    </div>

    <!-- EMPTY -->
    <div v-else-if="!certificates.length">
      <q-card flat bordered class="rounded-card q-pa-xl text-center">
        <q-icon name="workspace_premium" size="72px" color="grey-3" />
        <div class="text-h6 text-grey-6 q-mt-md">Belum ada sertifikat</div>
        <div class="text-grey-5 q-mt-sm">
          Sertifikat akan muncul di sini setelah admin mempublikasikannya.
        </div>
      </q-card>
    </div>

    <!-- GRID -->
    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="cert in certificates"
        :key="cert.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card class="cert-card rounded-card" flat bordered>
          <!-- TOP BANNER -->
          <div class="cert-banner">
            <q-icon name="workspace_premium" size="48px" color="white" style="opacity:0.9" />
          </div>

          <q-card-section>
            <div class="text-weight-bold text-body1 ellipsis-2-lines">{{ cert.event?.title }}</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              <q-icon name="calendar_today" size="12px" class="q-mr-xs" />
              {{ formatDate(cert.event?.start_date) }}
            </div>
            <div class="q-mt-sm">
              <q-chip dense color="indigo-1" text-color="indigo-9" size="sm" icon="tag">
                {{ cert.certificate_number }}
              </q-chip>
            </div>
            <div class="q-mt-xs">
              <q-chip dense color="green-1" text-color="positive" size="sm" icon="check_circle">
                Terbit: {{ formatDate(cert.published_at) }}
              </q-chip>
              <q-chip
                v-if="cert.is_manual"
                dense color="orange-1" text-color="orange-9" size="sm" icon="upload_file"
                class="q-ml-xs"
              >
                Manual
              </q-chip>
            </div>
          </q-card-section>

          <q-card-actions class="q-px-md q-pb-md">
            <q-btn
              unelevated
              color="indigo-9"
              icon="download"
              label="Unduh"
              no-caps
              rounded
              class="full-width"
              :loading="downloadingId === cert.id"
              @click="downloadCert(cert)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!-- STATUS DIALOG -->
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
import { ref, onMounted } from 'vue'
import { getMyCertificates, downloadMyCertificate } from 'src/services/certificate.api'
import FooterComponent from 'src/components/FooterComponent.vue'
import StatusDialog from 'src/components/StatusDialog.vue'

const loading = ref(false)
const certificates = ref([])
const downloadingId = ref(null)

const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')

const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const fetchCertificates = async () => {
  loading.value = true
  try {
    const res = await getMyCertificates()
    certificates.value = res.data.data?.certificates || []
  } catch (e) {
    console.error(e)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal Memuat'
    dialogMessage.value = 'Gagal memuat daftar sertifikat. Silakan coba lagi.'
    showDialog.value = true
  } finally {
    loading.value = false
  }
}

const downloadCert = async (cert) => {
  downloadingId.value = cert.id
  try {
    const res = await downloadMyCertificate(cert.id)
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `Sertifikat_${cert.event?.title || cert.id}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error(e)
    const msg = e.response?.data?.message || 'Gagal mengunduh sertifikat.'
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal Download'
    dialogMessage.value = msg
    showDialog.value = true
  } finally {
    downloadingId.value = null
  }
}

onMounted(fetchCertificates)
</script>

<style scoped>
.rounded-card { border-radius: 18px; }
.cert-card { overflow: hidden; transition: box-shadow 0.2s; }
.cert-card:hover { box-shadow: 0 6px 24px rgba(80, 80, 200, 0.12); }
.cert-banner {
  height: 100px;
  background: linear-gradient(135deg, #5c6bc0 0%, #7c4dff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
