<template>
  <div>
    <div class="text-h6 page-title-box" >Municipios</div> 
    <div class="q-ma-md">

      <q-card class="my-card q-mb-md" flat bordered>
        <q-card-section horizontal>
          <q-card-section class="col">
            <div class="row">
              <div class="col">
                <div class="text-h6">Departamentos</div>
              </div>
              <div class="col-auto">
                <q-icon name="ti-world" />
              </div>
            </div>
            <div class="text-h4">6</div>
            
          </q-card-section>

          <q-separator vertical />

          <q-card-section class="col">
            <div class="row">
              <div class="col">
                <div class="text-h6">Municipios</div>
              </div>
              <div class="col-auto">
                <q-icon name="ti-location-pin" />
              </div>
            </div>
            <div class="text-h4">48</div>
          </q-card-section>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="my-card q-mb-md">
        <q-card-section>
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">Tablero</div>
              <div class="text-subtitle2">Información de todos los municipios</div>
            </div>
          <q-separator />

            <div class="col-auto">
              <q-btn color="grey-7" round flat icon="more_vert">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable>
                      <q-item-section>Remove Card</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Send Feedback</q-item-section>
                    </q-item>
                    <q-item clickable>
                      <q-item-section>Share</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <!-- Tabla principal de municipios -->
          <municipios-table></municipios-table>
          <!-- Tabla principal de municipios -->              
        </q-card-section>     
      </q-card>

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col">
          <q-card flat bordered class="my-card">
            <q-card-section>
              <municipios-cobertura-educacion-chart></municipios-cobertura-educacion-chart>    
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat bordered class="my-card">
            <q-card-section>
                 <pruebas-saber-table></pruebas-saber-table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-card class="q-mb-md">
        <q-card-section>
          <municipio-deficit-vivienda></municipio-deficit-vivienda>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col">
          <q-card flat bordered class="my-card">
            <q-card-section>
                  <municipio-politicas-table></municipio-politicas-table>
            </q-card-section>
          </q-card>
        </div>
        <div class="col">
          <q-card flat bordered class="my-card">
            <q-card-section>
                 <municipio-indicadores-finanzas></municipio-indicadores-finanzas>
            </q-card-section>
          </q-card>
        </div>
      </div>     
      
    </div>  
    
    
  </div>
</template>

<script>
import MunicipioDeficitVivienda from 'components/widgets/MunicipioDeficitVivienda.vue'
import MunicipioIndicadoresFinanzas from 'components/widgets/MunicipioIndicadoresFinanzas.vue'
import MunicipioPoliticasTable from 'components/widgets/MunicipioPoliticasTable.vue'
import MunicipiosCoberturaEducacionChart from './components/MunicipiosCoberturaEducacionChart.vue'
import MunicipiosTable from './components/MunicipiosTable.vue'
import PruebasSaberTable from './components/PruebasSaberTable.vue'
  export default {

    components: {MunicipiosCoberturaEducacionChart, MunicipiosTable, 
    PruebasSaberTable, MunicipioDeficitVivienda, MunicipioIndicadoresFinanzas, MunicipioPoliticasTable}

  }
</script>

<style lang="sass" scoped>

.q-separator 
  background: #ccc

  

</style>
