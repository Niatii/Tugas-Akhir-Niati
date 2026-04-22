<template>
  <q-page>
    <!-- BANNER -->
    <div class="row items-center q-pa-xl shadow-2">
      <div class="col-12 col-md-7 q-px-md">
        <div class="text-h4 text-weight-bold q-mb-md">
          Sistem Pengelolaan Acara Organisasi Mahasiswa
        </div>
        <div class="text-h6 text-grey-9 q-mb-sm">
          Sistem informasi terpadu untuk organisasi mahasiswa. Dari publikasi, pendaftaran, hingga
          manajemen sertifikat, semua dalam satu platform.
        </div>
        <q-btn
          outline
          color="indigo-9"
          label="Daftar Sekarang"
          no-caps
          rounded
          class="q-px-xl q-my-md bg-white"
          to="/auth/register"
        />
      </div>
      <div class="col-12 col-md-5 q-mt-lg q-mt-md-none q-pa-sm">
        <q-img :src="gambar" ratio="16/9" class="hero-image" style="height: 250px" />
      </div>
    </div>

    <!-- FITUR -->
    <div class="q-py-lg q-px-xl bg-light-blue-1">
      <div class="text-center q-mb-lg">
        <div class="text-h5 text-weight-bold">Fitur Unggulan</div>
        <div class="text-grey-7">
          Solusi digital untuk manajemen event organisasi yang lebih
          <br />
          efektif dan terorganisir.
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <!-- CARD 1 -->
        <div class="col-12 col-md-4">
          <div class="fitur-card">
            <div class="icon-box">
              <q-icon name="how_to_reg" size="28px" color="indigo-9" />
            </div>

            <div class="text-subtitle1 text-weight-bold q-mt-md">Pendaftaran Panitia Online</div>

            <div class="text-grey-7 text-body2 q-mt-sm">
              Daftar panitia acara organisasi mahasiswa secara mudah dan terpusat tanpa proses
              manual.
            </div>
          </div>
        </div>

        <!-- CARD 2 -->
        <div class="col-12 col-md-4">
          <div class="fitur-card">
            <div class="icon-box">
              <q-icon name="card_membership" size="28px" color="indigo-9" />
            </div>

            <div class="text-subtitle1 text-weight-bold q-mt-md">Sertifikat Panitia Digital</div>

            <div class="text-grey-7 text-body2 q-mt-sm">
              Sertifikat kepanitiaan dapat dikelola dan diunduh secara online, cepat, dan aman.
            </div>
          </div>
        </div>

        <!-- CARD 3 -->
        <div class="col-12 col-md-4">
          <div class="fitur-card">
            <div class="icon-box">
              <q-icon name="assignment" size="28px" color="indigo-9" />
            </div>

            <div class="text-subtitle1 text-weight-bold q-mt-md">Absensi & Dokumentasi Digital</div>

            <div class="text-grey-7 text-body2 q-mt-sm">
              Kelola kehadiran panitia serta notulensi rapat secara rapi dan terdokumentasi.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ACARA -->
    <div class="q-py-xl q-my-lg">
      <div class="text-center q-mb-md">
        <div class="text-h6 text-weight-bold">Daftar Acara yang Bisa Kamu Ikuti</div>
        <div class="text-caption text-grey-7">
          Daftar akun untuk mengikuti dan melihat informasi acara.
        </div>
      </div>
      <div class="q-px-xl example-col-gutter-horizontal">
        <div class="row q-px-xl q-col-gutter-x-md">
          <div class="col-4" v-for="n in 3" :key="`none-${n}`">
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
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit dolor cupiditate
                  consequuntur officiis voluptates delectus.
                </div>
                <div class="text-grey-7" style="font-size: 10px">28 Feb 2026 - 28 Maret 2026</div>
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
    </div>

    <!-- CARA MENDAFTAR ACARA -->
    <div class="q-my-lg q-pb-xl">
      <div class="text-center q-mb-xl">
        <div class="text-h6 text-weight-bold">Cara Mendaftar Acara</div>
        <div class="text-caption text-grey-7">
          Ikuti langkah berikut untuk mendaftar acara yang kamu minati. Prosesnya mudah dan cepat!
        </div>
      </div>

      <div class="timeline-horizontal">
        <!-- STEP 1 -->
        <div class="timeline-step">
          <div class="timeline-icon bg-indigo-9">
            <q-icon name="app_registration" size="24px" />
          </div>
          <div class="timeline-text">Lakukan Pendaftaran Akun</div>
        </div>

        <!-- STEP 2 -->
        <div class="timeline-step">
          <div class="timeline-icon bg-indigo-9">
            <q-icon name="event" size="24px" />
          </div>
          <div class="timeline-text">Pilih Acara yang ingin diikuti</div>
        </div>

        <!-- STEP 3 -->
        <div class="timeline-step">
          <div class="timeline-icon bg-indigo-9">
            <q-icon name="event_available" size="24px" />
          </div>
          <div class="timeline-text">Melakukan pendaftaran acara dan mengisi dokumen</div>
        </div>

        <!-- STEP 4 -->
        <div class="timeline-step">
          <div class="timeline-icon bg-indigo-9">
            <q-icon name="approval" size="24px" />
          </div>
          <div class="timeline-text">Menunggu Konfirmasi</div>
        </div>
      </div>
    </div>

    <!-- SECTION PROMOTION -->
    <div class="promotion-section q-py-xl">
      <div class="promotion-card text-center">
        <q-icon name="campaign" size="48px" color="indigo-9" class="q-mb-md" />

        <div class="text-h5 text-weight-bold q-mb-sm">
          Ayo Daftar Menjadi Panitia Event Sekarang!
        </div>

        <div class="text-grey-7 q-mb-lg promotion-desc">
          Jangan lewatkan kesempatan untuk mengikuti berbagai kegiatan menarik dan bermanfaat.
          Dapatkan pengalaman baru, perluas relasi, dan tingkatkan kemampuanmu bersama kami.
        </div>

        <q-btn
          color="indigo-9"
          label="Daftar Sekarang"
          no-caps
          rounded
          unelevated
          size="lg"
          class="q-px-xl promotion-btn"
          to="/auth/register"
        />
      </div>
    </div>

    <!-- TENTANG ORMAWA -->
    <div class="q-my-xl">
      <div class="text-center q-mb-md">
        <div class="text-h6 text-weight-bold">Tentang Ormawa</div>
        <div class="text-caption text-grey-7">
          Wadah kolaborasi, kreativitas, dan pengembangan diri melalui berbagai <br />kegiatan yang
          bermanfaat dan berdampak.
        </div>
      </div>

      <div class="q-px-xl q-mx-xl">
        <div class="row q-pa-lg q-my-md shadow-1" style="border-radius: 12px">
          <div class="col-5">
            <q-img
              src="~assets/image/Gambar contoh.jpg"
              :ratio="16 / 9"
              style="height: 200px; border-radius: 12px"
            />
          </div>
          <div class="col-7 q-py-lg q-px-xl">
            <div class="text-h6 text-weight-bold q-py-sm">
              Himpunan Mahasiswa Teknik Informatika
            </div>
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti et dicta quia,
              fugit iste ut quibusdam temporibus ullam atque explicabo animi voluptatibus nisi
              ducimus facere nesciunt vero eum cumque neque officiis veniam, tempore consequatur
              beatae! Rem maiores qui, sint ex optio quas aliquam laborum nobis, aspernatur aliquid
              quod, excepturi dolorem?
            </div>
          </div>
        </div>
        <div class="row q-pa-lg q-my-md shadow-1" style="border-radius: 12px">
          <div class="col-7 q-py-lg q-px-xl">
            <div class="text-h6 text-weight-bold q-py-sm">
              Himpunan Mahasiswa Teknik Informatika
            </div>
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti et dicta quia,
              fugit iste ut quibusdam temporibus ullam atque explicabo animi voluptatibus nisi
              ducimus facere nesciunt vero eum cumque neque officiis veniam, tempore consequatur
              beatae! Rem maiores qui, sint ex optio quas aliquam laborum nobis, aspernatur aliquid
              quod, excepturi dolorem?
            </div>
          </div>
          <div class="col-5">
            <q-img
              src="~assets/image/Gambar contoh.jpg"
              :ratio="16 / 9"
              style="height: 200px; border-radius: 12px"
            />
          </div>
        </div>
        <div class="row q-pa-lg q-my-md shadow-1" style="border-radius: 12px">
          <div class="col-5">
            <q-img
              src="~assets/image/Gambar contoh.jpg"
              :ratio="16 / 9"
              style="height: 200px; border-radius: 12px"
            />
          </div>
          <div class="col-7 q-py-lg q-px-xl">
            <div class="text-h6 text-weight-bold q-py-sm">
              Himpunan Mahasiswa Teknik Informatika
            </div>
            <div>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti et dicta quia,
              fugit iste ut quibusdam temporibus ullam atque explicabo animi voluptatibus nisi
              ducimus facere nesciunt vero eum cumque neque officiis veniam, tempore consequatur
              beatae! Rem maiores qui, sint ex optio quas aliquam laborum nobis, aspernatur aliquid
              quod, excepturi dolorem?
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <q-btn
            outline
            color="indigo-9"
            label="Lihat Selengkapnya"
            no-caps
            rounded
            class="q-px-xl q-my-md bg-white"
          />
        </div>
      </div>
    </div>
    <FooterComponent />
  </q-page>
</template>
<script setup>
import { useRouter } from 'vue-router'
import FooterComponent from 'src/components/FooterComponent.vue'
import gambar from 'src/assets/image/gambar.jpg'

const router = useRouter()

function goDetail() {
  router.push('/user/detail-acara')
}
</script>

<style scoped>
.landing-timeline {
  max-width: 900px;
  margin: 0 auto;
}

.landing-timeline .q-timeline__content {
  font-size: 15px;
  line-height: 1.6;
}

.landing-timeline .q-timeline__title {
  font-weight: 600;
}

.hero-image {
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.fitur-card {
  height: 100%;
  background: white;
  padding: 32px 28px;
  border-radius: 18px;
  text-align: center;
  border: 1px solid #eef2f7;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.fitur-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.12);
}

.icon-box {
  width: 60px;
  height: 60px;
  margin: auto;
  border-radius: 14px;
  background: #e8f1ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-link {
  transition: all 0.25s ease;
}

.arrow-icon {
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.25s ease;
}

.detail-link:hover {
  transform: translateX(4px);
}

.detail-link:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

.timeline-horizontal {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  margin: 40px auto;
  max-width: 900px;
}

.timeline-horizontal::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 3px;
  background: #e0e0e0;
  z-index: 1;
}

.timeline-step {
  position: relative;
  text-align: center;
  width: 25%;
  z-index: 2;
}

.timeline-icon {
  width: 60px;
  height: 60px;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.timeline-text {
  margin-top: 12px;
  font-size: 13px;
  color: #555;
}

.promotion-section {
  background: linear-gradient(135deg, #e3f2fd, #ecf4fc);
  padding: 80px 20px;
}

.promotion-card {
  background: white;
  max-width: 720px;
  margin: auto;
  padding: 40px 32px;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.promotion-desc {
  font-size: 15px;
  line-height: 1.6;
}

.promotion-btn {
  transition: all 0.25s ease;
}

.promotion-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}
</style>
