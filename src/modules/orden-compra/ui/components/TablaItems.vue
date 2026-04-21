<template>
  <div>
    <div class="row justify-between localItems-center q-mb-md">
      <div class="subtitle">Detalle de Ítems</div>
      <q-btn color="secondary" icon="add" label="Agregar ítem" @click="agregarItem" />
    </div>

    <q-table
      :data="localItems"
      :columns="columns"
      row-key="idGrid"
      flat bordered
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
      no-data-label="No hay ítems registrados"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="numero" :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
          <q-td key="descripcion" :props="props">
            <q-input v-model="props.row.descripcion" dense borderless placeholder="Ej. Material" 
              @blur="validateItem(props.row, 'descripcion', props.rowIndex)"
              :error="hasError(props.rowIndex, 'descripcion')" />
          </q-td>
          <q-td key="unidad" :props="props">
            <q-select 
              v-model="props.row.unidad" 
              :options="unidadesOptions"
              dense 
              borderless 
              placeholder="Seleccionar"
              class="unidad-select"
              popup-content-class="unidad-dropdown-popup"
              @blur="validateItem(props.row, 'unidad', props.rowIndex)"
              :error="hasError(props.rowIndex, 'unidad')"
              emit-value
              map-options
            >
              <template v-slot:selected-item="scope">
                <span class="unidad-selected-text">{{ scope.opt }}</span>
              </template>
            </q-select>
          </q-td>
          <q-td key="cantidad" :props="props" class="col-cantidad">
            <q-input v-model.number="props.row.cantidad" dense borderless type="number" 
              @blur="validateItem(props.row, 'cantidad', props.rowIndex)"
              :error="hasError(props.rowIndex, 'cantidad')" />
          </q-td>
          <q-td key="valorUnitario" :props="props" class="col-precio">
            <q-input v-model.number="props.row.valorUnitario" dense borderless type="number" step="0.01" prefix="$"
              @blur="validateItem(props.row, 'valorUnitario', props.rowIndex)"
              :error="hasError(props.rowIndex, 'valorUnitario')" />
          </q-td>
          <q-td key="valorTotal" :props="props" class="text-right d-precio text-weight-medium">
            {{ formatMoney(calcularTotalItem(props.row)) }}
          </q-td>
          <q-td key="acciones" :props="props" class="text-center">
            <q-btn flat round dense color="negative" icon="delete" @click="eliminarItem(props.rowIndex)" />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'TablaItems',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      localItems: this.value || [],
      unidadesOptions: ['UND', 'MTS', 'KG', 'MGR', 'LTR', 'HORA', 'DIA', 'MES', 'SERV'],
      errors: [],
      columns: [
        { name: 'numero', label: 'N°', align: 'center' },
        { name: 'descripcion', label: 'Descripción', align: 'left' },
        { name: 'unidad', label: 'Unidad', align: 'left' },
        { name: 'cantidad', label: 'Cantidad', align: 'center' },
        { name: 'valorUnitario', label: 'V. Unitario', align: 'right' },
        { name: 'valorTotal', label: 'V. Total', align: 'right' },
        { name: 'acciones', label: 'Acciones', align: 'center' }
      ]
    }
  },
  methods: {
    agregarItem() {
      this.localItems.push({
        idGrid: Date.now().toString(),
        descripcion: '',
        unidad: '',
        cantidad: 1,
        valorUnitario: 0
      });
      this.errors.push({});
      this.$emit('input', this.localItems);
    },
    eliminarItem(index) {
      this.localItems.splice(index, 1);
      this.errors.splice(index, 1);
      this.$emit('input', this.localItems);
    },
    calcularTotalItem(row) {
      return (Number(row.cantidad) || 0) * (Number(row.valorUnitario) || 0);
    },
    formatMoney(val) {
      return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0}).format(val);
    },
    validateItem(row, field, index) {
      if (!this.errors[index]) this.$set(this.errors, index, {});
      
      let isValid = true;
      if (field === 'descripcion') isValid = !!row.descripcion;
      if (field === 'unidad') isValid = !!row.unidad;
      if (field === 'cantidad') isValid = Number(row.cantidad) >= 1;
      if (field === 'valorUnitario') isValid = Number(row.valorUnitario) > 0;
      
      this.$set(this.errors[index], field, !isValid);
    },
    hasError(index, field) {
      return this.errors[index] && this.errors[index][field];
    },
    validateAll() {
      if (this.localItems.length === 0) return false;
      
      let allValid = true;
      this.localItems.forEach((row, i) => {
        this.validateItem(row, 'descripcion', i);
        this.validateItem(row, 'unidad', i);
        this.validateItem(row, 'cantidad', i);
        this.validateItem(row, 'valorUnitario', i);
        
        if (this.hasError(i, 'descripcion') || this.hasError(i, 'unidad') || this.hasError(i, 'cantidad') || this.hasError(i, 'valorUnitario')) {
          allValid = false;
        }
      });
      return allValid;
    }
  }
}
</script>

<style scoped>
.subtitle {
  font-size: 18px !important;
  font-weight: 500 !important;
  color: #111827 !important;
}

/* Detalle de ítems - UX Spec */
/* Header tabla 13px 600 */
::v-deep .q-table th {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #6B7280 !important;
}

/* Contenido 14px 400 */
::v-deep .q-table td {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important;
}

/* Redefinir inputs dentro de la tabla si no están cubiertos por lo global */
::v-deep .q-table .q-field__native {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important;
}

/* Cantidades 14px 500 */
::v-deep .col-cantidad .q-field__native {
  font-weight: 500 !important;
}

/* Precios 14px 500 */
::v-deep .col-precio .q-field__native {
  font-weight: 500 !important;
}

::v-deep .d-precio {
  font-weight: 500 !important;
}

/* --- ESTILOS DEL INPUT DE UNIDAD (DROPDOWN) --- */
::v-deep .unidad-select .q-field__control {
  height: 44px !important;
  min-height: 44px !important;
  padding: 0 12px !important; /* padding lateral 12px */
  border-radius: 8px !important;
  border: 1px solid #D1D5DB !important;
  background: white;
}

::v-deep .unidad-select.q-field--focused .q-field__control {
  border-color: #2563EB !important;
  box-shadow: 0 0 0 2px rgba(37,99,235,0.2) !important;
}

::v-deep .unidad-select .q-field__control:before,
::v-deep .unidad-select .q-field__control:after {
  display: none !important;
}

::v-deep .unidad-select .q-field__native {
  padding: 10px 0 !important; /* padding V 10px -> total 10x12 */
}

.unidad-selected-text {
  font-size: 14px;
  font-weight: 400; /* Valor seleccionado 14px 400 */
  color: #111827;
}
</style>

<style>
/* POPUP DEL DROPDOWN DE UNIDADES (Global para afectar al portal) */
.unidad-dropdown-popup {
  max-height: 260px !important; /* Opciones visibles con scroll moderado */
  overflow-y: auto !important;
  border-radius: 8px !important;
  min-width: 250px !important; /* Ancho minimo 250px */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
}

.unidad-dropdown-popup .q-item {
  font-size: 14px !important; /* Nunca menos de 14px en opciones */
  font-weight: 400 !important;
  padding: 10px 12px !important; /* Padding 10px 12px lectura cómoda */
  background: white !important;
  color: #111827 !important;
  min-height: auto !important;
  transition: all 0.2s ease;
}

/* Hover en opciones */
.unidad-dropdown-popup .q-item:hover {
  background: #F3F4F6 !important;
}

/* Selecciónado (Activo) */
.unidad-dropdown-popup .q-item.q-manual-focusable--focused,
.unidad-dropdown-popup .q-item--active,
.unidad-dropdown-popup .q-item.q-item--active {
  background: #E0F2FE !important;
  font-weight: 500 !important;
  color: #111827 !important;
}
</style>
