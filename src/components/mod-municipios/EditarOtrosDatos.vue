<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">otros datos del municipio</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-form
            class="q-gutter-md"
          >

            <q-input
              filled
              v-model="otrosDatos.composicion"
              label="Composición"
            />

            <q-input
              filled
              v-model="otrosDatos.altitud"
              label="Altitud sobre el nivel del mar"
            />     

            <q-input
              filled
              v-model="otrosDatos.gentilicio"
              label="Gentilicio"
            />

            <q-input
              filled
              type="date"
              v-model="otrosDatos.fechaFundacion"
              hint="Fecha de Fundación"
            />    

            <q-input
              filled
              type="textarea"
              v-model="otrosDatos.emblema"
              label="Emblema"
            />     

            <q-input
              filled
              type="textarea"
              v-model="otrosDatos.personajeRepresentativo"
              label="Personajes representativos"
            /> 

          </q-form>
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            :disable="getMunicipioState.loading"
            @click="close" />
          <q-btn
            label="Guardar"
            color="primary"
            :loading="getMunicipioState.loading"
            :disable="getMunicipioState.loading"
            @click="actualizar">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
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
      otrosDatos: {}
    }
  },

  methods: {
    ...mapActions('municipios', ['actualizarInformacionGeneralAction', 'guardarInformacionGeneralAction']),
    actualizar(){
      let infoGeneral = {
        ...this.getMunicipioState.municipio.informacionGeneral,
        composicion: this.otrosDatos.composicion,
        altitud: this.otrosDatos.altitud,
        gentilicio: this.otrosDatos.gentilicio,
        fechaFundacion: this.otrosDatos.fechaFundacion,
        emblema: this.otrosDatos.emblema,
        personajeRepresentativo: this.otrosDatos.personajeRepresentativo,
        municipio: {
          id: this.municipio.id
        }
      }

      if(infoGeneral.id > 0){
        //Actualizar
        this.actualizarInformacionGeneralAction(infoGeneral).then(() => {
          this.close();
        })
      }else{
        //Guardar
        this.guardarInformacionGeneralAction(infoGeneral).then( () => {
          this.close();
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  created(){
    this.otrosDatos = {
      id: 0,
      composicion: '',
      altitud: '',
      gentilicio: '',
      fechaFundacion: '',
      emblema: '',
      personajeRepresentativo: ''
    }
    if(this.getMunicipioState.municipio.informacionGeneral != null && Object.keys(this.getMunicipioState.municipio.informacionGeneral).length > 0){
      this.otrosDatos.id = this.getMunicipioState.municipio.informacionGeneral.id;
      this.otrosDatos.composicion = this.getMunicipioState.municipio.informacionGeneral.composicion;
      this.otrosDatos.altitud = this.getMunicipioState.municipio.informacionGeneral.altitud;
      this.otrosDatos.gentilicio = this.getMunicipioState.municipio.informacionGeneral.gentilicio;
      this.otrosDatos.fechaFundacion = this.getMunicipioState.municipio.informacionGeneral.fechaFundacion;
      this.otrosDatos.emblema = this.getMunicipioState.municipio.informacionGeneral.emblema;
      this.otrosDatos.personajeRepresentativo = this.getMunicipioState.municipio.informacionGeneral.personajeRepresentativo;
    }
  },
  computed: {
    ...mapGetters('municipios', ['getMunicipioState']),
    municipio(){
      return this.getMunicipioState.municipio
    }
  }

}
</script>

<style>

</style>