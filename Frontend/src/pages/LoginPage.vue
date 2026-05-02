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
            <div class="text-caption text-grey-8">
              Silakan masuk untuk melanjutkan.
            </div>
          </q-card-section>

          <!-- BODY -->
          <q-card-section class="full-width">
            <!-- 🔥 FORM (WAJIB) -->
            <form @submit.prevent="handleLogin" autocomplete="on">
              
              <!-- hidden input (biar browser pasti detect) -->
              <input type="text" name="username" :value="username" hidden />
              <input type="password" name="password" :value="password" hidden />

              <!-- Username -->
              <div class="q-my-xs">Username</div>
              <q-input
                v-model="username"
                name="username"
                autocomplete="username"
                dense
                borderless
                class="custom-input q-px-md q-mb-xs"
                :label="username ? undefined : 'Masukkan Username'"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>

                <template v-slot:append>
                  <q-icon
                    v-if="errors.username"
                    name="error"
                    color="negative"
                  />
                </template>
              </q-input>

              <span v-if="errors.username" class="error-text">
                {{ errors.username }}
              </span>

              <!-- Password -->
              <div class="q-my-xs">Kata Sandi</div>
              <q-input
                v-model="password"
                name="password"
                autocomplete="current-password"
                dense
                borderless
                :label="password ? undefined : 'Masukkan Kata Sandi'"
                :type="isPwd ? 'password' : 'text'"
                class="custom-input q-px-md q-mb-xs"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>

                <template v-slot:append>
                  <q-icon
                    v-if="errors.password"
                    name="error"
                    color="negative"
                    class="q-mr-xs"
                  />

                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <span v-if="errors.password" class="error-text">
                {{ errors.password }}
              </span>

              <!-- Lupa Password -->
              <div class="text-right q-mb-lg">
                <span
                  class="text-indigo-9 text-weight-medium cursor-pointer"
                  style="font-size: 12px"
                  @click="goLupaKataSandi"
                >
                  Lupa Kata Sandi?
                </span>
              </div>

              <!-- BUTTON -->
              <div class="flex flex-center q-mb-md">
                <q-btn
                  label="Masuk"
                  type="submit"
                  unelevated
                  class="login-btn bg-indigo-9"
                  no-caps
                />
              </div>

              <div class="text-center text-caption">
                Belum punya akun?
                <span
                  class="text-indigo-9 text-weight-medium cursor-pointer"
                  @click="goRegister"
                >
                  Daftar Sekarang
                </span>
              </div>
            </form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog -->
    <StatusDialog
      v-model="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logo from 'src/assets/image/logo.jpg'
import { api } from 'boot/axios'
import StatusDialog from 'src/components/StatusDialog.vue'

const router = useRouter()

const isPwd = ref(true)
const username = ref('')
const password = ref('')

const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')

const errors = ref({
  username: '',
  password: '',
})

// Navigation
function goRegister() {
  router.push('/auth/register')
}
function goLupaKataSandi() {
  router.push('/auth/lupa-kata-sandi')
}

// Validation
function validateForm() {
  errors.value.username = ''
  errors.value.password = ''

  let isValid = true

  if (!username.value) {
    errors.value.username = 'Username wajib diisi'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Password wajib diisi'
    isValid = false
  }

  return isValid
}

// Login
async function handleLogin() {
  if (!validateForm()) return

  try {
    const response = await api.post('/api/v1/auth/login', {
      username: username.value,
      password: password.value,
    })

    const data = response.data.data

    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))

    dialogType.value = 'success'
    dialogTitle.value = 'Login Berhasil'
    dialogMessage.value = 'Selamat datang kembali!'
    showDialog.value = true

    const role = data.user.role

    setTimeout(() => {
      if (role === 0) {
        router.push('/admin/beranda')
      } else {
        router.push('/user/beranda')
      }
    }, 1200)

  } catch (error) {
    dialogType.value = 'error'
    dialogTitle.value = 'Login Gagal'
    dialogMessage.value =
      error.response?.data?.message ||
      'Email tidak terdaftar atau password salah'

    showDialog.value = true
  }
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

.error-text {
  display: block;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 10px;
}
</style>