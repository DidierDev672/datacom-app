<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <h3 class="sta-section-title q-my-none">Preferencias de vuelo</h3>
      <q-badge color="grey-3" text-color="grey-7" label="Opcional" class="q-ml-md" />
    </div>

    <div class="row q-col-gutter-md">
      <!-- Aerolínea -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Aerolínea preferida</label>
        <q-select
          v-model="store.solicitudActual.preferencias.aerolineaPreferida"
          outlined
          dense
          use-input
          fill-input
          hide-selected
          :options="aerolineas"
          placeholder="Ej: Avianca, Latam"
          class="sta-input"
        />
      </div>

      <!-- Horarios -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Horarios preferidos</label>
        <q-input
          v-model="store.solicitudActual.preferencias.horariosPreferidos"
          outlined
          dense
          placeholder="Ej: Mañana, Tarde, Noche"
          class="sta-input"
        />
      </div>

      <!-- Clase -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Clase de vuelo</label>
        <q-select
          v-model="store.solicitudActual.preferencias.claseVuelo"
          outlined
          dense
          :options="clasesVuelo"
          emit-value
          map-options
          class="sta-input"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudTransporteStore } from '../../../store/solicitudTransporte.store';

export default {
  name: 'StepPreferencias',
  setup() {
    const store = useSolicitudTransporteStore();
    const aerolineas = ['Avianca', 'Latam', 'Wingo', 'Satena', 'American Airlines', 'Copa Airlines'];
    const clasesVuelo = [
      { label: 'ECONÓMICA', value: 'ECONOMICA' },
      { label: 'EJECUTIVA', value: 'EJECUTIVA' }
    ];

    return {
      store,
      aerolineas,
      clasesVuelo
    };
  }
}
</script>

<style scoped>
.sta-label {
  font-size: var(--text-label);
  font-weight: var(--weight-label);
  color: var(--color-label);
}
.sta-section-title {
  font-size: var(--text-seccion);
  font-weight: var(--weight-seccion);
}
.sta-input :deep(.q-field__control) {
  height: var(--input-height);
  border-radius: var(--input-border-radius);
}
</style>
