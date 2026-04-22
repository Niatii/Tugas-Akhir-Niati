<template>
  <q-page class="q-pa-xl">
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs class="text-brown">
        <template v-slot:separator>
          <q-icon size="1.5em" name="chevron_right" color="indigo-9" />
        </template>

        <q-breadcrumbs-el label="Absensi" icon="fact_check" />
        <q-breadcrumbs-el label="Detail Absensi" />
      </q-breadcrumbs>
    </div>

    <!-- HEADER RAaPAT -->
    <q-card class="q-pa-lg q-mb-xs bg-indigo-1" style="border-radius: 16px">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h6 text-weight-bold">Rapat Divisi Acara - Pembahasan Rundown</div>

          <div class="text-grey-7">12 Februari 2026 | 19.00 - 21.00</div>
        </div>

        <q-chip color="orange" text-color="white"> Sedang Berlangsung </q-chip>
      </div>

      <div class="q-mt-sm text-grey-7">Lokasi : Zoom Meeting</div>
    </q-card>

    <div class="row q-col-gutter-md q-my-sm">
      <div class="col-4">
        <q-card class="q-pa-md text-center bg-indigo-1" style="border-radius: 12px">
          <div class="text-h5 text-weight-bold">2</div>
          <div class="text-grey-7">Hadir</div>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="q-pa-md text-center bg-green-1" style="border-radius: 12px">
          <div class="text-h5 text-weight-bold">5</div>
          <div class="text-grey-7">Izin</div>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="q-pa-md text-center bg-orange-1" style="border-radius: 12px">
          <div class="text-h5 text-weight-bold">3</div>
          <div class="text-grey-7">Absen</div>
        </q-card>
      </div>
    </div>
    <div class="row justify-end q-mt-lg">
      <q-btn color="indigo-9" icon="download" label="Export Data" no-caps style="border-radius:16px"/>
    </div>

    <!-- TABEL ABSENSI -->
    <div style="border-radius: 16px" class="q-pa-md">
      <div class="text-h6 text-weight-bold">Daftar Absensi Panitia</div>

      <q-table :rows="rows" :columns="columns" row-key="id" flat>
        <!-- STATUS ABSENSI -->
        <template v-slot:body-cell-status="props">
          <q-td align="center">
            <q-select
              dense
              outlined
              v-model="props.row.status"
              :options="statusOptions"
              style="width: 150px"
            />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'

const statusOptions = ['Hadir', 'Izin', 'Absen']

const columns = [
  {
    name: 'nama',
    label: 'Nama Panitia',
    field: 'nama',
    align: 'left',
    sortable: true,
  },
  {
    name: 'divisi',
    label: 'Divisi',
    field: 'divisi',
    align: 'left',
  },
  {
    name: 'status',
    label: 'Status Kehadiran',
    field: 'status',
    align: 'center',
  },
]

const rows = ref([
  {
    id: 1,
    nama: 'Ahmad Panitia',
    divisi: 'Divisi Acara',
    status: 'Hadir',
  },
  {
    id: 2,
    nama: 'Budi Santoso',
    divisi: 'Divisi Publikasi',
    status: 'Izin',
  },
  {
    id: 3,
    nama: 'Siti Rahma',
    divisi: 'Divisi Konsumsi',
    status: 'Absen',
  },
])
</script>
