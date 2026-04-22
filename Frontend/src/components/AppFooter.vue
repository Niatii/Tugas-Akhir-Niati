<template>
  <q-footer class="bg-white q-py-sm">
    <div class="text-center text-caption text-grey-7">
      © {{ year }} — Developed by
      <span class="text-indigo-10 text-weight-medium">Niati</span>
    </div>
  </q-footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
