<template>
  <q-page class="q-pa-lg bg-grey-1">

    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">

      <div>
        <div class="text-h5 text-weight-bold">
          Hai William James Moriarty 👋
        </div>

        <div class="text-grey-7">
          Selamat datang kembali. Berikut ringkasan aktivitas panitia hari ini.
        </div>
      </div>

      <q-btn
        color="indigo-9"
        icon="event"
        label="Lihat Kalender"
        rounded
        no-caps
        class="motion-btn"
        to="/user/kalender"
      />

    </div>

    <!-- STATS -->
    <div class="row q-col-gutter-md q-mb-lg">

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">
            Event Aktif
          </div>

          <div class="text-h5 text-weight-bold">
            2
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-blue-1">
          <div class="text-caption text-grey-7">
            Rapat Minggu Ini
          </div>

          <div class="text-h5 text-weight-bold text-indigo-9">
            3
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">
            Notifikasi Baru
          </div>

          <div class="text-h5 text-weight-bold text-positive">
            12
          </div>
        </q-card>
      </div>

    </div>

    <!-- MAIN -->
    <div class="row q-col-gutter-lg">

      <!-- LEFT -->
      <div class="col-12 col-md-8">

        <!-- EVENT AKTIF -->
        <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">

          <div class="row items-center justify-between q-mb-md">

            <div>
              <div class="text-h6 text-weight-bold">
                Event Aktif Saya
              </div>

              <div class="text-caption text-grey-7">
                Event yang sedang kamu jalankan saat ini.
              </div>
            </div>

          </div>

          <q-card flat class="bg-indigo-1 rounded-card q-pa-md">

            <div class="row items-start justify-between">

              <div>
                <div class="text-h6 text-weight-bold">
                  HMTI Fair
                </div>

                <div class="text-grey-7 q-mt-xs">
                  Divisi Acara
                </div>
              </div>

              <q-chip
                color="orange"
                text-color="white"
                icon="play_circle"
              >
                Berlangsung
              </q-chip>

            </div>

            <div class="q-mt-md text-grey-8">

              <div class="q-mb-sm">
                <q-icon name="event" class="q-mr-sm" />
                28 Januari 2026 - Sekarang
              </div>

              <div>
                <q-icon name="place" class="q-mr-sm" />
                Aula Utama
              </div>

            </div>

            <div class="q-mt-lg">

              <q-btn
                color="indigo-9"
                icon="open_in_new"
                label="Lihat Detail"
                rounded
                no-caps
                class="motion-btn"
                to="/user/detail-acara-saya"
              />

            </div>

          </q-card>

        </q-card>

        <!-- EVENT BARU -->
        <q-card flat bordered class="rounded-card q-pa-md motion-card">

          <div class="text-h6 text-weight-bold">
            Event Terbuka
          </div>

          <div class="text-caption text-grey-7 q-mb-md">
            Kesempatan bergabung pada kegiatan baru.
          </div>

          <div class="row q-col-gutter-md">

            <div
              class="col-12 col-md-6"
              v-for="item in openEvents"
              :key="item.id"
            >

              <q-card flat bordered class="rounded-card q-pa-sm">

                <q-img
                  :src="item.image"
                  :ratio="16/9"
                  class="rounded-card"
                />

                <div class="q-pa-sm">

                  <div class="text-subtitle1 text-weight-bold">
                    {{ item.title }}
                  </div>

                  <div class="text-caption text-grey-7 q-mt-xs">
                    {{ item.date }}
                  </div>

                  <div class="text-right q-mt-md">

                    <q-btn
                      flat
                      color="indigo-9"
                      label="Detail"
                      no-caps
                      class="motion-btn"
                    />

                  </div>

                </div>

              </q-card>

            </div>

          </div>

        </q-card>

      </div>

      <!-- RIGHT -->
      <div class="col-12 col-md-4">

        <!-- AGENDA -->
        <q-card flat bordered class="rounded-card q-pa-md q-mb-lg motion-card">

          <div class="text-subtitle1 text-weight-bold">
            Agenda Hari Ini
          </div>

          <div class="q-mt-md">

            <div
              v-for="item in agendas"
              :key="item.id"
              class="agenda-item"
            >
              <div class="text-weight-medium">
                {{ item.title }}
              </div>

              <div class="text-caption text-grey-7">
                {{ item.time }}
              </div>
            </div>

          </div>

        </q-card>

        <!-- NOTIF -->
        <q-card flat bordered class="rounded-card q-pa-md motion-card">

          <div class="row items-center justify-between q-mb-md">

            <div class="text-subtitle1 text-weight-bold">
              Notifikasi Penting
            </div>

            <q-btn
              flat
              dense
              no-caps
              color="indigo-9"
              label="Lihat Semua"
              to="/user/notifikasi"
            />

          </div>

          <div
            v-for="item in notifications"
            :key="item.id"
            class="notif-item"
          >

            <div class="text-weight-medium">
              {{ item.title }}
            </div>

            <div class="text-caption text-grey-7 q-mt-xs">
              {{ item.desc }}
            </div>

            <div class="text-caption text-grey-5 q-mt-xs">
              {{ item.time }}
            </div>

          </div>

        </q-card>

      </div>

    </div>

  </q-page>
</template>

<script setup>
import {
  ref,
  onMounted,
  nextTick
} from 'vue'

import {
  animate,
  stagger
} from 'motion'

const openEvents = ref([
  {
    id: 1,
    title: 'Seminar AI',
    date: '22 Mei 2026',
    image:
      'https://cdn.quasar.dev/img/parallax1.jpg'
  },
  {
    id: 2,
    title: 'Dies Natalis',
    date: '10 Juni 2026',
    image:
      'https://cdn.quasar.dev/img/parallax2.jpg'
  }
])

const agendas = ref([
  {
    id: 1,
    title: 'Rapat Divisi Acara',
    time: '19:00 WIB'
  },
  {
    id: 2,
    title: 'Finalisasi Rundown',
    time: '21:00 WIB'
  }
])

const notifications = ref([
  {
    id: 1,
    title: 'Tugas Baru',
    desc:
      'Anda mendapat tugas pada event HMTI Fair.',
    time: '10 menit lalu'
  },
  {
    id: 2,
    title: 'Jadwal Rapat',
    desc:
      'Rapat dimulai malam ini pukul 19:00.',
    time: '1 jam lalu'
  }
])

onMounted(async () => {
  await nextTick()

  animate(
    '.motion-card',
    {
      opacity: [0,1],
      y: [12,0]
    },
    {
      delay: stagger(0.05),
      duration: 0.35,
      easing: 'ease-out'
    }
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all .18s ease;
}

.agenda-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.notif-item {
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  margin-bottom: 10px;
}
</style>