<template>
  <q-dialog v-model="modal">
    <q-card class="modern-dialog" style="width: 100%; max-width: 420px">

      <q-card-section class="text-center q-pt-xl">

        <div class="success-circle">
          <q-icon name="check" color="positive" size="42px" />
        </div>

        <div class="text-h6 text-weight-bold q-mt-md">
          {{ title }}
        </div>

        <div class="text-grey-7 q-mt-sm">
          {{ message }}
        </div>
      </q-card-section>

      <q-card-actions class="q-pa-lg">
        <q-btn
          color="positive"
          label="OK"
          no-caps
          class="full-width btn-ok"
          @click="modal = false"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'Berhasil',
  },
  message: {
    type: String,
    default: 'Proses berhasil dilakukan.',
  },
})

const emit = defineEmits(['update:modelValue'])

const modal = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
</script>

<style scoped>
.modern-dialog {
  border-radius: 28px;
}

.success-circle {
  width: 85px;
  height: 85px;
  border-radius: 30px;
  background: rgba(34,197,94,.12);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.btn-ok {
  border-radius: 50px;
  padding: 12px;
}
</style>