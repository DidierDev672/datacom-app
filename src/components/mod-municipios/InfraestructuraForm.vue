<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Infraestructura Pública</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

          <p>Datos de la Infraestructura</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="infraestructura.tipoInfraestructura"
                :options="options"
                :error-message="tipoInfraestructuraErrors"
                :error="tipoInfraestructuraErrors.length > 0"
                @input="$v.infraestructura.tipoInfraestructura.$touch()"
                @blur="$v.infraestructura.tipoInfraestructura.$touch()"
                label="Seleccione el tipo de infraestructura" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.contacto"
                :error-message="contactoErrors"
                :error="contactoErrors.length > 0"
                @input="$v.infraestructura.contacto.$touch()"
                @blur="$v.infraestructura.contacto.$touch()"
                label="Persona de Contacto"
              />
            </div>
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.telefono"
                :error-message="telefonoErrors"
                :error="telefonoErrors.length > 0"
                @input="$v.infraestructura.telefono.$touch()"
                @blur="$v.infraestructura.telefono.$touch()"
                label="Teléfono"
              />
            </div>
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.correo"
                :error-message="correoErrors"
                :error="correoErrors.length > 0"
                @input="$v.infraestructura.correo.$touch()"
                @blur="$v.infraestructura.correo.$touch()"
                label="Email"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.direccion"
                :error-message="direccionErrors"
                :error="direccionErrors.length > 0"
                @input="$v.infraestructura.direccion.$touch()"
                @blur="$v.infraestructura.direccion.$touch()"
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
            :disable="getInfraestructuraState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getInfraestructuraState.loading"
            :disable="getInfraestructuraState.loading || formValid"
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
export default {
  data(){
    return {
      show: true,
      infraestructura: {},
      encuestaID: 0,
      options: [],
    }
  },
  created(){
    let categorias = [CATEGORIAS.INFRAESTRUCTURA_PUBLICA]
    this.encuestaID = this.$route.params.id
    this.infraestructura = {
      id: 0,
      correo:'',
      telefono:'',
      contacto:'',
      direccion: '',
      tipoInfraestructura: ''
    }
    if(Object.keys(this.getInfraestructuraState.objInfraestructura).length > 0){
      this.infraestructura.id = this.getInfraestructuraState.objInfraestructura.id;
      this.infraestructura.telefono = this.getInfraestructuraState.objInfraestructura.telefono;
      this.infraestructura.correo = this.getInfraestructuraState.objInfraestructura.correo;
      this.infraestructura.tipoInfraestructura = this.getInfraestructuraState.objInfraestructura.tipoInfraestructura;
      this.infraestructura.contacto = this.getInfraestructuraState.objInfraestructura.contacto;
      this.infraestructura.direccion = this.getInfraestructuraState.objInfraestructura.direccion;
    }
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
        this.options = data
    })

  },
  methods: {
    ...mapActions('infraestructura', ['registrarInfraestructuraAction', 'actualizarInfraestructuraAction','unsetInfraestructuraAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.infraestructura,
        encuesta: {
          id: this.encuestaID
        }
      }

      if(info.id > 0){
        //Actualizar
        this.actualizarInfraestructuraAction(info).then(() => {
          this.$q.notify({
              message: 'Registro actualizado',
              color: 'positive'
          })
        })
      }else{
        //Guardar
        this.registrarInfraestructuraAction(info).then( data => {
          this.infraestructura.id = data
          this.$q.notify({
              message: 'Registro actualizado',
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
    infraestructura: {
      correo: {
        required,
        email
      },
      telefono: {
        required,
        Number,
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
      tipoInfraestructura: {
        required
      }
    }
  },
  computed: {
    ...mapGetters('infraestructura', ['getInfraestructuraState']),
    mensajeBoton(){
      return this.infraestructura.id > 0 ? 'Actualizar' : 'Guardar'
    },
    correoErrors(){
      let msgError = ''
      if (!this.$v.infraestructura.correo.$dirty) return msgError
      if (!this.$v.infraestructura.correo.email) msgError = 'Debe ser un email válido'
      if (!this.$v.infraestructura.correo.required) msgError = 'Este campo es requerido'
      return msgError
    },
    telefonoErrors(){
      let msgError = ''
        if (!this.$v.infraestructura.telefono.$dirty) return msgError
        if (!this.$v.infraestructura.telefono.Number) msgError = 'Debe ingresar solo numeros'
        if (!this.$v.infraestructura.telefono.minLength) msgError = 'Ingrese almenos 5 caracteres'
        if (!this.$v.infraestructura.telefono.required) msgError = 'Debe ingresar un numero telefónico válido'
        return msgError
    },
    contactoErrors(){
      let msgError = ''
      if (!this.$v.infraestructura.contacto.$dirty) return msgError
      if (!this.$v.infraestructura.contacto.minLength) msgError = 'Ingrese almenos 5 caracteres'
      if (!this.$v.infraestructura.contacto.required) msgError = 'Este campo es requerido'
      return msgError
    },
    direccionErrors(){
      let msgError = ''
      if (!this.$v.infraestructura.direccion.$dirty) return msgError
      if (!this.$v.infraestructura.direccion.minLength) msgError = 'Ingrese almenos 5 caracteres'
      if (!this.$v.infraestructura.direccion.required) msgError = 'Este campo es requerido'
      return msgError
    },
    tipoInfraestructuraErrors(){
      let msgError = ''
        if (!this.$v.infraestructura.tipoInfraestructura.$dirty) return msgError
        if (!this.$v.infraestructura.tipoInfraestructura.required) msgError = 'Este campo es requerido'
        return msgError
    },
    formValid(){
      return this.$v.infraestructura.$invalid
    }
  },
  beforeDestroy(){
    this.unsetInfraestructuraAction()
  }


}
</script>

<style>

</style>
