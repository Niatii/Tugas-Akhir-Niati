<template>
  <q-input
    :model-value="formattedDate"
    outlined
    dense
    rounded
    readonly
    class="date-input"
    :label="model ? undefined : placeholder"
  >
    <template #append>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="model"
            mask="YYYY-MM-DD"
            :options="allowDate"
          >
            <div
              class="row justify-end q-pa-sm"
            >
              <q-btn
                flat
                label="Tutup"
                color="primary"
                v-close-popup
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,

  placeholder: {
    type: String,
    default: 'Pilih tanggal',
  },

  minDate: String,
  maxDate: String,
})

const emit = defineEmits([
  'update:modelValue',
])

/* ===============================
   MODEL
================================= */
const model = computed({
  get: () => props.modelValue,
  set: (val) =>
    emit(
      'update:modelValue',
      val
    ),
})

/* ===============================
   FORMAT DISPLAY
================================= */
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]

const formattedDate =
  computed(() => {
    if (!props.modelValue)
      return ''

    const [
      year,
      month,
      day,
    ] =
      props.modelValue.split(
        '-'
      )

    return `${Number(day)} ${
      months[
        Number(month) - 1
      ]
    } ${year}`
  })

/* ===============================
   FILTER DATE
================================= */
const normalize = (
  value
) => {
  if (!value) return ''

  return value.replace(
    /\//g,
    '-'
  )
}

const allowDate = (
  date
) => {
  const current =
    normalize(date)

  const min = normalize(
    props.minDate
  )

  const max = normalize(
    props.maxDate
  )

  if (
    min &&
    current < min
  )
    return false

  if (
    max &&
    current > max
  )
    return false

  return true
}
</script>

<style scoped>
.date-input {
  width: 100%;
}
</style>