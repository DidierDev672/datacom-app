<template>
<q-card
  flat
  bordered>

  <q-form ref="jacForm">

  <q-card-section>

    <q-list class="report-list">

      <q-item>
        <q-item-section>
          <q-item-label>1. Información General</q-item-label>
        </q-item-section>
      </q-item>


    <q-item>

      <q-item-section>
        <q-item-label>Nombre de la organización</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.nombre"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Tipo</q-item-label>
        <q-item-label caption>
          <!-- <q-input outlined v-model="jacInfoDB.tipo"/> -->
          <q-select
            outlined
            option-value="id"
            option-label="nombre"
            v-model="jacInfoDB.tipo"
            :options="tipoOptions"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>Departamento</q-item-label>
        <q-item-label caption>
          <q-select
            outlined
            use-input
            v-model="departamento"
            option-label="nombreDepartamento"
            option-value="id"
            @input="buscarMunicipios"
            @filter="filterFnDepartamento"
            :options="departamentos"
            lazy-rules
            :rules="[ val => val != null && val.id > 0 || 'Debe elegir un departamento']" />
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Municipio</q-item-label>
        <q-item-label caption>
          <q-select
            outlined
            ref="municipio"
            use-input
            v-model="municipio"
            option-label="nombreMunicipio"
            option-value="id"
            :options="municipios"
            @filter="filterFnMunicipio"
            @input="buscarComunidades"
            lazy-rules
            :rules="[ val => val != null && val.id > 0 || 'Debe elegir un municipio']" />
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Comunidad/Barrio</q-item-label>
        <q-item-label caption>
          <!-- <q-input outlined v-model="jacInfoDB.comunidad"/> -->
          <q-select
            outlined
            ref="comunidad"
            v-model="jacInfoDB.comunidad"
            option-label="nombreComunidad"
            option-value="id"
            :options="comunidades"
            lazy-rules
            :rules="[ val => val != null && val.id > 0 || 'Debe elegir una comunidad']" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>Email</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.email"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tiene Personería Jurídica?</q-item-label>
        <q-item-label caption>
           <q-option-group inline :options="options" type="radio" v-model="jacInfoDB.tienePersoneriaJuridica" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item v-if="jacInfoDB.tienePersoneriaJuridica">

      <q-item-section>
        <q-item-label>No. Personería Jurídica</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.noPersoneriaJuridica"/>
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Otorgada por</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.personeriaJuridicaOtorgadaPor" />
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Fecha expedición</q-item-label>
        <q-item-label caption>
          <!-- <q-input outlined v-model="jacInfoDB.fechaExpedicionPersoneria"/> -->
          <q-input outlined v-model="jacInfoDB.fechaExpedicionPersoneria" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaExpedicionPersoneria">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tiene RUT?</q-item-label>
        <q-item-label caption>
           <q-option-group inline :options="options" type="radio" v-model="jacInfoDB.tieneRut" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item v-if="jacInfoDB.tieneRut">

      <q-item-section>
        <q-item-label>No. RUT</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.noRut"/>
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Fecha expedición</q-item-label>
        <q-item-label caption>
          <!-- <q-input outlined v-model="jacInfoDB.fechaExpedicionRut"/> -->
          <q-input outlined v-model="jacInfoDB.fechaExpedicionRut" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaExpedicionRut">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tiene RUC?</q-item-label>
        <q-item-label caption>
           <q-option-group inline :options="options" type="radio" v-model="jacInfoDB.tieneRuc" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item v-if="jacInfoDB.tieneRuc">

      <q-item-section>
        <q-item-label>No. RUC</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.noRuc"/>
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Fecha expedición</q-item-label>
        <q-item-label caption>
          <!-- <q-input outlined v-model="jacInfoDB.fechaExpedicionRuc"/> -->
          <q-input outlined v-model="jacInfoDB.fechaExpedicionRuc" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaExpedicionRuc">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tiene Autoreconocimiento?</q-item-label>
        <q-item-label caption>
           <q-option-group inline :options="options" type="radio" v-model="jacInfoDB.tieneAutoreconocimiento" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item v-if="jacInfoDB.tieneAutoreconocimiento">

      <q-item-section>
        <q-item-label>No. Autoreconocimiento</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.noAutoreconocimiento"/>
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Autoreconocimiento otorgado por</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.autorecocimientoExpedidoPor"/>
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Fecha expedición</q-item-label>
        <q-item-label caption>
          <!-- <q-input outlined v-model="jacInfoDB.fechaExpedicionAutoreconocimiento"/> -->
          <q-input outlined v-model="jacInfoDB.fechaExpedicionAutoreconocimiento" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaExpedicionAutoreconocimiento">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>

    </q-item>

    </q-list>

  </q-card-section>

   <q-separator />

  <q-card-actions align="right">
    <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
  </q-card-actions>

  </q-form>

</q-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {CATEGORIAS} from "src/utils/config";

export default {
  name: "JacInfo",
  data () {
    return {
      jacID: 0,
      jacInfoDB: {},
      departamentos: [],
      departamentosList: [],
      departamento: '',
      municipios: [],
      municipiosList: [],
      municipio: '',
      tipoOptions: [],
      comunidades: [],
      tipoIdentificacionRepresentante:[],
      options: [
        { label: 'Si', value: true },
        { label: 'No', value: false }
      ]
    }
  },
  created() {

    this.jacID = this.$route.params.id

    let categorias = [CATEGORIAS.TIPO_JUNTA]

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.tipoOptions = data
    })

    this.cargarListaDepartamentoAction().then(data => {
      this.departamentosList = data
      this.departamentos = this.departamentosList
    })

    this.jacInfoDB = {
      id: 0,
      nombre: '',
      tipo: '',
      comunidad: '',
      email: '',
      tienePersoneriaJuridica: true,
      noPersoneriaJuridica: '',
      personeriaJuridicaOtorgadaPor: '',
      fechaExpedicionPersoneria: '',
      tieneRut: true,
      noRut: '',
      fechaExpedicionRut: '',
      tieneRuc: true,
      noRuc: '',
      fechaExpedicionRuc: '',
      tieneAutoreconocimiento: true,
      autorecocimientoExpedidoPor: '',
      fechaExpedicionAutoreconocimiento: '',
      fechaActualizacionJac: ''
    }

    this.buscarJacInfoAction(this.jacID).then(data => {
      if(data.id > 0){
        this.jacInfoDB = {...data}
        this.municipio = data.comunidad.municipio
        this.departamento = data.comunidad.municipio.departamento
      }
    })
  },
  methods: {
    ...mapActions('jacInfo',['buscarJacInfoAction','registrarJacInfoAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    ...mapActions('departamento', ['cargarListaDepartamentoAction', 'cargarListaMunicipiosDelDepartamentoAction']),
    ...mapActions('municipios', ['cargarListaComunidadesDelMunicipioAction']),
    buscarMunicipios(departamentoID){
      this.municipio = null
      this.$refs.municipio.resetValidation()
      if(departamentoID != null){
        this.cargarListaMunicipiosDelDepartamentoAction(departamentoID.id).then(data => {
          this.municipiosList = data
          this.municipios = this.municipiosList
        })
      }
    },
    buscarComunidades(municipioID){
      this.jacInfoDB.comunidad = null
      this.$refs.comunidad.resetValidation()
      if(municipioID != null){
        this.cargarListaComunidadesDelMunicipioAction(municipioID.id).then(data => {
          this.comunidades = data
        })
      }
    },
    onSubmit () {

      this.$refs.jacForm.validate().then(success => {
        if (success) {
          console.log('Formulario: ', this.jacInfoDB);
          this.registrarJacInfoAction({
            ...this.jacInfoDB,
              id: this.jacID,
            usuarioCreacion: this.getUser,
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.$q.notify({
              message: 'Información actualizada correctamente',
              color: 'positive'
            })
          })
        }else{
          this.$q.notify({
            message: 'Favor completar los campos correctamente',
            color: 'red'
          })
        }
      })
    },
    filterFnDepartamento (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.departamentos = this.departamentosList.filter(v => v.nombreDepartamento.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterFnMunicipio (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.municipios = this.municipiosList.filter(v => v.nombreMunicipio.toLowerCase().indexOf(needle) > -1)
      })
    },

  },
  computed: {
    ...mapGetters('jacInfo', ['getJacInfoState']),
    ...mapGetters('auth', ['getUser']),

  }
}
</script>

<style lang="sass">

</style>
