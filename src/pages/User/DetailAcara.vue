<template>
  <q-page class="q-px-xl q-py-md">
    <!-- HEAD -->
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Daftar Acara" icon="event" />
        <q-breadcrumbs-el label="Detail Acara" />
      </q-breadcrumbs>
    </div>

    <!-- BODY -->
    <div class="row q-pa-md q-col-gutter-md">
      <!-- SECTION 1 -->
      <div class="col-6">
        <q-card class="q-pa-lg" style="border-radius: 20px">
          <div class="flex justify-end q-my-sm">
            <q-chip class="q-px-lg text-white bg-green-5" style="font-size: 14px">Dibuka</q-chip>
          </div>
          <q-img :src="gambar" ratio="16/9" style="height: 250px; border-radius: 16px" />
          <div class="q-my-lg">
            <div class="text-h6 text-bold q-mb-md">HMTI Fair</div>
            <div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores facere omnis,
              voluptatum quibusdam sint porro adipisci reiciendis inventore asperiores eveniet neque
              quaerat illo unde eum culpa autem iure repudiandae, natus ullam, optio ipsam. Quia a,
              enim, omnis non quas amet dicta porro nesciunt quo et optio expedita, soluta quasi
              voluptate officiis nostrum impedit dolore dolor dignissimos sequi architecto sit.
              Dolor, quidem placeat ullam, quae itaque quia pariatur laboriosam incidunt rem nostrum
              similique impedit veritatis amet? Tenetur deserunt rem expedita dolorum!
            </div>

            <div class="q-mt-md text-grey-8">Dibuat Oleh:</div>
            <div class="flex items-center">
              <q-avatar size="40px" class="bg-white q-mr-sm">
                <img src="~assets/image/Logo.jpg" />
              </q-avatar>
              <div class="text-subtitle2">Himpunan Mahasiswa Teknik Informatika</div>
            </div>

            <div class="q-my-md">
              <div class="text-grey-7">28 Feb 2026 - 28 Maret 2026</div>
              <div class="text-weight-medium text-grey-7">
                Kuota Peserta: <span class="text-bold text-black">100</span>
              </div>
            </div>
            <div class="flex justify-center">
              <q-btn
                outline
                color="indigo-9"
                label="Daftar Sekarang"
                no-caps
                rounded
                style="min-width: 450px"
                class="q-px-xl q-my-md bg-white"
                to="/user/formulir-pendaftaran"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- SECTION 2 -->
      <div class="col-6">
        <q-card flat class="q-pa-md">
          <!-- SYARAT -->
          <div class="q-mb-lg">
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
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import gambar from 'src/assets/image/gambar.jpg'
</script>

<style></style>
