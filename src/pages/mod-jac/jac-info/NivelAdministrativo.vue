<template>
  <div class="q-ma-sm">
    <q-form ref="fiscalForm">
      <p class="text-h6">8. Nivel administrativo y financiero</p>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Estatutos vigentes?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.estatutosVigentes"
          />
        </div>
      </div>

      <div
        class="row q-col-gutter-sm q-mt-sm"
        v-if="jacInfoDB.estatutosVigentes"
      >
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Fecha de actualización</p>
          <q-input
            outlined
            v-model="jacInfoDB.fechaActualizacionEstatutos"
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="jacInfoDB.fechaActualizacionEstatutos">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Tienen reglamento interno?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.reglamentoInterno"
          />
        </div>
      </div>
      <div
        class="row q-col-gutter-sm q-mt-md"
        v-if="jacInfoDB.reglamentoInterno"
      >
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Fecha de actualización</p>
          <q-input
            outlined
            v-model="jacInfoDB.fechaActualizacionReglamento"
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="jacInfoDB.fechaActualizacionReglamento">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Llevan libro de actas?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.libroActas"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md" v-if="jacInfoDB.libroActas">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Fecha del Último registro</p>
          <q-input outlined v-model="jacInfoDB.fechaUltimoRegistro" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="jacInfoDB.fechaUltimoRegistro">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Llevan libro de afiliados?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.librosAfiliados"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md" v-if="jacInfoDB.librosAfiliados">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Fecha de actualización</p>
          <q-input
            outlined
            v-model="jacInfoDB.fechaActualizacionAfiliados"
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="jacInfoDB.fechaActualizacionAfiliados">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Llevan libro de registros financieros?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.libroRegistrosFinancieros"
          />
        </div>
      </div>

      <div
        class="row q-col-gutter-sm q-mt-md"
        v-if="jacInfoDB.libroRegistrosFinancieros"
      >
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Los registros están actualizados?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.registrosActualizados"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Llevan libro de registros de inventarios?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.libroInventario"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md" v-if="jacInfoDB.libroInventario">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿El inventario está actualizado?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.inventarioActualizados"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Manejan caja menor?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.cajaMenor"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md" v-if="jacInfoDB.cajaMenor">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Monto aprobado</p>
          <q-input outlined v-model="jacInfoDB.montoAprobado" />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Tienen cuenta bancaria?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.cuentaBancaria"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md" v-if="jacInfoDB.cuentaBancaria">
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Tipo</p>
          <q-select
            :options="tipoCuentaOptions"
            behavior="dialog"
            outlined
            v-model="jacInfoDB.tipoCuentaBancaria"
          />
        </div>
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">No. Cuenta Bancaria</p>
          <q-input outlined v-model="jacInfoDB.numeroCuentaBancaria" />
        </div>
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Entidad / Banco</p>
          <q-select
            outlined
            ref="banco"
            v-model="jacInfoDB.entidadCuentaBancaria"
            option-label="nombre"
            option-value="id"
            :options="bancosOptions"
            behavior="dialog"
            lazy-rules
            :rules="[
              val => (val != null && val.id > 0) || 'Debe elegir una comunidad'
            ]"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Tienen resolución de facturación?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.resolucionFacturacion"
          />
        </div>
      </div>

      <div
        class="row q-col-gutter-sm q-mt-md"
        v-if="jacInfoDB.resolucionFacturacion"
      >
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Rango de facturación</p>
          <q-input outlined v-model="jacInfoDB.rangoFacturacion" />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Manejan factura electrónica?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.facturaElectronica"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Realizan balances contables?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.balanceContable"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Cuentan con capital de trabajo?</p>
          <q-option-group
            inline
            :options="options"
            @input="onChangeCapitalTrabajo"
            type="radio"
            v-model="jacInfoDB.capitalTrabajo"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-my-md" v-if="jacInfoDB.capitalTrabajo">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Monto</p>
          <q-input outlined v-model="jacInfoDB.montoCapitalTrabajo" />
        </div>
      </div>

      <div align="right">
        <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CATEGORIAS } from "src/utils/config";

export default {
  name: "JacInfo",
  data() {
    return {
      jacID: 0,
      jacInfoDB: {},
      options: [
        { label: "Si", value: true },
        { label: "No", value: false }
      ],
      tipoCuentaOptions: ["Ahorro", "Corriente"],
      bancosOptions: []
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    this.jacInfoDB = {
      id: this.$route.params.id,
      estatutosVigentes: false,
      fechaActualizacionEstatutos: "",
      reglamentoInterno: false,
      fechaActualizacionReglamento: "",
      libroActas: false,
      fechaUltimoRegistro: "",
      librosAfiliados: false,
      fechaActualizacionAfiliados: "",
      libroRegistrosFinancieros: false,
      registrosActualizados: false,
      libroInventario: false,
      inventarioActualizados: false,
      cajaMenor: false,
      montoAprobado: "",
      cuentaBancaria: false,
      tipoCuentaBancaria: "",
      numeroCuentaBancaria: "",
      entidadCuentaBancaria: "",
      resolucionFacturacion: false,
      rangoFacturacion: "",
      facturaElectronica: false,
      balanceContable: false,
      capitalTrabajo: false,
      montoCapitalTrabajo: ""
    };

    let categorias = [CATEGORIAS.BANCO];

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.bancosOptions = data;
    });

    this.buscarJacInfoAction(this.jacID).then(data => {
      if (data.id > 0) {
        this.jacInfoDB = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction", "registrarJacInfoAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {
      this.$refs.fiscalForm.validate().then(success => {
        if (success) {
          this.registrarJacInfoAction(this.jacInfoDB).then(data => {
            this.$q.notify({
              message: "Información actualizada correctamente",
              color: "positive"
            });
          });
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });
        }
      });
    },
    onChangeCapitalTrabajo(value) {
      if (!value) {
        this.jacInfoDB.montoCapitalTrabajo = 0;
      }
    }
  },
  computed: {
    ...mapGetters("jacInfo", ["getJacInfoState"])
  }
};
</script>

<style lang="sass"></style>
