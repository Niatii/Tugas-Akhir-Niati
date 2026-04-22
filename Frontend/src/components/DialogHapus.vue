<template>
  <q-dialog persistent>
    <q-card class="modern-dialog" style="border-radius: 32px; max-width: 400px">
      <!-- Simple Icon -->
      <q-card-section class="q-pt-xl flex flex-center">
        <div class="icon-circle">
          <q-icon name="delete_outline" color="negative" size="40px" />
        </div>
      </q-card-section>

      <!-- Simple Text -->
      <q-card-section class="text-center q-pt-md">
        <div class="text-h6 text-weight-bold">Konfirmasi Hapus</div>
        <div class="text-grey-7 q-mt-sm q-px-md">
          Apakah Anda yakin ingin menghapus rapat ini? Data yang sudah dihapus tidak dapat
          dikembalikan.
        </div>
      </q-card-section>

      <!-- Simple Buttons -->
      <q-card-actions class="q-px-lg q-pb-xl q-gutter-sm">
        <q-btn
          flat
          label="Batal"
          v-close-popup
          no-caps
          class="btn-outline"
          style="border-radius: 50px; padding: 12px; flex: 1"
        />
        <q-btn
          color="negative"
          label="Hapus"
          no-caps
          style="
            border-radius: 50px;
            padding: 12px;
            flex: 1;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          "
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.modern-dialog {
  animation: fadeIn 0.2s ease;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-outline {
  border: 1px solid #e2e8f0;
  background: white;
}

.btn-outline:hover {
  background: #f8fafc;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
