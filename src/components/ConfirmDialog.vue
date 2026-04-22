<template>
  <q-dialog v-model="modal" persistent>
    <q-card class="modern-dialog" :style="cardStyle">

      <!-- Icon -->
      <q-card-section class="q-pt-xl flex flex-center">
        <div class="icon-circle">
          <q-icon :name="iconName" :color="iconColor" size="40px" />
        </div>
      </q-card-section>

      <!-- Title + Message -->
      <q-card-section class="text-center q-pt-md">
        <div class="text-h6 text-weight-bold">
          {{ title }}
        </div>

        <div class="text-grey-7 q-mt-sm q-px-md" v-html="message"></div>

        <slot name="content"></slot>
      </q-card-section>

      <!-- Actions -->
      <q-card-actions class="q-px-lg q-pb-xl q-gutter-sm">

        <!-- Cancel -->
        <q-btn
          v-if="!hideCancelButton"
          flat
          :label="cancelLabel"
          no-caps
          class="btn-outline"
          :disable="loading"
          @click="onCancel"
        />

        <!-- Confirm -->
        <q-btn
          :color="confirmColor"
          :label="confirmLabel"
          :loading="loading"
          :disable="disableConfirm"
          no-caps
          class="btn-confirm"
          @click="onConfirm"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: 'Apakah Anda yakin?' },
  type: { type: String, default: 'info' },

  confirmLabel: { type: String, default: 'Ya, Lanjutkan' },
  cancelLabel: { type: String, default: 'Batal' },

  hideCancelButton: Boolean,
  loading: Boolean,
  disableConfirm: Boolean,

  width: { type: String, default: '400px' }
})

const emit = defineEmits(['update:modelValue','confirm','cancel'])

const modal = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const iconName = computed(() => ({
  info: 'info',
  warning: 'warning',
  danger: 'delete_outline',
  success: 'check_circle'
}[props.type]))

const iconColor = computed(() => ({
  info: 'primary',
  warning: 'warning',
  danger: 'negative',
  success: 'positive'
}[props.type]))

const confirmColor = computed(() => ({
  info: 'primary',
  warning: 'warning',
  danger: 'negative',
  success: 'positive'
}[props.type]))

const cardStyle = computed(() => ({
  maxWidth: props.width,
  width: '100%',
  borderRadius: '32px'
}))

const onConfirm = () => emit('confirm')

const onCancel = () => {
  emit('cancel')
  modal.value = false
}
</script>

<style scoped>

.modern-dialog {
  border-radius: 32px;
  animation: fadeIn 0.2s ease;
}

/* icon circle */
.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 30px;
  background: rgba(239,68,68,0.1);

  display: flex;
  align-items: center;
  justify-content: center;
}

/* cancel button */
.btn-outline {
  flex: 1;
  border-radius: 50px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  background: white;
}

.btn-outline:hover {
  background: #f8fafc;
}

/* confirm button */
.btn-confirm {
  flex: 1;
  border-radius: 50px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

</style>