<template>
  <div class="q-pa-md">
    <div class="text-h6 text-weight-bold q-mb-md">Matriz de Comparación Multi-Proveedor</div>
    
    <div class="matrix-container shadow-premium rounded-xl overflow-hidden">
      <q-markup-table flat bordered class="matrix-table">
      <thead class="bg-grey-2">
        <tr>
          <th class="text-left sticky-column">Producto</th>
          <th v-for="prov in matrizData.proveedores" :key="prov.id" class="text-center supplier-col">
            {{ prov.nombre }}
          </th>
          <th class="text-center">Dif. %</th>
          <th class="text-center">Ganador</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(prod, idx) in matrizData.matriz" :key="idx">
          <td class="sticky-column">
            <div class="text-weight-bold text-grey-9 text-no-wrap">{{ prod.producto }}</div>
            <div class="text-caption text-grey-6">{{ prod.cantidad }} {{ prod.unidad }}</div>
          </td>
          <td 
            v-for="(precio, pIdx) in prod.precios" 
            :key="pIdx"
            class="text-center"
            :class="getCellClass(precio)"
          >
            <div v-if="precio">
              <div class="text-caption text-grey-7">{{ precio.valorUnitario | currency }}</div>
              <div class="text-weight-bold">{{ precio.valorTotal | currency }}</div>
            </div>
            <div v-else class="text-grey-4">-</div>
          </td>
          <td class="text-center text-caption">
            <span v-if="prod.min > 0 && prod.max > 0">
              {{ getDiferencia(prod) }}%
            </span>
            <span v-else>-</span>
          </td>
          <td class="text-center">
            <q-select
              v-model="prod.ganadorId"
              :options="getOptionsForRow(prod)"
              dense
              outlined
              emit-value
              map-options
              placeholder="Elegir"
              style="min-width: 120px"
              @input="onWinnerChange(prod)"
            />
          </td>
        </tr>
      </tbody>
      <tfoot class="bg-blue-grey-1">
        <tr class="text-weight-bold">
          <td class="sticky-column">TOTAL COTIZACIÓN</td>
          <td v-for="prov in matrizData.proveedores" :key="'total-'+prov.id" class="text-center text-primary supplier-col">
            {{ prov.total | currency }}
          </td>
          <td colspan="2"></td>
        </tr>
      </tfoot>
    </q-markup-table>
    </div>

    <div class="q-mt-md row items-center q-gutter-x-md text-caption text-grey-7">
      <div class="row items-center"><div class="legend-box bg-green-1 q-mr-xs"></div> Mejor Precio</div>
      <div class="row items-center"><div class="legend-box bg-red-1 q-mr-xs"></div> Precio más alto</div>
    </div>
  </div>
</template>

<script>
import { calcularDiferencia } from '../../utils/cotizacion.utils';

export default {
  props: ['matrizData', 'ganador'],
  filters: {
    currency(val) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val || 0);
    }
  },
  methods: {
    getOptionsForRow(prod) {
      return prod.precios
        .filter(p => p !== null)
        .map(p => {
          const prov = this.matrizData.proveedores.find(pr => pr.id === p.proveedorId);
          return {
            label: prov ? prov.nombre : p.proveedorId,
            value: p.proveedorId
          };
        });
    },
    onWinnerChange(prod) {
      this.$emit('update:item-winner', { producto: prod.producto, ganadorId: prod.ganadorId });
    },
    getCellClass(precio) {
      if (!precio) return '';
      if (precio.esMenor) return 'bg-green-1 text-positive';
      if (precio.esMayor) return 'bg-red-1 text-negative';
      return '';
    },
    getDiferencia(prod) {
      if (prod.min === 0) return 0;
      return calcularDiferencia(prod.min, prod.max).toFixed(1);
    }
  }
}
</script>

<style scoped>
.bg-green-1 { background-color: #e6fffa !important; }
.bg-red-1 { background-color: #fff5f5 !important; }
.bg-green-1 { background-color: #e6fffa !important; }
.bg-red-1 { background-color: #fff5f5 !important; }
.text-positive { color: #21BA45 !important; }
.text-negative { color: #C10015 !important; }
.legend-box { width: 12px; height: 12px; border-radius: 2px; border: 1px solid rgba(0,0,0,0.1); }

.matrix-container {
  max-width: 100%;
  overflow-x: auto;
}

.matrix-table {
  min-width: 800px;
}

.supplier-col {
  min-width: 180px;
  max-width: 250px;
  white-space: normal;
}

.sticky-column {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: inherit !important;
  border-right: 1px solid #e2e8f0;
}

thead .sticky-column {
  z-index: 2;
  background-color: #f5f5f5 !important;
}

tfoot .sticky-column {
  z-index: 2;
  background-color: #eceff1 !important;
}
</style>
