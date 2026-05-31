<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-center" style="min-height: 85vh">
      <div class="col-12 col-md-5">
        <q-card class="reset-card">
          <div class="reset-header text-center q-pa-xl bg-blue-1">
             <div class="q-mb-md">
              <img :src="logo" class="logo-card q-mb-xs" />
            </div>
            <div class="text-h6 text-weight-bold text-indigo-9">Buat Kata Sandi Baru</div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Masukkan kata sandi baru yang kuat dan mudah kamu ingat.
            </div>
          </div>

          <q-card-section class="q-px-xl q-pb-xl">
            <div v-if="tokenInvalid" class="text-center q-py-md">
              <q-icon name="error_outline" size="56px" color="negative" class="q-mb-md" />
              <div class="text-subtitle1 text-weight-bold text-negative">Link Tidak Valid</div>
              <div class="text-body2 text-grey-7 q-mt-sm q-mb-lg">
                Link reset kata sandi tidak valid atau sudah kadaluarsa.<br />
                Silakan request ulang.
              </div>
              <q-btn
                label="Minta Link Baru"
                unelevated
                no-caps
                class="action-btn full-width"
                @click="goForgot"
              />
            </div>

            <div v-else-if="isSuccess" class="text-center q-py-md">
              <q-icon name="check_circle" size="56px" color="positive" class="q-mb-md" />
              <div class="text-subtitle1 text-weight-bold text-positive">Berhasil!</div>
              <div class="text-body2 text-grey-7 q-mt-sm q-mb-lg">
                Kata sandi kamu berhasil diperbarui.<br />
                Silakan login dengan kata sandi baru.
              </div>
              <q-btn
                label="Login Sekarang"
                unelevated
                no-caps
                class="action-btn full-width"
                @click="goLogin"
              />
            </div>

            <form v-else @submit.prevent="handleSubmit">
              <!-- Password baru -->
              <div class="q-mb-xs text-body2">Kata Sandi Baru</div>
              <q-input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                dense
                borderless
                class="custom-input q-px-md q-mb-xs"
                :label="password ? undefined : 'Minimal 8 karakter'"
                :disable="isLoading"
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
              <span v-if="errors.password" class="error-text">{{ errors.password }}</span>

              <div class="q-mt-md q-mb-xs text-body2">Konfirmasi Kata Sandi</div>
              <q-input
                v-model="passwordConfirm"
                :type="showConfirm ? 'text' : 'password'"
                dense
                borderless
                class="custom-input q-px-md q-mb-xs"
                :label="passwordConfirm ? undefined : 'Ulangi kata sandi baru'"
                :disable="isLoading"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_outline" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showConfirm ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirm = !showConfirm"
                  />
                </template>
              </q-input>
              <span v-if="errors.passwordConfirm" class="error-text">{{
                errors.passwordConfirm
              }}</span>

              <div v-if="password" class="q-mt-sm q-mb-xs">
                <div class="text-caption text-grey-7 q-mb-xs">Kekuatan kata sandi:</div>
                <div class="strength-bar-row">
                  <div v-for="i in 4" :key="i" class="strength-bar" :class="strengthBarClass(i)" />
                </div>
                <div class="text-caption q-mt-xs" :class="strengthTextColor">
                  {{ strengthLabel }}
                </div>
              </div>

              <span v-if="errors.general" class="error-text">{{ errors.general }}</span>

              <q-btn
                type="submit"
                label="Perbarui Kata Sandi"
                unelevated
                no-caps
                class="action-btn full-width q-mt-lg"
                :loading="isLoading"
              />
            </form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import logo from 'src/assets/image/evoma_icon.png'

import { resetPassword } from 'src/services/auth.api'

const router = useRouter()
const route = useRoute()

const token = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const tokenInvalid = ref(false)

const errors = ref({
  password: '',
  passwordConfirm: '',
  general: '',
})

const passwordStrength = computed(() => {
  const p = password.value
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (p.length >= 12) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return Math.min(score, 4)
})

const strengthLabel = computed(() => {
  const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat']
  return labels[passwordStrength.value] || ''
})

const strengthTextColor = computed(() => {
  const colors = ['', 'text-negative', 'text-warning', 'text-positive', 'text-positive']
  return colors[passwordStrength.value] || ''
})

function strengthBarClass(index) {
  const level = passwordStrength.value
  if (index > level) return 'bar-empty'
  if (level <= 1) return 'bar-weak'
  if (level === 2) return 'bar-medium'
  return 'bar-strong'
}

function goLogin() {
  router.push('/auth/login')
}

function goForgot() {
  router.push('/auth/lupa-kata-sandi')
}

function validate() {
  errors.value = { password: '', passwordConfirm: '', general: '' }
  let isValid = true

  if (!password.value) {
    errors.value.password = 'Kata sandi wajib diisi'
    isValid = false
  } else if (password.value.length < 8) {
    errors.value.password = 'Kata sandi minimal 8 karakter'
    isValid = false
  }

  if (!passwordConfirm.value) {
    errors.value.passwordConfirm = 'Konfirmasi kata sandi wajib diisi'
    isValid = false
  } else if (password.value !== passwordConfirm.value) {
    errors.value.passwordConfirm = 'Kata sandi tidak cocok'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  try {
    await resetPassword(token.value, password.value)
    isSuccess.value = true
  } catch (error) {
    const msg = error.response?.data?.message || ''
    if (msg.includes('kadaluarsa') || msg.includes('valid')) {
      tokenInvalid.value = true
    } else {
      errors.value.general = msg || 'Gagal memperbarui kata sandi. Coba lagi.'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const t = route.query.token
  if (!t) {
    tokenInvalid.value = true
  } else {
    token.value = t
  }
})
</script>

<style scoped>
.reset-card {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(63, 81, 181, 0.12);
}

.reset-header {
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

/* Password strength bar */
.strength-bar-row {
  display: flex;
  gap: 6px;
}

.strength-bar {
  flex: 1;
  height: 5px;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.bar-empty {
  background-color: #e0e0e0;
}
.bar-weak {
  background-color: #ef4444;
}
.bar-medium {
  background-color: #f59e0b;
}
.bar-strong {
  background-color: #22c55e;
}

.logo-card {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 30%;
}
</style>
