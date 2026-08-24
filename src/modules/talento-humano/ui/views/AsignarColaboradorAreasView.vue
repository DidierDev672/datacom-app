<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="asignar-container">
      <div class="row items-center q-mb-lg">
        <div class="col">
          <h1 class="text-h4 text-weight-bold q-my-none text-primary">
            Agregar colaborador a las áreas
          </h1>
          <p class="text-subtitle2 text-grey-7 q-mt-xs">
            Selecciona un colaborador y asígnale una o varias áreas de trabajo
          </p>
        </div>
      </div>

      <q-card flat bordered class="rounded-borders q-mb-lg">
        <q-card-section class="q-pa-lg">
          <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
            <div class="col-12 col-md-6">
              <label class="field-label text-weight-bold text-grey-8">Colaborador</label>
              <q-select
                v-model="colaboradorSeleccionado"
                :options="colaboradores"
                option-label="nombreCompleto"
                option-value="id"
                emit-value
                map-options
                dense
                outlined
                use-input
                input-debounce="300"
                placeholder="Buscar y seleccionar colaborador..."
                :loading="cargandoColaboradores"
                @filter="filtrarColaboradores"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="person_search" color="primary" />
                </template>
                <template v-slot:no-option>
                  <q-item><q-item-section>Sin resultados</q-item-section></q-item>
                </template>
              </q-select>
            </div>
          </div>

          <div v-if="colaboradorSeleccionado" class="q-mt-md">
            <span class="text-grey-7 text-caption text-weight-bold q-mb-xs block">Colaborador seleccionado</span>
            <span class="colaborador-badge">
              <q-icon name="person" size="16px" />
              {{ nombreColaborador }}
            </span>
          </div>
        </q-card-section>
      </q-card>

      <q-card v-if="colaboradorSeleccionado" flat bordered class="rounded-borders q-mb-lg">
        <q-card-section class="q-pa-lg">
          <label class="field-label text-weight-bold text-grey-8">Áreas de trabajo</label>
          <p class="text-caption text-grey-6 q-mt-xs q-mb-md">
            Selecciona una o varias áreas a las que pertenecerá el colaborador
          </p>

          <q-select
            v-model="areasSeleccionadas"
            :options="areasDisponibles"
            option-label="name"
            option-value="id"
            multiple
            dense
            outlined
            use-chips
            placeholder="Seleccionar áreas..."
            :loading="cargandoAreas"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="corporate_fare" color="primary" />
            </template>
            <template v-slot:no-option>
              <q-item><q-item-section>Sin áreas disponibles</q-item-section></q-item>
            </template>
          </q-select>

          <div v-if="areasSeleccionadas.length" class="q-mt-md">
            <span class="text-grey-7 text-caption text-weight-bold q-mb-xs block">Áreas asignadas</span>
            <div class="row q-gutter-sm">
              <span
                v-for="area in areasSeleccionadas"
                :key="area.id || area"
                class="area-badge"
              >
                <q-icon name="corporate_fare" size="14px" />
                {{ area.name || nombreArea(area) }}
                <q-icon
                  name="close"
                  size="14px"
                  class="area-badge__remove cursor-pointer"
                  @click="removerArea(area)"
                />
              </span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-px-lg q-pb-lg q-pt-none">
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="save"
            label="Guardar configuración"
            :loading="guardando"
            :disable="!colaboradorSeleccionado || !areasSeleccionadas.length"
            @click="guardar"
            class="q-px-md"
          />
        </q-card-actions>
      </q-card>

      <q-card v-if="colaboradorSeleccionado" flat bordered class="rounded-borders q-mb-lg">
        <q-card-section class="q-pa-lg">
          <div class="text-weight-bold text-grey-8 q-mb-sm">Permisos de visibilidad de componentes</div>
          <p class="text-caption text-grey-6 q-mt-none q-mb-md">
            Define qué componentes podrá ver {{ nombreColaborador }} en el sistema
          </p>

          <div class="permiso-grupo">
            <div class="permiso-grupo__titulo">Plan de Abastecimiento</div>
            <div class="row q-gutter-sm">
              <q-checkbox
                v-model="visibilidad.visibilidadCrearPlanAbastecimiento"
                label="Crear"
                color="primary"
                dense
              />
              <q-checkbox
                v-model="visibilidad.visibilidadSupplyPlanTable"
                label="Lista"
                color="primary"
                dense
              />
            </div>
          </div>

          <div class="permiso-grupo">
            <div class="permiso-grupo__titulo">Rubros</div>
            <div class="row q-gutter-sm">
              <q-checkbox
                v-model="visibilidad.visibilidadCrearRubros"
                label="Crear"
                color="primary"
                dense
              />
              <q-checkbox
                v-model="visibilidad.visibilidadBudgetCategoriasList"
                label="Lista"
                color="primary"
                dense
              />
            </div>
          </div>

          <div class="permiso-grupo">
            <div class="permiso-grupo__titulo">Requisición</div>
            <div class="row q-gutter-sm">
              <q-checkbox
                v-model="visibilidad.visibilidadCrearRequisicionFormView"
                label="Crear"
                color="primary"
                dense
              />
              <q-checkbox
                v-model="visibilidad.visibilidadRequisicionesListView"
                label="Lista"
                color="primary"
                dense
              />
            </div>
          </div>

          <div class="permiso-grupo">
            <div class="permiso-grupo__titulo">Compras</div>
            <div class="row q-gutter-sm">
              <q-checkbox
                v-model="visibilidad.visibilidadGestionOrdenCompra"
                label="Gestión de órdenes"
                color="primary"
                dense
              />
              <q-checkbox
                v-model="visibilidad.visibilidadTransaccionesCompra"
                label="Lista de gestión"
                color="primary"
                dense
              />
              <q-checkbox
                v-model="visibilidad.visibilidadComparacionProveedores"
                label="Comparación de proveedores"
                color="primary"
                dense
              />
              <q-checkbox
                v-model="visibilidad.visibilidadComparacionesProveedores"
                label="Lista de comparaciones"
                color="primary"
                dense
              />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              unelevated
              no-caps
              color="primary"
              icon="save"
              label="Guardar permisos"
              :loading="guardandoVisibilidad"
              @click="guardarVisibilidad"
              class="q-px-md"
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="rounded-borders">
        <q-card-section class="q-pa-lg">
          <div class="row items-center q-mb-md">
            <div class="col">
              <div class="text-weight-bold text-grey-8">Colaboradores vinculados</div>
              <p class="text-caption text-grey-6 q-mt-xs q-mb-none">
                Colaboradores que ya tienen áreas asignadas
              </p>
            </div>
            <q-btn
              flat
              dense
              no-caps
              icon="refresh"
              color="grey-7"
              size="sm"
              @click="cargarVinculaciones"
            />
          </div>

          <div v-if="cargandoVinculaciones" class="row items-center q-gutter-xs text-caption text-grey-5 q-pa-md">
            <q-spinner size="16px" />
            <span>Cargando vinculaciones...</span>
          </div>

          <div v-else-if="vinculaciones.length" class="vinculaciones-list">
            <div
              v-for="v in vinculaciones"
              :key="v.colaboradorId"
              class="colaborador-card"
            >
              <div class="colaborador-card__avatar">
                <q-icon name="person" size="18px" color="white" />
              </div>
              <div class="colaborador-card__info">
                <div class="colaborador-card__name">{{ v.colaboradorNombre || v.colaboradorId }}</div>
                <div class="colaborador-card__id">ID: {{ v.colaboradorId }}</div>
                <div v-if="v.areas && v.areas.length" class="colaborador-card__areas">
                  <span
                    v-for="area in v.areas"
                    :key="area.departamentoId"
                    class="area-tag"
                  >
                    {{ area.departamentoNombre || 'Área #' + area.departamentoId }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center q-pa-xl">
            <q-icon name="link_off" size="36px" color="grey-4" />
            <p class="text-grey-5 text-caption q-mt-sm q-mb-none">
              No hay vinculaciones registradas aún.
            </p>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { colaboradoresApi } from 'src/api/colaboradores.api';
import { departmentApi } from 'src/api/department.api';
import { colaboradorAreasApi } from 'src/api/colaboradorAreas.api';

export default {
  name: 'AsignarColaboradorAreasView',

  data() {
    return {
      colaboradores: [],
      colaboradoresBackup: [],
      colaboradorSeleccionado: null,
      areasDisponibles: [],
      areasSeleccionadas: [],
      cargandoColaboradores: false,
      cargandoAreas: false,
      guardando: false,
      vinculaciones: [],
      cargandoVinculaciones: false,
      visibilidad: {
        visibilidadCrearPlanAbastecimiento: false,
        visibilidadSupplyPlanTable: false,
        visibilidadCrearRubros: false,
        visibilidadBudgetCategoriasList: false,
        visibilidadCrearRequisicionFormView: false,
        visibilidadRequisicionesListView: false,
        visibilidadGestionOrdenCompra: false,
        visibilidadTransaccionesCompra: false,
        visibilidadComparacionProveedores: false,
        visibilidadComparacionesProveedores: false,
      },
      guardandoVisibilidad: false,
    };
  },

  computed: {
    nombreColaborador() {
      if (!this.colaboradorSeleccionado) return '';
      var c = this.colaboradoresBackup.find(
        (x) => x.id === this.colaboradorSeleccionado
      );
      return c ? c.nombreCompleto : 'Colaborador seleccionado';
    },
  },

  watch: {
    colaboradorSeleccionado: function (nuevoId) {
      this.cargarVisibilidad(nuevoId);
    },
  },

  mounted() {
    this.cargarColaboradores();
    this.cargarAreas();
    this.cargarVinculaciones();
  },

  methods: {
    async cargarVisibilidad(colaboradorId) {
      if (!colaboradorId) return;
      try {
        var data = await colaboradorAreasApi.obtenerVisibilidad(colaboradorId);
        if (data) {
          this.visibilidad.visibilidadCrearPlanAbastecimiento = data.visibilidadCrearPlanAbastecimiento || false;
          this.visibilidad.visibilidadSupplyPlanTable = data.visibilidadSupplyPlanTable || false;
          this.visibilidad.visibilidadCrearRubros = data.visibilidadCrearRubros || false;
          this.visibilidad.visibilidadBudgetCategoriasList = data.visibilidadBudgetCategoriasList || false;
          this.visibilidad.visibilidadCrearRequisicionFormView = data.visibilidadCrearRequisicionFormView || false;
          this.visibilidad.visibilidadRequisicionesListView = data.visibilidadRequisicionesListView || false;
          this.visibilidad.visibilidadGestionOrdenCompra = data.visibilidadGestionOrdenCompra || false;
          this.visibilidad.visibilidadTransaccionesCompra = data.visibilidadTransaccionesCompra || false;
          this.visibilidad.visibilidadComparacionProveedores = data.visibilidadComparacionProveedores || false;
          this.visibilidad.visibilidadComparacionesProveedores = data.visibilidadComparacionesProveedores || false;
        }
      } catch (err) {
        this.visibilidad = {
          visibilidadCrearPlanAbastecimiento: false,
          visibilidadSupplyPlanTable: false,
          visibilidadCrearRubros: false,
          visibilidadBudgetCategoriasList: false,
          visibilidadCrearRequisicionFormView: false,
          visibilidadRequisicionesListView: false,
          visibilidadGestionOrdenCompra: false,
          visibilidadTransaccionesCompra: false,
          visibilidadComparacionProveedores: false,
          visibilidadComparacionesProveedores: false,
        };
      }
    },

    async guardarVisibilidad() {
      if (!this.colaboradorSeleccionado) return;
      this.guardandoVisibilidad = true;
      try {
        await colaboradorAreasApi.guardarVisibilidad({
          colaboradorId: this.colaboradorSeleccionado,
          visibilidadCrearPlanAbastecimiento: this.visibilidad.visibilidadCrearPlanAbastecimiento,
          visibilidadSupplyPlanTable: this.visibilidad.visibilidadSupplyPlanTable,
          visibilidadCrearRubros: this.visibilidad.visibilidadCrearRubros,
          visibilidadBudgetCategoriasList: this.visibilidad.visibilidadBudgetCategoriasList,
          visibilidadCrearRequisicionFormView: this.visibilidad.visibilidadCrearRequisicionFormView,
          visibilidadRequisicionesListView: this.visibilidad.visibilidadRequisicionesListView,
          visibilidadGestionOrdenCompra: this.visibilidad.visibilidadGestionOrdenCompra,
          visibilidadTransaccionesCompra: this.visibilidad.visibilidadTransaccionesCompra,
          visibilidadComparacionProveedores: this.visibilidad.visibilidadComparacionProveedores,
          visibilidadComparacionesProveedores: this.visibilidad.visibilidadComparacionesProveedores,
        });
        this.$q.notify({
          type: 'positive',
          message: 'Permisos de visibilidad guardados correctamente',
          icon: 'check_circle',
          position: 'top-right',
        });
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al guardar los permisos de visibilidad',
          icon: 'report_problem',
          position: 'top-right',
        });
      } finally {
        this.guardandoVisibilidad = false;
      }
    },

    async cargarColaboradores() {
      this.cargandoColaboradores = true;
      try {
        var data = await colaboradoresApi.search('');
        this.colaboradores = data;
        this.colaboradoresBackup = data;
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar colaboradores',
          icon: 'error_outline',
        });
      } finally {
        this.cargandoColaboradores = false;
      }
    },

    async cargarAreas() {
      this.cargandoAreas = true;
      try {
        var data = await departmentApi.getAll();
        this.areasDisponibles = Array.isArray(data) ? data : (data.data || []);
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar áreas de trabajo',
          icon: 'error_outline',
        });
      } finally {
        this.cargandoAreas = false;
      }
    },

    filtrarColaboradores(val, update) {
      if (val === '') {
        update(() => {
          this.colaboradores = this.colaboradoresBackup;
        });
        return;
      }
      update(() => {
        var needle = val.toLowerCase();
        this.colaboradores = this.colaboradoresBackup.filter(
          (c) =>
            (c.nombreCompleto || '').toLowerCase().includes(needle) ||
            (c.numeroDocumento || '').toLowerCase().includes(needle)
        );
      });
    },

    nombreArea(areaId) {
      var area = this.areasDisponibles.find((a) => a.id === areaId);
      return area ? area.name : 'Área #' + areaId;
    },

    removerArea(area) {
      this.areasSeleccionadas = this.areasSeleccionadas.filter(
        (a) => (a.id || a) !== (area.id || area)
      );
    },

    async guardar() {
      if (!this.colaboradorSeleccionado || !this.areasSeleccionadas.length) return;
      this.guardando = true;
      try {
        var ids = this.areasSeleccionadas.map((a) => a.id || a);
        await colaboradorAreasApi.asignar(this.colaboradorSeleccionado, ids);
        this.$q.notify({
          type: 'positive',
          message: 'Colaborador asignado a las áreas correctamente',
          icon: 'check_circle',
          position: 'top-right',
        });
        this.cargarVinculaciones();
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: (err.response && err.response.data && err.response.data.message) || 'Error al guardar la asignación',
          icon: 'report_problem',
          position: 'top-right',
        });
      } finally {
        this.guardando = false;
      }
    },

    async cargarVinculaciones() {
      this.cargandoVinculaciones = true;
      try {
        this.vinculaciones = await colaboradorAreasApi.listarTodas();
      } catch (e) {
        this.vinculaciones = [];
      } finally {
        this.cargandoVinculaciones = false;
      }
    },

    refreshVinculaciones() {
      this.cargarVinculaciones();
    },
  },
};
</script>

<style scoped>
.asignar-container {
  max-width: 820px;
  margin: 0 auto;
}

.field-label {
  font-size: 13px;
  letter-spacing: 0.02em;
}

.colaborador-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.25);
}

.area-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #1e40af;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
}

.area-badge__remove {
  opacity: 0.6;
  transition: opacity 0.15s;
  margin-left: 2px;
}

.area-badge__remove:hover {
  opacity: 1;
  color: #dc2626;
}

.vinculaciones-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.colaborador-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
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

.colaborador-card__areas {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.permiso-grupo {
  margin-bottom: 16px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.permiso-grupo__titulo {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.area-tag {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #1e40af;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
}
</style>
