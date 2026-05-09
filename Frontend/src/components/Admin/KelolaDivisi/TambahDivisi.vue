<template>
  <q-dialog v-model="model">
    <q-card class="q-pa-md" style="min-width: 700px; border-radius: 16px">
      <q-card-section class="flex justify-between items-center">
        <div class="text-subtitle1 text-bold">
          {{ isEdit ? 'Edit Divisi' : 'Tambah Divisi' }}
        </div>

        <q-icon size="28px" name="close" class="cursor-pointer" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-my-xs">Nama Divisi <span class="text-red-7">*</span></div>

        <q-input
          v-model="form.nama"
          dense
          borderless
          class="custom-input q-px-md q-mb-md"
          :label="form.nama ? undefined : 'Masukkan Nama Divisi'"
        />

        <div v-if="!isEdit && isAllEvent">
          <div class="q-my-xs">
            Pilih Acara
            <span class="text-red-7">*</span>
          </div>

          <q-select
            v-model="form.event_id"
            :options="events"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            dense
            borderless
            class="custom-input q-px-md q-mb-md"
            label="Pilih Acara"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey"> Belum ada acara tersedia </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div v-else-if="!isEdit" class="q-mb-md">
          <div class="q-my-xs">Acara</div>

          <q-chip color="indigo-1" text-color="indigo-9" icon="event">
            {{ events.find((e) => e.value === selectedEvent)?.label }}
          </q-chip>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Batal" no-caps class="text-indigo-9" v-close-popup />

        <q-btn
          color="indigo-9"
          :label="isEdit ? 'Update' : 'Simpan'"
          no-caps
          style="border-radius: 16px; min-width: 150px"
          :disable="!isFormValid"
          :loading="loading"
          @click="confirmDialog = true"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

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
  <StatusDialog
    v-model="showDialog"
    :type="dialogType"
    :title="dialogTitle"
    :message="dialogMessage"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { createDivision, updateDivision } from 'src/services/divisi.api'

import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'

const loading = ref(false)
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const form = ref({
  nama: '',
  event_id: null,
})

const confirmDialog = ref(false)

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
  events: {
    type: Array,
    default: () => [],
  },
  selectedEvent: {
    type: [String, Number],
    default: 'all',
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => props.mode === 'edit')
const isAllEvent = computed(() => {
  return props.selectedEvent === 'all'
})

const isFormValid = computed(() => {
  return form.value.nama.trim() !== '' && form.value.event_id
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (isEdit.value && props.dataEdit) {
        form.value.nama = props.dataEdit.nama
        form.value.event_id = props.dataEdit.event_id
      } else {
        form.value.nama = ''
        form.value.event_id = props.selectedEvent !== 'all' ? props.selectedEvent : null
      }
    }
  },
)

const submitForm = async () => {
  loading.value = true

  try {
    const payload = {
      name: form.value.nama,
      event_id: form.value.event_id,
    }

    if (isEdit.value) {
      await updateDivision(props.dataEdit.id, payload)

      dialogType.value = 'success'
      dialogTitle.value = 'Update Berhasil'
      dialogMessage.value = 'Data divisi berhasil diperbarui'
    } else {
      await createDivision(payload)

      dialogType.value = 'success'
      dialogTitle.value = 'Tambah Berhasil'
      dialogMessage.value = 'Divisi baru berhasil ditambahkan'
    }

    showDialog.value = true

    emit('save')

    confirmDialog.value = false
    model.value = false
  } catch (error) {
    dialogType.value = 'error'

    dialogTitle.value = isEdit.value ? 'Update Gagal' : 'Tambah Gagal'

    dialogMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan divisi'

    showDialog.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.custom-input {
  background: rgb(209, 229, 249);
  border-radius: 30px;
}
</style>
