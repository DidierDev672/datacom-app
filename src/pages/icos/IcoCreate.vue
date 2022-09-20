<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div v-if="step == 1">
          <!-- <pre>{{ indicadores }}</pre> -->
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
                      option-label="jac"
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
            v-for="indicador in indicadores"
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
                <div class="col-xs-12">
                  <!-- <q-input
                    dense
                    v-model="indicador.calificacion"
                    lazy-rules
                    :rules="[val => !!val || 'Información requerida']"
                  /> -->
                  <q-option-group
                    v-model="indicador.calificacion"
                    :options="indicador.respuestas"
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
// import { indicadoresIco, juntas } from "src/db/data";
import axios from "axios";
import { URL_API } from "src/utils/config";

export default {
  data() {
    return {
      opciones: "1",
      evaluacion: {},
      indicadoresOptions: [],
      indicadores: [],
      jacOptions: [],
      jacs: [],
      calificacionOptions: [
        {
          label: "Inferior",
          value: 1,
          color: "red"
        },
        {
          label: "Medio",
          value: 2,
          color: "orange"
        },
        {
          label: "Intermedio",
          value: 3,
          color: "yellow"
        },
        {
          label: "Superior",
          value: 4,
          color: "green"
        }
      ],
      step: 1
    };
  },
  created() {
    this.jacOptions = this.getJacState.lista;
    // this.cargarListaIndicadoresAction();
    this.getIndicadoresState.lista.forEach(indicador => {
      console.log('Indicador: ', indicador)
      this.indicadores.push({
        indicador: indicador,
        respuestas: indicador.respuestas.map(resp => {
          return {
            label: resp.descripcion,
            value: resp.valoracion
          }
        }),
        calificacion: 1,
        descripcionCalificacion: ''
      });
    });
    this.evaluacion = {
      id: 0,
      descripcion: "",
      jac: null,
      indicadores: [],
      usuarioCreacion: this.getUser,
      usuarioActualizacion: this.getUser,
      tipoEstudio: {
        id: 1
      }
    };
  },
  methods: {
    ...mapActions('jacInfo', ['cargarListaJacInfoAction']),
    // ...mapActions("indicadores", ["cargarListaIndicadoresAction"]),
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
      this.evaluacion.indicadores = this.indicadores.map(indi => {

       let respuestaSeleccionada = indi.respuestas.find(resp => {
            if(resp.value === indi.calificacion){
              return resp
            }
          });
        return {
          ...indi,
          descripcionCalificacion: respuestaSeleccionada.label
        }
      })

      axios
        .post(`${URL_API}/${urlService}/`, this.evaluacion)
        .then(({ data }) => {
          this.$router.push({ name: "IcoIndex" });
        })
        .catch(error => {
          console.log("Error al guardar: ", error);
        });
    },
    filtrarJac(val, update, abort) {
      console.log(val)
      if (val.length < 3) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase();

        // this.jacs = this.jacOptions.filter(
        //   v => v.nombre.toLowerCase().indexOf(needle) > -1
        // );

        this.cargarListaJacInfoAction({
            page: 0,
            rowsPerPage: 50,
            filter: needle
          }).then(response => {

            this.jacs.splice(
              0,
              this.jacs.length,
              ...response.data.content
            );
        });


      });
    },
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
    ...mapGetters("jac", ["getJacState"]),
    ...mapGetters("indicadores", ["getIndicadoresState"]),
    // backgroundSyncSupported() {
    //   if ("serviceWorker" in navigator && "SyncManager" in window) return true;
    //   return false;
    // }
  }
};
</script>

<style></style>
