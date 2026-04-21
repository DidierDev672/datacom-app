<template>
  <div class="q-pa-md">
    <q-card class="shadow-5 rounded-borders">
      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <q-icon name="groups" size="md" class="q-mr-md" />
        <div>
          <div class="text-h5 text-white">Listado de Colaboradores</div>
          <div class="text-subtitle2">Visualización y gestión de talento humano</div>
        </div>
        <q-space />
        <q-btn 
          color="white" 
          text-color="primary" 
          icon="person_add" 
          label="Nuevo Colaborador" 
          :to="{ name: 'registro-colaborador' }"
        />
      </q-card-section>

      <q-card-section>
        <q-table
          :data="colaboradores"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter"
          binary-state-sort
          class="no-shadow"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar colaborador...">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                :color="props.value === 'Activo' ? 'positive' : 'negative'"
                text-color="white"
                dense
                square
                class="text-weight-bold"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="primary" icon="visibility" @click="verDetalle(props.row)">
                <q-tooltip>Ver Detalle</q-tooltip>
              </q-btn>
              <q-btn flat round color="secondary" icon="edit" @click="editar(props.row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal de Detalle (Simulado por ahora) -->
    <q-dialog v-model="showDetalle">
      <q-card style="min-width: 350px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Detalle del Colaborador</div>
        </q-card-section>
        <q-card-section v-if="selectedColaborador">
          <div class="row q-col-gutter-sm">
            <div class="col-12 text-subtitle1 text-weight-bold">
              {{ selectedColaborador.nombreCompleto }}
            </div>
            <div class="col-12">
              <q-icon name="email" class="q-mr-sm" /> {{ selectedColaborador.correoElectronico }}
            </div>
            <div class="col-12">
              <q-icon name="work" class="q-mr-sm" /> {{ selectedColaborador.cargoAsignado || selectedColaborador.nombreCargo }}
            </div>
            <div class="col-6">
              <strong>Estado:</strong> {{ selectedColaborador.estado }}
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useTalentoHumanoStore } from '../store/useTalentoHumanoStore';

export default {
  name: 'ListaColaboradoresView',
  data() {
    return {
      store: useTalentoHumanoStore(),
      filter: '',
      showDetalle: false,
      selectedColaborador: null,
      columns: [
        { name: 'nombreCompleto', align: 'left', label: 'Nombre Completo', field: 'nombreCompleto', sortable: true },
        { name: 'correoElectronico', align: 'left', label: 'Email', field: 'correoElectronico', sortable: true },
        { name: 'cargo', align: 'left', label: 'Cargo', field: row => row.cargoAsignado || row.nombreCargo, sortable: true },
        { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
        { name: 'acciones', align: 'center', label: 'Acciones', field: 'id' }
      ]
    };
  },
  computed: {
    colaboradores() {
      return this.store.colaboradores;
    },
    loading() {
      return this.store.loading;
    }
  },
  methods: {
    async cargarDatos() {
      try {
        await this.store.fetchColaboradores();
      } catch (e) {
        this.$q.notify({
          color: 'negative',
          message: 'Error al cargar los colaboradores',
          icon: 'error'
        });
      }
    },
    verDetalle(row) {
      this.selectedColaborador = row;
      this.showDetalle = true;
    },
    editar(row) {
      this.$q.notify({
        color: 'info',
        message: 'Funcionalidad de edición en desarrollo',
        icon: 'info'
      });
    }
  },
  mounted() {
    this.cargarDatos();
  }
};
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
