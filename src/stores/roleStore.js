/**
 * roleStore — Datos de roles del sistema.
 *
 * Stack:
 *   - Vue 2 + @pinia/vue2 (Pinia adaptado)
 *   - Sintaxis: defineStore con options (sin setup())
 *
 * UX rationale:
 *   - Mantiene un único estado de carga (`isLoading`) para controlar la
 *     visibilidad de la lista de roles mientras se consume el endpoint.
 *   - Expone `roles` como la fuente del sidebar de roles.
 *   - Expone `rolesErrorStatus` para que la vista pueda mostrar el modal de
 *     error amigable cuando el endpoint de roles responde 400.
 */
import { defineStore } from "pinia";
import { getSystemRoles } from "src/api/roles.api";

export const useRoleStore = defineStore("roles", {
  state: function () {
    return {
      /* Lista de roles del sistema. */
      roles: [],
      /* true mientras se consume el endpoint. */
      isLoading: false,
      /* status HTTP del error al cargar los roles (null si no hubo). */
      rolesErrorStatus: null,
      /* true cuando ya se intentó la carga (para evitar recargar siempre). */
      loaded: false,
    };
  },

  actions: {
    /**
     * Consume /api/v1/roles.
     * Si el endpoint responde 400 (u otro 4xx), se expone rolesErrorStatus
     * para que la vista muestre el modal amigable.
     */
    async loadRoles() {
      if (this.loaded) {
        return;
      }
      this.isLoading = true;
      this.rolesErrorStatus = null;

      try {
        var result = await getSystemRoles();
        if (
          result.status != null &&
          result.status >= 400 &&
          result.status < 500
        ) {
          // 400 (y otros 4xx) → modal de error amigable para el usuario.
          this.rolesErrorStatus = result.status;
          this.roles = [];
        } else if (
          result.status != null &&
          result.status <= 299 &&
          Array.isArray(result.data)
        ) {
          this.roles = result.data;
        } else if (result.error) {
          // Error de red u otro inesperado.
          this.rolesErrorStatus =
            result.status != null ? result.status : 500;
          this.roles = [];
        } else {
          this.roles = this.roles || [];
        }
      } catch (err) {
        this.rolesErrorStatus = 500;
        this.roles = [];
      } finally {
        this.loaded = true;
        this.isLoading = false;
      }
    },

    reset() {
      this.roles = [];
      this.isLoading = false;
      this.rolesErrorStatus = null;
      this.loaded = false;
    },
  },
});
