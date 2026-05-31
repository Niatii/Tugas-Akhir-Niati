<template>
  <q-page class="q-pa-md">
    <div class="flex flex-center">
      <div class="login-card">
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

        <div class="full-width bg-blue-1 q-pa-xl shadow-2" style="border-radius: 12px">
          <q-form @submit.prevent="nextStep" autocomplete="on">
            <div class="q-my-xs">Nama Lengkap <span class="text-negative">*</span></div>
            <q-input
              v-model="name"
              dense
              autocomplete="name"
              borderless
              class="custom-input q-px-md"
              :label="name ? undefined : 'Masukkan nama lengkap kamu'"
            >
              <template v-slot:prepend> <q-icon name="person" /> </template>
              <template v-slot:append>
                <q-icon v-if="errors.name" name="error" color="negative" />
              </template>
            </q-input>
            <span v-if="errors.name" class="error-text q-mb-md">
              {{ errors.name }}
            </span>

            <div class="q-my-xs">NIM <span class="text-negative">*</span></div>
            <q-input
              v-model="nim"
              dense
              type="number"
              autocomplete="nim"
              borderless
              class="custom-input q-px-md"
              :label="nim ? undefined : 'Masukkan Nomor Induk Mahasiswa kamu'"
            >
              <template v-slot:prepend> <q-icon name="badge" /> </template>
              <template v-slot:append>
                <q-icon v-if="errors.nim" name="error" color="negative" />
              </template>
            </q-input>
            <span v-if="errors.nim" class="error-text q-mb-md">
              {{ errors.nim }}
            </span>

            <div class="q-my-xs">Jurusan <span class="text-negative">*</span></div>
            <q-select
              v-model="jurusan"
              dense
              option-label="name"
              option-value="id"
              autocomplete="jurusan"
              :options="jurusanOptions"
              borderless
              class="custom-input q-px-md"
              :label="jurusan ? undefined : 'Masukkan jurusan kamu'"
            >
              <template v-slot:prepend> <q-icon name="school" /> </template>
              <template v-slot:append>
                <q-icon v-if="errors.jurusan" name="error" color="negative" />
              </template>
            </q-select>
            <span v-if="errors.jurusan" class="error-text q-mb-md">
              {{ errors.jurusan }}
            </span>

            <div class="q-my-xs">Program Studi <span class="text-negative">*</span></div>
            <q-select
              v-model="programStudi"
              dense
              option-label="name"
              option-value="id"
              autocomplete="programStudi"
              :options="programStudiOptions"
              borderless
              class="custom-input q-px-md"
              :label="programStudi ? undefined : 'Masukkan program studi kamu'"
            >
              <template v-slot:prepend> <q-icon name="menu_book" /></template>
              <template v-slot:append>
                <q-icon v-if="errors.programStudi" name="error" color="negative" />
              </template>
            </q-select>
            <span v-if="errors.programStudi" class="error-text q-mb-md">
              {{ errors.programStudi }}
            </span>
            <!-- BUTTON -->
            <div class="flex justify-end q-my-lg">
              <q-btn
                label="Selanjutnya"
                unelevated
                class="login-btn bg-indigo-9"
                no-caps
                @click="nextStep"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { onMounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'

import logo from 'src/assets/image/evoma_icon.png'

import { masterApi } from 'src/services/master.api'

const router = useRouter()
const name = ref('')
const nim = ref('')
const jurusan = ref('')
const programStudi = ref('')
const jurusanOptions = ref([])
const programStudiOptions = ref([])

const errors = ref({
  name: '',
  nim: '',
  jurusan: '',
  programStudi: '',
})

function nextStep() {
  if (!validateForm()) return

  const data = {
    name: name.value,
    nim: nim.value,
    jurusan_id: jurusan.value.id,
    prodi_id: programStudi.value.id,
  }

  localStorage.setItem('register_step1', JSON.stringify(data))

  router.push('/auth/register2')
}

function goLogin() {
  router.push('/auth/login')
}

function validateForm() {
  errors.value.name = ''
  errors.value.nim = ''
  errors.value.jurusan = ''
  errors.value.programStudi = ''
  let isValid = true

  if (!name.value) {
    errors.value.name = 'Nama lengkap wajib diisi'
    isValid = false
  }

  if (!nim.value) {
    errors.value.nim = 'NIM wajib diisi'
    isValid = false
  }

  if (!jurusan.value) {
    errors.value.jurusan = 'Jurusan wajib diisi'
    isValid = false
  }

  if (!programStudi.value) {
    errors.value.programStudi = 'Program studi wajib diisi'
    isValid = false
  }

  return isValid
}

onMounted(async () => {
  try {
    jurusanOptions.value = await masterApi.getJurusan()

    const savedData = localStorage.getItem('register_step1')

    if (savedData) {
      const parsed = JSON.parse(savedData)

      name.value = parsed.name || ''
      nim.value = parsed.nim || ''

      if (parsed.jurusan_id) {
        jurusan.value = jurusanOptions.value.find((item) => item.id === parsed.jurusan_id) || null

        programStudiOptions.value = await masterApi.getProdiByJurusan(parsed.jurusan_id)

        programStudi.value =
          programStudiOptions.value.find((item) => item.id === parsed.prodi_id) || null
      }
    }
  } catch (error) {
    console.error(error)
  }
})

watch(jurusan, async (val, oldVal) => {
  if (!val) {
    programStudiOptions.value = []
    programStudi.value = null
    return
  }

  try {
    programStudiOptions.value = await masterApi.getProdiByJurusan(val.id)

    if (oldVal && val.id !== oldVal.id) {
      programStudi.value = null
    }
  } catch (error) {
    console.error(error)
  }
})
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
  border-radius: 20%;
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

.error-text {
  display: block;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 10px;
}
</style>
