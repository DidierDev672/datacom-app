import { defineStore } from "pinia";
import axios from "axios";
import client from "src/api/client";
import { getRawToken } from "src/utils/authHelper";

/**
 * Módulos Vuex legacy usan el axios global (`import axios from 'axios'`).
 * Pinia usa la instancia `client`; sin esto, rutas como GET /encuesta/... van sin Bearer → 403.
 */
function syncGlobalAxiosAuth(token, tenantHeader) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
  if (
    tenantHeader !== undefined &&
    tenantHeader !== null &&
    tenantHeader !== ""
  ) {
    axios.defaults.headers.common["X-Tenantid"] = tenantHeader;
  } else {
    delete axios.defaults.headers.common["X-Tenantid"];
  }
}

/**
 * Store de autenticación con soporte para permisos de usuario.
 * Reemplaza el sistema Vuex legacy con Pinia moderno.
 */
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    tenant: null,
    userId: null,
    permissions: [],
    roles: [],
    isLoading: false,
    isAuthenticated: false,
    error: null,
  }),

  getters: {
    /**
     * Verifica si el usuario tiene un permiso específico
     * @param {string} module - Código del módulo (ej: 'REQUESTS', 'INVENTORY')
     * @param {string} action - Acción (READ, CREATE, UPDATE, DELETE, VALIDATE, AUTHORIZE)
     */
    hasPermission: (state) => (module, action) => {
      if (!state.permissions || state.permissions.length === 0) return false;
      return state.permissions.some(
        (p) => p.module === module && p.action === action
      );
    },

    /**
     * Verifica si el usuario tiene acceso a un módulo (cualquier permiso)
     */
    hasModuleAccess: (state) => (module) => {
      if (!state.permissions || state.permissions.length === 0) return false;
      return state.permissions.some((p) => p.module === module);
    },

    /**
     * Verifica si el usuario tiene un rol específico
     */
    hasRole: (state) => (role) => {
      if (!state.roles || state.roles.length === 0) return false;
      return state.roles.some((r) => r === role || r === `ROLE_${role}`);
    },

    /**
     * Verifica si es administrador
     */
    isAdmin: (state) => {
      return state.roles.some((r) => r === "ADMIN" || r === "ROLE_ADMIN");
    },

    /**
     * Módulos a los que el usuario tiene acceso
     */
    accessibleModules: (state) => {
      if (!state.permissions) return [];
      const modules = new Set();
      state.permissions.forEach((p) => modules.add(p.module));
      return Array.from(modules);
    },
  },

  actions: {
    /**
     * Iniciar sesión
     */
    async login(credentials) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await client.post("/", {
          username: credentials.username,
          password: credentials.password,
        });

        const data = response.data;

        if (!data || !data.token) {
          throw new Error("Respuesta de login inválida");
        }

        this.token = data.token;
        this.user = {
          username: credentials.username,
          ...data.user,
        };
        this.tenant = credentials.tenant;
        this.userId = data.userId || null;
        this.isAuthenticated = true;

        // Guardar en localStorage para persistencia
        localStorage.setItem(
          "token",
          JSON.stringify({
            token: data.token,
            username: credentials.username,
          })
        );
        localStorage.setItem("tenant", JSON.stringify(credentials.tenant));

        // Configurar headers de axios
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;
        client.defaults.headers.common["X-Tenantid"] = credentials.tenant;
        syncGlobalAxiosAuth(data.token, credentials.tenant);

        // Cargar permisos del usuario
        await this.loadUserPermissions(credentials.username);

        return data;
      } catch (err) {
        var msg = "";
        if (err.response && err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        } else if (err.message) {
          msg = err.message;
        } else {
          msg = "Error al iniciar sesión";
        }
        this.error = msg;
        this.isAuthenticated = false;
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Cargar permisos del usuario desde el backend
     */
    async loadUserPermissions(username) {
      try {
        // Intentar obtener permisos del endpoint nuevo
        const response = await client.get(`/api/users/${username}/permissions`);
        this.permissions = response.data.permissions || [];
        this.roles = response.data.roles || [];
      } catch (err) {
        // Si el endpoint no existe, extraer roles del token JWT
        const tokenData = this.parseJwt(this.token);
        if (tokenData && tokenData.authorities) {
          this.roles = tokenData.authorities.map((a) => a.authority);
        }
        // Permisos vacíos por defecto - el backend debe implementar el endpoint
        this.permissions = [];
      }
    },

    /**
     * Obtener datos completos del usuario actual.
     * 1. Intenta GET /api/users/ y busca el usuario por username
     * 2. Si no lo encuentra o falla la peticion, intenta GET /usuario/{userId}
     * 3. Retorna { success: true/false, user: ... }
     */
    async fetchCurrentUserDetails() {
      console.log('[fetchCurrentUserDetails] Iniciando busqueda de datos del usuario');
      var currentUsername = this.user && this.user.username;
      if (!currentUsername) {
        console.warn('[fetchCurrentUserDetails] No hay username en el store, abortando');
        return { success: false, user: this.user };
      }
      console.log('[fetchCurrentUserDetails] Buscando datos para username:', currentUsername);

      // --- Intento 1: /api/users/ ---
      console.log('[fetchCurrentUserDetails] Intento 1: GET /api/users/');
      try {
        var response = await client.get("/api/users/");
        var data = response.data;
        var users = (data && data.results) || data || [];
        console.log('[fetchCurrentUserDetails] GET /api/users/ retorno', (Array.isArray(users) ? users.length : 0), 'usuarios');

        var found = Array.isArray(users)
          ? users.find(function (u) { return u.username === currentUsername; })
          : null;

        if (found) {
          console.log('[fetchCurrentUserDetails] Usuario encontrado en /api/users/, id:', found.id);
          this.user = Object.assign({}, this.user, found);
          this.userId = found.id || this.userId;
          return { success: true, user: this.user, source: '/api/users/' };
        }
        console.warn('[fetchCurrentUserDetails] Usuario NO encontrado en /api/users/, intentando fallback...');
      } catch (err) {
        console.warn('[fetchCurrentUserDetails] Error en GET /api/users/:', err.message || err);
      }

      // --- Intento 2: /usuarios/ ---
      console.log('[fetchCurrentUserDetails] Intento 2: GET /usuarios/');
      try {
        var res2 = await client.get("/usuarios/");
        var usuariosData = res2.data;
        console.log('[fetchCurrentUserDetails] GET /usuarios/ retorno', Array.isArray(usuariosData) ? usuariosData.length : 0, 'usuarios');
        var found2 = Array.isArray(usuariosData)
          ? usuariosData.find(function (u) { return u.username === currentUsername; })
          : null;
        if (found2) {
          console.log('[fetchCurrentUserDetails] Usuario encontrado en /usuarios/, id:', found2.id);
          this.user = Object.assign({}, this.user, found2);
          return { success: true, user: this.user, source: '/usuarios/' };
        }
        console.warn('[fetchCurrentUserDetails] Usuario no encontrado en /usuarios/');
      } catch (err2) {
        console.warn('[fetchCurrentUserDetails] Error en GET /usuarios/:', err2.message || err2);
      }

      // --- Ambos fallaron ---
      console.error('[fetchCurrentUserDetails] Ambos intentos fallaron, no se pudieron cargar los datos del usuario');
      return { success: false, user: this.user };
    },

    /**
     * Buscar informacion del usuario por username en las tablas de permisos
     * GET /api/v1/user-search?username=xxx
     */
    async searchUserProfile(username) {
      if (!username) return null;
      try {
        var response = await client.get("/api/v1/user-search", {
          params: { username: username },
        });
        return response.data;
      } catch (err) {
        console.warn("[searchUserProfile] Error:", err.message || err);
        return null;
      }
    },

    /**
     * Actualizar perfil del usuario
     * PUT /usuario/profile
     */
    async updateProfile(payload) {
      var rawToken = getRawToken();
      if (!rawToken) {
        console.error('[updateProfile] No hay sesión activa — token nulo');
        throw new Error('No hay sesión activa');
      }
      console.log('[updateProfile] PUT /usuario/profile payload:', JSON.stringify(payload));
      console.log('[updateProfile] Token starts with:', rawToken.substring(0, 20) + '...');

      try {
        var response = await client.put('/usuario/profile', payload);
        console.log('[updateProfile] Respuesta status:', response.status);
        console.log('[updateProfile] Respuesta completa:', JSON.stringify(response.data));

        var data = response.data && (response.data.data || response.data);
        if (data) {
          console.log('[updateProfile] Datos recibidos:', JSON.stringify(data).substring(0, 500));
          this.user = Object.assign({}, this.user || {}, data);
          if (data.tenant) {
            console.log('[updateProfile] Actualizando tenant desde respuesta:', data.tenant);
            this.tenant = data.tenant;
          }
          if (data.roles) {
            console.log('[updateProfile] Actualizando roles desde respuesta:', data.roles);
            this.roles = data.roles;
          }
          console.log('[updateProfile] Perfil actualizado correctamente en store');
        } else {
          console.warn('[updateProfile] Respuesta vacía, no se actualizó el store');
        }
        return data;

      } catch (err) {
        var errMsg = '';
        var errStatus = '';
        if (err.response) {
          errStatus = err.response.status;
          errMsg = err.response.data && (err.response.data.error || err.response.data.message || JSON.stringify(err.response.data));
          console.error('[updateProfile] Error HTTP', errStatus, '-', errMsg);
        } else if (err.request) {
          console.error('[updateProfile] Error de red — sin respuesta del servidor');
          errMsg = 'Sin conexión con el servidor';
        } else {
          errMsg = err.message || 'Error desconocido';
          console.error('[updateProfile] Error inesperado:', errMsg);
        }
        throw new Error(errMsg || 'Error al actualizar el perfil');
      }
    },

    /**
     * Parsear JWT para extraer información
     */
    parseJwt(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    },

    /**
     * Restaurar sesión desde localStorage
     */
    async restoreSession() {
      const tokenData = localStorage.getItem("token");
      const tenantData = localStorage.getItem("tenant");

      if (!tokenData) return false;

      try {
        const parsed = JSON.parse(tokenData);
        this.token = parsed.token;
        this.user = { username: parsed.username };
        this.tenant = JSON.parse(tenantData);
        this.isAuthenticated = true;

        // Restaurar headers de axios
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${parsed.token}`;
        if (this.tenant) {
          client.defaults.headers.common["X-Tenantid"] = this.tenant;
        }
        syncGlobalAxiosAuth(parsed.token, this.tenant || undefined);

        // Recargar permisos
        await this.loadUserPermissions(parsed.username);

        return true;
      } catch (e) {
        this.logout();
        return false;
      }
    },

    /**
     * Cerrar sesión
     */
    logout() {
      this.user = null;
      this.token = null;
      this.tenant = null;
      this.permissions = [];
      this.roles = [];
      this.isAuthenticated = false;
      this.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("tenant");
      localStorage.removeItem("user");

      delete client.defaults.headers.common["Authorization"];
      delete client.defaults.headers.common["X-Tenantid"];
      syncGlobalAxiosAuth(null, null);
    },

    /**
     * Limpiar errores
     */
    clearError() {
      this.error = null;
    },
  },
});
