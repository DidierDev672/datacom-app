<template>
  <!-- <pre>{{ getProgramasEducativosState.objProgramasEducativos }}</pre> -->
  <div></div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
    methods: {
        ...mapActions('programasEducativos', ['cargarListaPersonalProgramaEducativoAction'])
    },
    computed: {
        ...mapGetters('programasEducativos', ['getProgramasEducativosState'])
    },
    created(){
        if(this.getProgramasEducativosState.objProgramasEducativos.id > 0){
            //llamar al metodo que trae la lista de personal
            let institucionID = this.getProgramasEducativosState.objProgramasEducativos.id
            this.cargarListaPersonalProgramaEducativoAction(institucionID).then( data => {
                console.log('Data: ', data);
            })
        }
    }

}
</script>

<style>

</style>