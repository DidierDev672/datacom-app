<template>
  <div>
    <div class="text-h6 page-title-box">Proveedores</div>
    <div class="q-ma-md bg-white">
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="filters.nit" label="Filtrar por NIT" clearable />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="filters.name" label="Filtrar por Nombre" clearable />
            </div>
            <div class="col-12 col-md-3 flex items-end">
              <q-btn color="primary" dense icon="search" label="Buscar" @click="onSearch(1)" />
              <q-btn flat dense icon="clear_all" label="Limpiar" class="q-ml-sm" @click="clearFilters" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <suppliers-table
            :rows="rows"
            :loading="loading"
            :page="uiPage"
            :rows-per-page="size"
            :total-pages="totalPages"
            :total-elements="totalElements"
            @update:page="onPage"
            @update:rows-per-page="onSize"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SuppliersTable from './components/SuppliersTable.vue'

export default {
  name: 'PageModuloSupplierIndex',
  components: { SuppliersTable },
  data() {
    return {
      filters: { nit: '', name: '' },
      uiPage: 1
    }
  },
  computed: {
    ...mapGetters('supplier', [
      'getLoading',
      'getError',
      'getItems',
      'getPage',
      'getSize',
      'getTotalElements',
      'getTotalPages'
    ]),
    loading() { return this.getLoading },
    rows() { return this.getItems || [] },
    size() { return this.getSize || 10 },
    totalElements() { return this.getTotalElements || 0 },
    totalPages() { return this.getTotalPages || 1 },
  },
  created() {
    this.onSearch(1)
  },
  methods: {
    ...mapActions('supplier', ['searchSuppliers']),
    async onSearch(page = 1) {
      const apiPage = (page - 1) < 0 ? 0 : (page - 1)
      await this.searchSuppliers({
        name: this.filters.name || '',
        nit: this.filters.nit || '',
        page: apiPage,
        size: this.size
      })
      this.uiPage = page
    },
    async onPage(newPage) {
      this.uiPage = newPage
      await this.onSearch(newPage)
    },
    async onSize(newSize) {
      await this.searchSuppliers({
        name: this.filters.name || '',
        nit: this.filters.nit || '',
        page: 0,
        size: newSize
      })
      this.uiPage = 1
    },
    clearFilters() {
      this.filters = { nit: '', name: '' }
      this.onSearch(1)
    }
  }
}
</script>

<style scoped>
</style>


