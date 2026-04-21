<template>
  <div class="q-pa-md">
    <div class="text-h5 text-weight-bold q-mb-md">Nueva Requisición de Compras</div>
    <div class="text-subtitle1 text-grey-8 q-mb-lg">
      Complete el Formulario de Requisición de Compras (FODC-PCO-F-019).
    </div>
    
    <RequisicionStepper />
  </div>
</template>

<script>
import RequisicionStepper from '../components/RequisicionStepper.vue';

export default {
  name: 'RequisicionFormView',
  components: {
    RequisicionStepper
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
