<template>  
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <q-list bordered class="rounded-borders">
          <q-item-label header>Ubicación del municipio</q-item-label>

          <q-item >
            <q-item-section style="cursor: pointer" top @click="modalEditarUbicacion = true">
              <q-item-label caption lines="1">
                Municipio
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ municipio.codigoDane }} - {{ municipio.nombreMunicipio }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn @click="modalEditarUbicacion=true" class="gt-xs" size="12px" flat dense round icon="edit" />
              </div>
            </q-item-section>
          </q-item>

          <q-item >
            <q-item-section style="cursor: pointer" top @click="modalEditarUbicacion = true">
              <q-item-label caption lines="1">
                Departamento
              </q-item-label>
              <q-item-label lines="1">
                <span v-if="departamento" class="text-weight-medium">{{ departamento.codigo }} - {{ departamento.nombreDepartamento }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarUbicacion = true">
              <q-item-label caption lines="1">
                Región
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.region ? infoGeneral.region : 'Agregue la región') : 'Agregue la región'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarUbicacion = true">
              <q-item-label caption lines="1">
                Extensión
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral ? infoGeneral.extension : 'Agregue la extensión territorial en'}} KM2</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header>Límites geográficos</q-item-label>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarLimitesGeograficos = true">
              <q-item-label caption lines="1">
                Límite Norte
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.limiteNorte ? infoGeneral.limiteNorte : 'Agregue límite norte') : 'Agregue límite norte'}}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="modalEditarLimitesGeograficos = true" />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarLimitesGeograficos = true">
              <q-item-label caption lines="1">
                Límite Sur
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.limiteSur ? infoGeneral.limiteSur : 'Agregue límite sur') : 'Agregue límite sur'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarLimitesGeograficos = true">
              <q-item-label caption lines="1">
                Límite Oriente
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.limiteOriente ? infoGeneral.limiteOriente : 'Agregue límite oriente') : 'Agregue límite oriente'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarLimitesGeograficos = true">
              <q-item-label caption lines="1">
                Límite Occidente
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.limiteOccidente ? infoGeneral.limiteOccidente : 'Agregue límite occidente') : 'Agregue límite occidente'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header>Otros datos</q-item-label>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarOtrosDatos = true">
              <q-item-label caption lines="1">
                Composición
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.composicion ? infoGeneral.composicion : 'Agregue la composicion') : 'Agregue la composicion'}}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="modalEditarOtrosDatos = true"/>
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarOtrosDatos = true">
              <q-item-label caption lines="1">
                Altitud
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.altitud ? infoGeneral.altitud : 'Agregue la altitud') : 'Agregue la altitud'}} msnm</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarOtrosDatos = true">
              <q-item-label caption lines="1">
                gentilicio
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.gentilicio ? infoGeneral.gentilicio : 'Agregue el gentilicio') : 'Agregue el gentilicio'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarOtrosDatos = true">
              <q-item-label caption lines="1">
                Fecha de fundación
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.fechaFundacion ? infoGeneral.fechaFundacion : 'Agregue la fecha de fundación') : 'Agregue la fecha de fundación'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarOtrosDatos = true">
              <q-item-label caption lines="1">
                Emblema del municipio
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.emblema ? infoGeneral.emblema : 'Agregue emblema') : 'Agregue emblema'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarOtrosDatos = true">
              <q-item-label caption lines="1">
                personaje representativo
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.personajeRepresentativo ? infoGeneral.personajeRepresentativo : 'Agregue personajes representativos del municipio') : 'Agregue personajes representativos del municipio'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

        </q-list>

        <EditarUbicacion @close="closeModalEditarUbicacion" v-if="modalEditarUbicacion"></EditarUbicacion>
        <EditarLimitesGeograficos @close="closeModalEditarLimitesGeograficos" v-if="modalEditarLimitesGeograficos"></EditarLimitesGeograficos>
        <EditarOtrosDatos @close="closeModalEditarOtrosDatos" v-if="modalEditarOtrosDatos"></EditarOtrosDatos>         
  
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditarUbicacion from 'components/mod-municipios/EditarUbicación'
import EditarLimitesGeograficos from 'components/mod-municipios/EditarLimitesGeograficos'
import EditarOtrosDatos from 'components/mod-municipios/EditarOtrosDatos'
export default {
  components: { EditarUbicacion, EditarLimitesGeograficos, EditarOtrosDatos },
  data () {
    return {
      basic: false,
      modalEditarUbicacion: false,
      modalEditarLimitesGeograficos: false, 
      modalEditarOtrosDatos: false     
    }
  },
  methods: {
    onSubmit () {
      
    },
    actualizarInfomacionGeneral(evt){
      console.log('Value: ', evt);
    },
    closeModalEditarUbicacion(){
      this.modalEditarUbicacion = false
    },
    closeModalEditarLimitesGeograficos(){
      this.modalEditarLimitesGeograficos = false
    },
    closeModalEditarOtrosDatos(){
      this.modalEditarOtrosDatos = false
    }
  },
  mounted () {

  },
  computed: {
    ...mapGetters('municipios', ['getMunicipioState']),
    departamento(){
      return this.getMunicipioState.municipio.departamento
    },
    infoGeneral(){
      return this.getMunicipioState.municipio.informacionGeneral
    },
    municipio(){
      return this.getMunicipioState.municipio
    }
  }
}
</script>

<style>

</style>