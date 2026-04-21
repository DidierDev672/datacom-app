<template>
  <div class="step-container">
    <div class="step-title">Lista de personas que viajan</div>

    <!-- Formulario para agregar persona -->
    <div class="row q-col-gutter-md q-mb-lg items-end">
      <div class="col-12 col-md-3">
        <q-input v-model="newPersona.nombre" label="Nombre" outlined dense />
      </div>
      <div class="col-12 col-md-2">
        <q-input v-model="newPersona.documento" label="Documento" outlined dense />
      </div>
      <div class="col-12 col-md-3">
        <q-input v-model="newPersona.cargo" label="Cargo" outlined dense />
      </div>
      <div class="col-12 col-md-2">
        <q-input v-model="newPersona.telefono" label="Teléfono" outlined dense />
      </div>
      <div class="col-12 col-md-2">
        <q-btn
          color="primary"
          icon="add"
          label="Agregar"
          unelevated
          class="btn-add full-width"
          @click="addPersona"
          :disabled="!isPersonaValid"
        />
      </div>
    </div>

    <!-- Tabla de personas -->
    <q-table
      :data="store.form.personas"
      :columns="columns"
      row-key="documento"
      flat
      bordered
      dense
      no-data-label="No hay personas agregadas"
      class="personas-table"
    >
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <q-btn
            flat
            round
            dense
            color="negative"
            icon="delete"
            @click="store.removePersona(props.rowIndex)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';

export default {
  name: 'StepPersonas',
  setup() {
    const store = useSolicitudViajeStore();
    return { store };
  },
  data() {
    return {
      newPersona: {
        nombre: '',
        documento: '',
        cargo: '',
        telefono: ''
      },
      columns: [
        { name: 'nombre', label: 'Nombre', align: 'left', field: 'nombre' },
        { name: 'documento', label: 'Documento', align: 'left', field: 'documento' },
        { name: 'cargo', label: 'Cargo', align: 'left', field: 'cargo' },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' },
        { name: 'acciones', label: 'Acciones', align: 'center' }
      ]
    }
  },
  computed: {
    isPersonaValid() {
      return this.newPersona.nombre && this.newPersona.documento;
    }
  },
  methods: {
    addPersona() {
      this.store.addPersona(this.newPersona);
      this.newPersona = {
        nombre: '',
        documento: '',
        cargo: '',
        telefono: ''
      };
    }
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

.btn-add {
  height: 44px !important;
  border-radius: 8px;
  font-weight: 600;
}

/* --- ESTILOS DE TABLA (UX SPEC) --- */
::v-deep .personas-table {
  border-radius: 8px;
}

::v-deep .personas-table th {
  font-size: 13px !important;
  font-weight: 600 !important;
  padding: 12px 10px !important;
  color: #6B7280;
  text-transform: uppercase;
}

::v-deep .personas-table td {
  font-size: 14px !important; /* Tabla 14px 400 */
  padding: 10px !important; /* padding: 10px */
  height: 44px !important; /* Altura: 44px */
}

/* --- ESTILOS INPUTS (44px) --- */
::v-deep .q-field {
  margin-top: 24px !important;
}

::v-deep .q-field__control {
  height: 44px !important;
  border: 1px solid #D1D5DB !important;
  border-radius: 8px !important;
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
