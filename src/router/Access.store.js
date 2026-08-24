import { defineStore } from "pinia";
import { pinia } from "src/stores/pinia";
import { useAuthStore } from "src/stores/authStore";
import { useOperativosPermisosStore } from "src/stores/operativosPermisosStore";
import { colaboradorAreasApi } from "src/api/colaboradorAreas.api";
import { getRawToken } from "src/utils/authHelper";
import {
  PERMISOS_VISIBILIDAD,
  mergeVisibilidadFromRecord,
} from "src/modules/talento-humano/ui/constants/permisosOperativos";
import { resolveVisibilidadKeyForRoute } from "./abastecimientoVisibilidad";

/**
 * Store de acceso (Control de rutas por autenticación y roles)
 * ------------------------------------------------------------
 * Este store centraliza:
 * 1. Quién es el usuario actual y qué roles tiene.
 * 2. La lógica que decide si ese usuario puede entrar a una ruta,
 *    usando la información que ya viene en `meta` (requiresAuth, requiresRole).
 * 3. Permisos de visibilidad de componentes del módulo abastecimiento,
 *    obtenidos desde GET /api/v1/colaborador-asignaciones/visibilidad?usuarioId={username}
 */

function normalizeRole(role) {
  if (!role) return role;
  var str = String(role);
  if (str.indexOf("ROLE_") === 0) {
    return str.substring(5);
  }
  return str;
}

function extractRolesFromJwt(token) {
  try {
    var parts = token.split(".");
    if (parts.length < 2) return [];

    var base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    var payload = JSON.parse(jsonPayload);
    var roles = [];

    if (payload.authorities && Array.isArray(payload.authorities)) {
      roles = payload.authorities.map(function (a) {
        return a.authority || a;
      });
    } else if (payload.roles && Array.isArray(payload.roles)) {
      roles = payload.roles;
    }

    return roles.map(normalizeRole);
  } catch (e) {
    return [];
  }
}

function resolveUsernameFromStorage() {
  var username = null;
  var userData = localStorage.getItem("user");

  if (userData) {
    try {
      var parsed = JSON.parse(userData);
      if (typeof parsed === "string") {
        username = parsed;
      } else {
        username = parsed.username || parsed.name || null;
      }
    } catch (err) {
      username = userData;
    }
  }

  if (!username) {
    var tokenStored = localStorage.getItem("token");
    if (tokenStored) {
      try {
        var tokenParsed = JSON.parse(tokenStored);
        username = tokenParsed.username || null;
      } catch (tokenErr) {
        // token sin formato JSON
      }
    }
  }

  return username ? String(username).trim() : null;
}

export const useAccessStore = defineStore("access", {
  state: function () {
    return {
      user: null,
      isAuthenticated: false,
      permisos: {
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
      permisosCargados: false,
    };
  },

  getters: {
    userRoles: function (state) {
      if (!state.user || !state.user.roles) return [];
      return state.user.roles;
    },

    handleRole: function (state) {
      return function (rolesRequeridos) {
        rolesRequeridos = rolesRequeridos || [];
        if (rolesRequeridos.length === 0) return true;
        if (!state.user || !state.user.roles || state.user.roles.length === 0) {
          return false;
        }

        return state.user.roles.some(function (rol) {
          var normalized = normalizeRole(rol);
          return rolesRequeridos.some(function (req) {
            return (
              normalized === req ||
              rol === req ||
              rol === "ROLE_" + req
            );
          });
        });
      };
    },

    puedeVer: function (state) {
      return function (nombrePermiso) {
        return !!state.permisos[nombrePermiso];
      };
    },

    tieneVisibilidadActiva: function (state) {
      return PERMISOS_VISIBILIDAD.some(function (p) {
        return !!state.permisos[p.key];
      });
    },

    // Pinia: otros getters se acceden con `this`, no con un 2.º arg `getters` (eso es Vuex).
    hasRole: function () {
      return this.handleRole;
    },
  },

  actions: {
    setUser(user) {
      this.user = user;
      this.isAuthenticated = !!user;
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.permisosCargados = false;
      this.permisos = {
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
    },

    setPermisos(permisos) {
      permisos = permisos || {};
      this.permisos = Object.assign({}, this.permisos, permisos);
      this.permisosCargados = true;
    },

    resolveUsername() {
      if (this.user && this.user.name) {
        return this.user.name;
      }
      return resolveUsernameFromStorage();
    },

    async obtenerPermisosDesdeBackend(username) {
      var normalizedUsername = (username || "").trim();
      if (!normalizedUsername) {
        return mergeVisibilidadFromRecord(null);
      }

      var data = await colaboradorAreasApi.obtenerVisibilidad(
        null,
        normalizedUsername
      );
      return mergeVisibilidadFromRecord(data);
    },

    async cargarPermisos() {
      var username = this.resolveUsername();
      if (!username) {
        this.permisosCargados = true;
        return;
      }

      var operativosStore = useOperativosPermisosStore(pinia);
      if (
        operativosStore.isResolved &&
        operativosStore.username === username &&
        !operativosStore.error
      ) {
        this.setPermisos(operativosStore.visibilidad);
        return;
      }

      try {
        var permisos = await this.obtenerPermisosDesdeBackend(username);
        this.setPermisos(permisos);
      } catch (err) {
        this.setPermisos({});
      }
    },

    syncFromSession() {
      var tokenRaw = getRawToken();
      var hasToken = !!tokenRaw || !!localStorage.getItem("token");

      if (!hasToken) {
        this.logout();
        return;
      }

      var authStore = useAuthStore(pinia);
      var roles = [];
      var username = null;
      var userId = null;

      if (authStore.isAuthenticated && authStore.user) {
        username = authStore.user.username || null;
        userId = authStore.userId || null;
        if (authStore.roles && authStore.roles.length > 0) {
          roles = authStore.roles.map(normalizeRole);
        }
      }

      if (!username) {
        username = resolveUsernameFromStorage();
      }

      if (roles.length === 0 && tokenRaw) {
        roles = extractRolesFromJwt(tokenRaw);
      }

      this.setUser({
        id: userId,
        name: username,
        roles: roles,
      });
    },

    canAccessRoute(route) {
      var meta = route && route.meta ? route.meta : {};
      var visibilidadKey = resolveVisibilidadKeyForRoute(route);

      if (meta.requiresAuth && !this.isAuthenticated) {
        return { allowed: false, reason: "unauthenticated" };
      }

      if (meta.requiresRole && !this.handleRole(meta.requiresRole)) {
        return { allowed: false, reason: "forbidden" };
      }

      if (visibilidadKey && this.tieneVisibilidadActiva) {
        if (!this.permisos[visibilidadKey]) {
          return { allowed: false, reason: "forbidden" };
        }
      }

      return { allowed: true, reason: null };
    },

    canAccessMatchedRoute(to) {
      var matched = to && to.matched ? to.matched : [];
      var i;

      for (i = 0; i < matched.length; i++) {
        var record = matched[i];
        var result = this.canAccessRoute({
          meta: record.meta,
          name: record.name,
        });
        if (!result.allowed) {
          return result;
        }
      }

      return { allowed: true, reason: null };
    },
  },
});
