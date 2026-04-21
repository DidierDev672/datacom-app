<template>
  <div class="row q-col-gutter-md">
    <div class="col-12 text-h6">Datos de la Orden</div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.numero" label="Número de orden *" @blur="$v.model.numero.$touch()" :error="$v.model.numero.$error" error-message="Formato requerido OCS-NNN-YYYY" />
    </div>
    <div class="col-12 col-md-4">
      <q-input type="date" v-model="model.fechaEmision" label="Fecha de emisión *" @blur="$v.model.fechaEmision.$touch()" :error="$v.model.fechaEmision.$error" error-message="Fecha es requerida" />
    </div>
    <div class="col-12 col-md-4">
      <q-input v-model.number="model.porcentajeIva" type="number" label="Porcentaje IVA (%) *" @blur="$v.model.porcentajeIva.$touch()" :error="$v.model.porcentajeIva.$error" error-message="Valor entre 0 y 100 requerido" />
    </div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.empresa" label="Empresa compradora *" @blur="$v.model.empresa.$touch()" :error="$v.model.empresa.$error" error-message="Requerido" />
    </div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.proyecto" label="Proyecto asociado *" @blur="$v.model.proyecto.$touch()" :error="$v.model.proyecto.$error" error-message="Requerido" />
    </div>

    <div class="col-12 text-h6 q-mt-md">Datos del Proveedor</div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.proveedor.nombre" label="Nombre o Razón social *" @blur="$v.model.proveedor.nombre.$touch()" :error="$v.model.proveedor.nombre.$error" error-message="Requerido" />
    </div>
    <div class="col-12 col-md-6">
      <q-input v-model="model.proveedor.nit" label="NIT / Documento *" @blur="$v.model.proveedor.nit.$touch()" :error="$v.model.proveedor.nit.$error" error-message="Requerido" />
    </div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.proveedor.direccion" label="Dirección *" @blur="$v.model.proveedor.direccion.$touch()" :error="$v.model.proveedor.direccion.$error" error-message="Requerido" />
    </div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.proveedor.telefono" label="Teléfono / Contacto" />
    </div>
    <div class="col-12 col-md-4">
      <q-input v-model="model.proveedor.email" type="email" label="Correo electrónico" @blur="$v.model.proveedor.email.$touch()" :error="$v.model.proveedor.email.$error" error-message="Formato inválido" />
    </div>
  </div>
</template>

<script>
import { required, email, numeric, between } from 'vuelidate/lib/validators';

const patternOcs = (value) => {
  if (!value) return true;
  return /^OCS-\d{3}-\d{4}$/.test(value);
};

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
  validations: {
    model: {
      numero: { required, patternOcs },
      fechaEmision: { required },
      empresa: { required },
      proyecto: { required },
      porcentajeIva: { required, numeric, between: between(0, 100) },
      proveedor: {
        nombre: { required },
        nit: { required },
        direccion: { required },
        email: { email }
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
