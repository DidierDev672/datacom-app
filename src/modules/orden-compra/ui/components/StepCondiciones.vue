<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 text-h6">Condiciones de Negociación</div>
    <div class="col-12 col-md-4">
      <q-select v-model="model.condiciones.formaPago" :options="['CONTADO', 'CREDITO']" label="Forma de pago *" @blur="$v.model.condiciones.formaPago.$touch()" :error="$v.model.condiciones.formaPago.$error" error-message="Requerido" />
    </div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.condiciones.plazoPago" label="Plazo de pago" placeholder="Ej. A 30 días" />
    </div>
    <div class="col-12 col-md-4">
      <q-input type="date" v-model="model.condiciones.fechaEntrega" label="Fecha de entrega *" @blur="$v.model.condiciones.fechaEntrega.$touch()" :error="$v.model.condiciones.fechaEntrega.$error" error-message="Requerida" />
    </div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.condiciones.lugarEntrega" label="Lugar de entrega *" @blur="$v.model.condiciones.lugarEntrega.$touch()" :error="$v.model.condiciones.lugarEntrega.$error" error-message="Requerido" />
    </div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.condiciones.responsableRecepcion" label="Responsable de recepción" />
    </div>
    <div class="col-12">
      <q-input v-model="model.condiciones.garantias" type="textarea" rows="3" label="Garantías" />
    </div>

    <div class="col-12 text-h6 q-mt-md">Observaciones & Recomendaciones</div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.observaciones" type="textarea" rows="4" label="Observaciones" />
    </div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.recomendaciones" type="textarea" rows="4" label="Recomendaciones" />
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'StepCondiciones',
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
  validations: {
    model: {
      condiciones: {
        formaPago: { required },
        fechaEntrega: { 
          required, 
          validDate(val) {
            if (!val || !this.model.fechaEmision) return true;
            return new Date(val) >= new Date(this.model.fechaEmision);
          } 
        },
        lugarEntrega: { required }
      }
    }
  },
  methods: {
    validate() {
      this.$v.$touch();
      if (this.$v.model.condiciones.fechaEntrega.$error && !this.$v.model.condiciones.fechaEntrega.validDate) {
        this.$q.notify({
          color: 'negative',
          message: 'La fecha de entrega no puede ser anterior a la fecha de emisión.'
        });
      }
      return !this.$v.$invalid;
    }
  }
}
</script>
