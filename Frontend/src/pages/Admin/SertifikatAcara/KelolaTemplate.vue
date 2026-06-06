<template>
  <q-page class="q-pa-lg bg-grey-1">
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
        <div class="text-grey-7">Kelola background dan layout field sertifikat.</div>
      </div>
      <q-btn
        color="indigo-9"
        icon="add"
        label="Tambah Template"
        rounded
        no-caps
        @click="openCreateDialog"
      />
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="indigo-9" size="50px" />
    </div>

    <!-- GRID TEMPLATES -->
    <div v-else class="row q-col-gutter-lg">
      <div
        v-for="template in templates"
        :key="template.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card class="rounded-card template-card motion-card">
          <!-- BACKGROUND PREVIEW -->
          <div
            class="template-preview"
            :style="template.background_url
              ? `background-image: url('${apiBase}${template.background_url}')`
              : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)'"
          >
            <!-- DEFAULT BADGE -->
            <q-badge
              v-if="template.is_default"
              color="amber"
              class="template-default-badge"
            >
              <q-icon name="star" size="12px" class="q-mr-xs" />
              Default
            </q-badge>

            <div v-if="!template.background_url" class="flex flex-center full-height">
              <q-icon name="image" color="white" size="56px" style="opacity:0.4" />
            </div>
          </div>

          <!-- CARD BODY -->
          <q-card-section class="q-pb-xs">
            <div class="text-weight-bold text-body1 ellipsis">{{ template.name }}</div>
            <div class="text-caption text-grey-7">
              {{ (template.fields?.length || 0) }} field dikonfigurasi
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
              @click="openEditor(template)"
            />
            <q-space />
            <q-btn
              flat
              round
              dense
              icon="star_outline"
              color="amber-9"
              :disable="template.is_default"
              @click="setDefault(template)"
            >
              <q-tooltip>Set Default</q-tooltip>
            </q-btn>
            <q-btn
              flat round dense icon="content_copy" color="blue-9"
              @click="duplicateTemplate(template)"
            >
              <q-tooltip>Duplikasi</q-tooltip>
            </q-btn>
            <q-btn
              flat round dense icon="edit_note" color="grey-8"
              @click="openEditDialog(template)"
            >
              <q-tooltip>Rename</q-tooltip>
            </q-btn>
            <q-btn
              flat round dense icon="delete" color="negative"
              :disable="template.is_default"
              @click="confirmDelete(template)"
            >
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
          <div class="text-grey-5 q-mb-lg">Tambahkan template untuk memulai generate sertifikat.</div>
          <q-btn color="indigo-9" icon="add" label="Tambah Template" no-caps rounded @click="openCreateDialog" />
        </q-card>
      </div>
    </div>

    <!-- CREATE / EDIT DIALOG -->
    <q-dialog v-model="showFormDialog">
      <q-card style="min-width:420px;border-radius:18px">
        <q-form @submit.prevent="submitForm">
          <q-card-section
            class="bg-indigo-9 text-white"
            style="border-radius:18px 18px 0 0"
          >
            <div class="text-h6">
              <q-icon :name="editMode ? 'edit' : 'add'" class="q-mr-sm" />
              {{ editMode ? 'Edit Template' : 'Tambah Template' }}
            </div>
          </q-card-section>
          <q-card-section class="q-gutter-md q-pt-lg">
            <q-input
              v-model="formName"
              outlined
              label="Nama Template"
              placeholder="contoh: Template Panitia 2026"
              :rules="[(v) => !!v || 'Nama wajib diisi']"
            />
            <q-file
              v-model="formBackground"
              :label="editMode ? 'Background (PNG/JPG) — Opsional' : 'Background (PNG/JPG)'"
              accept=".png,.jpg,.jpeg"
              outlined
              :rules="editMode ? [] : [(v) => !!v || 'Background wajib diisi']"
            >
              <template #prepend><q-icon name="image" /></template>
            </q-file>
            <div v-if="formBackground" class="text-caption text-grey-7">
              Preview background akan tersedia setelah disimpan.
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-pb-md q-pr-md">
            <q-btn flat color="grey" label="Batal" v-close-popup />
            <q-btn
              type="submit"
              color="indigo-9"
              :label="editMode ? 'Simpan' : 'Buat Template'"
              :loading="formLoading"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

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
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { animate, stagger } from 'motion'
import {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate as apiDuplicate,
  setDefaultTemplate,
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

const showFormDialog = ref(false)
const editMode = ref(false)
const formName = ref('')
const formBackground = ref(null)
const formLoading = ref(false)
const editTarget = ref(null)

const showDeleteDialog = ref(false)
const deleteTarget = ref(null)

const showStatusDialog = ref(false)
const statusType = ref('success')
const statusTitle = ref('')
const statusMessage = ref('')

const fetchTemplates = async () => {
  loading.value = true
  try {
    const res = await getTemplates(eventId)
    templates.value = res.data.data?.templates || []
  } catch (e) {
    console.error(e)
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
  if (!formName.value.trim()) return
  if (!editMode.value && !formBackground.value) return
  formLoading.value = true
  try {
    if (editMode.value) {
      await updateTemplate(eventId, editTarget.value.id, { name: formName.value }, formBackground.value)
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

const duplicateTemplate = async (template) => {
  try {
    await apiDuplicate(eventId, template.id)
    showStatusMsg('success', 'Diduplikasi', 'Template berhasil diduplikasi.')
    await fetchTemplates()
  } catch (e) {
    showStatusMsg('error', 'Gagal', e.response?.data?.message || 'Gagal duplikasi.')
  }
}

const setDefault = async (template) => {
  try {
    await setDefaultTemplate(eventId, template.id)
    showStatusMsg('success', 'Default Diatur', `${template.name} sekarang menjadi template default.`)
    await fetchTemplates()
  } catch (e) {
    showStatusMsg('error', 'Gagal', e.response?.data?.message || 'Gagal set default.')
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
  animate('.motion-card', { opacity: [0, 1], y: [16, 0] }, { delay: stagger(0.08), duration: 0.4, easing: 'ease-out' })
})
</script>

<style scoped>
.rounded-card { border-radius: 18px; }
.template-card { overflow: hidden; transition: box-shadow 0.2s; }
.template-card:hover { box-shadow: 0 8px 32px rgba(80, 80, 200, 0.12); }
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
