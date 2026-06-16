<template>
  <q-page class="q-pa-lg">
    <div class="row items-center">
      <div class="col-12 col-md-6 flex flex-center q-pa-md">
        <div class="column items-center text-center">
          <img :src="logo" class="logo" />
        </div>
      </div>

      <div class="col-12 col-md-6 flex flex-center">
        <q-card class="login-card bg-blue-1 q-mt-lg">
          <q-card-section class="text-center">
            <img :src="icon" class="logo-card q-mb-xs" />
            <div class="text-h6 text-weight-medium">Selamat Datang Kembali</div>
            <div class="text-caption text-grey-8">Silakan masuk untuk melanjutkan.</div>
          </q-card-section>

          <q-card-section class="full-width">
            <form @submit.prevent="handleLogin" autocomplete="on">
              <input type="text" name="username" :value="username" hidden />
              <input type="password" name="password" :value="password" hidden />

              <div class="q-my-xs">Nama Pengguna</div>
              <q-input
                v-model="username"
                name="username"
                autocomplete="username"
                dense
                borderless
                class="custom-input q-px-md q-mb-xs"
                :label="username ? undefined : 'Masukkan Nama Pengguna'"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>

                <template v-slot:append>
                  <q-icon v-if="errors.username" name="error" color="negative" />
                </template>
              </q-input>
              <span v-if="errors.username" class="error-text">
                {{ errors.username }}
              </span>

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
                  <q-icon v-if="errors.password" name="error" color="negative" class="q-mr-xs" />
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

              <div class="text-right q-mb-lg">
                <span
                  class="text-indigo-9 text-weight-medium cursor-pointer"
                  style="font-size: 12px"
                  @click="goLupaKataSandi"
                >
                  Lupa Kata Sandi?
                </span>
              </div>

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
                <span class="text-indigo-9 text-weight-medium cursor-pointer" @click="goRegister">
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
import { nextTick } from 'vue'

import StatusDialog from 'src/components/StatusDialog.vue'
import UserRoleEnum from 'src/enums/UserRoleEnum'

import logo from 'src/assets/image/evoma_logo.png'
import icon from 'src/assets/image/evoma_icon.png'

import { api } from 'boot/axios'

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

function goRegister() {
  router.push('/auth/register')
}
function goLupaKataSandi() {
  router.push('/auth/lupa-kata-sandi')
}

function validateForm() {
  errors.value.username = ''
  errors.value.password = ''

  let isValid = true

  if (!username.value) {
    errors.value.username = 'Nama pengguna wajib diisi'
    isValid = false
  }

  if (!password.value) {
    errors.value.password = 'Kata sandi wajib diisi'
    isValid = false
  }

  return isValid
}

async function handleLogin() {
  if (!validateForm()) return

  try {
    const response = await api.post('/api/v1/auth/login', {
      username: username.value,
      password: password.value,
    })

    const data = response.data?.data
    
    if (!data || !data.access_token || !data.user) {
      throw new Error('Response format tidak valid')
    }

    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('loginTime', Date.now().toString())

    const role = data.user.role

    await nextTick()
  
    await new Promise(resolve => setTimeout(resolve, 100))

    if (role === UserRoleEnum.ADMIN) {
      await router.push('/admin/beranda')
    } else if (role === UserRoleEnum.COORDINATOR) {
      await router.push('/koordinator/detail-acara-saya')
    } else if (role === UserRoleEnum.COMMITTEE) {
      await router.push('/user/beranda')
    } else {
      console.warn('Role tidak dikenal:', role)
      await router.push('/auth/login')
    }
  } catch (error) {
    console.error('Login error:', error)
    
    dialogType.value = 'error'
    dialogTitle.value = 'Login Gagal'

    const status = error.response?.status
    if (status === 401) {
      dialogMessage.value = 'Nama pengguna atau kata sandi salah. Silakan coba lagi.'
    } else if (status === 404) {
      dialogMessage.value = 'Akun tidak ditemukan. Periksa kembali nama pengguna Anda.'
    } else {
      dialogMessage.value =
        error.response?.data?.message || error.message || 'Terjadi kesalahan. Silakan coba lagi.'
    }

    showDialog.value = true
  }
}
</script>

<style scoped>
.logo {
  width: 600px;
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
