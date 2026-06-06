<template>
  <q-page class="q-px-xl q-py-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Daftar Acara" icon="event" to="/user/daftar-acara" />
        <q-breadcrumbs-el :label="event.title || 'Detail Acara'" :to="`/user/detail-acara/${eventId}`" />
        <q-breadcrumbs-el label="Formulir Pendaftaran" icon="content_paste" />
      </q-breadcrumbs>
    </div>

    <div class="q-px-xl flex justify-center q-mb-xl">
      <q-card style="border-radius: 20px; min-width: 850px" class="q-pa-lg">
        <!-- HEADER -->
        <div class="text-h6 text-bold q-mb-xs text-center">Formulir Pendaftaran</div>
        <div class="text-center text-grey-7 text-caption q-mb-lg">
          {{ event.title || '...' }}
        </div>

        <!-- STATUS: LOADING CEK -->
        <div v-if="checkingStatus" class="flex flex-center q-py-xl">
          <q-spinner-dots color="indigo-9" size="36px" />
        </div>

        <!-- STATUS: SUDAH DAFTAR (PENDING) -->
        <div v-else-if="registrationStatus === 0" class="q-pa-xl text-center">
          <q-icon name="hourglass_top" color="orange-7" size="72px" />
          <div class="text-h6 text-weight-bold q-mt-md">Pendaftaran Sedang Diproses</div>
          <div class="text-grey-7 q-mt-sm q-mb-lg">
            Kamu sudah mendaftar di acara ini dan sedang menunggu persetujuan panitia.
            Pantau statusnya di halaman <strong>Acara Saya</strong>.
          </div>
          <q-btn color="indigo-9" label="Lihat Acara Saya" no-caps rounded unelevated @click="goToMyEvents" />
        </div>

        <!-- STATUS: SUDAH DITERIMA (APPROVED) -->
        <div v-else-if="registrationStatus === 1" class="q-pa-xl text-center">
          <q-icon name="check_circle" color="positive" size="72px" />
          <div class="text-h6 text-weight-bold q-mt-md">Kamu Sudah Terdaftar!</div>
          <div class="text-grey-7 q-mt-sm q-mb-lg">
            Pendaftaranmu di acara ini telah <strong>diterima</strong>.
            Kunjungi halaman Acara Saya untuk melihat detail kegiatan.
          </div>
          <q-btn color="positive" label="Lihat Acara Saya" no-caps rounded unelevated @click="goToMyEvents" />
        </div>

        <!-- FORM (belum daftar ATAU sudah ditolak) -->
        <template v-else>
          <!-- BANNER DITOLAK -->
          <q-banner
            v-if="registrationStatus === 2"
            rounded
            class="bg-red-1 text-red-9 q-mb-lg"
            style="border-radius: 14px"
          >
            <template v-slot:avatar>
              <q-icon name="cancel" color="red-8" />
            </template>
            Pendaftaran kamu sebelumnya <strong>ditolak</strong>. Kamu dapat mendaftar ulang dengan mengisi formulir di bawah.
          </q-banner>

          <!-- INFO AUTO-FILL -->
          <q-banner rounded class="bg-indigo-1 text-indigo-9 q-mb-lg" style="border-radius: 14px;">
            <template v-slot:avatar>
              <q-icon name="info" color="indigo-8" />
            </template>
            Data profil kamu telah diisi otomatis. Pastikan profil kamu sudah lengkap dan benar sebelum mendaftar.
          </q-banner>

        <div class="q-px-md q-mb-xl">
          <!-- NAMA LENGKAP (read-only dari profil) -->
          <div class="q-my-xs">Nama Lengkap <span class="text-red">*</span></div>
          <q-input
            v-model="namaLengkap"
            dense
            borderless
            readonly
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.namaLengkap }"
            :label="namaLengkap ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon v-if="errors.namaLengkap" name="error" color="negative" />
              <q-icon v-else name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>
          <span v-if="errors.namaLengkap" class="error-text q-mb-md">
            {{ errors.namaLengkap }}
          </span>

          <!-- NIM (read-only dari profil) -->
          <div class="q-my-xs">NIM <span class="text-red">*</span></div>
          <q-input
            v-model="nim"
            dense
            borderless
            readonly
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.nim }"
            :label="nim ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon v-if="errors.nim" name="error" color="negative" />
              <q-icon v-else name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>
          <span v-if="errors.nim" class="error-text q-mb-md">
            {{ errors.nim }}
          </span>

          <!-- JURUSAN (read-only dari profil) -->
          <div class="q-my-xs">Jurusan <span class="text-red">*</span></div>
          <q-input
            v-model="jurusanNama"
            dense
            borderless
            readonly
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.jurusanNama }"
            :label="jurusanNama ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon v-if="errors.jurusanNama" name="error" color="negative" />
              <q-icon v-else name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>
          <span v-if="errors.jurusanNama" class="error-text q-mb-md">
            {{ errors.jurusanNama }}
          </span>

          <!-- PROGRAM STUDI (read-only dari profil) -->
          <div class="q-my-xs">Program Studi <span class="text-red">*</span></div>
          <q-input
            v-model="prodiNama"
            dense
            borderless
            readonly
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.prodiNama }"
            :label="prodiNama ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon v-if="errors.prodiNama" name="error" color="negative" />
              <q-icon v-else name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>
          <span v-if="errors.prodiNama" class="error-text q-mb-md">
            {{ errors.prodiNama }}
          </span>

          <!-- EMAIL (read-only dari profil) -->
          <div class="q-my-xs">Email Aktif <span class="text-red">*</span></div>
          <q-input
            v-model="email"
            dense
            borderless
            readonly
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.email }"
            :label="email ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon v-if="errors.email" name="error" color="negative" />
              <q-icon v-else name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>
          <span v-if="errors.email" class="error-text q-mb-md">
            {{ errors.email }}
          </span>

          <!-- ANGKATAN (read-only dari profil) -->
          <div class="q-my-xs">Angkatan <span class="text-red">*</span></div>
          <q-input
            v-model="angkatan"
            dense
            borderless
            readonly
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.angkatan }"
            :label="angkatan ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon v-if="errors.angkatan" name="error" color="negative" />
              <q-icon v-else name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>
          <span v-if="errors.angkatan" class="error-text q-mb-md">
            {{ errors.angkatan }}
          </span>

          <!-- NOMOR TELEPON (read-only dari profil) -->
          <div class="q-my-xs">Nomor Telepon <span class="text-red">*</span></div>
          <q-input
            v-model="nomorTelepon"
            dense
            borderless
            readonly
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.nomorTelepon }"
            :label="nomorTelepon ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon v-if="errors.nomorTelepon" name="error" color="negative" />
              <q-icon v-else name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>
          <span v-if="errors.nomorTelepon" class="error-text q-mb-md">
            {{ errors.nomorTelepon }}
          </span>

          <!-- DIVISI (dari event yang dipilih) -->
          <div class="q-my-xs">Divisi yang Diinginkan <span class="text-red">*</span></div>
          <q-select
            v-model="selectedDivisi"
            dense
            :options="divisiOptions"
            borderless
            option-label="name"
            option-value="id"
            emit-value
            map-options
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.selectedDivisi }"
            :label="selectedDivisi ? undefined : 'Pilih divisi yang diinginkan'"
            :loading="loadingEvent"
          >
            <template v-slot:append>
              <q-icon v-if="errors.selectedDivisi" name="error" color="negative" />
            </template>
          </q-select>
          <span v-if="errors.selectedDivisi" class="error-text q-mb-md">
            {{ errors.selectedDivisi }}
          </span>

          <!-- ALASAN (motivasi) -->
          <div class="q-my-xs">Alasan Mengikuti Acara <span class="text-red">*</span></div>
          <q-input
            v-model="alasan"
            dense
            borderless
            type="textarea"
            rows="4"
            class="custom-input q-px-md"
            :class="{ 'q-mb-md': !errors.alasan }"
            :label="alasan ? undefined : 'Tuliskan motivasi kamu mengikuti acara ini...'"
          />
          <span v-if="errors.alasan" class="error-text q-mb-md">
            {{ errors.alasan }}
          </span>
        </div>

        <!-- SUBMIT BUTTON -->
        <div class="flex justify-center q-py-md">
          <q-btn
            color="indigo-9"
            label="Kirim Pendaftaran"
            no-caps
            rounded
            unelevated
            style="min-width: 450px"
            class="q-px-xl q-my-md"
            :loading="loading"
            @click="submitForm"
          />
        </div>

        </template>
      </q-card>
    </div>

    <!-- STATUS DIALOG -->
    <StatusDialog
      v-model="showDialog"
      :type="dialogSuccess ? 'success' : 'error'"
      :title="dialogTitle"
      :message="dialogMessage"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPublicEventById } from 'src/services/event.api'
import { createEventRegistration, checkMyRegistrationStatus } from 'src/services/event-member.api'
import { masterApi } from 'src/services/master.api'
import StatusDialog from 'src/components/StatusDialog.vue'

const route = useRoute()
const router = useRouter()

const eventId = computed(() => route.params.eventId)

// ── Data profil (auto-fill, readonly) ─────────────────────────
const namaLengkap = ref('')
const nim = ref('')
const jurusanNama = ref('')
const prodiNama = ref('')
const email = ref('')
const nomorTelepon = ref('')
const angkatan = ref('')

// ── Data form yang bisa diisi user ────────────────────────────
const selectedDivisi = ref(null)
const alasan = ref('')

// ── Event & Divisi ─────────────────────────────────────────────
const event = ref({})
const divisiOptions = ref([])
const loadingEvent = ref(false)

// ── State UI ───────────────────────────────────────────────────
const loading = ref(false)
const checkingStatus = ref(false)
const registrationStatus = ref(null) // null=belum daftar, 0=pending, 1=approved, 2=rejected
const showDialog = ref(false)
const dialogSuccess = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')

// ── Validasi form ──────────────────────────────────────────────
const errors = ref({
  namaLengkap: '',
  nim: '',
  jurusanNama: '',
  prodiNama: '',
  email: '',
  angkatan: '',
  nomorTelepon: '',
  selectedDivisi: '',
  alasan: '',
})

function validateForm() {
  errors.value.namaLengkap = ''
  errors.value.nim = ''
  errors.value.jurusanNama = ''
  errors.value.prodiNama = ''
  errors.value.email = ''
  errors.value.angkatan = ''
  errors.value.nomorTelepon = ''
  errors.value.selectedDivisi = ''
  errors.value.alasan = ''

  let isValid = true

  if (!namaLengkap.value) {
    errors.value.namaLengkap = 'Nama lengkap wajib diisi. Silakan lengkapi di profil Anda.'
    isValid = false
  }

  if (!nim.value) {
    errors.value.nim = 'NIM wajib diisi. Silakan lengkapi di profil Anda.'
    isValid = false
  }

  if (!jurusanNama.value) {
    errors.value.jurusanNama = 'Jurusan wajib diisi. Silakan lengkapi di profil Anda.'
    isValid = false
  }

  if (!prodiNama.value) {
    errors.value.prodiNama = 'Program studi wajib diisi. Silakan lengkapi di profil Anda.'
    isValid = false
  }

  if (!email.value) {
    errors.value.email = 'Email wajib diisi. Silakan lengkapi di profil Anda.'
    isValid = false
  }

  if (!angkatan.value) {
    errors.value.angkatan = 'Angkatan wajib diisi. Silakan lengkapi di profil Anda.'
    isValid = false
  }

  if (!nomorTelepon.value) {
    errors.value.nomorTelepon = 'Nomor telepon wajib diisi. Silakan lengkapi di profil Anda.'
    isValid = false
  }

  if (!selectedDivisi.value) {
    errors.value.selectedDivisi = 'Divisi wajib dipilih'
    isValid = false
  }

  if (!alasan.value || !alasan.value.trim()) {
    errors.value.alasan = 'Alasan wajib diisi'
    isValid = false
  }

  return isValid
}

// ── Fetch data profil dari localStorage ───────────────────────
const loadProfile = async () => {
  const storedUser = localStorage.getItem('user')
  if (!storedUser) return

  const user = JSON.parse(storedUser)
  namaLengkap.value = user.name || ''
  nim.value = user.nim || ''
  email.value = user.email || ''
  nomorTelepon.value = user.phone_number || ''
  angkatan.value = user.batch_year || ''

  // Cari nama jurusan dari master data
  if (user.jurusan_id) {
    try {
      const jurusanList = await masterApi.getJurusan()
      const found = jurusanList.find((j) => j.id === user.jurusan_id)
      jurusanNama.value = found?.name || ''
    } catch (e) {
      console.error('Gagal mengambil jurusan:', e)
    }
  }

  // Cari nama prodi dari master data
  if (user.jurusan_id && user.prodi_id) {
    try {
      const prodiList = await masterApi.getProdiByJurusan(user.jurusan_id)
      const found = prodiList.find((p) => p.id === user.prodi_id)
      prodiNama.value = found?.name || ''
    } catch (e) {
      console.error('Gagal mengambil prodi:', e)
    }
  }
}

// ── Fetch detail event & daftar divisi ────────────────────────
const fetchEvent = async () => {
  if (!eventId.value) return
  loadingEvent.value = true
  try {
    const res = await getPublicEventById(eventId.value)
    event.value = res.data.data
    divisiOptions.value = res.data.data.divisions || []
  } catch (error) {
    console.error('Gagal mengambil detail event:', error)
  } finally {
    loadingEvent.value = false
  }
}

// ── Submit form ────────────────────────────────────────────────
const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    // user_id akan diambil dari JWT token di backend
    const payload = {
      event_id: Number(eventId.value),
      division_id: selectedDivisi.value,
      position: 'Anggota',
      reason: alasan.value.trim(),
    }

    await createEventRegistration(payload)

    dialogSuccess.value = true
    dialogTitle.value = 'Pendaftaran Berhasil!'
    dialogMessage.value =
      'Pendaftaran kamu telah dikirim. Pantau status pendaftaran di halaman Acara Saya.'
    showDialog.value = true

    setTimeout(() => {
      goToMyEvents()
    }, 1200)
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Terjadi kesalahan saat mengirim pendaftaran.'
    dialogSuccess.value = false
    dialogTitle.value = 'Pendaftaran Gagal'
    dialogMessage.value = msg
    showDialog.value = true
  } finally {
    loading.value = false
  }
}

const goToMyEvents = () => {
  router.push('/user/acara-saya')
}

// ── Cek status registrasi user di event ini ────────────────────
const checkRegistrationStatus = async () => {
  if (!eventId.value) return
  checkingStatus.value = true
  try {
    const res = await checkMyRegistrationStatus(eventId.value)
    const data = res.data.data
    registrationStatus.value = data.registered ? data.status : null
  } catch {
    // Jika gagal cek (misal belum login), abaikan — backend akan handle saat submit
    registrationStatus.value = null
  } finally {
    checkingStatus.value = false
  }
}

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([loadProfile(), fetchEvent(), checkRegistrationStatus()])
})
</script>

<style>
.custom-input {
  background: rgb(209, 229, 249);
  border-radius: 30px;
}
.error-text {
  display: block;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 10px;
}
</style>
