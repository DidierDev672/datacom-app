<template>
<q-card
  flat
  bordered>

  <q-form ref="fiscalForm">    

  <q-card-section>

    <q-list class="report-list">

      <q-item>
        <q-item-section>
          <q-item-label>Nivel administrativo y financiero</q-item-label>
        </q-item-section>
      </q-item>
      

    <q-item>

      <q-item-section>
        <q-item-label>¿Estatutos vigentes?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.estatutosVigentes" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.estatutosVigentes">

      <q-item-section class="col-xs-12 col-sm-3 ">
        <q-item-label>Fecha de actualización</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.fechaActualizacionEstatutos" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaActualizacionEstatutos">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>      

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tiene reglamento interno?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.reglamentoInterno" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.reglamentoInterno" >

      <q-item-section class="col-xs-12 col-sm-3 ">
        <q-item-label>Fecha de actualización</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.fechaActualizacionReglamento" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaActualizacionReglamento">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>      

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Llevan libro de actas?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.libroActas" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.libroActas">

      <q-item-section class="col-xs-12 col-sm-3 ">
        <q-item-label>Fecha del Último registro</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.fechaUltimoRegistro" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaUltimoRegistro">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>      

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Llevan libro de afiliados?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.librosAfiliados" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.libroAfiliados">

      <q-item-section class="col-xs-12 col-sm-3 ">
        <q-item-label>Fecha de actualización</q-item-label>
        <q-item-label caption>
          <q-input outlined v-model="jacInfoDB.fechaActualizacionAfiliados" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="jacInfoDB.fechaActualizacionAfiliados">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-item-label>
      </q-item-section>      

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Llevan libro de registros financieros?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.libroRegistrosFinancieros" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.libroRegistrosFinancieros">

        <q-item-section>
            <q-item-label>¿Los registros están actualizados?</q-item-label>
            <q-item-label caption>
            <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.registrosActualizados" />
            </q-item-label>
        </q-item-section>           

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Llevan libro de registros de inventarios?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.libroInventario" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.libroInventario">

        <q-item-section>
            <q-item-label>¿El inventario está actualizado?</q-item-label>
            <q-item-label caption>
            <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.inventarioActualizados" />
            </q-item-label>
        </q-item-section>           

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Manejan caja menor?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.cajaMenor" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.cajaMenor">

        <q-item-section class="col-xs-12 col-sm-3">
            <q-item-label>Monto aprobado</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.montoAprobado" />
            </q-item-label>
        </q-item-section>           

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tienen cuenta bancaria?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.cuentaBancaria" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.cuentaBancaria">

        <q-item-section class="col-xs-12 col-sm-3">
            <q-item-label>Tipo</q-item-label>
            <q-item-label caption>
            <q-select
                :options="tipoCuentaOptions"
                outlined
                v-model="jacInfoDB.tipoCuentaBancaria" />
            </q-item-label>
        </q-item-section>           

        <q-item-section class="col-xs-12 col-sm-5">
            <q-item-label>No. Cuenta Bancaria</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.numeroCuentaBancaria" />
            </q-item-label>
        </q-item-section>           

        <q-item-section class="col-xs-12 col-sm-3">
            <q-item-label>Entidad / Banco</q-item-label>
            <q-item-label caption>
            <q-select
                outlined
                ref="comunidad"
                v-model="jacInfoDB.entidadCuentaBancaria"
                option-label="nombre"
                option-value="id"
                :options="bancosOptions"
                lazy-rules
                :rules="[ val => val != null && val.id > 0 || 'Debe elegir una comunidad']" />
            </q-item-label>
        </q-item-section>           

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tienen resolución de facturación?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.resolucionFacturacion" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.resolucionFacturacion">
        <q-item-section class="col-xs-12 col-sm-5">
            <q-item-label>Rango de facturación</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.numeroCuentaBancaria" />
            </q-item-label>
        </q-item-section>   
    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Manejan factura electrónica?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.facturaElectronica" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Realizan balances contables?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.balanceContable" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Cuentan con capital de trabajo?</q-item-label>
        <q-item-label caption>
          <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.capitalTrabajo" />
        </q-item-label>
      </q-item-section>    

    </q-item>

    <q-item v-if="jacInfoDB.capitalTrabajo">
        <q-item-section class="col-xs-12 col-sm-5">
            <q-item-label>Monto</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.montoCapitalTrabajo" />
            </q-item-label>
        </q-item-section>   
    </q-item>


    </q-list>
    
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
      ],
      tipoCuentaOptions: ['Ahorro', 'Corriente'],
      bancosOptions: []
    }
  },
  created() {

    this.jacID = this.$route.params.id

    this.jacInfoDB = {
      id: this.$route.params.id,
      estatutosVigentes: false,
      fechaActualizacionEstatutos: '',
      reglamentoInterno: false,
      fechaActualizacionReglamento: '',
      libroActas: false,
      fechaUltimoRegistro: '',
      librosAfiliados: false,
        fechaActualizacionAfiliados: '',
      libroRegistrosFinancieros: false,
      registrosActualizados: false,
        libroInventario: false,
        inventarioActualizados: false,
        cajaMenor: false,
        montoAprobado: '',
        cuentaBancaria: false,
        tipoCuentaBancaria: '',
        numeroCuentaBancaria: '',
        entidadCuentaBancaria: '',
        resolucionFacturacion: false,
        rangoFacturacion: '',
        facturaElectronica: false,
        balanceContable: false,
        capitalTrabajo: false,
        montoCapitalTrabajo: '',
    }

    let categorias = [CATEGORIAS.BANCO]

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.bancosOptions = data
    })


    this.buscarJacInfoAction(this.jacID).then(data => {
      if(data.id > 0){
        this.jacInfoDB = {...data}
      }
    })

  },
  methods: {
    ...mapActions('jacInfo',['buscarJacInfoAction','registrarJacInfoAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']), 
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

  }
}
</script>

<style lang="sass">

</style>
