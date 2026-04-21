<template>
  <div class="q-pa-md">
    <div class="column q-gutter-md">
      <!-- Sección: Identificación -->
      <q-card flat bordered class="sta-revision-card">
        <q-card-section class="row items-center justify-between">
          <div class="sta-section-title">1. Identificación</div>
          <q-btn flat color="primary" label="Editar" @click="$emit('edit-step', 1)" dense />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-6"><span class="sta-label">Código:</span> {{ s.codigo }}</div>
          <div class="col-6"><span class="sta-label">Fecha:</span> {{ s.fecha }}</div>
          <div class="col-6"><span class="sta-label">Proyecto:</span> {{ s.proyecto }}</div>
          <div class="col-6"><span class="sta-label">Área:</span> {{ s.area }}</div>
          <div class="col-12"><span class="sta-label">Solicitante:</span> {{ s.solicitante }}</div>
        </q-card-section>
      </q-card>

      <!-- Sección: Viaje -->
      <q-card flat bordered class="sta-revision-card">
        <q-card-section class="row items-center justify-between">
          <div class="sta-section-title">2. Información del viaje</div>
          <q-btn flat color="primary" label="Editar" @click="$emit('edit-step', 2)" dense />
        </q-card-section>
        <q-separator />
        <q-card-section class="row q-col-gutter-sm">
          <div class="col-6"><span class="sta-label">De:</span> {{ s.viaje.ciudadOrigen }}</div>
          <div class="col-6"><span class="sta-label">Hacia:</span> {{ s.viaje.ciudadDestino }}</div>
          <div class="col-6"><span class="sta-label">Tipo:</span> {{ s.viaje.tipoViaje }}</div>
          <div class="col-6"><span class="sta-label">Salida:</span> {{ s.viaje.fechaSalida }}</div>
          <div class="col-6" v-if="s.viaje.fechaRegreso"><span class="sta-label">Regreso:</span> {{ s.viaje.fechaRegreso }}</div>
        </q-card-section>
      </q-card>

      <!-- Sección: Pasajeros -->
      <q-card flat bordered class="sta-revision-card">
        <q-card-section class="row items-center justify-between">
          <div class="sta-section-title">3. Pasajeros ({{ s.pasajeros.length }})</div>
          <q-btn flat color="primary" label="Editar" @click="$emit('edit-step', 3)" dense />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <q-list separator dense>
            <q-item v-for="p in s.pasajeros" :key="p.numeroPasajero">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ p.nombre }}</q-item-label>
                <q-item-label caption>{{ p.documento }} - {{ p.cargo }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="grey-3" text-color="grey-7" :label="'#' + p.numeroPasajero" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Sección: Preferencias & Justificación -->
      <q-card flat bordered class="sta-revision-card">
        <q-card-section class="row items-center justify-between">
          <div class="sta-section-title">4 & 5. Preferencias y Justificación</div>
          <q-btn flat color="primary" label="Editar" @click="$emit('edit-step', 5)" dense />
        </q-card-section>
        <q-separator />
        <q-card-section class="column q-gutter-xs">
          <div><span class="sta-label">Aerolínea:</span> {{ s.preferencias.aerolineaPreferida || 'Sin preferencia' }}</div>
          <div><span class="sta-label">Clase:</span> {{ s.preferencias.claseVuelo }}</div>
          <div class="q-mt-sm"><span class="sta-label block">Motivo:</span> {{ s.justificacion.motivoViaje }}</div>
          <div class="q-mt-sm"><span class="sta-label">Aprobado por:</span> {{ s.aprobaciones.jefeInmediato }}</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api';
import { useSolicitudTransporteStore } from '../../../store/solicitudTransporte.store';

export default {
  name: 'StepRevision',
  setup() {
    const store = useSolicitudTransporteStore();
    return { 
      s: computed(() => store.solicitudActual)
    };
  }
}
</script>

<style scoped>
.sta-section-title {
  font-size: var(--text-seccion);
  font-weight: var(--weight-seccion);
  color: var(--color-text-secondary);
}
.sta-label {
  font-size: var(--text-label);
  font-weight: var(--weight-label);
  color: var(--color-label);
}
.sta-revision-card {
  border-radius: 12px;
  background-color: #F9FAFB;
}
</style>
