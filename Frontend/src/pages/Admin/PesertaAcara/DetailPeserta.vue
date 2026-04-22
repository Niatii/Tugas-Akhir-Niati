<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs-->
    <div class="q-py-md q-gutter-sm">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" size="1.2em" color="grey-6" />
        </template>
        <q-breadcrumbs-el label="Kelola Peserta" icon="people" class="text-grey-9" />
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

    <div class="row q-col-gutter-lg">
      <!-- LEFT -->
      <div class="col-12 col-md-4">
        <!-- PROFILE -->
        <q-card flat bordered class="rounded-card q-pa-lg q-mb-lg">
          <div class="column items-center text-center">
            <q-avatar size="120px">
              <img src="https://i.pravatar.cc/300?img=12" />
            </q-avatar>

            <div class="text-h6 text-weight-bold q-mt-md">William James Moriarty</div>

            <div class="text-grey-7">Teknik Informatika</div>

            <q-chip dense color="orange" size="12px" class="q-px-md q-mt-sm" text-color="white"> Menunggu </q-chip>
          </div>

          <q-separator class="q-my-md" />

          <div class="q-gutter-y-sm">
            <div class="row justify-between">
              <span class="text-grey-7">NIM</span>
              <span class="text-weight-medium"> 220411100021 </span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Angkatan</span>
              <span class="text-weight-medium"> 2022 </span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Email</span>
              <span class="text-weight-medium"> william@mail.com </span>
            </div>

            <div class="row justify-between">
              <span class="text-grey-7">Telepon</span>
              <span class="text-weight-medium"> 081234567890 </span>
            </div>
          </div>
        </q-card>

        <!-- RIWAYAT SISTEM -->
        <q-card flat bordered class="rounded-card q-pa-md">
          <div class="row items-center q-mb-md">
            <q-icon name="history" color="indigo-9" size="24px" class="q-mr-sm" />
            <div class="text-subtitle1 text-weight-bold">Riwayat Aktivitas</div>
          </div>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label> Seminar AI Nasional </q-item-label>

                <q-item-label caption> Peserta • 2024 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-chip dense color="positive" size="12px" class="q-px-md" text-color="white"> Selesai </q-chip>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label> Workshop UI/UX </q-item-label>

                <q-item-label caption> Peserta • 2024 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-chip dense color="positive" size="12px" class="q-px-md" text-color="white"> Selesai </q-chip>
              </q-item-section>
            </q-item>
          </q-list>
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

              <div class="text-weight-medium">HMTI Fair 2025</div>
            </div>

            <div class="col-12 col-md-6">
              <div class="text-caption text-grey-7">Divisi Dipilih</div>

              <q-chip dense color="blue-1" text-color="blue-9"> Pubdok </q-chip>
            </div>

            <div class="col-12 col-md-6 q-mt-xs">
              <div class="text-caption text-grey-7">Jurusan</div>

              <div class="text-weight-medium">Teknik Informatika</div>
            </div>

            <div class="col-12 col-md-6 q-mt-xs">
              <div class="text-caption text-grey-7">Program Studi</div>

              <div class="text-weight-medium">D3 Teknik Informatika</div>
            </div>

            <div class="col-12 col-md-6 q-mt-xs">
              <div class="text-caption text-grey-7">Tanggal Daftar</div>

              <div class="text-weight-medium">12 Januari 2025</div>
            </div>

            <div class="col-12 col-md-6 q-mt-xs">
              <div class="text-caption text-grey-7">Status</div>

              <q-chip dense color="orange" size="12px" class="q-px-md" text-color="white"> Menunggu </q-chip>
            </div>
          </div>
        </q-card>

        <!-- ALASAN -->
        <q-card flat bordered class="rounded-card q-pa-lg q-mb-sm">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Alasan Mengikuti Acara</div>

          <div class="text-grey-8">
            Saya ingin menambah pengalaman organisasi, memperluas relasi, dan belajar mengelola
            event skala besar.
          </div>
        </q-card>

        <!-- PENGALAMAN -->
        <q-card flat bordered class="rounded-card q-pa-lg q-mb-sm">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Pengalaman Terkait</div>

          <div class="text-grey-8">
            Pernah menjadi panitia dokumentasi seminar kampus dan mengelola media sosial organisasi.
          </div>
        </q-card>

        <!-- WHY ME -->
        <q-card flat bordered class="rounded-card q-pa-lg q-mb-lg">
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Kenapa Harus Dipilih</div>

          <div class="text-grey-8">
            Saya disiplin, komunikatif, mampu bekerja dalam tim, dan siap bertanggung jawab.
          </div>
        </q-card>

        <!-- ACTION -->
        <div class="row justify-end q-gutter-sm" v-if="eventStatus === 'Pendaftaran Dibuka'">
          <q-btn outline rounded color="negative" icon="close" label="Tolak" no-caps @click="openRejectDialog()" />

          <q-btn rounded color="positive" icon="check" label="Setujui" no-caps  @click="openApproveDialog()" />
        </div>
      </div>
    </div>
    <FooterComponent />
    <ConfirmDialog
      v-model="showApproveDialog"
      type="success"
      title="Approve Peserta"
      message="Apakah Anda yakin ingin menyetujui peserta ini?"
      confirm-label="Ya, Approve"
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
  </q-page>
</template>
<script setup>
import FooterComponent from 'src/components/FooterComponent.vue'
import { ref } from 'vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'

const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const selectedRow = ref(null)
const eventStatus = ref('Pendaftaran Dibuka')
const openApproveDialog = (row) => {
  selectedRow.value = row
  showApproveDialog.value = true
}

const openRejectDialog = (row) => {
  selectedRow.value = row
  showRejectDialog.value = true
}

const confirmApprove = () => {
  if (!selectedRow.value) return

  selectedRow.value.status = 'Approved'

  showApproveDialog.value = false

  selectedRow.value = null
}

const confirmReject = () => {
  if (!selectedRow.value) return

  selectedRow.value.status = 'Rejected'

  showRejectDialog.value = false

  selectedRow.value = null
}
</script>
<style scoped>
.rounded-card {
  border-radius: 18px;
}
</style>
