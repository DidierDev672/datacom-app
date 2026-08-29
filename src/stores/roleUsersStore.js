/**
 * roleUsersStore — Datos de colaboradores y usuarios del sistema.
 *
 * Stack:
 *   - Vue 2 + @pinia/vue2 (Pinia adaptado)
 *   - Sintaxis: defineStore con options (sin setup())
 *
 * UX rationale:
 *   - Mantiene un único estado de carga (`isLoading`) para controlar el
 *     LoadingOverlay de pantalla completa mientras se consumen los endpoints.
 *   - Expone `usersForSidebar`: la unión de colaboradores que ya tienen un
 *     usuario vinculado por `collaboratorId`. Esta es la fuente del sidebar.
 *   - Expone `usersErrorStatus` para que la vista pueda mostrar el modal de
 *     error amigable cuando el endpoint de usuarios responde 400.
 */
import { defineStore } from "pinia";
import { colaboradoresApi } from "src/api/colaboradores.api";
import { getSystemUsers } from "src/api/users.api";

export const useRoleUsersStore = defineStore("roleUsers", {
  state: function () {
    return {
      /* Lista completa de colaboradores (HR). */
      collaborators: [],
      /* Lista de usuarios del sistema. */
      users: [],
      /* true mientras se consumen los endpoints. */
      isLoading: false,
      /* Ocurrió un error al cargar colaboradores. */
      collaboratorsError: false,
      /* status HTTP del error al cargar usuarios (null si no hubo). */
      usersErrorStatus: null,
      /* true cuando ya se intentó la carga (para evitar recargar siempre). */
      loaded: false,
    };
  },

  getters: {
    /**
     * Usuarios que deben visualizarse en el sidebar:
     * colaboradores que tienen un usuario vinculado por `collaboratorId`.
     */
    usersForSidebar: function (state) {
      var idByUser = {};
      (state.users || []).forEach(function (u) {
        idByUser[u.collaboratorId] = u;
      });

      var result = [];
      (state.collaborators || []).forEach(function (col) {
        var user = col && col.id != null ? idByUser[col.id] : null;
        if (user) {
          result.push({
            userId: user.id,
            collaboratorId: col.id,
            nombreCompleto: col.nombreCompleto || "Sin nombre",
            numeroDocumento: col.numeroDocumento || "",
            username: user.username || "",
            active: user.active !== false,
            accessStatus: user.accessStatus || "ACTIVE",
          });
        }
      });
      return result;
    },
  },

  actions: {
    /**
     * Consume /api/v1/colaboradores y /api/v1/users en paralelo.
     * Si el endpoint de usuarios responde 400, se expone usersErrorStatus
     * para que la vista muestre el modal amigable.
     */
    async loadData() {
      if (this.loaded) {
        return;
      }
      this.isLoading = true;
      this.collaboratorsError = false;
      this.usersErrorStatus = null;

      try {
        var collaborators = await colaboradoresApi.getAll();
        this.collaborators = Array.isArray(collaborators)
          ? collaborators
          : [];
      } catch (err) {
        this.collaboratorsError = true;
        this.collaborators = [];
      }

      try {
        var usersData = await getSystemUsers();
        if (
          usersData.status != null &&
          usersData.status >= 400 &&
          usersData.status < 500
        ) {
          // 400 (y otros 4xx) → modal de error amigable para el usuario.
          this.usersErrorStatus = usersData.status;
          this.users = [];
        } else if (
          usersData.status != null &&
          usersData.status <= 299 &&
          Array.isArray(usersData.data)
        ) {
          this.users = usersData.data;
        } else if (usersData.error) {
          // Error de red u otro inesperado.
          this.usersErrorStatus = usersData.status != null ? usersData.status : 500;
          this.users = [];
        } else {
          this.users = this.users || [];
        }
      } catch (err) {
        this.usersErrorStatus = 500;
        this.users = [];
      }

      this.loaded = true;
      this.isLoading = false;
    },

    reset() {
      this.collaborators = [];
      this.users = [];
      this.isLoading = false;
      this.collaboratorsError = false;
      this.usersErrorStatus = null;
      this.loaded = false;
    },
  },
});
