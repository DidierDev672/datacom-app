<template>
    <div>        
        <q-table
            title="Pruebas saber 11"
            :data="data"
            :columns="columns"
            row-key="municipio"
            flat
            bordered
            wrap-cells
            >
            <template v-slot:top>
                <div>Resultados pruebas saber 11.</div>
                <q-space />
                <q-select
                    v-model="departamento"
                    :options="departamentos"
                    option-value="id"
                    option-label="name"       
                    @input="changeOptions"
                    label="Departamento" />
            </template>
        </q-table>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {    
        departamento: null,
            departamentos: [],    
      columns: [
        { name: 'municipio', align: 'left', label: 'Municipio', field: 'municipio', sortable: true },
        { name: 'matematicas', align: 'left', label: 'Matemáticas', field: 'matematicas', sortable: true },
        { name: 'lectura', align: 'left', label: 'Lectura', field: 'lectura', sortable: true }  
      ],
      data: []
    }
  },
  created(){
      this.departamento = {
          id: 1,
          name: 'ANTIOQUIA'
        }     
        this.buscarListaDepartamentosAction().then(data => {
          this.departamentos = data
        })

        this.buscarMunicipioPruebasSaberAction(this.departamento.id).then(data => {
            this.data = data
        })
  },
  methods: {
      ...mapActions('buscar', ['buscarListaDepartamentosAction','buscarMunicipioPruebasSaberAction']),
      changeOptions(){
          this.buscarMunicipioPruebasSaberAction(this.departamento.id).then(data => {
                this.data = data
            })
        }      
  }
}
</script>