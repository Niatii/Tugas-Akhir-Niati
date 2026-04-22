<template>
  <!-- Dialog Form -->
  <q-dialog v-model="model">
    <q-card class="q-pa-md" style="min-width: 700px; border-radius: 16px">
      <q-card-section class="flex justify-between items-center">
        <div class="text-subtitle1 text-bold">
          {{ isEdit ? 'Edit Divisi' : 'Tambah Divisi' }}
        </div>

        <q-icon
          size="28px"
          name="close"
          class="cursor-pointer"
          v-close-popup
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-my-xs">
          Nama Divisi <span class="text-red-7">*</span>
        </div>

        <q-input
          v-model="form.nama"
          dense
          borderless
          class="custom-input q-px-md q-mb-md"
          :label="form.nama ? undefined : 'Masukkan Nama Divisi'"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Batal"
          no-caps
          class="text-indigo-9"
          v-close-popup
        />

        <q-btn
          color="indigo-9"
          :label="isEdit ? 'Update' : 'Simpan'"
          no-caps
          style="border-radius: 16px; min-width: 150px"
          :disable="!isFormValid"
          @click="confirmDialog = true"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- ConfirmDialog Reusable -->
  <ConfirmDialog
    v-model="confirmDialog"
    :type="isEdit ? 'warning' : 'success'"
    :title="isEdit ? 'Update Divisi' : 'Simpan Divisi'"
    :message="
      isEdit
        ? 'Perubahan data divisi akan disimpan. Lanjutkan?'
        : 'Data divisi baru akan disimpan. Lanjutkan?'
    "
    :confirm-label="isEdit ? 'Ya, Update' : 'Ya, Simpan'"
    cancel-label="Batal"
    @confirm="submitForm"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'

const props = defineProps({
  modelValue: Boolean,
  mode: {
    type: String,
    default: 'add',
  },
  dataEdit: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => props.mode === 'edit')

const confirmDialog = ref(false)

const form = ref({
  nama: '',
})

const isFormValid = computed(() => {
  return form.value.nama.trim() !== ''
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (isEdit.value && props.dataEdit) {
        form.value.nama = props.dataEdit.nama
      } else {
        form.value.nama = ''
      }
    }
  },
)

const submitForm = () => {
  emit('save', {
    mode: props.mode,
    data: { ...form.value },
  })

  confirmDialog.value = false
  model.value = false
}
</script>

<style scoped>
.custom-input {
  background: rgb(209, 229, 249);
  border-radius: 30px;
}
</style>