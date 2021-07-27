<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    full-width
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Institución Educativa</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

          <p>Datos de la Institución</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="programasEducativos.nivel"
                :options="tipoNivelInstitucionesEducativasOptions"
                label="Seleccione el nivel de Institución" />
            </div>
            <div class="col-xs-12 col-sm-7">
              <q-input outlined v-model="programasEducativos.nombre" label="Nombre de la institución" />
            </div>
            <div class="col-xs-12 col-sm-2">
              <!-- <q-input outlined v-model="programasEducativos.tipoInstitucion" label="Seleccione si es pública o privada" /> -->
              <q-select
                outlined
                v-model="programasEducativos.tipoInstitucion"
                :options="tipoInstitucionOptions"
                label="Seleccione si es pública o privada" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-input outlined v-model="programasEducativos.telefono" label="Teléfono" />
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input outlined v-model="programasEducativos.direccion" label="Dirección" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input outlined v-model="programasEducativos.email" label="Email" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-2">
              <q-input outlined v-model="programasEducativos.noProfesores" label="No. Profesores" />
            </div>
            <div class="col-xs-12 col-sm-2">
              <q-input outlined v-model="programasEducativos.noAlumnos" label="No. Alumnos" />
            </div>
            <div class="col-xs-12 col-sm-2">
              <q-input outlined v-model="programasEducativos.noAulas" label="No. Aulas" />
            </div>
            <div class="col-xs-12 col-sm-2">
              <q-select
                outlined
                v-model="programasEducativos.estadoPlantaFisica"
                :options="estadoPlantaFisicaOptions"
                label="Estado Planta Física" />
            </div>
            <div class="col-xs-12 col-sm-2">
              <q-input outlined v-model="programasEducativos.areaConstruida" label="Área Construida" />
            </div>
            <div class="col-xs-12 col-sm-2">
              <q-input outlined v-model="programasEducativos.areaTotal" label="Área Total" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="programasEducativos.disposicionExcreta"
                :options="disposicionExcretasOptions"
                label="Disposición de Excretas" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <p class="text-caption">¿La institución cuenta con Restaurante Escolar?</p>
              <q-option-group :options="siNoOptions" type="radio" v-model="programasEducativos.restauranteEscolar" />
            </div>
            <div class="col-xs-12 col-sm-3">
              <p class="text-caption">¿La institución cuenta con Unidad Sanitaria?</p>
              <q-option-group :options="siNoOptions" type="radio" v-model="programasEducativos.unidadSanitaria" />
            </div>

            <div class="col-xs-12 col-sm-3">
              <p class="text-caption">¿La institución cuenta con Biblioteca?</p>
              <q-option-group :options="siNoOptions" type="radio" v-model="programasEducativos.biblioteca" />
            </div>

            <div class="col-xs-12 col-sm-3">
              <p class="text-caption">¿La institución cuenta con Auditorio?</p>
              <q-option-group :options="siNoOptions" type="radio" v-model="programasEducativos.auditorio" />
            </div>

          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <p class="text-caption">¿La institución cuenta con Servicio de Energía?</p>
              <q-option-group :options="siNoOptions" type="radio" v-model="programasEducativos.servicioEnergia" />
            </div>
            <div class="col-xs-12 col-sm-3">
              <p class="text-caption">¿La institución cuenta con Servicio de Acueducto?</p>
              <q-option-group :options="siNoOptions" type="radio" v-model="programasEducativos.servicioAcueducto" />
            </div>
          </div>


          </q-form>

        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            :disable="getProgramasEducativosState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getProgramasEducativosState.loading"
            :disable="getProgramasEducativosState.loading"
            @click="onSubmit">
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
import { CATEGORIAS } from '../../utils/config'

export default {
  data(){
    return {
      show: true,
      programasEducativos: {},
      encuestaID: 0,
      tipoNivelInstitucionesEducativasOptions: [],
      disposicionExcretasOptions: [],
      estadoPlantaFisicaOptions: ['Buena', 'Regular', 'Mala'],
      siNoOptions: [
        {label: 'Si', value: true},
        {label: 'No', value: false}
      ],
      tipoInstitucionOptions: ['Pública', 'Privada'],
    }
  },
  created(){
    let categorias = [CATEGORIAS.NIVEL_INSTITUCION_EDUCATIVA, CATEGORIAS.DISPOSICION_EXCRETAS]
    this.encuestaID = this.$route.params.id
    this.programasEducativos = {
      id: 0,
      tipoInstitucion: '',
      nivel: '',
      direccion: '',
      nombre:'',
      telefono: '',
      email: '',
      noProfesores: '',
      noAlumnos: '',
      noAulas: '',
      restauranteEscolar: false,
      unidadSanitaria: false,
      biblioteca: false,
      auditorio: false,
      estadoPlantaFisica: '',
      areaConstruida: '',
      areaTotal: '',
      disposicionExcreta: '',
      servicioEnergia: true,
      servicioAcueducto: true
    }

    if(Object.keys(this.getProgramasEducativosState.objProgramasEducativos).length > 0){
      this.programasEducativos.id = this.getProgramasEducativosState.objProgramasEducativos.id;
      this.programasEducativos.tipoInstitucion = this.getProgramasEducativosState.objProgramasEducativos.tipoInstitucion;
      this.programasEducativos.nivel = this.getProgramasEducativosState.objProgramasEducativos.nivel;
      this.programasEducativos.direccion = this.getProgramasEducativosState.objProgramasEducativos.direccion;
      this.programasEducativos.nombre = this.getProgramasEducativosState.objProgramasEducativos.nombre;
      this.programasEducativos.telefono = this.getProgramasEducativosState.objProgramasEducativos.telefono;
      this.programasEducativos.email = this.getProgramasEducativosState.objProgramasEducativos.email;
      this.programasEducativos.noProfesores = this.getProgramasEducativosState.objProgramasEducativos.noProfesores;
      this.programasEducativos.noAlumnos = this.getProgramasEducativosState.objProgramasEducativos.noAlumnos;
      this.programasEducativos.noAulas = this.getProgramasEducativosState.objProgramasEducativos.noAulas;
      this.programasEducativos.restauranteEscolar = this.getProgramasEducativosState.objProgramasEducativos.restauranteEscolar;
      this.programasEducativos.unidadSanitaria = this.getProgramasEducativosState.objProgramasEducativos.unidadSanitaria;
      this.programasEducativos.biblioteca = this.getProgramasEducativosState.objProgramasEducativos.biblioteca;
      this.programasEducativos.auditorio = this.getProgramasEducativosState.objProgramasEducativos.auditorio;
      this.programasEducativos.estadoPlantaFisica = this.getProgramasEducativosState.objProgramasEducativos.estadoPlantaFisica;
      this.programasEducativos.areaConstruida = this.getProgramasEducativosState.objProgramasEducativos.areaConstruida;
      this.programasEducativos.areaTotal = this.getProgramasEducativosState.objProgramasEducativos.areaTotal;
      this.programasEducativos.disposicionExcreta = this.getProgramasEducativosState.objProgramasEducativos.disposicionExcreta;
      this.programasEducativos.servicioEnergia = this.getProgramasEducativosState.objProgramasEducativos.servicioEnergia;
      this.programasEducativos.servicioAcueducto = this.getProgramasEducativosState.objProgramasEducativos.servicioAcueducto;
    }

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      data.map(opt => {
        if(opt.categoria.codigo === 'EXCR'){
          this.disposicionExcretasOptions.push(opt)
        }else{
          this.tipoNivelInstitucionesEducativasOptions.push(opt)
        }
      })

    })

  },
  methods: {
    ...mapActions('programasEducativos', ['registrarProgramasEducativosAction', 'actualizarProgramasEducativosAction','unsetProgramasEducativosAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.programasEducativos,
        encuesta: {
          id: this.encuestaID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser
      }

      if(info.id > 0){
        //Actualizar
        info.usuarioCreacion = this.getProgramasEducativosState.objProgramasEducativos.usuarioCreacion
        this.actualizarProgramasEducativosAction(info).then(() => {
        })
      }else{
        //Guardar
        this.registrarProgramasEducativosAction(info).then( data => {
          this.programasEducativos.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('programasEducativos', ['getProgramasEducativosState']),
    ...mapGetters('auth', ['getUser']),
    mensajeBoton(){
      return this.programasEducativos.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetProgramasEducativosAction()
  }


}
</script>

<style>

</style>
