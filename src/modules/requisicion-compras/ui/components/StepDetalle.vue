<template>
  <div class="q-pa-md">
    <q-table
      :data="model"
      :columns="columns"
      row-key="idItem"
      flat bordered
      hide-pagination
      :pagination="{ rowsPerPage: 0 }"
      no-data-label="No hay ítems agregados"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="numeroItem" :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>

          <q-td key="detalle" :props="props">
            <q-input v-model="props.row.detalle" dense outlined type="text" 
                     :error="!props.row.detalle" hide-bottom-space />
          </q-td>

          <q-td key="unidad" :props="props">
            <q-select 
              v-model="props.row.unidad" 
              :options="opcionesUnidad" 
              dense 
              outlined 
              :error="!props.row.unidad" 
              hide-bottom-space 
              class="unidad-select"
              popup-content-class="unidad-popup"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents" :class="{ 'item-seleccionado': scope.selected }">
                  <q-item-section>
                    <q-item-label>{{ scope.opt }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-td>

          <q-td key="cantidad" :props="props">
            <q-input v-model.number="props.row.cantidad" dense outlined type="number" min="1"
                     :error="props.row.cantidad < 1" hide-bottom-space />
          </q-td>

          <q-td key="precioUnitario" :props="props">
            <q-input v-model.number="props.row.precioUnitario" dense outlined type="number" step="0.01" min="0.01"
                     prefix="$" suffix="COP" input-class="text-right"
                     :error="props.row.precioUnitario < 0.01" hide-bottom-space />
          </q-td>

          <q-td key="totalItem" :props="props">
            {{ formatMoney(calcularTotalItem(props.row)) }}
          </q-td>

          <q-td key="acciones" :props="props" class="text-center">
            <q-btn flat round color="negative" icon="delete" size="sm" @click="eliminarItem(props.rowIndex)" />
          </q-td>
        </q-tr>
      </template>

      <template v-slot:bottom-row>
        <q-tr>
          <q-td colspan="5" class="text-right text-weight-bold">
            Total General:
          </q-td>
          <q-td class="text-weight-bold">
            {{ formatMoney(totalGeneral) }}
          </q-td>
          <q-td></q-td>
        </q-tr>
      </template>
    </q-table>

    <div class="row q-mt-md justify-end">
      <q-btn unelevated icon="add" label="Agregar ítem" @click="agregarItem" class="btn btn-primary" />
    </div>

    <div v-if="errorMsg" class="text-negative q-mt-md text-weight-bold">
      {{ errorMsg }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepDetalle',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      model: this.value,
      errorMsg: '',
      opcionesUnidad: ['UND', 'MTS', 'KG', 'GR', 'MGR', 'LT', 'HORA', 'DIA', 'MES', 'SERV'],
      columns: [
        { name: 'numeroItem', label: '#', align: 'left', field: 'numeroItem' },
        { name: 'detalle', label: 'Detalle *', align: 'left', field: 'detalle' },
        { name: 'unidad', label: 'Unidad *', align: 'left', field: 'unidad' },
        { name: 'cantidad', label: 'Cantidad *', align: 'center', field: 'cantidad' },
        { name: 'precioUnitario', label: 'Precio Unitario *', align: 'right', field: 'precioUnitario' },
        { name: 'totalItem', label: 'Total Ítem', align: 'right' },
        { name: 'acciones', label: 'Acciones', align: 'center' }
      ]
    };
  },
  watch: {
    model: {
      deep: true,
      handler(val) {
        this.errorMsg = '';
        this.$emit('input', val);
      }
    }
  },
  computed: {
    totalGeneral() {
      return this.model.reduce((acc, row) => acc + this.calcularTotalItem(row), 0);
    }
  },
  methods: {
    agregarItem() {
      this.model.push({
        idItem: 'temp-' + Date.now(),
        numeroItem: this.model.length + 1,
        detalle: '',
        unidad: '',
        cantidad: 1,
        precioUnitario: 0.00
      });
    },
    eliminarItem(index) {
      this.model.splice(index, 1);
      // Reindexar
      this.model.forEach((item, idx) => {
        item.numeroItem = idx + 1;
      });
    },
    calcularTotalItem(row) {
      if (!row.cantidad || !row.precioUnitario) return 0;
      return Number(row.cantidad) * Number(row.precioUnitario);
    },
    formatMoney(amount) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
    },
    validate() {
      if (this.model.length === 0) {
        this.errorMsg = 'Debe agregar al menos un ítem.';
        return false;
      }
      
      const p = this.model.find(i => !i.detalle || !i.unidad || i.cantidad < 1 || i.precioUnitario < 0.01);
      if (p) {
        this.errorMsg = 'Todos los ítems deben tener detalle, unidad, cantidad >= 1 y precio >= 0.01.';
        return false;
      }
      
      this.errorMsg = '';
      return true;
    }
  }
}
</script>

</style>

<style>
/* Estilos globales para el popup del q-select unidad */
.unidad-popup {
  max-height: 240px !important;
  border-radius: 8px !important;
  background-color: white !important;
}
.unidad-popup .q-item {
  font-size: 15px !important;
  font-weight: 400 !important;
  background-color: white !important;
  transition: all 0.2s ease;
}
.unidad-popup .q-item:hover {
  background-color: #F3F4F6 !important;
}
.unidad-popup .q-item.item-seleccionado {
  background-color: #E0F2FE !important;
}
</style>
