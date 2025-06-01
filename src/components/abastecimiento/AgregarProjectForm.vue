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
                     Proyectos
                </div>
            </q-card-section>

            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
                <q-form class="q-gutter-md">             
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">                            
                            <q-select 
                            label="Seleccione un proyecto" 
                            dense 
                            outlined 
                            use-input
                            v-model="project.project" 
                            :options="getProjects"
                            option-label="title"
                            option-value="id"
                            @input="onSeleccionarProyecto" />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="project.percentage"
                                label="Porcentaje"
                            />
                        </div>
                    </div>
                    <q-card flat bordered v-if="projectSelected.id">
                        <q-card-section>
                            <div class="text-h6">Info del proyecto seleccionado</div>
                        </q-card-section>
                        <q-card-section>
                            <div class="row q-col-gutter-sm q-mb-md">
                                <div class="col-xs-12 col-md-3 ">Monto del proyecto</div>
                                <div class="col-xs-12 col-md-3 text-bold text-info">${{ new Intl.NumberFormat().format(projectSelected.amount) }}</div>
                            </div>
                            <div class="row q-col-gutter-sm">
                                <div class="col-xs-12 col-md-3 ">Fecha de inicio</div>
                                <div class="col-xs-12 col-md-3 text-bold text-info">{{ projectSelected.startAt }}</div>
                                <div class="col-xs-12 col-md-3 ">Fecha de fin</div>
                                <div class="col-xs-12 col-md-3 text-bold text-info">{{ projectSelected.endAt }}</div>
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
import { mapGetters } from 'vuex';
import { date, uid } from 'quasar'


export default {
    name: 'JuntaDirectivaForm',
    data() {
        return {
            show: true,
            project: this.iniciarModeloProjecto(),
            projectSelected: {}
        };
    },
    methods: {  
        onSubmit() {            
            this.$emit('onSubmitProject', this.project);
        },
        close() {
            this.$emit('close');
        },
        iniciarModeloProjecto(){
            return {
                id: uid(),
                project: '',
                percentage: 0.00
            }
        },
        onSeleccionarProyecto(value){
            const fechaInicio = value.startAt;
            const fechaInicioFormateada = date.formatDate(fechaInicio, 'YYYY-MM-DD');
            const fechaFin = value.endAt;
            const fechaFinFormateada = date.formatDate(fechaFin, 'YYYY-MM-DD');
            
            
           this.projectSelected = {
            ...value,
            startAt: fechaInicioFormateada,
            endAt: fechaFinFormateada
        };
        }
    },
    computed: {
        ...mapGetters('projects', ['getProjects'])        
    }
};
</script>
