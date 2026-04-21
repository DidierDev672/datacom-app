<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Fila 1 -->
      <div class="col-12 col-md-4">
        <q-input 
          v-model="model.codigo" 
          label="Código del formato *" 
          hint="Ej: FODC-PCO-F-019" 
          :error="v$.codigo.$error" 
          error-message="El código es requerido"
          @blur="v$.codigo.$touch"
          dense 
          outlined 
        />
      </div>
      <div class="col-12 col-md-8">
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
      codigo: { required },
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

<style scoped>
::v-deep .text-h5 {
  font-size: 20px !important;
  font-weight: 600 !important;
}
::v-deep .text-h6, ::v-deep .text-subtitle1 {
  font-size: 18px !important;
  font-weight: 600 !important;
}
::v-deep .q-field__label {
  font-size: 13px !important;
  font-weight: 500 !important;
}
::v-deep .q-field__bottom, ::v-deep .q-field__messages, ::v-deep .q-field__hint {
  font-size: 12px !important;
  font-weight: 400 !important;
}
::v-deep .q-btn {
  font-size: 16px !important;
  font-weight: 500 !important;
}

/* --- Correcciones a los Inputs --- */
::v-deep .q-field:not(.q-textarea) .q-field__control {
  height: 44px !important;
  min-height: 44px !important;
}
::v-deep .q-field__control {
  border-radius: 8px !important;
}
::v-deep .q-field__native {
  padding: 10px 12px !important;
  font-size: 14px !important;
}
::v-deep .q-field {
  margin-bottom: 16px !important;
}
::v-deep .q-table .q-field {
  margin-bottom: 0 !important;
}

/* Estados: focus + error obligatorios */
::v-deep .q-field--focused .q-field__control:after {
  border-width: 2px !important;
}
::v-deep .q-field--error .q-field__control:before {
  border-color: #C10015 !important;
  border-width: 2px !important;
}
</style>
