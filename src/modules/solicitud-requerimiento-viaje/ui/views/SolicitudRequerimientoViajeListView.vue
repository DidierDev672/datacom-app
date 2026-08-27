<template>
  <q-page class="srv-lista-page q-pa-md">
    <!-- Patrón Z: título y contexto (arriba-izquierda) → acción primaria (arriba-derecha) → cuerpo inferior -->
    <header class="srv-lista-page__header">
      <div class="srv-lista-page__contenedor">
        <div class="srv-lista-page__caja">
          <div class="text-h5 text-weight-bold srv-lista-page__titulo">
            Solicitudes de alojamiento (viaje)
          </div>
        </div>
        <q-btn
          outline
          no-caps
          color="white"
          icon="add"
          label="Nueva solicitud"
          class="srv-lista-page__accion"
          style="min-width: 200px"
          :to="{ name: 'crear-solicitud-requerimiento-viaje' }"
        />
      </div>
    </header>

    <section class="srv-lista-page__cuerpo q-mt-md">
      <Transition name="fade" appear>
        <SolicitudRequerimientoViajeLista />
      </Transition>
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

.srv-lista-page__header {
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

.srv-lista-page__contenedor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.srv-lista-page__caja {
  min-width: 0;
  padding: 6px 14px;
  border-left: 4px solid rgba(255, 255, 255, 0.65);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
}

.srv-lista-page__titulo {
  color: #ffffff;
  line-height: 1.25;
}

@media (max-width: 600px) {
  .srv-lista-page__contenedor {
    flex-direction: column;
    align-items: stretch;
  }

  .srv-lista-page__accion {
    width: 100%;
  }
}

/* Fade in: aparición gradual de la tabla */
.fade-enter-active {
  transition: opacity 0.6s ease;
}

.fade-enter {
  opacity: 0;
}
</style>
