<template>
  <q-dialog v-model="model">
    <q-card class="q-pa-md" style="min-width: 700px; border-radius: 16px">
      <q-card-section class="flex justify-between">
        <div class="text-subtitle1 text-bold">Edit Rapat</div>
        <q-icon size="28px" name="close" v-close-popup />
      </q-card-section>
      <q-separator />

      <q-card-section>
        <div class="q-my-xs">Judul Rapat <span class="text-red-7">*</span></div>
        <q-input
          v-model="judul"
          dense
          borderless
          class="custom-input q-px-md q-mb-md"
          :label="judul ? undefined : 'Masukkan Judul Rapat'"
        />
        <div class="q-my-xs">Tanggal Rapat <span class="text-red-7">*</span></div>

        <q-input
          v-model="tanggal"
          dense
          borderless
          class="custom-input q-px-md q-mb-md"
          readonly
          :label="tanggal ? undefined : 'Pilih Tanggal Rapat'"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="tanggal" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Tutup" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="row q-col-gutter-md">
          <div class="col">
            <div class="q-my-xs">Waktu Mulai <span class="text-red-7">*</span></div>

            <q-input
              v-model="waktuMulai"
              dense
              borderless
              readonly
              class="custom-input q-px-md q-mb-md"
              :label="waktuMulai ? undefined : 'Pilih Waktu Mulai'"
            >
              <template v-slot:append>
                <q-icon name="schedule" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="waktuMulai" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Tutup" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col">
            <div class="q-my-xs">Waktu Selesai <span class="text-red-7">*</span></div>

            <q-input
              v-model="waktuSelesai"
              dense
              borderless
              readonly
              class="custom-input q-px-md q-mb-md"
              :label="waktuSelesai ? undefined : 'Pilih Waktu Selesai'"
            >
              <template v-slot:append>
                <q-icon name="schedule" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="waktuSelesai" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Tutup" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div class="q-my-xs">Lokasi <span class="text-red-7">*</span></div>
        <q-input
          v-model="lokasi"
          dense
          borderless
          class="custom-input q-px-md q-mb-md"
          :label="lokasi ? undefined : 'Masukkan Lokasi Rapat'"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Batal" no-caps v-close-popup class="text-indigo-9" />
        <q-btn color="indigo-9" label="Simpan" no-caps style="border-radius: 16px; min-width: 150px;" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const judul = ref('Rapat Koordinasi Proyek')
const model = defineModel()
const tanggal = ref('28-02-2026')
const waktuMulai = ref('12:00')
const waktuSelesai = ref('14:00')
const lokasi = ref('Zoom Meeting')
</script>

<style>
/* Input rounded besar */
.custom-input {
  background: rgb(209, 229, 249);
  border-radius: 30px;
}
</style>
