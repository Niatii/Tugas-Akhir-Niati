<template>
  <q-page class="q-pa-lg">
    <!-- HEADER -->
    <div class="row items-center justify-between">
      <div>
        <div class="text-h5 text-weight-bold">Manajemen Acara</div>
        <div class="text-grey-7">Kelola semua acara organisasi di sini</div>
      </div>
    </div>

    <!-- SEARCH -->
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
          icon="filter_list"
          label="Filter"
          class="text-indigo-9 q-mx-sm"
          no-caps
          outline
          unelevated
          style="border-radius: 16px"
        />
        <q-btn
          icon="add"
          label="Tambah Acara"
          color="indigo-9"
          no-caps
          unelevated
          to="/admin/tambah-acara"
          style="border-radius: 16px"
        />
      </div>
    </div>

    <!-- LIST ACARA -->
    <div class="q-mt-lg">
      <q-card class="q-pa-sm" style="border-radius: 16px">
        <q-card-section>
          <!-- Header -->
          <div class="row items-start justify-between">
            <div>
              <div class="text-h6 text-weight-bold">HMTI Fair</div>

              <div class="row items-center text-grey-7 q-mt-xs">
                <q-icon name="groups" size="18px" class="q-mr-xs" />
                Himpunan Mahasiswa Teknik Informatika
              </div>
            </div>

            <q-chip dense color="orange-5" text-color="white" icon="check_circle"> Selesai </q-chip>
          </div>

          <!-- Tanggal -->
          <div class="row items-center q-mt-md">
            <q-icon name="event" size="18px" class="q-mr-sm" />
            28 Januari 2024 - 30 Januari 2024
          </div>
        </q-card-section>

        <q-separator />

        <!-- Action -->
        <q-card-actions align="right">
          <div class="flex justify-between">
            <q-btn
              icon="delete"
              label="Hapus"
              class="text-red-7 q-mx-sm"
              no-caps
              outline
              unelevated
              style="min-width: 150px; border-radius: 16px"
            />
            <q-btn
              class="bg-indigo-9 text-white"
              label="Detail"
              icon="open_in_new"
              no-caps
              to="/Admin/detail-acara-saya"
              style="min-width: 150px; border-radius: 16px"
            />
          </div>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup></script>

<style>
.custom-field-search {
  border-radius: 20px;
  min-width: 400px;
}

.custom-field-search .q-field__control {
  border-radius: 20px;
}
</style>
