<template>
  <q-page class="q-pa-xl">
    <!-- HEAD -->
    <div class="text-h5 text-bold">Acara Saya</div>
    <div class="text-grey-7">
      Hai William James Moriarty, kamu sudah mengikuti 12 Acara kepanitiaan
    </div>

    <!-- SECTION 1 -->
    <div class="row q-col-gutter-md q-mt-sm">
      <!-- CARD 1 -->
      <div class="col-4">
        <q-card class="stat-card cursor-pointer" flat bordered @click="handleStatClick('semua')">
          <q-card-section class="text-center q-pa-lg">
            <div class="stat-icon-wrapper bg-indigo-1">
              <q-icon name="event_note" size="24px" class="text-indigo-7" />
            </div>
            <div class="text-subtitle2 text-weight-bold q-mt-sm text-indigo-9">Semua Acara</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- CARD 2 -->
      <div class="col-4">
        <q-card class="stat-card cursor-pointer" flat bordered @click="handleStatClick('diikuti')">
          <q-card-section class="text-center q-pa-lg">
            <div class="stat-icon-wrapper bg-green-1">
              <q-icon name="event_available" size="24px" class="text-green-7" />
            </div>
            <div class="text-subtitle2 text-weight-bold q-mt-sm text-green-9">Sedang Diikuti</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- CARD 3 -->
      <div class="col-4">
        <q-card class="stat-card cursor-pointer" flat bordered @click="handleStatClick('selesai')">
          <q-card-section class="text-center q-pa-lg">
            <div class="stat-icon-wrapper bg-orange-1">
              <q-icon name="task_alt" size="24px" class="text-orange-7" />
            </div>
            <div class="text-subtitle2 text-weight-bold q-mt-sm text-orange-9">Selesai</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- SECTION PROGRESS -->
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-card flat bordered class="q-pa-md" style="border-radius: 16px">
          <div class="row items-center">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-bold">Progress Acara</div>
              <q-linear-progress
                size="20px"
                :value="7 / 12"
                color="indigo-7"
                class="q-mt-sm q-mb-xs"
                style="border-radius: 12px"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge color="white" text-color="indigo-7" label="58% Selesai" />
                </div>
              </q-linear-progress>
            </div>
            <div class="col-12 col-md-6 q-mt-sm q-mt-md-none">
              <div class="row q-col-gutter-sm justify-end">
                <div class="col-auto">
                  <q-chip icon="event_note" color="indigo-7" text-color="white" size="md">
                    Semua: 12
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip icon="event_available" color="green-7" text-color="white" size="md">
                    Aktif: 5
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip icon="task_alt" color="orange-7" text-color="white" size="md">
                    Selesai: 7
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <!-- SECTION 3 -->
    <div class="row q-col-gutter-md q-mt-md bg-indigo-1 q-pa-md" style="border-radius: 16px">
      <!-- ANGGOTA PANITIA -->
      <div class="col-6">
        <q-card class="q-pa-sm" style="border-radius: 16px">
          <q-card-section>
            <!-- Header -->
            <div class="row items-start justify-between">
              <div>
                <div class="text-h6 text-weight-bold">HMTI Fair</div>

                <div class="row items-center text-grey-7 q-mt-xs">
                  <q-icon name="groups" size="18px" class="q-mr-xs" />
                  Himpunan Mahasiswa Teknik Informatika
                </div>
              </div>

              <q-chip dense color="orange-5" text-color="white" icon="check_circle">
                Selesai
              </q-chip>
            </div>

            <!-- Tanggal -->
            <div class="row items-center q-mt-md">
              <q-icon name="event" size="18px" class="q-mr-sm" />
              28 Januari 2024 - 30 Januari 2024
            </div>

            <!-- Peran -->
            <div class="row items-center q-mt-sm">
              <q-icon name="badge" size="18px" class="q-mr-sm" />
              Anggota Divisi Acara
            </div>

            <div
              class="row items-center q-mt-lg bg-indigo-4 q-pa-sm text-white"
              style="border-radius: 12px"
            >
              <q-icon name="notifications" size="18px" class="q-mr-sm" />
              12 Notifikasi Baru
            </div>
          </q-card-section>

          <q-separator />

          <!-- Action -->
          <q-card-actions align="right">
            <q-btn
              class="bg-indigo-9 text-white"
              label="Detail"
              icon="open_in_new"
              no-caps
              to="/user/detail-acara-saya"
              style="min-width: 150px; border-radius: 16px"
            />
          </q-card-actions>
        </q-card>
      </div>
      <!-- KOORDINATOR DIVISI -->
      <div class="col-6">
        <q-card class="q-pa-sm" style="border-radius: 16px">
          <q-card-section>
            <!-- Header -->
            <div class="row items-start justify-between">
              <div>
                <div class="text-h6 text-weight-bold">HMTI Fair</div>

                <div class="row items-center text-grey-7 q-mt-xs">
                  <q-icon name="groups" size="18px" class="q-mr-xs" />
                  Himpunan Mahasiswa Teknik Informatika
                </div>
              </div>

              <q-chip dense color="orange-5" text-color="white" icon="check_circle">
                Selesai
              </q-chip>
            </div>

            <!-- Tanggal -->
            <div class="row items-center q-mt-md">
              <q-icon name="event" size="18px" class="q-mr-sm" />
              28 Januari 2024 - 30 Januari 2024
            </div>

            <!-- Peran -->
            <div class="row items-center q-mt-sm">
              <q-icon name="badge" size="18px" class="q-mr-sm" />
              Koordinator Divisi Acara
            </div>
            <div
              class="row items-center q-mt-lg bg-indigo-4 q-pa-sm text-white"
              style="border-radius: 12px"
            >
              <q-icon name="notifications" size="18px" class="q-mr-sm" />
              12 Notifikasi Baru
            </div>
          </q-card-section>

          <q-separator />

          <!-- Action -->
          <q-card-actions align="right">
            <q-btn
              class="bg-indigo-9 text-white"
              label="Detail"
              icon="open_in_new"
              to="/koordinator/detail-acara-saya"
              no-caps
              style="min-width: 150px; border-radius: 16px"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="current" :max="5" input />
    </div>

    <FooterComponent/>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import FooterComponent from 'src/components/FooterComponent.vue'

const $q = useQuasar()
const current = ref(1)
const handleStatClick = (type) => {
  $q.notify({
    type: 'info',
    message: `Menampilkan filter: ${type}`,
    position: 'top',
    actions: [{ icon: 'close', color: 'white' }],
  })
}
</script>
<style>
.stat-card {
  transition: all 0.3s ease;
  border-radius: 20px;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -12px rgba(0, 0, 0, 0.3);
  border-color: transparent;
}

.stat-icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1);
}
</style>
