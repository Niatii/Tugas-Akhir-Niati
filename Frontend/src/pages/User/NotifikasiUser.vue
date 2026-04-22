<template>
  <q-page class="q-pa-xl flex justify-center bg-indigo-1">
    <div style="width: 900px; max-width: 100%">
      <!-- HEADER -->
      <div class="row items-center justify-between q-mb-md">
        <div>
          <div class="text-h5 text-weight-bold">Notifikasi</div>
          <div class="text-grey-7">Informasi terbaru terkait acara dan tugas Anda</div>
        </div>

        <q-btn
          flat
          icon="done_all"
          label="Tandai semua sudah dibaca"
          class="text-indigo-9"
          no-caps
        />
      </div>

      <!-- LIST NOTIFIKASI -->
      <div>
        <!-- NOTIFIKASI BARU -->
        <div class="notif-card notif-new">
          <div class="row items-start">
            <q-icon name="campaign" size="20px" class="notif-icon q-mr-sm" />

            <div class="col">
              <div class="text-subtitle2 text-weight-bold">Pengumuman Baru</div>

              <div class="notif-message">
                Rapat panitia HMTI Fair akan dilaksanakan besok pukul 19.00.
              </div>

              <div class="notif-time">5 menit yang lalu</div>
            </div>
          </div>
        </div>

        <!-- NOTIFIKASI TUGAS -->
        <div class="notif-card notif-new">
          <div class="row items-start">
            <q-icon name="task" size="20px" class="notif-icon q-mr-sm" />

            <div class="col">
              <div class="text-subtitle2 text-weight-bold">Tugas Baru</div>

              <div class="notif-message">Anda mendapat tugas baru pada acara HMTI Fair.</div>

              <div class="notif-time">20 menit yang lalu</div>
            </div>
          </div>
        </div>

        <!-- NOTIFIKASI LAMA -->
        <div class="notif-card">
          <div class="row items-start">
            <q-icon name="event" size="20px" class="notif-icon q-mr-sm" />

            <div class="col">
              <div class="text-subtitle2 text-weight-bold">Update Acara</div>

              <div class="notif-message">Jadwal acara HMTI Fair telah diperbarui.</div>

              <div class="notif-time">Kemarin</div>
            </div>
          </div>
        </div>

        <!-- NOTIFIKASI LAMA -->
        <div class="notif-card">
          <div class="row items-start">
            <q-icon name="event" size="20px" class="notif-icon q-mr-sm" />

            <div class="col">
              <div class="text-subtitle2 text-weight-bold">Update Acara</div>

              <div class="notif-message">Jadwal acara HMTI Fair telah diperbarui.</div>

              <div class="notif-time">Kemarin</div>
            </div>
          </div>
        </div>

        <!-- NOTIFIKASI LAMA -->
        <div class="notif-card">
          <div class="row items-start">
            <q-icon name="event" size="20px" class="notif-icon q-mr-sm" />

            <div class="col">
              <div class="text-subtitle2 text-weight-bold">Update Acara</div>

              <div class="notif-message">Jadwal acara HMTI Fair telah diperbarui.</div>

              <div class="notif-time">Kemarin</div>
            </div>
          </div>
        </div>
        <!-- NOTIFIKASI LAMA -->
        <div class="notif-card">
          <div class="row items-start">
            <q-icon name="event" size="20px" class="notif-icon q-mr-sm" />

            <div class="col">
              <div class="text-subtitle2 text-weight-bold">Update Acara</div>

              <div class="notif-message">Jadwal acara HMTI Fair telah diperbarui.</div>

              <div class="notif-time">Kemarin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup></script>
<style>
.notif-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #eef2f7;
  transition: all 0.25s ease;
  cursor: pointer;
}

.notif-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.notif-new {
  border-left: 4px solid #3949ab;
  background: #f8f9ff;
}

.notif-icon {
  color: #3949ab;
}

.notif-message {
  font-size: 13px;
  color: #555;
  margin-top: 3px;
}

.notif-time {
  font-size: 11px;
  color: #9aa0a6;
  margin-top: 5px;
}
</style>
