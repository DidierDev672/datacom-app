import { defineStore } from 'pinia';
import { SupplyPlanRepositoryHttp } from '../modules/abastecimiento/infrastructure/SupplyPlanRepositoryHttp';
import { CreateSupplyPlan } from '../modules/abastecimiento/application/CreateSupplyPlan';
import { GetSupplyPlans } from '../modules/abastecimiento/application/GetSupplyPlans';

export const useSupplyPlansStore = defineStore('supplyPlans', {
    state: () => ({
        plans: [],
        form: {
            active:true,
            createdAt: null,
            createdBy: null,
            description: '',
            endDate: null,
            name: '',
            ownerId: '',
            startDate: null,
            status: 'pending',
            year: new Date().getFullYear()
        },
        isLoading: false,
        isSubmitting: false,
        errors: {},
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
            if(!this.validateForm()) return;
            this.isSubmitting = true;
            this.errors = {};

            try {
                if(this.isEditing){
                    await this.updateProject();
                }else{
                    await this.createProject();
                }
            } catch (error) {
                console.error('Error al guardar proyecto:', error);
                this.errors.general = error.message || 'Error al guardar proyecto';
            } finally {
                this.isSubmitting = false;
            }
        },

        resetForm() {
            this.form = {
                active:true,
                createdAt: null,
                createdBy: null,
                description: '',
                endDate: null,
                name: '',
                ownerId: '',
                startDate: null,
                status: 'pending',
                year: new Date().getFullYear()
            }
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
            this.errors = {};
            try {
                const repository = this._getRepository();
                const response = await repository.delete(id);
                this.plans = this.plans.filter(plan => plan.id !== id);
                return response;
            } catch (error) {
                console.error(`Error al eliminar el plan ${id}:`, error);
                this.errors.general = `Error al eliminar el plan ${id}`;
                throw error;
            } finally {
                this.isLoading = false;
            }
        }
    }
});
