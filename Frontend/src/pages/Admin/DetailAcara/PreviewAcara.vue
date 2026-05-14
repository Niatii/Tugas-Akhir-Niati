<template>
  <q-page class="q-pa-lg">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <template #separator>
          <q-icon name="chevron_right" size="1.2em" color="grey-6" />
        </template>
        <q-breadcrumbs-el
          label="Kelola Acara"
          icon="event"
          class="text-grey-9"
          to="/admin/detail"
        />
        <q-breadcrumbs-el label="Preview Detail Acara" icon="open_in_new" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>

    <div class="bg-indigo-4 q-pa-md hero-card" style="border-radius: 16px">
      <div class="row items-center justify-end q-my-sm text-white">
        <q-chip dense outline text-color="white" icon="event" class="q-pa-md motion-hover">
          {{ event?.status_name }}
        </q-chip>
      </div>
      <div class="q-pa-md text-white">
        <div class="text-h5 text-bold">{{ event?.title }}</div>
        <div class="row items-center q-mt-xs">
          <q-icon name="groups" size="18px" class="q-mr-xs" />
          {{ event?.user?.name }}
        </div>
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-caption text-grey-7">Masa Pendaftaran</div>

              <div class="text-weight-medium text-indigo-9">
                {{ formatDate(event?.registration_start) }} -
                {{ formatDate(event?.registration_end) }}
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="bg-white q-pa-md rounded-borders">
              <div class="text-caption text-grey-7">Jadwal Acara</div>

              <div class="text-weight-medium text-indigo-9">
                {{ formatDate(event?.start_date) }} -
                {{ formatDate(event?.end_date) }}
              </div>
            </div>
          </div>
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
            <q-tab name="informasi" icon="info" label="Informasi" no-caps class="motion-hover" />
            <q-tab
              name="anggota"
              icon="groups"
              label="Anggota Acara"
              no-caps
              class="motion-hover"
            />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="informasi">
              <q-img :src="gambar" ratio="16/9" style="height: 250px; border-radius: 16px" />
              <div class="q-pa-md q-mt-md">
                <div class="text-h6 text-bold q-mb-md">{{ event?.title }}</div>

                <div class="text-grey-7 q-mb-md" style="font-size: 14px">
                  Diperbarui oleh {{ event?.updatedBy?.name || event?.user?.name }},
                  {{
                    event?.updated_at ? formatDate(event.updated_at) : formatDate(event?.created_at)
                  }}
                </div>
                <div
                  class="richtext-content"
                  v-html="event?.description || '<i>Belum ada deskripsi</i>'"
                ></div>

                <div class="flex items-center">
                  <q-avatar size="40px" class="bg-white q-mr-sm">
                    <img src="~assets/image/Logo.jpg" />
                  </q-avatar>
                  <div class="text-subtitle2">Himpunan Mahasiswa Teknik Informatika</div>
                </div>
            
                <div class="q-my-lg">
                  <div class="text-subtitle1 text-bold q-mb-sm">Syarat dan Ketentuan</div>
                  <div
                    class="richtext-content"
                    v-html="event?.requirement || '<i>Belum ada syarat dan ketentuan</i>'"
                  ></div>
                </div>

                <div class="q-mb-lg">
                  <div class="text-subtitle1 text-bold q-mb-sm">Keuntungan</div>
                  <div
                    class="richtext-content"
                    v-html="event?.benefit || '<i>Belum ada benefit</i>'"
                  ></div>
                </div>

                <div>
                  <div class="text-subtitle1 text-bold q-mb-sm">Divisi yang Tersedia</div>
                  <div
                    class="richtext-content"
                    v-html="event?.description_divisi || '<i>Informasi divisi belum tersedia.</i>'"
                  ></div>
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="anggota" class="q-px-xl">
              <div class="row items-center q-mt-xs text-h6 text-bold text-indigo-9">
                <q-icon name="groups" size="32px" class="q-mr-xs" />
                Anggota Acara
              </div>

              <div class="text-grey-7 q-mt-xs q-mb-md">
                Berikut daftar anggota yang terdaftar pada acara ini.
              </div>

              <q-table
                flat
                bordered
                class="motion-item rounded-card"
                :rows="rowsAnggota"
                :columns="columnsAnggota"
                row-key="id"
              >
                <template #body-cell-no="props">
                  <q-td :props="props">
                    {{ props.pageIndex + 1 }}
                  </q-td>
                </template>

                <template #body-cell-nama="props">
                  <q-td :props="props">
                    <div class="row items-center no-wrap">
                      <q-avatar size="34px" color="indigo-1" text-color="indigo-9" class="q-mr-sm">
                        {{ props.row.nama.charAt(0) }}
                      </q-avatar>

                      <div>
                        <div class="text-weight-medium">
                          {{ props.row.nama }}
                        </div>

                        <div class="text-caption text-grey-7">
                          {{ props.row.email }}
                        </div>
                      </div>
                    </div>
                  </q-td>
                </template>

                <template #body-cell-divisi="props">
                  <q-td :props="props">
                    <q-chip size="12px" dense color="blue-1" text-color="blue-9" class="q-px-sm">
                      {{ props.row.divisi }}
                    </q-chip>
                  </q-td>
                </template>

                <template #body-cell-role="props">
                  <q-td :props="props">
                    <q-chip
                      dense
                      size="12px"
                      class="q-px-sm"
                      :color="props.row.role === 'Koordinator' ? 'indigo' : 'grey-6'"
                      text-color="white"
                    >
                      {{ props.row.role }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>

              <div v-if="rowsAnggota.length === 0" class="text-center text-grey-6 q-pa-xl">
                Belum ada anggota yang terdaftar.
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <FooterComponent />
  </q-page>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { animate, stagger } from 'motion'
import { useRoute } from 'vue-router'

import { getEventById } from 'src/services/event.api'

import gambar from 'src/assets/image/gambar.jpg'
import FooterComponent from 'src/components/FooterComponent.vue'

const tab = ref('informasi')
const route = useRoute()
const eventId = route.params.id
const event = ref(null)

const columnsAnggota = [
  { name: 'no', label: 'No', align: 'center' },
  { name: 'nama', label: 'Nama', align: 'left' },
  { name: 'divisi', label: 'Divisi', align: 'left' },
  { name: 'role', label: 'Role', align: 'left' },
]

const rowsAnggota = computed(() => {
  if (!event.value?.event_members) return []

  return event.value.event_members.map((m, i) => ({
    id: i + 1,
    nama: m.name,
    email: m.email,
    divisi: m.division,
    role: m.position || 'Anggota',
  }))
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const loadEvent = async () => {
  try {
    const res = await getEventById(eventId)
    event.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  const hero = document.querySelector('.hero-card')

  if (hero) {
    animate(
      hero,
      {
        opacity: [0, 1],
        y: [18, 0],
      },
      {
        duration: 0.45,
        easing: 'ease-out',
      },
    )
    loadEvent()
  }

  const items = document.querySelectorAll('.motion-item')
  if (items.length) {
    animate(
      items,
      {
        opacity: [0, 1],
        y: [14, 0],
      },
      {
        delay: stagger(0.08),
        duration: 0.35,
        easing: 'ease-out',
      },
    )
  }

  bindHoverMotion()
})

const bindHoverMotion = () => {
  const items = document.querySelectorAll('.motion-hover')

  items.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      animate(
        el,
        {
          y: -2,
          scale: 1.01,
        },
        {
          duration: 0.16,
        },
      )
    })

    el.addEventListener('mouseleave', () => {
      animate(
        el,
        {
          y: 0,
          scale: 1,
        },
        {
          duration: 0.16,
        },
      )
    })

    el.addEventListener('mousedown', () => {
      animate(
        el,
        {
          scale: 0.985,
        },
        {
          duration: 0.08,
        },
      )
    })
  })
}
</script>
<style scoped>
.tabs-container {
  background: transparent;
}

.custom-tabs {
  background: #f5f8fe;
  border-radius: 40px;
  padding: 6px;
}

.custom-tabs .q-tab {
  min-height: 48px;
  border-radius: 30px;
  font-weight: 600;
  color: #5f6b7a;
}

.custom-tabs .q-tab--active {
  background: #243261;
  color: white;
}
</style>
