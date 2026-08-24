<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div v-if="cotizacion" class="max-width-container mx-auto">
      <div class="row items-center justify-between q-mb-xl">
        <div class="row items-center">
          <q-btn flat round icon="arrow_back" color="grey-7" @click="$router.push({ name: 'cotizaciones-list' })" />
          <div class="q-ml-md">
            <h1 class="text-h4 text-weight-bold q-mb-none">{{ cotizacion.titulo }}</h1>
            <div class="row items-center q-gutter-x-md">
              <span class="text-blue-8 text-weight-bold">{{ cotizacion.codigo }}</span>
              <q-badge :color="getStatusColor(cotizacion.status)">{{ cotizacion.status }}</q-badge>
            </div>
          </div>
        </div>
        
        <div class="row q-gutter-sm">
          <q-btn outline color="negative" label="Rechazar" no-caps @click="updateStatus('RECHAZADA')" v-if="cotizacion.status === 'EN_REVISION'" />
          <q-btn unelevated color="positive" label="Aprobar" no-caps @click="updateStatus('APROBADA')" v-if="cotizacion.status === 'EN_REVISION'" />
          <q-btn unelevated color="primary" label="Enviar a Revisión" no-caps @click="updateStatus('EN_REVISION')" v-if="cotizacion.status === 'BORRADOR'" />
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <!-- Fila 1: Matriz en Ancho Completo -->
        <div class="col-12">
          <q-card class="rounded-xl shadow-premium q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Matriz Comparativa Final</div>
              <matriz-comparativa v-if="matrizData" :matriz-data="matrizData" :ganador.sync="cotizacion.proveedorGanadorId" @update:ganador="saveGanador" />
            </q-card-section>
          </q-card>
        </div>

        <!-- Fila 2: Detalles Secundarios -->
        <div class="col-12 col-lg-8">
          <q-card class="rounded-xl shadow-premium q-mb-lg">
            <q-card-section>
              <div class="text-h6 text-weight-bold q-mb-md">Observaciones</div>
              <p class="text-body1 text-grey-8 bg-grey-2 q-pa-md rounded-lg">{{ cotizacion.observaciones || 'Sin observaciones.' }}</p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-lg-4">
          <q-card class="rounded-xl shadow-premium q-mb-lg">
            <q-card-section class="bg-primary text-white">
              <div class="text-subtitle1 text-weight-bold">Condiciones de Pago</div>
            </q-card-section>
            <q-list padding>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Forma de Pago</q-item-label>
                  <q-item-label class="text-weight-bold">{{ cotizacion.formaPago }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-if="cotizacion.plazoDias">
                <q-item-section>
                  <q-item-label caption>Plazo</q-item-label>
                  <q-item-label class="text-weight-bold">{{ cotizacion.plazoDias }} días</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>

          <q-card class="rounded-xl shadow-premium">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-md">Proveedores Participantes</div>
              <q-list separator>
                <q-item v-for="p in cotizacion.proveedores" :key="p.idProveedor">
                  <q-item-section avatar>
                    <q-avatar color="blue-1" text-color="blue-8" icon="business" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ p.nombre }}</q-item-label>
                    <q-item-label caption>{{ p.nit }}</q-item-label>
                  </q-item-section>
                  <q-item-section side v-if="p.idProveedor === cotizacion.proveedorGanadorId">
                    <q-badge color="positive">Ganador</q-badge>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-inner-loading :showing="isLoading">
      <q-spinner-ios size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { useCotizacionStore } from '../../application/cotizacion.store';
import { cotizacionApi } from '../../api/cotizacion.api';
import MatrizComparativa from '../components/MatrizComparativa.vue';
import { construirMatrizComparacion } from '../../utils/cotizacion.utils';

export default {
  components: { MatrizComparativa },
  data() {
    const store = useCotizacionStore();
    return {
      store,
      cotizacion: null,
      matrizData: null,
      isLoading: false
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      try {
        const id = this.$route.params.id;
        const res = await cotizacionApi.getById(id);
        this.cotizacion = res.data;
        this.matrizData = construirMatrizComparacion(this.cotizacion.items, this.cotizacion.proveedores);
      } catch (err) {
        this.$q.notify({ type: 'negative', message: 'Error al cargar datos' });
      } finally {
        this.isLoading = false;
      }
    },
    async saveGanador(proveedorId) {
      try {
        await cotizacionApi.setGanador(this.cotizacion.idCotizacion, proveedorId);
        this.$q.notify({ type: 'positive', message: 'Proveedor ganador seleccionado' });
      } catch (err) {
        this.$q.notify({ type: 'negative', message: 'Error al guardar ganador' });
      }
    },
    async updateStatus(status) {
      try {
        await cotizacionApi.updateStatus(this.cotizacion.idCotizacion, status);
        this.cotizacion.status = status;
        this.$q.notify({ type: 'positive', message: `Estado actualizado a ${status}` });
      } catch (err) {
        this.$q.notify({ type: 'negative', message: 'Error al actualizar estado' });
      }
    },
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
.max-width-container { max-width: 1440px; margin: 0 auto; }
</style>
