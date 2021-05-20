<template>
    <div class="q-ma-sm">
        <div v-if="poblacion.length > 0" class="row">
            <div class="col-xs-12 col-sm-8 offset-sm-2">                
                <TablaPoblacionRangoEdad
                    class="q-mb-sm"
                    v-for="poblacionEtarea in poblacion"
                    :poblacion="poblacionEtarea"
                    @eliminar="eliminarPoblacion"
                    :key="poblacionEtarea.id"></TablaPoblacionRangoEdad>
            </div>
        </div>
        <div v-else class="text-center flex flex-center">                
            <h6>No hay registros para mostrar</h6>
        </div>        
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="primary" @click="agregar">
                <q-tooltip>
                    Agregar nuevo registro
                </q-tooltip>
            </q-btn>
        </q-page-sticky>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TablaPoblacionRangoEdad from 'components/mod-municipios/TablaPoblacionRangoEdad'
export default {
    components: { TablaPoblacionRangoEdad },
    data(){
        return {
            municipioID: 0,
            poblacion: [],
            poblacionPorRangoDeEdad: {}
        }
    },   
    mounted () {
        this.municipioID = this.$route.params.id
        if(this.municipioID > 0){
            this.cargarListaPoblacionAction(this.municipioID).then(data => {
                this.poblacion = [...data]
            })
        }
        let fecha = new Date();
        let ano = fecha.getFullYear();
        this.poblacionPorRangoDeEdad = {
            id: 0,
            estado: true,
            ano: ano,
            de0A4Anos: 0,
            de5A9Anos: 0,
            de10A14Anos: 0,
            de15A19Anos: 0,
            de20A24Anos: 0,
            de25A29Anos: 0,
            de30A34Anos: 0,
            de35A39Anos: 0,
            de40A44Anos: 0,
            de45A49Anos: 0,
            de50A54Anos: 0,
            de55A59Anos: 0,
            de60A64Anos: 0,
            de65A69Anos: 0,
            de70A74Anos: 0,
            de75A79Anos: 0,
            mayorA80Anos: 0,
            municipioPoblacion: { id: this.municipioID }
        }
        
    },
    methods: {
        ...mapActions('poblacion', ['guardarPoblacion','agregarPoblacionAction', 'cargarListaPoblacionAction', 'eliminarPoblacionAction']),       
        agregar(){
            this.guardarPoblacion(this.poblacionPorRangoDeEdad).then(data => {
                this.poblacion.unshift({
                    ...this.poblacionPorRangoDeEdad,
                    id: data
                })
            })
        },
        eliminarPoblacion(poblacionID){
            this.eliminarPoblacionAction(poblacionID).then(data => {
                if(data){
                    this.poblacion = this.poblacion.filter(pob => pob.id != poblacionID)
                }
            })
        }
    },
    computed: {
        ...mapGetters('municipios', ['getMunicipioState'])
    }
}
</script>

<style>

</style>