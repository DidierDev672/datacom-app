<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col text-h5 text-weight-bold">
        Crear Orden de Compra
      </div>
      <div class="col-auto">
        <q-btn flat color="primary" label="Volver al Listado" @click="$router.push('/compras/ordenes-compra')" />
      </div>
    </div>
    
    <q-card flat bordered class="q-pa-md">
      <OrdenCompraForm @saved="onOrderSaved" />
    </q-card>
  </div>
</template>

<script>
import OrdenCompraForm from '../components/OrdenCompraForm.vue';

export default {
  name: 'OrdenCompraCreateView',
  components: {
    OrdenCompraForm
  },
  methods: {
    onOrderSaved(nuevaOrden) {
      this.$q.notify({
        color: 'positive',
        message: 'Orden de Compra creada exitosamente',
        icon: 'check'
      });
      //this.$router.push(`/compras/ordenes-compra/${nuevaOrden.idOrden}`);
    }
  }
}
</script>
