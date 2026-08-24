<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="full-width">
      <div class="row items-center q-mb-lg">
        <q-btn flat round icon="arrow_back" color="grey-7" @click="$router.back()" />
        <h1 class="text-h5 text-weight-bold q-ml-sm q-my-none">Nueva Comparativa de Cotización</h1>
      </div>
      
      <cotizacion-form @success="onSuccess" />
    </div>
  </q-page>
</template>

<script>
import CotizacionForm from '../CotizacionForm.vue';

export default {
  components: { CotizacionForm },
  methods: {
    onSuccess() {
      this.$router.push({ name: 'cotizaciones-list' });
    }
  }
}
</script>
