<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Fila 1 -->
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.proyecto" 
          label="Proyecto *" 
          :error="v$.proyecto.$error" 
          error-message="El proyecto es requerido"
          @blur="v$.proyecto.$touch"
          dense 
          outlined 
          readonly
          hint="Heredado de la pestaña Identificación"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.lineaAccion" 
          label="Línea de acción *" 
          :error="v$.lineaAccion.$error" 
          error-message="La línea de acción es requerida"
          @blur="v$.lineaAccion.$touch"
          dense 
          outlined 
          readonly
          hint="Heredado de la pestaña Identificación"
        />
      </div>

      <!-- Fila 2 -->
      <div class="col-12">
        <q-input 
          v-model="model.justificacion" 
          type="textarea"
          label="Justificación *" 
          placeholder="Incluye la necesidad, el problema que resuelve, el impacto en el proyecto y la urgencia si aplica."
          :error="v$.justificacion.$error" 
          error-message="La justificación debe tener al menos 20 caracteres"
          @blur="v$.justificacion.$touch"
          dense 
          outlined 
          rows="4"
        />
      </div>

      <!-- Fila 3 -->
      <div class="col-12">
        <q-input 
          v-model="model.recomendaciones" 
          type="textarea"
          label="Recomendaciones y observaciones (Opcional)" 
          dense 
          outlined 
          rows="3"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'StepJustificacion',
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
      return this.$v.model;
    }
  },
  validations: {
    model: {
      proyecto: { required },
      lineaAccion: { required },
      justificacion: { required, minLength: minLength(20) }
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
