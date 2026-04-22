<template>
  <q-editor
    v-model="model"
    :dense="$q.screen.lt.md"
    :toolbar="editorToolbar"
    :fonts="editorFonts"
    :placeholder="placeholder"
    class="modern-editor"
    min-height="180px"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  modelValue: String,
  placeholder: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const editorToolbar = [
  [
    {
      label: $q.lang.editor.align,
      icon: $q.iconSet.editor.align,
      fixedLabel: true,
      list: 'only-icons',
      options: ['left', 'center', 'right', 'justify'],
    },
  ],
  ['bold', 'italic', 'underline'],
  [
    {
      label: $q.lang.editor.defaultFont,
      icon: $q.iconSet.editor.font,
      fixedIcon: true,
      list: 'no-icons',
      options: [
        'default_font',
        'arial',
        'arial_black',
        'comic_sans',
        'courier_new',
        'impact',
        'lucida_grande',
        'times_new_roman',
        'verdana',
      ],
    },
  ],
  ['unordered', 'ordered', 'outdent', 'indent'],
]

const editorFonts = {
  arial: 'Arial',
  arial_black: 'Arial Black',
  comic_sans: 'Comic Sans MS',
  courier_new: 'Courier New',
  impact: 'Impact',
  lucida_grande: 'Lucida Grande',
  times_new_roman: 'Times New Roman',
  verdana: 'Verdana',
}
</script>
<style>
.modern-editor {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  transition: all 0.2s ease;
}

.modern-editor:hover {
  border-color: #c7d2fe;
}

.modern-editor:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
}

.modern-editor .q-editor__toolbar {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 6px;
}

.modern-editor .q-editor__content {
  min-height: 180px;
  padding: 14px;
  font-size: 14px;
}
</style>
