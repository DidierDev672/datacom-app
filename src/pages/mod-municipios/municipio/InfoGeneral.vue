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
            <q-item-section top>
              <q-item-label caption lines="1">
                Límite Norte
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Santa Sofía</span>
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="edit" />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                Límite Sur
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Tinjacá</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                Límite Oriente
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Villa de Leyva y Sáchica</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                Límite Occidente
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Saboyá</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item-label header>Otros datos</q-item-label>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                Composición
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Nueve (9) veredas</span>
              </q-item-label>
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="edit" />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                Altitud
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">1.800 msnm</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                gentilicio
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Sutamarchense</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                Fecha de fundación
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">14 de diciembre de 1556</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="#">
            <q-item-section top>
              <q-item-label caption lines="1">
                Emblema del municipio
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Agregar emblema del municipio</span>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section top>
              <q-item-label caption lines="1">
                personaje representativo
              </q-item-label>
              <q-item-label lines="1">
                <span class="text-weight-medium">Pedro González (Don Jediondo)</span>
              </q-item-label>
            </q-item-section>
          </q-item>

        </q-list>

        <EditarUbicacion @close="closeModalEditarUbicacion" v-if="modalEditarUbicacion"></EditarUbicacion>       
  
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditarUbicacion from 'components/mod-municipios/EditarUbicación'
export default {
  components: { EditarUbicacion },
  data () {
    return {
      basic: false,
      modalEditarUbicacion: false,
      name: '',
      age: 21,
      accept: true,
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