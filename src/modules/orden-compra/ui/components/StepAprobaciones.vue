<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 text-h6">Flujo de Aprobación</div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.aprobaciones.elaboradoPor" label="Elaborado por *" @blur="$v.model.aprobaciones.elaboradoPor.$touch()" :error="$v.model.aprobaciones.elaboradoPor.$error" error-message="Requerido" />
    </div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.aprobaciones.revisadoPor" label="Revisado por" />
    </div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.aprobaciones.aprobadoPor" label="Aprobado por *" @blur="$v.model.aprobaciones.aprobadoPor.$touch()" :error="$v.model.aprobaciones.aprobadoPor.$error" error-message="Requerido" />
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'StepAprobaciones',
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
      aprobaciones: {
        elaboradoPor: { required },
        aprobadoPor: { required }
      }
    }
  },
  methods: {
    validate() {
      this.$v.$touch();
      return !this.$v.$invalid;
    }
  }
}
</script>
