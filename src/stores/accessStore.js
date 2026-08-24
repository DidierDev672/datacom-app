/**
 * Store Pinia del módulo de Gestión de Acceso al Sistema.
 *
 * Stack del proyecto:
 *   - Vue 2 + @pinia/vue2 (Pinia adaptado)
 *   - Quasar v1
 *   - Sintaxis: defineStore con options (sin `setup()`)
 *
 * UX rationale:
 *   - Estado plano y claro: cada paso del wizard tiene sus propios campos.
 *   - Estados de carga separados (isCheckingUsername, isGeneratingToken...)
 *     para mostrar spinners donde realmente ocurre la acción (feedback localizado).
 *   - El éxito se modela como `isSuccess + createdAccessResult` para que la vista
 *     pueda renderizar un banner de confirmación sin tener que mantener flags extra.
 */
import { defineStore } from "pinia";
import { colaboradoresApi } from "src/api/colaboradores.api";
import { userAccessApi } from "src/api/userAccess.api";

// Estado inicial extraído para que resetForm() pueda restaurarlo limpio.
const INITIAL_STATE = () => ({
  // ---------- Paso 1 ----------
  collaboratorSearchResults: [],
  /** Lista completa de colaboradores en HR (sirve como fuente para filtro local). */
  registeredCollaborators: [],
  /** true cuando la lista proviene del registro general de empleados (HR). */
  usesHrEmployeeRegistry: false,
  selectedCollaborator: null,
  /** true cuando el colaborador ya tiene acceso y se actualizan credenciales. */
  isEditingExistingAccess: false,
  existingAccessId: null,
  originalUsername: "",

  // ---------- Paso 2 ----------
  username: "",
  usernameAvailable: null,
  isCheckingUsername: false,
  password: "",
  passwordConfirm: "",
  usernameSuggestion: null,

  // ---------- Paso 3 ----------
  accessToken: "",
  active: true,
  forcePasswordChange: true,
  sendWelcomeEmail: false,
  requireMfa: false,

  // ---------- Estado general ----------
  currentStep: 1,
  isSearchingCollaborators: false,
  isLoadingUsername: false,
  isGeneratingToken: false,
  isSaving: false,
  isSuccess: false,
  createdAccessResult: null,
  error: null,
});

export const useAccessStore = defineStore("access", {
  state: () => INITIAL_STATE(),

  getters: {
    /** Paso 1 listo si hay un colaborador seleccionado. */
    canAdvanceFromStep1(state) {
      return state.selectedCollaborator !== null;
    },
    /**
     * Paso 2 listo: username con formato válido, no marcado como "no disponible",
     * contraseña fuerte y confirmación igual.
     * (Si la API check-username falla, usernameAvailable queda null: no bloqueamos el avance;
     * el servidor valida al crear el acceso.)
     */
    canAdvanceFromStep2(state) {
      var usernameOk =
        isValidUsernameShape(state.username) &&
        state.usernameAvailable !== false;
      var passwordsMatch =
        !!state.password && state.password === state.passwordConfirm;
      var passwordIsStrong = isStrongPassword(state.password);
      return usernameOk && passwordsMatch && passwordIsStrong;
    },
    /** Paso 3 siempre puede avanzar (todas las opciones tienen default). */
    canAdvanceFromStep3() {
      return true;
    },
    /**
     * Etiqueta legible del estado actual de acceso, derivada de las opciones.
     * Útil para mostrar en el resumen del Paso 4.
     */
    accessStatusLabel(state) {
      if (!state.active) return "BLOCKED";
      if (state.forcePasswordChange) return "PENDING_CHANGE";
      return "ACTIVE";
    },
  },

  actions: {
    // -------------------- PASO 1 --------------------
    /**
     * Carga todos los colaboradores registrados (endpoint HR) y arma la vista visible.
     * El filtro por texto se hace localmente en filterCollaboratorsList.
     */
    async fetchRegisteredCollaborators() {
      this.isSearchingCollaborators = true;
      this.error = null;
      this.usesHrEmployeeRegistry = false;
      try {
        var list = await userAccessApi.getCollaboratorsWithoutAccess();
        var arr = Array.isArray(list) ? list : [];
        this.registeredCollaborators = arr.map(mapCollaboratorSummaryDto);
        this.filterCollaboratorsList("");
      } catch (err) {
        this.error = parseError(err, "No se pudieron cargar los colaboradores");
        this.registeredCollaborators = [];
        this.collaboratorSearchResults = [];
      } finally {
        this.isSearchingCollaborators = false;
      }
    },

    /**
     * Carga empleados activos desde el registro de Talento Humano (/api/v1/colaboradores).
     * Útil cuando no hay candidatos sin acceso pero el administrador quiere verificar el padrón.
     */
    async searchRegisteredEmployees(term) {
      this.isSearchingCollaborators = true;
      this.error = null;
      this.usesHrEmployeeRegistry = true;
      try {
        var list = await colaboradoresApi.search(term || "");
        var arr = Array.isArray(list) ? list : [];
        this.registeredCollaborators = arr.map(mapColaboradorDto);
        this.filterCollaboratorsListLocal(term || "");
      } catch (err) {
        this.error = parseError(
          err,
          "No se pudieron buscar empleados registrados"
        );
        this.registeredCollaborators = [];
        this.collaboratorSearchResults = [];
      } finally {
        this.isSearchingCollaborators = false;
      }
    },

    /**
     * Filtra colaboradores sin acceso y actualiza collaboratorSearchResults (debounce desde la vista).
     */
    filterCollaboratorsListLocal(term) {
      var needle = String(term || "")
        .trim()
        .toLowerCase();
      if (!needle) {
        this.collaboratorSearchResults = (
          this.registeredCollaborators || []
        ).slice();
        return;
      }
      this.collaboratorSearchResults = (
        this.registeredCollaborators || []
      ).filter(function (c) {
        return matchesCollaboratorTerm(c, needle);
      });
    },

    async filterCollaboratorsList(term) {
      if (this.usesHrEmployeeRegistry) {
        this.filterCollaboratorsListLocal(term);
        return;
      }
      if (!term || !String(term).trim()) {
        this.collaboratorSearchResults = (
          this.registeredCollaborators || []
        ).slice();
        return;
      }
      this.isSearchingCollaborators = true;
      try {
        var list = await userAccessApi.getCollaboratorsWithoutAccess(
          String(term).trim()
        );
        this.collaboratorSearchResults = (Array.isArray(list) ? list : []).map(
          mapCollaboratorSummaryDto
        );
      } catch (err) {
        this.error = parseError(err, "No se pudieron buscar colaboradores");
        this.collaboratorSearchResults = [];
      } finally {
        this.isSearchingCollaborators = false;
      }
    },

    /**
     * @deprecated Usar fetchRegisteredCollaborators + filterCollaboratorsList.
     * Se mantiene por compatibilidad: delega en filtro local.
     */
    async searchCollaborators(term) {
      this.filterCollaboratorsList(term);
    },

    /** Selecciona un colaborador y dispara la sugerencia de username o carga credenciales existentes. */
    async selectCollaborator(collaborator) {
      this.isEditingExistingAccess = false;
      this.existingAccessId = null;
      this.originalUsername = "";
      this.error = null;

      if (collaborator && collaborator.id) {
        try {
          var status = await userAccessApi.getStatusByCollaborator(
            collaborator.id
          );
          if (status && status.hasAccess) {
            this.selectedCollaborator = collaborator;
            this.isEditingExistingAccess = true;
            this.existingAccessId = status.accessId;
            this.applyExistingAccessStatus(status);
            return true;
          }
        } catch (err) {
          // Si no se puede verificar, el backend validará al crear el acceso.
        }
      }

      this.selectedCollaborator = collaborator;
      this.username = "";
      this.usernameAvailable = null;
      this.usernameSuggestion = null;
      if (collaborator && collaborator.id) {
        await this.fetchUsernameSuggestion();
      }
      return true;
    },

    /** Pre-carga username y opciones de seguridad al editar un acceso existente. */
    applyExistingAccessStatus(status) {
      this.username = (status.username || "").trim().toLowerCase();
      this.originalUsername = this.username;
      this.usernameAvailable = this.username ? true : null;
      this.usernameSuggestion = null;
      this.password = "";
      this.passwordConfirm = "";
      this.active = status.active !== false;
      this.forcePasswordChange = status.forcePasswordChange !== false;
      this.sendWelcomeEmail = false;
      this.requireMfa = !!status.requireMfa;
      this.accessToken = status.accessToken || "";
    },

    // -------------------- PASO 2 --------------------
    /**
     * Solicita sugerencia de username al backend para el colaborador seleccionado.
     * Si la sugerencia primaria está disponible, la usamos automáticamente.
     */
    async fetchUsernameSuggestion() {
      if (!this.selectedCollaborator) return;
      this.isLoadingUsername = true;
      try {
        const sug =
          (await userAccessApi.suggestUsername(this.selectedCollaborator.id)) ||
          {};
        this.usernameSuggestion = sug;
        const value = sug.available
          ? sug.primary
          : sug.alternative || sug.primary || "";
        this.username = value;
        this.usernameAvailable =
          typeof sug.available === "boolean" ? sug.available : null;
      } catch (err) {
        this.error = parseUserAccessError(
          err,
          "No se pudo sugerir un username"
        );
      } finally {
        this.isLoadingUsername = false;
      }
    },

    /**
     * Verifica disponibilidad del username actual.
     * Diseñado para ser llamado por el composable con debounce desde el componente.
     */
    async checkUsernameAvailability() {
      const value = (this.username || "").trim().toLowerCase();
      if (!value || value.length < 3) {
        this.usernameAvailable = null;
        return;
      }
      this.isCheckingUsername = true;
      try {
        const excludeId = this.isEditingExistingAccess
          ? this.existingAccessId
          : null;
        const data = await userAccessApi.checkUsername(value, excludeId);
        this.usernameAvailable = !!(data && data.available);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          this.error = parseUserAccessError(
            err,
            "No se pudo verificar el username"
          );
        }
        // No dejamos en false (tomado); null = sin verificación reciente pero el usuario puede seguir.
        this.usernameAvailable = null;
      } finally {
        this.isCheckingUsername = false;
      }
    },

    // -------------------- PASO 3 --------------------
    async generateToken() {
      this.isGeneratingToken = true;
      this.error = null;
      try {
        const data = await userAccessApi.generateToken();
        this.accessToken = (data && data.token) || "";
      } catch (err) {
        this.error = parseUserAccessError(err, "No se pudo generar el token");
      } finally {
        this.isGeneratingToken = false;
      }
    },

    // -------------------- PASO 4 --------------------
    buildAccessPayload() {
      return {
        username: (this.username || "").trim().toLowerCase(),
        password: this.password,
        accessToken: this.accessToken || null,
        active: this.active,
        forcePasswordChange: this.forcePasswordChange,
        sendWelcomeEmail: this.sendWelcomeEmail,
        requireMfa: this.requireMfa,
      };
    },

    async createAccess() {
      if (!this.selectedCollaborator) {
        this.error =
          "Debes seleccionar un colaborador antes de crear el acceso";
        return null;
      }
      if (this.isEditingExistingAccess) {
        return this.updateAccess();
      }
      this.isSaving = true;
      this.error = null;
      try {
        const payload = Object.assign(
          { collaboratorId: this.selectedCollaborator.id },
          this.buildAccessPayload()
        );
        const data = await userAccessApi.create(payload);
        this.createdAccessResult = data;
        this.isSuccess = true;
        return data;
      } catch (err) {
        this.error = parseUserAccessError(err, "No se pudo crear el acceso");
        return null;
      } finally {
        this.isSaving = false;
      }
    },

    async updateAccess() {
      if (!this.existingAccessId) {
        this.error = "No se encontró el acceso a actualizar";
        return null;
      }
      this.isSaving = true;
      this.error = null;
      try {
        const data = await userAccessApi.update(
          this.existingAccessId,
          this.buildAccessPayload()
        );
        this.createdAccessResult = data;
        this.isSuccess = true;
        return data;
      } catch (err) {
        this.error = parseUserAccessError(
          err,
          "No se pudieron actualizar las credenciales"
        );
        return null;
      } finally {
        this.isSaving = false;
      }
    },

    // -------------------- Utilidades --------------------
    goToStep(step) {
      if (typeof step === "number" && step >= 1 && step <= 4) {
        this.currentStep = step;
      }
    },

    /** Resetea todo el formulario sin perder la sesión. */
    resetForm() {
      Object.assign(this, INITIAL_STATE());
    },
  },
});

// ============================================================
// Helpers privados (no exportados)
// ============================================================

function isValidUsernameShape(username) {
  var v = (username || "").trim().toLowerCase();
  return v.length >= 3 && /^[a-z0-9._]+$/.test(v);
}

function isStrongPassword(pwd) {
  if (!pwd || pwd.length < 8) return false;
  if (!/[A-Z]/.test(pwd)) return false;
  if (!/[0-9]/.test(pwd)) return false;
  if (!/[!@#$%^&*]/.test(pwd)) return false;
  return true;
}

function parseError(err, fallback) {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err.response && err.response.data) {
    if (err.response.data.error) return err.response.data.error;
    if (err.response.data.errors) {
      const first = Object.values(err.response.data.errors)[0];
      if (first) return first;
    }
  }
  return err.message || fallback;
}

/** 403 en /api/user-access: el controlador exige rol ADMIN (ver UserAccessController). */
function parseUserAccessError(err, fallback) {
  if (err && err.response && err.response.status === 403) {
    return "Esta acción requiere rol de administrador (ADMIN).";
  }
  return parseError(err, fallback);
}

function mapCollaboratorSummaryDto(c) {
  return {
    id: c.id,
    fullName: c.fullName ? c.fullName : "Sin nombre",
    email: c.email ? c.email : "",
    position: c.position ? c.position : "",
    department: c.department ? c.department : "",
    codigoCargo: "",
    numeroDocumento: "",
  };
}

function mapColaboradorDto(c) {
  return {
    id: c.id,
    fullName: c.nombreCompleto || "Sin nombre",
    email: c.correoElectronico || "",
    position: c.cargoAsignado || c.nombreCargo || "",
    department: c.areaDepartamento || "",
    codigoCargo: c.codigoCargo || "",
    numeroDocumento: c.numeroDocumento || "",
  };
}

function matchesCollaboratorTerm(c, needle) {
  return (
    (c.fullName && c.fullName.toLowerCase().includes(needle)) ||
    (c.email && c.email.toLowerCase().includes(needle)) ||
    (c.position && c.position.toLowerCase().includes(needle)) ||
    (c.department && c.department.toLowerCase().includes(needle)) ||
    (c.numeroDocumento && c.numeroDocumento.toLowerCase().includes(needle)) ||
    (c.codigoCargo && c.codigoCargo.toLowerCase().includes(needle))
  );
}
