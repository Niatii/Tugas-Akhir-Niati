<template>
  <q-page class="q-px-xl q-py-md">
    <div class="row q-pa-md q-col-gutter-md">
      <div class="col-12 col-md-4 q-mb-md">
        <q-card
          class="q-px-lg q-py-xl flex justify-center text-center shadow-2"
          style="border-radius: 20px; background: white"
        >
          <q-avatar size="160px" class="overflow-hidden shadow-1">
            <img
              :src="profilePhotoUrl || 'https://cdn.quasar.dev/img/avatar.png'"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%"
            />
          </q-avatar>

          <div class="full-width q-mt-md text-h6 text-bold text-grey-9">
            {{ user?.name || 'Mahasiswa' }}
          </div>
          <div class="full-width text-subtitle2 text-grey-6 q-mb-md">{{ user?.email }}</div>

          <div class="row q-col-gutter-sm q-mt-md items-stretch full-width">
            <!-- Acara -->
            <div class="col-6">
              <q-card
                flat
                class="stat-card text-center q-pa-md bg-indigo-1 full-height flex column justify-center"
                style="border-radius: 16px"
              >
                <div class="text-h5 text-weight-bold text-indigo-10 q-mt-xs">{{ totalEvents }}</div>
                <div class="text-caption text-grey-7">Acara Diikuti</div>
              </q-card>
            </div>

            <!-- Sertifikat -->
            <div class="col-6">
              <q-card
                flat
                class="stat-card text-center q-pa-md bg-indigo-1 full-height flex column justify-center"
                style="border-radius: 16px"
              >
                <div class="text-h5 text-weight-bold text-indigo-10 q-mt-xs">
                  {{ completedEvents }}
                </div>
                <div class="text-caption text-grey-7">Sertifikat</div>
              </q-card>
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card style="border-radius: 20px; background: white" class="q-pa-lg shadow-2">
          <div class="q-px-md q-mb-md">
            <div class="row items-center justify-between q-mb-md">
              <div class="flex items-center">
                <q-icon name="assignment_ind" size="28px" color="indigo-10" />
                <div class="q-ml-sm text-indigo-10 text-subtitle1 text-weight-medium">
                  Informasi Pribadi
                </div>
              </div>

              <div class="q-gutter-sm">
                <q-btn
                  v-if="editMode"
                  flat
                  label="Batal"
                  no-caps
                  rounded
                  class="q-px-md text-grey-7"
                  @click="cancelEdit"
                />
                <q-btn
                  color="indigo-9"
                  :label="editMode ? 'Simpan' : 'Edit Profil'"
                  no-caps
                  rounded
                  class="q-px-lg"
                  style="min-width: 130px"
                  @click="toggleEdit"
                />
              </div>
            </div>

            <div class="row q-col-gutter-lg q-mt-xs">
              <div class="col-12 col-sm-6">
                <div class="q-my-xs text-grey-7 text-caption">Nama Lengkap</div>
                <q-input
                  v-model="namaLengkap"
                  dense
                  outlined
                  :readonly="!editMode"
                  placeholder="Masukkan nama lengkap kamu"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>

                <div class="q-my-xs text-grey-7 text-caption">Jurusan</div>
                <q-select
                  v-model="selectedJurusan"
                  dense
                  outlined
                  emit-value
                  map-options
                  :disable="!editMode"
                  :options="jurusanOptions"
                  option-label="name"
                  option-value="id"
                  placeholder="Pilih jurusan kamu"
                  class="q-mb-sm"
                  @update:model-value="onJurusanChange"
                >
                  <template v-slot:prepend>
                    <q-icon name="school" />
                  </template>
                </q-select>

                <div class="q-my-xs text-grey-7 text-caption">Program Studi</div>
                <q-select
                  v-model="selectedProdi"
                  dense
                  outlined
                  emit-value
                  map-options
                  :disable="!editMode"
                  :options="prodiOptions"
                  option-label="name"
                  option-value="id"
                  placeholder="Pilih program studi kamu"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="menu_book" />
                  </template>
                </q-select>

                <div class="q-my-xs text-grey-7 text-caption">Angkatan</div>
                <q-input
                  v-model="angkatan"
                  dense
                  outlined
                  type="number"
                  :readonly="!editMode"
                  placeholder="Masukkan angkatan kamu"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_today" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <div class="q-my-xs text-grey-7 text-caption">NIM</div>
                <q-input
                  v-model="nim"
                  dense
                  outlined
                  :readonly="!editMode"
                  placeholder="Masukkan NIM kamu"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" />
                  </template>
                </q-input>

                <div class="q-my-xs text-grey-7 text-caption">Email</div>
                <q-input
                  v-model="email"
                  dense
                  outlined
                  :readonly="!editMode"
                  placeholder="Masukkan email kamu"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>

                <div class="q-my-xs text-grey-7 text-caption">Nomor Telepon</div>
                <q-input
                  v-model="nomorTelepon"
                  dense
                  outlined
                  :readonly="!editMode"
                  placeholder="Masukkan nomor telepon kamu"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="phone" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <div class="q-px-md q-mt-md" v-if="editMode">
            <div class="q-mt-xs border-top q-pt-md">
              <div class="q-my-xs text-grey-7 text-caption">Foto Profil</div>

              <div class="row items-center q-gutter-md q-mb-md">
                <q-avatar size="80px">
                  <img
                    :src="profilePhotoUrl || 'https://cdn.quasar.dev/img/avatar.png'"
                    style="object-fit: cover"
                  />
                </q-avatar>

                <div class="col">
                  <q-file
                    v-model="fotoFile"
                    dense
                    outlined
                    label="Pilih Foto Baru"
                    accept="image/*"
                    @update:model-value="onUploadPhoto"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                  </q-file>
                </div>
              </div>

              <div class="q-my-xs text-grey-7 text-caption">Username</div>
              <q-input
                v-model="username"
                dense
                outlined
                placeholder="Masukkan username kamu"
                class="q-mb-sm"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card>

        <q-card style="border-radius: 20px" class="q-pa-sm q-mt-lg shadow-2">
          <div class="q-px-md q-mb-md">
            <div class="row q-col-gutter-lg q-mt-xs items-stretch">
              <!-- RIWAYAT ACARA -->
              <div class="col-12 col-sm-6 q-mb-md">
                <div class="bg-indigo-1 q-pa-lg column full-height" style="border-radius: 16px">
                  <div class="row items-center q-mb-md">
                    <q-icon name="event" size="28px" color="indigo-10" />
                    <div class="q-ml-sm text-indigo-10 text-subtitle1 text-weight-medium">
                      Riwayat Acara
                    </div>
                  </div>

                  <template v-if="completedEventsList.length > 0">
                    <div
                      v-for="item in completedEventsList"
                      :key="item.id"
                      class="q-pa-md bg-white full-width q-mb-sm shadow-1"
                      style="border-radius: 12px"
                    >
                      <div class="text-weight-bold text-indigo-10">{{ item.event.title }}</div>
                      <div class="text-grey-7 q-my-xs" style="font-size: 10px">
                        {{ formatDate(item.event.start_date) }}
                      </div>
                      <q-chip
                        class="q-px-md text-white bg-green-5 text-bold"
                        style="font-size: 9px"
                        dense
                      >
                        {{ item.event.status_name }}
                      </q-chip>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-center text-grey-6 q-py-xl">Belum ada riwayat acara.</div>
                  </template>
                </div>
              </div>

              <!-- SERTIFIKAT -->
              <div class="col-12 col-sm-6 q-mb-md">
                <div class="bg-indigo-1 q-pa-lg column full-height" style="border-radius: 16px">
                  <div class="row items-center q-mb-md">
                    <q-icon name="workspace_premium" size="28px" color="indigo-10" />
                    <div class="q-ml-sm text-indigo-10 text-subtitle1 text-weight-medium">
                      Sertifikat
                    </div>
                  </div>

                  <template v-if="completedEventsList.length > 0">
                    <div
                      v-for="item in completedEventsList"
                      :key="item.id"
                      class="q-pa-md bg-white q-mb-sm shadow-1"
                      style="border-radius: 12px"
                    >
                      <div class="row items-center justify-between">
                        <div
                          class="text-weight-bold text-indigo-10"
                          style="font-size: 12px; max-width: 60%"
                        >
                          {{ item.event.title }}
                        </div>
                        <q-btn
                          flat
                          dense
                          color="indigo-9"
                          icon="download"
                          label="Unduh"
                          no-caps
                          style="font-size: 11px"
                        />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-center text-grey-6 q-py-xl">Belum ada sertifikat.</div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
    <ConfirmDialog
      v-model="showConfirm"
      type="warning"
      title="Simpan Perubahan"
      message="Apakah Anda yakin ingin menyimpan perubahan profil?"
      confirm-label="Ya, Simpan"
      cancel-label="Batal"
      :loading="loadingConfirm"
      @confirm="onConfirmSave"
    />

    <StatusDialog
      v-model="showDialog"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
    />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { api } from 'boot/axios'
import { masterApi } from 'src/services/master.api'
import { getMyEvents } from 'src/services/event.api'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'

const user = ref(null)
const editMode = ref(false)

const namaLengkap = ref('')
const nim = ref('')
const selectedJurusan = ref(null)
const selectedProdi = ref(null)
const email = ref('')
const nomorTelepon = ref('')
const username = ref('')
const angkatan = ref('')
const fotoFile = ref(null)

const showConfirm = ref(false)
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const loadingConfirm = ref(false)

const events = ref([])

const jurusanOptions = ref([])
const prodiOptions = ref([])

const totalEvents = computed(() => events.value.length)
const completedEventsList = computed(() => {
  return events.value.filter(
    (e) => e.event?.status_name === 'Selesai' && e.registration_status_name === 'Diterima',
  )
})
const completedEvents = computed(() => completedEventsList.value.length)

const profilePhotoUrl = computed(() => {
  return user.value?.url || null
})

const cancelEdit = () => {
  if (user.value) {
    namaLengkap.value = user.value.name || ''
    nim.value = user.value.nim || ''
    selectedJurusan.value = user.value.jurusan_id || null
    selectedProdi.value = user.value.prodi_id || null
    email.value = user.value.email || ''
    nomorTelepon.value = user.value.phone_number || ''
    username.value = user.value.username || ''
    angkatan.value = user.value.batch_year || ''
    if (selectedJurusan.value) {
      masterApi.getProdiByJurusan(selectedJurusan.value).then((res) => {
        prodiOptions.value = res
      }).catch(() => {})
    } else {
      prodiOptions.value = []
    }
  }
  editMode.value = false
}

const toggleEdit = () => {
  if (editMode.value) {
    showConfirm.value = true
  } else {
    editMode.value = true
  }
}

const onConfirmSave = async () => {
  loadingConfirm.value = true
  try {
    const payload = {
      name: namaLengkap.value,
      email: email.value,
      username: username.value,
      phone_number: nomorTelepon.value,
      nim: nim.value,
      batch_year: angkatan.value ? String(angkatan.value) : null,
      jurusan_id: selectedJurusan.value,
      prodi_id: selectedProdi.value,
    }

    const res = await api.put('/api/v1/users', payload)
    if (res.data && res.data.data && res.data.data.user) {
      user.value = res.data.data.user
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      editMode.value = false
      showConfirm.value = false

      dialogType.value = 'success'
      dialogTitle.value = 'Berhasil'
      dialogMessage.value = 'Profil kamu berhasil diperbarui.'
      showDialog.value = true
    }
  } catch (err) {
    console.error('Error saving profile:', err)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan profil.'
    showDialog.value = true
  } finally {
    loadingConfirm.value = false
  }
}

const onJurusanChange = async (jurusanId) => {
  selectedProdi.value = null
  if (jurusanId) {
    try {
      prodiOptions.value = await masterApi.getProdiByJurusan(jurusanId)
    } catch (err) {
      console.error(err)
    }
  } else {
    prodiOptions.value = []
  }
}

const onUploadPhoto = async (file) => {
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await api.post(`/api/v1/users/${user.value.id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    if (res.data && res.data.data) {
      user.value = res.data.data
      localStorage.setItem('user', JSON.stringify(res.data.data))

      dialogType.value = 'success'
      dialogTitle.value = 'Berhasil'
      dialogMessage.value = 'Foto profil berhasil diperbarui.'
      showDialog.value = true
    }
  } catch (err) {
    console.error('Error uploading photo:', err)
    dialogType.value = 'error'
    dialogTitle.value = 'Gagal'
    dialogMessage.value = 'Foto profil gagal diunggah.'
    showDialog.value = true
  }
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    namaLengkap.value = user.value.name || ''
    nim.value = user.value.nim || ''
    selectedJurusan.value = user.value.jurusan_id || null
    selectedProdi.value = user.value.prodi_id || null
    email.value = user.value.email || ''
    nomorTelepon.value = user.value.phone_number || ''
    username.value = user.value.username || ''
    angkatan.value = user.value.batch_year || ''
  }

  try {
    jurusanOptions.value = await masterApi.getJurusan()
    if (selectedJurusan.value) {
      prodiOptions.value = await masterApi.getProdiByJurusan(selectedJurusan.value)
    }
  } catch (err) {
    console.error(err)
  }

  try {
    const res = await getMyEvents()
    events.value = res.data.data.events
  } catch (err) {
    console.error(err)
  }
})
</script>

<style>
.stat-card {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.stat-card q-icon {
  transition: transform 0.25s ease;
}

.stat-card:hover q-icon {
  transform: scale(1.15);
}

.border-top {
  border-top: 1px solid #eee;
}
</style>
