<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div v-if="step == 1">
          <q-form ref="infoEvaluacion">
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Descripción de la Evaluación *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="evaluacion.descripcion"
                      lazy-rules
                      :rules="[val => !!val || 'Información requerida']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Junta de Acción Comunal *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      use-input
                      v-model="evaluacion.jac"
                      option-label="nombre"
                      option-value="id"
                      hint="Seleccione la organización"
                      :options="jacs"
                      @filter="filtrarJac"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una organizacion'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step == 2">
          <div class="text-h6 q-px-xs q-py-md ">Indicadores</div>

          <q-card
            v-for="indicador in evaluacion.indicadores"
            flat
            bordered
            class="my-card q-mb-md"
            :key="indicador.indicador.id"
          >
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                {{ indicador.indicador.descripcion }} *
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                    dense
                    v-model="indicador.calificacion"
                    lazy-rules
                    :rules="[val => !!val || 'Información requerida']"
                  /> -->
                  <q-option-group
                    v-model="indicador.calificacion"
                    :options="calificacionOptions"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="flex justify-center">
          <q-btn
            v-if="step < 2"
            label="Continuar"
            class="full-width"
            no-caps
            color="positive"
            @click="siguiente"
          />
          <q-btn
            v-else
            label="Guardar"
            class="full-width"
            no-caps
            color="positive"
            @click="onSubmit"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
          <q-btn
            v-if="step > 1"
            label="Anterior"
            no-caps
            color="dark"
            flat
            class="full-width"
            @click="anterior"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { indicadoresIco, juntas } from "src/db/data";
import axios from "axios";
import { URL_API } from "src/utils/config";

export default {
  data() {
    return {
      opciones: "1",
      evaluacion: {},
      indicadoresOptions: indicadoresIco,
      jacOptions: juntas,
      jacs: [],
      calificacionOptions: [
        {
          label: "No existe",
          value: 1,
          color: "red"
        },
        {
          label: "Aceptable",
          value: 2,
          color: "orange"
        },
        {
          label: "Existe",
          value: 3,
          color: "green"
        }
      ],
      step: 1
    };
  },
  created() {
    this.jacs = this.jacOptions;
    this.evaluacion = {
      id: 0,
      descripcion: "",
      jac: null,
      indicadores: indicadoresIco,
      usuarioCreacion: this.getUser,
      usuarioActualizacion: this.getUser
    };
  },
  methods: {
    siguiente() {
      this.$refs.infoEvaluacion.validate().then(success => {
        if (success) {
          this.step++;
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });
        }
      });
    },
    anterior() {
      if (this.step < 1) {
        this.step = 1;
        console.log("No se puede regresar mas");
      } else {
        this.step--;
      }
    },
    onSubmit() {
      const urlService = "ico-evaluacion";

      axios
        .post(`${URL_API}/${urlService}/`, this.evaluacion)
        .then(({ data }) => {
          this.$router.push({ name: "IcoIndex" });
        })
        .catch(error => {
          if (!navigator.onLine && this.backgroundSyncSupported) {
            //redirigir al listado de categorias
            this.$q.notify({
              message: "Ico registrado offLine.",
              icon: "ti-check",
              textColor: "white",
              color: "dark",
              position: "bottom-right"
            });
            this.$router.push({ name: "IcoIndex" });
          } else {
            console.log("Error al guardar: ", error);
          }
        });
    },
    filtrarJac(val, update) {
      if (val === "") {
        update(() => {
          this.options = this.jacOptions;

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.jacs = this.jacOptions.filter(
          v => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
    backgroundSyncSupported() {
      if ("serviceWorker" in navigator && "SyncManager" in window) return true;
      return false;
    }
  }
};
</script>

<style></style>
