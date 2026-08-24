<template>
  <q-card flat bordered class="permisos-card q-pa-md">
    <q-card-section class="q-pb-sm">
      <div class="text-h6 text-weight-bold text-dark">
        Asignar permisos por departamento y empleado
      </div>
      <p class="permisos-lead q-mb-none q-mt-sm text-body2 text-grey-8">
        Selecciona el departamento, el empleado y los permisos operativos que
        podrá aprobar o autorizar.
      </p>
    </q-card-section>
    <q-separator class="q-my-sm" />

    <q-card-section>
       <q-form ref="formRef" @submit.prevent="onGuardar">
        <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">
          Departamento
        </div>
        <q-select
          v-model="departamentoId"
          class="permisos-select-input"
          :options="departamentosFiltrados"
          outlined
          hide-bottom-space
          use-input
          input-debounce="200"
          emit-value
          map-options
          option-value="value"
          option-label="label"
          :loading="cargandoDepartamentos"
          clearable
          behavior="menu"
          placeholder="Buscar departamento laboral..."
          @popup-show="cargarDepartamentos"
          @filter="filtrarDepartamentos"
          @update:model-value="onDepartamentoChange"
        >
          <template v-slot:no-option>
            <q-item dense>
              <q-item-section class="text-grey-7 text-caption">
                No hay departamentos registrados que coincidan con la búsqueda.
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <p
          v-if="mensajeAyudaDepartamento"
          class="permisos-hint-soft q-mt-sm q-mb-none text-caption"
        >
          {{ mensajeAyudaDepartamento }}
        </p>

        <div class="text-caption text-weight-medium text-grey-7 q-mt-xl q-mb-xs">
          Empleado
        </div>
        <q-select
          ref="colaboradorSelectRef"
          v-model="colaboradorId"
          class="permisos-select-input"
          :options="colaboradoresFiltrados"
          outlined
          hide-bottom-space
          use-input
          input-debounce="200"
          emit-value
          map-options
          option-value="value"
          option-label="label"
          :loading="cargandoColaboradores"
          :disable="!departamentoId"
          clearable
          behavior="menu"
          placeholder="Buscar empleado del departamento..."
          @popup-show="onColaboradorPopupShow"
          @blur="marcarColaboradorTocado"
          @filter="filtrarColaboradores"
        >
          <template v-slot:no-option>
            <q-item dense>
              <q-item-section class="text-grey-7 text-caption">
                No hay empleados activos en este departamento.
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <p
          v-if="mensajeAyudaColaborador"
          class="permisos-hint-soft q-mt-sm q-mb-none text-caption"
        >
          {{ mensajeAyudaColaborador }}
        </p>

        <div
          v-if="colaboradorId && departamentoId"
          class="q-mt-xl"
        >
          <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">
            Vinculación a áreas
          </div>

          <div v-if="cargandoAreas" class="row items-center q-gutter-xs text-caption text-grey-5">
            <q-spinner size="16px" />
            <span>Verificando vinculación del colaborador...</span>
          </div>

          <div v-else-if="areasColaborador.length" class="row q-gutter-xs">
            <span
              v-for="area in areasColaborador"
              :key="area.departamentoId"
              class="area-badge"
            >
              <q-icon name="corporate_fare" size="14px" />
              {{ area.departamentoNombre || 'Área #' + area.departamentoId }}
            </span>
          </div>

          <div v-else class="vinculacion-card-mini row items-center q-gutter-sm">
            <div class="vinculacion-card-mini__icon">
              <q-icon name="info" size="18px" color="white" />
            </div>
            <div class="vinculacion-card-mini__text">
              <span class="vinculacion-card-mini__title">Sin áreas vinculadas</span>
              <span class="vinculacion-card-mini__desc">
                Este colaborador aún no está asignado a un área de trabajo.
                Para asignarlo,
                <a
                  class="vinculacion-card-mini__link"
                  @click="irAAsignarAreas"
                >
                  haz clic aquí y agrega las áreas que necesita
                </a>.
                Es rápido y solo necesitas seleccionar las áreas correspondientes.
              </span>
            </div>
          </div>
        </div>

        <div class="text-caption text-weight-medium text-grey-7 q-mt-xl q-mb-xs">
          Permisos de aprobación
        </div>
        <div class="permission-list">
          <div
            v-for="permiso in permisosAprobacion"
            :key="permiso.key"
            class="permission-item"
            role="checkbox"
            :aria-checked="permisos[permiso.key] ? 'true' : 'false'"
            tabindex="0"
            :class="{ active: permisos[permiso.key] }"
            @click="togglePermiso(permiso.key)"
            @keydown.enter.prevent="togglePermiso(permiso.key)"
            @keydown.space.prevent="togglePermiso(permiso.key)"
          >
            <q-checkbox
              :value="permisos[permiso.key]"
              color="primary"
              dense
              class="permission-item__chk"
            />
            <q-icon :name="permiso.icon" class="permission-item__icon text-grey-6" />
            <div class="permission-item__text">
              <div class="permission-item__title">{{ permiso.label }}</div>
              <div class="permission-item__sub">{{ permiso.description }}</div>
            </div>
          </div>
        </div>

        <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-sm">
          Permisos de eliminación
        </div>
        <div class="permission-list">
          <div
            v-for="permiso in permisosEliminacion"
            :key="permiso.key"
            class="permission-item"
            role="checkbox"
            :aria-checked="permisos[permiso.key] ? 'true' : 'false'"
            tabindex="0"
            :class="{ active: permisos[permiso.key] }"
            @click="togglePermiso(permiso.key)"
            @keydown.enter.prevent="togglePermiso(permiso.key)"
            @keydown.space.prevent="togglePermiso(permiso.key)"
          >
            <q-checkbox
              :value="permisos[permiso.key]"
              color="primary"
              dense
              class="permission-item__chk"
            />
            <q-icon :name="permiso.icon" class="permission-item__icon text-grey-6" />
            <div class="permission-item__text">
              <div class="permission-item__title">{{ permiso.label }}</div>
              <div class="permission-item__sub">{{ permiso.description }}</div>
            </div>
          </div>
        </div>

        <p
          v-if="mensajeAyudaPermisos"
          class="permisos-hint-soft q-mt-md q-mb-none text-caption"
        >
          {{ mensajeAyudaPermisos }}
        </p>

        <div class="row q-gutter-sm justify-end q-mt-xl">
          <q-btn
            flat
            no-caps
            color="grey-8"
            label="Limpiar"
            type="button"
            @click="limpiar"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="save"
            label="Guardar permisos"
            type="submit"
            :loading="guardando"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { colaboradoresApi } from 'src/api/colaboradores.api';
import { departmentApi } from 'src/api/department.api';
import { colaboradorPermisosApi } from 'src/api/colaboradorPermisos.api';
import { colaboradorAreasApi } from 'src/api/colaboradorAreas.api';
import {
  PERMISOS_OPERATIVOS,
  buildPermisosIniciales,
  tieneAlgunPermiso,
  permisosFromRecord,
  mergePermisosFromRecords
} from '../constants/permisosOperativos';
import {
  buildAreaLookupFromDepartments,
  resolveLaborAreaDisplay
} from '../utils/laborAreaDisplay';
import {
  buildDepartmentSelectOptions,
  getDepartmentAreaNames
} from '../utils/departmentSelectOptions';

function esActivo (c) {
  if (!c || !c.estado) return true;
  return c.estado === 'Activo' || c.estado === 'ACTIVO';
}

function etiquetaColaborador (c) {
  var nombre = c.nombreCompleto ? c.nombreCompleto : 'Sin nombre';
  var doc = c.numeroDocumento ? c.numeroDocumento : '';
  return nombre + (doc ? ' · ' + doc : '');
}

function buildColaboradorOpciones (colaboradores) {
  return (Array.isArray(colaboradores) ? colaboradores : [])
    .map(function (c) {
      return {
        value: c.id,
        label: etiquetaColaborador(c)
      };
    })
    .filter(function (o) {
      return o.value != null && String(o.value).length > 0;
    })
    .sort(function (a, b) {
      return String(a.label).localeCompare(String(b.label), 'es');
    });
}

function seleccionarAsignacionSesion (asignaciones) {
  if (!Array.isArray(asignaciones) || !asignaciones.length) {
    return null;
  }
  return asignaciones.slice().sort(function (a, b) {
    var fechaA = a && a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    var fechaB = b && b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return fechaB - fechaA;
  })[0];
}

function colaboradorCoincideDepartamento (colaborador, deptTokens, areaLookup) {
  if (!colaborador || !deptTokens.length) {
    return false;
  }
  var areaRaw =
    colaborador.areaDepartamento ||
    colaborador.areaNombre ||
    colaborador.areaName ||
    colaborador.area ||
    '';
  var area = resolveLaborAreaDisplay(areaRaw, areaLookup).toLowerCase();
  var areaRawLower = String(areaRaw).trim().toLowerCase();
  return deptTokens.some(function (token) {
    return area === token ||
      areaRawLower === token ||
      (token && area.indexOf(token) >= 0) ||
      (token && areaRawLower.indexOf(token) >= 0);
  });
}

export default {
  name: 'ColaboradorPermisosForm',

  data () {
    return {
      departamentoId: null,
      colaboradorId: null,
      departamentosOpciones: [],
      departamentosFiltrados: [],
      departamentosRaw: [],
      areaLookup: new Map(),
      colaboradoresTodos: [],
      colaboradoresDepartamento: [],
      colaboradoresFiltrados: [],
      cargandoDepartamentos: false,
      cargandoColaboradores: false,
      areasColaborador: [],
      cargandoAreas: false,
      permisos: buildPermisosIniciales(),
      guardando: false,
      editandoSesion: false,
      intentoGuardarDepartamento: false,
      intentoGuardarColaborador: false,
      colaboradorInteractuado: false,
      intentoGuardarPermisos: false
    };
  },

  computed: {
    permisosAprobacion () {
      return PERMISOS_OPERATIVOS.filter(function (p) {
        return p.group === 'aprobacion';
      });
    },
    permisosEliminacion () {
      return PERMISOS_OPERATIVOS.filter(function (p) {
        return p.group === 'eliminacion';
      });
    },
    faltaDepartamento () {
      return this.departamentoId === null || this.departamentoId === undefined;
    },
    faltaColaborador () {
      return this.colaboradorId === null ||
        this.colaboradorId === undefined ||
        String(this.colaboradorId).length === 0;
    },
    mensajeAyudaDepartamento () {
      if (!this.intentoGuardarDepartamento || !this.faltaDepartamento) return '';
      if (!this.departamentosOpciones.length && !this.cargandoDepartamentos) {
        return 'No hay departamentos registrados. Crea uno antes de asignar permisos.';
      }
      return 'Debes seleccionar un departamento.';
    },
    mensajeAyudaColaborador () {
      var s = this.intentoGuardarColaborador;
      var t = this.colaboradorInteractuado;
      if (!(s || t) || !this.faltaColaborador) return '';
      if (!this.departamentoId) {
        return 'Primero selecciona un departamento.';
      }
      if (!this.colaboradoresDepartamento.length && !this.cargandoColaboradores) {
        return 'No hay empleados activos registrados en el sistema.';
      }
      return 'Debes seleccionar un empleado.';
    },
    mensajeAyudaPermisos () {
      return this.intentoGuardarPermisos && !tieneAlgunPermiso(this.permisos)
        ? 'Selecciona al menos un permiso operativo.'
        : '';
    }
  },

  mounted () {
    this.cargarCatalogos();
  },

  watch: {
    colaboradorId: {
      immediate: false,
      handler: function (val) {
        this.cargarAreasColaborador(val);
      }
    }
  },

  methods: {
    togglePermiso (key) {
      this.permisos = Object.assign({}, this.permisos, {
        [key]: !this.permisos[key]
      });
    },

    marcarColaboradorTocado () {
      this.colaboradorInteractuado = true;
    },

    syncColaboradoresFiltrados () {
      this.colaboradoresFiltrados = this.colaboradoresDepartamento.slice();
    },

    resetColaboradorSelectInput () {
      var ref = this.$refs.colaboradorSelectRef;
      if (ref && typeof ref.updateInputValue === 'function') {
        ref.updateInputValue('');
      }
    },

    async onColaboradorPopupShow () {
      this.marcarColaboradorTocado();
      if (!this.departamentoId) {
        return;
      }
      if (!this.colaboradoresTodos.length && !this.cargandoColaboradores) {
        await this.cargarColaboradores();
      }
      this.actualizarColaboradoresDepartamento();
      this.syncColaboradoresFiltrados();
    },

    findDepartmentById (departamentoId) {
      var normalizedId = String(departamentoId);
      return this.departamentosRaw.find(function (d) {
        return d && String(d.id) === normalizedId;
      }) || null;
    },

    async cargarDepartamentos () {
      this.cargandoDepartamentos = true;
      try {
        var departamentos = await departmentApi.getAll().catch(function () {
          return [];
        });
        this.departamentosRaw = Array.isArray(departamentos) ? departamentos : [];
        this.areaLookup = buildAreaLookupFromDepartments(this.departamentosRaw);
        this.departamentosOpciones = buildDepartmentSelectOptions(this.departamentosRaw);
        this.departamentosFiltrados = this.departamentosOpciones.slice();
        this.actualizarColaboradoresDepartamento();
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: (e && e.message) ? e.message : 'No se pudieron cargar los departamentos',
          position: 'top-right'
        });
        this.departamentosRaw = [];
        this.departamentosOpciones = [];
        this.departamentosFiltrados = [];
      } finally {
        this.cargandoDepartamentos = false;
      }
    },

    async cargarColaboradores () {
      this.cargandoColaboradores = true;
      try {
        var lista = await colaboradoresApi.getAll().catch(function () {
          return [];
        });
        var arr = Array.isArray(lista) ? lista : [];
        this.colaboradoresTodos = arr.filter(esActivo);
        this.actualizarColaboradoresDepartamento();
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: (e && e.message) ? e.message : 'No se pudieron cargar los empleados',
          position: 'top-right'
        });
        this.colaboradoresTodos = [];
        this.colaboradoresDepartamento = [];
        this.colaboradoresFiltrados = [];
      } finally {
        this.cargandoColaboradores = false;
      }
    },

    async cargarCatalogos () {
      try {
        await Promise.all([
          this.cargarDepartamentos(),
          this.cargarColaboradores()
        ]);
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: (e && e.message) ? e.message : 'No se pudieron cargar los catálogos',
          position: 'top-right'
        });
      }
    },

    filtrarDepartamentos (val, update) {
      var vm = this;
      update(function () {
        var needle = (val || '').toLowerCase().trim();
        if (!needle) {
          vm.departamentosFiltrados = vm.departamentosOpciones.slice();
          return;
        }
        vm.departamentosFiltrados = vm.departamentosOpciones.filter(function (o) {
          return o.label && o.label.toLowerCase().indexOf(needle) !== -1;
        });
      });
    },

    onDepartamentoChange () {
      this.colaboradorId = null;
      this.resetColaboradorSelectInput();
      this.actualizarColaboradoresDepartamento();
    },

    actualizarColaboradoresDepartamento () {
      var vm = this;
      if (!this.departamentoId) {
        this.colaboradoresDepartamento = [];
        this.colaboradoresFiltrados = [];
        return;
      }

      if (!this.colaboradoresTodos.length) {
        this.colaboradoresDepartamento = [];
        this.colaboradoresFiltrados = [];
        return;
      }

      var dept = this.findDepartmentById(this.departamentoId);
      var deptTokens = getDepartmentAreaNames(dept);
      var opciones = buildColaboradorOpciones(this.colaboradoresTodos);

      if (deptTokens.length) {
        opciones.sort(function (a, b) {
          var colaboradorA = vm.colaboradoresTodos.find(function (c) {
            return String(c.id) === String(a.value);
          });
          var colaboradorB = vm.colaboradoresTodos.find(function (c) {
            return String(c.id) === String(b.value);
          });
          var matchA = colaboradorCoincideDepartamento(colaboradorA, deptTokens, vm.areaLookup) ? 0 : 1;
          var matchB = colaboradorCoincideDepartamento(colaboradorB, deptTokens, vm.areaLookup) ? 0 : 1;
          if (matchA !== matchB) {
            return matchA - matchB;
          }
          return String(a.label).localeCompare(String(b.label), 'es');
        });
      }

      this.colaboradoresDepartamento = opciones;
      this.syncColaboradoresFiltrados();
    },

    async cargarAreasColaborador (colaboradorId) {
      if (!colaboradorId) {
        this.areasColaborador = [];
        return;
      }
      this.cargandoAreas = true;
      try {
        var respuesta = await colaboradorAreasApi.getAsignaciones(colaboradorId);
        this.areasColaborador = (respuesta && respuesta.areas) || [];
      } catch (e) {
        this.areasColaborador = [];
      } finally {
        this.cargandoAreas = false;
      }
    },

    irAAsignarAreas () {
      if (this.$router) {
        this.$router.push('/abastecimiento/talento-humano/colaboradores/asignar-areas');
      }
    },

    filtrarColaboradores (val, update) {
      var vm = this;
      update(function () {
        var needle = (val || '').toLowerCase().trim();
        if (!needle) {
          vm.colaboradoresFiltrados = vm.colaboradoresDepartamento.slice();
          return;
        }
        vm.colaboradoresFiltrados = vm.colaboradoresDepartamento.filter(function (o) {
          return o.label && o.label.toLowerCase().indexOf(needle) !== -1;
        });
      });
    },

    reiniciarValidacionSuave () {
      this.intentoGuardarDepartamento = false;
      this.intentoGuardarColaborador = false;
      this.intentoGuardarPermisos = false;
    },

    limpiar () {
      this.departamentoId = null;
      this.colaboradorId = null;
      this.permisos = buildPermisosIniciales();
      this.editandoSesion = false;
      this.reiniciarValidacionSuave();
      this.colaboradorInteractuado = false;
      this.colaboradoresDepartamento = [];
      this.colaboradoresFiltrados = [];
      this.resetColaboradorSelectInput();
    },

    async cargarRegistro (record) {
      if (!record) {
        return;
      }
      if (!this.departamentosRaw.length) {
        await this.cargarDepartamentos();
      }
      if (!this.colaboradoresTodos.length) {
        await this.cargarColaboradores();
      }
      this.reiniciarValidacionSuave();
      this.colaboradorInteractuado = false;
      this.editandoSesion = false;
      this.departamentoId = record.departamentoId != null
        ? record.departamentoId
        : null;
      this.actualizarColaboradoresDepartamento();
      this.colaboradorId = record.colaboradorId || null;
      this.permisos = permisosFromRecord(record);
    },

    async cargarSesion () {
      this.guardando = true;
      try {
        var sesion = await colaboradorPermisosApi.getSesion();
        if (!sesion || !sesion.colaboradorId) {
          this.$q.notify({
            type: 'warning',
            message: 'No se encontró un colaborador vinculado al usuario de sesión',
            position: 'top-right',
            timeout: 3500
          });
          return;
        }

        if (!this.departamentosRaw.length) {
          await this.cargarDepartamentos();
        }
        if (!this.colaboradoresTodos.length) {
          await this.cargarColaboradores();
        }

        var asignaciones = Array.isArray(sesion.asignaciones) ? sesion.asignaciones : [];
        var asignacion = seleccionarAsignacionSesion(asignaciones);
        this.reiniciarValidacionSuave();
        this.colaboradorInteractuado = false;
        this.editandoSesion = true;
        this.colaboradorId = sesion.colaboradorId;
        this.departamentoId = asignacion && asignacion.departamentoId != null
          ? asignacion.departamentoId
          : null;
        this.actualizarColaboradoresDepartamento();
        this.permisos = asignaciones.length
          ? mergePermisosFromRecords(asignaciones)
          : buildPermisosIniciales();
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: (e && e.message) ? e.message : 'No se pudieron cargar los permisos de tu sesión',
          position: 'top-right',
          timeout: 4000
        });
      } finally {
        this.guardando = false;
      }
    },

    buildPayload () {
      return {
        colaboradorId: this.colaboradorId,
        departamentoId: this.departamentoId,
        permisoCompras: !!this.permisos.permisoCompras,
        permisoAprobaciones: !!this.permisos.permisoAprobaciones,
        permisoCreacionUsuarios: !!this.permisos.permisoCreacionUsuarios,
        permisoEliminacionUsuarios: !!this.permisos.permisoEliminacionUsuarios,
        permisoEliminacionCompras: !!this.permisos.permisoEliminacionCompras,
        permisoEliminacionSolicitudes: !!this.permisos.permisoEliminacionSolicitudes
      };
    },

    buildSesionPayload () {
      return {
        departamentoId: this.departamentoId,
        permisoCompras: !!this.permisos.permisoCompras,
        permisoAprobaciones: !!this.permisos.permisoAprobaciones,
        permisoCreacionUsuarios: !!this.permisos.permisoCreacionUsuarios,
        permisoEliminacionUsuarios: !!this.permisos.permisoEliminacionUsuarios,
        permisoEliminacionCompras: !!this.permisos.permisoEliminacionCompras,
        permisoEliminacionSolicitudes: !!this.permisos.permisoEliminacionSolicitudes
      };
    },

    async onGuardar () {
      this.reiniciarValidacionSuave();

      if (this.faltaDepartamento) {
        this.intentoGuardarDepartamento = true;
        return;
      }
      if (this.faltaColaborador) {
        this.intentoGuardarColaborador = true;
        return;
      }
      if (!tieneAlgunPermiso(this.permisos)) {
        this.intentoGuardarPermisos = true;
        return;
      }

      this.guardando = true;
      try {
        if (this.editandoSesion) {
          await colaboradorPermisosApi.updateSesion(this.buildSesionPayload());
        } else {
          await colaboradorPermisosApi.createOrUpdate(this.buildPayload());
        }
        this.$q.notify({
          type: 'positive',
          message: 'Permisos guardados correctamente',
          position: 'top-right',
          timeout: 2500
        });
        this.limpiar();
        this.$emit('saved');
      } catch (e) {
        var msg = (e && e.message) ? e.message : 'No se pudieron guardar los permisos';
        this.$q.notify({
          type: 'negative',
          message: msg,
          position: 'top-right',
          timeout: 4000
        });
      } finally {
        this.guardando = false;
      }
    }
  }
};
</script>

<style scoped>
.permisos-card {
  border-radius: 16px;
}

.permisos-lead {
  line-height: 1.5;
  max-width: 52em;
}

.permisos-hint-soft {
  color: #64748b;
  line-height: 1.45;
}

.area-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #1e40af;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
}

.vinculacion-card-mini {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 10px;
  padding: 10px 14px;
  gap: 10px;
}

.vinculacion-card-mini__icon {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.vinculacion-card-mini__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.vinculacion-card-mini__title {
  font-size: 13px;
  font-weight: 600;
  color: #9a3412;
}

.vinculacion-card-mini__desc {
  font-size: 12px;
  line-height: 1.45;
  color: #c2410c;
}

.vinculacion-card-mini__link {
  color: #2563eb;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
}

.vinculacion-card-mini__link:hover {
  color: #1d4ed8;
}

.permisos-select-input >>> .q-field__control {
  min-height: 52px !important;
  border-radius: 12px !important;
  padding-left: 14px !important;
  padding-right: 14px !important;
  font-size: 15px;
}

.permission-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.permission-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease, box-shadow 0.18s ease;
}

.permission-item:focus {
  outline: 2px solid rgba(129, 199, 132, 0.45);
  outline-offset: 1px;
}

.permission-item:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.permission-item.active {
  border-color: #b7d100;
  background: #f7fee7;
  box-shadow: 0 0 0 1px rgba(183, 209, 0, 0.25);
}

.permission-item__chk {
  margin-top: 2px;
  pointer-events: none;
}

.permission-item__icon {
  margin-top: 2px;
  font-size: 20px;
}

.permission-item__text {
  flex: 1;
  min-width: 0;
}

.permission-item__title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}

.permission-item__sub {
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.35;
}
</style>
