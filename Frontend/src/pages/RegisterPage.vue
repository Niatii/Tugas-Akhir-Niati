<template>
  <q-page class="q-pa-md">
    <div class="flex flex-center">
      <div class="login-card">
        <!-- HEAD -->
        <div class="text-center">
          <img :src="logo" class="logo-card q-mb-xs" />  
          <div class="text-h6 text-weight-medium">
            Buat akun untuk mengakses kegiatan dan informasi
          </div>
          <div class="text-caption text-grey-8">
            Pastikan data yang Anda masukkan benar dan dapat dipertanggungjawabkan.
          </div>
          <div class="text-center text-caption q-my-md">
            Sudah punya akun?
            <span
              class="text-indigo-9 text-weight-medium link-register q-ml-xs cursor-pointer"
              @click="goLogin"
            >
              Masuk ke Akun Saya
            </span>
          </div>
        </div>

        <!-- BODY -->
        <div class="full-width bg-blue-2 q-pa-xl" style="border-radius: 12px">
          <!-- NAMA LENGKAP -->
          <div class="q-my-xs">Nama Lengkap</div>
          <q-input
            v-model="namaLengkap"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="namaLengkap ? undefined : 'Masukkan nama lengkap kamu'"
          >
            <template v-slot:prepend> <q-icon name="person" /> </template>
          </q-input>

          <!-- NIM -->
          <div class="q-my-xs">NIM</div>
          <q-input
            v-model="nim"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="nim ? undefined : 'Masukkan Nomor Induk Mahasiswa kamu'"
          >
            <template v-slot:prepend> <q-icon name="badge" /> </template>
          </q-input>

          <!-- JURUSAN -->
          <div class="q-my-xs">Jurusan</div>
          <q-select
            v-model="jurusan"
            dense
            :options="jurusanOptions"
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="jurusan ? undefined : 'Masukkan jurusan kamu'"
          >
            <template v-slot:prepend> <q-icon name="school" /> </template>
          </q-select>

          <!-- PROGRAM STUDI -->
          <div class="q-my-xs">Program Studi</div>
          <q-select
            v-model="programStudi"
            dense
            :options="programStudiOptions"
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="programStudi ? undefined : 'Masukkan program studi kamu'"
          >
            <template v-slot:prepend> <q-icon name="menu_book" /> </template>
          </q-select>

          <!-- BUTTON -->
          <div class="flex justify-end q-my-lg">
            <q-btn
              label="Selanjutnya"
              unelevated
              class="login-btn bg-indigo-9"
              no-caps
              to="/auth/register2"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import logo from 'src/assets/image/logo.jpg'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const namaLengkap = ref('')
const nim = ref('')
const jurusan = ref('')
const programStudi = ref('')

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

function goLogin() {
  router.push('/auth/login')
}
</script>

<style scoped>
.logo {
  width: 320px;
  max-width: 80%;
}

.login-card {
  width: 100%;
  max-width: 700px;
  padding: 20px 20px 30px;
}

.logo-card {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 50%;
}

.custom-input {
  background: white;
  border-radius: 30px;
}

.login-btn {
  color: white;
  width: 180px;
  border-radius: 25px;
}
</style>
