<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Organización</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

          <p>Datos de la Organización</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="organizacion.idOrganizacion"
                :error-message="idOrganizacionErrors"
                :error="idOrganizacionErrors.length > 0"
                @input="$v.organizacion.idOrganizacion.$touch()"
                @blur="$v.organizacion.idOrganizacion.$touch()"
                :options="options"
                label="Seleccione el tipo de organización" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.nombre"
                :error-message="nombreErrors"
                :error="nombreErrors.length > 0"
                @input="$v.organizacion.nombre.$touch()"
                @blur="$v.organizacion.nombre.$touch()"
                label="Nombre de la organización"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                type="textarea"
                v-model="organizacion.tipoActividad"
                :error-message="tipoActividadErrors"
                :error="tipoActividadErrors.length > 0"
                @input="$v.organizacion.tipoActividad.$touch()"
                @blur="$v.organizacion.tipoActividad.$touch()"
                label="Tipo de Actividad"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.contacto"
                :error-message="contactoErrors"
                :error="contactoErrors.length > 0"
                @input="$v.organizacion.contacto.$touch()"
                @blur="$v.organizacion.contacto.$touch()"
                label="Persona de Contacto"
              />
            </div>
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.telefono"
                :error-message="telefonoErrors"
                :error="telefonoErrors.length > 0"
                @input="$v.organizacion.telefono.$touch()"
                @blur="$v.organizacion.telefono.$touch()"
                label="Teléfono"
              />
            </div>
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.correo"
                :error-message="correoErrors"
                :error="correoErrors.length > 0"
                @input="$v.organizacion.correo.$touch()"
                @blur="$v.organizacion.correo.$touch()"
                label="Email"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.direccion"
                :error-message="direccionErrors"
                :error="direccionErrors.length > 0"
                @input="$v.organizacion.direccion.$touch()"
                @blur="$v.organizacion.direccion.$touch()"
                label="Dirección"
              />
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
            :disable="getOrganizacionState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getOrganizacionState.loading"
            :disable="getOrganizacionState.loading || formValid"
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
import { email, required, minLength } from 'vuelidate/lib/validators'
import {getOrganizacionState} from "src/store/module-municipios/organizaciones/getters";
export default {
  data(){
    return {
      show: true,
      organizacion: {},
      encuestaID: 0,
      options: [],
    }
  },
  created(){
    let categorias = [CATEGORIAS.ORGANIZACIONES_DE_LA_COMUNIDAD]
    this.encuestaID = this.$route.params.id
    this.organizacion = {
      id: 0,
      telefono:'',
      correo:'',
      nombre:'',
      tipoActividad:'',
      contacto:'',
      direccion: '',
      idOrganizacion: ''
    }
    if(Object.keys(this.getOrganizacionState.objOrganizacion).length > 0){
      this.organizacion.id = this.getOrganizacionState.objOrganizacion.id;
      this.organizacion.telefono = this.getOrganizacionState.objOrganizacion.telefono;
      this.organizacion.correo = this.getOrganizacionState.objOrganizacion.correo;
      this.organizacion.nombre = this.getOrganizacionState.objOrganizacion.nombre;
      this.organizacion.tipoActividad = this.getOrganizacionState.objOrganizacion.tipoActividad;
      this.organizacion.contacto = this.getOrganizacionState.objOrganizacion.contacto;
      this.organizacion.direccion = this.getOrganizacionState.objOrganizacion.direccion;
      this.organizacion.idOrganizacion = this.getOrganizacionState.objOrganizacion.idOrganizacion;
    }

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
        this.options = data
    })

  },
  methods: {
    ...mapActions('organizacion', ['registrarOrganizacionAction', 'actualizarOrganizacionAction','unsetOrganizacionAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.organizacion,
        encuesta: {
          id: this.encuestaID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser
      }

      if(info.id > 0){
        //Actualizar
        console.log(info)
        console.log( this.getOrganizacionState.objOrganizacion)
        info.usuarioCreacion = this.getOrganizacionState.objOrganizacion.usuarioCreacion
        this.actualizarOrganizacionAction(info).then(() => {
          this.$q.notify({
                message: 'Registro actualizado',
                color: 'positive'
            })
        })
      }else{
        //Guardar
        this.registrarOrganizacionAction(info).then( data => {
          this.organizacion.id = data
          this.$q.notify({
                message: 'Registro guardado',
                color: 'positive'
            })
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  validations: {
    organizacion: {
      correo: {
        required,
        email
      },
      telefono: {
        required,
        Number,
        minLength: minLength(5),
      },
      tipoActividad: {
        required
      },
      nombre: {
        required,
        minLength: minLength(5),
      },
      contacto: {
        required,
        minLength: minLength(5),
      },
      direccion: {
        required,
        minLength: minLength(5),
      },
      idOrganizacion: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('organizacion', ['getOrganizacionState']),
    ...mapGetters('auth', ['getUser']),
    mensajeBoton(){
      return this.organizacion.id > 0 ? 'Actualizar' : 'Guardar'
    },
    correoErrors(){
      let msgError = ''
      if (!this.$v.organizacion.correo.$dirty) return msgError
      if (!this.$v.organizacion.correo.email) msgError = 'Debe ser un email válido'
      if (!this.$v.organizacion.correo.required) msgError = 'Este campo es requerido'
      return msgError
    },
    telefonoErrors(){
      let msgError = ''
        if (!this.$v.organizacion.telefono.$dirty) return msgError
        if (!this.$v.organizacion.telefono.Number) msgError = 'Debe ingresar solo numeros'
        if (!this.$v.organizacion.telefono.minLength) msgError = 'Ingrese almenos 5 caracteres'
        if (!this.$v.organizacion.telefono.required) msgError = 'Este campo es requerido'
        return msgError
    },
    tipoActividadErrors(){
      let msgError = ''
        if (!this.$v.organizacion.tipoActividad.$dirty) return msgError
        if (!this.$v.organizacion.tipoActividad.required) msgError = 'Este campo es requerido'
        return msgError
    },
    nombreErrors(){
      let msgError = ''
      if (!this.$v.organizacion.nombre.$dirty) return msgError
      if (!this.$v.organizacion.nombre.minLength) msgError = 'Ingrese almenos 5 caracteres'
      if (!this.$v.organizacion.nombre.required) msgError = 'Este campo es requerido'
      return msgError
    },
    contactoErrors(){
      let msgError = ''
      if (!this.$v.organizacion.contacto.$dirty) return msgError
      if (!this.$v.organizacion.contacto.minLength) msgError = 'Ingrese almenos 5 caracteres'
      if (!this.$v.organizacion.contacto.required) msgError = 'Este campo es requerido'
      return msgError
    },
    direccionErrors(){
      let msgError = ''
      if (!this.$v.organizacion.direccion.$dirty) return msgError
      if (!this.$v.organizacion.direccion.minLength) msgError = 'Ingrese almenos 5 caracteres'
      if (!this.$v.organizacion.direccion.required) msgError = 'Este campo es requerido'
      return msgError
    },
    idOrganizacionErrors(){
      let msgError = ''
      if (!this.$v.organizacion.idOrganizacion.$dirty) return msgError
      if (!this.$v.organizacion.idOrganizacion.required) msgError = 'Este campo es requerido'
      return msgError
    },
    formValid(){
      return this.$v.organizacion.$invalid
    }
  },
  beforeDestroy(){
    this.unsetOrganizacionAction()
  }


}
</script>

<style>

</style>
