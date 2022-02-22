<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div>
          <q-form ref="estadoViviendaForm">
            <h6 class="q-mt-sm q-mb-md">Información de la Vivienda</h6>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">7. Su vivienda es:</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <!-- <q-option-group
                      :options="tenenciaOptions"
                      type="radio"
                      v-model="datosVivienda.tenencia"
                    /> -->
                    <q-select
                      dense
                      ref="tenencia"
                      v-model="datosVivienda.tenencia"
                      option-label="nombre"
                      option-value="id"
                      :options="tenenciaOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una forma de tenencia'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  8. ¿Cuántos cuartos tiene esta vivienda?
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-field v-model="datosVivienda.noHabitaciones">
                      <template
                        v-slot:control="{ id, floatingLabel, value, emitValue }"
                      >
                        <money
                          :id="id"
                          class="q-field__input"
                          :value="value"
                          @input="emitValue"
                          v-bind="numero"
                          v-show="floatingLabel"
                        />
                      </template>
                    </q-field>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  9. Material predominante de las paredes
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <!-- <q-option-group
                      :options="tenenciaOptions"
                      type="radio"
                      v-model="datosVivienda.tenencia"
                    /> -->
                    <q-select
                      dense
                      v-model="datosVivienda.materialParedes"
                      option-label="nombre"
                      option-value="id"
                      :options="paredesOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una forma de tenencia'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  10. Estado del Material de las paredes
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <!-- <q-option-group
                      :options="tenenciaOptions"
                      type="radio"
                      v-model="datosVivienda.tenencia"
                    /> -->
                    <q-select
                      dense
                      v-model="datosVivienda.estadoParedes"
                      emit-value
                      map-options
                      :options="estadoMateriales"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val > 0) ||
                          'Debe elegir el estado del material'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  11. Material predominante de los pisos
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <!-- <q-option-group
                      :options="tenenciaOptions"
                      type="radio"
                      v-model="datosVivienda.tenencia"
                    /> -->
                    <q-select
                      dense
                      v-model="datosVivienda.materialPiso"
                      option-label="nombre"
                      option-value="id"
                      :options="pisosOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir un material'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">12. Estado del Material de los pisos</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-select
                      dense
                      v-model="datosVivienda.estadoPiso"
                      emit-value
                      map-options
                      :options="estadoMateriales"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val > 0) ||
                          'Debe elegir el estado del material'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">13. Material predominante del techo</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <!-- <q-option-group
                      :options="tenenciaOptions"
                      type="radio"
                      v-model="datosVivienda.tenencia"
                    /> -->
                    <q-select
                      dense
                      v-model="datosVivienda.materialTecho"
                      option-label="nombre"
                      option-value="id"
                      :options="techosOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir un material'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">14. Estado del Material del techo</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-select
                      dense
                      v-model="datosVivienda.estadoTecho"
                      emit-value
                      map-options
                      :options="estadoMateriales"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val > 0) ||
                          'Debe elegir el estado del material'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div class="flex justify-center">
          <q-btn
            class="full-width"
            label="Guardar y continuar"
            no-caps
            color="primary"
            :disable="getDatosViviendaState.loading"
            :loading="getDatosViviendaState.loading"
            @click="onSubmit"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CATEGORIAS } from "src/utils/config";
import { date } from "quasar";
export default {
  data() {
    return {
      encuestaID: 0,
      datosVivienda: {},
      tenenciaOptions: [],
      paredesOptions: [],
      pisosOptions: [],
      techosOptions: [],
      estadoMateriales: [
        { label: "Bueno", value: 1 },
        { label: "Regular", value: 2 },
        { label: "Malo", value: 3 }
      ],
      numero: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false /* doesn't work with directive */
      }
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    let categorias = [
      CATEGORIAS.TENENCIA_VIVIENDA,
      CATEGORIAS.MATERIAL_PAREDES,
      CATEGORIAS.MATERIAL_PISOS,
      CATEGORIAS.MATERIAL_TECHO
    ];
    this.datosVivienda = {
      id: 0,
      tenencia: "",
      noHabitaciones: "",
      materialParedes: "",
      estadoParedes: "",
      materialPiso: "",
      estadoPiso: "",
      materialTecho: "",
      estadoTecho: ""
    };
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      // let opciones = data.map(opt => {
      //   return {
      //     label: opt.nombre,
      //     value: opt.id
      //   }
      // })
      data.map(opt => {
        let codigoCategoria = opt.categoria.codigo;
        switch (codigoCategoria) {
          case "TEVI":
            this.tenenciaOptions.push(opt);
            break;
          case "MATP":
            this.paredesOptions.push(opt);
            break;
          case "MAPI":
            this.pisosOptions.push(opt);
            break;
          case "MATE":
            this.techosOptions.push(opt);
            break;

          default:
            break;
        }
      });
      // this.tenenciaOptions = this.paredesOptions = data;
    });

    this.buscarDatosViviendaAction(this.encuestaID).then(data => {
      console.log('Data: ', data)
      if (data.id > 0) {
        this.datosVivienda = { ...data };
        console.log('DatosVivienda: ', this.datosVivienda)
      }
    });
  },
  methods: {
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapActions("datosVivienda", [
      "buscarDatosViviendaAction",
      "registrarDatosViviendaAction",
      "actualizarDatosViviendaAction"
    ]),
    onSubmit() {
      const fecha = date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
      //validar FormUbicacion
      this.$refs.estadoViviendaForm.validate().then(success => {
        if (success) {

          this.registrarDatosViviendaAction({
            ...this.datosVivienda,
            encuesta: {
              id: parseInt(this.encuestaID)
            },
            fechaActualizacion: fecha,
            usuarioActualizacion: this.getUser,
            fechaCreacion: fecha,
            usuarioCreacion: this.getUser
          }).then(data => {
            this.datosVivienda.id = data;
            this.$router.push({
              name: "servicios-vivienda",
              params: { id: this.encuestaID }
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
    ...mapGetters("datosVivienda", ["getDatosViviendaState"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style></style>
