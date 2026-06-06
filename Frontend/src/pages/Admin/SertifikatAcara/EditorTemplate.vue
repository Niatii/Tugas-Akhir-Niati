<template>
  <q-page class="editor-page">
    <!-- TOP BAR -->
    <div class="editor-topbar row items-center no-wrap q-px-md">
      <q-btn flat round dense icon="arrow_back" color="white" @click="$router.back()" />
      <div class="text-white text-weight-bold q-ml-md text-body1 ellipsis">
        Editor Template — {{ template?.name || '...' }}
      </div>
      <q-space />
      <q-btn
        flat
        color="white"
        icon="preview"
        label="Preview"
        no-caps
        class="q-mr-sm"
        @click="openPreview"
      />
      <q-btn
        unelevated
        color="white"
        text-color="indigo-9"
        icon="save"
        label="Simpan Layout"
        no-caps
        :loading="saving"
        @click="saveLayout"
      />
    </div>

    <div class="editor-body row no-wrap">
      <!-- LEFT PANEL: Field Palette -->
      <div class="editor-panel-left q-pa-md">
        <div class="text-caption text-grey-5 q-mb-sm text-uppercase text-weight-bold">Field Tersedia</div>
        <div
          v-for="field in availableFields"
          :key="field.type"
          class="field-chip q-mb-sm"
          draggable="true"
          @dragstart="onDragStart($event, field)"
        >
          <q-icon :name="field.icon" size="16px" class="q-mr-sm" />
          {{ field.label }}
        </div>

        <q-separator dark class="q-my-md" />

        <!-- Canvas Size -->
        <div class="text-caption text-grey-5 q-mb-sm text-uppercase text-weight-bold">Kanvas</div>
        <div class="text-caption text-grey-6 q-mb-xs">Lebar (px)</div>
        <q-input v-model.number="canvasWidth" dense dark outlined type="number" class="q-mb-sm" />
        <div class="text-caption text-grey-6 q-mb-xs">Tinggi (px)</div>
        <q-input v-model.number="canvasHeight" dense dark outlined type="number" class="q-mb-sm" />
        <q-btn outline color="grey-5" label="Terapkan" size="sm" no-caps class="full-width q-mb-sm" @click="applyCanvasSize" />

        <q-separator dark class="q-my-md" />

        <!-- Snap Grid -->
        <div class="text-caption text-grey-5 q-mb-sm text-uppercase text-weight-bold">Grid Snap</div>
        <q-toggle v-model="snapEnabled" label="Aktifkan Snap" dark color="indigo-3" dense />
        <div v-if="snapEnabled" class="q-mt-sm">
          <div class="text-caption text-grey-6 q-mb-xs">Grid (px)</div>
          <q-input v-model.number="snapGrid" dense dark outlined type="number" />
        </div>
      </div>

      <!-- CENTER: Canvas -->
      <div
        class="editor-canvas-wrapper flex flex-center"
        @dragover.prevent
        @drop="onDrop"
        ref="canvasWrapper"
      >
        <div style="position:relative">
          <canvas id="cert-canvas" />
        </div>
      </div>

      <!-- RIGHT PANEL: Properties -->
      <div class="editor-panel-right q-pa-md">
        <div class="text-caption text-grey-5 q-mb-sm text-uppercase text-weight-bold">Properti</div>

        <template v-if="selectedObject">
          <div class="text-grey-4 text-caption q-mb-md">
            <q-chip dense color="indigo-9" text-color="white" size="sm">
              {{ selectedObject._fieldType || 'object' }}
            </q-chip>
          </div>

          <!-- Position -->
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <div class="text-caption text-grey-6">X</div>
              <q-input v-model.number="propX" dense dark outlined type="number" @change="applyProps" />
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-6">Y</div>
              <q-input v-model.number="propY" dense dark outlined type="number" @change="applyProps" />
            </div>
          </div>

          <!-- Size -->
          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-6">
              <div class="text-caption text-grey-6">Lebar</div>
              <q-input v-model.number="propW" dense dark outlined type="number" @change="applyProps" />
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-6">Tinggi</div>
              <q-input v-model.number="propH" dense dark outlined type="number" @change="applyProps" />
            </div>
          </div>

          <!-- Text properties (hide for image fields) -->
          <template v-if="!isImageField">
            <div class="text-caption text-grey-6 q-mb-xs">Font Size</div>
            <q-input v-model.number="propFontSize" dense dark outlined type="number" class="q-mb-sm" @change="applyTextProps" />

            <div class="text-caption text-grey-6 q-mb-xs">Font Family</div>
            <q-select
              v-model="propFontFamily"
              :options="fontFamilies"
              dark outlined dense class="q-mb-sm"
              @update:model-value="applyTextProps"
            />

            <div class="text-caption text-grey-6 q-mb-xs">Warna</div>
            <div class="row items-center q-mb-sm">
              <q-input v-model="propColor" dense dark outlined class="col" @change="applyTextProps" />
              <input type="color" v-model="propColor" class="color-picker q-ml-sm" @input="applyTextProps" />
            </div>

            <div class="text-caption text-grey-6 q-mb-xs">Alignment</div>
            <div class="row q-gutter-xs q-mb-sm">
              <q-btn
                v-for="a in ['left', 'center', 'right']"
                :key="a"
                flat dense
                :icon="a === 'left' ? 'format_align_left' : a === 'center' ? 'format_align_center' : 'format_align_right'"
                :color="propAlign === a ? 'indigo-3' : 'grey-6'"
                size="sm"
                @click="propAlign = a; applyTextProps()"
              />
            </div>

            <!-- Custom Text Label (only for custom_text) -->
            <template v-if="selectedObject._fieldType === 'custom_text'">
              <div class="text-caption text-grey-6 q-mb-xs">Teks</div>
              <q-input
                v-model="propCustomText"
                dense dark outlined class="q-mb-sm"
                @change="applyCustomText"
              />
            </template>
          </template>

          <!-- Rotation -->
          <div class="text-caption text-grey-6 q-mb-xs">Rotasi (°)</div>
          <q-slider v-model="propRotation" :min="-180" :max="180" dark color="indigo-3" class="q-mb-sm" @change="applyProps" />
          <div class="text-caption text-grey-5 text-center">{{ propRotation }}°</div>

          <q-separator dark class="q-my-sm" />

          <!-- Layer -->
          <div class="text-caption text-grey-5 q-mb-xs text-uppercase text-weight-bold">Layer</div>
          <div class="row q-gutter-xs">
            <q-btn flat dense size="sm" icon="flip_to_front" color="grey-5" @click="bringForward">
              <q-tooltip>Ke Depan</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="flip_to_back" color="grey-5" @click="sendBackward">
              <q-tooltip>Ke Belakang</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" icon="delete" color="negative" @click="deleteSelected">
              <q-tooltip>Hapus</q-tooltip>
            </q-btn>
          </div>
        </template>

        <div v-else class="text-grey-6 text-caption text-center q-mt-xl">
          <q-icon name="touch_app" size="32px" class="q-mb-sm" /><br />
          Klik objek di kanvas untuk mengedit propertinya.
        </div>
      </div>
    </div>

    <!-- PREVIEW DIALOG -->
    <q-dialog v-model="showPreviewDialog" maximized>
      <q-card class="bg-grey-2">
        <q-bar class="bg-indigo-9 text-white">
          <q-icon name="preview" />
          <div class="q-ml-sm">Preview Sertifikat (Data Dummy)</div>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup />
        </q-bar>
        <q-card-section class="flex flex-center q-pa-xl">
          <canvas id="preview-canvas" style="border: 1px solid #ccc; max-width: 100%;" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { getTemplate, saveTemplateFields } from 'src/services/certificate.api'
import { getEventById } from 'src/services/event.api'

const route = useRoute()
const $q = useQuasar()
const eventId = route.params.eventId
const templateId = route.params.templateId
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const template = ref(null)
const saving = ref(false)
const canvasWrapper = ref(null)

// Canvas dimensions
const canvasWidth = ref(842)  // A4 landscape ~842px at 96dpi
const canvasHeight = ref(595)

// Snap grid
const snapEnabled = ref(true)
const snapGrid = ref(10)

// Selected object props
const selectedObject = ref(null)
const propX = ref(0)
const propY = ref(0)
const propW = ref(200)
const propH = ref(40)
const propFontSize = ref(16)
const propFontFamily = ref('Arial')
const propColor = ref('#000000')
const propAlign = ref('left')
const propRotation = ref(0)
const propCustomText = ref('')
const eventDetails = ref(null)

const showPreviewDialog = ref(false)

const fontFamilies = ['Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Trebuchet MS', 'Courier New']

const isImageField = computed(() => {
  return selectedObject.value?._fieldType === 'qr_code' || selectedObject.value?._fieldType === 'ttd_digital'
})

const availableFields = [
  { type: 'nama_peserta', label: 'Nama Peserta', icon: 'person' },
  { type: 'nama_acara', label: 'Nama Acara', icon: 'event' },
  { type: 'tanggal_acara', label: 'Tanggal Acara', icon: 'calendar_today' },
  { type: 'jabatan', label: 'Jabatan', icon: 'badge' },
  { type: 'divisi', label: 'Divisi', icon: 'groups' },
  { type: 'nomor_sertifikat', label: 'Nomor Sertifikat', icon: 'tag' },
  { type: 'nama_organisasi', label: 'Nama Organisasi', icon: 'business' },
  { type: 'tahun', label: 'Tahun', icon: 'today' },
]

let fabricCanvas = null
let fabricLib = null

// Drag state
let dragFieldType = null

const onDragStart = (evt, field) => {
  dragFieldType = field
}

const onDrop = async (evt) => {
  if (!dragFieldType || !fabricCanvas) return
  // const rect = evt.currentTarget.getBoundingClientRect()
  const canvasRect = fabricCanvas.getElement().getBoundingClientRect()
  const x = evt.clientX - canvasRect.left
  const y = evt.clientY - canvasRect.top
  await addFieldToCanvas(dragFieldType, x, y)
  dragFieldType = null
}

const loadFabric = () => {
  return new Promise((resolve) => {
    if (window.fabric) return resolve(window.fabric)
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js'
    script.onload = () => resolve(window.fabric)
    document.head.appendChild(script)
  })
}

const initCanvas = async () => {
  fabricLib = await loadFabric()
  const { fabric } = { fabric: fabricLib }

  fabricCanvas = new fabric.Canvas('cert-canvas', {
    width: canvasWidth.value,
    height: canvasHeight.value,
    backgroundColor: '#ffffff',
  })

  // Load background
  if (template.value?.background_url) {
    const bgUrl = `${apiBase}${template.value.background_url}`
    fabric.Image.fromURL(
      bgUrl,
      (img) => {
        if (!img || !img.width) {
          console.warn('[Editor] Background gagal dimuat:', bgUrl)
          return
        }
        img.set({
          scaleX: canvasWidth.value / img.width,
          scaleY: canvasHeight.value / img.height,
          originX: 'left',
          originY: 'top',
        })
        fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas))
      },
    )
  }

  // Load existing fields
  if (template.value?.fields?.length) {
    for (const field of template.value.fields) {
      await addFieldToCanvas(
        availableFields.find((f) => f.type === field.field_type) || { type: field.field_type, label: field.label || field.field_type },
        field.pos_x,
        field.pos_y,
        field,
      )
    }
  }

  // Selection event
  fabricCanvas.on('selection:created', updateProps)
  fabricCanvas.on('selection:updated', updateProps)
  fabricCanvas.on('selection:cleared', () => { selectedObject.value = null })
  fabricCanvas.on('object:moving', (e) => {
    if (snapEnabled.value) {
      const obj = e.target
      obj.set({
        left: Math.round(obj.left / snapGrid.value) * snapGrid.value,
        top: Math.round(obj.top / snapGrid.value) * snapGrid.value,
      })
    }
    updateProps({ selected: [e.target] })
  })
  fabricCanvas.on('object:modified', (e) => updateProps({ selected: [e.target] }))
}

const getFieldDefaultText = (fieldType) => {
  const map = {
    nama_peserta: eventDetails.value?.event_members?.[0]?.name || 'Nama Peserta',
    nama_acara: eventDetails.value?.title || 'Nama Acara',
    tanggal_acara: eventDetails.value?.start_date
      ? new Date(eventDetails.value.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '1 Januari 2026',
    jabatan: eventDetails.value?.event_members?.[0]?.position || 'Panitia',
    divisi: eventDetails.value?.event_members?.[0]?.division || eventDetails.value?.divisions?.[0]?.name || 'Divisi Acara',
    nomor_sertifikat: 'CERT/1/2026/0001',
    nama_organisasi: 'Nama Organisasi',
    tahun: eventDetails.value?.start_date
      ? new Date(eventDetails.value.start_date).getFullYear().toString()
      : '2026',
    predikat: 'Sangat Baik',
    custom_text: 'Teks Kustom',
  }
  return map[fieldType] || fieldType
}

const addFieldToCanvas = async (fieldDef, x, y, existingField = null) => {
  const fabric = fabricLib
  const isImage = fieldDef.type === 'qr_code' || fieldDef.type === 'ttd_digital'

  let obj
  if (isImage) {
    // Placeholder rect for image fields
    const rect = new fabric.Rect({
      left: existingField?.pos_x ?? x,
      top: existingField?.pos_y ?? y,
      width: existingField?.width ?? 80,
      height: existingField?.height ?? 80,
      fill: fieldDef.type === 'qr_code' ? '#e8f5e9' : '#e3f2fd',
      stroke: fieldDef.type === 'qr_code' ? '#43a047' : '#1e88e5',
      strokeWidth: 1.5,
      rx: 4, ry: 4,
    })
    const label = new fabric.Text(fieldDef.type === 'qr_code' ? 'QR' : 'TTD', {
      fontSize: 14, fill: '#555', originX: 'center', originY: 'center',
    })
    const group = new fabric.Group([rect, label], {
      left: existingField?.pos_x ?? x,
      top: existingField?.pos_y ?? y,
      angle: existingField?.rotation ?? 0,
    })
    group._fieldType = fieldDef.type
    group._fieldLabel = fieldDef.label
    fabricCanvas.add(group)
    obj = group
  } else {
    const text = new fabric.IText(
      existingField?.label || getFieldDefaultText(fieldDef.type),
      {
        left: existingField?.pos_x ?? x,
        top: existingField?.pos_y ?? y,
        fontSize: existingField?.font_size ?? 18,
        fontFamily: existingField?.font_family ?? 'Arial',
        fill: existingField?.color ?? '#111111',
        textAlign: existingField?.alignment ?? 'left',
        angle: existingField?.rotation ?? 0,
        width: existingField?.width ?? 250,
        editable: fieldDef.type === 'custom_text',
      },
    )
    text._fieldType = fieldDef.type
    text._fieldLabel = fieldDef.label
    fabricCanvas.add(text)
    obj = text
  }

  fabricCanvas.renderAll()
  return obj
}

const updateProps = (e) => {
  const obj = e?.selected?.[0] || fabricCanvas.getActiveObject()
  if (!obj) return
  selectedObject.value = obj
  propX.value = Math.round(obj.left)
  propY.value = Math.round(obj.top)
  propW.value = Math.round(obj.getScaledWidth())
  propH.value = Math.round(obj.getScaledHeight())
  propRotation.value = Math.round(obj.angle || 0)
  if (obj.type === 'i-text' || obj.type === 'text') {
    propFontSize.value = obj.fontSize || 16
    propFontFamily.value = obj.fontFamily || 'Arial'
    propColor.value = obj.fill || '#000000'
    propAlign.value = obj.textAlign || 'left'
    if (obj._fieldType === 'custom_text') propCustomText.value = obj.text || ''
  }
}

const applyProps = () => {
  const obj = fabricCanvas?.getActiveObject()
  if (!obj) return
  obj.set({ left: propX.value, top: propY.value, angle: propRotation.value })
  if (propW.value && propH.value) {
    const scaleX = propW.value / obj.width
    const scaleY = propH.value / obj.height
    obj.set({ scaleX, scaleY })
  }
  fabricCanvas.renderAll()
}

const applyTextProps = () => {
  const obj = fabricCanvas?.getActiveObject()
  if (!obj) return
  if (obj.type === 'i-text' || obj.type === 'text') {
    obj.set({
      fontSize: propFontSize.value,
      fontFamily: propFontFamily.value,
      fill: propColor.value,
      textAlign: propAlign.value,
    })
    fabricCanvas.renderAll()
  }
}

const applyCustomText = () => {
  const obj = fabricCanvas?.getActiveObject()
  if (!obj || obj._fieldType !== 'custom_text') return
  obj.set({ text: propCustomText.value })
  fabricCanvas.renderAll()
}

const applyCanvasSize = () => {
  if (!fabricCanvas) return
  fabricCanvas.setDimensions({ width: canvasWidth.value, height: canvasHeight.value })
  fabricCanvas.renderAll()
}

const bringForward = () => { fabricCanvas?.getActiveObject() && (fabricCanvas.bringForward(fabricCanvas.getActiveObject()), fabricCanvas.renderAll()) }
const sendBackward = () => { fabricCanvas?.getActiveObject() && (fabricCanvas.sendBackwards(fabricCanvas.getActiveObject()), fabricCanvas.renderAll()) }
const deleteSelected = () => {
  const obj = fabricCanvas?.getActiveObject()
  if (obj) {
    fabricCanvas.remove(obj)
    selectedObject.value = null
    fabricCanvas.renderAll()
  }
}

const saveLayout = async () => {
  saving.value = true
  try {
    const objects = fabricCanvas.getObjects()
    const fields = objects.map((obj, idx) => ({
      field_type: obj._fieldType || 'custom_text',
      label: obj._fieldType === 'custom_text' ? (obj.text || '') : (obj._fieldLabel || ''),
      pos_x: Math.round(obj.left),
      pos_y: Math.round(obj.top),
      width: Math.round(obj.getScaledWidth()),
      height: Math.round(obj.getScaledHeight()),
      font_size: obj.fontSize || 16,
      font_family: obj.fontFamily || 'Arial',
      color: obj.fill || '#000000',
      rotation: Math.round(obj.angle || 0),
      alignment: obj.textAlign || 'left',
      z_index: idx,
    }))
    await saveTemplateFields(eventId, templateId, fields)
    $q.notify({
      type: 'positive',
      message: 'Layout berhasil disimpan!',
      icon: 'check_circle',
      position: 'top',
      timeout: 2500,
    })
  } catch (e) {
    console.error(e)
    $q.notify({
      type: 'negative',
      message: e?.response?.data?.message || 'Gagal menyimpan layout.',
      icon: 'error',
      position: 'top',
      timeout: 3000,
    })
  } finally {
    saving.value = false
  }
}

const openPreview = async () => {
  showPreviewDialog.value = true
  await nextTick()
  const fabric = fabricLib
  if (!fabric) return

  const dummyData = {
    nama_peserta: eventDetails.value?.event_members?.[0]?.name || 'Budi Santoso',
    nama_acara: eventDetails.value?.title || 'HMTI Fair 2026',
    tanggal_acara: eventDetails.value?.start_date
      ? new Date(eventDetails.value.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      : '18 April 2026',
    jabatan: eventDetails.value?.event_members?.[0]?.position || 'Panitia',
    divisi: eventDetails.value?.event_members?.[0]?.division || eventDetails.value?.divisions?.[0]?.name || 'Divisi Acara',
    nomor_sertifikat: 'CERT/1/2026/0001',
    nama_organisasi: 'HMTI',
    tahun: eventDetails.value?.start_date
      ? new Date(eventDetails.value.start_date).getFullYear().toString()
      : '2026',
    predikat: 'Sangat Baik',
    qr_code: '[QR Code]',
    ttd_digital: '[TTD]',
    custom_text: 'Teks Kustom',
  }

  // Clone main canvas to preview canvas
  const mainJson = fabricCanvas.toJSON(['_fieldType', '_fieldLabel'])
  const previewCanvas = new fabric.Canvas('preview-canvas', {
    width: canvasWidth.value,
    height: canvasHeight.value,
    backgroundColor: '#ffffff',
  })

  previewCanvas.loadFromJSON(mainJson, () => {
    previewCanvas.getObjects().forEach((obj) => {
      if (obj._fieldType && dummyData[obj._fieldType]) {
        if (obj.type === 'i-text' || obj.type === 'text') {
          obj.set({ text: dummyData[obj._fieldType] })
        }
      }
    })
    previewCanvas.renderAll()
  })

  if (template.value?.background_url) {
    fabric.Image.fromURL(
      `${apiBase}${template.value.background_url}`,
      (img) => {
        img.scaleToWidth(canvasWidth.value)
        img.scaleToHeight(canvasHeight.value)
        previewCanvas.setBackgroundImage(img, previewCanvas.renderAll.bind(previewCanvas))
      },
      { crossOrigin: 'anonymous' },
    )
  }
}

onMounted(async () => {
  try {
    const res = await getTemplate(eventId, templateId)
    template.value = res.data.data
  } catch (e) {
    console.error(e)
  }
  try {
    const eventRes = await getEventById(eventId)
    eventDetails.value = eventRes.data.data
  } catch (e) {
    console.error(e)
  }
  await nextTick()
  await initCanvas()
})
</script>

<style scoped>
.editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1a1a2e;
}

.editor-topbar {
  height: 52px;
  background: #16213e;
  border-bottom: 1px solid #0f3460;
  flex-shrink: 0;
}

.editor-body {
  flex: 1;
  overflow: hidden;
}

.editor-panel-left {
  width: 210px;
  flex-shrink: 0;
  background: #16213e;
  border-right: 1px solid #0f3460;
  overflow-y: auto;
  height: 100%;
}

.editor-panel-right {
  width: 230px;
  flex-shrink: 0;
  background: #16213e;
  border-left: 1px solid #0f3460;
  overflow-y: auto;
  height: 100%;
}

.editor-canvas-wrapper {
  flex: 1;
  overflow: auto;
  background: #0f3460;
  padding: 32px;
}

.field-chip {
  background: #0f3460;
  color: #93b4ff;
  border: 1px solid #1a4a8a;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: grab;
  font-size: 13px;
  display: flex;
  align-items: center;
  transition: background 0.15s, transform 0.1s;
  user-select: none;
}

.field-chip:hover {
  background: #1a4a8a;
  transform: translateX(2px);
}

.field-chip:active {
  cursor: grabbing;
  opacity: 0.7;
}

.color-picker {
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
}
</style>
