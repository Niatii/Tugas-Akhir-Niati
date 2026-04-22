<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- NAVBAR -->
    <q-header elevated class="text-black q-pa-sm" style="height: 70px; background-color: white">
      <q-toolbar class="justify-between">
        <!-- JUDUL APLIKASI -->
        <div class="flex items-center">
          <q-avatar size="40px" class="bg-white q-mr-sm">
            <img src="~assets/image/Logo.jpg" />
          </q-avatar>
          <div class="text-h6 text-weight-bold">EVOMA</div>
        </div>

        <!-- MENU NAVBAR -->
        <q-tabs dense class="text-grey-8" active-color="indigo-9" indicator-color="indigo-9">
          <q-route-tab label="Beranda" to="/user/beranda" no-caps />
          <q-route-tab label="Daftar Acara" to="/user/daftar-acara" no-caps />
          <q-route-tab label="Acara Saya" to="/user/acara-saya" no-caps />
          <q-route-tab label="Kalender" to="/user/acara-saya" no-caps />
        </q-tabs>

        <!-- NOTIFIKASI & PROFIL -->
        <div class="flex items-center q-gutter-md">
          <div class="cursor-pointer" @click="$router.push('/user/notifikasi')">
            <q-icon name="notifications" color="indigo-9" size="25px" class="cursor-pointer" />
          </div>

          <q-btn flat no-caps class="user-menu-btn">
            <div class="row items-center no-wrap">
              <!-- AVATAR -->
              <q-avatar size="36px" class="q-mr-sm">
                <img src="~assets/image/Logo.jpg" />
              </q-avatar>

              <!-- USER INFO -->
              <div class="column items-start">
                <div class="text-weight-bold text-dark">William James Moriarty</div>
              </div>

              <q-icon name="arrow_drop_down" size="20px" color="grey-7" class="q-ml-sm" />
            </div>

            <!-- DROPDOWN MENU -->
            <q-menu style="border-radius: 12px">
              <q-list style="min-width: 200px">
                <!-- PROFIL -->
                <q-item clickable v-close-popup to="/user/profil-saya">
                  <q-item-section avatar>
                    <q-icon name="account_circle" color="indigo-9" />
                  </q-item-section>
                  <q-item-section class="text-weight-medium"> Profil Saya </q-item-section>
                </q-item>

                <q-separator />

                <!-- LOGOUT -->
                <q-item clickable v-close-popup to="/auth/Login">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>

                  <q-item-section class="text-negative"> Keluar </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
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
