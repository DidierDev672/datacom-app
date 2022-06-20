<template>
    <div>
        <q-table
        title="Políticas de los municipios"
        :data="data"
        :columns="columns"
        row-key="name"
        flat
        bordered
        wrap-cells
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {        
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true
        },
        { name: 'municipio', align: 'left', label: 'Municipio', field: 'municipio', sortable: true },
        { name: 'nombre', align: 'left', label: 'Política', field: 'nombre', sortable: true },
        { name: 'anio', align: 'left', label: 'Año', field: 'anio', sortable: true },             
        
      ],

      data: []
    }
  },
  created(){
      this.buscarPoliticasMunicipiosAction().then(data => {
          this.data = data
      })
  },
  methods: {
      ...mapActions('buscar', ['buscarPoliticasMunicipiosAction']),      
  }
}
</script>

<style lang="sass">

</style>