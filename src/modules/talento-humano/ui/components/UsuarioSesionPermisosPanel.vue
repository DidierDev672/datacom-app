<template>
  <q-banner
    v-if="mostrarPanel"
    rounded
    class="session-panel q-mb-md"
    :class="bannerClass"
  >
    <template v-slot:avatar>
      <q-icon :name="bannerIcon" size="sm" />
    </template>

    <div class="session-panel__content">
      <!-- ═══ Header ═══ -->
      <div class="session-panel__header">
        <div class="session-panel__title text-weight-bold">
          Permisos de tu sesión
        </div>
        <p class="session-panel__lead q-mb-none">
          <template v-if="operativosStore.isLoading">
            <span class="text-grey-7">Verificando permisos operativos del usuario conectado…</span>
          </template>
          <template v-else-if="!operativosStore.username">
            <span class="text-grey-7">No hay usuario de sesión activo.</span>
          </template>
          <template v-else>
            <span class="session-panel__username">{{ operativosStore.username }}</span>
            <span
              v-if="operativosStore.collaboratorNombre"
              class="session-panel__fullname"
            >
              · {{ operativosStore.collaboratorNombre }}
            </span>
            <span
              v-if="!operativosStore.collaboratorId"
              class="session-panel__hint"
            >
              · sin colaborador vinculado
            </span>
          </template>
        </p>
      </div>

      <!-- ═══ Permisos agrupados ═══ -->
      <div
        v-if="!operativosStore.isLoading && operativosStore.isResolved"
        class="session-panel__groups q-mt-sm"
      >
        <!-- Grupo: Rol principal -->
        <div v-if="operativosStore.isSystemApprover" class="permiso-group">
          <span class="permiso-group__label">Rol</span>
          <div class="permiso-group__chips">
            <q-chip
              dense
              no-outline
              class="permiso-chip permiso-chip--role"
              icon="verified_user"
            >
              Aprobador del sistema
            </q-chip>
          </div>
        </div>

        <!-- Grupo: Permisos operativos -->
        <div
          v-if="permisosOperativos.length"
          class="permiso-group"
        >
          <span class="permiso-group__label">Operativos</span>
          <div class="permiso-group__chips">
            <q-chip
              v-for="permiso in permisosOperativos"
              :key="permiso.key"
              dense
              outline
              class="permiso-chip permiso-chip--operativo"
              :icon="permiso.icon"
            >
              {{ permiso.label }}
            </q-chip>
          </div>
        </div>

        <!-- Grupo: Permisos de eliminación -->
        <div
          v-if="permisosEliminacion.length"
          class="permiso-group"
        >
          <span class="permiso-group__label permiso-group__label--danger">
            <q-icon name="warning" size="12px" />
            Eliminación
          </span>
          <div class="permiso-group__chips">
            <q-chip
              v-for="permiso in permisosEliminacion"
              :key="permiso.key"
              dense
              outline
              class="permiso-chip permiso-chip--danger"
              :icon="permiso.icon"
            >
              {{ permiso.label }}
            </q-chip>
          </div>
        </div>

        <!-- Sin permisos -->
        <div
          v-if="!operativosStore.tieneAlgunPermisoOperativo"
          class="permiso-group"
        >
          <div class="permiso-group__chips">
            <q-chip
              dense
              outline
              color="grey-6"
              text-color="grey-8"
              icon="info"
            >
              Sin permisos operativos asignados
            </q-chip>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Acciones ═══ -->
    <template v-slot:action>
      <div class="session-panel__actions">
        <q-btn
          flat dense no-caps
          color="grey-8"
          icon="edit"
          label="Editar"
          class="session-panel__btn session-panel__btn--edit"
          :disable="!puedeEditarSesion"
          @click="editarSesion"
        >
          <q-tooltip v-if="!puedeEditarSesion">
            {{ mensajeEditarDeshabilitado }}
          </q-tooltip>
        </q-btn>
        <q-btn
          flat dense no-caps
          color="grey-6"
          icon="refresh"
          label="Actualizar"
          class="session-panel__btn"
          :loading="operativosStore.isLoading"
          @click="actualizar"
        />
      </div>
    </template>
  </q-banner>
</template>

<script>
import { mapGetters } from 'vuex';
import { useOperativosPermisosStore } from 'src/stores/operativosPermisosStore';
import { resolveUsernameFromSession } from '../utils/sessionCollaborator';

export default {
  name: 'UsuarioSesionPermisosPanel',

  props: {
    compact: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      operativosStore: useOperativosPermisosStore(this.$pinia)
    };
  },

  computed: {
    ...mapGetters('auth', {
      usuarioSesion: 'getUser'
    }),

    usernameSesion () {
      return resolveUsernameFromSession(this.usuarioSesion);
    },

    mostrarPanel () {
      return !this.compact || this.operativosStore.isLoading || !!this.usernameSesion;
    },

    bannerClass () {
      if (this.operativosStore.isLoading) {
        return 'session-panel--loading bg-blue-1 text-blue-9';
      }
      if (!this.operativosStore.tieneAlgunPermisoOperativo) {
        return 'session-panel--empty bg-grey-2 text-grey-9';
      }
      return 'session-panel--ok bg-green-1 text-green-10';
    },

    bannerIcon () {
      if (this.operativosStore.isLoading) return 'hourglass_top';
      if (!this.operativosStore.tieneAlgunPermisoOperativo) return 'shield';
      return 'verified_user';
    },

    permisosOperativos () {
      return (this.operativosStore.permisosActivos || []).filter(
        function (p) { return p && p.group === 'aprobacion'; }
      );
    },

    permisosEliminacion () {
      return (this.operativosStore.permisosActivos || []).filter(
        function (p) { return p && p.group === 'eliminacion'; }
      );
    },

    puedeEditarSesion () {
      return !!this.usernameSesion &&
        !this.operativosStore.isLoading &&
        !!this.operativosStore.collaboratorId;
    },

    mensajeEditarDeshabilitado () {
      if (!this.usernameSesion) return 'No hay usuario de sesión activo.';
      if (this.operativosStore.isLoading) return 'Espera a que termine la carga de permisos.';
      if (!this.operativosStore.collaboratorId) return 'El usuario no tiene un colaborador vinculado en talento humano.';
      return '';
    }
  },

  watch: {
    usernameSesion: {
      immediate: true,
      handler: function (username) {
        this.cargarSiNecesario(username);
      }
    }
  },

  methods: {
    async cargarSiNecesario (username) {
      if (!username) {
        this.operativosStore.reset();
        return;
      }
      if (
        this.operativosStore.isResolved &&
        this.operativosStore.username === username
      ) return;
      await this.operativosStore.loadForUsername(username);
    },

    async actualizar () {
      await this.operativosStore.refresh();
    },

    editarSesion () {
      if (!this.puedeEditarSesion) return;
      this.$emit('edit-sesion');
    }
  }
};
</script>

<style scoped>
.session-panel {
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.session-panel__header {
  margin-bottom: 4px;
}

.session-panel__title {
  font-size: 14px;
  color: #1e293b;
}

.session-panel__lead {
  line-height: 1.5;
  font-size: 13px;
}

.session-panel__username {
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
}

.session-panel__fullname {
  font-weight: 400;
  font-size: 12px;
  color: #64748b;
}

.session-panel__hint {
  font-weight: 400;
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
}

/* ═══ Grupos de permisos ═══ */
.session-panel__groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.permiso-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}

.permiso-group__label {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.04);
  white-space: nowrap;
  margin-top: 3px;
}

.permiso-group__label--danger {
  color: #c2410c;
  background: rgba(194, 65, 12, 0.08);
}

.permiso-group__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

/* ═══ Chip: Rol principal ═══ */
.permiso-chip--role {
  background: #166534 !important;
  color: #fff !important;
  border: none !important;
  font-weight: 600;
  font-size: 12px;
}

/* ═══ Chip: Operativo (neutro) ═══ */
.permiso-chip--operativo {
  background: #fff;
  border-color: #cbd5e1;
  color: #475569;
  font-size: 12px;
}

/* ═══ Chip: Eliminación (peligro) ═══ */
.permiso-chip--danger {
  background: #fff5f5;
  border-color: #fca5a5;
  color: #991b1b;
  font-size: 12px;
}

/* ═══ Acciones ═══ */
.session-panel__actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-panel__btn {
  font-size: 12px;
}

.session-panel__btn--edit {
  font-weight: 600;
}
</style>
