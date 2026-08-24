<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="permisos-container">
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h1 class="text-h4 text-weight-bold q-my-none text-primary">
            Asignar permisos
          </h1>
          <p class="text-subtitle2 text-grey-7 q-mt-xs">
            Selecciona un colaborador para asignar sus permisos
          </p>
        </div>
      </div>

      <q-card flat bordered class="rounded-borders q-mb-lg">
        <q-card-section class="q-pa-lg">
          <label class="field-label text-weight-bold text-grey-8">Colaborador / Usuario</label>
          <p class="text-caption text-grey-6 q-mt-xs q-mb-md">
            Selecciona un colaborador o usuario registrado para asignar sus permisos
          </p>

          <q-select v-model="colaboradorSeleccionado" :options="colaboradoresDisponibles" option-label="nombreCompleto"
            option-value="id" emit-value map-options dense outlined use-input input-debounce="300"
            placeholder="Buscar y seleccionar colaborador..." :loading="cargandoColaboradoresDisponibles" clearable
            @filter="filtrarColaboradores" @update:model-value="onColaboradorChange">
            <template v-slot:prepend>
              <q-icon name="person_search" color="primary" />
            </template>
            <template v-slot:no-option>
              <q-item><q-item-section>Sin resultados</q-item-section></q-item>
            </template>
          </q-select>

          <div v-if="colaboradorSeleccionado" class="q-mt-md">
            <div class="colaborador-card">
              <div class="colaborador-card__avatar">
                <q-icon name="person" size="20px" color="white" />
              </div>
              <div class="colaborador-card__info">
                <div class="colaborador-card__name">{{ colaboradorSeleccionadoNombre }}</div>
                <div class="colaborador-card__id">ID: {{ colaboradorSeleccionado }}</div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <div class="route-list-section">
            <div class="route-list-section__header">
              <div class="route-list-section__title">
                <label class="field-label text-weight-bold text-grey-8">Rutas del sistema</label>
                <p class="text-caption text-grey-6 q-mt-xs q-mb-none">
                  Rutas registradas en el router con sus requisitos de rol y visibilidad
                </p>
                <p v-if="permisosActivos.length" class="text-caption text-positive q-mt-xs q-mb-none">
                  {{ permisosActivos.length }} permiso(s) activo(s)
                </p>
              </div>

              <button type="button" class="btn-asignar-rutas" :disabled="!colaboradorSeleccionado || guardandoRutas"
                @click="asignarPermisosRutas">
                <q-spinner v-if="guardandoRutas" size="16px" color="white" class="btn-asignar-rutas__icon" />
                <q-icon v-else name="assignment_turned_in" size="18px" class="btn-asignar-rutas__icon" />
                <span>Asignar permisos</span>
              </button>
            </div>

            <RouteList :value="rutasAsignadas" @selection-change="onSeleccionCambio" />
          </div>
        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script>
import { colaboradoresApi } from 'src/api/colaboradores.api';
import { colaboradorRutasApi } from 'src/api/colaboradorRutas.api';
import RouteList from 'src/modules/user-profile/ui/Organismo/RouteList.vue';
import { findRoutesByPaths } from 'src/modules/user-profile/ui/utils/flatten-routes';
import { usePermissionsStore } from 'src/router/permissions';
import { pinia } from 'src/stores/pinia';

export default {
  name: 'CrearColaboradorPermisosView',

  components: {
    RouteList,
  },

  data() {
    return {
      colaboradoresDisponibles: [],
      colaboradoresBackup: [],
      colaboradorSeleccionado: null,
      colaboradorSeleccionadoNombre: '',
      rutasAsignadas: [],
      rutasPendientes: [],
      cargandoColaboradoresDisponibles: false,
      guardandoRutas: false,
      permissionsStore: null,
    };
  },

  computed: {
    permisosActivos() {
      if (!this.permissionsStore) {
        return [];
      }
      return this.permissionsStore.activePermissions;
    },
  },

  created() {
    this.permissionsStore = usePermissionsStore(pinia);
  },

  mounted() {
    this.cargarColaboradores();
  },

  methods: {
    syncPermisosDesdeRutas(rutas) {
      if (!this.permissionsStore) {
        return;
      }
      this.permissionsStore.syncPermissionsFromRoutes(rutas || []);
    },

    async cargarColaboradores() {
      this.cargandoColaboradoresDisponibles = true;
      try {
        var data = await colaboradoresApi.getAll();
        var arr = Array.isArray(data) ? data : (data.data || []);
        this.colaboradoresDisponibles = arr;
        this.colaboradoresBackup = arr;
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar colaboradores',
          icon: 'error_outline',
        });
      } finally {
        this.cargandoColaboradoresDisponibles = false;
      }
    },

    filtrarColaboradores(val, update) {
      if (val === '') {
        update(function () { this.colaboradoresDisponibles = this.colaboradoresBackup; }.bind(this));
        return;
      }
      update(function () {
        var needle = val.toLowerCase();
        this.colaboradoresDisponibles = this.colaboradoresBackup.filter(
          function (c) {
            return (c.nombreCompleto || '').toLowerCase().indexOf(needle) !== -1;
          }
        );
      }.bind(this));
    },

    async onColaboradorChange() {
      this.colaboradorSeleccionadoNombre = '';
      this.rutasAsignadas = [];
      this.rutasPendientes = [];
      this.permissionsStore.resetPermissions();

      if (!this.colaboradorSeleccionado) {
        return;
      }

      var c = this.colaboradoresBackup.find(function (x) {
        return x.id === this.colaboradorSeleccionado;
      }.bind(this));
      this.colaboradorSeleccionadoNombre = c ? c.nombreCompleto : '';
      await this.cargarRutasAsignadas();
    },

    async cargarRutasAsignadas() {
      try {
        var response = await colaboradorRutasApi.getByColaborador(this.colaboradorSeleccionado);
        var rutas = (response && response.rutas) ? response.rutas : [];
        var paths = rutas.map(function (r) {
          return r.rutaPath;
        });
        var rutasRouter = this.$router.options.routes;
        this.rutasAsignadas = findRoutesByPaths(rutasRouter, paths);
        this.rutasPendientes = this.rutasAsignadas.slice();
        this.syncPermisosDesdeRutas(this.rutasPendientes);
      } catch (e) {
        console.error('[CrearColaboradorPermisosView] Error al cargar rutas:', e);
        this.rutasAsignadas = [];
        this.rutasPendientes = [];
        this.permissionsStore.resetPermissions();
      }
    },

    onSeleccionCambio(rutasSeleccionadas) {
      this.rutasPendientes = rutasSeleccionadas || [];
      this.syncPermisosDesdeRutas(this.rutasPendientes);
    },

    asignarPermisosRutas() {
      if (!this.colaboradorSeleccionado) {
        this.$q.notify({
          type: 'warning',
          message: 'Selecciona un colaborador antes de asignar permisos',
          icon: 'person_outline',
        });
        return;
      }
      this.registrarPermisos();
    },

    async registrarPermisos() {
      if (!this.colaboradorSeleccionado) {
        return;
      }

      var rutasAGuardar = this.rutasPendientes.length
        ? this.rutasPendientes
        : this.rutasAsignadas;

      this.guardandoRutas = true;
      try {
        var paths = rutasAGuardar.map(function (r) { return r.path; });
        var nombres = rutasAGuardar.map(function (r) {
          return r.name || r.label || r.path;
        });
        await colaboradorRutasApi.guardar(this.colaboradorSeleccionado, paths, nombres);
        this.rutasAsignadas = rutasAGuardar.slice();
        this.syncPermisosDesdeRutas(this.rutasAsignadas);
        this.$q.notify({
          type: 'positive',
          message: 'Permisos asignados correctamente',
          icon: 'check_circle',
        });
      } catch (e) {
        console.error('[CrearColaboradorPermisosView] Error al guardar permisos:', e);
        this.$q.notify({
          type: 'negative',
          message: 'Error al guardar los permisos',
          icon: 'error_outline',
        });
      } finally {
        this.guardandoRutas = false;
      }
    },
  },
};
</script>

<style scoped>
.permisos-container {
  max-width: 820px;
  margin: 0 auto;
}

.field-label {
  font-size: 13px;
  letter-spacing: 0.02em;
}

.route-list-section {
  margin-top: 4px;
}

.route-list-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.route-list-section__title {
  flex: 1;
  min-width: 0;
}

.btn-asignar-rutas {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #15803d 0%, #16a34a 45%, #4ade80 100%);
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}

.btn-asignar-rutas::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.14) 0%,
      rgba(255, 255, 255, 0) 60%);
  border-radius: inherit;
  pointer-events: none;
}

.btn-asignar-rutas:hover:not(:disabled) {
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.42);
  filter: brightness(1.03);
}

.btn-asignar-rutas:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-asignar-rutas:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-asignar-rutas__icon {
  flex-shrink: 0;
}

.route-list-section>>>.route-list {
  padding: 12px 0 0;
  max-width: none;
}

.colaborador-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.colaborador-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 1px 4px rgba(59, 130, 246, 0.1);
}

.colaborador-card__avatar {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.colaborador-card__info {
  flex: 1;
  min-width: 0;
}

.colaborador-card__name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.colaborador-card__id {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 1px;
}
</style>
