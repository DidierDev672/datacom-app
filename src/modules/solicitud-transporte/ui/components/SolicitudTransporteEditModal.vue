<template>
  <q-dialog v-model="show" persistent full-width>
    <q-card class="premium-edit-card reveal-animation">
      <!-- HEADER -->
      <q-card-section class="row items-center header-section">
        <div class="row items-center q-gutter-md">
          <div class="icon-box-edit">
            <q-icon name="edit_note" size="32px" class="text-accent-gradient" />
          </div>
          <div>
            <div class="text-caption text-grey-7 text-uppercase letter-spacing-1">Modificar Solicitud</div>
            <h2 class="main-title q-my-none">
              {{ store.solicitudActual && store.solicitudActual.codigo ? store.solicitudActual.codigo : 'Editando solicitud' }}
            </h2>
          </div>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" @click="handleClose" />
      </q-card-section>

      <q-separator />

      <!-- FORM CONTENT -->
      <q-card-section class="q-pa-none">
        <SolicitudForm @success="onSuccess" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import SolicitudForm from './SolicitudForm.vue';
import { useSolicitudTransporteStore } from '../../store/solicitudTransporte.store';

export default {
  name: 'SolicitudTransporteEditModal',
  components: {
    SolicitudForm
  },
  props: {
    value: Boolean
  },
  setup(props, { emit }) {
    const store = useSolicitudTransporteStore();

    const onSuccess = () => {
      emit('saved');
      emit('input', false);
    };

    const handleClose = () => {
      store.resetSolicitudActual();
    };

    return {
      store,
      onSuccess,
      handleClose
    };
  },
  computed: {
    show: {
      get() { return this.value; },
      set(val) { this.$emit('input', val); }
    }
  }
}
</script>

<style scoped>
.premium-edit-card {
  max-width: 1200px !important;
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  background: white;
}

.header-section {
  padding: 24px 40px;
  background: white;
}

.icon-box-edit {
  background: #fef2f2;
  padding: 12px;
  border-radius: 16px;
}

.text-accent-gradient {
  background: linear-gradient(135deg, #f43f5e, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.letter-spacing-1 {
  letter-spacing: 0.1em;
}

.reveal-animation {
  animation: modalReveal 0.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes modalReveal {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Override SolicitudForm internal margins if needed */
:deep(.solicitud-form-container) {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 20px 40px 40px 40px !important;
}

:deep(.sta-stepper) {
  box-shadow: none !important;
  border: none !important;
}
</style>
