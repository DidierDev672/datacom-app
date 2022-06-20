<template>
<div>
  <div class="text-h6 page-title-box" >Balance</div>
  <div class="q-ma-md">
    <q-form ref="balanceForm" class="bg-white q-pa-md">
      <p class="text-h6">9. Balance financiero</p>
      <p class="text-h6">9.1. Activos corrientes</p>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Caja</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.caja" /> -->
          <q-field v-model="jacInfoDB.caja">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Bancos</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.bancos" /> -->
          <q-field v-model="jacInfoDB.bancos">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Cuentas por Cobrar</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.ctaCobrar" /> -->
          <q-field v-model="jacInfoDB.ctaCobrar">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Otros activos Corrientes</p>
          <q-field v-model="jacInfoDB.otrosActivosCorrientes">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col col-md-4 resaltado">
          <p class="text-h6 q-mb-sm">Total Activos corrientes</p>
        </div>
        <div class="col-auto col-md-2 cifra-total">
          <p class="text-h6 q-mb-sm">
            ${{ new Intl.NumberFormat().format(getActivosCorrientes) }}
          </p>
        </div>
      </div>

      <p class="text-h6">9.2. Activos fijos</p>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Muebles y enseres</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.mueblesEnseres" /> -->
          <q-field v-model="jacInfoDB.mueblesEnseres">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Construcciones</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.construcciones" /> -->
          <q-field v-model="jacInfoDB.construcciones">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Terrenos</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.terrenos" /> -->
          <q-field v-model="jacInfoDB.terrenos">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Vehículos - Maquinarias</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.terrenos" /> -->
          <q-field v-model="jacInfoDB.vehiculos">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Otros activos fijos</p>
          <q-field v-model="jacInfoDB.otrosActivosFijos">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col col-md-4 resaltado">
          <p class="text-h6 q-mb-sm">Total Activos fijos</p>
        </div>
        <div class="col-auto col-md-2 cifra-total">
          <p class="text-h6 q-mb-sm">
            ${{ new Intl.NumberFormat().format(getActivosFijos) }}
          </p>
        </div>
      </div>

      <p class="text-h6">9.3. Pasivos corrientes</p>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Obligaciones bancarias</p>
          <q-field v-model.number="jacInfoDB.obligacionesBancarias">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Obligaciones tributarias</p>
          <q-field v-model.number="jacInfoDB.obligacionesTributarias">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Otras cuentas por pagar</p>
          <!-- <q-input outlined dense v-model.number="jacInfoDB.ctaPagar" /> -->
          <q-field v-model.number="jacInfoDB.ctaPagar">
            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
              <money
                :id="id"
                class="q-field__input"
                :value="value"
                @input="emitValue"
                v-bind="decimales"
                v-show="floatingLabel"
              />
            </template>
          </q-field>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col col-md-4 resaltado">
          <p class="text-h6 q-mb-sm">Total pasivos corrientes</p>
        </div>
        <div class="col-auto col-md-2 cifra-total">
          <p class="text-h6 q-mb-sm">
            ${{ new Intl.NumberFormat().format(getPasivosCorrientes) }}
          </p>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-my-md">
        <div class="col col-md-4 resaltado">
          <p class="text-h6 q-mb-sm">Patrimonio</p>
        </div>
        <div class="col-auto col-md-2 cifra-total">
          <p class="text-h6 q-mb-sm">
            ${{ new Intl.NumberFormat().format(getPatrimonio) }}
          </p>
        </div>
      </div>

      <div align="right">
        <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
      </div>
    </q-form>
  </div>
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
      decimales: {
        decimal: ".",
        thousands: ",",
        prefix: "$",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      options: [
        { label: "Si", value: true },
        { label: "No", value: false }
      ]
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    this.jacInfoDB = {
      id: this.$route.params.id,
      caja: 0,
      bancos: 0,
      ctaCobrar: 0,
      otrosActivosCorrientes: 0,
      mueblesEnseres: 0,
      construcciones: 0,
      terrenos: 0,
      vehiculos: 0,
      otrosActivosFijos: 0,
      obligacionesBancarias: 0,
      obligacionesTributarias: 0,
      ctaPagar: 0
    };

    this.buscarJacInfoAction(this.jacID).then(data => {
      if (data.id > 0) {
        this.jacInfoDB = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction", "registrarJacInfoAction"]),
    onSubmit() {
      this.$refs.balanceForm.validate().then(success => {
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
    }
  },
  computed: {
    ...mapGetters("jacInfo", ["getJacInfoState"]),
    getActivosCorrientes() {
      return (
        this.jacInfoDB.caja +
        this.jacInfoDB.bancos +
        this.jacInfoDB.ctaCobrar +
        this.jacInfoDB.otrosActivosCorrientes
      );
    },
    getActivosFijos() {
      return (
        this.jacInfoDB.mueblesEnseres +
        this.jacInfoDB.construcciones +
        this.jacInfoDB.terrenos +
        this.jacInfoDB.vehiculos +
        this.jacInfoDB.otrosActivosFijos
      );
    },
    getPasivosCorrientes() {
      return (
        this.jacInfoDB.obligacionesBancarias +
        this.jacInfoDB.obligacionesTributarias +
        this.jacInfoDB.ctaPagar
      );
    },
    getPatrimonio() {
      return (
        this.getActivosCorrientes +
        this.getActivosFijos -
        this.getPasivosCorrientes
      );
    }
  }
};
</script>

<style lang="sass" scoped>
.resaltado
  background-color: #ccc
  border: 1px solid #999
.cifra-total
  border: 1px solid #999
</style>
