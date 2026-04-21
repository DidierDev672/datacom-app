<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 400px; border-radius: 15px;" class="q-pa-sm">
      <q-card-section class="bg-primary text-white row items-center q-pb-none">
        <q-icon name="person_add" size="sm" class="q-mr-sm" />
        <div class="text-h6">Asignar Personas Encargadas</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="show = false" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div class="text-subtitle2 q-mb-sm text-grey-8">
          Seleccione el personal encargado de gestionar esta solicitud de abastecimiento.
        </div>
        
        <q-select
          v-model="selectedApprovers"
          :options="approverOptions"
          label="Buscar Colaborador..."
          multiple
          use-chips
          stack-label
          outlined
          emit-value
          map-options
          option-label="nombre"
          option-value="nombre"
          :loading="loading"
          class="q-mt-md"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-italic text-grey">
                No se encontraron colaboradores
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-actions align="right" class="q-pb-md q-pr-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn 
          label="Confirmar Aprobación" 
          color="positive" 
          @click="confirm" 
          :disable="selectedApprovers.length === 0"
          unelevated
          class="q-px-md"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, onMounted } from '@vue/composition-api';
import { useTalentoHumanoStore } from '../../../talento-humano/ui/store/useTalentoHumanoStore';

export default {
  name: 'ApproveSolicitudModal',
  props: {
    value: Boolean
  },
  emits: ['update:modelValue', 'confirm'],
  setup(props, { emit }) {
    const talentStore = useTalentoHumanoStore();
    const selectedApprovers = ref([]);

    const show = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    });

    const loading = computed(() => talentStore.loading);

    const approverOptions = computed(() => {
      return talentStore.colaboradores.map(c => ({
        id: c.id || c.numeroDocumento, // Fallback to doc if ID missing in mock
        nombre: c.nombreCompleto
      }));
    });

    const confirm = () => {
      emit('confirm', selectedApprovers.value);
      show.value = false;
      selectedApprovers.value = [];
    };

    onMounted(async () => {
      if (talentStore.colaboradores.length === 0) {
        await talentStore.fetchColaboradores();
      }
    });

    return {
      show,
      selectedApprovers,
      approverOptions,
      loading,
      confirm
    };
  }
};
</script>

<style scoped>
.q-card {
  box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
}
</style>
