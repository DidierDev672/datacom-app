<template>
  <q-dialog v-model="show">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ubicacion del municipio</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

            <q-input
              filled
              v-model="ubicacion.region"
              label="Ingresar una región"
            />

            <q-input
              filled
              v-model="ubicacion.extension"
              label="Ingresar la extensión territorial"
            />          
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="close" />
          <q-btn label="Guardar" color="primary" @click="actualizar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data(){
    return {
      show: true,
      ubicacion: {}
    }
  },

  methods: {
    ...mapActions('municipios', ['actualizarInformacionGeneralAction']),
    actualizar(){
      let infoGeneral = {
        ...this.getMunicipioState.municipio.informacionGeneral,
        region: this.ubicacion.region,
        extension: this.ubicacion.extension
      }
      this.actualizarInformacionGeneralAction(infoGeneral).then(data => {
        this.close();
      })
    },
    close(){
      this.$emit("close");
    }
  },
  created(){
    this.ubicacion = {
      id: 0,
      region: '',
      extension: ''
    }
    if(this.getMunicipioState.municipio.informacionGeneral != null && Object.keys(this.getMunicipioState.municipio.informacionGeneral).length > 0){
      this.ubicacion.id = this.getMunicipioState.municipio.informacionGeneral.id;
      this.ubicacion.region = this.getMunicipioState.municipio.informacionGeneral.region;
      this.ubicacion.extension = this.getMunicipioState.municipio.informacionGeneral.extension;
    }
  },
  computed: {
    ...mapGetters('municipios', ['getMunicipioState']),
  }

}
</script>

<style>

</style>