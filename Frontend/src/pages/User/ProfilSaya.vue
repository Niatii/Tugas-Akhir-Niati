<template>
  <q-page class="q-px-xl q-py-md">
    <div class="row q-pa-md q-col-gutter-md">
      <div class="col-4">
        <q-card class="q-px-lg q-py-xl flex justify-center" style="border-radius: 20px">
          <q-avatar size="160px" class="overflow-hidden">
            <img
              src="~assets/image/gambar.jpg"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%"
            />
          </q-avatar>

          <div class="q-mt-md text-h6">William James Moriarty</div>
          <div class="text-subtitle2 text-grey">william.james.moriarty@example.com</div>
          <div class="row q-col-gutter-sm q-mt-md items-stretch">
            <!-- Acara -->
            <div class="col-6">
              <q-card
                flat
                class="stat-card text-center q-pa-md bg-indigo-1 full-height flex column justify-center"
                style="border-radius: 16px"
              >
                <div class="text-h5 text-weight-bold text-indigo-10 q-mt-xs">18</div>

                <div class="text-caption text-grey-7">Acara Diikuti</div>
              </q-card>
            </div>

            <!-- Sertifikat -->
            <div class="col-6">
              <q-card
                flat
                class="stat-card text-center q-pa-md bg-indigo-1 full-height flex column justify-center"
                style="border-radius: 16px"
              >
                <div class="text-h5 text-weight-bold text-indigo-10 q-mt-xs">9</div>

                <div class="text-caption text-grey-7">Sertifikat</div>
              </q-card>
            </div>
          </div>
        </q-card>
        <q-btn
          unelevated
          rounded
          no-caps
          label="Keluar"
          style="min-width: 365px;"
          icon="login"
          class="bg-indigo-9 text-white q-px-lg q-mt-md"
          to="/auth/Login"
        />
      </div>
      <div class="col-8">
        <q-card style="border-radius: 20px; min-width: 600px" class="q-pa-lg">
          <div class="q-px-md q-mb-xl">
            <div class="flex justify-between">
              <div class="flex items-center">
                <q-icon name="assignment_ind" size="28px" color="indigo-10" />

                <div class="q-ml-sm text-indigo-10 text-subtitle1 text-weight-medium">
                  Informasi Pribadi
                </div>
              </div>

              <div class="q-mt-md">
                <q-btn
                  color="indigo-9"
                  :label="editMode ? 'Simpan' : 'Edit Profil'"
                  no-caps
                  style="border-radius: 20px; min-width: 150px"
                  @click="toggleEdit"
                />
              </div>
            </div>

            <div class="row q-col-gutter-lg q-mt-xs">
              <div class="col-6">
                <div class="q-my-xs text-grey-7">Nama Lengkap</div>
                <q-input
                  v-model="namaLengkap"
                  dense
                  :readonly="!editMode"
                  :label="namaLengkap ? undefined : 'Masukkan nama lengkap kamu'"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>

                <div class="q-my-xs text-grey-7">Jurusan</div>
                <q-select
                  v-model="jurusan"
                  dense
                  :disable="!editMode"
                  :options="jurusanOptions"
                  :label="jurusan ? undefined : 'Masukkan jurusan kamu'"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="school" />
                  </template>
                </q-select>

                <div class="q-my-xs text-grey-7">Program Studi</div>
                <q-select
                  v-model="programStudi"
                  dense
                  :disable="!editMode"
                  :options="programStudiOptions"
                  :label="programStudi ? undefined : 'Masukkan program studi kamu'"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="menu_book" />
                  </template>
                </q-select>

                <div class="q-my-xs text-grey-7">Angkatan</div>
                <q-input
                  v-model="angkatan"
                  dense
                  type="number"
                  :readonly="!editMode"
                  :label="angkatan ? undefined : 'Masukkan angkatan kamu'"
                  class="q-mb-sm"
                >
                  <template v-slot:prepend>
                    <q-icon name="calendar_today" />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <div class="col-6">
                  <div class="q-my-xs text-grey-7">NIM</div>
                  <q-input
                    v-model="nim"
                    dense
                    :readonly="!editMode"
                    :label="nim ? undefined : 'Masukkan NIM kamu'"
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" />
                    </template>
                  </q-input>

                  <div class="q-my-xs text-grey-7">Email</div>
                  <q-input
                    v-model="email"
                    dense
                    :readonly="!editMode"
                    :label="email ? undefined : 'Masukkan email kamu'"
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>

                  <div class="q-my-xs text-grey-7">Nomor Telepon</div>
                  <q-input
                    v-model="nomorTelepon"
                    dense
                    :readonly="!editMode"
                    :label="nomorTelepon ? undefined : 'Masukkan nomor telepon kamu'"
                    class="q-mb-sm"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>

          <div class="q-px-md q-mb-xl" v-if="editMode">
            <div class="q-mt-xs">
              <div class="q-my-xs text-grey-7">Foto</div>

              <div class="row items-center q-gutter-md q-mb-sm">
                <!-- Avatar -->
                <q-avatar size="100px">
                  <img src="~assets/image/gambar.jpg" style="object-fit: cover" />
                </q-avatar>

                <!-- Input file -->
                <div class="col">
                  <q-input type="file" v-model="foto" dense rounded outlined accept="image/*" />
                </div>
              </div>

              <div class="q-my-xs text-grey-7">Username</div>
              <q-input
                v-model="username"
                dense
                :label="username ? undefined : 'Masukkan username kamu'"
                class="q-mb-sm"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card>
        <q-card style="border-radius: 20px; min-width: 600px" class="q-pa-sm q-mt-lg">
          <div class="q-px-md q-mb-xl">
            <div class="row q-col-gutter-lg q-mt-xs items-stretch">
              <!-- RIWAYAT ACARA -->
              <div class="col-6">
                <div class="bg-indigo-1 q-pa-lg column full-height" style="border-radius: 16px">
                  <div class="row items-center">
                    <q-icon name="event" size="28px" color="indigo-10" />
                    <div class="q-ml-sm text-indigo-10 text-subtitle1 text-weight-medium">
                      Riwayat Acara
                    </div>
                  </div>

                  <div class="q-mt-md">
                    <div class="q-pa-md bg-white full-width" style="border-radius: 16px">
                      <div class="text-weight-medium">Workshop Web Development</div>

                      <div class="text-grey-7" style="font-size: 10px">12 Januari 2025</div>

                      <q-chip class="q-px-lg text-white bg-green-5" style="font-size: 10px">
                        Selesai
                      </q-chip>
                    </div>
                  </div>
                </div>
              </div>

              <!-- SERTIFIKAT -->
              <div class="col-6">
                <div class="bg-indigo-1 q-pa-lg column full-height" style="border-radius: 16px">
                  <div class="row items-center">
                    <q-icon name="workspace_premium" size="28px" color="indigo-10" />
                    <div class="q-ml-sm text-indigo-10 text-subtitle1 text-weight-medium">
                      Sertifikat
                    </div>
                  </div>

                  <div class="q-mt-md">
                    <div class="q-pa-md bg-white" style="border-radius: 16px">
                      <div class="row items-center justify-between">
                        <div class="text-weight-medium">Workshop Web Development</div>

                        <q-btn flat dense color="indigo-9" icon="download" label="Unduh" no-caps />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'

const namaLengkap = ref('William James Moriarty')
const nim = ref('123456789')
// const username = ref('william.moriarty')
const jurusan = ref('Teknik Informatika')
const programStudi = ref('S1 Manajemen')
const email = ref('william.james.moriarty@example.com')
const nomorTelepon = ref('081234567890')
const foto = ref(null)
const username = ref('william.moriarty')
const editMode = ref(false)
const angkatan = ref('2021')

const toggleEdit = () => {
  editMode.value = !editMode.value
}
const jurusanOptions = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Teknik Industri',
  'Manajemen',
  'Akuntansi',
  'Ilmu Komunikasi',
]

const programStudiOptions = [
  'D3 Teknik Informatika',
  'D3 Sistem Informasi',
  'D3 Teknik Industri',
  'S1 Manajemen',
  'S1 Akuntansi',
  'S1 Ilmu Komunikasi',
]
</script>
<style>
/* Input rounded besar */
.custom-input {
  background: rgb(209, 229, 249);
  border-radius: 30px;
}

.stat-card {
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.stat-card q-icon {
  transition: transform 0.25s ease;
}

.stat-card:hover q-icon {
  transform: scale(1.15);
}
</style>
