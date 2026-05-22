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
            class="custom-input q-px-md q-mb-md"
            :label="namaLengkap ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>

          <!-- NIM (read-only dari profil) -->
          <div class="q-my-xs">NIM <span class="text-red">*</span></div>
          <q-input
            v-model="nim"
            dense
            borderless
            readonly
            class="custom-input q-px-md q-mb-md"
            :label="nim ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>

          <!-- JURUSAN (read-only dari profil) -->
          <div class="q-my-xs">Jurusan <span class="text-red">*</span></div>
          <q-input
            v-model="jurusanNama"
            dense
            borderless
            readonly
            class="custom-input q-px-md q-mb-md"
            :label="jurusanNama ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>

          <!-- PROGRAM STUDI (read-only dari profil) -->
          <div class="q-my-xs">Program Studi <span class="text-red">*</span></div>
          <q-input
            v-model="prodiNama"
            dense
            borderless
            readonly
            class="custom-input q-px-md q-mb-md"
            :label="prodiNama ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>

          <!-- EMAIL (read-only dari profil) -->
          <div class="q-my-xs">Email Aktif <span class="text-red">*</span></div>
          <q-input
            v-model="email"
            dense
            borderless
            readonly
            class="custom-input q-px-md q-mb-md"
            :label="email ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>

          <!-- ANGKATAN (read-only dari profil) -->
          <div class="q-my-xs">Angkatan</div>
          <q-input
            v-model="angkatan"
            dense
            borderless
            readonly
            class="custom-input q-px-md q-mb-md"
            :label="angkatan ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>

          <!-- NOMOR TELEPON (read-only dari profil) -->
          <div class="q-my-xs">Nomor Telepon <span class="text-red">*</span></div>
          <q-input
            v-model="nomorTelepon"
            dense
            borderless
            readonly
            class="custom-input q-px-md q-mb-md"
            :label="nomorTelepon ? undefined : 'Belum diisi di profil'"
          >
            <template v-slot:append>
              <q-icon name="lock" size="16px" color="grey-5" />
            </template>
          </q-input>

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
            class="custom-input q-px-md q-mb-md"
            :label="selectedDivisi ? undefined : 'Pilih divisi yang diinginkan'"
            :loading="loadingEvent"
          />

          <!-- ALASAN (motivasi) -->
          <div class="q-my-xs">Alasan Mengikuti Acara <span class="text-red">*</span></div>
          <q-input
            v-model="alasan"
            dense
            borderless
            type="textarea"
            rows="4"
            class="custom-input q-px-md q-mb-md"
            :label="alasan ? undefined : 'Tuliskan motivasi kamu mengikuti acara ini...'"
          />
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
            :disable="!isFormValid"
            @click="submitForm"
          />
        </div>

        </template>
      </q-card>
    </div>

    <!-- STATUS DIALOG -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="border-radius: 20px; min-width: 380px" class="q-pa-lg text-center">
        <q-icon
          :name="dialogSuccess ? 'check_circle' : 'cancel'"
          :color="dialogSuccess ? 'green-6' : 'red-6'"
          size="64px"
          class="q-mb-md"
        />
        <div class="text-h6 text-bold q-mb-sm">{{ dialogTitle }}</div>
        <div class="text-grey-7 q-mb-lg">{{ dialogMessage }}</div>
        <q-btn
          :color="dialogSuccess ? 'indigo-9' : 'red-8'"
          :label="dialogSuccess ? 'Lihat Acara Saya' : 'Tutup'"
          no-caps
          rounded
          unelevated
          class="q-px-xl"
          v-close-popup
          @click="dialogSuccess ? goToMyEvents() : null"
        />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPublicEventById } from 'src/services/event.api'
import { createEventRegistration, checkMyRegistrationStatus } from 'src/services/event-member.api'
import { masterApi } from 'src/services/master.api'

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
const isFormValid = computed(() => {
  return (
    namaLengkap.value &&
    nim.value &&
    email.value &&
    selectedDivisi.value &&
    alasan.value.trim()
  )
})

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
  if (!isFormValid.value) return

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
</style>
