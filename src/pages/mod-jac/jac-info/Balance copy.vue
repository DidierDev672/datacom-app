<template>
<q-card
  flat
  bordered>

  <q-form ref="fiscalForm">    

  <q-card-section>

      <q-markup-table>
        <tbody>
            <tr>
                <td colspan="2" class="text-left">ACTIVOS CORRIENTES</td>
                <td colspan="2" class="text-left">PASIVOS CORRIENTES</td>
            </tr>
            <tr>
                <td class="text-left">Caja</td>
                <td class="text-right">
                    <q-input outlined dense v-model.number="jacInfoDB.caja" />
                </td>
                <td class="text-left">Obligaciones Bancarias</td>
                <td class="text-right">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.obligacionesBancarias" />
                </td>
            </tr>
            <tr>
                <td class="text-left">Bancos</td>
                <td class="text-right">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.bancos" />
                </td>
                <td class="text-left">Obligaciones tributarias</td>
                <td class="text-right">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.obligacionestributarias" />
                </td>
            </tr>
            <tr>
                <td class="text-left">Cuentas por cobrar</td>
                <td class="text-right">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.ctaCobrar" />
                </td>
                <td class="text-left">Otras cuentas por pagar</td>
                <td class="text-right">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.ctaPagar" />
                </td>
            </tr>
            <tr>
                <td class="text-left">Otros</td>
                <td class="text-right">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.otrosActivosCorrientes" />
                </td>
                <td class="text-left"></td>
                <td class="text-right"></td>
            </tr>
            <tr>
                <td class="text-left">TOTAL ACTIVOS CORRIENTES</td>
                <td class="text-right">{{ getActivosCorrientes }}</td>
                <td class="text-left">TOTAL PASIVOS CORRIENTES</td>
                <td class="text-right">{{ getPasivosCorrientes }}</td>
            </tr>
            <tr>
                <td colspan="2" class="text-left">ACTIVOS FIJOS</td>
                <td colspan="2" class="text-left"></td>
            </tr>
            <tr>
                <td class="text-left">Muebles y enseres</td>
                <td class="text-left">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.mueblesEnseres" />
                </td>
                <td colspan="2" class="text-left"></td>
            </tr>
            <tr>
                <td class="text-left">Construcciones</td>
                <td class="text-left">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.construcciones" />
                </td>
                <td colspan="2" class="text-left"></td>
            </tr>
            <tr>
                <td class="text-left">Terrenos</td>
                <td class="text-left">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.terrenos" />
                </td>
                <td colspan="2" class="text-left"></td>
            </tr>
            <tr>
                <td class="text-left">Otros</td>
                <td class="text-left">
                    <q-input
                      outlined
                      dense
                      v-model.number="jacInfoDB.otrosActivosFijos" />
                </td>
                <td colspan="2" class="text-left"></td>
            </tr>
            <tr>
                <td class="text-left">TOTAL ACTIVOS FIJOS</td>
                <td class="text-right">{{ getActivosFijos }}</td>
                <td class="text-left"></td>
                <td class="text-right"></td>
            </tr>
            <tr>
                <td class="text-left">TOTAL ACTIVOS</td>
                <td class="text-right">{{ getActivosFijos + getActivosCorrientes }}</td>
                <td class="text-left">TOTAL PASIVOS</td>
                <td class="text-right">{{ getPasivosCorrientes }}</td>
            </tr>
            <tr>
                <td class="text-left"></td>
                <td class="text-right"></td>
                <td class="text-left">TOTAL PATRIMONIO</td>
                <td class="text-right">{{ getPatrimonio }}</td>
            </tr>
        </tbody>
      </q-markup-table>
    
  </q-card-section>

   <q-separator />

  <q-card-actions align="right">
    <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
  </q-card-actions>

  </q-form>

</q-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {CATEGORIAS} from "src/utils/config";

export default {
  name: "JacInfo",
  data () {
    return {
      jacID: 0,
      jacInfoDB: {},
      options: [
        { label: 'Si', value: true },
        { label: 'No', value: false }
      ]
    }
  },
  created() {

    this.jacID = this.$route.params.id

    this.jacInfoDB = {
      id: this.$route.params.id,
      caja: 0,
      bancos: 0,
      ctaCobrar: 0,
      otrosActivosCorrientes: 0,
      mueblesEnseres: 0,
      construcciones: 0,
      terrenos: 0,
      otrosActivosFijos: 0,
      obligacionesBancarias: 0,
      obligacionestributarias: 0,
      ctaPagar: 0,
    }

    this.buscarJacInfoAction(this.jacID).then(data => {
      if(data.id > 0){
        this.jacInfoDB = {...data}
      }
    })

  },
  methods: {
    ...mapActions('jacInfo',['buscarJacInfoAction','registrarJacInfoAction']),  
    onSubmit () {

      this.$refs.fiscalForm.validate().then(success => {
        if (success) {
          this.registrarJacInfoAction(this.jacInfoDB).then(data => {
            this.$q.notify({
              message: 'Información actualizada correctamente',
              color: 'positive'
            })
          })
        }else{
          this.$q.notify({
            message: 'Favor completar los campos correctamente',
            color: 'red'
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters('jacInfo', ['getJacInfoState']),
    getActivosCorrientes(){
        return this.jacInfoDB.caja + 
            this.jacInfoDB.bancos + 
            this.jacInfoDB.ctaCobrar + 
            this.jacInfoDB.otrosActivosCorrientes
    },
    getActivosFijos(){
        return this.jacInfoDB.mueblesEnseres + 
            this.jacInfoDB.construcciones + 
            this.jacInfoDB.terrenos + 
            this.jacInfoDB.otrosActivosFijos
    },
    getPasivosCorrientes(){
        return this.jacInfoDB.obligacionesBancarias + 
            this.jacInfoDB.obligacionestributarias + 
            this.jacInfoDB.ctaPagar
    },
    getPatrimonio(){
        return (this.getActivosCorrientes + this.getActivosFijos) - this.getPasivosCorrientes
    }

  }
}
</script>

<style lang="sass">

</style>
