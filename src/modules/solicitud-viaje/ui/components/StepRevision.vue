<template>
  <div class="step-container">
    <div class="step-title">Resumen de la solicitud</div>
    
    <div class="summary-section">
      <div class="section-header">A. Identificación</div>
      <div class="row q-col-gutter-sm">
        <div class="col-6"><span class="label">Código:</span> {{ store.form.codigo }}</div>
        <div class="col-6"><span class="label">Fecha:</span> {{ store.form.fechaSolicitud }}</div>
        <div class="col-12"><span class="label">Proyecto:</span> {{ store.form.proyecto }}</div>
        <div class="col-6"><span class="label">Área:</span> {{ store.form.area }}</div>
        <div class="col-6"><span class="label">Solicitante:</span> {{ store.form.solicitanteNombre }}</div>
      </div>
    </div>

    <div v-if="store.form.tipoSolicitud !== 'ALOJAMIENTO'" class="summary-section">
      <div class="section-header">B. Transporte</div>
      <div class="row q-col-gutter-sm">
        <div class="col-6"><span class="label">Origen:</span> {{ store.form.transporte.origen }}</div>
        <div class="col-6"><span class="label">Destino:</span> {{ store.form.transporte.destino }}</div>
        <div class="col-6"><span class="label">Salida:</span> {{ store.form.transporte.fechaSalida }}</div>
        <div class="col-6"><span class="label">Regreso:</span> {{ store.form.transporte.fechaRegreso }}</div>
        <div class="col-6"><span class="label">Tipo:</span> {{ store.form.transporte.tipoTransporte }}</div>
      </div>
    </div>

    <div v-if="store.form.tipoSolicitud !== 'TRANSPORTE'" class="summary-section">
      <div class="section-header">C. Alojamiento</div>
      <div class="row q-col-gutter-sm">
        <div class="col-6"><span class="label">Ciudad:</span> {{ store.form.hospedaje.ciudad }}</div>
        <div class="col-6"><span class="label">Hotel:</span> {{ store.form.hospedaje.hotel || 'No especificado' }}</div>
        <div class="col-6"><span class="label">Ingreso:</span> {{ store.form.hospedaje.fechaIngreso }}</div>
        <div class="col-6"><span class="label">Salida:</span> {{ store.form.hospedaje.fechaSalida }}</div>
      </div>
    </div>

    <div class="summary-section">
      <div class="section-header">D. Personas ({{ store.form.personas.length }})</div>
      <div class="persona-chips">
        <q-chip v-for="p in store.form.personas" :key="p.documento" outline color="primary" icon="person">
          {{ p.nombre }}
        </q-chip>
      </div>
    </div>

    <div class="summary-section">
      <div class="section-header">E. Justificación</div>
      <div class="q-mt-sm">
        <div class="label">Motivo:</div>
        <div class="q-ml-sm text-grey-8">{{ store.form.motivoViaje }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';

export default {
  name: 'StepRevision',
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

.summary-section {
  background: #F9FAFB;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #E5E7EB;
}

.section-header {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #D1D5DB;
  padding-bottom: 4px;
}

.label {
  font-weight: 500;
  color: #6B7280;
  font-size: 13px;
}

.persona-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
