<template>
  <h6>Lista de encuestas</h6>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    created () {
        this.cargarListaEncuestaAction().then(data => {
            console.log('Lista de encuestas: ', data);
        })
    },
    methods: {
        ...mapActions('encuesta', ['cargarListaEncuestaAction']),
    }

}
</script>

<style>

</style>