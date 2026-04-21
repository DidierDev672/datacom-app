<template>
  <div class="step-container">
    <div class="step-title">Justificación de la solicitud</div>
    
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-input
          v-model="store.form.motivoViaje"
          label="Motivo del viaje"
          type="textarea"
          outlined
          dense
          placeholder="Describa el objetivo principal del viaje"
          rows="4"
        />
      </div>
      
      <div class="col-12">
        <q-input
          v-model="store.form.relacionProyecto"
          label="Relación con el proyecto"
          type="textarea"
          outlined
          dense
          placeholder="¿Cómo contribuye este viaje a los objetivos del proyecto?"
          rows="3"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';

export default {
  name: 'StepJustificacion',
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

/* --- ESTILOS COMPARTIDOS (44px/14px) --- */
::v-deep .q-field {
  margin-top: 24px !important;
}

::v-deep .q-field__control {
  border: 1px solid #D1D5DB !important;
  border-radius: 8px !important;
  background: #FFFFFF !important;
  padding: 8px 12px !important;
}

::v-deep .q-field__native,
::v-deep .q-field__input {
  font-size: 14px !important;
}

::v-deep .q-field__label {
  position: absolute !important;
  top: -24px !important;
  left: 0 !important;
  transform: none !important;
  font-size: 14px !important;
  font-weight: 500 !important;
}
</style>
