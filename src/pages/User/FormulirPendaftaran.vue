<template>
  <q-page class="q-px-xl q-py-md">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Daftar Acara" icon="event" />
        <q-breadcrumbs-el label="Detail Acara" />
        <q-breadcrumbs-el label="Formulir Pendaftaran" icon="content_paste" />
      </q-breadcrumbs>
    </div>

    <div class="q-px-xl flex justify-center">
      <q-card style="border-radius: 20px; min-width: 850px" class="q-pa-lg">
        <div class="text-h6 text-bold q-mb-md text-center">Formulir Pendaftaran</div>

        <div class="q-px-md q-mb-xl">
          <div class="q-my-xs">Nama Lengkap <span class="text-red">*</span></div>
          <q-input
            v-model="namaLengkap"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="namaLengkap ? undefined : 'Masukkan nama lengkap kamu'"
          />

          <div class="q-my-xs">NIM <span class="text-red">*</span></div>
          <q-input
            v-model="nim"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="nim ? undefined : 'Masukkan Nomor Induk Mahasiswa kamu'"
          />

          <div class="q-my-xs">Jurusan <span class="text-red">*</span></div>
          <q-select
            v-model="jurusan"
            dense
            :options="jurusanOptions"
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="jurusan ? undefined : 'Masukkan jurusan kamu'"
          />

          <!-- PROGRAM STUDI -->
          <div class="q-my-xs">Program Studi <span class="text-red">*</span></div>
          <q-select
            v-model="programStudi"
            dense
            :options="programStudiOptions"
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="programStudi ? undefined : 'Masukkan program studi kamu'"
          />

          <div class="q-my-xs">Divisi yang diinginkan <span class="text-red">*</span></div>
          <q-select
            v-model="divisi"
            dense
            :options="divisiOptions"
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="divisi ? undefined : 'Masukkan divisi yang diinginkan'"
          />

          <div class="q-my-xs">Email aktif<span class="text-red">*</span></div>
          <q-input
            v-model="email"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="email ? undefined : 'Masukkan email kamu'"
          />

          <div class="q-my-xs">Nomor Telepon <span class="text-red">*</span></div>
          <q-input
            v-model="nomorTelepon"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="nomorTelepon ? undefined : 'Masukkan nomor telepon kamu'"
          />

          <div class="q-my-xs">Alasan mengikuti acara <span class="text-red">*</span></div>
          <q-input
            v-model="alasan"
            dense
            borderless
            type="textarea"
            rows="5"
            class="custom-input q-px-md q-mb-md"
            :label="alasan ? undefined : 'Masukkan alasan kamu mengikuti acara'"
          />

          <div class="q-my-xs">Pengalaman terkait (opsional)</div>
          <q-input
            v-model="pengalaman"
            dense
            borderless
            type="textarea"
            rows="5"
            class="custom-input q-px-md q-mb-md"
            :label="pengalaman ? undefined : 'Masukkan pengalaman terkait kamu'"
          />

          <div class="q-my-xs">Kenapa harus Kamu <span class="text-red">*</span></div>
          <q-input
            v-model="kenapa"
            dense
            borderless
            type="textarea"
            rows="5"
            class="custom-input q-px-md q-mb-md"
            :label="kenapa ? undefined : 'Masukkan alasan kenapa harus kamu yang dipilih'"
          />
        </div>
        <div class="flex justify-center q-py-md">
          <q-btn
            outline
            color="indigo-9"
            label="Kirim"
            no-caps
            rounded
            style="min-width: 450px"
            class="q-px-xl q-my-md bg-white"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'

const namaLengkap = ref('')
const nim = ref('')
const jurusan = ref('')
const programStudi = ref('')
const divisi = ref('')
const email = ref('')
const nomorTelepon = ref('')
const alasan = ref('')
const pengalaman = ref('')
const kenapa = ref('')

const jurusanOptions = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Teknik Industri',
  'Manajemen',
  'Akuntansi',
  'Ilmu Komunikasi',
]

const programStudiOptions = [
  'D3 Teknik Informatika',
  'D3 Sistem Informasi',
  'D3 Teknik Industri',
  'S1 Manajemen',
  'S1 Akuntansi',
  'S1 Ilmu Komunikasi',
]

const divisiOptions = ['Acara', 'Humas', 'Pubdok', 'Konsumsi', 'Perlengkapan', 'Keamanan']
</script>
<style>
/* Input rounded besar */
.custom-input {
  background: rgb(209, 229, 249);
  border-radius: 30px;
}
</style>
