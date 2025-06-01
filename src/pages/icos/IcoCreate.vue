<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-10 offset-sm-1">
        <div>
          <q-form ref="infoEvaluacion">            
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">                
                <q-chip class="full-width q-py-md text-bold text-h6" square color="info" text-color="white" icon="ti-minus">
                    Información de la evaluación
                </q-chip>
              </q-card-section>

              <q-card-section>
                <div class="q-col-gutter-md row q-mb-md">                  
                  <div class="col-xs-12 col-sm-4">
                    <q-select
                      use-input
                      dense
                      v-model="evaluacion.jac"
                      label="Organización"
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

                <div class="q-col-gutter-md row q-mb-md">
                  <div class="col-xs-12 col-sm-4">
                    <q-input
                      dense
                      v-model="evaluacion.descripcion"
                      label="Descripción de la evaluación"
                      lazy-rules
                      :rules="[val => !!val || 'Información requerida']"
                    />
                  </div>                
                  <div class="col-xs-12 col-sm-4">                    
                    <q-input label="Fecha de aplicación" v-model="evaluacion.fechaAplicacion" mask="date" dense>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="evaluacion.fechaAplicacion">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-xs-12 col-sm-4">
                    <q-input
                      dense
                      v-model="evaluacion.encuestador"
                      label="Encuestador"
                      lazy-rules
                      :rules="[val => !!val || 'Información requerida']"
                    />
                  </div>
                </div>

                <div class="q-col-gutter-md row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="evaluacion.observaciones"
                      type="textarea"
                      autogrow
                      label="Observaciones generales de la evaluación"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div >
          
          
          
          <q-card class="q-pa-md">
            <q-chip class="full-width q-py-md text-bold text-h6" square color="info" text-color="white" icon="ti-minus">
                    Indicadores
                </q-chip>
            <q-stepper
                v-model="stepper"
                ref="stepper"
                color="primary"
                animated
              >
              
              <q-step
                v-for="(indicador, index) in indicadoresAgrupados"
                  flat
                  bordered
                  class="my-card q-mb-md"
                  :key="index"
                :name="index"
                :title="indicador.tema"
                icon="settings"
                :done="stepper > index"
              >
              <div class="row">
                <div class="col-xs-12 col-sm-6 offset-sm-3 text-h6 q-mb-md">
                  {{ indicador.tema }}
                </div>
              </div>
                <div v-for="(indi, index) in indicador.indicadores" class="row q-mb-md" :key="index">                
                    <div class="col-xs-12 col-sm-6 offset-sm-3">
                      <q-select 
                        v-model="indi.calificacion" 
                        :options="indi.respuestas" 
                        emit-value 
                        map-options 
                        :label="indi.indicador.descripcion" />
                    </div> 
                </div>
              </q-step>
              <template v-slot:navigation>
                <q-stepper-navigation>
                  <q-btn no-caps v-if="stepper < 7" 
                  @click="$refs.stepper.next()" 
                  color="primary" 
                  label="Siguiente"
                  icon-right="arrow_forward" />
                  <q-btn no-caps v-else @click="onSubmit" color="primary" label="Finalizar" />
                  <q-btn no-caps v-if="stepper > 0" flat color="primary" @click="$refs.stepper.previous()" label="Anterior" class="q-ml-sm" />
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </q-card>          
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
import { date } from 'quasar'

export default {
  data() {
    return {
      opciones: "1",
      evaluacion: this.inicializarEvaluacion(),
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
      step: 1,
      stepper: 0,
      indicadoresAgrupados: []
    };
    
  },
  created() {    
    this.jacOptions = this.getJacState.lista;
    // this.cargarListaIndicadoresAction();
    this.getIndicadoresState.lista.forEach(indicador => {
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

    this.indicadoresAgrupados = this.getIndicadoresState.lista.reduce((acc, indicador) => {
      const temaDescripcion = indicador.tema.descripcion;

      // Verificamos si ya existe un grupo para ese tema
      let grupo = acc.find(g => g.tema === temaDescripcion);

      if (!grupo) {
        grupo = {
          tema: temaDescripcion,
          indicadores: []
        };
        acc.push(grupo);
      }

      // Añadimos el indicador al grupo correspondiente
      //grupo.indicadores.push({...indicador});
      grupo.indicadores.push({
        indicador: indicador,
        respuestas: indicador.respuestas.map(resp => {
          return {
            label: resp.descripcion,
            value: resp.valoracion
          }
        }),
        calificacion: "",
        descripcionCalificacion: ''
      });

      return acc;
    }, []);

    console.log("agrupados: ", this.indicadoresAgrupados)
    
  },
  methods: {
    ...mapActions('jacInfo', ['cargarListaJacInfoAction']),
    // ...mapActions("indicadores", ["cargarListaIndicadoresAction"]),
    inicializarEvaluacion(){
      return {
      id: 0,
      jac: null,
      descripcion: "",
      fechaAplicacion: "",
      encuestador: "",
      observaciones: "",
      indicadores: [],
      usuarioCreacion: "",
      usuarioActualizacion: "",
      tipoEstudio: {
        id: 1
      }
    }
    },
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


    onSubmit2() {
      const urlService = "ico-evaluacion";
      let indicadoresFormateados = [];
      this.indicadoresAgrupados.forEach(indi => {
        indi.indicadores.forEach(subIndicador => {
          let respuestaSeleccionada = subIndicador.respuestas.find(resp => {
            if(resp.value === subIndicador.calificacion){              
              return resp
            }
          });          
          indicadoresFormateados.push({
            ...subIndicador,
            descripcionCalificacion: respuestaSeleccionada != undefined ? respuestaSeleccionada.label: ''
          });          
        });        
      });  
      
      console.log("indicadoresFormateados: ", indicadoresFormateados);
      
    },
    onSubmit() {
      const urlService = "ico-evaluacion";
      let indicadoresFormateados = [];
      this.indicadoresAgrupados.forEach(indi => {
        indi.indicadores.forEach(subIndicador => {
          let respuestaSeleccionada = subIndicador.respuestas.find(resp => {
            if(resp.value === subIndicador.calificacion){              
              return resp
            }
          });          
          indicadoresFormateados.push({
            ...subIndicador,
            descripcionCalificacion: respuestaSeleccionada != undefined ? respuestaSeleccionada.label: ''
          });          
        });        
      });  

      const fechaFormateada = date.formatDate(this.evaluacion.fechaAplicacion, 'YYYY-MM-DD');
      
      let nuevaEvaluacion = {
        ...this.evaluacion,
        indicadores: indicadoresFormateados,
        fechaAplicacion: fechaFormateada,
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser,
      }

      axios
        .post(`${URL_API}/${urlService}/`, nuevaEvaluacion)
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
    cambiarRespuesta(respuesta){
      console.log(respuesta)
    }
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
