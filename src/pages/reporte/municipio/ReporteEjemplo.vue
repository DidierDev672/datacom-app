<template>
    <div>
        <q-btn label="Descargar reporte" @click="descargar" />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
    export default {

        methods: {
            ...mapActions('reporteFichaMunicipio', ['reporteEjemploAction']),
            descargar(){
                this.reporteEjemploAction();
            }
        }
        
    }
</script>

<style lang="scss" scoped>

</style>