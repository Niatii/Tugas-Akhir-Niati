<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="q-mb-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.2em" name="chevron_right" color="grey-6" />
        </template>
        <q-breadcrumbs-el
          label="Kelola Divisi"
          icon="apartment"
          class="text-grey-9"
          to="/admin/divisi"
        />
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
        :label="search ? undefined : 'Cari peserta...'"
        style="max-width: 500px"
        debounce="10"
        clearable
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

      <q-table flat :rows="filteredAnggota" :columns="columns" row-key="id" separator="horizontal">
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
            <template v-if="!isAcaraSelesai">
              <q-btn flat round dense icon="more_vert">
                <q-menu>
                  <q-list style="min-width: 180px">
                    <q-item clickable v-close-popup @click="askToggleRole(props.row)">
                      <q-item-section>
                        {{
                          props.row.status === 'Koordinator'
                            ? 'Turunkan Jadi Anggota'
                            : 'Jadikan Koordinator'
                        }}
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>
            <span v-else class="text-grey-5 text-caption">—</span>
          </q-td>
        </template>
      </q-table>

      <div v-if="anggota.length === 0" class="text-center text-grey-6 q-pa-xl">
        Belum ada anggota di divisi ini.
      </div>
    </q-card>
    <FooterComponent />

    <ConfirmDialog
      v-model="showConfirm"
      :type="pendingRow?.status === 'Koordinator' ? 'warning' : 'info'"
      :title="
        pendingRow?.status === 'Koordinator' ? 'Turunkan Jadi Anggota' : 'Jadikan Koordinator'
      "
      :message="
        pendingRow?.status === 'Koordinator'
          ? `Turunkan <b>${pendingRow?.nama}</b> menjadi Anggota biasa?`
          : `Jadikan <b>${pendingRow?.nama}</b> sebagai Koordinator divisi ini?`
      "
      :confirm-label="pendingRow?.status === 'Koordinator' ? 'Ya, Turunkan' : 'Ya, Jadikan'"
      cancel-label="Batal"
      :loading="loadingConfirm"
      @confirm="onConfirmToggle"
    />

    <StatusDialog
      v-model="showStatus"
      :type="statusType"
      :title="statusTitle"
      :message="statusMessage"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import FooterComponent from 'src/components/FooterComponent.vue'
import ConfirmDialog from 'src/components/ConfirmDialog.vue'
import StatusDialog from 'src/components/StatusDialog.vue'
import { getDivisiById } from 'src/services/divisi.api'
import { useRoute } from 'vue-router'
import { updateDivisionMember } from 'src/services/division-member.api'

const route = useRoute()
const search = ref('')
const divisiId = route.params.id
const showConfirm = ref(false)
const loadingConfirm = ref(false)
const pendingRow = ref(null)
const showStatus = ref(false)
const statusType = ref('success')
const statusTitle = ref('')
const statusMessage = ref('')
const loadDivisi = async () => {
  try {
    const res = await getDivisiById(divisiId)
    divisi.value = res.data.data
    anggota.value = (res.data.data.members || []).map((member) => ({
      id: member.id,
      nama: member.user?.name || '-',
      nim: member.user?.nim || '-',
      status: member.position || 'Anggota',
    }))
  } catch (err) {
    console.error(err)
  }
}

const filteredAnggota = computed(() => {
  return anggota.value.filter((item) => {
    const keyword = (search.value || '').toLowerCase()

    return (
      item.nama.toLowerCase().includes(keyword) ||
      item.nim.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword)
    )
  })
})

const isAcaraSelesai = computed(() => {
  const status = divisi.value.event?.status
  // status 5 = Selesai (berdasarkan getDynamicStatus di backend)
  return status === 5
})

onMounted(() => {
  loadDivisi()
})

const askToggleRole = (row) => {
  pendingRow.value = row
  showConfirm.value = true
}

const onConfirmToggle = async () => {
  if (!pendingRow.value) return
  loadingConfirm.value = true
  try {
    const row = pendingRow.value
    const newRole = row.status === 'Koordinator' ? 'Anggota' : 'Koordinator'

    await updateDivisionMember(divisi.value.id, row.id, { position: newRole })

    row.status = newRole
    showConfirm.value = false

    statusType.value = 'success'
    statusTitle.value =
      newRole === 'Koordinator' ? 'Berhasil Dijadikan Koordinator' : 'Berhasil Diturunkan'
    statusMessage.value = `${row.nama} kini menjadi ${newRole}.`
    showStatus.value = true
  } catch (err) {
    console.error(err)
    showConfirm.value = false

    statusType.value = 'error'
    statusTitle.value = 'Gagal'
    statusMessage.value = err?.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
    showStatus.value = true
  } finally {
    loadingConfirm.value = false
    pendingRow.value = null
  }
}

const divisi = ref({
  id: null,
  name: '',
  event: null,
  members: [],
})

const anggota = ref([])

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
