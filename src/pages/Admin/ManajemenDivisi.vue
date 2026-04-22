<template>
  <q-page class="q-pa-xl">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Manajemen Divisi" icon="fact_check" />
        <q-breadcrumbs-el label="Detail Divisi" />
      </q-breadcrumbs>
    </div>

    <div class="flex justify-end q-mb-md">
      <q-btn
        icon="edit"
        label="Edit Divisi"
        color="indigo-9"
        no-caps
        unelevated
        @click="dialogEditDivisi = true"
        style="border-radius: 16px"
      />
    </div>

    <!-- HEADER RAPAT -->
    <q-card class="q-pa-lg q-mb-xs bg-indigo-1" style="border-radius: 16px">
      <div class="row items-center justify-between">
        <div class="col-9">
          <div class="text-h6 text-weight-bold">Divisi Acara</div>
        </div>

        <div class="col-3">
          <q-chip color="orange" text-color="white"> Sedang Berlangsung </q-chip>
        </div>
      </div>

      <div class="q-mt-sm text-grey-7">Dibuat oleh, John Doe, 22 Februari 2025 12:00</div>
    </q-card>

    <div class="row q-col-gutter-md q-my-sm">
      <div class="col-6">
        <q-card class="q-pa-md text-center bg-indigo-1" style="border-radius: 12px">
          <div class="text-h5 text-weight-bold">2</div>
          <div class="text-grey-7">Koordinator Divisi</div>
        </q-card>
      </div>

      <div class="col-6">
        <q-card class="q-pa-md text-center bg-green-1" style="border-radius: 12px">
          <div class="text-h5 text-weight-bold">5</div>
          <div class="text-grey-7">Anggota</div>
        </q-card>
      </div>
    </div>

    <!-- TABEL ABSENSI -->
    <div class="flex justify-between q-mt-lg">
      <div class="col-6">
        <q-input
          outlined
          dense
          placeholder="Cari acara..."
          style="border-radius: 12px"
          class="custom-field-search"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div>
        <q-btn
          icon="add"
          label="Tambah Anggota"
          color="indigo-9"
          no-caps
          @click="dialogTambahAnggota = true"
          unelevated
          style="border-radius: 16px"
        />
      </div>
    </div>
    <div style="border-radius: 16px" class="q-pa-md">
      <div class="text-h6 text-weight-bold">Daftar Anggota Divisi</div>

      <q-table :rows="rows" :columns="columns" row-key="id" flat>
        <template v-slot:body-cell-action="">
          <q-td align="center">
            <q-btn
              dense
              flat
              icon="edit"
              color="indigo-9"
              @click="dialogEditAnggota = true"
            />
          </q-td>
        </template>
        <template v-slot:body-cell-actionDelete="props">
          <q-td align="center">
            <q-btn dense flat icon="delete" color="red-7" @click="lihatDetailDivisi(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
    <EditDivisi v-model="dialogEditDivisi"/>
    <TambahAnggota v-model="dialogTambahAnggota"/>
    <EditAnggota v-model="dialogEditAnggota"/>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import EditDivisi from 'src/components/Admin/ManajemenDivisi/ModalEditDivisi.vue'
import TambahAnggota from 'src/components/Admin/ManajemenDivisi/ModalTambahAnggota.vue'
import EditAnggota from 'src/components/Admin/ManajemenDivisi/ModalEditAnggota.vue'

const dialogEditDivisi = ref(false)
const dialogTambahAnggota = ref(false)
const dialogEditAnggota = ref(false)
const columns = [
  {
    name: 'nama',
    label: 'Nama',
    field: 'nama',
    align: 'left',
    sortable: true,
  },
  {
    name: 'posisi',
    label: 'Posisi',
    field: 'posisi',
    align: 'left',
  },

  {
    name: 'actionDelete',

    align: 'center',
    field: 'actionDelete',
  },
  {
    name: 'action',

    align: 'center',
    field: 'action',
  },
]

const rows = ref([
  {
    id: 1,
    nama: 'Ahmad Panitia',
    posisi: 'Koordinator',
    status: 'Hadir',
  },
  {
    id: 2,
    nama: 'Budi Santoso',
    posisi: 'Anggota',
    status: 'Izin',
  },
  {
    id: 3,
    nama: 'Siti Rahma',
    posisi: 'Anggota',
    status: 'Absen',
  },
])
</script>

<style>
.custom-field-search {
  border-radius: 20px;
  min-width: 400px;
}

.custom-field-search .q-field__control {
  border-radius: 20px;
}
</style>
