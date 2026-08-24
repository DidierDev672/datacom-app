<template>
  <div class="step-container">
    <div class="step-title">Identificación de la solicitud</div>
    
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-4">
        <q-input
          v-model="store.form.fechaSolicitud"
          label="Fecha de solicitud"
          type="date"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-md-8">
        <q-input
          v-model="store.form.solicitanteNombre"
          label="Solicitante"
          outlined
          dense
          placeholder="Nombre completo"
        />
      </div>
      
      <div class="col-12 col-md-6">
        <q-input
          v-model="store.form.proyecto"
          label="Proyecto"
          outlined
          dense
          placeholder="Nombre del proyecto"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="store.form.area"
          label="Área / Dependencia"
          outlined
          dense
          placeholder="Ej: Administración, Operaciones"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';

export default {
  name: 'StepIdentificacion',
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
  height: 44px !important; /* Altura ideal 44px */
  border: 1px solid #D1D5DB !important;
  border-radius: 8px !important;
  background: #FFFFFF !important;
  padding: 0 12px !important;
  box-shadow: none !important;
}

::v-deep .q-field__control:before,
::v-deep .q-field__control:after {
  display: none !important;
}

::v-deep .q-field__native,
::v-deep .q-field__input {
  font-size: 14px !important; /* Inputs 14px 400 */
  font-weight: 400 !important;
  color: #111827 !important;
  padding: 8px 0 !important; /* Total height ~44px */
}

::v-deep .q-field__label {
  position: absolute !important;
  top: -24px !important;
  left: 0 !important;
  transform: none !important;
  font-size: 14px !important; /* Labels 14px 500 */
  font-weight: 500 !important;
  color: #374151 !important;
  line-height: 1 !important;
}

::v-deep .q-field--focused .q-field__control {
  border-color: #2563EB !important;
}
</style>
