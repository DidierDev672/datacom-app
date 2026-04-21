<template>
  <q-table
    :data="rows"
    :columns="columns"
    row-key="nit"
    flat
    :pagination="{ rowsPerPage: 0 }"
    :loading="loading"
    class="suppliers-table"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn dense flat color="primary" label="Ver detalles" @click="$emit('view', props.row)" />
      </q-td>
    </template>
    <template v-slot:bottom>
      <div class="row items-center q-pa-sm full-width">
        <div class="row items-center q-gutter-sm">
          <span>Filas:</span>
          <q-select dense outlined v-model="localRowsPerPage" :options="[5, 10, 20]" style="width: 90px"
            @update:model-value="onRowsPerPage" />
        </div>
        <q-space />
        <q-pagination v-model="localPage" :max="totalPages || 1" max-pages="6" boundary-numbers
          @update:model-value="onPage" />
        <div class="q-ml-md">{{ totalElements || 0 }} resultados</div>
      </div>
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'SuppliersTable',
  props: {
    rows: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    page: { type: Number, default: 1 },
    rowsPerPage: { type: Number, default: 10 },
    totalPages: { type: Number, default: 1 },
    totalElements: { type: Number, default: 0 }
  },
  data() {
    return {
      localPage: this.page,
      localRowsPerPage: this.rowsPerPage,
      columns: [
        { name: 'nit', label: 'NIT', align: 'left', field: 'nit', sortable: true },
        { name: 'name', label: 'Nombre', align: 'left', field: (r) => r.name || r.supplier || r.contactName, sortable: true },
        { name: 'address', label: 'Dirección', align: 'left', field: 'address' },
        { name: 'phone', label: 'Teléfono', align: 'left', field: 'phone' },
        { name: 'contactName', label: 'Contacto', align: 'left', field: (r) => r.contactName || r.contact },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ]
    }
  },
  watch: {
    page(v) { this.localPage = v },
    rowsPerPage(v) { this.localRowsPerPage = v }
  },
  methods: {
    onPage(v) { this.$emit('update:page', v) },
    onRowsPerPage(v) { this.$emit('update:rows-per-page', v) }
  }
}
</script>

<style scoped>
.suppliers-table { min-height: 300px; }
</style>


