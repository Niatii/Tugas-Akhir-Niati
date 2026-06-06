<template>
  <q-page class="q-px-xl q-py-md">
    <div class="q-px-md">
      <!-- HEAD -->
      <div class="motion-header">
        <div class="text-h5 text-bold q-my-md">Detail Acara yang bisa kamu ikuti</div>
        <div class="text-grey-7">
          Temukan berbagai acara menarik yang bisa kamu ikuti. Pilih kegiatan yang sesuai dengan
          minatmu <br />dan lakukan pendaftaran dengan mudah melalui sistem.
        </div>
      </div>

      <!-- SEARCH -->
      <div class="flex justify-end q-my-lg">
        <q-input
          outlined
          dense
          v-model="search"
          :label="search ? undefined : 'Cari acara yang anda inginkan'"
          debounce="300"
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
          <q-card class="q-pa-lg motion-filter filter-card">
            <!-- HEADER -->
            <div class="row items-center justify-between q-mb-md">
              <div class="text-h6 text-weight-bold">Filter Acara</div>

              <q-btn
                flat
                dense
                no-caps
                icon="refresh"
                label="Reset"
                color="indigo-8"
                @click="resetFilter"
              />
            </div>

            <!-- ACTIVE FILTER -->
            <div v-if="filterPenyelenggara || tanggalMulai || tanggalSelesai" class="q-mb-md">
              <div class="text-caption text-grey-7 q-mb-sm">Filter Aktif</div>

              <div class="row q-gutter-sm">
                <!-- <q-chip
                  v-if="filterStatus"
                  removable
                  color="indigo-1"
                  text-color="indigo-9"
                  @remove="filterStatus = null"
                >
                  {{ getStatusLabel(filterStatus) }}
                </q-chip> -->

                <q-chip
                  v-if="filterPenyelenggara"
                  removable
                  color="green-1"
                  text-color="green-9"
                  @remove="filterPenyelenggara = null"
                >
                  {{ filterPenyelenggara }}
                </q-chip>

                <q-chip
                  v-if="tanggalMulai"
                  removable
                  color="orange-1"
                  text-color="orange-9"
                  @remove="tanggalMulai = ''"
                >
                  Dari {{ formatDate(tanggalMulai) }}
                </q-chip>

                <q-chip
                  v-if="tanggalSelesai"
                  removable
                  color="red-1"
                  text-color="red-9"
                  @remove="tanggalSelesai = ''"
                >
                  Sampai {{ formatDate(tanggalSelesai) }}
                </q-chip>
              </div>
            </div>

            <!-- STATUS -->
            <!-- <div class="q-mb-lg">
              <div class="filter-title">Status Acara</div>

              <q-select
                v-model="filterStatus"
                :options="statusOptions"
                dense
                outlined
                emit-value
                map-options
                rounded
                clearable
                class="modern-select"
              />
            </div> -->

            <!-- PENYELENGGARA -->
            <div class="q-mb-lg">
              <div class="filter-title">Penyelenggara</div>

              <q-select
                v-model="filterPenyelenggara"
                :options="penyelenggaraOptions"
                dense
                outlined
                emit-value
                map-options
                rounded
                clearable
                use-input
                input-debounce="0"
                class="modern-select"
              />
            </div>

            <!-- TANGGAL -->
            <div>
              <div class="filter-title q-mb-sm">Rentang Tanggal</div>

              <div class="column q-gutter-md">
                <DateInput v-model="tanggalMulai" placeholder="Tanggal Mulai" />

                <DateInput v-model="tanggalSelesai" placeholder="Tanggal Selesai" />
              </div>
            </div>
          </q-card>
        </div>

        <!-- CARD -->
        <div class="col-8">
          <div class="example-col-gutter-horizontal">
            <div v-if="paginatedEvents.length" class="row q-col-gutter-x-lg q-col-gutter-y-lg">
              <div
                class="col-12 col-sm-6 col-lg-4"
                v-for="event in paginatedEvents"
                :key="event.id"
              >
                <div class="shadow-2 q-py-xs q-px-md motion-card" style="border-radius: 16px">
                  <!-- STATUS -->
                  <div class="flex justify-end q-my-sm">
                    <q-chip class="q-px-lg text-white bg-green-5" style="font-size: 12px">
                      {{ event.status_name }}
                    </q-chip>
                  </div>

                  <!-- IMAGE -->
                  <q-img
                    :src="event.image_url || defaultEventImage"
                    :ratio="16 / 9"
                    style="height: 100px; border-radius: 12px"
                  />

                  <!-- CONTENT -->
                  <div class="q-px-sm">
                    <div class="text-subtitle1 text-bold q-my-sm">
                      {{ event.title }}
                    </div>

                    <div style="font-size: 12px" class="text-grey-9">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </div>

                    <div class="text-grey-7" style="font-size: 10px">
                      {{ formatDate(event.registration_start) }}
                      -
                      {{ formatDate(event.registration_end) }}
                    </div>
                  </div>

                  <!-- ACTION -->
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

            <!-- EMPTY STATE -->
            <div v-else class="empty-state column items-center justify-center">
              <q-icon name="event_busy" size="90px" color="grey-4" />

              <div class="text-h6 text-weight-bold q-mt-md">Belum Ada Acara</div>

              <div class="text-grey-7 text-center q-mt-sm empty-text">
                Tidak ada acara yang sesuai dengan pencarian atau filter yang dipilih.
              </div>

              <q-btn
                flat
                no-caps
                color="indigo-8"
                icon="refresh"
                label="Reset Filter"
                class="q-mt-md"
                @click="resetFilter"
              />
            </div>
          </div>

          <div class="q-pa-lg flex flex-center">
            <q-pagination v-model="current" :max="totalPages" input color="indigo-9" />
          </div>
        </div>
      </div>
    </div>
    <FooterComponent />
  </q-page>
</template>
<script setup>
import { ref, onMounted, nextTick, computed, watch } from 'vue'
import { animate, stagger } from 'motion'
import { useRouter } from 'vue-router'
import DateInput from 'src/components/DateInput.vue'
import FooterComponent from 'src/components/FooterComponent.vue'
import { getPublicEvents } from 'src/services/event.api'
import defaultEventImage from 'src/assets/image/default_acara.png'
const router = useRouter()
const search = ref('')
const current = ref(1)
const filterStatus = ref(null)
const filterPenyelenggara = ref(null)
const tanggalMulai = ref('')
const tanggalSelesai = ref('')
const events = ref([])
const perPage = 6
const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / perPage)
})
watch([search, filterPenyelenggara, tanggalMulai, tanggalSelesai], () => {
  current.value = 1
})
const paginatedEvents = computed(() => {
  const start = (current.value - 1) * perPage

  const end = start + perPage

  return filteredEvents.value.slice(start, end)
})
onMounted(async () => {
  await fetchEvents()

  await nextTick()

  runAnimations()
})
const fetchEvents = async () => {
  try {
    const res = await getPublicEvents()

    events.value = res.data.data.events
  } catch (error) {
    console.log(error)
  }
}

const penyelenggaraOptions = computed(() => {
  const organizers = events.value.map((event) => event.user?.name)

  /**
   * hapus duplicate
   */
  const uniqueOrganizers = [...new Set(organizers)]

  return [
    {
      label: 'Semua',
      value: null,
    },

    ...uniqueOrganizers.map((name) => ({
      label: name,
      value: name,
    })),
  ]
})

function goDetail(id) {
  router.push(`/user/detail-acara/${id}`)
}

const formatDate = (date) => {
  if (!date) return '-'

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const resetFilter = () => {
  filterStatus.value = null
  filterPenyelenggara.value = null
  tanggalMulai.value = ''
  tanggalSelesai.value = ''
  search.value = ''
}

// const getStatusLabel = (value) => {
//   return statusOptions.find((s) => s.value === value)?.label || value
// }

const filteredEvents = computed(() => {
  let result = [...events.value]

  /**
   * SEARCH
   */
  if (search.value) {
    const keyword = search.value.toLowerCase()

    result = result.filter(
      (event) =>
        event.title?.toLowerCase().includes(keyword) ||
        event.user?.name?.toLowerCase().includes(keyword),
    )
  }

  /**
   * STATUS
   */
  // if (filterStatus.value) {
  //   result = result.filter((event) => event.status_name === filterStatus.value)
  // }

  /**
   * PENYELENGGARA
   */
  if (filterPenyelenggara.value) {
    result = result.filter((event) => event.user?.name === filterPenyelenggara.value)
  }

  /**
   * TANGGAL MULAI
   */
  if (tanggalMulai.value) {
    result = result.filter((event) => {
      if (!event.registration_start) return false
      return event.registration_start.substring(0, 10) >= tanggalMulai.value
    })
  }

  /**
   * TANGGAL SELESAI
   */
  if (tanggalSelesai.value) {
    result = result.filter((event) => {
      if (!event.registration_end) return false
      return event.registration_end.substring(0, 10) <= tanggalSelesai.value
    })
  }

  return result
})

const runAnimations = () => {
  /**
   * HEADER
   */
  animate(
    '.motion-header',
    {
      opacity: [0, 1],
      y: [-12, 0],
    },
    {
      duration: 0.35,
      easing: 'ease-out',
    },
  )

  /**
   * FILTER CARD
   */
  animate(
    '.motion-filter',
    {
      opacity: [0, 1],
      x: [-20, 0],
    },
    {
      duration: 0.4,
      delay: 0.1,
      easing: 'ease-out',
    },
  )

  /**
   * EVENT CARD
   */
  animate(
    '.motion-card',
    {
      opacity: [0, 1],
      y: [24, 0],
      scale: [0.96, 1],
    },
    {
      delay: stagger(0.06),
      duration: 0.35,
      easing: 'ease-out',
    },
  )

  bindHoverEffects()
}

const bindHoverEffects = () => {
  /**
   * CARD HOVER
   */
  const cards = document.querySelectorAll('.motion-card')

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      animate(
        card,
        {
          y: -6,
          scale: 1.015,
        },
        {
          duration: 0.2,
        },
      )
    })

    card.addEventListener('mouseleave', () => {
      animate(
        card,
        {
          y: 0,
          scale: 1,
        },
        {
          duration: 0.2,
        },
      )
    })
  })

  /**
   * DETAIL LINK
   */
  const links = document.querySelectorAll('.detail-link')

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      animate(
        link.querySelector('.arrow-icon'),
        {
          x: 5,
        },
        {
          duration: 0.15,
        },
      )
    })

    link.addEventListener('mouseleave', () => {
      animate(
        link.querySelector('.arrow-icon'),
        {
          x: 0,
        },
        {
          duration: 0.15,
        },
      )
    })
  })
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
  min-width: 600px;
}

.custom-field-search .q-field__control {
  border-radius: 20px;
}

.custom-input {
  background: rgb(255, 255, 255);
  border-radius: 30px;
}

.motion-card {
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  background: white;
}

.motion-card:hover {
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

.motion-filter {
  background: white;
}

.detail-link {
  transition: all 0.2s ease;
}

.detail-link:hover {
  opacity: 0.85;
}

.arrow-icon {
  transition: transform 0.2s ease;
}

.filter-card {
  border-radius: 20px;
  background: white;
  position: sticky;
  top: 90px;
}

.filter-title {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.modern-select :deep(.q-field__control) {
  border-radius: 16px;
}

.modern-select {
  transition: all 0.2s ease;
}

.modern-select:hover {
  transform: translateY(-1px);
}
</style>
