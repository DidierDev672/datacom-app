<template>
    <q-dialog
        persistent
        transition-show="scale"
        transition-hide="scale"
        v-model="show"
    >
        <q-card style="width: 700px;">
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
                            :options="getPlanItems"
                            option-label="name"
                            option-value="id"
                            :disable="!supplyPlanModel.supplyPlan"
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
                        <q-card-section>
                            <div class="text-h6">Info del item seleccionado</div>
                        </q-card-section>
                        <q-card-section>
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3">Plan seleccionado</div>
                                <div class="col-xs-12 col-md-9 text-bold text-info">{{ selectedPlanInfo.name }}</div>
                            </div>
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3">Rubro</div>
                                <div class="col-xs-12 col-md-9 text-bold text-info">{{ selectedItemInfo.name }}</div>
                            </div>
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3">Presupuesto total</div>
                                <div class="col-xs-12 col-md-3 text-bold text-info">${{ new Intl.NumberFormat().format(selectedItemInfo.totalBudget) }}</div>
                                <div class="col-xs-12 col-md-3">Presupuesto disponible</div>
                                <div class="col-xs-12 col-md-3 text-bold text-info">${{ new Intl.NumberFormat().format(selectedItemInfo.availableBudget) }}</div>
                            </div>
                            <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-md-3">Fecha de inicio</div>
                                <div class="col-xs-12 col-md-3 text-bold text-info">{{ selectedItemInfo.startDate }}</div>
                                <div class="col-xs-12 col-md-3">Fecha de fin</div>
                                <div class="col-xs-12 col-md-3 text-bold text-info">{{ selectedItemInfo.endDate }}</div>
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
import { mapGetters, mapActions } from 'vuex';
import { date, uid } from 'quasar'


export default {
    name: 'AgregarProjectForm',
    data() {
        return {
            show: true,
            supplyPlanModel: this.iniciarModeloSupplyPlan(),
            selectedPlanInfo: {},
            selectedItemInfo: {}
        };
    },
    methods: {  
        ...mapActions('supplyPlans', ['fetchSupplyPlanItems']),
        onSubmit() {            
            this.$emit('onSubmitProject', this.supplyPlanModel);
        },
        close() {
            this.$emit('close');
        },
        iniciarModeloSupplyPlan(){
            return {
                id: uid(),
                supplyPlan: '',
                supplyPlanItem: '',
                percentage: 0.00,
                allocatedAmount: 0.00
            }
        },
        async onSeleccionarPlan(value){
            this.selectedPlanInfo = {
                ...value,
                startAt: value.startDate ? date.formatDate(value.startDate, 'YYYY-MM-DD') : '',
                endAt: value.endDate ? date.formatDate(value.endDate, 'YYYY-MM-DD') : ''
            };
            
            // Limpiar el item seleccionado cuando se cambia de plan
            this.supplyPlanModel.supplyPlanItem = '';
            this.selectedItemInfo = {};
            
            // Consultar los items del plan seleccionado
            if (value && value.id) {
                try {
                    await this.fetchSupplyPlanItems(value.id);
                } catch (error) {
                    console.error('Error al consultar los items del plan:', error);
                    this.$q.notify({
                        type: 'negative',
                        message: 'Error al cargar los items del plan seleccionado'
                    });
                }
            }
        },
        onSeleccionarItem(value){
            this.selectedItemInfo = {
                ...value,
                startDate: value.startDate ? date.formatDate(value.startDate, 'YYYY-MM-DD') : '',
                endDate: value.endDate ? date.formatDate(value.endDate, 'YYYY-MM-DD') : ''
            };
        }
    },
    computed: {
        ...mapGetters('projects', ['getProjects']),
        ...mapGetters('supplyPlans', ['getSupplyPlans', 'getPlanItems'])        
    }
};
</script>
