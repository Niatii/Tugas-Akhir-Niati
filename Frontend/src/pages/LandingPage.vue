<template>
  <q-page>
    <!-- BANNER -->
    <div class="row items-center q-pa-xl shadow-2 hero-section">
      <div class="col-12 col-md-7 q-px-md hero-content">
        <div class="text-h4 text-weight-bold q-mb-md">
          Event Organization Management Application
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

      <div class="col-12 col-md-5 q-mt-lg q-mt-md-none q-pa-sm hero-image-wrapper">
        <q-img :src="gambar" ratio="16/9" class="hero-image" style="height: 250px" />
      </div>
    </div>

    <!-- FITUR -->
    <div class="q-py-lg q-px-xl bg-light-blue-1 fitur-section">
      <div class="text-center q-mb-lg section-header">
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
    <div class="q-py-xl q-my-lg event-section">
      <div class="text-center q-mb-md section-header">
        <div class="text-h6 text-weight-bold">Daftar Acara yang Bisa Kamu Ikuti</div>

        <div class="text-caption text-grey-7">
          Daftar akun untuk mengikuti dan melihat informasi acara.
        </div>
      </div>

      <div class="q-px-xl example-col-gutter-horizontal">
        <div class="row q-px-xl q-col-gutter-x-md">
          <div class="col-4" v-for="event in events" :key="event.id">
            <div class="shadow-2 q-py-xs q-px-md event-card column" style="border-radius: 16px">
              <div class="flex justify-end q-my-sm">
                <q-chip class="q-px-lg text-white bg-green-5" style="font-size: 12px">
                  Dibuka
                </q-chip>
              </div>

              <q-img
                :src="event.image_url"
                :ratio="16 / 9"
                style="height: 100px; border-radius: 12px"
              />

              <div class="q-px-sm event-content">
                <div class="text-subtitle1 text-bold q-mt-xs">{{ event.title }}</div>
                <div class="text-grey-9 q-my-xs">{{ event.user.name }}</div>

                <div class="text-grey-9" v-html="truncateWords(event.description, 20)"></div>

                <div class="text-grey-7" style="font-size: 12px">
                  {{ formatDate(event.start_date) }} - {{ formatDate(event.end_date) }}
                </div>
              </div>

              <div
                class="detail-link flex justify-end items-center q-my-md text-indigo-9 cursor-pointer"
                @click="goDetail(event.id)"
              >
                <span class="text-weight-medium"> Lihat Detail </span>

                <q-icon name="arrow_forward" size="16px" class="q-ml-xs arrow-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CARA MENDAFTAR ACARA -->
    <div class="q-my-lg q-pb-xl timeline-section">
      <div class="text-center q-mb-xl section-header">
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
    <div class="q-my-xl about-section">
      <div class="text-center q-mb-md section-header">
        <div class="text-h6 text-weight-bold">Himpunan dan Organisasi Mahasiswa</div>

        <div class="text-caption text-grey-7">
          Wadah kolaborasi, kreativitas, dan pengembangan diri melalui berbagai
          <br />
          kegiatan yang bermanfaat dan berdampak.
        </div>
      </div>

      <div class="about-slider-wrapper" v-if="organizations.length">
        <div class="about-slider">
          <div
            class="about-card-mini shadow-1"
            v-for="organization in organizations"
            :key="organization.id"
          >
            <!-- LOGO -->
            <q-avatar size="72px" class="about-logo-mini">
              <img :src="organization.url" />
            </q-avatar>

            <!-- CONTENT -->
            <div class="about-mini-content">
              <div class="about-mini-name">
                {{ organization.name }}
              </div>

              <div class="about-mini-item">
                <q-icon name="mail" size="16px" color="indigo-8" />

                <span>
                  {{ organization.email }}
                </span>
              </div>

              <div class="about-mini-item">
                <q-icon name="call" size="16px" color="indigo-8" />

                <span>
                  {{ organization.phone_number }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AuthRequiredDialog v-model="showAuthDialog" :event-id="selectedEventId" />
    <FooterComponent />
  </q-page>
</template>

<script setup>
import FooterComponent from 'src/components/FooterComponent.vue'
import gambar from 'src/assets/image/gambar.jpg'

import { animate, stagger, inView } from 'motion'
import { getLandingEvents } from 'src/services/event.api'
import { onMounted, ref } from 'vue'
import AuthRequiredDialog from 'src/components/AuthRequiredDialog.vue'
import { getPublicOrganization } from 'src/services/user.api'

const events = ref([])
const showAuthDialog = ref(false)
const selectedEventId = ref(null)
const organizations = ref([])

async function fetchOrganization() {
  try {
    const response = await getPublicOrganization()

    organizations.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}
async function fetchLandingEvents() {
  try {
    const response = await getLandingEvents()

    events.value = response.data.data.events
  } catch (error) {
    console.error(error)
  }
}

const formatDate = (val) => {
  if (!val) return '-'

  const date = new Date(val)

  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function goDetail(id) {
  selectedEventId.value = id
  showAuthDialog.value = true
}

function truncateWords(text, limit = 20) {
  if (!text) return ''

  const words = text.split(' ')

  if (words.length <= limit) {
    return text
  }

  return words.slice(0, limit).join(' ') + '...'
}

onMounted(() => {
  fetchLandingEvents()
  fetchOrganization()
  // HERO
  animate(
    '.hero-content',
    {
      opacity: [0, 1],
      y: [30, 0],
    },
    {
      duration: 0.8,
      easing: 'ease-out',
    },
  )

  animate(
    '.hero-image-wrapper',
    {
      opacity: [0, 1],
      scale: [0.96, 1],
    },
    {
      duration: 0.9,
      delay: 0.15,
      easing: 'ease-out',
    },
  )

  // SECTION HEADER
  inView('.section-header', ({ target }) => {
    animate(
      target,
      {
        opacity: [0, 1],
        y: [25, 0],
      },
      {
        duration: 0.7,
      },
    )
  })

  // FITUR CARD
  inView('.fitur-section', () => {
    animate(
      '.fitur-card',
      {
        opacity: [0, 1],
        y: [35, 0],
      },
      {
        duration: 0.6,
        delay: stagger(0.12),
      },
    )
  })

  // EVENT CARD
  inView('.event-section', () => {
    animate(
      '.event-card',
      {
        opacity: [0, 1],
        y: [25, 0],
      },
      {
        duration: 0.5,
        delay: stagger(0.1),
      },
    )
  })

  // TIMELINE
  inView('.timeline-section', () => {
    animate(
      '.timeline-step',
      {
        opacity: [0, 1],
        scale: [0.92, 1],
      },
      {
        duration: 0.45,
        delay: stagger(0.1),
      },
    )
  })

  // PROMOTION
  inView('.promotion-card', ({ target }) => {
    animate(
      target,
      {
        opacity: [0, 1],
        y: [30, 0],
      },
      {
        duration: 0.7,
      },
    )
  })

  // ABOUT
  inView('.about-card', ({ target }) => {
    animate(
      target,
      {
        opacity: [0, 1],
        y: [30, 0],
      },
      {
        duration: 0.7,
      },
    )
  })
})
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

/* HERO */

.hero-section {
  overflow: hidden;
}

.hero-image {
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  transition: all 0.35s ease;
}

.hero-image:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.16);
}

/* FITUR */

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
.event-card {
  height: 100%;
}

.event-content {
  flex: 1;
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

  transition: all 0.3s ease;
}

.fitur-card:hover .icon-box {
  transform: scale(1.05);
}

/* EVENT */

.event-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.event-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.12);
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

/* TIMELINE */

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

  transition: all 0.3s ease;
}

.timeline-icon:hover {
  transform: scale(1.08);
}

.timeline-text {
  margin-top: 12px;
  font-size: 13px;
  color: #555;
}

/* PROMOTION */

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

  transition: all 0.3s ease;
}

.promotion-card:hover {
  transform: translateY(-4px);
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

.about-slider-wrapper {
  overflow-x: auto;
  padding-bottom: 10px;

  scrollbar-width: none;
}

.about-slider-wrapper::-webkit-scrollbar {
  display: none;
}

.about-slider {
  display: flex;
  gap: 18px;
}

.about-card-mini {
  min-width: 340px;

  background: white;

  border-radius: 22px;

  padding: 22px;

  display: flex;
  align-items: center;
  gap: 18px;

  border: 1px solid #eef2f7;

  transition: all 0.3s ease;

  flex-shrink: 0;
}

.about-card-mini:hover {
  transform: translateY(-4px);

  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.08);
}

.about-logo-mini {
  border: 4px solid #eef2ff;

  flex-shrink: 0;

  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.12);
}

.about-mini-content {
  flex: 1;

  min-width: 0;
}

.about-mini-name {
  font-size: 18px;
  font-weight: 700;

  color: #111827;

  margin-bottom: 10px;

  line-height: 1.4;
}

.about-mini-item {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 6px;

  color: #64748b;

  font-size: 13px;

  overflow: hidden;
}

.about-mini-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
