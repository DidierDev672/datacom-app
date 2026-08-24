<template>
   <div class="card">
    <div class="card-header">
      <span class="card-step">01</span>
      <h5 class="card-title">Datos de la solicitud</h5>
    </div>
    <div class="card-body">
      <div class="field">
        <label class="field-label">Subdirección</label>
        <select class="field-input" v-model="solicitud.subdireccion">
          <option value="" disabled>Seleccione una opción</option>
          <option value="planeacion y Gestion Estrategica">planeacion y Gestion Estrategica</option>
          <option value="Gestion Corporativa">Gestion Corporativa</option>
        </select>
      </div>

      <div class="field">
        <label class="field-label">Descripción de la necesidad</label>
        <textarea
          class="field-input"
          rows="3"
          v-model="solicitud.descripcionNecesidad"
          placeholder="Escriba aquí la descripción de la necesidad..."
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudStore } from '../store/useSolicitudStore';

export default {
  name: 'DatosSolicitud',
  computed: {
    solicitud() {
      return useSolicitudStore().solicitud;
    }
  }
}
</script>

<style scoped>
/* Agregando pequeños micro-styles si no se usa Bootstrap nativo */
.card {
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.card-header {
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
  border-bottom: 2px solid #4E9C4C;
}

.card-step {
  display: block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
}

.card-title {
  margin: 2px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.card-body {
  padding: 1.25rem;
}

.field {
  margin-bottom: 1.25rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 12px;
  color: #6b6b6b;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.field-input {
  width: 100%;
  font-size: 14px;
  padding: 8px 10px;
  background: #f7f7f6;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  color: #1a1a1a;
  font-family: inherit;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  appearance: none;
  resize: vertical;
}

.field-input:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.3);
}

.field-input::placeholder {
  color: #b0b0b0;
}
</style>
