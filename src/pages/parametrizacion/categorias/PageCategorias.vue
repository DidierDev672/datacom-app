<template>
  <q-page class="q-pa-md">
    <q-table
      title="Categorias"
      :data="lstCategorias"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
    >
    <q-td slot="body-cell-active" slot-scope="props" :props="props">
      <q-badge v-if="props.row.estado" color="green" label="Activo" />
      <q-badge v-else color="red" label="Inactivo" />
    </q-td>
    </q-table>
  </q-page>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'PageCategorias',
  data () {
    return {
      lstCategorias: [],
      columns: [
        {
          name: 'id',
          required: true,
          label: '#',
          align: 'left',
          field: row => row.id,
          sortable: true
        },
        { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
        { name: 'descripcion', align: 'left', label: 'Categoria', field: 'descripcion', sortable: true },
        { name: 'fechaCreacion', label: 'Fecha', field: 'fechaCreacion', sortable: true },
        { name: 'estado', label: 'Estado', field: 'estado' },
        { name: 'usuarioCreacion', label: 'Usuario', field: 'usuarioCreacion' }
      ]
    }
  },
  mounted () {
    this.cargarListaCategoriasAction().then(data => {
      this.lstCategorias = data
    })
  },
  methods: {
    ...mapActions('categoria', ['cargarListaCategoriasAction']),
    ...mapMutations('categoria', ['setCategoriaSuccess']),
    seleccionar (evt, row, index) {
      this.setCategoriaSuccess(row)
      this.$router.push({ name: 'categoria', params: { id: row.id } })
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
