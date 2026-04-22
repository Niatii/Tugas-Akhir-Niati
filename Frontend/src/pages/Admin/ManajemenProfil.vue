<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- HEADER -->
    <div class="row items-center justify-between q-mb-lg motion-card">
      <div>
        <div class="text-h5 text-weight-bold">Profil Organisasi</div>

        <div class="text-grey-7">
          Informasi identitas organisasi, kontak, dan pengaturan publik.
        </div>
      </div>

      <div class="q-gutter-sm">
        <q-btn
          color="indigo-9"
          icon="edit"
          label="Edit Profil"
          rounded
          no-caps
          class="motion-btn"
          @click="isEdit = !isEdit"
        />
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card">
          <div class="text-caption text-grey-7">Total Event</div>

          <div class="text-h5 text-weight-bold">24</div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-green-1">
          <div class="text-caption text-grey-7">Sertifikat Terbit</div>

          <div class="text-h5 text-weight-bold text-positive">520</div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-md motion-card bg-orange-1">
          <div class="text-caption text-grey-7">Tahun Berdiri</div>

          <div class="text-h5 text-weight-bold text-orange">2016</div>
        </q-card>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="row q-col-gutter-lg">
      <!-- LEFT -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-card q-pa-lg text-center motion-card">
          <q-avatar size="120px" class="q-mb-md">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>

          <div class="text-h6 text-weight-bold">Himpunan Teknik Informatika</div>

          <div class="text-grey-7 q-mt-xs">Fakultas Teknik</div>

          <q-separator class="q-my-md" />

          <div class="text-left">
            <div class="q-mb-sm">
              <q-icon name="email" class="q-mr-sm" />
              hmti@kampus.ac.id
            </div>

            <div class="q-mb-sm">
              <q-icon name="phone" class="q-mr-sm" />
              0812-3456-7890
            </div>

            <div>
              <q-icon name="place" class="q-mr-sm" />
              Gedung A Lt.2
            </div>
          </div>
        </q-card>
      </div>

      <!-- RIGHT -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-card motion-card">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Informasi Organisasi</div>

            <div class="text-caption text-grey-7">Kelola data publik organisasi.</div>
          </q-card-section>

          <q-separator />

          <!-- VIEW MODE -->
          <q-card-section v-if="!isEdit">
            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Nama Organisasi</div>

              <div class="text-weight-medium">
                {{ form.name }}
              </div>
            </div>

            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Deskripsi</div>

              <div class="text-weight-medium">
                {{ form.description }}
              </div>
            </div>

            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Instagram</div>

              <div class="text-weight-medium">
                {{ form.instagram }}
              </div>
            </div>

            <div>
              <div class="text-caption text-grey-7">Website</div>

              <div class="text-weight-medium">
                {{ form.website }}
              </div>
            </div>
          </q-card-section>

          <!-- EDIT MODE -->
          <q-card-section v-else>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input v-model="form.name" outlined dense rounded label="Nama Organisasi" />
              </div>

              <div class="col-12">
                <q-input
                  v-model="form.description"
                  type="textarea"
                  autogrow
                  outlined
                  rounded
                  label="Deskripsi"
                />
              </div>

              <div class="col-12 col-md-6">
                <q-input v-model="form.instagram" outlined dense rounded label="Instagram" />
              </div>

              <div class="col-12 col-md-6">
                <q-input v-model="form.website" outlined dense rounded label="Website" />
              </div>
            </div>

            <div class="text-right q-mt-md">
              <q-btn flat label="Batal" no-caps class="q-mr-sm" @click="isEdit = false" />

              <q-btn
                color="indigo-9"
                label="Simpan"
                rounded
                no-caps
                class="motion-btn"
                @click="saveProfile"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
     <FooterComponent />
  </q-page>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import FooterComponent from 'src/components/FooterComponent.vue'
import { animate, stagger } from 'motion'

const isEdit = ref(false)

const form = ref({
  name: 'Himpunan Teknik Informatika',

  description:
    'Organisasi mahasiswa yang berfokus pada pengembangan akademik, kepemimpinan, dan kegiatan kemahasiswaan.',

  instagram: '@hmti_kampus',

  website: 'https://hmti.kampus.ac.id',
})

const saveProfile = () => {
  isEdit.value = false
}

/* Motion */
onMounted(async () => {
  await nextTick()

  animate(
    '.motion-card',
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: stagger(0.05),
      duration: 0.35,
      easing: 'ease-out',
    },
  )
})
</script>

<style scoped>
.rounded-card {
  border-radius: 18px;
}

.motion-btn {
  transition: all 0.18s ease;
}
</style>
