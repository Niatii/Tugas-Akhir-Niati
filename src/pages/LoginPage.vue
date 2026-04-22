<template>
  <q-page class="q-pa-lg">
    <div class="row items-center">
      <!-- KIRI -->
      <div class="col-12 col-md-6 flex flex-center q-pa-md">
        <div class="column items-center text-center">
          <img :src="logo" class="logo q-mb-lg" />

          <div class="text-h2 text-weight-bold q-mb-sm">Bridge Up</div>

          <div class="text-h6 text-grey-7">
            Sistem Informasi Pengelolaan Event Organisasi Mahasiswa
          </div>
        </div>
      </div>

      <!-- KANAN -->
      <div class="col-12 col-md-6 flex flex-center">
        <q-card class="login-card bg-blue-2">
          <!-- HEAD -->
          <q-card-section class="text-center">
            <img :src="logo" class="logo-card q-mb-xs" />
            <div class="text-h6 text-weight-medium">Selamat Datang Kembali</div>
            <div class="text-caption text-grey-8">Silakan masuk untuk melanjutkan.</div>
          </q-card-section>

          <!-- BODY -->
          <q-card-section class="full-width">
            <!-- Username -->
            <div class="q-my-xs">Username</div>
            <q-input
              v-model="username"
              dense
              borderless
              class="custom-input q-px-md q-mb-md"
              :label="username ? undefined : 'Masukkan Username'"
            >
              <template v-slot:prepend> <q-icon name="person" /> </template>
            </q-input>

            <!-- Password -->
            <div class="q-my-xs">Kata Sandi</div>
            <q-input
              v-model="password"
              dense
              :label="password ? undefined : 'Masukkan Kata Sandi'"
              borderless
              :type="isPwd ? 'password' : 'text'"
              class="custom-input q-px-md q-mb-xs"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>

              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div class="text-right q-mb-lg">
              <span
                class="text-indigo-9 text-weight-medium link-register q-ml-xs cursor-pointer" style="font-size: 12px;"
                @click="goLupaKataSandi"
              >
                Lupa Kata Sandi?
              </span>
            </div>

            <!-- BUTTON -->
            <div class="flex flex-center q-mb-md">
              <q-btn
                label="Masuk"
                unelevated
                class="login-btn bg-indigo-9"
                no-caps
                to="/user/beranda"
              />
            </div>

            <div class="text-center text-caption">
              Belum punya akun?
              <span
                class="text-indigo-9 text-weight-medium link-register q-ml-xs cursor-pointer"
                @click="goRegister"
              >
                Daftar Sekarang
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from 'src/assets/image/logo.jpg'

const router = useRouter()
const isPwd = ref(true)
const username = ref('')
const password = ref('')

// Navigation
function goRegister() {
  router.push('/auth/register')
}
function goLupaKataSandi() {
  router.push('/auth/lupa-kata-sandi')
}
</script>

<style scoped>
.logo {
  width: 320px;
  max-width: 80%;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: 20px 20px 30px;
  border-radius: 20px;
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
