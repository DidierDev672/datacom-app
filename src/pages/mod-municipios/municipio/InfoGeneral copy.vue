<template>  
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <q-list bordered class="rounded-borders bg-white">
          <q-item-label header>Ubicación del municipio</q-item-label>          

          <q-item >
            <q-item-section style="cursor: pointer" top @click="modalEditarUbicacion = true">
              <q-item-label caption lines="1">
                Municipio
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ getInformacionGeneralState.objInformacionGeneral.municipio.codigoDane }} - {{ infoGeneral.municipio.nombreMunicipio }}</span>
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
                <span class="text-weight-medium">{{ infoGeneral.municipio.departamento.codigo }} - {{ infoGeneral.municipio.departamento.nombreDepartamento }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarUbicacion = true">
              <q-item-label caption lines="1">
                Región
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ getInformacionGeneralState.objInformacionGeneral.region }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarUbicacion = true">
              <q-item-label caption lines="1">
                Extensión
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ getInformacionGeneralState.objInformacionGeneral.extension }} KM2</span>
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
                <span class="text-weight-medium">{{ getInformacionGeneralState.objInformacionGeneral.limiteNorte }}</span>
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
                <span class="text-weight-medium">{{ getInformacionGeneralState.objInformacionGeneral.limiteSur }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarLimitesGeograficos = true">
              <q-item-label caption lines="1">
                Límite Oriente
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ getInformacionGeneralState.objInformacionGeneral.limiteOriente }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarLimitesGeograficos = true">
              <q-item-label caption lines="1">
                Límite Occidente
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ getInformacionGeneralState.objInformacionGeneral.limiteOccidente }}</span>
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

          <q-separator spaced />

          <q-item-label header>Demografía</q-item-label>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                Población Urbana
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.poblacionUrbana ? infoGeneral.poblacionUrbana : 'Agregue población urbana') : 'Agregue población urbana'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                Población Rural
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.poblacionRural ? infoGeneral.poblacionRural : 'Agregue población rural') : 'Agregue población rural'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                No. Hombres
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.noHombres ? infoGeneral.noHombres : 'Agregue el número de hombres') : 'Agregue el número de hombres'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                No. Mujeres
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.noMujeres ? infoGeneral.noMujeres : 'Agregue el número de mujeres') : 'Agregue el número de mujeres'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                Población Indígena
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.noIndigenas ? infoGeneral.noIndigenas : 'Agregue población indígena') : 'Agregue población indígena'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                Población Afro
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.noAfro ? infoGeneral.noAfro : 'Agregue población afro') : 'Agregue población afro'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                Tasa de fecundidad
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.tasaFecundidad ? infoGeneral.tasaFecundidad : 'Agregue la tasa de fecundidad') : 'Agregue la tasa de fecundidad'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                Tasa de Natalidad
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.tasaNatalidad ? infoGeneral.tasaNatalidad : 'Agregue la tasa de natalidad') : 'Agregue la tasa de natalidad'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section style="cursor: pointer" top @click="modalEditarDemografia = true">
              <q-item-label caption lines="1">
                Densidad poblacional
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">{{ infoGeneral != null ? (infoGeneral.densidad ? infoGeneral.densidad : 'Agregue la densidad poblacional') : 'Agregue la densidad poblacional'}}</span>
              </q-item-label>
            </q-item-section>
          </q-item>

        </q-list>

        <EditarUbicacion @close="closeModalEditarUbicacion" v-if="modalEditarUbicacion"></EditarUbicacion>
        <EditarLimitesGeograficos @close="closeModalEditarLimitesGeograficos" v-if="modalEditarLimitesGeograficos"></EditarLimitesGeograficos>
        <EditarOtrosDatos @close="closeModalEditarOtrosDatos" v-if="modalEditarOtrosDatos"></EditarOtrosDatos>         
        <EditarDemografia @close="closeModalEditarDemografia" v-if="modalEditarDemografia"></EditarDemografia>         
  
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditarUbicacion from 'components/mod-municipios/EditarUbicacion'
import EditarLimitesGeograficos from 'components/mod-municipios/EditarLimitesGeograficos'
import EditarOtrosDatos from 'components/mod-municipios/EditarOtrosDatos'
import EditarDemografia from 'components/mod-municipios/EditarDemografia'
export default {
  components: { EditarUbicacion, EditarLimitesGeograficos, EditarOtrosDatos, EditarDemografia },
  data () {
    return {
      municipioID: 0,
      infoGeneral: {},
      basic: false,
      modalEditarUbicacion: false,
      modalEditarLimitesGeograficos: false, 
      modalEditarOtrosDatos: false,
      modalEditarDemografia: false

    }
  },
  created() {
    this.infoGeneral = {
      id: 0,
      alcalde: '',
      altitud: '',
      categoria: '',
      composicion: '',
      correo: '',
      correoAlcalde: '',
      densidad: '',
      direccionAlcaldia: '',
      emblema: '',
      estado: '',
      extension: '',
      fechaActualizacion: '',
      fechaCreacion: '',
      fechaFundacion: '',
      gentilicio: '',
      horarioDeAtencion: '',
      limiteNorte: '',
      limiteOccidente: '',
      limiteOriente: '',
      limiteSur: '',
      noAfro: '',
      noHombres: '',
      noIndigenas: '',
      noMujeres: '',
      paginaDeFacebook: '',
      paginaWeb: '',
      partidoPolitico: '',
      personajeRepresentativo: '',
      poblacionRural: '',
      poblacionUrbana: '',
      region: '',
      tasaFecundidad: '',
      tasaNatalidad: '',
      telefono: '',
      telefonoAlcalde: '',
      usuarioActualizacion: '',
      usuarioCreacion: '',
      municipio: {
        codigoDane: '',
        nombreMunicipio: '',
        departamento: {
          codigo: '',
          nombreDepartamento: ''
        }
      }
    }
    this.municipioID = this.$route.params.id
    if(this.municipioID > 0){
      this.buscarInformacionGeneralAction(this.municipioID).then(data => {
        if(Object.keys(data).length > 0){
          this.infoGeneral = data
        }
      })
    }
  },
  methods: {
    ...mapActions('informacionGeneral',['buscarInformacionGeneralAction']),
    onSubmit () {
      
    },
    actualizarInfomacionGeneral(evt){
      console.log('Value: ', evt);
    },
    closeModalEditarUbicacion(){ this.modalEditarUbicacion = false },
    closeModalEditarLimitesGeograficos(){ this.modalEditarLimitesGeograficos = false },
    closeModalEditarOtrosDatos(){ this.modalEditarOtrosDatos = false },
    closeModalEditarDemografia(){ this.modalEditarDemografia = false }

  },
  computed: {
    ...mapGetters('municipios', ['getMunicipioState']),
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),
    departamento(){
      return this.getMunicipioState.municipio.departamento
    },
    // infoGeneral(){
    //   return this.getMunicipioState.municipio.informacionGeneral
    // },
    municipio(){
      return this.getMunicipioState.municipio
    }
  }
}
</script>

<style>

</style>