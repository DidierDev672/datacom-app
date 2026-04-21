<template>
  <div class="q-pa-lg bg-grey-2" style="min-height: 100vh;">
    <div class="full-width q-gutter-y-lg animate-in">
      <!-- Back Link -->
      <q-btn 
        flat 
        dense 
        no-caps
        color="grey-7"
        @click="$router.push({ name: 'lista-solicitudes-terrestre' })"
        class="text-weight-bold"
      >
        <q-icon left name="arrow_back" size="20px" class="q-mr-sm" />
        Volver al listado
      </q-btn>

      <!-- Header -->
      <div class="row justify-between items-end q-col-gutter-md q-pb-sm">
        <div class="col-12 col-md-auto">
          <q-badge 
            rounded 
            color="blue-1" 
            text-color="blue-7" 
            label="Formulario FOD-T-023"
            class="q-px-md q-py-xs text-weight-bolder q-mb-md"
            style="letter-spacing: 0.1em; font-size: 10px;"
          />
          <h1 class="text-h4 text-weight-bolder text-dark q-my-none" style="letter-spacing: -0.02em;">Nueva Solicitud</h1>
          <p class="text-grey-7 q-mt-sm text-weight-medium">Complete los siguientes pasos para formalizar su requerimiento de transporte.</p>
        </div>
        <div class="col-12 col-md-auto text-right gt-sm">
          <p class="text-caption text-weight-bold text-grey-6 text-uppercase q-mb-none" style="letter-spacing: 0.1em;">Estado Actual</p>
          <p class="text-h6 text-weight-bolder text-dark q-mb-none">BORRADOR</p>
        </div>
      </div>

      <!-- Main Form -->
      <SolicitudTerrestreForm @success="handleSuccess" />

      <!-- Footer Info -->
      <div class="row justify-center items-center q-gutter-x-xl q-py-xl text-grey-4">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="lock" size="18px" />
          <span class="text-caption text-weight-bold">Conexión Segura SSL</span>
        </div>
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="verified_user" size="18px" />
          <span class="text-caption text-weight-bold">Protección de Datos</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SolicitudTerrestreForm from '../components/SolicitudTerrestreForm.vue';
import { useSolicitudTerrestreStore } from '../../application/solicitudTerrestre.store.js';

export default {
  name: 'SolicitudTerrestreCreateView',
  components: { SolicitudTerrestreForm },
  
  data() {
    return {
      store: useSolicitudTerrestreStore()
    };
  },
  
  mounted() {
    this.store.resetSolicitudActual();
  },
  
  methods: {
    handleSuccess(data) {
      this.$q.notify({
        message: 'Solicitud guardada exitosamente en modo BORRADOR',
        color: 'positive',
        textColor: 'white',
        icon: 'check_circle',
        position: 'top',
        timeout: 3000
      });
      
      this.$router.push({ name: 'lista-solicitudes-terrestre' });
    }
  }
};
</script>

<style scoped>
@keyframes in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: in 0.6s ease-out forwards;
}
</style>
