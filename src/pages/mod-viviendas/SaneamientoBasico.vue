<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <div>
          <q-form ref="estadoViviendaForm">
            <p class="text-h6 q-mt-md">Saneamiento Básico</p>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  20. Manejo de Excretas
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="datosVivienda.excretas"
                      :options="excretasOptions"
                      option-label="nombre"
                      label="Manejo de Excretas"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  21. Disposición de Residuos
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="datosVivienda.residuos"
                      :options="residuosOptions"
                      option-label="nombre"
                      label="Disposición de Residuos"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  22. Su vivienda se encuentra en riesgo de:
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.riesgoInundacion"
                      label="Inundación"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.riesgoAvalancha"
                      label="Avalancha"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox v-model="datosVivienda.riesgoDeslizamiento" label="Deslizamiento" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.riesgoVendaval"
                      label="Vendaval"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.riesgoElectrico"
                      label="Condición inadecuada de instalaciones eléctricas"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.riesgoIncendio"
                      label="Incendios"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.riesgoDuctos"
                      label="Presencia de ductos y/o redes eléctricas"
                    />
                  </div>

                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  23. Número de familias en la vivienda
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input v-model="datosVivienda.noFamilias" label="Número de Familias"   />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  24. Número de personas en la vivienda
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input v-model.number="datosVivienda.noPersonas" label="Número de Personas"   />
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
export default {
  data() {
    return {
      encuestaID: 0,
      datosVivienda: {},
      excretasOptions: [],
      residuosOptions: []
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    let categorias = [
      CATEGORIAS.DISPOSICION_EXCRETAS,
      CATEGORIAS.DISPOSICION_RESIDUOS
    ];
    this.datosVivienda = {
      id: 0,
      excretas: false,
      residuos: false,
      riesgoInundacion: false,
      riesgoAvalancha: false,
      riesgoDeslizamiento: false,
      riesgoVendaval: false,
      riesgoElectrico: false,
      riesgoIncendio: false,
      riesgoDuctos: false,
      noPersonas: 0,
      noFamilias: 1
    };
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      data.map(opt => {
        let codigoCategoria = opt.categoria.codigo;
        switch (codigoCategoria) {
          case "EXCR":
            this.excretasOptions.push(opt);
            break;
          case "DISPO":
            this.residuosOptions.push(opt);
            break;
          default:
            break;
        }
      });
    });

    this.buscarDatosViviendaAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.datosVivienda = { ...data };
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
      console.log(this.datosVivienda);
      let info = {
        ...this.datosVivienda,
        encuesta: {
          id: this.encuestaID
        }
      };
      if (this.datosVivienda.id > 0) {
        this.actualizarDatosViviendaAction(info);
      } else {
        this.registrarDatosViviendaAction(info).then(data => {
          this.datosVivienda.id = data;
        });
      }
      this.$router.push({
        name: "personas-vivienda",
        params: { id: this.encuestaID }
      });
    },
    actualizarModelo(value) {
      this.showControl = false;
      console.log("Opción seleccionada: ", value);
      value.map(opt => {
        if (opt.id == 127) {
          console.log("Se trata de acueducto");
          this.showControl = true;
        }
      });
    }
  },
  computed: {
    ...mapGetters("datosVivienda", ["getDatosViviendaState"])
  }
};
</script>

<style>
.q-item__label--header {
  color: #464d69;
  /* font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em; */
}
</style>
