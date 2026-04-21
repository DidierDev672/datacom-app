<template>
<div class="card">
    <div class="card-header">
      <h5>4. Datos de la entrega</h5>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <label>Departamento</label>
          <input type="text" v-model="solicitud.departamento" placeholder="Ej: Cundinamarca">
        </div>
        <div class="col-md-6">
          <label>Municipio</label>
          <input type="text" v-model="solicitud.municipio" placeholder="Ej: Bogotá">
        </div>
      </div>

      <div>
        <label>Dirección</label>
        <input type="text" v-model="solicitud.direccion" placeholder="Ej: Calle 123 #45-67">
      </div>

      <div class="row">
        <div class="col-md-4">
          <label>Contacto</label>
          <input type="text" v-model="solicitud.contacto" placeholder="Nombre completo">
        </div>
        <div class="col-md-4">
          <label>Teléfono</label>
          <input type="tel" v-model="solicitud.telefono" placeholder="Ej: 3001234567">
        </div>
        <div class="col-md-4">
          <label>Fecha de entrega</label>
          <input type="date" v-model="solicitud.fechaEntrega">
        </div>
      </div>

      <div class="checkbox">
        <input type="checkbox" id="requireFlete" v-model="solicitud.requiereFlete">
        <label for="requireFlete">¿Requiere flete?</label>
      </div>

      <div>
        <label>Garantías</label>
        <textarea 
          rows="2" 
          v-model="solicitud.garantias"
          placeholder="Especifique las garantías si aplica..."
        ></textarea>
      </div>
    </div>
  </div>

</template>

<script>
import { useSolicitudStore } from '../store/useSolicitudStore';

export default {
  name: 'DatosEntrega',
  computed: {
    solicitud() {
      return useSolicitudStore().solicitud;
    }
  }
}
</script>


<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.card-header {
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
  padding: 1rem;
  border-bottom: 2px solid #4E9C4C;
}

.card-header h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.card-body {
  padding: 1.5rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.col-md-6 {
  flex: 1 1 calc(50% - 0.5rem);
  min-width: 250px;
}

.col-md-4 {
  flex: 1 1 calc(33.333% - 0.667rem);
  min-width: 200px;
}

label {
  display: block;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  color: #555;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #4a90d9;
}

input::placeholder,
textarea::placeholder {
  color: #aaa;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.checkbox input {
  width: auto;
  margin: 0;
}

.checkbox label {
  margin: 0;
  font-weight: normal;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

@media (max-width: 768px) {
  .col-md-6,
  .col-md-4 {
    flex: 1 1 100%;
  }
}
</style>