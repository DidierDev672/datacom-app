<template>
  <q-page class="q-pa-md">
    <q-table
      title="Categorias"
      :data="lstCategorias"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
    >
    <template v-slot:top>
      <div class="col-2 q-table__title">Categorias</div>
      <q-space />
      <q-btn icon="ti-plus" color="primary" label="Nuevo" :to="{name: 'nueva-categoria'}" />
    </template>

    <q-td slot="body-cell-estado" slot-scope="props" :props="props">
      <q-badge v-if="props.row.estado" color="green" label="Activo" />
      <q-badge v-else color="red" label="Inactivo" />
    </q-td>
    </q-table>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { openDB } from 'idb';
export default {
  name: 'PageCategorias',
  data () {
    return {
      lstCategorias: [],
      columns: [
        { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
        { name: 'descripcion', align: 'left', label: 'Categoria', field: 'descripcion', sortable: true },
        { name: 'fechaCreacion', label: 'Fecha', field: 'fechaCreacion', sortable: true },
        { name: 'estado', label: 'Estado', field: 'estado' },
        { name: 'usuarioCreacion', label: 'Usuario', field: 'usuarioCreacion' }
      ]
    }
  },
  created () {
    this.cargarListaCategoriasAction().then(data => {
      this.lstCategorias = data
      if (!navigator.onLine) {
        this.getOfflineCategorias()
      }
    })
  },
  methods: {
    ...mapActions('categoria', ['cargarListaCategoriasAction']),
    ...mapMutations('categoria', ['setCategoriaSuccess']),
    seleccionar (evt, row, index) {
      this.setCategoriaSuccess(row)
      this.$router.push({ name: 'categoria', params: { id: row.id } })
    },
    getOfflineCategorias () {
      let db = openDB('workbox-background-sync').then(db => {
        db.getAll('requests').then(failedRequests => {
          failedRequests.forEach(failedRequest => {
            console.log('failedRequest: ', failedRequest);
            if (failedRequest.queueName == 'createCategoryQueue') {
              let request = new Request(failedRequest.requestData.url, failedRequest.requestData)
              request.formData().then(formData => {
                console.log('formData: ', formData);
                // let offlineCategoria = {}
                // offlineCategoria.id = formData.get('id')
                // offlineCategoria.codigo = formData.get('caption')
                // offlineCategoria.descripcion = formData.get('location')
                // offlineCategoria.fechaCreacion = '2021-05-06'
                // offlineCategoria.estado = true
                // offlineCategoria.usuarioCreacion = 'arlumebe'
                // offlineCategoria.offline = true
                // console.log('offlineCategoria: ', offlineCategoria);

                // this.lstCategorias.unshift(offlineCategoria)
                
              })
            }
          })
        }).catch(error => {
          console.log('Error openDB: ', error);
        })
      })
    }
  },
  computed: {
    ...mapGetters('categoria', ['getCategoriaState']),
    categorias () {
      return this.getCategoriaState.lstCategorias
    }
  }
}
</script>
