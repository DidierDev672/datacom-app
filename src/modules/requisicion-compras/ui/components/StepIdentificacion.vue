<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Fila 1 -->
      <div class="col-12 col-md-12">
        <q-input 
          v-model="model.proyecto" 
          label="Proyecto *" 
          :error="v$.proyecto.$error" 
          error-message="El proyecto es requerido"
          @blur="v$.proyecto.$touch"
          dense 
          outlined 
        />
      </div>

      <!-- Fila 2 -->
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.lineaAccion" 
          label="Línea de acción *" 
          :error="v$.lineaAccion.$error" 
          error-message="La línea de acción es requerida"
          @blur="v$.lineaAccion.$touch"
          dense 
          outlined 
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.mandato" 
          label="Mandato (Opcional)" 
          dense 
          outlined 
        />
      </div>

      <!-- Fila 3 -->
      <div class="col-12 col-md-4">
        <q-input 
          v-model="model.municipio" 
          label="Municipio *" 
          :error="v$.municipio.$error" 
          error-message="El municipio es requerido"
          @blur="v$.municipio.$touch"
          dense 
          outlined 
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input 
          v-model="model.fechaSolicitud" 
          type="date" 
          label="Fecha de solicitud *" 
          stack-label 
          :error="v$.fechaSolicitud.$error" 
          error-message="La fecha de solicitud es requerida"
          @blur="v$.fechaSolicitud.$touch"
          dense 
          outlined 
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input 
          v-model="model.solicitante" 
          label="Funcionario Solicitante *" 
          :error="v$.solicitante.$error" 
          error-message="El solicitante es requerido"
          @blur="v$.solicitante.$touch"
          dense 
          outlined 
        />
      </div>

      <!-- Fila 4 -->
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.lugarEntrega" 
          label="Lugar de entrega *" 
          :error="v$.lugarEntrega.$error" 
          error-message="El lugar de entrega es requerido"
          @blur="v$.lugarEntrega.$touch"
          dense 
          outlined 
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.fechaEntrega" 
          type="date" 
          label="Fecha de entrega *" 
          stack-label 
          :error="v$.fechaEntrega.$error" 
          :error-message="fechaEntregaError"
          @blur="v$.fechaEntrega.$touch"
          dense 
          outlined 
        />
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'StepIdentificacion',
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
  watch: {
    model: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      }
    }
  },
  computed: {
    v$() {
      // Compatibility alias to map Vuelidate instance intuitively
      return this.$v.model;
    },
    fechaEntregaError() {
      if (!this.v$.fechaEntrega.required) return "La fecha de entrega es requerida";
      if (!this.v$.fechaEntrega.isAfterOrEqual) return "La fecha de entrega debe ser igual o posterior a la solicitud";
      return "";
    }
  },
  validations: {
    model: {
      proyecto: { required },
      lineaAccion: { required },
      municipio: { required },
      fechaSolicitud: { required },
      lugarEntrega: { required },
      solicitante: { required },
      fechaEntrega: { 
        required,
        isAfterOrEqual(val, vm) {
          if (!val || !vm.fechaSolicitud) return true;
          return new Date(val) >= new Date(vm.fechaSolicitud);
        }
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

</style>
