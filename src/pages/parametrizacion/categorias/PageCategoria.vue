<template>
  <q-page class="q-pa-md">
    <h6 class="q-mt-md">Formulario categoria</h6>
    <q-form
      @submit="onSubmit"
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

      <q-toggle v-model="objCategoria.active" label="Activo?" />

      <div class="flex justify-end">
        <q-btn :to="{name: 'categorias'}" label="Cancelar" flat class="q-mr-sm" />
        <q-btn
          label="Guardar"
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
import { mapGetters } from 'vuex'
export default {
  name: 'PageCategoria',
  data () {
    return {
      accept: true,
      age: 38,
      objCategoria: {}
    }
  },
  mounted () {
    this.objCategoria = {
      ...this.getCategoriaPorId(this.$route.params.id)
    }
  },
  methods: {
    onSubmit () {
      console.log(this.objCategoria)
    }
  },
  computed: {
    ...mapGetters('categoria', ['getCategoriaState', 'getCategoriaPorId'])
  }
}
</script>
