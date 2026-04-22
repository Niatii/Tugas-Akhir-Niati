const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'register2',
        component: () => import('pages/RegisterPage2.vue'),
      },
      {
        path: 'lupa-kata-sandi',
        component: () => import('pages/LupaKataSandi.vue'),
      },
    ],
  },

  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LandingPage.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      {
        path: 'beranda',
        component: () => import('pages/User/BerandaPanitia.vue'),
      },
      {
        path: 'daftar-acara',
        component: () => import('pages/User/DaftarAcara.vue'),
      },
      {
        path: 'detail-acara',
        component: () => import('pages/User/DetailAcara.vue'),
      },
      {
        path: 'formulir-pendaftaran',
        component: () => import('pages/User/FormulirPendaftaran.vue'),
      },
      {
        path: 'acara-saya',
        component: () => import('pages/User/AcaraSaya.vue'),
      },
      {
        path: 'profil-saya',
        component: () => import('pages/User/ProfilSaya.vue'),
      },
      {
        path: 'notifikasi',
        component: () => import('pages/User/NotifikasiUser.vue'),
      },
      {
        path: 'detail-acara-saya',
        component: () => import('pages/User/DetailAcaraSaya.vue'),
      },
    ],
  },
  {
    path: '/koordinator',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      {
        path: 'detail-acara-saya',
        component: () => import('pages/Koordinator/DetailAcaraSaya.vue'),
      },
      {
        path: 'detail-absensi',
        component: () => import('pages/Koordinator/DetailAbsensi.vue'),
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'beranda',
        component: () => import('pages/Admin/BerandaAdmin.vue'),
      },

      {
        path: 'acara',
        component: () => import('pages/Admin/ManajemenAcara.vue'),
        children: [
          
        ],
      },

      // SUB-MANAJEMEN ACARA
      // Detail Acara, Edit Acara, Preview Acara
      {
        path: 'detail',
        component: () => import('pages/Admin//DetailAcara/KelolaDetail.vue'),
      },
      {
        path: 'edit-acara',
        component: () => import('pages/Admin/DetailAcara/EditAcara.vue'),
      },
      {
        path: 'preview-acara',
        component: () => import('pages/Admin/DetailAcara/PreviewAcara.vue'),
      },
      {
        path: 'tambah-acara',
        component: () => import('pages/Admin/DetailAcara/TambahAcara.vue'),
      },

      // Kelola Peserta Acara
      {
        path: 'peserta',
        component: () => import('pages/Admin/PesertaAcara/KelolaPeserta.vue'),
      },
      {
        path: 'detail-peserta',
        component: () => import('pages/Admin/PesertaAcara/DetailPeserta.vue'),
      },

      // Kelola Divisi
      {
        path: 'divisi',
        component: () => import('pages/Admin/DivisiAcara/KelolaDivisi.vue'),
      },
      {
        path: 'detail-divisi',
        component: () => import('pages/Admin/DivisiAcara/DetailDivisi.vue'),
      },

      // Kelola Rapat Acara
      {
        path: 'rapat',
        component: () => import('pages/Admin/RapatAcara/KelolaRapat.vue'),
      },
      {
        path: 'detail-rapat',
        component: () => import('pages/Admin/RapatAcara/DetailRapat.vue'),
      },
      {
        path: 'notulen-rapat',
        component: () => import('pages/Admin/RapatAcara/NotulenRapat.vue'),
      },
      {
        path: 'absensi-rapat',
        component: () => import('pages/Admin/RapatAcara/AbsensiRapat.vue'),
      },

      // Sertifikat Acara
      {
        path: 'sertifikat',
        component: () => import('pages/Admin/SertifikatAcara/KelolaSertifikat.vue'),
      },
      {
        path: 'detail-sertifikat',
        component: () => import('pages/Admin/SertifikatAcara/DetailKelolaSertifikat.vue'),
      },
      // End sub manajemen acara

      {
        path: 'profil',
        component: () => import('pages/Admin/ManajemenProfil.vue'),
      },
      {
        path: 'kalender',
        component: () => import('pages/Admin/KalenderAdmin.vue'),
      },
      {
        path: 'notifikasi',
        component: () => import('pages/Admin/NotifikasiAdmin.vue'),
      },
      // {
      //   path: 'tambah-acara',
      //   component: () => import('pages/Admin/TambahAcara.vue'),
      // },
      {
        path: 'detail-acara-saya',
        component: () => import('pages/Admin/DetailManajemenAcara.vue'),
      },
      {
        path: 'detail-divisi',
        component: () => import('pages/Admin/ManajemenDivisi.vue'),
      },
      {
        path: 'detail-absensi',
        component: () => import('pages/Admin/DetailAbsensi.vue'),
      },
      {
        path: 'detail-absensi-umum',
        component: () => import('pages/Admin/DetailAbsensiUmum.vue'),
      },
    ],
  },
]

export default routes
