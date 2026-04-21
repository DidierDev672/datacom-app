<template>
  <div>
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <TablaItems ref="tablaGrid" v-model="model.items" />
      </div>
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <ResumenTotales :items="model.items" :porcentajeIva="model.porcentajeIva || 0" />
      </div>
    </div>
  </div>
</template>

<script>
import TablaItems from './TablaItems.vue';
import ResumenTotales from './ResumenTotales.vue';

export default {
  name: 'StepDetalle',
  components: {
    TablaItems,
    ResumenTotales
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      model: this.value
    };
  },
  methods: {
    validate() {
      const isValidGrid = this.$refs.tablaGrid.validateAll();
      if (!isValidGrid) {
        this.$q.notify({
          color: 'negative',
          message: 'Debe agregar al menos un ítem y llenar todos los campos requeridos.'
        });
        return false;
      }
      return true;
    }
  }
}
</script>
