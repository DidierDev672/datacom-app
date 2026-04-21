<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Ciudad Origen -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Ciudad origen</label>
        <q-select
          v-model="store.solicitudActual.viaje.ciudadOrigen"
          outlined
          dense
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          :options="ciudades"
          @filter="filterFn"
          placeholder="Seleccione origen"
          :rules="[val => !!val || 'La ciudad de origen es requerida']"
          class="sta-input"
        />
      </div>

      <!-- Ciudad Destino -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Ciudad destino</label>
        <q-select
          v-model="store.solicitudActual.viaje.ciudadDestino"
          outlined
          dense
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          :options="ciudades"
          @filter="filterFn"
          placeholder="Seleccione destino"
          :rules="[
            val => !!val || 'La ciudad de destino es requerida',
            val => val !== store.solicitudActual.viaje.ciudadOrigen || 'Debe ser distinta al origen'
          ]"
          class="sta-input"
        />
      </div>

      <!-- Tipo de Viaje -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Tipo de viaje</label>
        <q-select
          v-model="store.solicitudActual.viaje.tipoViaje"
          outlined
          dense
          :options="tiposViaje"
          emit-value
          map-options
          :rules="[val => !!val || 'El tipo de viaje es requerido']"
          class="sta-input"
        />
      </div>

      <!-- Fecha Salida -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Fecha de salida</label>
        <q-input
          v-model="store.solicitudActual.viaje.fechaSalida"
          outlined
          dense
          type="date"
          :rules="[
            val => !!val || 'La fecha de salida es requerida',
            val => val >= store.solicitudActual.fecha || 'Debe ser igual o posterior a la fecha de solicitud'
          ]"
          class="sta-input"
        />
      </div>

      <!-- Fecha Regreso -->
      <div class="col-12 col-sm-6" v-if="store.solicitudActual.viaje.tipoViaje === 'IDA_Y_VUELTA'">
        <label class="sta-label q-mb-xs block">Fecha de regreso</label>
        <q-input
          v-model="store.solicitudActual.viaje.fechaRegreso"
          outlined
          dense
          type="date"
          :rules="[
            val => !!val || 'La fecha de regreso es requerida',
            val => val >= store.solicitudActual.viaje.fechaSalida || 'Debe ser igual o posterior a la salida'
          ]"
          class="sta-input"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import { useSolicitudTransporteStore } from '../../../store/solicitudTransporte.store';

export default {
  name: 'StepViaje',
  setup() {
    const store = useSolicitudTransporteStore();
    const ciudadesOriginal = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga', 'Pereira', 'Santa Marta'];
    const ciudades = ref(ciudadesOriginal);

    const tiposViaje = [
      { label: 'IDA', value: 'IDA' },
      { label: 'IDA Y VUELTA', value: 'IDA_Y_VUELTA' }
    ];

    const filterFn = (val, update) => {
      if (val === '') {
        update(() => {
          ciudades.value = ciudadesOriginal;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        ciudades.value = ciudadesOriginal.filter(v => v.toLowerCase().indexOf(needle) > -1);
      });
    };

    return { 
      store, 
      ciudades, 
      tiposViaje,
      filterFn
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
.sta-input :deep(.q-field__control) {
  height: var(--input-height);
  border-radius: var(--input-border-radius);
}
.sta-input :deep(.q-field__native) {
  font-size: var(--text-input);
  font-weight: var(--weight-input);
}
</style>
