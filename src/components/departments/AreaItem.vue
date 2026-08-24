<template>
  <q-card flat bordered class="q-mb-sm q-pa-md area-card">
    <!-- Fila 1: Campos principales -->
    <div class="row q-col-gutter-md items-start">
      <div class="col-12 col-md-5">
        <q-input
          :value="value.name"
          @input="updateField('name', $event)"
          label="Nombre del área *"
          dense
          outlined
          placeholder="Ej: Desarrollo Frontend"
          :rules="[
            val => !!val || 'El nombre es requerido',
            val => val.length >= 2 || 'Mínimo 2 caracteres'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="badge" size="20px" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-4">
        <q-input
          :value="value.manager"
          @input="updateField('manager', $event)"
          label="Responsable"
          dense
          outlined
          placeholder="Nombre del encargado"
        >
          <template v-slot:prepend>
            <q-icon name="person" size="20px" />
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-2">
        <q-select
          :value="value.status"
          @input="updateField('status', $event)"
          :options="['ACTIVO', 'INACTIVO']"
          label="Estado *"
          dense
          outlined
          emit-value
          map-options
        />
      </div>

      <div class="col-12 col-md-1 flex items-center justify-end">
        <q-btn
          flat
          round
          icon="delete"
          color="red"
          size="sm"
          @click="$emit('remove')"
        >
          <q-tooltip>Eliminar área</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Fila 2: Descripción -->
    <div class="row q-mt-sm">
      <div class="col-12">
        <q-input
          :value="value.description"
          @input="updateField('description', $event)"
          label="Descripción del área"
          type="textarea"
          outlined
          dense
          autogrow
          placeholder="Breve descripción de las funciones del área"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'AreaItem',
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

<style scoped>
.area-card {
  transition: all 0.3s ease;
  border-left: 4px solid #4E9C4C;
}
.area-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
