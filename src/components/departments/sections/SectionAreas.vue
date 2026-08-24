<template>
  <div class="section-container q-mt-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <q-icon name="groups" size="24px" color="green" class="q-mr-sm" />
        <span class="text-subtitle1 text-weight-bold">Áreas de Trabajo</span>
        <span class="text-caption text-grey q-ml-sm">
          ({{ value.areas.length }} área{{ value.areas.length !== 1 ? 's' : '' }})
        </span>
      </div>
      <div class="col-auto">
        <q-btn
          outline
          color="green"
          icon="add"
          label="Agregar área"
          @click="addArea"
        />
      </div>
    </div>

    <!-- Lista de áreas -->
    <div v-if="value.areas.length > 0">
      <AreaItem
        v-for="(area, index) in value.areas"
        :key="index"
        :value="area"
        @input="updateArea(index, $event)"
        @remove="removeArea(index)"
      />
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state text-center q-py-xl text-grey-6 bordered rounded-borders">
      <q-icon name="domain" size="4rem" class="q-mb-md opacity-50" />
      <div class="text-h6 text-weight-light">No hay áreas agregadas</div>
      <p class="q-mt-xs">Pulse el botón para agregar la primera área de trabajo de este departamento.</p>
    </div>
  </div>
</template>

<script>
import AreaItem from '../AreaItem.vue';

export default {
  name: 'SectionAreas',
  components: {
    AreaItem
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    function addArea() {
      const updated = { ...props.value };
      updated.areas = [...updated.areas, {
        name: '',
        manager: '',
        description: '',
        status: 'ACTIVO'
      }];
      emit('input', updated);
    }

    function removeArea(index) {
      const updated = { ...props.value };
      updated.areas = updated.areas.filter((_, i) => i !== index);
      emit('input', updated);
    }

    function updateArea(index, updatedArea) {
      const updated = { ...props.value };
      updated.areas = [...updated.areas];
      updated.areas[index] = updatedArea;
      emit('input', updated);
    }

    return {
      addArea,
      removeArea,
      updateArea
    };
  }
};
</script>

<style scoped>
.empty-state {
  border: 2px dashed #e0e0e0;
  background-color: #fafafa;
}
.opacity-50 {
  opacity: 0.5;
}
</style>
