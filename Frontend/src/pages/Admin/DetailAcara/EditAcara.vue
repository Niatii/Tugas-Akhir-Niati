<template>
  <q-page class="q-pa-lg">
    <!-- Breadcrumbs-->
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" size="1.2em" color="grey-6" />
        </template>
        <q-breadcrumbs-el label="Kelola Acara" icon="event" class="text-grey-9" />
        <q-breadcrumbs-el label="Edit Acara" icon="edit" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <div class="q-px-xl flex justify-center">
      <q-card style="border-radius: 24px; min-width: 900px" class="shadow-3 form-card">
        <q-card-section class="q-pa-lg">
          <div class="text-center">
            <div class="text-h5 text-weight-bold text-indigo-9 q-mb-xs">
              <q-icon name="edit" size="32px" class="q-mr-sm" />
              Edit Acara
            </div>
            <div class="text-grey-7 text-subtitle2">
              Lengkapi formulir berikut untuk mengedit acara
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- Formulir Tambah Acara -->
          <div class="q-pa-lg bg-blue-1" style="border-radius: 20px">
            <!-- Judul Acara -->
            <div class="row items-center q-mb-xs">
              <q-icon name="title" size="20px" color="indigo-9" class="q-mr-sm" />
              <span class="text-weight-medium">Judul Acara</span>
              <span class="text-red q-ml-xs">*</span>
            </div>
            <q-input
              v-model="judul"
              dense
              outlined
              class="q-mb-md"
              placeholder="Masukkan judul acara"
              :error="errors.judul"
              :error-message="errors.judul ? 'Judul acara wajib diisi' : ''"
              @update:model-value="errors.judul = false"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="edit" color="grey-6" />
              </template>
            </q-input>

            <!-- Deskripsi -->
            <div class="row items-center q-mb-xs">
              <q-icon name="description" size="20px" color="indigo-9" class="q-mr-sm" />
              <span class="text-weight-medium">Deskripsi Acara</span>
              <span class="text-red q-ml-xs">*</span>
            </div>
            <RichTextEditor
              v-model="deskripsi"
              placeholder="Masukkan deskripsi acara secara lengkap"
              class="q-mb-md"
              :error="errors.deskripsi"
            />
            <div
              v-if="errors.deskripsi"
              class="text-negative text-caption q-mt-xs q-mb-md flex items-center"
            >
              <q-icon name="error" size="18px" class="q-mr-xs" />
              Deskripsi acara wajib diisi
            </div>

            <!-- Tanggal -->
            <div class="row q-col-gutter-md">
              <!-- PENDAFTARAN BUKA -->
              <div class="col-12 col-md-6">
                <div class="q-my-xs">
                  Pendaftaran Dibuka
                  <span class="text-red">*</span>
                </div>

                <DateInput
                  v-model="tanggalDaftarMulai"
                  placeholder="Pilih tanggal buka pendaftaran"
                  class="bg-white"
                  :max-date="tanggalDaftarSelesai"
                  style="border-radius: 12px"
                />
              </div>

              <!-- PENDAFTARAN TUTUP -->
              <div class="col-12 col-md-6">
                <div class="q-my-xs">
                  Pendaftaran Ditutup
                  <span class="text-red">*</span>
                </div>

                <DateInput
                  v-model="tanggalDaftarSelesai"
                  placeholder="Pilih tanggal tutup pendaftaran"
                  class="bg-white"
                  :min-date="tanggalDaftarMulai"
                  :max-date="tanggalMulai"
                  style="border-radius: 12px"
                />
              </div>

              <!-- ACARA MULAI -->
              <div class="col-12 col-md-6">
                <div class="q-my-xs">
                  Acara Dimulai
                  <span class="text-red">*</span>
                </div>

                <DateInput
                  v-model="tanggalMulai"
                  placeholder="Pilih tanggal mulai acara"
                  class="bg-white"
                  :min-date="tanggalDaftarSelesai"
                  :max-date="tanggalSelesai"
                  style="border-radius: 12px"
                />
              </div>

              <!-- ACARA SELESAI -->
              <div class="col-12 col-md-6">
                <div class="q-my-xs">
                  Acara Berakhir
                  <span class="text-red">*</span>
                </div>

                <DateInput
                  v-model="tanggalSelesai"
                  placeholder="Pilih tanggal selesai acara"
                  class="bg-white"
                  :min-date="tanggalMulai"
                  style="border-radius: 12px"
                />
              </div>
            </div>

            <!-- Foto Acara -->
            <div class="row items-center q-mb-xs">
              <q-icon name="image" size="20px" color="indigo-9" class="q-mr-sm" />
              <span class="text-weight-medium">Foto Acara</span>
              <span class="text-red q-ml-xs">*</span>
            </div>

            <div class="q-mb-md">
              <q-card flat bordered class="overflow-hidden" style="border-radius: 16px">
                <q-img :src="imagePreview || gambar" style="height: 250px" fit="cover">
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-2">
                      <q-icon name="broken_image" size="48px" color="grey-5" />
                    </div>
                  </template>
                </q-img>
              </q-card>
            </div>
            <div class="text-caption text-grey-6 q-mb-xs">
              Format: JPG, JPEG, PNG • Maksimal 5 MB
            </div>

            <q-btn
              :label="foto ? 'Ganti Foto' : 'Upload Foto'"
              icon="cloud_upload"
              outline
              color="indigo-9"
              no-caps
              style="border-radius: 12px"
              class="q-mb-md"
              @click="$refs.fileInput.click()"
            />
            <input
              ref="fileInput"
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              style="display: none"
              @change="handleFileUpload"
            />
            <div v-if="foto" class="text-caption text-grey-7 q-mb-md">
              <q-icon name="check_circle" color="positive" size="18px" />
              {{ foto.name }}
            </div>

            <!-- Benefit -->
            <div class="row items-center q-mb-xs">
              <q-icon name="card_giftcard" size="20px" color="indigo-9" class="q-mr-sm" />
              <span class="text-weight-medium">Benefit</span>
              <span class="text-red q-ml-xs">*</span>
            </div>
            <RichTextEditor
              v-model="benefit"
              placeholder="Masukkan benefit yang didapat saat mengikuti acara"
              class="q-mb-md"
              :error="errors.benefit"
            />

            <!-- Syarat -->
            <div class="row items-center q-mb-xs">
              <q-icon name="rule" size="20px" color="indigo-9" class="q-mr-sm" />
              <span class="text-weight-medium">Syarat dan Ketentuan</span>
              <span class="text-red q-ml-xs">*</span>
            </div>
            <RichTextEditor
              v-model="syarat"
              placeholder="Masukkan syarat dan ketentuan untuk mengikuti acara"
              class="q-mb-md"
              :error="errors.syarat"
            />

            <!-- Deskripsi Divisi -->
            <div class="row items-center q-mb-xs">
              <q-icon name="category" size="20px" color="indigo-9" class="q-mr-sm" />
              <span class="text-weight-medium">Deskripsi Divisi</span>
              <span class="text-red q-ml-xs">*</span>
            </div>
            <RichTextEditor
              v-model="deskripsiDivisi"
              placeholder="Masukkan deskripsi divisi yang tersedia di dalam acara"
              class="q-mb-md"
              :error="errors.deskripsiDivisi"
            />

            <!-- Divisi -->
            <div class="row items-center q-mb-md">
              <q-icon name="groups" size="20px" color="indigo-9" class="q-mr-sm" />
              <span class="text-weight-medium">Tambah Divisi Acara</span>
              <span class="text-red q-ml-xs">*</span>
            </div>

            <div
              v-if="divisis.length === 0"
              class="text-center q-pa-xl bg-grey-2 rounded-borders-12 q-mb-md"
            >
              <q-icon name="groups" size="48px" color="grey-5" />
              <div class="text-grey-7 q-mt-sm">Belum ada divisi</div>
              <div class="text-caption text-grey-6">Klik tombol di bawah untuk menambah divisi</div>
            </div>

            <transition-group name="slide" tag="div">
              <div v-for="(divisi, index) in divisis" :key="index" class="divisi-card q-mb-md">
                <div class="flex justify-between items-center q-mb-sm">
                  <div class="flex items-center">
                    <q-chip size="sm" color="indigo-9" text-color="white" class="q-mr-sm">
                      {{ index + 1 }}
                    </q-chip>
                    <span class="text-weight-medium">Divisi {{ index + 1 }}</span>
                  </div>

                  <q-btn
                    icon="delete"
                    flat
                    round
                    color="negative"
                    size="sm"
                    :disable="divisis.length === 1"
                    @click="removeDivisi(index)"
                  >
                    <q-tooltip>Hapus Divisi</q-tooltip>
                  </q-btn>
                </div>

                <q-input
                  v-model="divisi.nama"
                  placeholder="Nama Divisi"
                  dense
                  outlined
                  class="q-mb-sm"
                  :error="errors.divisi && !divisi.nama.trim()"
                  :error-message="
                    errors.divisi && !divisi.nama.trim() ? 'Nama divisi wajib diisi' : ''
                  "
                  @update:model-value="validateDivisi"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" color="grey-6" />
                  </template>
                </q-input>
              </div>
            </transition-group>

            <div
              v-if="errors.divisi"
              class="text-negative text-caption q-mt-xs q-mb-md flex items-center"
            >
              <q-icon name="error" size="18px" class="q-mr-xs" />
              {{ errors.divisi === true ? 'Minimal harus ada 1 divisi' : errors.divisi }}
            </div>

            <q-btn
              icon="add"
              label="Tambah Divisi"
              outline
              color="indigo-9"
              no-caps
              style="border-radius: 12px"
              class="q-mt-md"
              @click="addDivisi"
            />
          </div>

          <div class="row justify-center q-col-gutter-md q-py-xl">
            <div class="col-auto">
              <q-btn
                rounded
                no-caps
                icon="check_circle"
                label="Update Acara"
                color="indigo-9"
                class="q-px-xl text-white submit-button motion-btn"
                :loading="loadingConfirm"
                :disable="!isFormValid"
                @click="onSubmit('update')"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-inner-loading :showing="loadingConfirm">
      <q-spinner size="50px" color="indigo-9" />
      <div class="q-mt-sm text-grey-7">Menyimpan acara...</div>
    </q-inner-loading>

    <q-banner
      v-if="showErrorBanner"
      class="bg-negative text-white error-banner fixed-top q-mt-md"
      style="z-index: 9999; border-radius: 12px; margin: 0 20px"
    >
      <template v-slot:avatar>
        <q-icon name="error" />
      </template>
      Mohon lengkapi semua field yang wajib diisi sebelum menyimpan.
      <template v-slot:action>
        <q-btn flat color="white" label="Tutup" @click="showErrorBanner = false" />
      </template>
    </q-banner>

    <!-- GANTI Confirm Dialog -->

    <ConfirmDialog
      v-model="showConfirm"
      type="warning"
      title="Edit Acara"
      message="Apakah Anda yakin ingin menyimpan perubahan pada acara ini?"
      confirm-label="Ya, Simpan"
      cancel-label="Batal"
      :loading="loadingConfirm"
      @confirm="onConfirmSubmit"
    />
    <FooterComponent />
    <StatusDialog
      v-model="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
    />
  </q-page>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'

import { useQuasar } from 'quasar'
import { animate } from 'motion'
import { useRoute, useRouter } from 'vue-router'
import { getEventById, updateEvent } from 'src/services/event.api'

import gambar from 'src/assets/image/gambar.jpg'
import RichTextEditor from 'src/components/RichTextEditor.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import DateInput from 'src/components/DateInput.vue'
import FooterComponent from 'src/components/FooterComponent.vue'
import StatusDialog from 'src/components/StatusDialog.vue'

// App
const $q = useQuasar()

const route = useRoute()
const router = useRouter()

const eventId = route.params.id

// State
const showConfirm = ref(false)
const showErrorBanner = ref(false)
const loadingConfirm = ref(false)

const submitStatus = ref('draft')

const judul = ref('')
const deskripsi = ref('')
const benefit = ref('')
const syarat = ref('')
const deskripsiDivisi = ref('')

const tanggalMulai = ref('')
const tanggalSelesai = ref('')
const tanggalDaftarMulai = ref('')
const tanggalDaftarSelesai = ref('')

const foto = ref(null)
const imagePreview = ref(null)

const divisis = ref([{ nama: '' }])

const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')

// Validasi
const errors = ref({
  judul: false,
  deskripsi: false,
  benefit: false,
  syarat: false,
  deskripsiDivisi: false,
  tanggalMulai: false,
  tanggalSelesai: false,
  tanggalDaftarMulai: false,
  tanggalDaftarSelesai: false,
  divisi: false,
})

// Animasi
onMounted(() => {
  animate(
    '.form-card',
    {
      opacity: [0, 1],
      y: [16, 0],
    },
    {
      duration: 0.35,
      easing: 'ease-out',
    },
  )
  loadEvent()
  bindButtonMotion()
})

const loadEvent = async () => {
  try {
    const res = await getEventById(eventId)
    const data = res.data.data

    judul.value = data.title
    deskripsi.value = data.description
    benefit.value = data.benefit
    syarat.value = data.requirement
    deskripsiDivisi.value = data.description_divisi

    tanggalMulai.value = data.start_date?.slice(0, 10)
    tanggalSelesai.value = data.end_date?.slice(0, 10)
    tanggalDaftarMulai.value = data.registration_start?.slice(0, 10)
    tanggalDaftarSelesai.value = data.registration_end?.slice(0, 10)

    imagePreview.value = data.image_url

    // 🔥 mapping division
    divisis.value = data.divisions?.map((d) => ({
      nama: d.name,
      id: d.id, // penting untuk update
    })) || [{ nama: '' }]
  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: 'Gagal load data event',
    })
  }
}

const bindButtonMotion = () => {
  const buttons = document.querySelectorAll('.motion-btn')

  buttons.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      animate(
        el,
        {
          y: -2,
          scale: 1.02,
        },
        {
          duration: 0.15,
        },
      )
    })

    el.addEventListener('mouseleave', () => {
      animate(
        el,
        {
          y: 0,
          scale: 1,
        },
        {
          duration: 0.15,
        },
      )
    })

    el.addEventListener('mousedown', () => {
      animate(
        el,
        {
          scale: 0.98,
        },
        {
          duration: 0.08,
        },
      )
    })
  })
}

// Helpers
const isEditorEmpty = (html) => {
  if (!html) return true

  const text = html.replace(/<(.|\n)*?>/g, '').trim()

  return text.length === 0
}

// const resetForm = () => {
//   judul.value = ''
//   deskripsi.value = ''
//   benefit.value = ''
//   syarat.value = ''
//   deskripsiDivisi.value = ''

//   tanggalMulai.value = ''
//   tanggalSelesai.value = ''

//   foto.value = null
//   imagePreview.value = null

//   divisis.value = [{ nama: '' }]
// }

// Computed
const isFormValid = computed(() => {
  const validDivisi =
    divisis.value.length > 0 && divisis.value.every((item) => item.nama.trim() !== '')

  return (
    judul.value.trim() !== '' &&
    !isEditorEmpty(deskripsi.value) &&
    !isEditorEmpty(benefit.value) &&
    !isEditorEmpty(syarat.value) &&
    !isEditorEmpty(deskripsiDivisi.value) &&
    tanggalMulai.value &&
    tanggalSelesai.value &&
    tanggalDaftarMulai.value &&
    tanggalDaftarSelesai.value &&
    // foto.value &&
    validDivisi
  )
})

// File Upload Handler
const handleFileUpload = (event) => {
  const file = event.target.files?.[0]

  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/png']

  const maxSize = 5 * 1024 * 1024

  if (!allowedTypes.includes(file.type)) {
    notifyError('Format file hanya JPG, JPEG, atau PNG')

    event.target.value = ''
    return
  }

  if (file.size > maxSize) {
    notifyError('Ukuran file maksimal 5 MB')

    event.target.value = ''
    return
  }

  foto.value = file

  const reader = new FileReader()

  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }

  reader.readAsDataURL(file)
}

const notifyError = (message) => {
  $q.notify({
    type: 'negative',
    message,
    position: 'top',
  })
}

// Divisi Handlers
const addDivisi = async () => {
  divisis.value.push({
    nama: '',
  })

  await nextTick()

  const cards = document.querySelectorAll('.divisi-card')

  const last = cards[cards.length - 1]

  if (last) {
    animate(
      last,
      {
        opacity: [0, 1],
        y: [12, 0],
      },
      {
        duration: 0.25,
      },
    )
  }

  errors.value.divisi = false
}

const removeDivisi = (index) => {
  divisis.value.splice(index, 1)
  validateDivisi()
}

const validateDivisi = () => {
  if (divisis.value.length === 0) {
    errors.value.divisi = 'Minimal harus ada 1 divisi'
    return
  }

  const hasEmpty = divisis.value.some((item) => !item.nama.trim())

  errors.value.divisi = hasEmpty ? 'Semua divisi harus diisi' : false
}

// Submit Handler
const onSubmit = (status) => {
  submitStatus.value = status

  if (status === 'aktif' && !isFormValid.value) {
    showErrorBanner.value = true

    setTimeout(() => {
      showErrorBanner.value = false
    }, 3000)

    return
  }

  showConfirm.value = true
}

// GANTI onConfirmSubmit

const onConfirmSubmit = async () => {
  loadingConfirm.value = true

  try {
    const payload = {
      user_id: 1, // backend akan ambil dari token
      title: judul.value,
      description: deskripsi.value,
      benefit: benefit.value,
      requirement: syarat.value,
      description_divisi: deskripsiDivisi.value,

      start_date: tanggalMulai.value,
      end_date: tanggalSelesai.value,
      registration_start: tanggalDaftarMulai.value,
      registration_end: tanggalDaftarSelesai.value,

      // status: submitStatus.value === 'draft' ? 0 : 1,

      divisis: divisis.value.map((d) => ({
        id: d.id, // kalau ada
        name: d.nama,
      })),
    }

    await updateEvent(eventId, payload)

    dialogType.value = 'success'
    dialogTitle.value = 'Perubahan Acara Berhasil Tersimpan'
    showDialog.value = true
    showConfirm.value = false

  } catch (error) {
    console.error(error)

    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value =
      error.response?.data?.message || 'Terjadi kesalahan saat menyimpan acara. Silakan coba lagi.'

    showDialog.value = true
  } finally {
    loadingConfirm.value = false
  }
}
// watchers
watch(showErrorBanner, (val) => {
  if (!val) return

  animate(
    '.error-banner',
    {
      opacity: [0, 1],
      y: [-12, 0],
    },
    {
      duration: 0.22,
    },
  )
})

watch(showDialog, (val) => {
  if (!val) {
    router.push('/admin/detail')
  }
})

watch(judul, () => {
  errors.value.judul = false
})

watch(deskripsi, () => {
  errors.value.deskripsi = false
})

watch(benefit, () => {
  errors.value.benefit = false
})

watch(syarat, () => {
  errors.value.syarat = false
})

watch(deskripsiDivisi, () => {
  errors.value.deskripsiDivisi = false
})

watch(foto, (val) => {
  if (val) {
    showErrorBanner.value = false
  }
})
</script>

<style scoped>
:root {
  --primary: #4f46e5;
  --primary-soft: #6366f1;
  --danger: #f44336;
  --border: #e5e7eb;
  --muted: #f8fafc;
  --scroll-track: #f1f1f1;
  --disabled-1: #9ca3af;
  --disabled-2: #d1d5db;
}

:deep(.q-field--outlined .q-field__control) {
  border-radius: 16px;
  transition: border-color 0.2s ease;
}

:deep(.q-field--outlined .q-field__control:hover) {
  border-color: var(--primary);
}

:deep(.q-field--error .q-field__control) {
  border-color: var(--danger);
}

:deep(.q-field--focused .q-field__control) {
  border-color: var(--primary);
}

.custom-input {
  background: white;
  border-radius: 30px;
}

.divisi-card {
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 20px;
  background: white;
  position: relative;
  overflow: hidden;
}

.divisi-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--primary-soft));
  opacity: 0.95;
}

.submit-button {
  min-width: 300px;
  border-radius: 50px;
  background: linear-gradient(135deg, var(--primary), var(--primary-soft));
}

.submit-button:disabled {
  background: linear-gradient(135deg, var(--disabled-1), var(--disabled-2));
  opacity: 0.72;
}

.rounded-btn {
  border-radius: 12px;
}

.q-inner-loading {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(4px);
}

.q-chip {
  border-radius: 10px;
  font-weight: 600;
}

:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--scroll-track);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-soft);
}

@media (max-width: 768px) {
  .q-px-xl {
    padding-left: 16px;
    padding-right: 16px;
  }

  [style*='min-width: 900px'] {
    min-width: 100% !important;
  }

  .submit-button {
    min-width: 100%;
  }

  .divisi-card {
    padding: 16px;
    border-radius: 18px;
  }
}
</style>
