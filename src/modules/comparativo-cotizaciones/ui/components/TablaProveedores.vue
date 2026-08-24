<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6 text-weight-bold">Proveedores a Comparar</div>
    </div>

    <q-table
      :data="value"
      :columns="columns"
      row-key="nit"
      flat
      bordered
      hide-bottom
      class="rounded-xl shadow-premium"
      :pagination="{ rowsPerPage: 0 }"
    >
      <template v-slot:body-cell-nombre="props">
        <q-td :props="props">
          <q-input v-model="props.row.nombre" dense outlined class="text-input" />
        </q-td>
      </template>
      <template v-slot:body-cell-nit="props">
        <q-td :props="props">
          <q-input 
            v-model="props.row.nit" 
            dense 
            outlined 
            @input="checkDuplicate(props.row)"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-email="props">
        <q-td :props="props">
          <q-input v-model="props.row.email" dense outlined />
        </q-td>
      </template>
      <template v-slot:body-cell-telefono="props">
        <q-td :props="props">
          <q-input v-model="props.row.telefono" dense outlined />
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
        icon="add" 
        label="Agregar Proveedor a la Comparativa" 
        padding="10px 40px"
        outline 
        no-caps 
        @click="openSelector"
        class="rounded-lg shadow-sm"
      />
    </div>

    <!-- Modal de Selección de Proveedores -->
    <q-dialog v-model="showSelector" persistent>
      <q-card style="min-width: 600px; border-radius: 16px">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6 text-white">Seleccionar Proveedores</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-mb-md justify-between items-center">
            <q-input v-model="filter" dense outlined placeholder="Filtrar proveedores..." class="col-grow q-mr-md">
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
            <q-btn flat color="primary" label="Seleccionar todos" no-caps @click="selectAll" />
          </div>

          <q-list separator class="provider-list">
            <q-item 
              v-for="t in filteredTerceros" 
              :key="t.id" 
              tag="label" 
              v-ripple 
              class="provider-item"
              :class="{ 'selected': selectedIds.includes(t.id) }"
            >
              <q-item-section avatar top>
                <q-checkbox 
                  v-model="selectedIds" 
                  :val="t.id" 
                  color="primary" 
                  class="custom-checkbox" 
                />
              </q-item-section>

              <q-item-section>
                <div class="provider-header-row">
                  <span class="provider-name">
                    {{ t.nombreComercial || t.razonSocial || ((t.nombres || '') + ' ' + (t.apellidos || '')).trim() || 'Proveedor sin nombre' }}
                  </span>
                  <span 
                    class="provider-nit" 
                    :class="{ 'text-grey-5': !t.identificacion }"
                  >
                    NIT: {{ t.identificacion || 'Sin información' }}
                  </span>
                </div>
                
                <div class="provider-details-row">
                  <div class="detail-item" v-if="t.representanteLegal">
                    <q-icon name="person" class="detail-icon" />
                    <span>{{ t.representanteLegal }}</span>
                  </div>
                  
                  <div class="detail-item" v-if="t.email">
                    <q-icon name="email" class="detail-icon" />
                    <span>{{ t.email }}</span>
                  </div>
                  
                  <div class="detail-item" v-if="t.telefono">
                    <q-icon name="phone" class="detail-icon" />
                    <span>{{ t.telefono }}</span>
                  </div>
                  
                  <div v-if="!t.representanteLegal && !t.email && !t.telefono" class="no-info">
                    Sin información de contacto
                  </div>
                </div>
              </q-item-section>
            </q-item>
            
            <div v-if="loading" class="q-pa-xl text-center">
              <q-spinner color="primary" size="40px" />
              <div class="text-subtitle2 q-mt-md text-grey-7">Cargando proveedores...</div>
            </div>
            
            <div v-if="!loading && filteredTerceros.length === 0" class="empty-state">
              <q-icon name="search_off" size="48px" color="grey-4" />
              <div class="q-mt-sm">No se encontraron proveedores para "{{ filter }}"</div>
            </div>
          </q-list>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup no-caps />
          <q-btn 
            unelevated 
            label="Confirmar selección" 
            color="primary" 
            :disable="selectedIds.length === 0"
            @click="confirmSelection" 
            no-caps 
            padding="8px 24px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['value'],
  data() {
    return {
      showSelector: false,
      loading: false,
      terceros: [],
      selectedIds: [],
      filter: '',
      columns: [
        { name: 'nombre', label: 'Nombre / Razón Social', align: 'left', field: 'nombre' },
        { name: 'nit', label: 'NIT / ID', align: 'left', field: 'nit' },
        { name: 'email', label: 'Email', align: 'left', field: 'email' },
        { name: 'telefono', label: 'Teléfono', align: 'left', field: 'telefono' },
        { name: 'acciones', label: '', align: 'center' }
      ]
    }
  },
  computed: {
    filteredTerceros() {
      if (!this.filter) return this.terceros;
      const f = this.filter.toLowerCase();
      return this.terceros.filter(t => 
        (t.nombreComercial && t.nombreComercial.toLowerCase().includes(f)) || 
        (t.identificacion && t.identificacion.toLowerCase().includes(f)) ||
        (t.razonSocial && t.razonSocial.toLowerCase().includes(f)) ||
        (t.representanteLegal && t.representanteLegal.toLowerCase().includes(f))
      );
    }
  },
  methods: {
    async openSelector() {
      this.showSelector = true;
      this.loading = true;
      this.selectedIds = [];
      try {
        const res = await axios.get('http://localhost:28181/api/v1/terceros');
        this.terceros = res.data.results || [];
      } catch (err) {
        this.$q.notify({ type: 'negative', message: 'Error al cargar el catálogo de proveedores' });
      } finally {
        this.loading = false;
      }
    },
    selectAll() {
      this.selectedIds = this.filteredTerceros.map(t => t.id);
    },
    confirmSelection() {
      const selections = this.terceros.filter(t => this.selectedIds.includes(t.id));
      
      const currentNits = this.value.map(v => v.nit);
      const newItems = selections
        .filter(s => !currentNits.includes(s.identificacion))
        .map(s => ({
          nombre: s.nombreComercial || s.razonSocial || ((s.nombres || '') + ' ' + (s.apellidos || '')).trim() || 'Proveedor sin nombre',
          nit: s.identificacion,
          email: s.email || '',
          telefono: s.telefono || ''
        }));

      if (newItems.length === 0) {
        this.$q.notify({ type: 'info', message: 'Los proveedores seleccionados ya están en la lista' });
        this.showSelector = false;
        return;
      }

      const newList = [...this.value, ...newItems];
      this.$emit('input', newList);
      this.showSelector = false;
      this.$q.notify({ type: 'positive', message: `${newItems.length} proveedores agregados` });
    },
    addProveedor() {
      const newList = [...this.value, { nombre: '', nit: '', email: '', telefono: '' }];
      this.$emit('input', newList);
    },
    remove(index) {
      const newList = [...this.value];
      newList.splice(index, 1);
      this.$emit('input', newList);
    },
    checkDuplicate(row) {
      const count = this.value.filter(p => p.nit === row.nit).length;
      if (count > 1) {
        this.$q.notify({ type: 'warning', message: 'NIT duplicado' });
      }
    }
  }
}
</script>

<style scoped>
.provider-list {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow-y: auto;
  max-height: 50vh;
}

.provider-item {
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
  transition: all 0.2s ease;
  cursor: pointer;
}

.provider-item:last-child {
  border-bottom: none;
}

.provider-item:hover {
  background: #F9FAFB;
}

.provider-item.selected {
  background: #EFF6FF;
  border-left: 3px solid #2563EB;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  margin-top: 4px;
}

.provider-header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.provider-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  line-height: 1.2;
}

.provider-nit {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  background: #F3F4F6;
  padding: 2px 8px;
  border-radius: 4px;
}

.provider-details-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 400;
  color: #6B7280;
}

.detail-icon {
  width: 16px;
  height: 16px;
  font-size: 16px;
  margin-right: 6px;
  color: #6B7280;
}

.no-info {
  font-size: 13px;
  color: #9CA3AF;
  font-style: italic;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #9CA3AF;
}

/* Responsive */
@media (max-width: 600px) {
  .provider-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .provider-details-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 10px;
  }
  
  .provider-item {
    padding: 20px 16px;
  }
  
  .q-dialog__inner--minimized > div {
    max-width: 95vw !important;
  }
}
</style>
