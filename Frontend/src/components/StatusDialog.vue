<template>
  <q-dialog v-model="modal" transition-show="scale" transition-hide="scale">
    <q-card class="dialog-modern">
      <div class="icon-wrapper" :class="type">
        <q-icon :name="icon" size="32px" />
      </div>

      <div class="content">
        <div class="title">
          {{ title }}
        </div>

        <div class="message">
          {{ message }}
        </div>
      </div>

      <div class="actions" v-if="type !== 'success'">
        <q-btn :color="btnColor" label="OK" no-caps class="btn-action" @click="modal = false" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  type: { type: String, default: 'success' },
  title: String,
  message: String,
})

const emit = defineEmits(['update:modelValue'])

const modal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const icon = computed(() =>
  props.type === 'success' ? 'check_circle' : 'error'
)

const btnColor = computed(() =>
  props.type === 'success' ? 'positive' : 'negative'
)

let timer = null

watch(
  () => modal.value,
  (val) => {
    if (val && props.type === 'success') {
      clearTimeout(timer)

      timer = setTimeout(() => {
        modal.value = false
      }, 1500)
    }
  }
)

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
.dialog-modern {
  width: 100%;
  max-width: 380px;
  border-radius: 24px;
  padding: 28px 24px;
  text-align: center;

  background: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

/* icon */
.icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.icon-wrapper.success {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.icon-wrapper.error {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

/* title */
.title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

/* message */
.message {
  margin-top: 8px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

/* button */
.actions {
  margin-top: 24px;
}

.btn-action {
  width: 100%;
  border-radius: 30px;
  padding: 10px;
  font-weight: 600;
}
</style>
