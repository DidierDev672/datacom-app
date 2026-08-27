<template>
  <q-page class="q-pa-md" style="max-width: 960px; margin: 0 auto;">
    <header class="srv-header">
      <div class="srv-header-container">
        <div class="srv-header-box">
          <div class="text-h5 text-weight-bold">Solicitud de alojamiento</div>
          <div class="text-caption q-mt-xs">
            Registro de requisición de transporte y viaje. Al guardar se genera un código único (SRV-…) y la solicitud queda en estado
            <strong> Revisión</strong>.
          </div>
        </div>
        <q-btn
          outline
          no-caps
          color="white"
          icon="format_list_bulleted"
          label="Ver listado"
          :to="{ name: 'lista-solicitud-requerimiento-viaje' }"
        />
      </div>
    </header>

    <SolicitudRequerimientoViajeForm />
  </q-page>
</template>

<script>
import SolicitudRequerimientoViajeForm from '../components/SolicitudRequerimientoViajeForm.vue';

export default {
  name: 'SolicitudRequerimientoViajeView',

  components: {
    SolicitudRequerimientoViajeForm
  }
};
</script>

<style scoped>
/* Header con gradiente lineal verde cromático */
.srv-header {
  background: linear-gradient(135deg, #14532d 0%, #16a34a 50%, #4ade80 100%);
  color: #ffffff;
  border-radius: 14px;
  padding: 28px 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.35);
  /* Slide-in: entra deslizándose desde la izquierda */
  animation: slide-in-left 0.6s ease-out;
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.srv-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.srv-header-box {
  min-width: 0;
  padding: 6px 14px;
  border-left: 4px solid rgba(255, 255, 255, 0.65);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
}

.srv-header-box .text-h5 {
  color: #ffffff;
}

.srv-header-box .text-caption {
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 600px) {
  .srv-header-container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
