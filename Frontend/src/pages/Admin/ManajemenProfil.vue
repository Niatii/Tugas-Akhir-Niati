<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Profil Organisasi</div>
        <div class="text-grey-7">
          Informasi identitas organisasi, kontak, dan pengaturan publik.
        </div>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Total Event</div>
          <div class="text-h5 text-weight-bold">24</div>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Sertifikat Terbit</div>
          <div class="text-h5 text-weight-bold text-positive">520</div>
        </q-card>
      </div>
    </div>

    <div class="flex justify-end q-mb-sm" v-if="!isEdit">
      <q-btn
        color="indigo-9"
        icon="edit"
        label="Edit Profil"
        rounded
        no-caps
        class="motion-btn q-px-lg"
        @click="toggleEdit"
      />
    </div>

    <!-- CONTENT -->
    <div class="row q-col-gutter-lg">
      <!-- LEFT -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-lg text-center motion-card">
          <q-avatar size="120px" class="q-mb-md shadow-1">
            <img
              :src="profilePhotoUrl || 'https://cdn.quasar.dev/img/avatar.png'"
              style="object-fit: cover"
            />
          </q-avatar>

          <div class="text-h6 text-weight-bold">{{ form.name || 'Organisasi' }}</div>
          <q-separator class="q-my-md" />

          <div class="text-left">
            <div class="q-mb-sm text-grey-9">
              <q-icon name="email" class="q-mr-sm" color="indigo-9" />
              {{ form.email || '-' }}
            </div>

            <div class="q-mb-sm text-grey-9">
              <q-icon name="phone" class="q-mr-sm" color="indigo-9" />
              {{ form.phone_number || '-' }}
            </div>
          </div>
        </q-card>
      </div>

      <!-- RIGHT -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-card motion-card">
          <q-card-section>
            <div class="text-h6 text-weight-bold">Informasi Organisasi</div>
          </q-card-section>

          <q-separator />

          <!-- VIEW MODE -->
          <q-card-section v-if="!isEdit">
            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Nama Organisasi</div>
              <div>
                {{ form.name }}
              </div>
            </div>

            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Email Resmi</div>
              <div>
                {{ form.email }}
              </div>
            </div>

            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Nomor Telepon</div>
              <div>
                {{ form.phone_number }}
              </div>
            </div>

            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Username</div>
              <div>
                {{ form.username }}
              </div>
            </div>
          </q-card-section>

          <!-- EDIT MODE -->
          <q-card-section v-else>
            <div class="row q-col-gutter-md">
              <!-- Foto upload jika edit mode -->
              <div class="col-12 border-top q-pt-md q-mt-sm">
                <div class="text-caption text-grey-7 q-mb-xs">Logo Organisasi</div>
                <div class="row items-center q-gutter-md">
                  <q-avatar size="70px">
                    <img
                      :src="profilePhotoUrl || 'https://cdn.quasar.dev/img/avatar.png'"
                      style="object-fit: cover"
                    />
                  </q-avatar>

                  <div class="col">
                    <q-file
                      v-model="logoFile"
                      dense
                      outlined
                      label="Upload Logo Baru"
                      accept="image/*"
                      @update:model-value="onUploadLogo"
                    >
                      <template v-slot:prepend>
                        <q-icon name="cloud_upload" />
                      </template>
                    </q-file>
                  </div>
                </div>
              </div>
              <div class="col-12">
                <q-input v-model="form.name" outlined dense rounded label="Nama Organisasi" />
              </div>

              <div class="col-12 col-md-6">
                <q-input v-model="form.email" outlined dense rounded label="Email Resmi" />
              </div>

              <div class="col-12 col-md-6">
                <q-input v-model="form.phone_number" outlined dense rounded label="Nomor Telepon" />
              </div>

              <div class="col-12 col-md-6">
                <q-input v-model="form.username" outlined dense rounded label="Username" />
              </div>
            </div>

            <div class="text-right q-mt-lg">
              <q-btn flat label="Batal" no-caps class="q-mr-sm" @click="cancelEdit" />
              <q-btn
                color="indigo-9"
                label="Simpan"
                rounded
                no-caps
                class="motion-btn q-px-lg"
                @click="saveProfile"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <ConfirmDialog
      v-model="showConfirm"
      type="warning"
      title="Simpan Perubahan"
      message="Apakah Anda yakin ingin menyimpan perubahan profil organisasi?"
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
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { api } from 'boot/axios'
import FooterComponent from 'src/components/FooterComponent.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'
import { animate } from 'motion'

const user = ref(null)
const isEdit = ref(false)
const logoFile = ref(null)

const showConfirm = ref(false)
const showDialog = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const loadingConfirm = ref(false)

const form = ref({
  name: '',
  email: '',
  phone_number: '',
  username: '',
})

const profilePhotoUrl = computed(() => {
  return user.value?.url || null
})

const cancelEdit = () => {
  if (user.value) {
    form.value.name = user.value.name || ''
    form.value.email = user.value.email || ''
    form.value.phone_number = user.value.phone_number || ''
    form.value.username = user.value.username || ''
  }
  isEdit.value = false
}

const toggleEdit = () => {
  isEdit.value = true
}

const saveProfile = () => {
  showConfirm.value = true
}

const onConfirmSave = async () => {
  loadingConfirm.value = true
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone_number: form.value.phone_number,
      username: form.value.username,
    }

    const res = await api.put('/api/v1/users', payload)
    if (res.data && res.data.data && res.data.data.user) {
      user.value = res.data.data.user
      localStorage.setItem('user', JSON.stringify(res.data.data.user))
      isEdit.value = false

      dialogType.value = 'success'
      dialogTitle.value = 'Berhasil'
      dialogMessage.value = 'Profil organisasi berhasil diperbarui.'
      showDialog.value = true
      showConfirm.value = false
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

const onUploadLogo = async (file) => {
  if (!file) return
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await api.post(`/api/v1/users/${user.value.id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (res.data && res.data.data) {
      user.value = res.data.data
      localStorage.setItem('user', JSON.stringify(res.data.data))
    }
  } catch (err) {
    console.error('Error uploading photo:', err)
  }
}

onMounted(async () => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
    form.value.name = user.value.name || ''
    form.value.email = user.value.email || ''
    form.value.phone_number = user.value.phone_number || ''
    form.value.username = user.value.username || ''
  }

  await nextTick()

  // Clean, sleek group entry animation with minimal slide-up offset
  animate(
    '.motion-card',
    {
      opacity: [0, 1],
      y: [6, 0],
    },
    {
      duration: 0.3,
      easing: 'ease-out',
    },
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all 0.18s ease;
}

.border-top {
  border-top: 1px solid #eee;
}
</style>
