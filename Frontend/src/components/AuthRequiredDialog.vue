<template>
  <q-dialog
    v-model="modal"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="dialog-modern">

      <!-- ICON -->
      <div class="icon-wrapper">
        <q-icon
          name="lock"
          size="32px"
        />
      </div>

      <!-- CONTENT -->
      <div class="content">

        <div class="title">
          Masuk ke Akun Diperlukan
        </div>

        <div class="message">
          Untuk melihat detail acara,
          anda harus masuk atau mendaftar terlebih dahulu.
        </div>

      </div>

      <!-- ACTION -->
      <div class="actions">

        <q-btn
          flat
          color="grey-7"
          label="Nanti Saja"
          no-caps
          class="btn-cancel"
          v-close-popup
        />

        <q-btn
          outline
          color="indigo-9"
          label="Daftar"
          no-caps
          class="btn-register"
          @click="goRegister"
        />

        <q-btn
          color="indigo-9"
          label="Masuk"
          no-caps
          unelevated
          class="btn-login"
          @click="goLogin"
        />

      </div>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: Boolean,
  eventId: Number,
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()

const modal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function goLogin() {
  router.push({
    path: '/auth/login',
    query: {
      redirect: `/user/detail-acara/${props.eventId}`,
    },
  })
}

function goRegister() {
  router.push({
    path: '/auth/register',
    query: {
      redirect: `/user/detail-acara/${props.eventId}`,
    },
  })
}
</script>

<style scoped>

.dialog-modern {
  width: 100%;
  max-width: 420px;

  border-radius: 24px;

  padding: 28px 24px;

  text-align: center;

  background: white;

  box-shadow:
    0 20px 40px rgba(0,0,0,0.12);
}

.icon-wrapper {
  width: 68px;
  height: 68px;

  margin: 0 auto 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(99,102,241,0.12);

  color: #4338ca;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.message {
  margin-top: 10px;

  font-size: 14px;

  color: #64748b;

  line-height: 1.6;
}

.actions {
  margin-top: 28px;

  display: flex;
  justify-content: center;
  gap: 12px;
}

.btn-login,
.btn-register,
.btn-cancel {
  border-radius: 14px;
  padding-inline: 18px;
}

</style>