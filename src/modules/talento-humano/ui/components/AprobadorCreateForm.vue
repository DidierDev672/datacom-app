<template>
  <q-card flat bordered class="aprobadores-card q-pa-md">
    <q-card-section class="q-pb-sm">
      <div class="text-h6 text-weight-bold text-dark">Crear aprobador</div>
      <p class="aprobadores-lead q-mb-none q-mt-sm text-body2 text-grey-8">
        Selecciona un colaborador y define qué operaciones puede aprobar.
      </p>
    </q-card-section>
    <q-separator class="q-my-sm" />

    <q-card-section>
      <q-form ref="formRef" @submit.prevent="onGuardar">
        <!-- Colaborador -->
        <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">
          Colaborador
        </div>
        <q-select
          ref="colSelectRef"
          v-model="collaboratorId"
          class="aprobadores-select-input"
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
          clearable
          behavior="menu"
          placeholder="Buscar colaborador..."
          :error="false"
          @popup-show="marcarColaboradorTocado"
          @blur="marcarColaboradorTocado"
          @filter="filtrarColaboradores"
        >
          <template v-slot:no-option>
            <q-item dense>
              <q-item-section class="text-grey-7 text-caption">
                No hay coincidencias. Prueba otro nombre o documento.
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <p
          v-if="mensajeAyudaColaborador"
          class="aprobadores-hint-soft q-mt-sm q-mb-none text-caption"
        >
          {{ mensajeAyudaColaborador }}
        </p>

        <!-- Permisos -->
        <div class="text-caption text-weight-medium text-grey-7 q-mt-xl q-mb-sm">
          Operaciones que puede aprobar
        </div>

        <div class="permission-list">
          <div
            class="permission-item"
            role="checkbox"
            :aria-checked="puedeCrear ? 'true' : 'false'"
            tabindex="0"
            :class="{ active: puedeCrear }"
            @click="togglePermiso('crear')"
            @keydown.enter.prevent="togglePermiso('crear')"
            @keydown.space.prevent="togglePermiso('crear')"
          >
            <q-checkbox :value="puedeCrear" color="primary" dense class="permission-item__chk" />
            <div class="permission-item__text">
              <div class="permission-item__title">Crear</div>
              <div class="permission-item__sub">Aprueba nuevos registros</div>
            </div>
          </div>

          <div
            class="permission-item"
            role="checkbox"
            :aria-checked="puedeActualizar ? 'true' : 'false'"
            tabindex="0"
            :class="{ active: puedeActualizar }"
            @click="togglePermiso('actualizar')"
            @keydown.enter.prevent="togglePermiso('actualizar')"
            @keydown.space.prevent="togglePermiso('actualizar')"
          >
            <q-checkbox :value="puedeActualizar" color="primary" dense class="permission-item__chk" />
            <div class="permission-item__text">
              <div class="permission-item__title">Actualizar</div>
              <div class="permission-item__sub">Aprueba modificaciones</div>
            </div>
          </div>

          <div
            class="permission-item"
            role="checkbox"
            :aria-checked="puedeEliminar ? 'true' : 'false'"
            tabindex="0"
            :class="{ active: puedeEliminar }"
            @click="togglePermiso('eliminar')"
            @keydown.enter.prevent="togglePermiso('eliminar')"
            @keydown.space.prevent="togglePermiso('eliminar')"
          >
            <q-checkbox :value="puedeEliminar" color="primary" dense class="permission-item__chk" />
            <div class="permission-item__text">
              <div class="permission-item__title">Eliminar</div>
              <div class="permission-item__sub">Aprueba borrados</div>
            </div>
          </div>
        </div>

        <p
          v-if="mensajeAyudaPermisos"
          class="aprobadores-hint-soft q-mt-md q-mb-none text-caption"
        >
          {{ mensajeAyudaPermisos }}
        </p>

        <div class="row q-gutter-sm justify-end q-mt-xl">
          <q-btn flat no-caps color="grey-8" label="Limpiar" type="button" @click="limpiar" />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="save"
            label="Guardar aprobador"
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
import { createAprobador } from 'src/api/aprobadores.api';

function esActivo (c) {
  if (!c || !c.estado) return true;
  return c.estado === 'Activo' || c.estado === 'ACTIVO';
}

function etiquetaColaborador (c) {
  var nombre = c.nombreCompleto ? c.nombreCompleto : 'Sin nombre';
  var doc = c.numeroDocumento ? c.numeroDocumento : '';
  return nombre + (doc ? ' · ' + doc : '');
}

export default {
  name: 'AprobadorCreateForm',

  data () {
    return {
      collaboratorId: null,
      colaboradoresOpciones: [],
      colaboradoresFiltrados: [],
      cargandoColaboradores: false,
      puedeCrear: false,
      puedeActualizar: false,
      puedeEliminar: false,
      guardando: false,
      /** Solo tras intentar guardar o tras tocar el colaborador y dejar vacío */
      intentoGuardarColaborador: false,
      colaboradorInteractuado: false,
      intentoGuardarPermisos: false
    };
  },

  computed: {
    faltaColaborador () {
      return this.collaboratorId === null ||
        this.collaboratorId === undefined ||
        String(this.collaboratorId).length === 0;
    },
    mensajeAyudaColaborador () {
      var s = this.intentoGuardarColaborador;
      var t = this.colaboradorInteractuado;
      if (!(s || t) || !this.faltaColaborador) return '';
      var listaVacia = !this.colaboradoresOpciones.length && !this.cargandoColaboradores;
      if (listaVacia) {
        return 'No hay colaboradores activos para elegir. Revisa tu conexión o inténtalo de nuevo.';
      }
      return 'Debes seleccionar un colaborador para continuar.';
    },
    ningunaOperacionSeleccionada () {
      return !this.puedeCrear && !this.puedeActualizar && !this.puedeEliminar;
    },
    mensajeAyudaPermisos () {
      return this.intentoGuardarPermisos && this.ningunaOperacionSeleccionada
        ? 'Elige al menos una operación que pueda aprobar.'
        : '';
    }
  },

  mounted () {
    this.cargarColaboradores();
  },

  methods: {
    togglePermiso (clave) {
      if (clave === 'crear') this.puedeCrear = !this.puedeCrear;
      else if (clave === 'actualizar') this.puedeActualizar = !this.puedeActualizar;
      else if (clave === 'eliminar') this.puedeEliminar = !this.puedeEliminar;
    },

    marcarColaboradorTocado () {
      this.colaboradorInteractuado = true;
    },

    async cargarColaboradores () {
      this.cargandoColaboradores = true;
      try {
        var lista = await colaboradoresApi.getAll();
        var arr = Array.isArray(lista) ? lista : [];
        this.colaboradoresOpciones = arr.filter(esActivo).map(function (c) {
          return {
            value: c.id,
            label: etiquetaColaborador(c)
          };
        }).filter(function (o) {
          return o.value;
        });
        this.colaboradoresFiltrados = this.colaboradoresOpciones.slice();
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: (e && e.message) ? e.message : 'No se pudieron cargar los colaboradores',
          position: 'top-right'
        });
        this.colaboradoresOpciones = [];
        this.colaboradoresFiltrados = [];
      } finally {
        this.cargandoColaboradores = false;
      }
    },

    filtrarColaboradores (val, update) {
      var vm = this;
      update(function () {
        var needle = (val || '').toLowerCase().trim();
        if (!needle) {
          vm.colaboradoresFiltrados = vm.colaboradoresOpciones.slice();
          return;
        }
        vm.colaboradoresFiltrados = vm.colaboradoresOpciones.filter(function (o) {
          return (o.label && o.label.toLowerCase().indexOf(needle) !== -1);
        });
      });
    },

    reiniciarValidacionSuave () {
      this.intentoGuardarColaborador = false;
      this.intentoGuardarPermisos = false;
    },

    limpiar () {
      this.collaboratorId = null;
      this.puedeCrear = false;
      this.puedeActualizar = false;
      this.puedeEliminar = false;
      this.reiniciarValidacionSuave();
      this.colaboradorInteractuado = false;
      this.colaboradoresFiltrados = this.colaboradoresOpciones.slice();
      if (this.$refs.colSelectRef && this.$refs.colSelectRef.resetValidation) {
        this.$refs.colSelectRef.resetValidation();
      }
    },

    async onGuardar () {
      this.intentoGuardarColaborador = false;
      this.intentoGuardarPermisos = false;

      if (this.faltaColaborador) {
        this.intentoGuardarColaborador = true;
        return;
      }
      if (this.ningunaOperacionSeleccionada) {
        this.intentoGuardarPermisos = true;
        return;
      }

      this.guardando = true;
      try {
        await createAprobador({
          collaboratorId: this.collaboratorId,
          puedeCrear: !!this.puedeCrear,
          puedeActualizar: !!this.puedeActualizar,
          puedeEliminar: !!this.puedeEliminar
        });
        this.$q.notify({
          type: 'positive',
          message: 'Aprobador guardado correctamente',
          position: 'top-right',
          timeout: 2500
        });
        this.limpiar();
        this.$emit('saved');
      } catch (e) {
        var msg = (e && e.message) ? e.message : 'No se pudo guardar el aprobador';
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
.aprobadores-card {
  border-radius: 16px;
}

.aprobadores-lead {
  line-height: 1.5;
  max-width: 52em;
}

/* Ayuda contextual suave — sin borde rojo dominante del campo */
.aprobadores-hint-soft {
  color: #64748b;
  line-height: 1.45;
}

/* Select más legible (altura, radio, texto) */
.aprobadores-select-input >>> .q-field__control {
  min-height: 52px !important;
  border-radius: 12px !important;
  padding-left: 14px !important;
  padding-right: 14px !important;
  font-size: 15px;
}

.aprobadores-select-input >>> input.q-placeholder,
.aprobadores-select-input >>> .q-field__native {
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
  gap: 14px;
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
