<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Secretaría</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            ref="secretariasForm"
            class="q-gutter-md"
          >

          <p>Datos de la Secretaría</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="secretaria.idGabinete"
                :error-message="idGabineteErrors"
                :error="idGabineteErrors.length > 0"
                @change="$v.secretaria.idGabinete.$touch()"
                @blur="$v.secretaria.idGabinete.$touch()"
                :options="options"
                label="Seleccione la secretaría" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="secretaria.nombreContacto"
                :error-message="nombreContactoErrors"
                :error="nombreContactoErrors.length > 0"
                @input="$v.secretaria.nombreContacto.$touch()"
                @blur="$v.secretaria.nombreContacto.$touch()"
                label="Nombre del Contacto"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="secretaria.telefono"
                :error-message="telefonoErrors"
                :error="telefonoErrors.length > 0"
                @input="$v.secretaria.telefono.$touch()"
                @blur="$v.secretaria.telefono.$touch()"
                label="Teléfono"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                type="email"
                v-model="secretaria.correo"
                :error-message="correoErrors"
                :error="correoErrors.length > 0"
                @input="$v.secretaria.correo.$touch()"
                @blur="$v.secretaria.correo.$touch()"
                label="Email"
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
            :disable="getSecretariaState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getSecretariaState.loading"
            :disable="getSecretariaState.loading || formValid"
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
      email: '',
      show: true,
      secretaria: {},
      encuestaID: 0,
      options: [],
    }
  },
  created(){
    let categorias = [CATEGORIAS.SECRETARIAS_DE_GOBIERNO]
    this.encuestaID = this.$route.params.id
    this.secretaria = {
      id: 0,
      nombreContacto: '',
      telefono:'',
      correo:'',
      idGabinete: ''
    }
    if(Object.keys(this.getSecretariaState.objSecretaria).length > 0){
      this.secretaria.id = this.getSecretariaState.objSecretaria.id;
      this.secretaria.nombreContacto = this.getSecretariaState.objSecretaria.nombreContacto;
      this.secretaria.telefono = this.getSecretariaState.objSecretaria.telefono;
      this.secretaria.correo = this.getSecretariaState.objSecretaria.correo;
      this.secretaria.idGabinete = this.getSecretariaState.objSecretaria.idGabinete;
    }
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
        this.options = data
    })

  },
  validations: {
    secretaria: {
      correo: {
        required,
        email
      },
      telefono: {
        required,
        minLength: minLength(5),
      },
      idGabinete: {
        required
      },
      nombreContacto: {
        required,
        minLength: minLength(5),
      }
    }
  },
  methods: {
    ...mapActions('secretarias', ['registrarSecretariaAction', 'actualizarSecretariaAction','unsetSecretariaAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      if(!this.$v.secretaria.$invalid){

        let info = {
          ...this.secretaria,
          encuesta: {
            id: this.encuestaID
          }
        }
        if(info.id > 0){
          //Actualizar
          this.actualizarSecretariaAction(info).then(() => {
            this.$q.notify({
                message: 'Registro actualizado',
                color: 'positive'
            })
          })
        }else{
          //Guardar
          this.registrarSecretariaAction(info).then( data => {
            this.secretaria.id = data
            this.$q.notify({
                message: 'Registro guardado',
                color: 'positive'
            })
          })
        }

      }else{
        this.$q.notify({
            message: 'Existen campos obligatorios pendientes por diligenciar',
            color: 'red'
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('secretarias', ['getSecretariaState']),
    mensajeBoton(){
      return this.secretaria.id > 0 ? 'Actualizar' : 'Guardar'
    },
    telefonoErrors(){
      let msgError = ''
        if (!this.$v.secretaria.telefono.$dirty) return msgError
        if (!this.$v.secretaria.telefono.minLength) msgError = 'Ingrese almenos 5 caracteres'
        if (!this.$v.secretaria.telefono.required) msgError = 'Debe ingresar un numero telefónico válido'
        return msgError
    },
    correoErrors(){
      let msgError = ''
      if (!this.$v.secretaria.correo.$dirty) return msgError
      if (!this.$v.secretaria.correo.email) msgError = 'Debe ser un email válido'
      if (!this.$v.secretaria.correo.required) msgError = 'Este campo es requerido'
      return msgError
    },
    nombreContactoErrors(){
      let msgError = ''
      if (!this.$v.secretaria.nombreContacto.$dirty) return msgError
      if (!this.$v.secretaria.nombreContacto.minLength) msgError = 'Ingrese almenos 5 caracteres'
      if (!this.$v.secretaria.nombreContacto.required) msgError = 'Este campo es requerido'
      return msgError
    },
    idGabineteErrors(){
      let msgError = ''
      if (!this.$v.secretaria.idGabinete.$dirty) return msgError
      if (!this.$v.secretaria.idGabinete.required) msgError = 'Este campo es requerido'
      return msgError
    },
    formValid(){
      return this.$v.secretaria.$invalid
    }
  },
  beforeDestroy(){
    this.unsetSecretariaAction()
  }


}
</script>

<style>

</style>
