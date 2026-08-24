<template>
  <div class="section-container">
    <div class="row items-center q-mb-md">
      <q-icon name="business" size="24px" color="green" class="q-mr-sm" />
      <span class="text-subtitle1 text-weight-bold">Información del Departamento</span>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Nombre -->
      <div class="col-12 col-md-8">
        <q-input
          :value="value.name"
          @input="updateField('name', $event)"
          label="Nombre del departamento *"
          outlined
          dense
          placeholder="Ej: Recursos Humanos"
          :rules="[
            val => !!val || 'El nombre es requerido',
            val => val.length >= 3 || 'Mínimo 3 caracteres'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="title" />
          </template>
        </q-input>
      </div>

      <!-- Código -->
      <div class="col-12 col-md-4">
        <q-input
          :value="value.code"
          @input="updateField('code', $event)"
          label="Código"
          outlined
          dense
          placeholder="Ej: RRHH"
          counter
          maxlength="20"
          :rules="[
            val => !val || val.length <= 20 || 'Máximo 20 caracteres'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="tag" />
          </template>
        </q-input>
      </div>

      <!-- Descripción -->
      <div class="col-12">
        <q-input
          :value="value.description"
          @input="updateField('description', $event)"
          label="Descripción"
          type="textarea"
          outlined
          dense
          autogrow
          placeholder="Describa el propósito del departamento..."
        />
      </div>

      <!-- Estado -->
      <div class="col-12 col-md-4">
        <q-select
          :value="value.status"
          @input="updateField('status', $event)"
          :options="['ACTIVO', 'INACTIVO']"
          label="Estado *"
          outlined
          dense
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon :name="value.status === 'ACTIVO' ? 'check_circle' : 'cancel'" 
                    :color="value.status === 'ACTIVO' ? 'green' : 'grey'" />
          </template>
        </q-select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SectionDepartamento',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    function updateField(field, val) {
      const updated = { ...props.value, [field]: val };
      emit('input', updated);
    }

    return {
      updateField
    };
  }
};
</script>
