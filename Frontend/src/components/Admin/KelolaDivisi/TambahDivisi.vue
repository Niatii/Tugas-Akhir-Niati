<template>
  <q-dialog v-model="model">
    <q-card class="q-pa-md" style="min-width: 700px; border-radius: 16px">
      <q-card-section class="flex justify-between items-center">
        <div class="text-subtitle1 text-bold">
          {{ isEdit ? 'Edit Divisi' : 'Tambah Divisi' }}
        </div>

        <q-icon size="28px" name="close" class="cursor-pointer" @click="closeDialog" />
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
            :options="filteredEventOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            dense
            borderless
            use-input
            clearable
            fill-input
            hide-selected
            input-debounce="0"
            @filter="filterEvents"
            class="custom-input q-px-md q-mb-md"
            :label="form.event_id ? undefined : 'Pilih Acara'"
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
        <q-btn flat label="Batal" no-caps class="text-indigo-9" @click="closeDialog" />

        <q-btn
          color="indigo-9"
          :label="isEdit ? 'Edit' : 'Simpan'"
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
    :title="isEdit ? 'Edit Divisi' : 'Simpan Divisi'"
    :message="
      isEdit
        ? 'Perubahan data divisi akan disimpan. Lanjutkan?'
        : 'Data divisi baru akan disimpan. Lanjutkan?'
    "
    :confirm-label="isEdit ? 'Ya, Edit' : 'Ya, Simpan'"
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
const filteredEventOptions = ref([])
const confirmDialog = ref(false)
const eventOptions = ref([])
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
watch(
  () => props.events,
  (val) => {
    eventOptions.value = val || []
    filteredEventOptions.value = val || []
  },
  {
    immediate: true,
  },
)
const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => props.mode === 'edit')
const isAllEvent = computed(() => !props.selectedEvent || props.selectedEvent === 'all')

const isFormValid = computed(() => {
  return form.value.nama.trim() !== '' && form.value.event_id
})

const filterEvents = (val, update) => {
  update(() => {
    if (val === '') {
      filteredEventOptions.value = eventOptions.value
      return
    }

    const needle = val.toLowerCase()

    filteredEventOptions.value = eventOptions.value.filter((v) =>
      v.label.toLowerCase().includes(needle),
    )
  })
}

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
      dialogTitle.value = 'Edit Berhasil'
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

const resetForm = () => {
  form.value = {
    nama: '',
    event_id: props.selectedEvent !== 'all' ? props.selectedEvent : null,
  }

  filteredEventOptions.value = eventOptions.value

  confirmDialog.value = false
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (isEdit.value && props.dataEdit) {
        form.value.nama = props.dataEdit.nama
        form.value.event_id = props.dataEdit.event_id
      } else {
        resetForm()
      }
    } else {
      resetForm()
    }
  },
)

const closeDialog = () => {
  resetForm()
  model.value = false
}
</script>

<style scoped>
.custom-input {
  border-radius: 30px;
  border: 1px solid #ccc;
}
</style>
