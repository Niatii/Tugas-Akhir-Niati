<template>
  <q-page class="detail-page">
    <div class="container q-px-xl q-py-lg">
      <!-- BREADCRUMB -->
      <div class="breadcrumb-wrapper q-mb-lg">
        <q-breadcrumbs>
          <template #separator>
            <q-icon name="chevron_right" color="grey-5" />
          </template>

          <q-breadcrumbs-el label="Daftar Acara" icon="event" to="/user/daftar-acara" />

          <q-breadcrumbs-el :label="event.title" />
        </q-breadcrumbs>
      </div>

      <!-- CONTENT -->
      <div class="row q-col-gutter-md">
        <!-- SIDEBAR -->
        <div class="col-12 col-md-5">
          <div class="event-sidebar">
            <q-card class="event-card">
              <!-- STATUS -->
              <div class="flex justify-end q-mb-md">
                <q-chip color="green-5" text-color="white" class="status-chip">
                  {{ event.status_name }}
                </q-chip>
              </div>

              <!-- IMAGE -->
              <q-img
                src="~assets/image/gambar.jpg"
                :ratio="16 / 9"
                style="height: 100px; border-radius: 12px"
              />

              <!-- TITLE -->
              <div class="q-mt-lg">
                <div class="text-h5 text-weight-bold">
                  {{ event.title }}
                </div>

                <div class="text-body2 text-grey-7 q-mt-sm">
                  <div class="rich-content" v-html="event.description" />
                </div>
              </div>

              <!-- INFO -->
              <div class="q-mt-sm column q-gutter-sm">
                <div class="info-box">
                  <q-icon name="event" color="indigo-8" size="22px" />

                  <div>
                    <div class="info-label">Tanggal Pendafatarn</div>

                    <div class="info-value">
                      {{ formatDate(event.registration_start) }}
                      -
                      {{ formatDate(event.registration_end) }}
                    </div>
                  </div>
                </div>
                <div class="info-box">
                  <q-icon name="event" color="indigo-8" size="22px" />

                  <div>
                    <div class="info-label">Tanggal Acara</div>

                    <div class="info-value">
                      {{ formatDate(event.start_date) }}
                      -
                      {{ formatDate(event.end_date) }}
                    </div>
                  </div>
                </div>

                <div class="info-box">
                  <q-icon name="business" color="orange-7" size="22px" />

                  <div>
                    <div class="info-label">Penyelenggara</div>

                    <div class="info-value">
                      {{ event.user?.name }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- BUTTON -->
              <q-btn
                class="register-btn q-mt-xl"
                color="indigo-9"
                label="Daftar Sekarang"
                no-caps
                rounded
                unelevated
                @click="goToForm"
              />
            </q-card>
          </div>
        </div>

        <!-- DETAIL -->
        <div class="col-12 col-md-7">
          <!-- SYARAT -->
          <q-card class="section-card q-mb-lg">
            <div class="section-title">Syarat dan Ketentuan</div>

            <div class="text-grey-8">
              <div class="rich-content" v-html="event.requirement" />
            </div>
          </q-card>

          <!-- BENEFIT -->
          <q-card class="section-card q-mb-lg">
            <div class="section-title">Keuntungan</div>

            <div class="text-grey-8">
              <div class="rich-content" v-html="event.benefit" />
            </div>
          </q-card>

          <!-- DIVISI -->
          <q-card class="section-card">
            <div class="section-title">Divisi yang Tersedia</div>

            <div class="row q-gutter-sm">
              <q-chip
                v-for="division in event.divisions"
                :key="division.id"
                color="indigo-1"
                text-color="indigo-9"
                icon="groups"
              >
                {{ division.name }}
              </q-chip>
            </div>

            <div class="text-grey-8 q-mt-md">
              <div class="rich-content" v-html="event.description_divisi" />
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'

import { getPublicEventById } from 'src/services/event.api'

const route = useRoute()
const router = useRouter()

const event = ref({})

const fetchDetail = async () => {
  try {
    const res = await getPublicEventById(route.params.id)

    event.value = res.data.data
  } catch (error) {
    console.log(error)
  }
}

const goToForm = () => {
  router.push(`/user/formulir-pendaftaran/${route.params.id}`)
}

onMounted(() => {
  fetchDetail()
})

const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style scoped>
.detail-page {
  background: #f8fafc;
  min-height: 100vh;
}

.event-sidebar {
  position: sticky;
  top: 90px;
}

.event-card {
  border-radius: 24px;
  padding: 24px;
}

.event-image {
  border-radius: 18px;
  overflow: hidden;
}

.status-chip {
  font-size: 12px;
  font-weight: 600;
}

.info-box {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 2px;
}

.info-label {
  font-size: 12px;
  color: #64748b;
}

.info-value {
  font-weight: 600;
}

.register-btn {
  width: 100%;
  height: 48px;
  font-weight: 600;
}

.section-card {
  border-radius: 22px;
  padding: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
}

.breadcrumb-wrapper {
  background: white;
  padding: 14px 18px;
  border-radius: 16px;
}
</style>
