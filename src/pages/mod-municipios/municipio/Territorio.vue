<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="ubicacionForm">
          <p class="text-h6 q-mt-md q-mb-sm">12. Territorio</p>
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                ¿Cuenta con plan de ordenamiento territorial?
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    @input="changePot"
                    type="radio"
                    v-model="territorio.planDeOrdenamiento"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.planDeOrdenamientoFile !== null"
            >
              <div class="q-mb-none">
                <q-chip
                  outline
                  clickable
                  @click="download(territorio.planDeOrdenamientoFile)"
                  color="primary"
                  text-color="white"
                  icon-right="open_in_new"
                >
                  {{ territorio.planDeOrdenamientoFile.nombreOriginal }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.planDeOrdenamiento"
            >
              <div class="q-mb-none">
                <q-btn
                  @click="fileManager('planDeOrdenamientoFile')"
                  label="Adjuntar archivo"
                />
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                ¿Cuenta con plan de Gestión Ambiental?
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    @input="changePga"
                    type="radio"
                    v-model="territorio.planDeGestionAmbiental"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.planDeGestionAmbientalFile !== null"
            >
              <div class="q-mb-none">
                <q-chip
                  outline
                  clickable
                  @click="download(territorio.planDeGestionAmbientalFile)"
                  color="primary"
                  text-color="white"
                  icon-right="open_in_new"
                >
                  {{ territorio.planDeGestionAmbientalFile.nombreOriginal }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.planDeGestionAmbiental"
            >
              <div class="q-mb-none">
                <q-btn
                  @click="fileManager('planDeGestionAmbientalFile')"
                  label="Adjuntar archivo"
                />
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                ¿Cuenta con delimitación de áreas protegidas?
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    @input="changeDap"
                    type="radio"
                    v-model="territorio.delimitacionDeAreasProtegidas"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.delimitacionDeAreasProtegidasFile !== null"
            >
              <div class="q-mb-none">
                <q-chip
                  outline
                  clickable
                  @click="
                    download(territorio.delimitacionDeAreasProtegidasFile)
                  "
                  color="primary"
                  text-color="white"
                  icon-right="open_in_new"
                >
                  {{
                    territorio.delimitacionDeAreasProtegidasFile.nombreOriginal
                  }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.delimitacionDeAreasProtegidas"
            >
              <div class="q-mb-none">
                <q-btn
                  @click="fileManager('delimitacionDeAreasProtegidasFile')"
                  label="Adjuntar archivo"
                />
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                ¿Cuenta con plan de ordenamiento de cuencas hidrográficas?
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    @input="changePoc"
                    type="radio"
                    v-model="territorio.planDeOrdenamientoDeCuentasHidricas"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.planDeOrdenamientoDeCuentasHidricasFile !== null"
            >
              <div class="q-mb-none">
                <q-chip
                  outline
                  clickable
                  @click="
                    download(territorio.planDeOrdenamientoDeCuentasHidricasFile)
                  "
                  color="primary"
                  text-color="white"
                  icon-right="open_in_new"
                >
                  {{
                    territorio.planDeOrdenamientoDeCuentasHidricasFile
                      .nombreOriginal
                  }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.planDeOrdenamientoDeCuentasHidricas"
            >
              <div class="q-mb-none">
                <q-btn
                  @click="
                    fileManager('planDeOrdenamientoDeCuentasHidricasFile')
                  "
                  label="Adjuntar archivo"
                />
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                ¿Cuenta con zonas forestales protectoras?
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    @input="changeZfp"
                    type="radio"
                    v-model="territorio.zonasForestalesProtectoras"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.zonasForestalesProtectorasFile !== null"
            >
              <div class="q-mb-none">
                <q-chip
                  outline
                  clickable
                  @click="download(territorio.zonasForestalesProtectorasFile)"
                  color="primary"
                  text-color="white"
                  icon-right="open_in_new"
                >
                  {{ territorio.zonasForestalesProtectorasFile.nombreOriginal }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.zonasForestalesProtectoras"
            >
              <div class="q-mb-none">
                <q-btn
                  @click="fileManager('zonasForestalesProtectorasFile')"
                  label="Adjuntar archivo"
                />
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                ¿Está el municipio en zona de parques nacionales naturales?
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    type="radio"
                    v-model="territorio.enZonaDeParquesNaturales"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <q-input
                    v-model="territorio.nombreParque"
                    v-if="territorio.enZonaDeParquesNaturales"
                    label="Ingrese el nombre de la zona / parque natural"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                ¿Cuenta con el catastro actualizado?
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    @input="changeCac"
                    type="radio"
                    v-model="territorio.catastroActualizado"
                  />
                </div>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.catastroActualizadoFile !== null"
            >
              <div class="q-mb-none">
                <q-chip
                  outline
                  clickable
                  @click="download(territorio.catastroActualizadoFile)"
                  color="primary"
                  text-color="white"
                  icon-right="open_in_new"
                >
                  {{ territorio.catastroActualizadoFile.nombreOriginal }}
                </q-chip>
              </div>
            </q-card-section>

            <q-card-section
              class="q-pb-none"
              v-if="territorio.catastroActualizado"
            >
              <div class="q-mb-none">
                <q-btn
                  @click="fileManager('catastroActualizadoFile')"
                  label="Adjuntar archivo"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-form>

        <div class="flex justify-center">
          <q-btn
            label="Guardar y continuar"
            no-caps
            color="primary"
            :loading="getTerritorioState.loading"
            @click="onSubmit"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>

        <file-manager
          v-if="showFileManager"
          @close="closeModal"
          @seleccionar="seleccionarFile"
          :campo="campo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { date } from "quasar";
import { mapActions, mapGetters } from "vuex";
import FileManager from "src/components/file-manager/FileManager.vue";
export default {
  components: { FileManager },
  data() {
    return {
      encuestaID: 0,
      territorio: {},
      optionsCumple: [
        { label: "Si", value: true },
        { label: "No", value: false }
      ],
      showFileManager: false,
      campo: ""
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.territorio = {
      id: 0,
      planDeOrdenamiento: false,
      planDeOrdenamientoFile: null,
      planDeGestionAmbiental: false,
      planDeGestionAmbientalFile: null,
      delimitacionDeAreasProtegidas: false,
      delimitacionDeAreasProtegidasFile: null,
      planDeOrdenamientoDeCuentasHidricas: false,
      planDeOrdenamientoDeCuentasHidricasFile: null,
      zonasForestalesProtectoras: false,
      zonasForestalesProtectorasFile: null,
      enZonaDeParquesNaturales: false,
      nombreParque: null,
      catastroActualizado: false,
      catastroActualizadoFile: null,
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };

    this.buscarTerritorioAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.territorio = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("territorio", [
      "registrarTerritorioAction",
      "buscarTerritorioAction"
    ]),
    ...mapActions("fileManager", ["buscarFileAction"]),
    onSubmit() {
      if (this.territorio.planDeOrdenamiento) {
        if (this.territorio.planDeOrdenamientoFile === null) {
          this.$q.notify({
            message: "Debe subir el documento del Plan de Ordenamiento",
            color: "red"
          });
          return;
        }
      }

      if (this.territorio.planDeGestionAmbiental) {
        if (this.territorio.planDeGestionAmbientalFile === null) {
          this.$q.notify({
            message: "Debe subir el documento del Plan de Gestión Ambiental",
            color: "red"
          });
          return;
        }
      }

      if (this.territorio.planDeGestionAmbiental) {
        if (this.territorio.planDeGestionAmbientalFile === null) {
          this.$q.notify({
            message: "Debe subir el documento del Plan de Gestión Ambiental",
            color: "red"
          });
          return;
        }
      }

      if (this.territorio.delimitacionDeAreasProtegidas) {
        if (this.territorio.delimitacionDeAreasProtegidasFile === null) {
          this.$q.notify({
            message:
              "Debe subir el documento de Delimitación de Áreas Protegidas",
            color: "red"
          });
          return;
        }
      }

      if (this.territorio.planDeOrdenamientoDeCuentasHidricas) {
        if (this.territorio.planDeOrdenamientoDeCuentasHidricasFile === null) {
          this.$q.notify({
            message:
              "Debe subir el documento del Plan de Ordenamiento de Cuencas Hídricas",
            color: "red"
          });
          return;
        }
      }

      if (this.territorio.zonasForestalesProtectoras) {
        if (this.territorio.zonasForestalesProtectorasFile === null) {
          this.$q.notify({
            message: "Debe subir el documento de Zonas Forestales",
            color: "red"
          });
          return;
        }
      }

      if (this.territorio.catastroActualizado) {
        if (this.territorio.catastroActualizadoFile === null) {
          this.$q.notify({
            message: "Debe subir el documento del Catastro Actualizado",
            color: "red"
          });
          return;
        }
      }

      this.registrarTerritorioAction({
        ...this.territorio,
        nombreParque: this.territorio.enZonaDeParquesNaturales
          ? this.territorio.nombreParque
          : "",
        encuesta: {
          id: this.encuestaID
        },
        fechaActualizacion: this.getFecha,
        usuarioActualizacion: this.getUser
      }).then(data => {
        this.territorio.id = data;
        this.$router.push({
          name: "participacion",
          params: { id: this.encuestaID }
        });
      });
    },
    fileManager(campo) {
      this.campo = campo;
      this.showFileManager = true;
    },
    closeModal() {
      this.showFileManager = false;
    },
    seleccionarFile(campo, archivo) {
      console.log("Campo: ", campo);
      console.log("Archivo: ", archivo);
      switch (campo) {
        case "planDeOrdenamientoFile":
          this.territorio.planDeOrdenamientoFile = archivo;
          break;
        case "planDeGestionAmbientalFile":
          this.territorio.planDeGestionAmbientalFile = archivo;
          break;
        case "delimitacionDeAreasProtegidasFile":
          this.territorio.delimitacionDeAreasProtegidasFile = archivo;
          break;
        case "planDeOrdenamientoDeCuentasHidricasFile":
          this.territorio.planDeOrdenamientoDeCuentasHidricasFile = archivo;
          break;
        case "zonasForestalesProtectorasFile":
          this.territorio.zonasForestalesProtectorasFile = archivo;
          break;
        case "catastroActualizadoFile":
          this.territorio.catastroActualizadoFile = archivo;
          break;
        default:
          break;
      }
      this.showFileManager = false;
    },
    download(file) {
      this.buscarFileAction(file).then(data => {});
    },
    changePot(value) {
      if (!value) {
        this.territorio.planDeOrdenamientoFile = null;
      }
    },
    changePga(value) {
      if (!value) {
        this.territorio.planDeGestionAmbientalFile = null;
      }
    },
    changeDap(value) {
      if (!value) {
        this.territorio.delimitacionDeAreasProtegidasFile = null;
      }
    },
    changePoc(value) {
      if (!value) {
        this.territorio.planDeOrdenamientoDeCuentasHidricasFile = null;
      }
    },
    changeZfp(value) {
      if (!value) {
        this.territorio.zonasForestalesProtectorasFile = null;
      }
    },
    changeCac(value) {
      if (!value) {
        this.territorio.catastroActualizadoFile = null;
      }
    }
  },
  computed: {
    ...mapGetters("territorio", ["getTerritorioState"]),
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  }
};
</script>

<style></style>
