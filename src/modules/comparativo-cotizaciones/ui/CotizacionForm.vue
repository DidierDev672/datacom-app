<template>
  <div class="cotizacion-wizard full-width bg-white rounded-xl shadow-premium overflow-hidden">
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      flat
      class="no-shadow"
    >
      <!-- Paso 1: Proveedores -->
      <q-step
        :name="1"
        title="Proveedores"
        icon="business"
        :done="step > 1"
      >
        <tabla-proveedores v-model="form.proveedores" />
      </q-step>

      <!-- Paso 2: Detalle de Ítems -->
      <q-step
        :name="2"
        title="Detalle de Ítems"
        icon="list"
        :done="step > 2"
      >
        <tabla-items v-model="form.items" :proveedores="form.proveedores" />
      </q-step>

      <!-- Paso 3: Comparativo -->
      <q-step
        :name="3"
        title="Comparativo"
        icon="compare_arrows"
        :done="step > 3"
      >
        <matriz-comparativa 
          v-if="matrizData" 
          :matriz-data="matrizData" 
          :ganador.sync="form.proveedorGanadorId" 
          @update:item-winner="onItemWinnerUpdate"
        />
      </q-step>

      <!-- Paso 4: Pago y Confirmación -->
      <q-step
        :name="4"
        title="Pago y Confirmación"
        icon="payment"
      >
        <div class="q-pa-md q-gutter-y-lg">
          <div class="row q-col-gutter-md">
            <q-input v-model="form.codigo" label="Código Cotización" outlined class="col-12 col-md-4" />
            <q-input v-model="form.titulo" label="Título / Referencia" outlined class="col-12 col-md-8" />
            <q-input v-model="form.fechaCotizacion" type="date" label="Fecha" outlined class="col-12 col-md-4" />
          </div>

          <div class="q-gutter-sm">
            <q-item-label class="text-weight-bold">Forma de Pago</q-item-label>
            <q-option-group
              v-model="form.formaPago"
              :options="formaPagoOptions"
              type="radio"
              inline
            />
          </div>

          <div v-if="form.formaPago === 'CREDITO'" class="row q-col-gutter-md">
            <q-input v-model.number="form.plazoDias" type="number" label="Plazo (Días)" outlined class="col-12 col-md-4" />
          </div>

          <div v-if="form.formaPago === 'OTRO'" class="row q-col-gutter-md">
            <q-input v-model="form.descripcionPago" label="Descripción del Pago" outlined class="col-12" />
          </div>

          <q-input v-model="form.observaciones" type="textarea" label="Observaciones Adicionales" outlined />
        </div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="row justify-between q-pa-md bg-grey-1">
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Atrás"
            class="q-ml-sm"
          />
          <div v-else></div>

          <q-btn
            @click="handleNext"
            color="primary"
            :label="step === 4 ? 'Confirmar Cotización' : 'Siguiente'"
            :loading="isLoading"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>

    <q-inner-loading :showing="isLoading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
import TablaProveedores from './components/TablaProveedores.vue';
import TablaItems from './components/TablaItems.vue';
import MatrizComparativa from './components/MatrizComparativa.vue';
import { construirMatrizComparacion } from '../utils/cotizacion.utils';
import { useCotizacionStore } from '../application/cotizacion.store';

export default {
  components: { TablaProveedores, TablaItems, MatrizComparativa },
  data() {
    const store = useCotizacionStore();
    return {
      store,
      step: 1,
      isLoading: false,
      matrizData: null,
      form: {
        codigo: '',
        titulo: '',
        fechaCotizacion: new Date().toISOString().substring(0, 10),
        proveedores: [],
        items: [],
        formaPago: 'CONTADO',
        plazoDias: null,
        descripcionPago: null,
        observaciones: '',
        proveedorGanadorId: null
      },
      formaPagoOptions: [
        { label: 'Contado', value: 'CONTADO' },
        { label: 'Crédito', value: 'CREDITO' },
        { label: 'Transferencia', value: 'TRANSFERENCIA' },
        { label: 'Otro', value: 'OTRO' }
      ]
    }
  },
  methods: {
    handleNext() {
      if (this.step === 1) {
        if (this.form.proveedores.length < 2) {
          this.$q.notify({ type: 'negative', message: 'Se requieren al menos 2 proveedores' });
          return;
        }
        this.step = 2;
      } else if (this.step === 2) {
        if (this.form.items.length === 0) {
          this.$q.notify({ type: 'negative', message: 'Debe agregar al menos un producto' });
          return;
        }
        this.matrizData = construirMatrizComparacion(this.form.items, this.form.proveedores);
        this.step = 3;
      } else if (this.step === 3) {
        if (!this.form.proveedorGanadorId) {
          this.$q.notify({ type: 'warning', message: 'Se recomienda seleccionar un ganador' });
        }
        this.step = 4;
      } else {
        this.submit();
      }
    },
    onItemWinnerUpdate({ producto, ganadorId }) {
      this.form.items.forEach(item => {
        if (item.nombreProducto.trim() === producto) {
          item.proveedorGanadorId = ganadorId;
        }
      });
    },
    async submit() {
      this.isLoading = true;
      try {
        const payload = {
          ...this.form,
          // Adaptar para el backend: el backend espera NIT del proveedor en los items
          items: this.form.items.map(i => ({
            ...i,
            proveedorNit: i.proveedorNit
          }))
        };
        await this.store.create(payload);
        this.$q.notify({ type: 'positive', message: 'Cotización creada exitosamente' });
        this.$emit('success');
      } catch (err) {
        this.$q.notify({ type: 'negative', message: this.store.error || 'Error al guardar' });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style src="../ui/cotizacion.styles.css"></style>
