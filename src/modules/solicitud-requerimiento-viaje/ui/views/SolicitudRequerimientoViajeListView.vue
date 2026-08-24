<template>
  <q-page class="srv-lista-page q-pa-md">
    <!-- Patrón Z: título y contexto (arriba-izquierda) → acción primaria (arriba-derecha) → cuerpo inferior -->
    <header class="srv-lista-page__zona-superior">
      <div class="row q-col-gutter-sm items-start">
        <div class="col-12 col-md">
          <div
            class="text-h5 text-weight-bold text-dark srv-lista-page__titulo"
          >
            Solicitudes de requerimiento (viaje)
          </div>
        </div>
        <div class="col-12 col-md-auto row justify-center items-center">
          <q-btn
            outline
            no-caps
            color="primary"
            icon="add"
            label="Nueva solicitud"
            class="full-width srv-lista-page__accion"
            style="min-width: 200px"
            :to="{ name: 'crear-solicitud-requerimiento-viaje' }"
          />
        </div>
      </div>
      <q-separator class="srv-lista-page__linea q-mt-md" />
    </header>

    <section class="srv-lista-page__cuerpo q-mt-md">
      <SolicitudRequerimientoViajeLista />
    </section>
  </q-page>
</template>

<script>
import SolicitudRequerimientoViajeLista from "../components/SolicitudRequerimientoViajeLista.vue";

export default {
  name: "SolicitudRequerimientoViajeListView",

  components: {
    SolicitudRequerimientoViajeLista,
  },
};
</script>

<style scoped>
.srv-lista-page {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.srv-lista-page__titulo {
  line-height: 1.25;
}

.srv-lista-page__contexto {
  max-width: 640px;
  line-height: 1.45;
}

.srv-lista-page__linea {
  border-color: rgba(15, 23, 42, 0.08);
}
</style>
