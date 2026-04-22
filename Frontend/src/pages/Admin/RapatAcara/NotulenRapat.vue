<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Breadcrumbs -->
    <div class="q-mb-md q-gutter-sm motion-card">
      <q-breadcrumbs class="text-brown">
        <template #separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>

        <q-breadcrumbs-el label="Kelola Rapat" icon="groups" class="text-grey-9" />

        <q-breadcrumbs-el label="Notulen" icon="description" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Notulen Rapat</div>

        <div class="text-grey-7">Dokumentasi hasil rapat dan tindak lanjut.</div>
      </div>

      <div class="q-gutter-sm">
        <q-btn color="indigo-9" icon="download" label="Export PDF" rounded no-caps class="motion-btn" />
      </div>
    </div>

    <!-- INFO RAPAT -->
    <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <div class="text-caption text-grey-7">Nama Rapat</div>

          <div class="text-subtitle1 text-weight-bold">
            {{ meeting.title }}
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Event</div>

          <div class="text-weight-medium">
            {{ meeting.event }}
          </div>
        </div>

        <div class="col-12 col-md-2">
          <div class="text-caption text-grey-7">Jenis</div>

          <q-badge size="12px" class="q-py-xs q-px-md" :color="meeting.type === 'Umum' ? 'indigo-9' : 'orange'" rounded>
            {{ meeting.type }}
          </q-badge>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Tanggal</div>

          <div class="text-weight-medium">
            {{ meeting.date }}
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-lg q-mt-md">
        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Status</div>

          <q-badge size="12px" class="q-py-xs q-px-md" :color="statusColor(meeting.status)" rounded>
            {{ meeting.status }}
          </q-badge>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Mulai Nyata</div>

          <div class="text-weight-medium">
            {{ meeting.startedAt || '-' }}
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Selesai</div>

          <div class="text-weight-medium">
            {{ meeting.endedAt || '-' }}
          </div>
        </div>

        <div class="col-12 col-md-3">
          <div class="text-caption text-grey-7">Durasi</div>

          <div class="text-weight-medium">
            {{ durationText }}
          </div>
        </div>
      </div>
    </q-card>

    <!-- BANNER -->
    <q-banner
      v-if="meeting.status !== 'Selesai'"
      rounded
      class="bg-orange-1 text-orange q-mb-lg motion-card"
    >
      Rapat belum selesai. Notulen dapat diisi setelah rapat ditandai selesai di halaman Detail
      Rapat.
    </q-banner>

    <q-banner
      v-if="meeting.status === 'Selesai' && !minutes"
      rounded
      class="bg-green-1 text-positive q-mb-lg motion-card"
    >
      Rapat selesai. Silakan isi notulen sekarang.
    </q-banner>

    <!-- FORM -->
    <q-card flat bordered class="rounded-card motion-card">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold">Isi Notulen</div>

          <div class="text-caption text-grey-7">Ringkasan hasil rapat dan tindak lanjut.</div>
        </div>

        <q-btn
          v-if="meeting.status === 'Selesai'"
          flat
          color="indigo-9"
          :icon="isEdit ? 'close' : 'edit'"
          :label="isEdit ? 'Batal Edit' : 'Edit'"
          no-caps
          class="motion-btn"
          @click="toggleEdit"
        />
      </q-card-section>

      <q-separator />

      <!-- EDIT -->
      <q-card-section v-if="isEdit && meeting.status === 'Selesai'">
        <q-input
          v-model="minutes"
          type="textarea"
          outlined
          autogrow
          rows="10"
          label="Tulis notulen rapat..."
        />

        <div class="text-right q-mt-md">
          <q-btn
            color="indigo-9"
            icon="save"
            label="Simpan Notulen"
            rounded
            no-caps
            class="motion-btn"
            @click="saveMinutes"
          />
        </div>
      </q-card-section>

      <!-- VIEW -->
      <q-card-section v-else>
        <div v-if="minutes" class="text-grey-8" style="white-space: pre-line">
          {{ minutes }}
        </div>

        <div v-else-if="meeting.status === 'Selesai'" class="text-grey-6">
          Belum ada notulen rapat.
        </div>

        <div v-else class="text-grey-6">Menunggu rapat selesai.</div>
      </q-card-section>
    </q-card>
     <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { animate, stagger } from 'motion'
import FooterComponent from 'src/components/FooterComponent.vue'

const isEdit = ref(false)

const meeting = ref({
  id: 1,
  title: 'Rapat Persiapan Opening',
  event: 'HMTI Fair',
  type: 'Umum',
  date: '18 Apr 2026, 12.00',
  status: 'Berlangsung',
  startedAt: '12:07',
  endedAt: '',
})

const minutes = ref('')

const toggleEdit = () => {
  isEdit.value = !isEdit.value
}

const saveMinutes = () => {
  isEdit.value = false
}

const durationText = computed(() => {
  if (!meeting.value.startedAt || !meeting.value.endedAt) return '-'

  const [sh, sm] = meeting.value.startedAt.split(':')
  const [eh, em] = meeting.value.endedAt.split(':')

  const start = Number(sh) * 60 + Number(sm)

  const end = Number(eh) * 60 + Number(em)

  const diff = end - start

  const hour = Math.floor(diff / 60)
  const minute = diff % 60

  return `${hour}j ${minute}m`
})

const statusColor = (status) => {
  if (status === 'Berlangsung') return 'orange'
  if (status === 'Selesai') return 'positive'
  if (status === 'Akan Datang') return 'blue'
  return 'grey'
}

/* Motion One */
onMounted(async () => {
  await nextTick()

  animate(
    '.motion-card',
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: stagger(0.05),
      duration: 0.35,
      easing: 'ease-out',
    },
  )

  animate(
    '.motion-btn',
    {
      opacity: [0, 1],
      scale: [0.96, 1],
    },
    {
      delay: 0.15,
      duration: 0.25,
    },
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all 0.2s ease;
}
</style>
