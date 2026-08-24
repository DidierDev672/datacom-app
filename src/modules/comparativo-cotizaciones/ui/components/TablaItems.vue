<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold">Detalle de Productos Ofertados</div>
    </div>

    <q-table
      :data="value"
      :columns="columns"
      flat
      bordered
      hide-bottom
      class="rounded-xl shadow-premium"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body-cell-nombreProducto="props">
        <q-td :props="props">
          <q-input v-model="props.row.nombreProducto" dense outlined />
        </q-td>
      </template>
      <template v-slot:body-cell-cantidad="props">
        <q-td :props="props">
          <q-input v-model.number="props.row.cantidad" type="number" dense outlined />
        </q-td>
      </template>
      <template v-slot:body-cell-unidad="props">
        <q-td :props="props">
          <q-select 
            v-model="props.row.unidad" 
            :options="['Unidad', 'kg', 'servicio', 'caja', 'metro', 'litro']" 
            dense 
            outlined 
          />
        </q-td>
      </template>
      <template v-slot:body-cell-proveedorNit="props">
        <q-td :props="props">
          <q-select 
            v-model="props.row.proveedorNit" 
            :options="proveedores" 
            option-value="nit" 
            option-label="nombre"
            emit-value
            map-options
            dense 
            outlined 
          />
        </q-td>
      </template>
      <template v-slot:body-cell-valorUnitario="props">
        <q-td :props="props">
          <q-input v-model.number="props.row.valorUnitario" type="number" dense outlined />
        </q-td>
      </template>
      <template v-slot:body-cell-valorTotal="props">
        <q-td :props="props" class="text-weight-bold">
          {{ (props.row.cantidad * props.row.valorUnitario) | currency }}
        </q-td>
      </template>
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <q-btn flat round color="negative" icon="delete" @click="remove(props.rowIndex)" />
        </q-td>
      </template>
    </q-table>

    <div class="row justify-center q-mt-lg">
      <q-btn 
        color="primary" 
        icon="playlist_add" 
        label="Agregar Ítem a la Lista" 
        padding="10px 40px"
        outline 
        no-caps 
        @click="addItem"
        class="rounded-lg shadow-sm"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'proveedores'],
  data() {
    return {
      columns: [
        { name: 'nombreProducto', label: 'Producto', align: 'left', field: 'nombreProducto' },
        { name: 'cantidad', label: 'Cant', align: 'left', field: 'cantidad' },
        { name: 'unidad', label: 'Unidad', align: 'left', field: 'unidad' },
        { name: 'proveedorNit', label: 'Proveedor', align: 'left', field: 'proveedorNit' },
        { name: 'valorUnitario', label: 'Vr Unitario', align: 'right', field: 'valorUnitario' },
        { name: 'valorTotal', label: 'Vr Total', align: 'right' },
        { name: 'acciones', label: '', align: 'center' }
      ]
    }
  },
  filters: {
    currency(val) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val || 0);
    }
  },
  methods: {
    addItem() {
      const newList = [...this.value, { nombreProducto: '', cantidad: 1, unidad: 'Unidad', valorUnitario: 0, proveedorNit: '' }];
      this.$emit('input', newList);
    },
    remove(index) {
      const newList = [...this.value];
      newList.splice(index, 1);
      this.$emit('input', newList);
    }
  }
}
</script>
