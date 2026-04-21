import { defineStore } from 'pinia'
import axios from 'axios'
import { URL_API } from "../utils/config"
import { getRawToken } from "../utils/authHelper"

export const useRubrosStore = defineStore('rubros', {
    state: () => ({
        rubros: [],
        rubro: null,
        isLoading: false,
        isSubmitting: false,
        errors: {},
        isEditing: false,
        originalData: null
    }),

    getters: {
        // Verificar si el formulario es válido
        isFormValid: (state) => {
            return state.rubro && 
            state.rubro.nombreRubro && state.rubro.nombreRubro.trim() !== '' &&
            state.rubro.planAbastecimiento !== null &&
            state.rubro.valorPresupuesto !== null && state.rubro.valorPresupuesto >= 0
        },

        // Verificar si hay cambios sin guardar
        hasChanges: (state) => {
            if (!state.originalData) return false;
            return JSON.stringify(state.rubro) !== JSON.stringify(state.originalData);
        },

        // Obtener campos requeridos faltantes
        missingRequiredFields: (state) => {
            const required = ['nombreRubro', 'planAbastecimiento', 'valorPresupuesto'];
            return required.filter((field) => {
                const value = state.rubro && state.rubro[field];
                return value === null || value === undefined || value === '';
            });
        },

        // Obtener rubros activos
        rubrosActivos: (state) => {
            return state.rubros.filter(rubro => rubro.activar === true);
        },

        // Obtener rubro por ID
        getRubroById: (state) => (id) => {
            return state.rubros.find(rubro => rubro.id === id);
        }
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

            if (!this.rubro || !this.rubro.nombreRubro || !this.rubro.nombreRubro.trim()) {
                this.errors.nombreRubro = 'El nombre del rubro es obligatorio';
            }

            if (!this.rubro || this.rubro.planAbastecimiento === null) {
                this.errors.planAbastecimiento = 'Debe seleccionar un plan de abastecimiento';
            }

            if (!this.rubro || this.rubro.valorPresupuesto === null || this.rubro.valorPresupuesto === '') {
                this.errors.valorPresupuesto = 'El valor del presupuesto es obligatorio';
            } else if (this.rubro.valorPresupuesto < 0) {
                this.errors.valorPresupuesto = 'El valor del presupuesto debe ser mayor o igual a 0';
            }

            return Object.keys(this.errors).length === 0;
        },

        // Obtener todos los rubros
        async fetchAllRubros() {
            this.isLoading = true;
            this.errors = {};

            try {
                const urlService = "api/v1/rubros";
                const token = localStorage.getItem('token') || localStorage.getItem('token');
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${getRawToken()}`
                    }
                });

                this.rubros = response.data.data || response.data;
                return response.data;
            } catch (error) {
                console.error('Error al obtener los rubros:', error);
                this.errors.general = 'Error al cargar los rubros';
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
                const token = localStorage.getItem('token') || localStorage.getItem('token');
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${getRawToken()}`
                    }
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
                const token = localStorage.getItem('token') || localStorage.getItem('token');
                
                console.log(this.convertirStringEnObjeto(token).token);
                // Usar directamente los datos del rubro que ya vienen preparados del componente
                const response = await axios.post(`${URL_API}/${urlService}`, this.rubro, {
                    headers: {
                        'Authorization': `Bearer ${getRawToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Agregar el nuevo rubro a la lista
                if (response.data) {
                    this.rubros.unshift(response.data);
                }

                return response.data;
            } catch (error) {
                console.error('Error al crear rubro:', error);
                this.errors = { general: error.message || 'Error al crear el rubro' };
                throw error;
            } finally {
                this.isSubmitting = false;
            }
        },

        // Actualizar rubro existente
        async updateRubro() {
            if (!this.validateForm()) {
                return;
            }

            if (!this.rubro || !this.rubro.id) {
                this.errors.general = "ID no encontrado para actualizar";
                return;
            }

            this.isSubmitting = true;
            this.errors = {};

            try {
                const urlService = `api/v1/rubros/${this.rubro.id}`;
                const token = localStorage.getItem('token') || localStorage.getItem('token');

                // Preparar datos para enviar
                const rubroData = {
                    ...this.rubro,
                    valorPresupuesto: Number(this.rubro.valorPresupuesto)
                };

                const response = await axios.put(`${URL_API}/${urlService}`, rubroData, {
                    headers: {
                        'Authorization': `Bearer ${getRawToken()}`,
                        'Content-Type': 'application/json'
                    }
                });

                // Actualizar el rubro en la lista
                const index = this.rubros.findIndex(r => r.id === this.rubro.id);
                if (index !== -1) {
                    this.rubros[index] = response.data;
                }

                return response.data;
            } catch (error) {
                console.error('Error al actualizar el rubro:', error);
                if (error.response && error.response.data) {
                    this.errors.general = error.response.data.message || 'Error al actualizar el rubro';
                } else {
                    this.errors.general = 'Error al actualizar el rubro';
                }
                throw error;
            } finally {
                this.isSubmitting = false;
            }
        },

        // Eliminar rubro
        async deleteRubro(id) {
            this.isLoading = true;
            this.errors = {};

            try {
                const urlService = `api/v1/rubros/${id}`;
                const token = localStorage.getItem('token') || localStorage.getItem('token');
                
                const response = await axios.delete(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${getRawToken()}`
                    }
                });

                // Remover el rubro eliminado del array local
                this.rubros = this.rubros.filter(rubro => rubro.id !== id);
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
                console.log('Iniciando fetchRubrosByPlanId con planId:', planId);
                
                // Validar planId
                if (!planId) {
                    throw new Error('ID del plan es requerido');
                }
                
                const urlService = `api/v1/rubros/plan/${planId}`;
                const token = localStorage.getItem('token') || localStorage.getItem('token');
                console.log('Token obtenido:', token ? 'presente' : 'ausente');
                
                // Validar y parsear token
                let parsedToken;
                try {
                    parsedToken = token ? this.convertirStringEnObjeto(token) : null;
                    console.log('Token parseado:', parsedToken ? 'válido' : 'inválido');
                } catch (parseError) {
                    console.error('Error al parsear token:', parseError);
                    parsedToken = null;
                }
                
                if (!parsedToken || !parsedToken.token) {
                    throw new Error('Token de autenticación no válido');
                }
                
                console.log('Haciendo petición a:', `${URL_API}/${urlService}`);
                
                // Validar que URL_API exista
                if (!URL_API) {
                    throw new Error('URL_API no está configurada');
                }
                
                const response = await axios.get(`${URL_API}/${urlService}`, {
                    headers: {
                        'Authorization': `Bearer ${getRawToken()}`
                    }
                });
                
                console.log('Respuesta recibida:', response);

                // Guardar los rubros del plan en el estado
                this.rubros = response.data;
                
                return response.data;
            } catch (error) {
                console.error('Error completo:', error);
                console.error('Error response:', error.response);
                console.error('Error status:', error.response && error.response.status);
                console.error('Error data:', error.response && error.response.data);
                
                // Manejo específico de errores
                let errorMessage = 'Error al cargar los rubros del plan';
                if (error.response) {
                    if (error.response.status === 404) {
                        errorMessage = 'No se encontraron rubros para este plan';
                    } else if (error.response.status === 401) {
                        errorMessage = 'No autorizado para acceder a los rubros';
                    } else if (error.response.status === 500) {
                        errorMessage = 'Error interno del servidor';
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
                nombreRubro: '',
                descripcionRubro: '',
                planAbastecimiento: null,
                fechaInicio: '',
                fechaFinal: '',
                valorPresupuesto: null,
                activar: false
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
                console.error('Error al convertir string a objeto:', error);
                return null;
            }
        }
    }
})
