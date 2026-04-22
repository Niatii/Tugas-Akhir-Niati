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
          <div class="q-my-xs">Email</div>
          <q-input
            v-model="email"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="email ? undefined : 'Masukkan email kamu'"
          >
            <template v-slot:prepend> <q-icon name="email" /> </template>
          </q-input>

          <!-- NIM -->
          <div class="q-my-xs">username</div>
          <q-input
            v-model="username"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            :label="username ? undefined : 'Masukkan username kamu'"
          >
            <template v-slot:prepend> <q-icon name="person" /> </template>
          </q-input>

          <!-- KATA SANDI -->
          <div class="q-my-xs">Kata Sandi</div>
          <q-input
            v-model="kataSandi"
            :type="showPassword ? 'text' : 'password'"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
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
            </template>
          </q-input>

          <!-- KONFIRMASI KATA SANDI -->
          <div class="q-my-xs">Konfirmasi Kata Sandi</div>
          <q-input
            v-model="konfirmasiKataSandi"
            :type="showConfirmPassword ? 'text' : 'password'"
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
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
            </template>
          </q-input>

          <!-- BUTTON -->
          <div class="flex justify-end q-my-lg">
            <q-btn
              label="Daftar"
              unelevated
              class="login-btn bg-indigo-9"
              no-caps
              to="/auth/login"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from 'src/assets/image/logo.jpg'

const router = useRouter()
const email = ref('')
const username = ref('')
const kataSandi = ref('')
const konfirmasiKataSandi = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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
