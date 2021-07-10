<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">
          {{ mensajeBoton }} Indicador de Finanza Pública
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form class="q-gutter-md" ref="finanzaForm">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="finanza.tipoIndicadorFinanza"
                :options="options"
                label="Seleccione el tipo de indicador"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <!-- <q-input
                outlined
                v-model.number="finanza.valor"
                label="Valor del indicador"
                type="number"
                lazy-rules
                :rules="[
                    val => val !== null && val !== '' || 'Debe ingresar un valor ',
                    val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                ]"
              />  -->
              <q-field
                label="Valor"
                v-model="finanza.valor"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
                hint="#,###"
              >
                <template
                  v-slot:control="{ id, floatingLabel, value, emitValue }"
                >
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

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="finanza.periodo"
                placeholder="Año o rango de años de la vigencia"
                label="Periodo"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                type="textarea"
                v-model="finanza.observacion"
                placeholder="Ingrese cualquier observación que ayude a identificar la información ingresada"
                label="Observaciones"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          :disable="getFinanzaState.loading"
          @click="close"
        />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getFinanzaState.loading"
          :disable="getFinanzaState.loading"
          @click="onSubmit"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { CATEGORIAS } from "../../utils/config";
import { date } from "quasar";
export default {
  data() {
    return {
      show: true,
      finanza: {},
      encuestaID: 0,
      options: [],
      decimales: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  created() {
    let categorias = [CATEGORIAS.FINANZAS_PUBLICAS];
    this.encuestaID = this.$route.params.id;
    this.finanza = {
      id: 0,
      valor: "",
      periodo: "",
      observacion: "",
      tipoIndicadorFinanza: "",
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };
    if (Object.keys(this.getFinanzaState.objFinanza).length > 0) {
      this.finanza.id = this.getFinanzaState.objFinanza.id;
      this.finanza.valor = this.getFinanzaState.objFinanza.valor;
      this.finanza.periodo = this.getFinanzaState.objFinanza.periodo;
      this.finanza.observacion = this.getFinanzaState.objFinanza.observacion;
      this.finanza.tipoIndicadorFinanza = this.getFinanzaState.objFinanza.tipoIndicadorFinanza;
    }

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.options = data;
    });
  },
  methods: {
    ...mapActions("finanza", [
      "registrarFinanzaAction",
      "actualizarFinanzaAction",
      "unsetFinanzaAction"
    ]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {
      let info = {
        ...this.finanza,
        encuesta: {
          id: this.encuestaID
        },
        fechaActualizacion: this.getFecha,
        usuarioActualizacion: this.getUser
      };

      this.$refs.finanzaForm.validate().then(success => {
        if (success) {
          console.log("Form valido", this.finanza);
          if (info.id > 0) {
            //Actualizar
            this.actualizarFinanzaAction(info).then(() => {
              this.$q.notify({
                message: "Registro actualizado",
                color: "positive"
              });
            });
          } else {
            //Guardar
            this.registrarFinanzaAction(info).then(data => {
              this.finanza.id = data;
            });
          }
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });
        }
      });
    },
    close() {
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters("finanza", ["getFinanzaState"]),
    mensajeBoton() {
      return this.finanza.id > 0 ? "Actualizar" : "Guardar";
    },
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  },
  beforeDestroy() {
    this.unsetFinanzaAction();
  }
};
</script>

<style></style>
