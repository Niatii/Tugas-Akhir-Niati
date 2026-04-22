<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- NAVBAR -->
    <q-header elevated class="text-black q-pa-sm" style="height: 70px; background-color: white">
      <q-toolbar class="justify-between">
        <!-- NAMA APLIKASI -->
        <div class="flex items-center">
          <q-avatar size="40px" class="bg-white q-mr-sm">
            <img src="~assets/image/Logo.jpg" />
          </q-avatar>
          <div class="text-h6 text-weight-bold">EVOMA</div>
        </div>

        <!-- BUTTON -->
        <div class="row items-center q-gutter-sm q-px-lg">
          <q-btn
            unelevated
            rounded
            no-caps
            label="Masuk"
            icon="login"
            class="bg-indigo-9 text-white q-px-lg"
            to="/auth/Login"
          />
          <q-btn label="Daftar" rounded no-caps class="text-indigo-9 q-px-lg" outline color="indigo-9" to="/auth/register" />
        </div>
      </q-toolbar>
    </q-header>
  </q-layout>
</template>
<script setup></script>
<style scoped>
.q-tab--active {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 18px;
}

.q-tab {
  transition: all 0.2s ease;
}

.q-tab:hover {
  transform: translateY(-2px);
}
</style>
