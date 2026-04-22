<template>
  <q-page class="q-pa-lg">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Manajemen Acara" icon="event" />
        <q-breadcrumbs-el label="Detail Acara" />
      </q-breadcrumbs>
    </div>
    <div class="bg-indigo-4 q-pa-md" style="border-radius: 16px">
      <div class="row items-center justify-end q-my-sm text-white">
        <q-chip dense outline text-color="white" icon="event" class="q-pa-md">
          Sedang Berlangsung
        </q-chip>
      </div>

      <div class="q-pa-md text-white">
        <div class="text-h5 text-bold">HMTI FAIR</div>
        <div class="row items-center q-mt-xs">
          <q-icon name="groups" size="18px" class="q-mr-xs" />
          Himpunan Mahasiswa Teknik Informatika
        </div>
        <div class="bg-white q-pa-md q-mt-md" style="border-radius: 16px">
          <div class="text-caption text-grey-7">Tanggal Acara</div>
          <div class="text-weight-medium text-indigo-9">28 Feb 2026 - Sekarang</div>
        </div>
      </div>
    </div>

    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <q-card flat class="tabs-container">
          <q-tabs
            v-model="tab"
            class="custom-tabs"
            active-color="white"
            indicator-color="transparent"
            align="justify"
          >
            <q-tab name="informasi" icon="info" label="Informasi" no-caps />
            <q-tab name="peserta" icon="person" label="Kelola Peserta" no-caps />

            <q-tab name="anggota" icon="groups" label="Kelola Divisi" no-caps />

            <q-tab name="absensi" icon="fact_check" label="Kelola Absensi" no-caps />

            <q-tab name="rapat" icon="meeting_room" label="Kelola Rapat" no-caps />
            <q-tab name="sertifikat" icon="verified" label="Kelola Sertifikat" no-caps />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="informasi">
              <q-img :src="gambar" ratio="16/9" style="height: 250px; border-radius: 16px" />
              <div class="q-pa-md q-mt-md">
                <div class="flex justify-between">
                  <div class="text-h6 text-bold q-mb-md">HMTI Fair</div>
                  <div>
                    <q-btn
                      icon="edit"
                      label="Edit informasi"
                      color="indigo-9"
                      no-caps
                      unelevated
                      style="border-radius: 16px"
                    />
                  </div>
                </div>
                <div class="text-grey-7 q-mb-md" style="font-size: 14px">
                  Diperbaruhi oleh, John Doe, 28 Januari 2024 12:00
                </div>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores facere omnis,
                  voluptatum quibusdam sint porro adipisci reiciendis inventore asperiores eveniet
                  neque quaerat illo unde eum culpa autem iure repudiandae, natus ullam, optio
                  ipsam. Quia a, enim, omnis non quas amet dicta porro nesciunt quo et optio
                  expedita, soluta quasi voluptate officiis nostrum impedit dolore dolor dignissimos
                  sequi architecto sit. Dolor, quidem placeat ullam, quae itaque quia pariatur
                  laboriosam incidunt rem nostrum similique impedit veritatis amet? Tenetur deserunt
                  rem expedita dolorum!
                </div>

                <div class="flex items-center">
                  <q-avatar size="40px" class="bg-white q-mr-sm">
                    <img src="~assets/image/Logo.jpg" />
                  </q-avatar>
                  <div class="text-subtitle2">Himpunan Mahasiswa Teknik Informatika</div>
                </div>
                <!-- SYARAT -->
                <div class="q-my-lg">
                  <div class="text-subtitle1 text-bold q-mb-sm">Syarat dan Ketentuan</div>

                  <ul class="q-pl-md text-grey-8">
                    <li>Peserta merupakan mahasiswa aktif atau masyarakat umum.</li>
                    <li>Bersedia mengikuti seluruh rangkaian kegiatan acara.</li>
                    <li>Memiliki komitmen dan mampu bekerja sama dalam tim.</li>
                    <li>Mengisi formulir pendaftaran dengan data yang benar.</li>
                    <li>Bersedia ditempatkan pada divisi sesuai kebutuhan panitia.</li>
                    <li>Menjaga nama baik penyelenggara selama kegiatan.</li>
                  </ul>
                </div>

                <!-- BENEFIT -->
                <div class="q-mb-lg">
                  <div class="text-subtitle1 text-bold q-mb-sm">Benefit</div>

                  <ul class="q-pl-md text-grey-8">
                    <li>Sertifikat kepanitiaan / volunteer</li>
                    <li>Pengalaman organisasi dan manajemen acara</li>
                    <li>Relasi dan networking</li>
                    <li>Merchandise eksklusif</li>
                    <li>Konsumsi selama kegiatan</li>
                  </ul>
                </div>

                <!-- DIVISI -->
                <div>
                  <div class="text-subtitle1 text-bold q-mb-sm">Divisi yang Tersedia</div>

                  <ul class="q-pl-md text-grey-8">
                    <li><b>Acara</b> — Menyusun konsep dan rundown kegiatan.</li>
                    <li><b>Humas</b> — Mengelola komunikasi dengan pihak eksternal.</li>
                    <li><b>Pubdok</b> — Mengurus publikasi, desain, dan dokumentasi.</li>
                    <li><b>Konsumsi</b> — Mengatur makanan dan minuman acara.</li>
                    <li><b>Perlengkapan</b> — Menyediakan alat dan kebutuhan acara.</li>
                    <li><b>Keamanan</b> — Menjaga ketertiban selama acara berlangsung.</li>
                  </ul>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="peserta">
              <div class="row items-center justify-between q-mb-md">
                <div class="row items-center text-h6 text-bold text-indigo-9">
                  <q-icon name="groups" size="32px" class="q-mr-xs" />
                  Kelola Peserta
                </div>

                <q-input
                  dense
                  outlined
                  placeholder="Cari peserta..."
                  v-model="search"
                  style="width: 250px"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>

              <q-table :rows="rowsPeserta" :columns="columnsPeserta" row-key="id" :filter="search">
                <!-- STATUS -->
                <template v-slot:body-cell-status="props">
                  <q-td align="center">
                    <q-chip dense text-color="white" :color="statusColorPeserta(props.row.status)">
                      {{ props.row.status }}
                    </q-chip>
                  </q-td>
                </template>

                <!-- ACTION -->
                <template v-slot:body-cell-action="props">
                  <q-td align="center">
                    <q-btn
                      dense
                      flat
                      icon="visibility"
                      color="indigo-9"
                      @click="lihatDetailPeserta(props.row)"
                    >
                      <q-tooltip>Detail</q-tooltip>
                    </q-btn>

                    <q-btn
                      v-if="props.row.status === 'Pending'"
                      dense
                      flat
                      icon="check_circle"
                      color="positive"
                      @click="approvePeserta(props.row)"
                    >
                      <q-tooltip>Approve</q-tooltip>
                    </q-btn>

                    <q-btn
                      v-if="props.row.status === 'Pending'"
                      dense
                      flat
                      icon="cancel"
                      color="negative"
                      @click="rejectPeserta(props.row)"
                    >
                      <q-tooltip>Tolak</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
              </q-table>
            </q-tab-panel>

            <q-tab-panel name="anggota" class="q-px-xl">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="groups" size="32px" class="q-mr-xs" />
                Kelola Divisi
              </div>
              <div class="flex justify-end">
                <q-btn
                  icon="add"
                  label="Tambah Divisi"
                  color="indigo-9"
                  no-caps
                  unelevated
                  style="border-radius: 16px"
                />
              </div>
              <div class="q-mt-md">
                <q-table :rows="rowsDivisi" :columns="columnsDivisi" row-key="id">
                  <template v-slot:body-cell-action="props">
                    <q-td align="center">
                      <q-btn
                        dense
                        flat
                        icon="edit"
                        color="indigo-9"
                        @click="lihatDetailDivisi(props.row)"
                      />
                    </q-td>
                  </template>
                  <template v-slot:body-cell-actionDelete="props">
                    <q-td align="center">
                      <q-btn
                        dense
                        flat
                        icon="delete"
                        color="red-7"
                        @click="lihatDetailDivisi(props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>

            <q-tab-panel name="absensi">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="fact_check" size="32px" class="q-mr-xs" />
                Absensi Rapat Umum
              </div>
              <div class="q-my-md">
                <q-table :rows="umumRows" :columns="umumColumns" row-key="id">
                  <template v-slot:body-cell-action="props">
                    <q-td align="center">
                      <q-btn
                        dense
                        flat
                        icon="visibility"
                        color="indigo-9"
                        @click="lihatDetailUmum(props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>
              </div>
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="fact_check" size="32px" class="q-mr-xs" />
                Absensi Rapat Divisi Acara
              </div>
              <div class="q-mt-md">
                <q-table :rows="rows" :columns="columns" row-key="id">
                  <template v-slot:body-cell-action="props">
                    <q-td align="center">
                      <q-btn
                        dense
                        flat
                        icon="visibility"
                        color="indigo-9"
                        @click="lihatDetail(props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>

            <q-tab-panel name="rapat">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="co_present" size="32px" class="q-mr-xs" />
                Jadwal & Notulen Rapat
              </div>
              <div class="q-px-md bg-indigo-1 q-pa-md q-my-md" style="border-radius: 16px">
                <div class="bg-indigo-1 q-my-md" style="border-radius: 16px">
                  <q-btn
                    class="bg-indigo-9 text-white"
                    label="Tambah Rapat Baru"
                    icon="add"
                    no-caps
                    @click="dialogTambahRapat = true"
                    style="min-width: 150px; border-radius: 16px"
                  />

                  <!-- CARD -->
                  <q-card class="q-pa-lg q-my-md" style="border-radius: 16px">
                    <!-- HEADER -->
                    <div class="row items-start justify-between">
                      <div class="row items-center q-gutter-sm">
                        <q-icon name="co_present" size="32px" class="text-indigo-7" />

                        <div>
                          <div class="text-subtitle1 text-weight-bold">
                            Rapat Divisi Acara - Pembahasan Rundown
                          </div>

                          <div class="text-caption text-grey-7">12 Februari 2026</div>
                        </div>
                      </div>

                      <q-chip dense :color="statusColor" text-color="white">
                        {{ status }}
                      </q-chip>
                    </div>

                    <!-- DETAIL -->
                    <div class="q-mt-md text-grey-8">
                      <div class="row items-center q-gutter-xs">
                        <q-icon name="schedule" size="16px" />
                        <span>19.00 - 21.00</span>
                      </div>

                      <div class="row items-center q-gutter-xs q-mt-xs">
                        <q-icon name="videocam" size="16px" />
                        <span>Zoom Meeting</span>
                      </div>

                      <div class="row items-center q-gutter-xs q-mt-xs">
                        <q-icon name="person" size="16px" />
                        <span>Dibuat oleh: John Doe, 22 Februari 2026</span>
                      </div>
                    </div>

                    <!-- NOTULEN -->
                    <div class="q-mt-md">
                      <div class="text-caption text-grey-7">Notulen</div>

                      <div v-if="status === 'Selesai'" class="text-grey-9">
                        {{ notulen || 'Belum ada notulen' }}
                      </div>

                      <div v-else class="text-grey-5">
                        Notulen hanya dapat diisi setelah rapat selesai
                      </div>
                    </div>

                    <q-separator class="q-my-md" />

                    <!-- ACTION -->
                    <div class="row justify-between">
                      <div class="q-gutter-sm">
                        <q-btn
                          flat
                          icon="edit"
                          label="Edit"
                          color="indigo-9"
                          no-caps
                          @click="dialogEditRapat = true"
                        />

                        <q-btn
                          flat
                          icon="delete"
                          label="Hapus"
                          color="negative"
                          no-caps
                          @click="dialogHapus = true"
                        />
                      </div>

                      <div class="q-gutter-sm">
                        <!-- BELUM DILAKSANAKAN -->
                        <q-btn
                          v-if="status === 'Belum Dilaksanakan'"
                          color="orange"
                          label="Mulai Rapat"
                          icon="play_arrow"
                          no-caps
                          style="border-radius: 16px"
                          @click="status = 'Sedang Berlangsung'"
                        />

                        <!-- SEDANG BERLANGSUNG -->
                        <q-btn
                          v-if="status === 'Sedang Berlangsung'"
                          color="green"
                          label="Tandai Selesai"
                          icon="check"
                          no-caps
                          style="border-radius: 16px"
                          @click="status = 'Selesai'"
                        />

                        <!-- SELESAI -->
                        <q-btn
                          v-if="status === 'Selesai'"
                          color="indigo"
                          label="Isi Notulen"
                          icon="description"
                          no-caps
                          style="border-radius: 16px"
                        />
                      </div>
                    </div>
                  </q-card>
                </div>

                <div class="text-bold text-h6 q-px-lg q-mb-md q-mt-lg">Rapat divisi</div>
                <!-- CARD -->
                <q-card class="q-pa-lg q-my-md" style="border-radius: 16px">
                  <!-- HEADER -->
                  <div class="row items-start justify-between">
                    <div class="row items-center q-gutter-sm">
                      <q-icon name="co_present" size="32px" class="text-indigo-7" />

                      <div>
                        <div class="text-subtitle1 text-weight-bold">
                          Rapat Divisi Acara - Pembahasan Rundown
                        </div>

                        <div class="text-caption text-grey-7">12 Februari 2026</div>
                      </div>
                    </div>

                    <q-chip dense :color="statusColor" text-color="white">
                      {{ status }}
                    </q-chip>
                  </div>

                  <!-- DETAIL -->
                  <div class="q-mt-md text-grey-8">
                    <div class="row items-center q-gutter-xs">
                      <q-icon name="schedule" size="16px" />
                      <span>19.00 - 21.00</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mt-xs">
                      <q-icon name="videocam" size="16px" />
                      <span>Zoom Meeting</span>
                    </div>

                    <div class="row items-center q-gutter-xs q-mt-xs">
                      <q-icon name="person" size="16px" />
                      <span>Dibuat oleh: John Doe, 22 Februari 2026</span>
                    </div>
                  </div>

                  <!-- NOTULEN -->
                  <div class="q-mt-md">
                    <div class="text-caption text-grey-7">Notulen</div>

                    <div v-if="status === 'Selesai'" class="text-grey-9">
                      {{ notulen || 'Belum ada notulen' }}
                    </div>

                    <div v-else class="text-grey-5">
                      Notulen hanya dapat diisi setelah rapat selesai
                    </div>
                  </div>
                </q-card>

                <q-card class="q-pa-lg q-my-md" style="border-radius: 16px">
                  <!-- HEADER -->
                  <div class="row items-start justify-between">
                    <div class="row items-center q-gutter-sm">
                      <q-icon name="co_present" size="32px" class="text-indigo-7" />

                      <div>
                        <div class="text-subtitle1 text-weight-bold">
                          Rapat Divisi Acara - Pembahasan Rundown
                        </div>

                        <div class="text-caption text-grey-7">12 Februari 2026</div>
                      </div>
                    </div>

                    <q-chip dense :color="statusColor" text-color="white">
                      {{ status }}
                    </q-chip>
                  </div>
                  <div
                    class="row items-center q-mt-lg bg-indigo-2 q-pa-md text-indigo-9"
                    style="border-radius: 12px"
                  >
                    Notulen Belum Tersedia
                  </div>
                </q-card>
              </div>
            </q-tab-panel>

            <q-tab-panel name="sertifikat">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="certificate" size="32px" class="q-mr-xs" />
                Kelola Sertifikat
              </div>
              <div class="q-my-md">
                <q-table :rows="umumRows" :columns="umumColumns" row-key="id">
                  <template v-slot:body-cell-action="props">
                    <q-td align="center">
                      <q-btn
                        dense
                        flat
                        icon="visibility"
                        color="indigo-9"
                        @click="lihatDetailUmum(props.row)"
                      />
                    </q-td>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <TambahRapatBaru v-model="dialogTambahRapat" />
    <EditRapat v-model="dialogEditRapat" />
    <DialogHapus v-model="dialogHapus" />
  </q-page>
</template>
<script setup>
import TambahRapatBaru from 'src/components/User/DialogTambahRapatBaru.vue'
import EditRapat from 'src/components/User/DialogEditRapat.vue'
import DialogHapus from 'src/components/DialogHapus.vue'
import gambar from 'src/assets/image/gambar.jpg'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tab = ref('informasi')
const dialogTambahRapat = ref(false)
const dialogEditRapat = ref(false)
const dialogHapus = ref(false)

function lihatDetail(row) {
  router.push('/admin/detail-absensi')
  console.log('detail rapat', row)
}

function lihatDetailUmum(row) {
  router.push('/admin/detail-absensi-umum')
  console.log('detail rapat', row)
}

function lihatDetailDivisi(row) {
  router.push('/admin/detail-divisi')
  console.log('detail divisi', row)
}
/* STATUS RAPAT */
const status = ref('Belum Dilaksanakan')
const notulen = ref('')

/* WARNA STATUS */
const statusColor = computed(() => {
  const map = {
    'Belum Dilaksanakan': 'grey',
    'Sedang Berlangsung': 'orange',
    Selesai: 'green',
  }
  return map[status.value]
})

const columnsPeserta = [
  {
    name: 'nama',
    label: 'Nama Peserta',
    field: 'nama',
    align: 'left'
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left'
  },
  {
    name: 'divisi',
    label: 'Divisi',
    field: 'divisi',
    align: 'left'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center'
  },
  {
    name: 'action',
    label: 'Aksi',
    field: 'action',
    align: 'center'
  }
]

const rowsPeserta = [
  {
    id:1,
    nama:'Andi Saputra',
    email:'andi@mail.com',
    divisi:'Acara',
    status:'Pending'
  },
  {
    id:2,
    nama:'Budi Santoso',
    email:'budi@mail.com',
    divisi:'Humas',
    status:'Disetujui'
  },
  {
    id:3,
    nama:'Siti Nurhaliza',
    email:'siti@mail.com',
    divisi:'Pubdok',
    status:'Ditolak'
  }
]

const statusColorPeserta = (status) => {

  const map = {
    Pending:'orange',
    Disetujui:'green',
    Ditolak:'red'
  }

  return map[status] || 'grey'
}

function approvePeserta(row){
  row.status = 'Disetujui'
}

function rejectPeserta(row){
  row.status = 'Ditolak'
}

function lihatDetailPeserta(row){
  console.log('detail peserta',row)
}
const columns = [
  {
    name: 'judul',
    required: true,
    label: 'Judul Rapat',
    align: 'left',
    field: 'judul',
    sortable: true,
  },
  {
    name: 'update_by',
    label: 'Di Ubah Oleh',
    align: 'left',
    field: 'update_by',
    sortable: true,
  },
  {
    name: 'update_at',
    label: 'Diubah Pada',
    align: 'center',
    field: 'update_at',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    align: 'center',
    field: 'status',
    sortable: true,
  },
  {
    name: 'action',
    label: 'Detail',
    align: 'center',
    field: 'action',
  },
]

const umumColumns = [
  {
    name: 'judul',
    required: true,
    label: 'Judul Rapat',
    align: 'left',
    field: 'judul',
    sortable: true,
  },
  {
    name: 'update_by',
    label: 'Di Ubah Oleh',
    align: 'left',
    field: 'update_by',
    sortable: true,
  },
  {
    name: 'update_at',
    label: 'Diubah Pada',
    align: 'center',
    field: 'update_at',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    align: 'center',
    field: 'status',
    sortable: true,
  },
  {
    name: 'action',
    label: 'Detail',
    align: 'center',
    field: 'action',
  },
]

const umumRows = [
  {
    id: 1,
    judul: 'Rapat Divisi Acara - Pembahasan Rundown',
    update_by: 'John Doe',
    update_at: '12 Feb 2026',
    status: 'Belum Dilaksanakan',
  },
  {
    id: 2,
    judul: 'Rapat Koordinasi Panitia',
    update_by: 'Ahmad Panitia',
    update_at: '15 Feb 2026',
    status: 'Sedang Berlangsung',
  },
  {
    id: 3,
    judul: 'Evaluasi HMTI FAIR',
    update_by: 'Siti Panitia',
    update_at: '20 Feb 2026',
    status: 'Selesai',
  },
]

const rows = [
  {
    id: 1,
    judul: 'Rapat Divisi Acara - Pembahasan Rundown',
    update_by: 'John Doe',
    update_at: '12 Feb 2026',
    status: 'Belum Dilaksanakan',
  },
  {
    id: 2,
    judul: 'Rapat Koordinasi Panitia',
    update_by: 'Ahmad Panitia',
    update_at: '15 Feb 2026',
    status: 'Sedang Berlangsung',
  },
  {
    id: 3,
    judul: 'Evaluasi HMTI FAIR',
    update_by: 'Siti Panitia',
    update_at: '20 Feb 2026',
    status: 'Selesai',
  },
]

const columnsDivisi = [
  {
    name: 'nama',
    required: true,
    label: 'Nama Divisi',
    align: 'left',
    field: 'nama',
    sortable: true,
  },

  {
    name: 'actionDelete',

    align: 'center',
    field: 'actionDelete',
  },
  {
    name: 'action',

    align: 'center',
    field: 'action',
  },
]

const rowsDivisi = [
  {
    id: 1,
    nama: 'Divisi Acara',
  },
  {
    id: 2,
    nama: 'Divisi Humas',
  },
  {
    id: 3,
    nama: 'Divisi Pubdok',
  },
]

/* ACTION STATUS */
// function mulaiRapat() {
//   status.value = 'Sedang Berlangsung'
// }

// function tandaiSelesai() {
//   status.value = 'Selesai'
// }
</script>
<style>
.tabs-container {
  background: transparent;
}

.custom-tabs {
  background: #f5f8fe;
  border-radius: 40px;
  padding: 6px;
}

.custom-tabs .q-tab {
  border-radius: 30px;
  min-height: 48px;
  font-weight: 600;
  color: #5f6b7a;
}

.custom-tabs .q-tab--active {
  background: #243261;
  color: white;
}

.notif-card {
  background: white;
  border-radius: 12px;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid #eef2f7;
  transition: all 0.25s ease;
  cursor: pointer;
}

.notif-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.notif-new {
  border-left: 4px solid #3949ab;
  background: #f8f9ff;
}

.notif-icon {
  color: #3949ab;
}

.notif-message {
  font-size: 12px;
  color: #555;
  margin-top: 2px;
}

.notif-time {
  font-size: 10px;
  color: #9aa0a6;
  margin-top: 4px;
}

.certificate-wrapper {
  padding: 40px;
  display: flex;
  justify-content: center;
}

.certificate-card {
  width: 100%;
  max-width: 900px;
  padding: 60px 40px;
  border-radius: 28px;
  border: 2px dashed #cfd8dc;
  background: #f8fafc;
}

.certificate-desc {
  max-width: 500px;
  margin: auto;
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
}

.download-btn {
  color: white;
  padding: 16px 36px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 16px;
}

.download-btn:hover {
  background: #2f4c8d;
}

.user-info {
  background: #eef2f7;
  padding: 20px;
  border-radius: 16px;
}

.avatar-box {
  width: 48px;
  height: 48px;
  background: #3b5aa3;
  border-radius: 12px;
}
</style>
