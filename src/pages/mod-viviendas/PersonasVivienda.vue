<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <div>
          <q-list bordered padding class="rounded-borders q-mb-md">
            <q-item-label header>Integrantes del Hogar</q-item-label>

            <q-item clickable v-ripple v-for="integrante in getPersonas" :key="integrante.id">
              <q-item-section avatar top>
                <q-avatar icon="person" color="primary" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ integrante.nombre }} </q-item-label>
                <q-item-label caption>{{ integrante.parentesco }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon name="info" color="green" />
              </q-item-section>
            </q-item>


          </q-list>


          <div class="flex justify-center">
              <q-btn label="Anterior" no-caps color="primary" flat class="q-mr-sm" :to="{ name: 'saneamiento-basico', params:{id: encuestaID}}" />
              <q-btn label="Siguiente" no-caps color="primary" :to="{ name: 'control-vivienda' }"/>
          </div>
        </div>
      </div>
    </div>
</div>




</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {

  data(){
    return {
      encuestaID: 0,
    }
  },

  created(){
    this.encuestaID = this.$route.params.id
  },

  computed: {
    ...mapGetters('datosVivienda', ['getDatosViviendaState']),
    getPersonas(){
      let objPersona = []
      for(var i = 1; i <= this.getDatosViviendaState.objDatosVivienda.noPersonas; i++){
        objPersona.push({
          id: i,
          nombre: 'Integrante No. ' + i,
          parentesco: 'Por definir'
        })
      }
      return objPersona
    }

  }

}
</script>

<style>

</style>
