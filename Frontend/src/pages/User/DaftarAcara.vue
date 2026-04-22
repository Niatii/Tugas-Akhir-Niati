<template>
  <q-page class="q-pa-xl">
    <div class="q-px-xl">
      <!-- HEAD -->
      <div class="text-h5 text-bold q-my-md">Detail Acara yang bisa kamu ikuti</div>
      <div class="text-grey-7">
        Temukan berbagai acara menarik yang bisa kamu ikuti. Pilih kegiatan yang sesuai dengan
        minatmu <br />dan lakukan pendaftaran dengan mudah melalui sistem.
      </div>

      <!-- SEARCH -->
      <div class="flex justify-end q-my-lg">
        <q-input
          outlined
          dense
          v-model="search"
          :label="search ? undefined : 'Cari acara yang anda inginkan'"
          class="custom-field-search"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- BODY -->
      <div class="row q-col-gutter-md">
        <!-- FILTER -->
        <div class="col-4">
          <q-card class="q-pa-md" style="border-radius: 16px">
            <div class="text-h6 text-weight-bold q-mb-md">Filter Acara</div>

            <!-- STATUS -->
            <div class="q-mb-md">
              <div class="text-caption text-grey-7 q-mb-xs">Status Acara</div>

              <q-select
                class="custom-input q-px-md q-mb-md"
                v-model="filterStatus"
                :options="statusOptions"
                dense
                emit-value
                map-options
              />
            </div>

            <!-- PENYELENGGARA -->
            <div class="q-mb-md">
              <div class="text-caption text-grey-7 q-mb-xs">Penyelenggara</div>

              <q-select
                v-model="filterPenyelenggara"
                :options="penyelenggaraOptions"
                class="custom-input q-px-md q-mb-md"
                dense
                emit-value
                map-options
              />
            </div>

            <div class="row q-col-gutter-md">
              <!-- TANGGAL MULAI -->
              <div class="col">
                <DateInput
                  v-model="tanggalMulai"
                  label="Tanggal Mulai"
                  placeholder="Pilih Tanggal Mulai"
                />
              </div>
              <!-- TANGGAL SELESAI -->
              <div class="col">
                <DateInput
                  v-model="tanggalSelesai"
                  label="Tanggal Selesai"
                  placeholder="Pilih Tanggal Selesai"
                />
              </div>
            </div>
          </q-card>
        </div>

        <!-- CARD -->
        <div class="col-8">
          <div class="example-col-gutter-horizontal">
            <div class="row q-col-gutter-x-md q-col-gutter-y-md">
              <div class="col-6" v-for="n in 10" :key="`none-${n}`">
                <div class="shadow-2 q-py-xs q-px-md" style="border-radius: 16px">
                  <div class="flex justify-end q-my-sm">
                    <q-chip class="q-px-lg text-white bg-green-5" style="font-size: 12px"
                      >Dibuka</q-chip
                    >
                  </div>
                  <q-img
                    src="~assets/image/Gambar contoh.jpg"
                    :ratio="16 / 9"
                    style="height: 100px; border-radius: 12px"
                  />
                  <div class="q-px-sm">
                    <div class="text-subtitle1 text-bold q-my-sm">HMTI FAIR</div>
                    <div style="font-size: 12px" class="text-grey-9">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit dolor
                      cupiditate consequuntur officiis voluptates delectus.
                    </div>
                    <div class="text-grey-7" style="font-size: 10px">
                      28 Feb 2026 - 28 Maret 2026
                    </div>
                  </div>

                  <div
                    class="detail-link flex justify-end items-center q-my-md text-indigo-9 cursor-pointer"
                    @click="goDetail"
                  >
                    <span class="text-weight-medium">Lihat Detail</span>
                    <q-icon name="arrow_forward" size="16px" class="q-ml-xs arrow-icon" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="q-pa-lg flex flex-center">
            <q-pagination v-model="current" :max="5" input />
          </div>
        </div>
      </div>
    </div>
    <FooterComponent/>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DateInput from 'src/components/DateInput.vue'
import FooterComponent from 'src/components/FooterComponent.vue'

const router = useRouter()
const search = ref('')
const current = ref(1)
const filterStatus = ref(null)
const filterPenyelenggara = ref(null)
const tanggalMulai = ref('')
const tanggalSelesai = ref('')

const statusOptions = [
  { label: 'Semua', value: null },
  { label: 'Dibuka', value: 'dibuka' },
  { label: 'Sedang Berlangsung', value: 'berlangsung' },
  { label: 'Selesai', value: 'selesai' },
]

const penyelenggaraOptions = [
  { label: 'Semua', value: null },
  { label: 'HMTI', value: 'hmti' },
  { label: 'BEM', value: 'bem' },
  { label: 'UKM Robotik', value: 'robotik' },
]

function goDetail() {
  router.push('/user/detail-acara')
}
</script>
<style>
.custom-field {
  border-radius: 20px;
  min-width: 220px;
}

.custom-field .q-field__control {
  border-radius: 20px;
}

.custom-field-search {
  border-radius: 20px;
  min-width: 400px;
}

.custom-field-search .q-field__control {
  border-radius: 20px;
}

.custom-input {
  background: rgb(255, 255, 255);
  border-radius: 30px;
}
</style>
