<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row q-mb-xl items-center">
      <div class="col">
        <h1 class="sta-title q-my-none">Nueva Solicitud de Transporte Aéreo</h1>
        <p class="text-subtitle1 text-grey-7 q-my-none">Gestión de tiquetes y traslados para personal</p>
      </div>
    </div>

    <div class="row justify-center">
      <div style="width: 100%">
        <SolicitudForm @success="onSuccess" />
      </div>
    </div>

    <!-- Alerta de Error -->
    <q-dialog v-model="showError">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-weight-bold">Error en la solicitud</span>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ store.error }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { ref, watch } from '@vue/composition-api';
import { useSolicitudTransporteStore } from '../../store/solicitudTransporte.store';
import SolicitudForm from '../components/SolicitudForm.vue';

export default {
  name: 'SolicitudCreateView',
  components: {
    SolicitudForm
  },
  setup(props, { root }) {
    const store = useSolicitudTransporteStore();
    const showError = ref(false);

    watch(() => store.error, (newVal) => {
      if (newVal) showError.value = true;
    });

    const onSuccess = (data) => {
      root.$q.notify({
        message: 'Solicitud enviada exitosamente',
        color: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      });
      // Redirigir al listado tras éxito
      root.$router.push({ name: 'lista-solicitudes-transporte' });
    };

    // Resetear store al entrar
    store.resetSolicitudActual();

    return {
      store,
      showError,
      onSuccess
    };
  }
}
</script>

<style scoped>
.sta-title {
  font-size: var(--text-titulo);
  font-weight: 700;
  color: #0f172a;
}
</style>
