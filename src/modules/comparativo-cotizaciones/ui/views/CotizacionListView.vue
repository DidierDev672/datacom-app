<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <h1 class="text-h4 text-weight-bold q-mb-xs">Comparativo de Cotizaciones</h1>
        <p class="text-grey-7">Gestión y análisis de ofertas de proveedores</p>
      </div>
      <q-btn 
        color="primary" 
        icon="add" 
        label="Nueva Cotización" 
        padding="12px 24px"
        class="rounded-xl shadow-premium"
        no-caps
        @click="$router.push({ name: 'cotizacion-create' })"
      />
    </div>

    <div class="row q-col-gutter-lg">
      <div v-for="cot in store.cotizaciones" :key="cot.idCotizacion" class="col-12 col-md-4">
        <q-card class="rounded-xl shadow-premium hover-scale transition-all">
          <q-card-section>
            <div class="row items-center justify-between q-mb-sm">
              <q-badge :color="getStatusColor(cot.status)" class="q-pa-xs px-md">
                {{ cot.status }}
              </q-badge>
              <div class="text-caption text-grey-6">{{ cot.fechaCotizacion }}</div>
            </div>
            <div class="text-h6 text-weight-bold q-mb-xs">{{ cot.titulo }}</div>
            <div class="text-caption text-blue-8 text-weight-bold">{{ cot.codigo }}</div>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="row items-center justify-between">
            <div class="text-caption">
              <div class="text-grey-6">Proveedores</div>
              <div class="text-weight-bold">{{ (cot.proveedores && cot.proveedores.length) ? cot.proveedores.length : 0 }}</div>
            </div>
            <q-btn 
              flat 
              color="primary" 
              label="Ver Detalles" 
              no-caps 
              @click="$router.push({ name: 'cotizacion-detail', params: { id: cot.idCotizacion } })" 
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-if="store.cotizaciones.length === 0 && !store.isLoading" class="flex flex-center q-pa-xl">
      <div class="text-center">
        <q-icon name="assignment_late" size="80px" color="grey-4" />
        <p class="text-h6 text-grey-5 q-mt-md">No hay cotizaciones registradas</p>
      </div>
    </div>

    <q-inner-loading :showing="store.isLoading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { useCotizacionStore } from '../../application/cotizacion.store';

export default {
  data() {
    const store = useCotizacionStore();
    return { store };
  },
  mounted() {
    this.store.fetchAll();
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        BORRADOR: 'grey-7',
        EN_REVISION: 'blue-6',
        APROBADA: 'positive',
        RECHAZADA: 'negative'
      };
      return colors[status] || 'grey';
    }
  }
}
</script>

<style scoped>
.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
}
.transition-all {
  transition: all 0.3s ease;
}
</style>
