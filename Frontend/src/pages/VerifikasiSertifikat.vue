<template>
  <q-page class="verify-page flex flex-center">
    <div class="verify-container">
      <!-- HEADER -->
      <div class="text-center q-mb-xl">
        <q-avatar size="72px" color="indigo-9" text-color="white" icon="workspace_premium" />
        <div class="text-h5 text-weight-bold q-mt-md">Verifikasi Sertifikat</div>
        <div class="text-grey-7">Masukkan nomor sertifikat untuk memverifikasi keasliannya.</div>
      </div>

      <!-- INPUT -->
      <q-card flat bordered class="rounded-card q-pa-lg q-mb-lg">
        <div class="text-subtitle2 text-weight-bold q-mb-md">Nomor Sertifikat</div>
        <div class="row q-gutter-sm">
          <q-input
            v-model="certNumber"
            class="col"
            outlined
            dense
            placeholder="Contoh: CERT/1/2026/0001"
            @keyup.enter="verify"
          />
          <q-btn
            color="indigo-9"
            icon="search"
            label="Verifikasi"
            no-caps
            :loading="loading"
            @click="verify"
          />
        </div>
      </q-card>

      <!-- RESULT -->
      <transition name="fade-slide">
        <div v-if="result" class="q-mb-xl">
          <!-- VALID -->
          <q-card
            v-if="result.valid"
            flat
            class="rounded-card valid-card"
          >
            <q-card-section class="valid-header text-white">
              <div class="row items-center">
                <q-icon name="verified" size="40px" class="q-mr-md" />
                <div>
                  <div class="text-h6 text-weight-bold">Sertifikat Valid</div>
                  <div class="text-body2 text-green-2">Dokumen ini terverifikasi dan sah.</div>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <div class="info-item">
                    <div class="text-caption text-grey-6">Penerima</div>
                    <div class="text-body1 text-weight-bold">{{ result.recipient_name }}</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="info-item">
                    <div class="text-caption text-grey-6">Nama Acara</div>
                    <div class="text-body1 text-weight-medium">{{ result.event_name }}</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="info-item">
                    <div class="text-caption text-grey-6">Nomor Sertifikat</div>
                    <div class="text-body2 text-mono text-indigo-9">{{ result.certificate_number }}</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="info-item">
                    <div class="text-caption text-grey-6">Tanggal Terbit</div>
                    <div class="text-body2">{{ formatDate(result.issued_at) }}</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="info-item">
                    <div class="text-caption text-grey-6">Tanggal Acara</div>
                    <div class="text-body2">{{ formatDate(result.event_date) }}</div>
                  </div>
                </div>
                <div class="col-12 col-sm-6">
                  <div class="info-item">
                    <div class="text-caption text-grey-6">Dipublikasikan</div>
                    <div class="text-body2">{{ formatDate(result.published_at) }}</div>
                  </div>
                </div>
              </div>

              <q-chip
                v-if="result.is_manual"
                class="q-mt-md"
                color="orange-1"
                text-color="orange-9"
                icon="upload_file"
              >
                Sertifikat Manual
              </q-chip>
            </q-card-section>
          </q-card>

          <!-- INVALID -->
          <q-card v-else flat class="rounded-card invalid-card">
            <q-card-section class="invalid-header text-white">
              <div class="row items-center">
                <q-icon name="cancel" size="40px" class="q-mr-md" />
                <div>
                  <div class="text-h6 text-weight-bold">Sertifikat Tidak Valid</div>
                  <div class="text-body2 text-red-2">{{ result.message }}</div>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="text-grey-7">
              Pastikan nomor sertifikat yang dimasukkan benar dan sertifikat telah dipublikasikan oleh admin.
            </q-card-section>
          </q-card>
        </div>
      </transition>

      <!-- BACK TO HOME -->
      <div class="text-center">
        <q-btn flat color="indigo-9" icon="home" label="Kembali ke Beranda" no-caps @click="$router.push('/')" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { verifyCertificate } from 'src/services/certificate.api'

const route = useRoute()

const certNumber = ref('')
const loading = ref(false)
const result = ref(null)

const formatDate = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const verify = async () => {
  if (!certNumber.value.trim()) return
  loading.value = true
  result.value = null
  try {
    const res = await verifyCertificate(certNumber.value.trim())
    result.value = res.data.data
  } catch {
    result.value = { valid: false, message: 'Terjadi kesalahan. Coba lagi.' }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Auto-load from URL param (QR scan)
  if (route.params.number) {
    certNumber.value = route.params.number
    verify()
  }
})
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7ff 0%, #e8ecff 100%);
  padding: 40px 16px;
}

.verify-container {
  width: 100%;
  max-width: 680px;
}

.rounded-card { border-radius: 18px; }

.valid-card { overflow: hidden; }
.valid-header {
  background: linear-gradient(135deg, #1a7a4a 0%, #2ea86a 100%);
  padding: 24px;
}

.invalid-card { overflow: hidden; }
.invalid-header {
  background: linear-gradient(135deg, #c62828 0%, #e53935 100%);
  padding: 24px;
}

.info-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
}

.text-mono { font-family: 'Courier New', monospace; }

.fade-slide-enter-active,
.fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(16px); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
