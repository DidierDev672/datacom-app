import { defineStore } from "pinia";
import axios from "axios";
import { URL_API } from "../utils/config";
import { getRawToken } from "../utils/authHelper";
import { notifySessionExpired } from "../utils/sessionExpiredHandler";

export const useRubrosStore = defineStore("rubros", {
  state: () => ({
    rubros: [],
    rubro: null,
    isLoading: false,
    isSubmitting: false,
    errors: {},
    isEditing: false,
    originalData: null,
    executionTracker: [],
    isRetryingUpdate: false,
  }),

  getters: {
    // Verificar si el formulario es válido
    isFormValid: (state) => {
      return (
        state.rubro &&
        state.rubro.name &&
        state.rubro.name.trim() !== "" &&
        state.rubro.planId !== null &&
        state.rubro.totalBudget !== null &&
        state.rubro.totalBudget >= 0
      );
    },

    // Verificar si hay cambios sin guardar
    hasChanges: (state) => {
      if (!state.originalData) return false;
      return JSON.stringify(state.rubro) !== JSON.stringify(state.originalData);
    },

    // Obtener campos requeridos faltantes
    missingRequiredFields: (state) => {
      const required = [
        "name",
        "planId",
        "totalBudget",
      ];
      return required.filter((field) => {
        const value = state.rubro && state.rubro[field];
        return value === null || value === undefined || value === "";
      });
    },

    // Obtener rubros activos
    rubrosActivos: (state) => {
      return state.rubros.filter((rubro) => rubro.activar === true);
    },

    // Obtener rubro por ID
    getRubroById: (state) => (id) => {
      return state.rubros.find((rubro) => rubro.id === id);
    },
  },

  actions: {
    // Actualizar campo específico del formulario
    updateField(field, value) {
      if (!this.rubro) {
        this.rubro = {};
      }
      this.rubro[field] = value;

      // Limpiar error si existe
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },

    // Actualizar múltiples campos a la vez
    updateMultipleFields(fields) {
      if (!this.rubro) {
        this.rubro = {};
      }
      Object.keys(fields).forEach((key) => {
        this.rubro[key] = fields[key];
      });
    },

    // Cargar datos existentes (para edición)
    loadRubro(rubroData) {
      this.rubro = { ...rubroData };
      this.originalData = { ...this.rubro };
      this.isEditing = true;
    },

    // Preparar para nuevo rubro
    initNewRubro() {
      this.resetForm();
      this.isEditing = false;
    },

    // Validar formulario
    validateForm() {
      this.errors = {};

      if (
        !this.rubro ||
        !this.rubro.name ||
        !this.rubro.name.trim()
      ) {
        this.errors.name = "El nombre del rubro es obligatorio";
      }

      if (!this.rubro || this.rubro.planId === null) {
        this.errors.planId =
          "Debe seleccionar un plan de abastecimiento";
      }

      if (
        !this.rubro ||
        this.rubro.totalBudget === null ||
        this.rubro.totalBudget === ""
      ) {
        this.errors.totalBudget =
          "El valor del presupuesto es obligatorio";
      } else if (this.rubro.totalBudget < 0) {
        this.errors.totalBudget =
          "El valor del presupuesto debe ser mayor o igual a 0";
      }

      return Object.keys(this.errors).length === 0;
    },

    // Obtener todos los rubros
    async fetchAllRubros() {
      this.isLoading = true;
      this.errors = {};

      try {
        const urlService = "api/v1/rubros";
        const token =
          localStorage.getItem("token") || localStorage.getItem("token");

        const response = await axios.get(`${URL_API}/${urlService}`, {
          headers: {
            Authorization: `Bearer ${getRawToken()}`,
          },
        });

        this.rubros = response.data.data || response.data;
        return response.data;
      } catch (error) {
        console.error("Error al obtener los rubros:", error);
        this.errors.general = "Error al cargar los rubros";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Obtener un rubro por ID
    async fetchRubroById(id) {
      this.isLoading = true;
      this.errors = {};

      try {
        const urlService = `api/v1/rubros/${id}`;
        const token =
          localStorage.getItem("token") || localStorage.getItem("token");

        const response = await axios.get(`${URL_API}/${urlService}`, {
          headers: {
            Authorization: `Bearer ${getRawToken()}`,
          },
        });

        return response.data;
      } catch (error) {
        console.error(`Error al obtener el rubro ${id}:`, error);
        this.errors.general = `Error al cargar el rubro ${id}`;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Crear nuevo rubro
    async createRubro() {
      // if (!this.validateForm()) {
      //     return;
      // }

      this.isSubmitting = true;
      this.errors = {};

      try {
        const urlService = "api/v1/rubros";
        const token =
          localStorage.getItem("token") || localStorage.getItem("token");

        console.log("[createRubro] Payload:", JSON.stringify(this.rubro));
        // Usar directamente los datos del rubro que ya vienen preparados del componente
        const response = await axios.post(
          `${URL_API}/${urlService}`,
          this.rubro,
          {
            headers: {
              Authorization: `Bearer ${getRawToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Agregar el nuevo rubro a la lista
        if (response.data) {
          this.rubros.unshift(response.data);
        }

        return response.data;
      } catch (error) {
        console.error("Error al crear rubro:", error);
        console.error("[createRubro] Response data:", error.response && error.response.data);
        console.error("[createRubro] Response status:", error.response && error.response.status);
        this.errors = { general: error.message || "Error al crear el rubro" };
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    // Actualizar rubro existente
    async updateRubro() {
      this.executionTracker = [
        { phase: "UPDATE_RUBRO_INIT", timestamp: Date.now() },
      ];
      this.log("UPDATE_RUBRO_START", "info", {
        rubroId: this.rubro && this.rubro.id,
        hasChanges: this.hasChanges,
      });
      this.trackPhase("validation_start");

      if (!this.validateForm()) {
        this.log("UPDATE_RUBRO_VALIDATION_FAILED", "warn", {
          errors: { ...this.errors },
        });
        this.trackPhase("validation_failed");
        return;
      }

      if (!this.rubro || !this.rubro.id) {
        this.errors.general = "ID no encontrado para actualizar";
        this.log("UPDATE_RUBRO_MISSING_ID", "error", {
          rubro: this.rubro,
        });
        return;
      }

      this.isSubmitting = true;
      this.errors = {};
      this.trackPhase("api_request_start", { rubroId: this.rubro.id });

      try {
        const response = await this.measureExecutionTime(
          "UPDATE_RUBRO_API",
          async () => {
            const urlService = `api/v1/rubros/${this.rubro.id}`;
            const rubroData = {
              ...this.rubro,
              totalBudget: Number(this.rubro.totalBudget),
            };

            return axios.put(`${URL_API}/${urlService}`, rubroData, {
              headers: {
                Authorization: `Bearer ${getRawToken()}`,
                "Content-Type": "application/json",
              },
            });
          }
        );

        this.trackPhase("api_request_success", {
          status: response.status,
        });

        const result = this.handleApiSuccess(response.data);

        this.log("UPDATE_RUBRO_SUCCESS", "info", {
          rubroId: this.rubro.id,
          responseId: result && result.id,
        });

        return result;
      } catch (error) {
        this.trackPhase("api_request_error", {
          status: error.response && error.response.status,
          message: error.message,
        });
        this.log("UPDATE_RUBRO_ERROR", "error", {
          rubroId: this.rubro && this.rubro.id,
          status: error.response && error.response.status,
          message: error.message,
        });

        console.error("Error al actualizar el rubro:", error);
        this.handleErrorWithRetryLogic(error);

        if (error.response && error.response.data) {
          this.errors.general =
            error.response.data.message || "Error al actualizar el rubro";
        } else {
          this.errors.general = "Error al actualizar el rubro";
        }
        throw error;
      } finally {
        this.isSubmitting = false;
        this.trackPhase("UPDATE_RUBRO_END");
        this.log("UPDATE_RUBRO_END", "info", {
          rubroId: this.rubro && this.rubro.id,
          isSubmitting: false,
        });
      }
    },

    // Eliminar rubro
    async deleteRubro(id) {
      this.isLoading = true;
      this.errors = {};

      try {
        const urlService = `api/v1/rubros/${id}`;
        const token =
          localStorage.getItem("token") || localStorage.getItem("token");

        const response = await axios.delete(`${URL_API}/${urlService}`, {
          headers: {
            Authorization: `Bearer ${getRawToken()}`,
          },
        });

        // Remover el rubro eliminado del array local
        this.rubros = this.rubros.filter((rubro) => rubro.id !== id);
        return response.data;
      } catch (error) {
        console.error(`Error al eliminar el rubro ${id}:`, error);
        this.errors.general = `Error al eliminar el rubro ${id}`;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    //? Obtener rubros por ID de plan
    async fetchRubrosByPlanId(planId) {
      this.isLoading = true;
      this.errors = {};

      try {
        console.log("Iniciando fetchRubrosByPlanId con planId:", planId);

        // Validar planId
        if (!planId) {
          throw new Error("ID del plan es requerido");
        }

        const urlService = `api/v1/rubros/plan/${planId}`;
        const token =
          localStorage.getItem("token") || localStorage.getItem("token");
        console.log("Token obtenido:", token ? "presente" : "ausente");

        // Validar y parsear token
        let parsedToken;
        try {
          parsedToken = token ? this.convertirStringEnObjeto(token) : null;
          console.log("Token parseado:", parsedToken ? "válido" : "inválido");
        } catch (parseError) {
          console.error("Error al parsear token:", parseError);
          parsedToken = null;
        }

        if (!parsedToken || !parsedToken.token) {
          throw new Error("Token de autenticación no válido");
        }

        console.log("Haciendo petición a:", `${URL_API}/${urlService}`);

        // Validar que URL_API exista
        if (!URL_API) {
          throw new Error("URL_API no está configurada");
        }

        const response = await axios.get(`${URL_API}/${urlService}`, {
          headers: {
            Authorization: `Bearer ${getRawToken()}`,
          },
        });

        console.log("Respuesta recibida:", response);

        // Guardar los rubros del plan en el estado
        this.rubros = response.data;

        return response.data;
      } catch (error) {
        console.error("Error completo:", error);
        console.error("Error response:", error.response);
        console.error("Error status:", error.response && error.response.status);
        console.error("Error data:", error.response && error.response.data);

        // Manejo específico de errores
        let errorMessage = "Error al cargar los rubros del plan";
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = "No se encontraron rubros para este plan";
          } else if (error.response.status === 401) {
            errorMessage = "No autorizado para acceder a los rubros";
          } else if (error.response.status === 500) {
            errorMessage = "Error interno del servidor";
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.errors.general = errorMessage;
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Guardar rubro (crear o actualizar)
    async saveRubro() {
      if (this.isEditing) {
        return await this.updateRubro();
      } else {
        return await this.createRubro();
      }
    },

    // Resetear formulario
    resetForm() {
      this.rubro = {
        nombreRubro: "",
        descripcionRubro: "",
        planAbastecimiento: null,
        fechaInicio: "",
        fechaFinal: "",
        valorPresupuesto: null,
        activar: false,
      };
      this.errors = {};
      this.isEditing = false;
      this.originalData = null;
    },

    // Convertir string a objeto (para token)
    convertirStringEnObjeto(token) {
      if (!token) {
        return null;
      }
      try {
        return JSON.parse(token);
      } catch (error) {
        console.error("Error al convertir string a objeto:", error);
        return null;
      }
    },

    // --- Logging (adaptado desde loggingMixin.js) ---

    getSessionId() {
      if (window.__session_id__) {
        return window.__session_id__;
      }

      var stored = null;
      try {
        stored = sessionStorage.getItem("sessionId");
      } catch (e) {
        stored = null;
      }

      if (stored) {
        window.__session_id__ = stored;
        return stored;
      }

      var generated =
        "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2);
      window.__session_id__ = generated;

      try {
        sessionStorage.setItem("sessionId", generated);
      } catch (e) {
        // Ignorar si sessionStorage no está disponible
      }

      return generated;
    },

    log(eventName, level, data) {
      var logLevel = level || "info";
      var logData = data || {};
      var logEntry = {
        timestamp: new Date().toISOString(),
        component: "rubrosStore",
        method: eventName,
        level: logLevel,
        userId: localStorage.getItem("userId") || "unknown",
        rubroId: (this.rubro && this.rubro.id) || "unknown",
        payload: logData,
        sessionId: this.getSessionId(),
      };

      if (logLevel === "error") {
        console.error("[rubrosStore]", eventName, logEntry);
      } else if (logLevel === "warn") {
        console.warn("[rubrosStore]", eventName, logEntry);
      } else {
        console.info("[rubrosStore]", eventName, logEntry);
      }

      return logEntry;
    },

    async measureExecutionTime(operationName, fn) {
      var startTime = performance.now();
      var resultType = "undefined";

      try {
        var result = await fn();
        resultType = result instanceof Promise ? "Promise" : typeof result;
        var durationMs = Math.round(performance.now() - startTime);

        this.log("OPERATION_TIME", "info", {
          operation: operationName,
          durationMs: durationMs,
          result: resultType,
          status: "success",
        });

        return result;
      } catch (error) {
        var failedDurationMs = Math.round(performance.now() - startTime);

        this.log("OPERATION_TIME", "error", {
          operation: operationName,
          durationMs: failedDurationMs,
          result: resultType,
          status: "failed",
          error: error.message,
        });

        throw error;
      }
    },

    trackPhase(phaseName, extraData) {
      var extra = extraData || {};

      if (!this.executionTracker.length) {
        this.executionTracker.push({
          phase: "INIT",
          timestamp: Date.now(),
        });
      }

      this.executionTracker.push({
        phase: phaseName,
        timestamp: Date.now(),
        relativeMs: Date.now() - this.executionTracker[0].timestamp,
        rubroId: this.rubro && this.rubro.id,
        ...extra,
      });

      console.groupCollapsed("Phase: " + phaseName);
      console.log(this.executionTracker.slice(-5));
      console.groupEnd();
    },

    findRubroIndex(id) {
      return this.rubros.findIndex(function (r) {
        return r.id === id;
      });
    },

    handleApiSuccess(data) {
      var index = this.findRubroIndex(data.id);

      if (index !== -1) {
        this.rubros[index] = {
          ...data,
          _updatedAt: Date.now(),
        };

        this.log("reactive_update_applied", "info", {
          arrayIndex: index,
          rubroId: data.id,
        });
      } else {
        this.rubros.unshift({
          ...data,
          _updatedAt: Date.now(),
        });

        this.log("reactive_new_rubro_added", "info", {
          arrayIndex: 0,
          rubroId: data.id,
        });
      }

      return data;
    },

    handleErrorWithRetryLogic(error) {
      var statusCode = error.response && error.response.status;

      switch (statusCode) {
        case 401:
          this.errors.general =
            "Tu sesión necesita renovarse. Revisa el mensaje en pantalla.";
          notifySessionExpired({ source: "rubrosStore.updateRubro" });
          break;
        case 403:
          this.errors.general =
            "No tienes permisos para realizar esta acción.";
          break;
        case 404:
          this.errors.general = "Recurso no encontrado.";
          break;
        case 422:
          this.errors.general =
            "Datos inválidos. Por favor verifique los datos ingresados.";
          break;
        case 500:
          this.errors.general =
            "Error interno del servidor. Por favor intente nuevamente.";
          if (!this.isRetryingUpdate) {
            this.retryAfterDelay(2);
          }
          break;
        default:
          this.errors.general =
            "Error desconocido. Por favor intente nuevamente.";
          break;
      }

      localStorage.setItem(
        "lastUpdateError_" + Date.now(),
        JSON.stringify({
          rubroId: this.rubro && this.rubro.id,
          timestamp: new Date().toISOString(),
          errorDetails: error.toJSON
            ? error.toJSON()
            : { message: error.message },
        })
      );

      this.log("UPDATE_RUBRO_ERROR_HANDLED", "error", {
        statusCode: statusCode,
        rubroId: this.rubro && this.rubro.id,
      });
    },

    async retryAfterDelay(maxRetries) {
      var retries = maxRetries || 2;
      this.isRetryingUpdate = true;

      try {
        for (var i = 0; i < retries; i++) {
          this.log("UPDATE_RUBRO_RETRY", "warn", {
            attempt: i + 1,
            maxRetries: retries,
            rubroId: this.rubro && this.rubro.id,
          });

          await new Promise(function (resolve) {
            setTimeout(resolve, 2000 * (i + 1));
          });

          try {
            await this.updateRubro();
            return;
          } catch (e) {
            if (i === retries - 1) {
              this.log("UPDATE_RUBRO_RETRY_EXHAUSTED", "error", {
                attempts: retries,
                rubroId: this.rubro && this.rubro.id,
              });
              throw e;
            }
          }
        }
      } finally {
        this.isRetryingUpdate = false;
      }
    },
  },
});
