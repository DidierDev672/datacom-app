/* eslint-disable vue/no-parsing-error */
<template>
  <div>
      <q-markup-table bordered wrap-cells separator="vertical">
          <tr>
              <td colspan="3">
                <div  class="flex justify-end">                  
                  <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu cover auto-close>
                      <q-list>
                        <q-item clickable @click="eliminar">
                          <q-item-section>Eliminar este registro</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </td>
          </tr>
          <tr>
              <td colspan="3" style="text-align: center">                
                  MUNICIPIO DE {{ getMunicipioState.municipio.nombreMunicipio }}              
              </td>
          </tr>
          <tr>
              <td colspan="3" style="text-align: center">
                Población {{ registro.ano }} por rango de edad
                <q-popup-edit
                      v-model="registro.ano"
                      title="Editar año"
                      @save="save"                      
                      buttons>
                        <q-input hint="Editar año" type="number" v-model="registro.ano" dense autofocus />
                    </q-popup-edit>
                </td>              
          </tr>
          <tr>
              <td>Rango</td>
              <td>No.</td>
              <td>%</td>
          </tr>
          <tr>
              <td>Entre los 0 y 4 años</td>
              <td>
                  {{ registro.de0A4Anos }}
                    <q-popup-edit
                      v-model="registro.de0A4Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 0 y 4 años" type="number" v-model="registro.de0A4Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de0A4Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 5 y 9 años</td>
              <td>
                  {{ registro.de5A9Anos }}
                    <q-popup-edit
                      v-model="registro.de5A9Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 5 y 9 años" type="number" v-model="registro.de5A9Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de5A9Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 10 y 14 años</td>
              <td>
                  {{ registro.de10A14Anos }}
                    <q-popup-edit
                      v-model="registro.de10A14Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 10 y 14 años" type="number" v-model="registro.de10A14Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de10A14Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 15 y 19 años</td>
              <td>
                  {{ registro.de15A19Anos }}
                    <q-popup-edit
                      v-model="registro.de15A19Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 15 y 19 años" type="number" v-model="registro.de15A19Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de15A19Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 20 y 24 años</td>
              <td>
                  {{ registro.de20A24Anos }}
                    <q-popup-edit
                      v-model="registro.de20A24Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 20 y 24 años" type="number" v-model="registro.de20A24Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de20A24Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 25 y 29 años</td>
              <td>
                  {{ registro.de25A29Anos }}
                    <q-popup-edit
                      v-model="registro.de25A29Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 25 y 29 años" type="number" v-model="registro.de25A29Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de25A29Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 30 y 34 años</td>
              <td>
                  {{ registro.de30A34Anos }}
                    <q-popup-edit
                      v-model="registro.de30A34Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 30 y 34 años" type="number" v-model="registro.de30A34Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de30A34Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 35 y 39 años</td>
              <td>
                  {{ registro.de35A39Anos }}
                    <q-popup-edit
                      v-model="registro.de35A39Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 35 y 39 años" type="number" v-model="registro.de35A39Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de35A39Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 40 y 44 años</td>
              <td>
                  {{ registro.de40A44Anos }}
                    <q-popup-edit
                      v-model="registro.de40A44Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 40 y 44 años" type="number" v-model="registro.de40A44Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de40A44Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 45 y 49 años</td>
              <td>
                  {{ registro.de45A49Anos }}
                    <q-popup-edit
                      v-model="registro.de45A49Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 45 y 49 años" type="number" v-model="registro.de45A49Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de45A49Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 50 y 54 años</td>
              <td>
                  {{ registro.de50A54Anos }}
                    <q-popup-edit
                      v-model="registro.de50A54Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 50 y 54 años" type="number" v-model="registro.de50A54Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de50A54Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 55 y 59 años</td>
              <td>
                  {{ registro.de55A59Anos }}
                    <q-popup-edit
                      v-model="registro.de55A59Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 55 y 59 años" type="number" v-model="registro.de55A59Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de55A59Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 60 y 64 años</td>
              <td>
                  {{ registro.de60A64Anos }}
                    <q-popup-edit
                      v-model="registro.de60A64Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 60 y 64 años" type="number" v-model="registro.de60A64Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de60A64Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 65 y 69 años</td>
              <td>
                  {{ registro.de65A69Anos }}
                    <q-popup-edit
                      v-model="registro.de65A69Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 65 y 69 años" type="number" v-model="registro.de65A69Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de65A69Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 70 y 74 años</td>
              <td>
                  {{ registro.de70A74Anos }}
                    <q-popup-edit
                      v-model="registro.de70A74Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 70 y 74 años" type="number" v-model="registro.de70A74Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de70A74Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Entre los 75 y 79 años</td>
              <td>
                  {{ registro.de75A79Anos }}
                    <q-popup-edit
                      v-model="registro.de75A79Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="Entre los 75 y 79 años" type="number" v-model="registro.de75A79Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.de75A79Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>De 80 o más años</td>
              <td>
                  {{ registro.mayorA80Anos }}
                    <q-popup-edit
                      v-model="registro.mayorA80Anos"
                      title="Editar rango"
                      @save="save"                      
                      buttons>
                        <q-input hint="De 80 o más años" type="number" v-model="registro.mayorA80Anos" dense autofocus />
                    </q-popup-edit>
              </td>
              <td>{{ Math.round((registro.mayorA80Anos / (poblacionTotal <= 0 ? baseDivisión : poblacionTotal)) * 100) }}%</td>
          </tr>
          <tr>
              <td>Total</td>
              <td>{{ poblacionTotal }}</td>
              <td>{{ poblacionTotal <= 0 ? 0 : 100}}%</td>
          </tr>
      </q-markup-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    props: {
        poblacion: {
            required: true,
            type: Object
        }
    },
    data () {
        return {
            registro: {},
            baseDivisión: 1,
            porcentajeTotal: '0%'
        }
    },
    created (){
        this.registro = {
            ...this.poblacion
        }
    },
    methods: {
        ...mapActions('poblacion', ['actualizarPoblacionAction', 'eliminarPoblacionAction']),
        save(val, initialValue){
            this.actualizarPoblacionAction(this.registro);
        },
        eliminar(){
          this.$emit("eliminar", this.registro.id);
        }
    },
    computed: {
      ...mapGetters('municipios', ['getMunicipioState']),
        poblacionTotal () {
            return parseInt(this.registro.de0A4Anos)
            +parseInt(this.registro.de5A9Anos)
            +parseInt(this.registro.de10A14Anos)
            +parseInt(this.registro.de15A19Anos)
            +parseInt(this.registro.de20A24Anos)
            +parseInt(this.registro.de25A29Anos)
            +parseInt(this.registro.de30A34Anos)
            +parseInt(this.registro.de35A39Anos)
            +parseInt(this.registro.de40A44Anos)
            +parseInt(this.registro.de45A49Anos)
            +parseInt(this.registro.de50A54Anos)
            +parseInt(this.registro.de55A59Anos)
            +parseInt(this.registro.de60A64Anos)
            +parseInt(this.registro.de65A69Anos)
            +parseInt(this.registro.de70A74Anos)
            +parseInt(this.registro.de75A79Anos)
            +parseInt(this.registro.mayorA80Anos);
        },
        columnas () {
            return Object.keys(this.poblacion)
        }
    }

}
</script>

<style>

</style>