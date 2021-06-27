<template>
<q-card
  flat
  bordered>

  <q-form ref="repLegalForm">    

  <q-card-section>

    <q-list class="report-list">

      <q-item>
        <q-item-section>
          <q-item-label>2. Datos del representante legal</q-item-label>
        </q-item-section>
      </q-item>
      

    <q-item>

      <q-item-section>
        <q-item-label>Nombre completo</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.representanteLegal"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

    </q-item>
    
    <q-item>

      <q-item-section>
        <q-item-label>Tipo documento de identificación</q-item-label>
        <q-item-label caption>
          <q-select
            outlined
            v-model="jacInfoDB.tipoIdentificacionRepresentanteLegal"
            option-label="nombre"
            option-value="id"
            :options="tipoIdentificacionOptions"
            lazy-rules
            :rules="[ val => val != null && val.id > 0 || 'Debe elegir un tipo de identificación']" />
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Número de Documento</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.noIdentificacionRepresentanteLegal"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>Fecha nacimiento</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.fechaNacimiento"
            mask="date"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaNacimiento">
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
            <q-item-label>Sexo</q-item-label>
            <q-item-label caption>
            <q-select
                outlined
                v-model="jacInfoDB.genero"
                option-label="nombre"
                option-value="id"
                :options="generoOptions"
                lazy-rules
                :rules="[ val => val != null && val.id > 0 || 'Debe elegir un tipo de sexo']" />
            </q-item-label>
        </q-item-section>

        <q-item-section>
            <q-item-label>Nivel educativo</q-item-label>
            <q-item-label caption>
            <q-select
                outlined
                v-model="jacInfoDB.nivelEducativa"
                option-label="nombre"
                option-value="id"
                :options="nivelEscolaridadOptions"
                lazy-rules
                :rules="[ val => val != null && val.id > 0 || 'Debe elegir un nivel educativo']" />
            </q-item-label>
        </q-item-section>


        <q-item-section>
            <q-item-label>Celular</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.celular"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
            </q-item-label>
        </q-item-section>

    </q-item>

    <q-item>

        <q-item-section>
            <q-item-label>Dirección</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.direccion"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
            </q-item-label>
        </q-item-section>

        <q-item-section>
            <q-item-label>Email</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.emailRepresentanteLegal"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
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
      tipoIdentificacionOptions: [],
      generoOptions: [],
      nivelEscolaridadOptions: []
    }
  },
  created() {

    this.jacID = this.$route.params.id

    let categorias = [CATEGORIAS.TIPO_DOCUMENTO_IDENTIDAD, CATEGORIAS.NIVEL_EDUCATIVO, CATEGORIAS.SEXO]

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
        data.forEach(opt => {
            if(opt.categoria.codigo === 'TDI')
                this.tipoIdentificacionOptions.push(opt)
            else if(opt.categoria.codigo === 'SEXO')
                this.generoOptions.push(opt)
            else
                this.nivelEscolaridadOptions.push(opt)
        })
    })

    this.jacInfoDB = {
      id: this.$route.params.id,
      representanteLegal: '',
      tipoIdentificacionRepresentanteLegal: '',
      noIdentificacionRepresentanteLegal: '',
      fechaNacimiento: '',
      genero: '',
      nivelEducativa: '',
      celular: '',
      direccion: '',
      emailRepresentanteLegal: ''
    }    

    this.buscarJacInfoAction(this.jacID).then(data => {
      if(data.id > 0){
        this.jacInfoDB = {...data}
      }
    })
  },
  methods: {
    ...mapActions('jacInfo',['buscarJacInfoAction','registrarJacInfoAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),   
    onSubmit () {

      this.$refs.repLegalForm.validate().then(success => {
        if (success) {
          this.registrarJacInfoAction(this.jacInfoDB).then(data => {
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
    }
  },
  computed: {
    ...mapGetters('jacInfo', ['getJacInfoState']),

  }
}
</script>

<style lang="sass">

</style>
