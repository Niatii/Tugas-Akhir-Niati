<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-center" style="min-height: 85vh">
      <div class="col-12 col-md-5">
        <q-card class="forgot-card">
          <!-- Header -->
          <div class="forgot-header text-center q-pa-xl bg-blue-1">
            <div class="q-mb-md">
              <img :src="logo" class="logo-card q-mb-xs" />
            </div>
            <div class="text-h6 text-weight-bold text-indigo-9">Lupa Kata Sandi?</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Masukkan email yang terdaftar. Kami akan kirimkan link reset kata sandi.
            </div>
          </div>

          <q-card-section class="q-px-xl q-pb-xl">
            <!-- SUCCESS STATE -->
            <div v-if="isSuccess" class="text-center q-py-md">
              <q-icon name="mark_email_read" size="56px" color="positive" class="q-mb-md" />
              <div class="text-subtitle1 text-weight-bold text-positive">Email Terkirim!</div>
              <div class="text-body2 text-grey-7 q-mt-sm q-mb-lg">
                Cek inbox email kamu. Jika tidak ada, cek folder <strong>Spam</strong>. Link reset
                berlaku selama <strong>1 jam</strong>.
              </div>
              <q-btn
                label="Kembali ke Login"
                unelevated
                no-caps
                class="action-btn full-width"
                @click="goLogin"
              />
            </div>

            <!-- FORM STATE -->
            <form v-else @submit.prevent="handleSubmit">
              <div class="q-mb-xs text-body2">Alamat Email</div>
              <q-input
                v-model="email"
                type="email"
                dense
                borderless
                class="custom-input q-px-md q-mb-xs"
                :label="email ? undefined : 'Masukkan alamat email kamu'"
                :disable="isLoading"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
                <template v-slot:append>
                  <q-icon v-if="errorMsg" name="error" color="negative" />
                </template>
              </q-input>
              <span v-if="errorMsg" class="error-text">{{ errorMsg }}</span>

              <q-btn
                type="submit"
                label="Kirim Link Reset"
                unelevated
                no-caps
                class="action-btn full-width q-mt-lg"
                :loading="isLoading"
              />

              <div class="text-center q-mt-md">
                <span
                  class="text-indigo-9 text-caption cursor-pointer text-weight-medium"
                  @click="goLogin"
                >
                  ← Kembali ke Login
                </span>
              </div>
            </form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import logo from 'src/assets/image/evoma_icon.png'

import { forgotPassword } from 'src/services/auth.api'

const router = useRouter()

const email = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMsg = ref('')

function goLogin() {
  router.push('/auth/login')
}

async function handleSubmit() {
  errorMsg.value = ''

  if (!email.value) {
    errorMsg.value = 'Email wajib diisi'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMsg.value = 'Format email tidak valid'
    return
  }

  isLoading.value = true
  try {
    await forgotPassword(email.value)
    isSuccess.value = true
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Gagal mengirim email. Coba lagi nanti.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.forgot-card {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(63, 81, 181, 0.12);
}

.forgot-header {
  /* background: linear-gradient(135deg, #e8eaf6 0%, #f3f4fb 100%); */
  border-radius: 20px 20px 0 0;
}

.icon-wrap {
  width: 72px;
  height: 72px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 16px rgba(63, 81, 181, 0.15);
}

.custom-input {
  background: #f5f5f5;
  border-radius: 30px;
}

.action-btn {
  background: #3f51b5;
  color: white;
  border-radius: 25px;
  padding: 10px 0;
  font-weight: 600;
}

.error-text {
  display: block;
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
  margin-left: 10px;
}

.logo-card {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 30%;
}
</style>
