<template>
  <q-dialog v-model="model" persistent>
    <q-card class="meeting-dialog q-px-md q-py-xs">
      <!-- HEADER -->
      <q-card-section class="row items-center justify-between q-pb-sm">
        <div>
          <div class="text-h6 text-weight-bold">
            {{ isEdit ? 'Edit Rapat' : 'Tambah Rapat' }}
          </div>

          <div class="text-caption text-grey-7 q-mt-xs">
            {{
              isEdit
                ? 'Perbarui informasi rapat divisi Anda.'
                : 'Buat jadwal rapat baru untuk divisi Anda.'
            }}
          </div>
        </div>

        <q-btn flat round dense icon="close" class="motion-btn" v-close-popup />
      </q-card-section>

      <q-separator />

      <q-form @submit.prevent="submitForm">
        <!-- FORM -->
        <q-card-section class="q-pt-md">
          <div class="row q-col-gutter-md">
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
                :label="form.title ? undefined : 'Isi nama rapat'"
              />
            </div>

            <!-- DATE -->
            <div class="col-12 col-md-6">
              <div class="field-label">
                Tanggal
                <span class="text-red-7">*</span>
              </div>

              <div>
                <DateInput v-model="form.date" :min-date="minMeetingDate" rounded />
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
                :label="form.time ? undefined : 'Pilih jam mulai'"
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
                :label="form.location ? undefined : 'Masukkan lokasi rapat'"
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
                :label="form.notes ? undefined : 'Tambahkan catatan'"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- ACTION -->
        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn flat label="Batal" no-caps class="motion-btn" v-close-popup />

          <q-btn
            color="indigo-9"
            :label="isEdit ? 'Update Rapat' : 'Simpan Rapat'"
            rounded
            no-caps
            @click="confirmDialog = true"
            class="motion-btn"
            :disable="!isValid || loading"
            :loading="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <ConfirmDialog
    v-model="confirmDialog"
    :type="isEdit ? 'warning' : 'success'"
    :title="isEdit ? 'Update Rapat' : 'Simpan Rapat'"
    :message="
      isEdit
        ? 'Perubahan data rapat akan disimpan. Lanjutkan?'
        : 'Data rapat baru akan disimpan. Lanjutkan?'
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
import { ref, computed, watch, nextTick } from 'vue'
import { animate, stagger } from 'motion'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'
import DateInput from 'src/components/DateInput.vue'
import { createMeeting, updateMeeting } from 'src/services/meeting.api'

const form = ref({
  title: '',
  date: '',
  time: '',
  location: '',
  notes: '',
})

const loading = ref(false)
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const confirmDialog = ref(false)

const emit = defineEmits(['update:modelValue', 'save'])

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
  eventId: {
    type: [Number, String],
    required: true,
  },
  eventStartDate: {
    type: [Date, String],
    default: null,
  }
})

const minMeetingDate = computed(() => {
  if (!props.eventStartDate) return null
  return new Date(props.eventStartDate).toISOString().split('T')[0]
})

watch(
  () => props.modelValue,
  () => {
    if (!form.value.date || !minMeetingDate.value) return

    if (form.value.date < minMeetingDate.value) {
      form.value.date = ''
    }
  },
)

const isDateValid = computed(() => {
  if (!form.value.date || !minMeetingDate.value) return true
  return form.value.date >= minMeetingDate.value
})

const isValid = computed(() => {
  return (
    form.value.title &&
    form.value.date &&
    form.value.time &&
    form.value.location &&
    isDateValid.value
  )
})

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => {
  return props.mode === 'edit'
})

const resetForm = () => {
  form.value = {
    title: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  }
}

watch(
  () => props.modelValue,
  async (val) => {
    if (!val) return

    if (isEdit.value) {
      const rawDate = props.editData.raw_schedule_date
        ? new Date(props.editData.raw_schedule_date)
        : null

      form.value = {
        title: props.editData.title || '',
        date: rawDate ? rawDate.toISOString().split('T')[0] : '',
        time: rawDate ? rawDate.toTimeString().slice(0, 5) : '',
        location: props.editData.location || '',
        notes: props.editData.notulen || '', 
      }
    } else {
      resetForm()
    }
    await nextTick()
    runAnimation()
  },
)

const submitForm = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const payload = {
      event_id: props.eventId,
      title: form.value.title,
      schedule_date: `${form.value.date} ${form.value.time}`,
      location: form.value.location,
    }

    let response = null

    if (isEdit.value) {
      response = await updateMeeting(props.editData.id, payload)
      dialogType.value = 'success'
      dialogTitle.value = 'Update Berhasil'
      dialogMessage.value = 'Data Rapat berhasil diperbarui'
    } else {
      response = await createMeeting(payload)
      dialogType.value = 'success'
      dialogTitle.value = 'Tambah Berhasil'
      dialogMessage.value = 'Rapat baru berhasil ditambahkan'
    }

    showDialog.value = true
    emit('save', {
      mode: props.mode,
      payload: response.data,
    })

    confirmDialog.value = false
    model.value = false
  } catch (error) {
    dialogType.value = 'error'
    dialogTitle.value = isEdit.value ? 'Update Gagal' : 'Tambah Gagal'
    dialogMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan rapat'
    showDialog.value = true
  } finally {
    loading.value = false
  }
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
