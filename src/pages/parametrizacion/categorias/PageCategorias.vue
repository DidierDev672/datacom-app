<template>
  <q-page class="q-pa-md">
    <q-table
      title="Categorias"
      :data="lstCategorias"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
    >
    <!-- <template v-slot:top>
      <div class="col-2 q-table__title">Categorias</div>
      <q-space />
      <q-btn icon="ti-plus" color="primary" label="Nuevo" :to="{name: 'nueva-categoria'}" />
    </template> -->

    <q-td slot="body-cell-descripcion" slot-scope="props" :props="props">
      {{ props.row.descripcion }}
      <q-badge v-if="props.row.offline" color="orange" label="OffLine" />
    </q-td>

    <q-td slot="body-cell-estado" slot-scope="props" :props="props">
      <q-badge v-if="props.row.estado" color="green" label="Activo" />
      <q-badge v-else color="red" label="Inactivo" />
    </q-td>

    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{name: 'nueva-categoria'}" >
        <q-tooltip>
          Agregar categoria
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
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
  activated () {
    this.cargarListaCategoriasAction().then(data => {
      this.lstCategorias = [ ...data ]
      if (!navigator.onLine) {
        this.getOfflineCategorias()
      }
    })
  },
  created () {
    this.listenForOfflineCategoriasUploaded()
  },
  methods: {
    ...mapActions('categoria', ['cargarListaCategoriasAction']),
    ...mapMutations('categoria', ['setCategoriaSuccess']),
    seleccionar (evt, row, index) {
      this.setCategoriaSuccess(row)
      this.$router.push({ name: 'categoria', params: { id: row.id } })
    },
    getOfflineCategorias() {
      let db = openDB('workbox-background-sync').then(db => {
        db.getAll('requests').then(failedRequests => {
          failedRequests.forEach(failedRequest => {
            if (failedRequest.queueName == 'createCategoryQueue') {
              let request = new Request(failedRequest.requestData.url, failedRequest.requestData)              
              request.json().then(categoria => {
                let offlineCategoria = {
                  ...categoria,
                  fechaCreacion: '2021-05-06',
                  usuarioCreacion: 'arlumebe',
                  offline: true
                }
                this.lstCategorias.unshift(offlineCategoria)                
              })
            }else{
              console.log('No es createCategoryQueue')
            }
          })
        }).catch(error => {
          console.log('Error openDB: ', error);
        })
      })
    },
    listenForOfflineCategoriasUploaded() {
      if (this.serviceWorkerSupported) {
        const channel = new BroadcastChannel('sw-messages');
        channel.addEventListener('message', event => {
          // console.log('Received', event.data);
          if (event.data.msg == 'offline-categoria-uploaded') {
            let offlineCategoriaCount = this.lstCategorias.filter(categoria => categoria.offline == true).length
            this.lstCategorias[offlineCategoriaCount - 1].offline = false
            this.$q.notify({
                message: 'La Categoria se sincronizó correctamente.',
                icon: 'ti-check',
                textColor: 'white',
                color: 'positive',
                position: 'bottom-right'
              })
          }
        });
      }
    }
  },
  computed: {
    ...mapGetters('categoria', ['getCategoriaState']),
    categorias () {
      return this.getCategoriaState.lstCategorias
    },
    serviceWorkerSupported() {
      if ('serviceWorker' in navigator) return true
      return false
    }
  }
}
</script>
<style lang="sass">
.categoria-creada-offline 
  tbody tr    
    background-color: #c1f4cd
</style>
