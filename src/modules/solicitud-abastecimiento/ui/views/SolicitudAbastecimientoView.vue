<template>
  <main>
    <h1>Crear una nueva requisición</h1>
    <p>Complete todos los campos requeridos para crear una nueva requisición.</p>

    <div v-if="error" class="error">{{ error }}</div>

    <form @submit.prevent="openCreateOrderModal">
      <DatosSolicitud />
      <DatosFinancieros />

      <section class="card card-delivery">
        <div class="card-header">
          <h5>4. Datos de la entrega</h5>
        </div>
        <div class="card-body">
          <div class="field">
            <span v-if="selectedAreaLabel" class="badge">{{ selectedAreaLabel }}</span>
            <label class="field-label">Área / Departamento</label>
            <q-select v-model="selectedArea" :options="areaOptions" option-label="label" option-value="value" emit-value
              map-options dense outlined placeholder="Seleccione un departamento" class="area-select"
              @update:model-value="onAreaSelected" />
          </div>
          <div class="row-fields">
            <div class="field">
              <label class="field-label">Departamento</label>
              <input type="text" class="field-input" v-model="store.solicitud.departamento"
                placeholder="Ej: Cundinamarca" />
            </div>
            <div class="field">
              <label class="field-label">Municipio</label>
              <input type="text" class="field-input" v-model="store.solicitud.municipio" placeholder="Ej: Bogotá" />
            </div>
          </div>
          <div class="field">
            <label class="field-label">Dirección</label>
            <input type="text" class="field-input" v-model="store.solicitud.direccion"
              placeholder="Ej: Calle 123 #45-67" />
          </div>
          <div class="row-fields">
            <div class="field">
              <label class="field-label">Contacto</label>
              <input type="text" class="field-input" v-model="store.solicitud.contacto" placeholder="Nombre completo" />
            </div>
            <div class="field">
              <label class="field-label">Teléfono</label>
              <input type="text" class="field-input" v-model="store.solicitud.telefono" placeholder="Ej: 3001234567" />
            </div>
            <div class="field">
              <label class="field-label">Fecha de entrega</label>
              <input type="date" class="field-input" v-model="store.solicitud.fechaEntrega" />
            </div>
          </div>
          <div class="field">
            <label class="checkbox-label">
              <input type="checkbox" v-model="store.solicitud.requiereFlete" />
              ¿Requiere flete?
            </label>
          </div>
          <div class="field">
            <label class="field-label">Garantías</label>
            <textarea class="field-input textarea-field" rows="3" v-model="store.solicitud.garantias"
              placeholder="Especifique las garantías si aplica..."></textarea>
          </div>
        </div>
      </section>

      <footer>
        <button type="button" class="btn-clear" @click="clearForm" :disabled="loading">
          Limpiar
        </button>
        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? '...' : 'Crear orden →' }}
        </button>
      </footer>
    </form>

    <CreateOrderNameModal v-model="showOrderNameModal" :loading="loading" :error="submitError"
      @confirm="confirmCreateOrder" />
  </main>
</template>

<script>
import CreateOrderNameModal from '../components/CreateOrderNameModal.vue';
import DatosFinancieros from '../components/DatosFinancieros.vue';
import DatosSolicitud from '../components/DatosSolicitud.vue';

import { buildDepartmentSelectOptions } from 'src/modules/talento-humano/ui/utils/departmentSelectOptions';
import { useDepartmentStore } from 'src/stores/department.store';
import { useSolicitudStore } from '../store/useSolicitudStore';

export default {
  name: 'SolicitudAbastecimientoView',
  components: {
    DatosSolicitud,
    DatosFinancieros,
    CreateOrderNameModal,
  },
  data() {
    return {
      showOrderNameModal: false,
      submitError: '',
      selectedArea: null,
      areaOptions: [],
    };
  },
  computed: {
    store() {
      return useSolicitudStore();
    },
    departmentStore() {
      return useDepartmentStore();
    },
    loading() {
      return this.store.loading;
    },
    error() {
      return this.store.error;
    },
    selectedAreaLabel() {
      if (this.selectedArea == null) {
        return '';
      }

      var area = this.areaOptions.find(function (item) {
        return item.value === this.selectedArea;
      }, this);

      if (!area) {
        return '';
      }

      let label = `${area.label} - ${area.raw.name}`;
      return label;
    },
  },
  async mounted() {
    await this.loadAreas();
  },
  methods: {
    async loadAreas() {
      try {
        await this.departmentStore.fetchAll();
        this.areaOptions = buildDepartmentSelectOptions(this.departmentStore.departamentosActivos);
      } catch (err) {
        // Silenciar error, el dropdown quedará vacío
      }
    },
    onAreaSelected(departamentoId) {
      if (!departamentoId) {
        this.store.solicitud.departamentoId = null;
        this.store.solicitud.departamentoNombre = '';
        this.store.solicitud.departamento = '';
        this.store.solicitud.areaNombre = '';
        return;
      }
      var department = this.departmentStore.departments.find(function (d) {
        return d.id === departamentoId;
      });
      if (department) {
        this.store.solicitud.departamentoId = department.id;
        this.store.solicitud.departamentoNombre = department.name || department.nombre || '';
        this.store.solicitud.departamento = department.name || department.nombre || '';
        var areas = Array.isArray(department.areas) ? department.areas : [];
        this.store.solicitud.areaNombre = areas.length > 0
          ? (areas[0].name || areas[0].areaName || areas[0].nombre || '')
          : '';
      }
    },
    openCreateOrderModal() {
      this.submitError = '';

      if (!this.store.validateForm()) {
        this.showRegistrationError(this.store.error);
        return;
      }

      this.showOrderNameModal = true;
    },
    async confirmCreateOrder(orderName) {
      this.submitError = '';
      const result = await this.store.submit(orderName);

      if (result.success) {
        this.showOrderNameModal = false;
        this.notifySuccess('¡Orden creada de manera exitosa!');
        return;
      }

      this.submitError = result.message;
      this.showRegistrationError(result.message);
    },
    clearForm() {
      this.store.resetForm();
      this.submitError = '';
      this.selectedArea = null;
    },
    notifySuccess(message) {
      if (this.$q) {
        this.$q.notify({ type: 'positive', message });
        return;
      }
      alert(message);
    },
    showRegistrationError(message) {
      const text = message || 'No se pudo registrar la orden.';
      if (this.$q) {
        this.$q.notify({
          type: 'negative',
          message: text,
          timeout: 5000,
        });
        return;
      }
      alert(`Error: ${text}`);
    },
  }
}
</script>

<style scoped>
main {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #1a1a1a;
}

p {
  color: #666;
  margin: 0 0 2rem;
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 0.875rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

footer {
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit {
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
  color: #ffffff;
  border: 2px solid #4E9C4C;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #75AF7E, #4E9C4C, #3e813c);
  border-color: #3e813c;
}

.btn-clear {
  background: #FFFFFF;
  color: #4A8F49;
  border: 1px solid #B7C8B2;
}

.btn-clear:hover:not(:disabled) {
  background: #F3F8F2;
  border-color: #B7C8B2;
}

button:disabled {
  opacity: 0.5;
}

/* Card de entrega */
.card-delivery {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.card-delivery .card-header {
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
  padding: 1rem;
  border-bottom: 2px solid #4E9C4C;
}

.card-delivery .card-header h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.card-delivery .card-body {
  padding: 1.5rem;
}

.row-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.row-fields .field:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}

.field {
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.375rem;
}

.field-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #111827;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.field-input:focus {
  outline: none;
  border-color: #6DAB74;
  box-shadow: 0 0 0 2px rgba(109, 171, 116, 0.15);
}

.field-input::placeholder {
  color: #9ca3af;
}

.textarea-field {
  resize: vertical;
  min-height: 80px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #539E52;
  cursor: pointer;
}

.area-select {
  width: 100%;
}

.area-badge-container {
  margin-top: 0.5rem;
}

.area-badge {
  border-radius: 8px;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  max-width: 100%;
  word-break: break-word;
}

.area-badge-separator {
  margin: 0 0.125rem;
  opacity: 0.7;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 4px 10px;

  background: #F7F1D5;
  border: 1px solid #D9D3B8;
  border-radius: 8px;

  color: #4A8F49;

  font-size: 12px;
  font-weight: 600;
  line-height: 1;

  white-space: nowrap;
}

@media (max-width: 639px) {
  .area-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>
