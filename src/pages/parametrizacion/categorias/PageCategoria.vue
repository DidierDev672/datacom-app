<template>
  <q-page class="q-pa-md">
    <h6 class="q-mt-md">Formulario categoria</h6>
    <q-form
      @submit="onSubmit"
      ref="categoriaForm"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="objCategoria.codigo"
        label="Código *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor ingrese un código']"
      />

      <q-input
        filled
        v-model="objCategoria.descripcion"
        label="Categoria *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Por favor ingrese una descripción']"
      />

      <q-toggle v-model="objCategoria.estado" label="Activo?" />

      <div class="flex justify-end">
        <q-btn :to="{name: 'categorias'}" label="Cancelar" flat class="q-mr-sm" />
        <q-btn
          :label="mensajeBoton"
          type="submit"
          color="primary"
          :loading="getCategoriaState.loading"
          outline >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
          </q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
  name: 'PageCategoria',
  data () {
    return {
      accept: true,
      age: 38,
      objCategoria: {},
      mensajeBoton: 'Guardar'
    }
  },
  created () {
    if (this.$route.params.id != null) {
      this.objCategoria = {
        ...this.getCategoriaPorId(this.$route.params.id)
      }
      this.mensajeBoton = 'Actualizar'
    } else {
      this.objCategoria = {
        codigo: '',
        descripcion: '',
        estado: true
      }
    }
  },
  methods: {
    ...mapActions('categoria', ['registrarCategoriaAction', 'actualizarCategoriaAction']),
    onSubmit () {
      if (this.objCategoria.id > 0) {
        console.log('Ingresa al if')
        this.actualizarCategoriaAction(this.objCategoria).then(data => {
          this.$q.notify({
            message: 'Registro actualizado correctamente.',
            icon: 'ti-check',
            textColor: 'white',
            color: 'positive',
            position: 'bottom-right'
          })
        })
      } else {
        // let URL_API = 'http://localhost:28181'
        // axios.post(`${URL_API}/categoria/`, this.objCategoria)
        //   .then(response => {
        //     console.log('Response: ', response)
        //   })
        //   .catch(error => {
        //     console.log('Error: ', error)
        //   })
        console.log('Ingresa al else')
        this.registrarCategoriaAction(this.objCategoria)
          .then(data => {
            this.$q.notify({
              message: 'Registro agregado correctamente.',
              icon: 'ti-check',
              textColor: 'white',
              color: 'positive',
              position: 'bottom-right'
            })
            this.$router.push({ name: 'categorias' })
          })
          .catch(error => {
            if (!navigator.onLine && this.backgroundSyncSupported) {
              //redirigir al listado de categorias
              this.$q.notify('Categoria registrada offLine')
              this.$router.push({name: 'categorias'})
            }
            else {
              this.$q.dialog({
                title: 'Alert',
                message: 'Ha ocurrido un error al grabar el registro: ' + error
              })
            }
          })
      }
    }
  },
  computed: {
    ...mapGetters('categoria', ['getCategoriaState', 'getCategoriaPorId']),
    categoriaFormValid () {
      return this.$refs.categoriaForm.validate()
    },
    backgroundSyncSupported () {
      if('serviceWorker' in navigator && 'SyncManager' in window) return true
      return false
    }
  }
}
</script>
