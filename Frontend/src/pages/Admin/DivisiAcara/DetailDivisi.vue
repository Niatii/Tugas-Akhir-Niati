<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="q-mb-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el label="Kelola Divisi" icon="apartment" class="text-grey-9" />
        <q-breadcrumbs-el label="Detail Divisi" icon="info" class="text-indigo-9" />
      </q-breadcrumbs>
    </div>
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold">Detail Divisi</div>

        <div class="text-grey-7">Informasi lengkap divisi dan anggota yang terdaftar.</div>
      </div>
    </div>

    <!-- INFO CARD -->
    <q-card flat bordered class="rounded-card q-pa-lg q-mb-lg bg-blue-1">
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-6">
          <div class="text-caption text-grey-7 q-mb-xs">Nama Divisi</div>

          <div class="text-subtitle1 text-weight-bold">
            {{ divisi.name }}
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="text-caption text-grey-7 q-mb-xs">Acara</div>

          <div class="text-subtitle1 text-weight-medium">
            {{ divisi.event?.title }}
          </div>
        </div>
      </div>
    </q-card>
    <div class="col-12 col-md-5 q-my-md">
      <q-input
        outlined
        dense
        rounded
        v-model="search"
        label="Cari peserta..."
        style="max-width: 500px;"
        class="custom-field-search"
      >
        <template #prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <!-- ANGGOTA -->
    <q-card flat bordered class="rounded-card">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold">Daftar Anggota</div>

          <div class="text-grey-7 text-caption">Total {{ anggota.length }} anggota</div>
        </div>
      </q-card-section>

      <q-separator />

      <q-table flat :rows="anggota" :columns="columns" row-key="id" separator="horizontal">
        <template #body-cell-no="props">
          <q-td :props="props">
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template #body-cell-status="props">
          <q-td :props="props">
            <q-chip
              dense
              size="12px"
              class="q-px-md q-py-sm"
              :color="props.row.status === 'Koordinator' ? 'primary' : 'grey-6'"
              text-color="white"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template #body-cell-aksi="props">
          <q-td :props="props">
            <q-btn flat round dense icon="more_vert">
              <q-menu>
                <q-list style="min-width: 180px">
                  <q-item clickable v-close-popup @click="toggleRole(props.row)">
                    <q-item-section>
                      {{
                        props.row.status === 'Koordinator'
                          ? 'Turunkan Jadi Anggota'
                          : 'Jadikan Koordinator'
                      }}
                    </q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item
                    clickable
                    v-close-popup
                    class="text-negative"
                    @click="removeMember(props.row)"
                  >
                    <q-item-section>Keluarkan</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <div v-if="anggota.length === 0" class="text-center text-grey-6 q-pa-xl">
        Belum ada anggota di divisi ini.
      </div>
    </q-card>
    <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FooterComponent from 'src/components/FooterComponent.vue'
import { getDivisiById } from 'src/services/divisi.api'
import { useRoute } from 'vue-router'
/*
  nanti ambil dari API / route params
*/
const route = useRoute()
const divisiId = route.params.id
const loadDivisi = async () => {
   try {
    const res = await getDivisiById(divisiId)
    divisi.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadDivisi()
})

const toggleRole = (row) => {
  row.status = row.status === 'Koordinator' ? 'Anggota' : 'Koordinator'
}

const removeMember = (row) => {
  anggota.value = anggota.value.filter((i) => i.id !== row.id)
}

const divisi = ref({
  id: 1,
  nama: 'Pubdok',
  acara: 'HMTI Fair',
})

const anggota = ref([
  {
    id: 1,
    nama: 'Andi Saputra',
    nim: '221001',
    status: 'Anggota',
  },
  {
    id: 2,
    nama: 'Budi Pratama',
    nim: '221002',
    status: 'Koordinator',
  },
  {
    id: 3,
    nama: 'Citra Lestari',
    nim: '221003',
    status: 'Anggota',
  },
])

const columns = [
  {
    name: 'no',
    label: 'No',
    align: 'left',
  },
  {
    name: 'nama',
    label: 'Nama Anggota',
    field: 'nama',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
  },
  {
    name: 'nim',
    label: 'NIM',
    field: 'nim',
    align: 'left',
  },
  {
    name: 'aksi',
    label: 'Aksi',
    align: 'center',
  },
]
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}
</style>
