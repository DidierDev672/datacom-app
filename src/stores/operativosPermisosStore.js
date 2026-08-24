import { defineStore } from 'pinia';
import { listAprobadores } from 'src/api/aprobadores.api';
import { colaboradoresApi } from 'src/api/colaboradores.api';
import { colaboradorPermisosApi } from 'src/api/colaboradorPermisos.api';
import { colaboradorAreasApi } from 'src/api/colaboradorAreas.api';
import {
  PERMISOS_OPERATIVOS,
  PERMISOS_VISIBILIDAD,
  buildPermisosIniciales,
  buildVisibilidadIniciales,
  mergePermisosFromRecords,
  mergeVisibilidadFromRecord,
  contarPermisosActivos
} from 'src/modules/talento-humano/ui/constants/permisosOperativos';
import {
  resolveCollaboratorId,
  findColaboradorById
} from 'src/modules/talento-humano/ui/utils/sessionCollaborator';

function isRegisteredSystemApprover (approvers, collaboratorId) {
  if (!collaboratorId || !Array.isArray(approvers) || approvers.length === 0) {
    return false;
  }
  const normalizedCollaboratorId = String(collaboratorId);
  return approvers.some(function (approver) {
    return String(approver.collaboratorId) === normalizedCollaboratorId;
  });
}

function filterAsignacionesPorColaborador (permisos, collaboratorId) {
  if (!collaboratorId || !Array.isArray(permisos)) {
    return [];
  }
  const normalizedCollaboratorId = String(collaboratorId);
  return permisos.filter(function (permiso) {
    return permiso && String(permiso.colaboradorId) === normalizedCollaboratorId;
  });
}

/**
 * Permisos operativos del usuario autenticado, compartidos en toda la aplicación.
 */
export const useOperativosPermisosStore = defineStore('operativosPermisos', {
  state: function () {
    return {
      username: '',
      collaboratorId: '',
      collaboratorNombre: '',
      asignaciones: [],
      permisos: buildPermisosIniciales(),
      visibilidad: buildVisibilidadIniciales(),
      isSystemApprover: false,
      isLoading: false,
      isResolved: false,
      error: null
    };
  },

  getters: {
    hasPermiso: function (state) {
      return function (key) {
        return !!state.permisos[key];
      };
    },

    permisosActivos: function (state) {
      return PERMISOS_OPERATIVOS.filter(function (p) {
        return !!state.permisos[p.key];
      });
    },

    totalPermisosActivos: function (state) {
      return contarPermisosActivos(state.permisos);
    },

    canApproveSupplyRequests: function (state) {
      return state.isSystemApprover || !!state.permisos.permisoAprobaciones;
    },

    canDeleteSupplyRequests: function (state) {
      return !!state.permisos.permisoEliminacionSolicitudes;
    },

    tieneAlgunPermisoOperativo: function (state) {
      return state.isSystemApprover || PERMISOS_OPERATIVOS.some(function (p) {
        return !!state.permisos[p.key];
      });
    },

    componenteVisible: function (state) {
      return function (key) {
        return !!state.visibilidad[key];
      };
    },

    tieneVisibilidadActiva: function (state) {
      return PERMISOS_VISIBILIDAD.some(function (p) {
        return !!state.visibilidad[p.key];
      });
    }
  },

  actions: {
    reset () {
      this.username = '';
      this.collaboratorId = '';
      this.collaboratorNombre = '';
      this.asignaciones = [];
      this.permisos = buildPermisosIniciales();
      this.visibilidad = buildVisibilidadIniciales();
      this.isSystemApprover = false;
      this.isLoading = false;
      this.isResolved = false;
      this.error = null;
    },

    async loadForUsername (username) {
      const normalizedUsername = (username || '').trim();
      if (!normalizedUsername) {
        this.reset();
        this.isResolved = true;
        return;
      }

      if (
        this.isResolved &&
        this.username === normalizedUsername &&
        !this.error
      ) {
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.username = normalizedUsername;

      try {
        const results = await Promise.allSettled([
          colaboradoresApi.getAll(),
          colaboradorPermisosApi.getAll(),
          listAprobadores()
        ]);

        const colaboradores = results[0].status === 'fulfilled' && Array.isArray(results[0].value)
          ? results[0].value
          : [];
        const permisos = results[1].status === 'fulfilled' && Array.isArray(results[1].value)
          ? results[1].value
          : [];
        const approvers = results[2].status === 'fulfilled' && Array.isArray(results[2].value)
          ? results[2].value
          : [];

        this.collaboratorId = resolveCollaboratorId(colaboradores, normalizedUsername);
        this.asignaciones = filterAsignacionesPorColaborador(permisos, this.collaboratorId);
        this.permisos = mergePermisosFromRecords(this.asignaciones);
        this.isSystemApprover = isRegisteredSystemApprover(approvers, this.collaboratorId);

        const colaborador = findColaboradorById(colaboradores, this.collaboratorId);
        this.collaboratorNombre = colaborador && colaborador.nombreCompleto
          ? colaborador.nombreCompleto
          : '';

        if (this.collaboratorId) {
          try {
            var visibilidadData = await colaboradorAreasApi.obtenerVisibilidad(this.collaboratorId);
            this.visibilidad = mergeVisibilidadFromRecord(visibilidadData);
          } catch (errVis) {
            this.visibilidad = buildVisibilidadIniciales();
          }
        } else {
          try {
            var visibilidadPorUsuario = await colaboradorAreasApi.obtenerVisibilidad(null, normalizedUsername);
            this.visibilidad = mergeVisibilidadFromRecord(visibilidadPorUsuario);
          } catch (errVis) {
            this.visibilidad = buildVisibilidadIniciales();
          }
        }

        this.isResolved = true;
      } catch (err) {
        this.error = err && err.message
          ? err.message
          : 'No se pudieron cargar los permisos operativos de la sesión';
        this.collaboratorId = '';
        this.collaboratorNombre = '';
        this.asignaciones = [];
        this.permisos = buildPermisosIniciales();
        this.visibilidad = buildVisibilidadIniciales();
        this.isSystemApprover = false;
        this.isResolved = true;
      } finally {
        this.isLoading = false;
      }
    },

    async refresh () {
      this.isResolved = false;
      await this.loadForUsername(this.username);
    }
  }
});
