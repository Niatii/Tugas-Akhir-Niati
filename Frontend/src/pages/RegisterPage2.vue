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
          <q-form @submit.prevent="handleRegister" autocomplete="on">
            <div class="q-my-xs">Email<span class="text-negative">*</span></div>
            <q-input
              v-model="email"
              dense
              borderless
              class="custom-input q-px-md"
              :label="email ? undefined : 'Masukkan email kamu'"
            >
              <template v-slot:prepend> <q-icon name="email" /> </template>
              <template v-slot:append>
                <q-icon v-if="errors.email" name="error" color="negative" />
              </template>
            </q-input>
            <span v-if="errors.email" class="error-text q-mb-md">
              {{ errors.email }}
            </span>

            <div class="q-my-xs">Nama Pengguna<span class="text-negative">*</span></div>
            <q-input
              v-model="username"
              dense
              borderless
              class="custom-input q-px-md"
              :label="username ? undefined : 'Masukkan nama pengguna kamu'"
            >
              <template v-slot:prepend> <q-icon name="person" /> </template>
              <template v-slot:append>
                <q-icon v-if="errors.username" name="error" color="negative" />
              </template>
            </q-input>
            <span v-if="errors.username" class="error-text q-mb-md">
              {{ errors.username }}
            </span>

            <div class="text-caption text-grey-7 q-mb-sm q-mt-md">
              Gunakan kata sandi dengan minimal 8 karakter yang terdiri dari kombinasi huruf dan
              angka untuk meningkatkan keamanan akun.
            </div>
            <div class="q-my-xs">Kata Sandi<span class="text-negative">*</span></div>
            <q-input
              v-model="kataSandi"
              :type="showPassword ? 'text' : 'password'"
              dense
              borderless
              class="custom-input q-px-md"
              :label="kataSandi ? undefined : 'Masukkan kata sandi kamu'"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
                <q-icon v-if="errors.kataSandi" name="error" color="negative" />
              </template>
            </q-input>
            <span v-if="errors.kataSandi" class="error-text q-mb-md">
              {{ errors.kataSandi }}
            </span>

            <div class="q-my-xs">Konfirmasi Kata Sandi<span class="text-negative">*</span></div>
            <q-input
              v-model="konfirmasiKataSandi"
              :type="showConfirmPassword ? 'text' : 'password'"
              dense
              borderless
              class="custom-input q-px-md"
              :label="konfirmasiKataSandi ? undefined : 'Masukkan konfirmasi kata sandi kamu'"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
                <q-icon v-if="errors.konfirmasiKataSandi" name="error" color="negative" />
              </template>
            </q-input>
            <span v-if="errors.konfirmasiKataSandi" class="error-text q-mb-md">
              {{ errors.konfirmasiKataSandi }}
            </span>

            <div class="flex justify-between q-mt-xl">
              <q-btn
                label="Kembali"
                outline
                color="indigo-9"
                no-caps
                class="login-btn bg-white"
                @click="goBack"
              />
              <q-btn
                label="Daftar"
                unelevated
                class="login-btn bg-indigo-9"
                no-caps
                @click="handleRegister"
              />
            </div>
          </q-form>
        </div>
      </div>
    </div>
    <StatusDialog
      v-model="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
    />
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import logo from 'src/assets/image/evoma_icon.png'
import StatusDialog from 'src/components/StatusDialog.vue'

import { authApi } from 'src/services/master.api'

const router = useRouter()
const email = ref('')
const username = ref('')
const kataSandi = ref('')
const konfirmasiKataSandi = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const errors = ref({
  email: '',
  username: '',
  kataSandi: '',
  konfirmasiKataSandi: '',
})

function goBack() {
  router.push('/auth/register')
}

function goLogin() {
  router.push('/auth/login')
}

function validateForm() {
  errors.value.email = ''
  errors.value.username = ''
  errors.value.kataSandi = ''
  errors.value.konfirmasiKataSandi = ''

  let isValid = true

  if (!email.value) {
    errors.value.email = 'Email wajib diisi'
    isValid = false
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email.value)) {
      errors.value.email = 'Format email tidak valid'
      isValid = false
    }
  }

  if (!username.value) {
    errors.value.username = 'Username wajib diisi'
    isValid = false
  }

  if (!kataSandi.value) {
    errors.value.kataSandi = 'Kata sandi wajib diisi'
    isValid = false
  }

  if (!konfirmasiKataSandi.value) {
    errors.value.konfirmasiKataSandi = 'Konfirmasi kata sandi wajib diisi'
    isValid = false
  }

  return isValid
}

async function handleRegister() {
  const step1 = JSON.parse(localStorage.getItem('register_step1'))

  if (!validateForm()) return

  if (kataSandi.value !== konfirmasiKataSandi.value) {
    dialogType.value = 'error'
    dialogTitle.value = 'Registrasi Gagal'
    dialogMessage.value = 'Konfirmasi password tidak sama'

    showDialog.value = true
    return
  }

  const payload = {
    ...step1,
    role: '1',
    email: email.value,
    username: username.value,
    password: kataSandi.value,
    confirm_password: konfirmasiKataSandi.value,
  }

  try {
    await authApi.registerPanitia(payload)

    dialogType.value = 'success'
    dialogTitle.value = 'Registrasi Berhasil'
    dialogMessage.value = 'Akun berhasil dibuat 🎉'

    showDialog.value = true

    localStorage.removeItem('register_step1')

    setTimeout(() => {
      router.push('/auth/login')
    }, 1200)
  } catch (error) {
    dialogType.value = 'error'
    dialogTitle.value = 'Registrasi Gagal'

    const backendMessage = error.response?.data?.response?.message

    dialogMessage.value = Array.isArray(backendMessage)
      ? backendMessage.join(', ')
      : backendMessage || 'Registrasi gagal, coba lagi'

    showDialog.value = true
  }
}

onMounted(() => {
  const step1 = localStorage.getItem('register_step1')

  if (!step1) {
    router.push('/auth/register')
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
