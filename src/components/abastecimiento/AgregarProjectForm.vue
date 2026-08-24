<template>
    <q-dialog
        persistent
        transition-show="scale"
        transition-hide="scale"
        v-model="show"
    >
        <q-card style="width: 1200px;">
            <q-card-section>
                <div class="text-h6">
                     Plan de abastecimiento
                </div>
            </q-card-section>

            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
                <q-form class="q-gutter-md">             
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">                            
                            <q-select 
                            label="Seleccione un plan de abastecimiento" 
                            dense 
                            outlined 
                            use-input
                            v-model="supplyPlanModel.supplyPlan" 
                            :options="getSupplyPlans"
                            option-label="name"
                            option-value="id"
                            @input="onSeleccionarPlan" />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">                            
                            <q-select 
                            label="Seleccione un item del plan" 
                            dense 
                            outlined 
                            use-input
                            v-model="supplyPlanModel.supplyPlanItem" 
                            :options="getRubrosByPlan"
                            option-label="name"
                            option-value="id"
                            :disable="!supplyPlanModel.supplyPlan || loadingRubros"
                            :loading="loadingRubros"
                            @input="onSeleccionarItem" />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="supplyPlanModel.percentage"
                                :disable="!supplyPlanModel.supplyPlan"
                                label="Porcentaje"
                            />
                        </div>
                    </div>                    
                    <q-card flat bordered v-if="selectedItemInfo.id" class="q-mt-sm">
                        <q-card-section class="bg-primary text-white">
                            <div class="text-h6 flex items-center text-white">
                                <q-icon name="info" class="q-mr-sm" />
                                Información del Rubro Seleccionado
                            </div>
                        </q-card-section>
                        <q-card-section class="q-pa-md">
                            <!-- Información del Plan -->
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3 text-grey-7">Plan de Abastecimiento:</div>
                                <div class="col-xs-12 col-md-9">
                                    <q-badge 
                                        :color="selectedPlanInfo.id ? 'positive' : 'negative'" 
                                        text-color="white" 
                                        class="q-pa-sm text-caption">
                                        <q-icon name="assignment" class="q-mr-xs" size="sm" />
                                        {{ selectedPlanInfo.name || 'No seleccionado' }}
                                    </q-badge>
                                </div>
                            </div>
                            
                            <!-- Información del Rubro -->
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3 text-grey-7">Nombre del Rubro:</div>
                                <div class="col-xs-12 col-md-9 text-bold text-primary">
                                    {{ selectedItemInfo.name || 'Sin nombre' }}
                                </div>
                            </div>
                            
                            <!-- Descripción si existe -->
                            <div class="row q-col-gutter-sm q-mb-md" v-if="selectedItemInfo.description">
                                <div class="col-xs-12 col-md-3 text-grey-7">Descripción:</div>
                                <div class="col-xs-12 col-md-9 text-grey-8">
                                    {{ selectedItemInfo.description }}
                                </div>
                            </div>
                            
                            <!-- Información de Presupuesto -->
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3 text-grey-7">Presupuesto:</div>
                                <div class="col-xs-12 col-md-9">
                                    <div class="row q-col-gutter-sm">
                                        <div class="col-xs-12 col-sm-6">
                                            <div class="text-caption text-grey-6">Total</div>
                                            <div class="text-bold text-positive">
                                                <q-icon name="account_balance" class="q-mr-xs" />
                                                ${{ new Intl.NumberFormat().format(selectedItemInfo.totalBudget || 0) }}
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-6">
                                            <div class="text-caption text-grey-6">Disponible</div>
                                            <div class="text-bold text-info">
                                                <q-icon name="savings" class="q-mr-xs" />
                                                ${{ new Intl.NumberFormat().format(selectedItemInfo.availableBudget || selectedItemInfo.totalBudget || 0) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Información de Fechas -->
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3 text-grey-7">Vigencia:</div>
                                <div class="col-xs-12 col-md-9">
                                    <div class="row q-col-gutter-sm">
                                        <div class="col-xs-12 col-sm-6">
                                            <div class="text-caption text-grey-6">Inicio</div>
                                            <div class="text-bold">
                                                <q-icon name="event_start" class="q-mr-xs text-orange" />
                                                {{ formatDate(selectedItemInfo.startDate) }}
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-6">
                                            <div class="text-caption text-grey-6">Fin</div>
                                            <div class="text-bold">
                                                <q-icon name="event_end" class="q-mr-xs text-red" />
                                                {{ formatDate(selectedItemInfo.endDate) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Estado del Rubro -->
                            <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-md-3 text-grey-7">Estado:</div>
                                <div class="col-xs-12 col-md-9">
                                    <q-badge 
                                        :color="selectedItemInfo.active ? 'positive' : 'negative'"
                                        text-color="white"
                                        class="q-pa-sm text-caption">
                                        <q-icon :name="selectedItemInfo.active ? 'check_circle' : 'cancel'" class="q-mr-xs" size="sm" />
                                        {{ selectedItemInfo.active ? 'Activo' : 'Inactivo' }}
                                    </q-badge>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                    
                </q-form>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    flat
                    label="Cancelar"
                    color="primary"                    
                    @click="close"
                />
                <q-btn
                no-caps
                    label="Agregar proyecto"
                    color="primary"
                    @click="onSubmit"
                >
                    <template v-slot:loading>
                        <q-spinner-facebook />
                    </template>
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useSupplyPlansStore } from '../../piña/supplyPlans'
import { useRubrosStore } from '../../piña/rubros'
import { useApprovalConfigStore } from '../../piña/approvalConfig'
import { uid } from 'quasar'

export default {
    name: 'AgregarProjectForm',
    data() {
        return {
            show: true,
            supplyPlanModel: this.iniciarModeloSupplyPlan(),
            selectedPlanInfo: {},
            selectedItemInfo: {},
            supplyPlansStore: null,
            rubrosStore: null,
            approvalConfigStore: null,
            loadingRubros: false,
        };
    },
    computed: {
        getSupplyPlans() {
            return this.supplyPlansStore ? this.supplyPlansStore.plans : []
        },
        getPlanItems() {
            return this.supplyPlansStore ? this.supplyPlansStore.planItems : []
        },
        getRubrosByPlan() {
            return this.rubrosStore ? this.rubrosStore.rubros : []
        },
        getApprovalLevels() {
            return this.approvalConfigStore ? this.approvalConfigStore.approvalLevels : []
        },
        getUserApprovalLevel() {
            return this.approvalConfigStore ? this.approvalConfigStore.userApprovalLevel : null
        },
        getApprovalConfigLoading() {
            return this.approvalConfigStore ? this.approvalConfigStore.isLoading : false
        },
        calculateAvailableBalance(){ 
            return this.selectedItemInfo.availableBudget || this.selectedItemInfo.totalBudget || 0;;
        }
    },
    methods: {  
        async cargarPlanes() {
            try {
                if (this.supplyPlansStore) {
                    await this.supplyPlansStore.fetchAllPlans()
                }
            } catch (error) {
                console.error('Error al cargar planes:', error)
            }
        },
        
        async cargarConfiguracionAprobacion() {
            try {
                if (this.approvalConfigStore) {
                    await this.approvalConfigStore.fetchApprovalLevels()
                }
            } catch (error) {
                console.error('Error al cargar configuración de aprobación:', error)
                if (this.$q) {
                    this.$q.notify({
                        type: 'negative',
                        message: 'Error al cargar los niveles de aprobación',
                        position: 'top',
                        timeout: 3000
                    })
                }
            }
        },
        
        async cargarNivelAprobacionUsuario(username) {
            try {
                if (this.approvalConfigStore && username) {
                    await this.approvalConfigStore.fetchUserApprovalLevel(username)
                }
            } catch (error) {
                console.error('Error al cargar nivel de aprobación:', error)
                if (this.$q) {
                    this.$q.notify({
                        type: 'negative',
                        message: 'Error al cargar el nivel de aprobación del usuario',
                        position: 'top',
                        timeout: 3000
                    })
                }
            }
        },
        
        async cargarRubrosPorPlan(planId) {
            if (!planId) return
            
            this.loadingRubros = true
            try {
                if (this.rubrosStore) {
                    const rubros = await this.rubrosStore.fetchRubrosByPlanId(planId)
                }
            } catch (error) {
                console.error('Error al cargar rubros del plan:', error)
                
                // Manejo específico del error
                let errorMessage = 'Error al cargar los rubros del plan seleccionado'
                if (error.response) {
                    if (error.response.data && error.response.data.message) {
                        errorMessage = error.response.data.message
                    } else if (error.response.status === 404) {
                        errorMessage = 'No se encontraron rubros para este plan'
                    } else if (error.response.status === 401) {
                        errorMessage = 'No autorizado para acceder a los rubros'
                    }
                } else if (error.message) {
                    errorMessage = error.message
                }
                
                if (this.$q) {
                    this.$q.notify({
                        type: 'negative',
                        message: errorMessage,
                        position: 'top',
                        timeout: 3000
                    })
                }
            } finally {
                this.loadingRubros = false
            }
        },
        
        onSeleccionarPlan(value) {
            console.log('Plan seleccionado:', value)
            
            // Extraer el ID del plan (value puede ser el objeto completo o solo el ID)
            const planId = typeof value === 'object' && value !== null ? value.id : value
            console.log('Plan ID extraído:', planId)
            
            this.selectedPlanInfo = this.getSupplyPlans.find(plan => plan.id === planId) || {}
            this.supplyPlanModel.supplyPlanItem = ''
            this.selectedItemInfo = {}
            
            // Cargar rubros del plan seleccionado
            this.cargarRubrosPorPlan(planId)
        },
        
        onSeleccionarItem(value) {
            console.log('Item seleccionado:', value)
            const itemId = typeof value === 'object' && value !== null ? value.id : value
            this.selectedItemInfo = this.getRubrosByPlan.find(item => item.id === itemId) || {}
        },
        
        onSubmit() {            
            this.$emit('onSubmitProject', this.supplyPlanModel);
        },
        close() {
            this.$emit('close');
        },
        obtenerUsuarioActual() {
            try {
                // Intentar obtener el usuario desde localStorage
                const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
                if (userStr) {
                    const user = JSON.parse(userStr)
                    return user.username || user.email || user.name || 'system'
                }
                
                // Intentar obtener desde el token
                const token = localStorage.getItem('token')
                if (token) {
                    const parsedToken = JSON.parse(token)
                    return parsedToken.username || parsedToken.email || 'system'
                }
                
                return 'system'
            } catch (error) {
                console.error('Error al obtener usuario actual:', error)
                return 'system'
            }
        },
        formatDate(dateString) {
            if (!dateString) return 'No definida';
            try {
                // Usar el formateador de fechas de Quasar
                return date.formatDate(dateString, 'DD/MM/YYYY');
            } catch (error) {
                return dateString;
            }
        },
        iniciarModeloSupplyPlan(){
            return {
                id: uid(),
                supplyPlan: '',
                supplyPlanItem: '',
                percentage: 0.00,
                allocatedAmount: 0.00
            }
        }
    },
    mounted() {
        // Inicializar los stores de Pinia
        this.supplyPlansStore = useSupplyPlansStore()
        this.rubrosStore = useRubrosStore()
        this.approvalConfigStore = useApprovalConfigStore()
        
        // Cargar los planes de abastecimiento al montar el componente
        this.cargarPlanes()
        
        // Cargar configuración de aprobación
        this.cargarConfiguracionAprobacion()
        
        // Cargar nivel de aprobación del usuario actual
        const currentUser = this.obtenerUsuarioActual()
        if (currentUser) {
            this.cargarNivelAprobacionUsuario(currentUser)
        }
    }
};
</script>
