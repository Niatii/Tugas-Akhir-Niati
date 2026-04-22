<template>
  <q-page class="q-pa-xl">
    <!-- HEAD -->
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Acara Saya" icon="event" />
        <q-breadcrumbs-el label="Detail Acara Saya" />
      </q-breadcrumbs>
    </div>

    <!-- SECTION 1 -->
    <div class="bg-indigo-7 q-pa-md" style="border-radius: 16px">
      <div class="row items-center justify-between q-my-sm text-white">
        <q-chip dense outline text-color="white" icon="event" class="q-pa-md">
          Sedang Berlangsung
        </q-chip>

        <q-chip dense outline text-color="white" icon="badge" class="q-pa-md">
          Anggota Panitia
        </q-chip>
      </div>

      <div class="q-pa-md text-white">
        <div class="text-h5 text-bold">HMTI FAIR</div>
        <div class="row items-center q-mt-xs">
          <q-icon name="groups" size="18px" class="q-mr-xs" />
          Himpunan Mahasiswa Teknik Informatika
        </div>
        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-6">
            <div class="bg-white q-pa-md" style="border-radius: 16px">
              <div class="text-caption text-grey-7">Tanggal Acara</div>
              <div class="text-weight-medium text-indigo-9">28 Feb 2026 - Sekarang</div>
            </div>
          </div>

          <div class="col-6">
            <div class="bg-white q-pa-md" style="border-radius: 16px">
              <div class="text-caption text-grey-7">Divisi Anda</div>
              <div class="text-weight-medium text-indigo-9">Divisi Acara</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 2 -->
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

            <q-tab name="anggota" icon="groups" label="Anggota Divisi" no-caps />

            <q-tab name="absensi" icon="fact_check" label="Absensi" no-caps />

            <q-tab name="rapat" icon="meeting_room" label="Rapat" no-caps />

            <q-tab name="sertifikat" icon="verified" label="Sertifikat" no-caps />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <!-- INFORMASI -->
            <q-tab-panel name="informasi">
              <q-img :src="gambar" ratio="16/9" style="height: 250px; border-radius: 16px" />
              <div class="row q-pa-md q-col-gutter-md q-mt-md">
                <div class="col-8">
                  <div class="text-h6 text-bold q-mb-md">HMTI Fair</div>
                  <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores facere omnis,
                    voluptatum quibusdam sint porro adipisci reiciendis inventore asperiores eveniet
                    neque quaerat illo unde eum culpa autem iure repudiandae, natus ullam, optio
                    ipsam. Quia a, enim, omnis non quas amet dicta porro nesciunt quo et optio
                    expedita, soluta quasi voluptate officiis nostrum impedit dolore dolor
                    dignissimos sequi architecto sit. Dolor, quidem placeat ullam, quae itaque quia
                    pariatur laboriosam incidunt rem nostrum similique impedit veritatis amet?
                    Tenetur deserunt rem expedita dolorum!
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
                <div
                  class="col-4 bg-indigo-1 shadow-2"
                  style="border-radius: 16px; max-height: 500px"
                >
                  <div class="q-pa-md">
                    <div class="row items-center q-my-sm text-h6 text-weight-bold text-indigo-8">
                      <q-icon name="notifications" size="24px" class="q-mr-sm" />
                      Notifikasi Baru
                    </div>

                    <div class="notif-card notif-new">
                      <div class="row items-start">
                        <div class="col">
                          <div class="text-subtitle2 text-weight-bold">Pengumuman Baru</div>

                          <div class="notif-message">
                            Rapat panitia HMTI Fair akan dilaksanakan besok pukul 19.00.
                          </div>

                          <div class="notif-time">5 menit yang lalu</div>
                        </div>
                      </div>
                    </div>
                    <div class="notif-card notif-new">
                      <div class="row items-start">
                        <div class="col">
                          <div class="text-subtitle2 text-weight-bold">Tugas Baru</div>

                          <div class="notif-message">
                            Anda mendapat tugas baru pada acara HMTI Fair.
                          </div>

                          <div class="notif-time">20 menit yang lalu</div>
                        </div>
                      </div>
                    </div>
                    <div class="notif-card">
                      <div class="row items-start">
                        <div class="col">
                          <div class="text-subtitle2 text-weight-bold">Update Acara</div>

                          <div class="notif-message">Jadwal acara HMTI Fair telah diperbarui.</div>

                          <div class="notif-time">Kemarin</div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="detail-link flex justify-end items-center q-my-md text-indigo-9 cursor-pointer"
                      @click="goDetailNotifikasi"
                    >
                      <span class="text-weight-medium">Lihat Semua Notifikasi</span>
                      <q-icon name="arrow_forward" size="16px" class="q-ml-xs arrow-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- ANGGOTA DIVISI -->
            <q-tab-panel name="anggota" class="q-px-xl">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="groups" size="32px" class="q-mr-xs" />
                Divisi Acara
              </div>
              <div class="q-mt-md flex justify-between">
                <div class="text-subtitle1 text-weight-medium">Koordinator Divisi</div>
                <q-chip class="bg-indigo-4 text-white">3 Anggota</q-chip>
              </div>
              <div>
                <div
                  class="flex items-center bg-indigo-1 q-pa-md q-my-sm"
                  style="border-radius: 12px"
                >
                  <q-avatar size="36px">
                    <img src="~assets/image/gambar.jpg" fit-cover />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-subtitle2 text-weight-bold">William James Moriarty</div>
                    <div class="text-caption text-grey-7">Koordinator Divisi Acara</div>
                  </div>
                </div>
                <div
                  class="flex items-center bg-indigo-1 q-pa-md q-my-sm"
                  style="border-radius: 12px"
                >
                  <q-avatar size="36px">
                    <img src="~assets/image/gambar.jpg" fit-cover />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-subtitle2 text-weight-bold">William James Moriarty</div>
                    <div class="text-caption text-grey-7">Koordinator Divisi Acara</div>
                  </div>
                </div>
                <div
                  class="flex items-center bg-indigo-1 q-pa-md q-my-sm"
                  style="border-radius: 12px"
                >
                  <q-avatar size="36px">
                    <img src="~assets/image/gambar.jpg" fit-cover />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-subtitle2 text-weight-bold">William James Moriarty</div>
                    <div class="text-caption text-grey-7">Koordinator Divisi Acara</div>
                  </div>
                </div>
              </div>

              <div class="q-mt-xl flex justify-between">
                <div class="text-subtitle1 text-weight-medium">Anggota Divisi</div>
                <q-chip class="bg-indigo-4 text-white">10 Anggota</q-chip>
              </div>
              <div>
                <div
                  class="flex items-center bg-indigo-1 q-pa-md q-my-sm"
                  style="border-radius: 12px"
                >
                  <q-avatar size="36px">
                    <img src="~assets/image/gambar.jpg" fit-cover />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-subtitle2 text-weight-bold">William James Moriarty</div>
                    <div class="text-caption text-grey-7">Anggota Divisi Acara</div>
                  </div>
                </div>
                <div
                  class="flex items-center bg-indigo-1 q-pa-md q-my-sm"
                  style="border-radius: 12px"
                >
                  <q-avatar size="36px">
                    <img src="~assets/image/gambar.jpg" fit-cover />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-subtitle2 text-weight-bold">William James Moriarty</div>
                    <div class="text-caption text-grey-7">Anggota Divisi Acara</div>
                  </div>
                </div>
                <div
                  class="flex items-center bg-indigo-1 q-pa-md q-my-sm"
                  style="border-radius: 12px"
                >
                  <q-avatar size="36px">
                    <img src="~assets/image/gambar.jpg" fit-cover />
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-subtitle2 text-weight-bold">William James Moriarty</div>
                    <div class="text-caption text-grey-7">Anggota Divisi Acara</div>
                  </div>
                </div>
              </div>
            </q-tab-panel>

            <!-- ABSENSI PANITIA -->
            <q-tab-panel name="absensi">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="fact_check" size="32px" class="q-mr-xs" />
                Absensi Rapat
              </div>
              <div class="row q-col-gutter-md q-my-sm">
                <div class="col-4">
                  <q-card class="q-pa-md text-center bg-indigo-1" style="border-radius: 12px">
                    <div class="text-h5 text-weight-bold">2</div>
                    <div class="text-grey-7">Hadir</div>
                  </q-card>
                </div>

                <div class="col-4">
                  <q-card class="q-pa-md text-center bg-green-1" style="border-radius: 12px">
                    <div class="text-h5 text-weight-bold">5</div>
                    <div class="text-grey-7">Izin</div>
                  </q-card>
                </div>

                <div class="col-4">
                  <q-card class="q-pa-md text-center bg-orange-1" style="border-radius: 12px">
                    <div class="text-h5 text-weight-bold">3</div>
                    <div class="text-grey-7">Absen</div>
                  </q-card>
                </div>
              </div>
              <div class="q-mt-md">
                <q-table :rows="rows" :columns="columns" row-key="id" flat>
                  <!-- STATUS -->
                  <template v-slot:body-cell-status="props">
                    <q-td align="center">
                      <q-chip
                        dense
                        :color="
                          props.row.status === 'Hadir'
                            ? 'green'
                            : props.row.status === 'Izin'
                              ? 'orange'
                              : 'negative'
                        "
                        text-color="white"
                      >
                        {{ props.row.status }}
                      </q-chip>
                    </q-td>
                  </template>
                </q-table>
              </div>
            </q-tab-panel>

            <!-- RAPAT -->
            <q-tab-panel name="rapat">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="co_present" size="32px" class="q-mr-xs" />
                Jadwal & Notulen Rapat
              </div>
              <div class="q-px-md bg-indigo-1 q-pa-md q-my-md" style="border-radius: 16px">
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

            <!-- SERTIFIKAT -->
            <q-tab-panel name="sertifikat">
              <div class="certificate-wrapper">
                <div class="certificate-card text-center">
                  <!-- ICON -->
                  <div class="q-mb-md">
                    <q-icon name="school" size="48px" color="deep-purple-7" />
                  </div>

                  <!-- TITLE -->
                  <div class="text-h4 text-weight-bold q-mb-sm">Sertifikat Kepanitiaan</div>

                  <!-- STATUS -->
                  <q-chip color="green-5" text-color="white" icon="check_circle" class="q-my-md">
                    Tersedia
                  </q-chip>

                  <!-- DESCRIPTION -->
                  <div class="certificate-desc q-mt-sm">
                    Sertifikat kepanitiaan HMTI FAIR 2026 telah diterbitkan. Anda dapat mengunduh
                    sertifikat sebagai bukti partisipasi dalam kepanitiaan.
                  </div>

                  <!-- BUTTON -->
                  <div class="q-mt-xl">
                    <q-btn
                      class="download-btn bg-indigo-9"
                      icon="download"
                      label="Download Sertifikat"
                      no-caps
                    />
                  </div>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
  <FooterComponent/>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import gambar from 'src/assets/image/gambar.jpg'
import FooterComponent from 'src/components/FooterComponent.vue'

const router = useRouter()
const tab = ref('informasi')
const status = ref('Belum Dilaksanakan')
const notulen = ref('')

const statusColor = computed(() => {
  const map = {
    'Belum Dilaksanakan': 'grey',
    'Sedang Berlangsung': 'orange',
    Selesai: 'green',
  }
  return map[status.value]
})

const columns = [
  {
    name: 'tanggal',
    label: 'Tanggal',
    field: 'tanggal',
    align: 'left',
    sortable: true,
  },
  {
    name: 'agenda',
    label: 'Judul Agenda',
    field: 'agenda',
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status Kehadiran',
    field: 'status',
    align: 'center',
  },
]

const rows = [
  {
    id: 1,
    tanggal: '12 Feb 2026',
    agenda: 'Rapat Divisi Acara - Pembahasan Rundown',
    status: 'Hadir',
  },
  {
    id: 2,
    tanggal: '18 Feb 2026',
    agenda: 'Koordinasi Persiapan Event',
    status: 'Izin',
  },
  {
    id: 3,
    tanggal: '25 Feb 2026',
    agenda: 'Evaluasi Persiapan Acara',
    status: 'Absen',
  },
]

function goDetailNotifikasi() {
  router.push('/user/notifikasi')
}

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
