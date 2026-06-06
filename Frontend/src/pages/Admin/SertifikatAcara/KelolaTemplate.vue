<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- ERROR STATE -->
    <div v-if="hasError" class="column items-center justify-center q-pa-xl text-center bg-white rounded-card shadow-1 q-my-md motion-card" style="min-height: 50vh; border-radius: 18px;">
      <q-icon name="gpp_bad" size="80px" color="negative" class="q-mb-md" />
      <div class="text-h5 text-weight-bold text-grey-9 q-mb-xs">Akses Ditolak</div>
      <div class="text-subtitle1 text-grey-7 q-mb-lg" style="max-width: 500px;">
        {{ errorMessage || 'Anda tidak memiliki akses ke template sertifikat ini.' }}
      </div>
      <q-btn color="indigo-9" label="Kembali ke Kelola Sertifikat" no-caps rounded @click="router.push('/admin/sertifikat')" />
    </div>

    <div v-else>
      <!-- BREADCRUMB -->
      <div class="q-mb-md motion-card">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" color="grey-6" size="1.1em" />
        </template>
        <q-breadcrumbs-el
          label="Kelola Sertifikat"
          icon="workspace_premium"
          class="text-grey-8 cursor-pointer"
          @click="$router.push('/admin/sertifikat')"
        />
        <q-breadcrumbs-el label="Template Sertifikat" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Template Sertifikat</div>
        <div class="text-grey-7">Kelola Latar Belakang dan layout field sertifikat.</div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="indigo-9" size="50px" />
    </div>

    <!-- GRID TEMPLATES -->
    <div v-else class="row q-col-gutter-lg">
      <div v-for="template in templates" :key="template.id" class="col-12 col-sm-6 col-md-4">
        <q-card class="rounded-card template-card motion-card">
          <!-- BACKGROUND PREVIEW -->
          <div
            class="template-preview"
            :style="
              template.background_url
                ? `background-image: url('${apiBase}${template.background_url}')`
                : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            "
          >
            <!-- DEFAULT BADGE -->
            <q-badge v-if="template.is_default" color="amber" class="template-default-badge">
              <q-icon name="star" size="12px" class="q-mr-xs" />
              Default
            </q-badge>

            <div v-if="!template.background_url" class="flex flex-center full-height">
              <q-icon name="image" color="white" size="56px" style="opacity: 0.4" />
            </div>
          </div>

          <!-- CARD BODY -->
          <q-card-section class="q-pb-xs">
            <div class="text-weight-bold text-body1 ellipsis">{{ template.name }}</div>
            <div class="text-caption text-grey-7">
              {{ template.fields?.length || 0 }} field dikonfigurasi
            </div>
          </q-card-section>

          <!-- ACTIONS -->
          <q-card-actions class="q-pt-none q-px-md q-pb-md">
            <q-btn
              unelevated
              color="indigo-9"
              icon="edit"
              label="Editor"
              no-caps
              size="sm"
              rounded
              :disable="hasPublishedCerts"
              @click="openEditor(template)"
            />
            <q-space />
            <q-btn
              flat
              round
              dense
              icon="edit_note"
              color="grey-8"
              :disable="hasPublishedCerts"
              @click="openEditDialog(template)"
            >
              <q-tooltip>Rename</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="delete" color="negative" :disable="hasPublishedCerts" @click="confirmDelete(template)">
              <q-tooltip>Hapus</q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      <!-- EMPTY -->
      <div v-if="!templates.length" class="col-12">
        <q-card flat bordered class="rounded-card q-pa-xl text-center">
          <q-icon name="style" size="64px" color="grey-4" />
          <div class="text-h6 text-grey-6 q-mt-md">Belum ada template</div>
          <div class="text-grey-5 q-mb-lg">
            Tambahkan template untuk memulai generate sertifikat.
          </div>
          <q-btn
            color="indigo-9"
            icon="add"
            label="Tambah Template"
            no-caps
            rounded
            :disable="hasActiveTemplate"
            @click="openCreateDialog"
          />
        </q-card>
      </div>
    </div>

    <!-- CREATE / EDIT DIALOG -->
    <q-dialog v-model="showFormDialog">
      <q-card style="min-width: 420px; border-radius: 18px">
        <q-form @submit.prevent="submitForm">
          <q-card-section class="bg-indigo-9 text-white" style="border-radius: 18px 18px 0 0">
            <div class="text-h6">
              <q-icon :name="editMode ? 'edit' : 'add'" class="q-mr-sm" />
              {{ editMode ? 'Edit Template' : 'Tambah Template' }}
            </div>
          </q-card-section>
          <q-card-section class="q-gutter-sm q-pa-lg">
            <q-input
              v-model="formName"
              outlined
              dense
              label="Nama Template"
              placeholder="contoh: Template Panitia 2026"
              :rules="[(v) => !!v || 'Nama wajib diisi']"
            />
            <q-file
              v-model="formBackground"
              :label="editMode ? 'Latar Belakang' : 'Latar Belakang (wajib)'"
              accept=".png,.jpg,.jpeg"
              outlined
              dense
              :rules="editMode ? [] : [(v) => !!v || 'Latar Belakang wajib diisi']"
            >
              <template #prepend><q-icon name="image" /></template>
            </q-file>
            <div v-if="formBackground" class="text-caption text-grey-7">
              Preview background akan tersedia setelah disimpan.
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-pb-md q-pr-md">
            <q-btn flat color="grey" label="Batal" v-close-popup no-caps />
            <q-btn
              type="submit"
              color="indigo-9"
              :label="editMode ? 'Simpan' : 'Buat Template'"
              :loading="formLoading"
              no-caps
              rounded
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    </div>

    <!-- CONFIRM DELETE -->
    <ConfirmDialog
      v-model="showDeleteDialog"
      type="danger"
      title="Hapus Template"
      message="Template ini akan dihapus permanen beserta semua konfigurasi field-nya. Lanjutkan?"
      confirm-label="Ya, Hapus"
      cancel-label="Batal"
      @confirm="doDelete"
    />

    <StatusDialog
      v-model="showStatusDialog"
      :type="statusType"
      :title="statusTitle"
      :message="statusMessage"
    />

    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { animate, stagger } from 'motion'
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from 'src/services/certificate.api'
import FooterComponent from 'src/components/FooterComponent.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'

const route = useRoute()
const router = useRouter()
const eventId = route.params.eventId

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const loading = ref(false)
const templates = ref([])

const hasActiveTemplate = computed(() => {
  return templates.value.some((t) => t.is_default)
})

const showFormDialog = ref(false)
const editMode = ref(false)
const formName = ref('')
const formBackground = ref(null)
const formLoading = ref(false)
const editTarget = ref(null)

const showDeleteDialog = ref(false)
const deleteTarget = ref(null)

const hasPublishedCerts = ref(false)

const hasError = ref(false)
const errorMessage = ref('')

const showStatusDialog = ref(false)
const statusType = ref('success')
const statusTitle = ref('')
const statusMessage = ref('')

const fetchTemplates = async () => {
  loading.value = true
  hasError.value = false
  errorMessage.value = ''
  try {
    const res = await getTemplates(eventId)
    templates.value = res.data.data?.templates || []
    hasPublishedCerts.value = !!res.data.data?.has_published_certificates
  } catch (e) {
    console.error(e)
    hasError.value = true
    errorMessage.value = e.response?.data?.message || 'Anda tidak memiliki akses ke template sertifikat ini.'
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  editMode.value = false
  formName.value = ''
  formBackground.value = null
  editTarget.value = null
  showFormDialog.value = true
}

const openEditDialog = (template) => {
  editMode.value = true
  editTarget.value = template
  formName.value = template.name
  formBackground.value = null
  showFormDialog.value = true
}

const submitForm = async () => {
  if (!formName.value || !formName.value.trim()) {
    showStatusMsg('error', 'Validasi Gagal', 'Nama template wajib diisi.')
    return
  }
  if (!editMode.value && !formBackground.value) {
    showStatusMsg('error', 'Validasi Gagal', 'Background template wajib diunggah.')
    return
  }
  if (formBackground.value) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png']
    const filename = formBackground.value.name.toLowerCase()
    const hasValidExt = allowedExtensions.some((ext) => filename.endsWith(ext))
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const hasValidMime = allowedMimeTypes.includes(formBackground.value.type)
    if (!hasValidExt || !hasValidMime) {
      showStatusMsg(
        'error',
        'Format File Salah',
        'Format file background harus jpeg, jpg, atau png.',
      )
      return
    }
  }
  formLoading.value = true
  try {
    if (editMode.value) {
      await updateTemplate(
        eventId,
        editTarget.value.id,
        { name: formName.value },
        formBackground.value,
      )
      showStatusMsg('success', 'Berhasil', 'Template berhasil diperbarui.')
    } else {
      await createTemplate(eventId, formName.value, formBackground.value)
      showStatusMsg('success', 'Berhasil', 'Template berhasil dibuat.')
    }
    showFormDialog.value = false
    await fetchTemplates()
  } catch (e) {
    showStatusMsg('error', 'Gagal', e.response?.data?.message || 'Terjadi kesalahan.')
  } finally {
    formLoading.value = false
  }
}

const confirmDelete = (template) => {
  deleteTarget.value = template
  showDeleteDialog.value = true
}

const doDelete = async () => {
  try {
    await deleteTemplate(eventId, deleteTarget.value.id)
    showDeleteDialog.value = false
    showStatusMsg('success', 'Dihapus', 'Template berhasil dihapus.')
    await fetchTemplates()
  } catch (e) {
    showDeleteDialog.value = false
    showStatusMsg('error', 'Gagal', e.response?.data?.message || 'Gagal menghapus template.')
  }
}



const openEditor = (template) => {
  router.push(`/admin/editor-template/${eventId}/${template.id}`)
}

const showStatusMsg = (type, title, message) => {
  statusType.value = type
  statusTitle.value = title
  statusMessage.value = message
  showStatusDialog.value = true
}

onMounted(async () => {
  await fetchTemplates()
  await nextTick()
  animate(
    '.motion-card',
    { opacity: [0, 1], y: [16, 0] },
    { delay: stagger(0.08), duration: 0.4, easing: 'ease-out' },
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}
.template-card {
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.template-card:hover {
  box-shadow: 0 8px 32px rgba(80, 80, 200, 0.12);
}
.template-preview {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.template-default-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  padding: 4px 10px;
}
</style>
