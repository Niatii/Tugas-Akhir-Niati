<template>
  <q-page class="q-pa-xl">
    <div class="text-h5 text-bold motion-header-title">Acara Saya</div>
    <div class="text-grey-7 dynamic-header-subtitle">
      Hai <span class="text-weight-bold text-indigo-9">{{ userName }}</span
      >, kamu sudah mengikuti
      <span class="text-weight-bold text-indigo-9">{{ totalEvents }}</span> Acara kepanitiaan
    </div>

    <div class="row q-col-gutter-md q-mt-sm">
      <div class="col-4">
        <q-card
          class="stat-card cursor-pointer"
          :class="{
            'active-stat': selectedFilter === 'semua',
          }"
          flat
          bordered
          @click="handleStatClick('semua')"
        >
          <q-card-section class="text-center q-pa-lg">
            <div class="stat-icon-wrapper bg-indigo-1">
              <q-icon name="event_note" size="24px" class="text-indigo-7" />
            </div>
            <div class="text-subtitle2 text-weight-bold q-mt-sm text-indigo-9">Semua Acara</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card
          class="stat-card cursor-pointer"
          :class="{
            'active-stat': selectedFilter === 'diikuti',
          }"
          flat
          bordered
          @click="handleStatClick('diikuti')"
        >
          <q-card-section class="text-center q-pa-lg">
            <div class="stat-icon-wrapper bg-green-1">
              <q-icon name="event_available" size="24px" class="text-green-7" />
            </div>
            <div class="text-subtitle2 text-weight-bold q-mt-sm text-green-9">Sedang Diikuti</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card
          class="stat-card cursor-pointer"
          :class="{
            'active-stat': selectedFilter === 'selesai',
          }"
          flat
          bordered
          @click="handleStatClick('selesai')"
        >
          <q-card-section class="text-center q-pa-lg">
            <div class="stat-icon-wrapper bg-orange-1">
              <q-icon name="task_alt" size="24px" class="text-orange-7" />
            </div>
            <div class="text-subtitle2 text-weight-bold q-mt-sm text-orange-9">Selesai</div>
          </q-card-section>
        </q-card>
      </div>
    </div>


    <div class="row q-mt-lg progress-card">
      <div class="col-12">
        <q-card flat bordered class="q-pa-md" style="border-radius: 16px">
          <div class="row items-center">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-bold">Progress Acara</div>
              <q-linear-progress
                size="20px"
                :value="progressValue"
                color="indigo-7"
                class="q-mt-sm q-mb-xs"
                style="border-radius: 12px"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="indigo-7"
                    :label="`${Math.round(progressValue * 100)}% Selesai`"
                  />
                </div>
              </q-linear-progress>
            </div>
            <div class="col-12 col-md-6 q-mt-sm q-mt-md-none">
              <div class="row q-col-gutter-sm justify-end">
                <div class="col-auto">
                  <q-chip icon="event_note" color="indigo-7" text-color="white" size="md">
                    Semua: {{ totalEvents }}
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip icon="event_available" color="green-7" text-color="white" size="md">
                    Aktif: {{ activeEvents }}
                  </q-chip>
                </div>
                <div class="col-auto">
                  <q-chip icon="task_alt" color="orange-7" text-color="white" size="md">
                    Selesai: {{ completedEvents }}
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md" style="border-radius: 16px">
      <template v-if="paginatedEvents.length">
        <div class="col-12 col-md-6" v-for="item in paginatedEvents" :key="item.id">
          <q-card class="event-card q-pa-lg" style="border-radius: 24px">
            <q-card-section>
              <div class="row items-start justify-between">
                <div>
                  <div class="text-h6 text-weight-bold">
                    {{ item.event.title }}
                  </div>

                  <div class="row items-center text-grey-7 q-mt-xs">
                    <q-icon name="groups" size="18px" class="q-mr-xs" />

                    {{ item.event.user?.name }}
                  </div>
                </div>

                <q-chip
                  dense
                  size="12px"
                  class="q-px-md"
                  :color="item.event.status_name === 'Selesai' ? 'orange-5' : 'green-5'"
                  text-color="white"
                >
                  {{ item.event.status_name }}
                </q-chip>
              </div>

              <div class="row items-center q-mt-md">
                <q-icon name="event" size="18px" class="q-mr-sm" />

                {{ formatDate(item.event.start_date) }}
                -
                {{ formatDate(item.event.end_date) }}
              </div>

              <div class="q-mt-sm">
                <div
                  v-if="item.registration_status_name === 'Ditolak'"
                  class="row items-center text-negative"
                >
                  <q-icon name="cancel" size="18px" class="q-mr-sm" />

                  Pendaftaran anda ditolak
                </div>

                <div
                  v-else-if="item.registration_status_name === 'Menunggu'"
                  class="row items-center text-orange"
                >
                  <q-icon name="schedule" size="18px" class="q-mr-sm" />

                  Pendaftaran sedang ditinjau
                </div>

                <div v-else class="row items-center">
                  <q-icon name="badge" size="18px" class="q-mr-sm" />

                  {{ item.position }}
                  Divisi
                  {{ item.division.name }}
                </div>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn
                v-if="item.registration_status_name === 'Diterima'"
                class="bg-indigo-9 text-white"
                label="Detail"
                icon="open_in_new"
                no-caps
                style="min-width: 150px; border-radius: 16px"
                @click="goDetail(item)"
              />

              <q-btn
                v-else-if="item.registration_status_name === 'Menunggu'"
                color="orange-7"
                outline
                disable
                label="Menunggu Persetujuan"
                icon="schedule"
                no-caps
                style="min-width: 220px; border-radius: 16px"
              />

              <q-btn
                v-else
                color="negative"
                outline
                disable
                label="Pendaftaran Ditolak"
                icon="cancel"
                no-caps
                style="min-width: 220px; border-radius: 16px"
              />
            </q-card-actions>
          </q-card>
        </div>
      </template>

      <div v-else class="col-12">
        <div class="empty-state column items-center justify-center">
          <q-icon name="event_busy" size="90px" color="grey-4" />

          <div class="text-h6 text-weight-bold q-mt-md">Belum Mengikuti Acara</div>

          <div class="text-grey-7 q-mt-sm text-center">
            Kamu belum mengikuti acara kepanitiaan apapun.
          </div>

          <q-btn
            color="indigo-9"
            label="Cari Acara"
            no-caps
            rounded
            class="q-mt-lg"
            to="/user/daftar-acara"
          />
        </div>
      </div>
    </div>

    <div class="q-pa-lg flex flex-center">
      <q-pagination v-model="current" :max="totalPages" input />
    </div>

    <FooterComponent />
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { animate } from 'motion'
import { useRouter } from 'vue-router'

import { getMyEvents } from 'src/services/event.api'

import FooterComponent from 'src/components/FooterComponent.vue'

const router = useRouter()

const events = ref([])
const user = ref(null)

const perPage = 4
const selectedFilter = ref('semua')

const userName = computed(() => {
  return user.value?.name || 'User'
})

const fetchEvents = async () => {
  try {
    const res = await getMyEvents()

    events.value = res.data.data.events
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  fetchEvents()

  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  await nextTick()

  animate(
    '.motion-header-title, .dynamic-header-subtitle, .stat-card, .progress-card',
    { opacity: [0, 1], y: [6, 0] },
    { duration: 0.3, easing: 'ease-out' },
  )
})

const goDetail = (item) => {
  router.push(`/user/detail-acara-saya/${item.id}`)
}
const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const totalEvents = computed(() => events.value.length)

const activeEvents = computed(
  () => events.value.filter((e) => e.event.status_name === 'Sedang Berlangsung').length,
)

const completedEvents = computed(
  () => events.value.filter((e) => e.event.status_name === 'Selesai').length,
)

const progressValue = computed(() => {
  if (!totalEvents.value) return 0

  return completedEvents.value / totalEvents.value
})

const paginatedEvents = computed(() => {
  const start = (current.value - 1) * perPage

  const end = start + perPage

  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / perPage)
})
const current = ref(1)
const handleStatClick = (type) => {
  selectedFilter.value = type

  current.value = 1
}
const filteredEvents = computed(() => {

  if (selectedFilter.value === 'semua') {
    return events.value
  }

  if (selectedFilter.value === 'diikuti') {
    return events.value.filter((e) => e.event.status_name !== 'Selesai')
  }

  if (selectedFilter.value === 'selesai') {
    return events.value.filter((e) => e.event.status_name === 'Selesai')
  }

  return events.value
})

watch(
  () => paginatedEvents.value,
  async (newVal) => {
    await nextTick()
    if (newVal && newVal.length > 0) {
      animate('.event-card', { opacity: [0, 1], y: [4, 0] }, { duration: 0.22, easing: 'ease-out' })
    } else {
      animate('.empty-state', { opacity: [0, 1] }, { duration: 0.22, easing: 'ease-out' })
    }
  },
  { deep: true },
)
</script>
<style>
.active-stat {
  border: 2px solid #3949ab;
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(57, 73, 171, 0.15);
}
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

.text-negative {
  font-weight: 600;
}

.event-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #e2e8f0;
  background: white;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(57, 73, 171, 0.08);
  border-color: #3949ab;
}

.empty-state {
  border-radius: 24px;
  background: #f8fafc;
  padding: 40px;
  border: 2px dashed #e2e8f0;
}
</style>
