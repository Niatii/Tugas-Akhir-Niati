<template>
  <q-dialog v-model="model">
    <q-card class="q-pa-md" style="min-width: 700px; border-radius: 16px">
      <q-card-section class="flex justify-between">
        <div class="text-subtitle1 text-bold">Edit Divisi</div>
        <q-icon size="28px" name="close" v-close-popup />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-my-xs">Nama Divisi <span class="text-red-7">*</span></div>
        <q-input
          v-model="divisi"
          dense
          borderless
          class="custom-input q-px-md q-mb-md"
          :label="divisi ? undefined : 'Masukkan Nama Divisi'"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Batal" no-caps v-close-popup class="text-indigo-9" />
        <q-btn
          color="indigo-9"
          label="Simpan"
          no-caps
          style="border-radius: 16px; min-width: 150px"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from 'vue'

const model = ref(false)
const divisi = ref('')
</script>
<style>
/* Input rounded besar */
.custom-input {
  background: rgb(209, 229, 249);
  border-radius: 30px;
}
</style>
