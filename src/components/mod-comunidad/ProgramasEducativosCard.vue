<template>
<div>
    <q-list bordered class="rounded-borders bg-white">
        <q-item>
            <q-item-section top>
                <q-item-label caption lines="1">
                Nombre de la Institución
                </q-item-label>
                <q-item-label>{{ programasEducativos.nombre }}</q-item-label>
            </q-item-section>

            <q-item-section side top>              
                <div class="text-grey-8 ">
                    <q-btn size="12px" flat dense round icon="more_vert" >
                        <q-menu cover auto-close>
                            <q-list>
                                <q-item clickable @click="editar">
                                    <q-item-section>Editar información</q-item-section>
                                </q-item>
                                <q-item clickable @click="agregarPersonal">
                                    <q-item-section>Agregar Personal</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>        
            </q-item-section>
        </q-item>    

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Tipo institución
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.tipoInstitucion }}</span>
                </q-item-label>
            </q-item-section>
        </q-item> 

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Dirección
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.direccion }}</span>
                </q-item-label>
            </q-item-section>
        </q-item> 
        
        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Teléfono
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.telefono }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Email
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.email }}</span>
                </q-item-label>
            </q-item-section>
        </q-item> 

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                No. Profesores
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.noProfesores }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                No. Alumnos
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.noAlumnos }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                No. Aulas
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.noAulas }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                ¿Tiene Restaurante Escolar?
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.restauranteEscolar ? 'Si' : 'No' }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                ¿Tiene Unidad Sanitaria?
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.unidadSanitaria ? 'Si' : 'No' }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                ¿Tiene Biblioteca?
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.biblioteca ? 'Si' : 'No' }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                ¿Tiene Auditorio?
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.auditorio ? 'Si' : 'No' }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Estado Planta Física
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.estadoPlantaFisica }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Area Construida
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.areaConstruida }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Area Total
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.areaTotal }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-separator />

        <q-item>
            <q-item-section top>
                <q-item-label caption lines="1">
                ¿Tiene Servicio de Energía?
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.servicioEnergia ? 'Si' : 'No' }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section top>
                <q-item-label caption lines="1">
                ¿Tiene Servicio de Acueducto?
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.servicioAcueducto ? 'Si' : 'No' }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>  

        <q-item >
            <q-item-section top>
                <q-item-label caption lines="1">
                Disposición de Excretas
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ programasEducativos.disposicionExcreta.nombre }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>   

    </q-list>
    <personas-institucion @close="closedModal" v-if="showPersonasDialog"></personas-institucion>
</div>
</template>

<script>
import { mapMutations } from "vuex"
import PersonasInstitucion from "src/components/mod-comunidad/personas-institucion-educativa/PersonasInstitucion.vue"
export default {
    props: {
        programasEducativos: {
            type: Object,
            required: true
        }
    },
    components: {PersonasInstitucion},
    data(){
        return {
            showPersonasDialog: false
        }
    },
    methods: {
        ...mapMutations("programasEducativos", ["setProgramasEducativosSuccess"]),
      editar(){
        this.$emit("editar", this.programasEducativos)
      },
      agregarPersonal(){
          this.setProgramasEducativosSuccess(this.programasEducativos);
          this.showPersonasDialog = true
      },
      closedModal(){
          this.showPersonasDialog = false
      }
    }

}
</script>

<style>

</style>