<template>
  <div class="step-container">
    <div class="step-title">Detalle de alojamiento</div>
    
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-6">
        <q-input
          v-model="store.form.hospedaje.ciudad"
          label="Ciudad"
          outlined
          dense
          placeholder="Ej: Bogotá, Medellín"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="store.form.hospedaje.hotel"
          label="Hotel (Opcional)"
          outlined
          dense
          placeholder="Nombre del hotel sugerido"
        />
      </div>
      
      <div class="col-12 col-md-6">
        <q-input
          v-model="store.form.hospedaje.fechaIngreso"
          label="Fecha de ingreso"
          type="date"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="store.form.hospedaje.fechaSalida"
          label="Fecha de salida"
          type="date"
          outlined
          dense
        />
      </div>

      <div class="col-12 col-md-6">
        <q-input
          v-model.number="store.form.hospedaje.numeroHabitaciones"
          label="Número de habitaciones"
          type="number"
          outlined
          dense
          min="1"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model.number="store.form.hospedaje.numeroPersonas"
          label="Número de personas"
          type="number"
          outlined
          dense
          min="1"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';

export default {
  name: 'StepAlojamiento',
  setup() {
    const store = useSolicitudViajeStore();
    return { store };
  }
}
</script>

<style scoped>
.step-container {
  padding: 24px;
}

.step-title {
  font-size: 18px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 24px;
}

/* --- ESTILOS ESPECÍFICOS SOLICITUD VIAJE (44px) --- */

::v-deep .q-field {
  margin-top: 24px !important;
  margin-bottom: 8px !important;
}

::v-deep .q-field__control {
  height: 44px !important;
  border: 1px solid #D1D5DB !important;
  border-radius: 8px !important;
  background: #FFFFFF !important;
  padding: 0 12px !important;
}

::v-deep .q-field__control:before,
::v-deep .q-field__control:after {
  display: none !important;
}

::v-deep .q-field__native,
::v-deep .q-field__input {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important;
}

::v-deep .q-field__label {
  position: absolute !important;
  top: -24px !important;
  left: 0 !important;
  transform: none !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #374151 !important;
}

::v-deep .q-field--focused .q-field__control {
  border-color: #2563EB !important;
}
</style>
