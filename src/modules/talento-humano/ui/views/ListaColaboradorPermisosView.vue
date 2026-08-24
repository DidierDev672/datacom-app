<template>
  <q-page class="q-pa-md permisos-page">
    <div class="permisos-page__container">
      <ColaboradorPermisosList
        ref="permisosListRef"
        @edit="onEditar"
        @deleted="onEliminado"
      />
    </div>
  </q-page>
</template>

<script>
import ColaboradorPermisosList from '../components/ColaboradorPermisosList.vue';
import { talentoHumanoRouteNames } from '../utils/talentoHumanoRoutes';

const PERMISO_EDIT_STORAGE_KEY = 'colaboradorPermisoEditRecord';

export default {
  name: 'ListaColaboradorPermisosView',

  components: {
    ColaboradorPermisosList
  },

  methods: {
    onEliminado () {
      // La lista ya se recarga internamente.
    },

    onEditar (record) {
      try {
        window.sessionStorage.setItem(
          PERMISO_EDIT_STORAGE_KEY,
          JSON.stringify(record)
        );
      } catch (e) {
        // ignore storage errors
      }
      this.$router.push({
        name: talentoHumanoRouteNames(this.$route).colaboradorPermisosCreate
      });
    }
  }
};
</script>

<style scoped>
.permisos-page {
  background: #f8fafc;
}

.permisos-page__container {
  max-width: 960px;
  margin: 0 auto;
}
</style>
