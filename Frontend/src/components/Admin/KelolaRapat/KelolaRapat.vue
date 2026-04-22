<template>
  <q-dialog v-model="model" persistent>
    <q-card class="meeting-dialog q-pa-md">
      <!-- HEADER -->
      <q-card-section class="row items-center justify-between q-pb-sm">
        <div>
          <div class="text-h6 text-weight-bold">
            {{ isEdit ? 'Edit Rapat' : 'Tambah Rapat' }}
          </div>

          <div class="text-caption text-grey-7 q-mt-xs">
            {{
              isEdit
                ? 'Perbarui informasi rapat.'
                : 'Buat jadwal rapat baru dan kirim notifikasi peserta.'
            }}
          </div>
        </div>

        <q-btn flat round dense icon="close" class="motion-btn" @click="closeDialog" />
      </q-card-section>

      <q-separator />

      <!-- FORM -->
      <q-card-section class="q-pt-md">
        <div class="row q-col-gutter-md">
          <!-- EVENT -->
          <div class="col-12">
            <div class="field-label">
              Pilih Acara
              <span class="text-red-7">*</span>
            </div>

            <q-select
              v-model="form.eventId"
              :options="eventOptions"
              emit-value
              map-options
              outlined
              dense
              rounded
              class="field-control"
              label="Pilih acara untuk rapat ini"
            />
          </div>

          <!-- DIVISION -->
          <div v-if="form.type === 'Divisi'" class="col-12 col-md-6">
            <div class="field-label">
              Divisi
              <span class="text-red-7">*</span>
            </div>

            <q-select
              v-model="form.divisionId"
              :options="divisionOptions"
              emit-value
              map-options
              outlined
              dense
              rounded
              class="field-control"
              label="Pilih divisi"
            />
          </div>

          <!-- TITLE -->
          <div class="col-12">
            <div class="field-label">
              Nama Rapat
              <span class="text-red-7">*</span>
            </div>

            <q-input
              v-model="form.title"
              outlined
              dense
              rounded
              class="field-control"
              label="Isi nama rapat"
            />
          </div>

          <!-- DATE -->
          <div class="col-12 col-md-6">
            <div class="field-label">
              Tanggal
              <span class="text-red-7">*</span>
            </div>

            <div >
              <DateInput v-model="form.date"   rounded/>
            </div>
          </div>

          <!-- TIME -->
          <div class="col-12 col-md-6">
            <div class="field-label">
              Jam Mulai
              <span class="text-red-7">*</span>
            </div>

            <q-input
              v-model="form.time"
              outlined
              dense
              rounded
              mask="time"
              class="field-control"
              label="Pilih jam mulai"
            >
              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="form.time" format24h>
                      <div class="row justify-end q-pa-sm">
                        <q-btn v-close-popup flat label="Tutup" color="primary" />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- LOCATION -->
          <div class="col-12">
            <div class="field-label">
              Lokasi
              <span class="text-red-7">*</span>
            </div>

            <q-input
              v-model="form.location"
              outlined
              dense
              rounded
              class="field-control"
              label="Masukkan lokasi rapat"
            />
          </div>

          <!-- NOTES -->
          <div class="col-12">
            <div class="field-label">
              Catatan
              <span class="text-grey-6"> (Opsional) </span>
            </div>

            <q-input
              v-model="form.notes"
              type="textarea"
              autogrow
              outlined
              rounded
              class="field-control"
              label="Tambahkan catatan"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- ACTION -->
      <q-card-actions align="right" class="q-pa-md q-gutter-sm">
        <q-btn flat label="Batal" no-caps class="motion-btn" @click="closeDialog" />

        <q-btn
          color="indigo-9"
          :label="isEdit ? 'Update Rapat' : 'Simpan Rapat'"
          rounded
          no-caps
          class="motion-btn"
          :disable="!isValid"
          @click="submitForm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { animate, stagger } from 'motion'
import DateInput from 'src/components/DateInput.vue'

const props = defineProps({
  modelValue: Boolean,
  mode: {
    type: String,
    default: 'add',
  },
  editData: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => {
  return props.mode === 'edit'
})

const form = ref({
  eventId: '',
  type: '',
  divisionId: '',
  title: '',
  date: '',
  time: '',
  location: '',
  notes: '',
})

const eventOptions = [
  {
    label: 'HMTI Fair',
    value: 1,
  },
  {
    label: 'Seminar AI',
    value: 2,
  },
]

const divisionOptions = [
  {
    label: 'Acara',
    value: 1,
  },
  {
    label: 'Pubdok',
    value: 2,
  },
  {
    label: 'Humas',
    value: 3,
  },
]

watch(
  () => props.modelValue,
  async (val) => {
    if (!val) return

    if (isEdit.value) {
      form.value = {
        ...props.editData,
      }
    } else {
      resetForm()
    }

    await nextTick()
    runAnimation()
  },
)

const resetForm = () => {
  form.value = {
    eventId: '',
    type: '',
    divisionId: '',
    title: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  }
}

const isValid = computed(() => {
  const basic =
    form.value.eventId &&
    form.value.type &&
    form.value.title &&
    form.value.date &&
    form.value.time &&
    form.value.location

  if (form.value.type === 'Divisi') {
    return basic && form.value.divisionId
  }

  return basic
})

const submitForm = () => {
  emit('save', {
    mode: props.mode,
    payload: {
      ...form.value,
    },
  })

  model.value = false
}

const closeDialog = () => {
  model.value = false
}

const runAnimation = () => {
  animate(
    '.meeting-dialog',
    {
      opacity: [0, 1],
      scale: [0.97, 1],
      y: [8, 0],
    },
    {
      duration: 0.22,
      easing: 'ease-out',
    },
  )

  animate(
    '.motion-btn',
    {
      opacity: [0, 1],
      y: [5, 0],
    },
    {
      delay: stagger(0.04),
      duration: 0.2,
    },
  )
}
</script>

<style scoped>
.meeting-dialog {
  width: 100%;
  max-width: 760px;
  border-radius: 22px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
}

.field-control {
  margin-bottom: 4px;
}

.field-wrapper {
  border: 1px solid rgba(0, 0, 0, 0.24);
  border-radius: 28px;
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: white;
}

.motion-btn {
  transition: all 0.18s ease;
}
</style>
