import { defineStore } from 'pinia';
import { SupplyPlanRepositoryHttp } from '../modules/abastecimiento/infrastructure/SupplyPlanRepositoryHttp';
import { CreateSupplyPlan } from '../modules/abastecimiento/application/CreateSupplyPlan';
import { GetSupplyPlans } from '../modules/abastecimiento/application/GetSupplyPlans';

export const useSupplyPlansStore = defineStore('supplyPlans', {
    state: () => ({
        plans: [],
        form: {
            active: true,
            createdAt: null,
            createdBy: null,
            description: '',
            endDate: '',
            name: '',
            ownerId: '',
            startDate: '',
            status: 'en_planificacion',
            year: new Date().getFullYear()
        },
        isLoading: false,
        isDeleting: false,
        deleteStatus: null,
        isSubmitting: false,
        errors: {},
        warnings: [],
        isEditing: false,
        originalData: null
    }),

    getters: {
        isFormValid: (state) => {
            return state.form.name.trim() !== '' &&
            state.form.ownerId.trim() !== '' &&
            state.form.startDate !== null &&
            state.form.status !== ''
        },

        hasChanges: (state) => {
            if(state.originalDate) return true;
            return JSON.stringify(state.form) !== JSON.stringify(state.originalData);
        },

        missingRequiredFields: (state) => {
            const required = ['name', 'ownerId', 'startDate', 'status'];
            return required.filter((field) => {
                const value = state.form[field]
                return value === null || value === null || value === undefined
            })
        },

        formattedStartDate: (state) => {
            return state.form.startDate ? new Date(state.form.startDate).toLocaleDateString('es-Es') : ''
        },

        formattedEndDate: (state) => {
            return state.form.endDate ? new Date(state.form.endDate).toLocaleDateString('es-Es') : ''
        },

        formattedCreatedAt: (state) => {
            return state.form.createdAt ? new Date(state.form.createdAt).toLocaleDateString('es-Es') : ''
        },

       projectSummary: (state) => {
        return {
            name: state.form.name,
            status: state.form.status,
            year: state.form.year,
            isActive: state.form.active,
            duration: state.form.startDate && state.form.endDate
            ? `${state.formattedStartDate} - ${state.formattedEndDate}`
            : 'Duración no definido'
        }
       }
    },
    actions: {
        updateField(field, value) {
            if(this.form.hasOwnProperty(field)){
                this.form[field] = value;
                if(this.errors[field]){
                    delete this.errors[field];
                }
            }
        },

        updateMultipleFields(fields) {
            Object.keys(fields).forEach((key) => {
                if(this.form.hasOwnProperty(key)){
                    this.form[key] = fields[key];
                }
            })
        },

        loadProject(projectData) {
            this.form = {
                ...this.form,
                ...projectData
            }
            this.originalData = { ...this.form}
            this.isEditing = true
        },

        initNewProject(userId) {
            this.resetForm();
            this.form.createdBy = userId;
            this.form.createdAt = new Date().toISOString()
            this.isEditing = false
        },

        validateForm() {
            this.errors = {};
            if(!this.form.name.trim()){
                this.errors.name = 'El nombre es obligatorio';
            }
            if(!this.form.ownerId){
                this.errors.ownerId = 'El dueño es obligatorio';
            }
            if(!this.form.startDate){
                this.errors.startDate = 'La fecha de inicio es obligatoria';
            }
            if(!this.form.status){
                this.errors.status = 'El estado es obligatorio';
            }
            return Object.keys(this.errors).length === 0;
        },

        async saveProject() {
            if(!this.validateForm()) return false;
            this.isSubmitting = true;
            this.errors = {};
            this.warnings = [];

            try {
                let response;
                if(this.isEditing){
                    response = await this.updateProject();
                }else{
                    response = await this.createProject();
                }
                if (response && response.warnings && response.warnings.length > 0) {
                    this.warnings = response.warnings;
                }
                return true;
            } catch (error) {
                console.error('Error al guardar proyecto:', error);
                const responseData = error.response && error.response.data;
                const errorMessage = 
                    (responseData && responseData.error && responseData.error.message) ||
                    (responseData && responseData.message) ||
                    error.message ||
                    'Error al guardar proyecto';
                this.errors.general = errorMessage;
                return false;
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            const defaults = {
                active: true,
                createdAt: null,
                createdBy: null,
                description: '',
                endDate: '',
                name: '',
                ownerId: '',
                startDate: '',
                status: 'en_planificacion',
                year: new Date().getFullYear()
            };
            Object.keys(defaults).forEach((key) => {
                this.form[key] = defaults[key];
            });
            this.errors = {};
            this.isEditing = false;
            this.originalData = null;
        },

        toggleActive(){
            this.form.active = !this.form.active;
        },

        setDatesByyear(year){
            this.form.year = year
            this.form.startDate = new Date(`${year}-01-01`).toISOString().split('T')[0]
            this.form.endDate = new Date(`${year}-12-31`).toISOString().split('T')[0]
        },

        // --- Uso de la Arquitectura Hexagonal ---
        _getRepository() {
            return new SupplyPlanRepositoryHttp();
        },

        async createProject() {
            try {
                const repository = this._getRepository();
                const createUseCase = new CreateSupplyPlan(repository);
                const response = await createUseCase.execute(this.form);
                return response;
            } catch(error) {
                console.error(`Error en la peticion de creación: ${error}`);
                throw error;
            }
        },

        async updateProject() {
            const id = this.form.id;
            if (!id) throw new Error("ID not found for update");
            const repository = this._getRepository();
            const response = await repository.update(id, this.form);
            return response;
        },

        async updateProjectById(id, updateData) {
            const repository = this._getRepository();
            const response = await repository.update(id, updateData);
            const index = this.plans.findIndex(plan => plan.id === id);
            if (index !== -1) {
                this.plans.splice(index, 1, response);
            }
            return response;
        },

        async fetchAllPlans() {
            this.isLoading = true;
            this.errors = {};
            try {
                const repository = this._getRepository();
                const getUseCase = new GetSupplyPlans(repository);
                const response = await getUseCase.execute();
                this.plans = response;
                return response;
            } catch (error) {
                console.error('Error al obtener los planes de abastecimiento:', error);
                this.errors.general = 'Error al cargar los planes de abastecimiento';
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async fetchPlanById(id) {
            this.isLoading = true;
            this.errors = {};
            try {
                const repository = this._getRepository();
                const response = await repository.getById(id);
                return response;
            } catch (error) {
                console.error(`Error al obtener el plan ${id}:`, error);
                this.errors.general = `Error al cargar el plan ${id}`;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async deletePlan(id) {
            this.isLoading = true;
            this.isDeleting = true;
            this.deleteStatus = null;
            this.errors = {};
            try {
                const repository = this._getRepository();
                const response = await repository.delete(id);
                this.plans = this.plans.filter(plan => plan.id !== id);
                this.deleteStatus = { success: true, message: 'Plan eliminado correctamente' };
                return response;
            } catch (error) {
                console.error(`Error al eliminar el plan ${id}:`, error);
                const message = (error && error.response && error.response.data && error.response.data.message)
                    || (error && error.message)
                    || `Error al eliminar el plan ${id}`;
                this.errors.general = message;
                this.deleteStatus = { success: false, message };
                throw error;
            } finally {
                this.isDeleting = false;
                this.isLoading = false;
            }
        },

        async updatePlanStatus(id, status) {
            this.isLoading = true;
            this.errors = {};
            try {
                const repository = this._getRepository();
                const response = await repository.updateStatus(id, status);
                const index = this.plans.findIndex(plan => plan.id === id);
                if (index !== -1) {
                    this.plans.splice(index, 1, response);
                }
                return response;
            } catch (error) {
                console.error(`Error al actualizar estado del plan ${id}:`, error);
                this.errors.general = `Error al actualizar estado del plan ${id}`;
                throw error;
            } finally {
                this.isLoading = false;
            }
        },

        async updateProjectById(id, updateData) {
            this.isLoading = true;
            this.errors = {};
            try {
                const repository = this._getRepository();
                const response = await repository.update(id, updateData);
                const index = this.plans.findIndex(plan => plan.id === id);
                if (index !== -1) {
                    this.plans.splice(index, 1, response);
                }
                return response;
            } catch (error) {
                console.error(`Error al actualizar el plan ${id}:`, error);
                this.errors.general = `Error al actualizar el plan ${id}`;
                throw error;
            } finally {
                this.isLoading = false;
            }
        }
    }
});
