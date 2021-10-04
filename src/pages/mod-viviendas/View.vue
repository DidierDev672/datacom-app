<template>
  <div id="imprimir">
    <div class="text-right logo">
      <img width="164px" src="/icons/logo.png" />
    </div>
    <q-card flat bordered class="">
      <q-card-section>
        <!-- <q-btn label="imprimir" @click="imprimir" /> -->

        <q-list
          bordered
          separator
          class="report-list"
          v-if="encuesta.informacionGeneral"
        >
          <q-item>
            <q-item-section class="text-center q-pa-sm">
              <p>SISTEMA DE INFORMACIÓN DATACOM</p>
              FICHA VIVIENDA
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>1. Ficha No.</q-item-label>
              <q-item-label>{{ encuesta.id }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>2. Fecha del Registro</q-item-label>
              <q-item-label>{{ encuesta.fechaCreacion }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Sección A. Identificación</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>3. Departamento</q-item-label>
              <q-item-label>{{
                encuesta.informacionGeneral.municipio.departamento
                  .nombreDepartamento
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>4. Municipio</q-item-label>
              <q-item-label>{{
                encuesta.informacionGeneral.municipio.nombreMunicipio
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>5. Comunidad</q-item-label>
              <q-item-label>{{
                encuesta.informacionGeneral.comunidad.nombreComunidad
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>5.1. Área</q-item-label>
              <q-item-label>{{
                encuesta.informacionGeneral.area != null ? encuesta.informacionGeneral.area.nombre : ''
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>6. Dirección</q-item-label>
              <q-item-label>{{
                encuesta.informacionGeneral.direccionVivienda
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Sección B. Datos de la Vivienda</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>7. ¿Su vivienda es?</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.tenencia != null ? encuesta.infoVivienda.tenencia.nombre : ''
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption
                >8. ¿Cuántos cuartos tiene la vivienda?</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.noHabitaciones
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption
                >9. Material predominante de las paredes</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.materialParedes != null ? encuesta.infoVivienda.materialParedes.nombre : ''
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption
                >10. Estado del material predominante de las
                paredes</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.estadoParedes === 1
                  ? "Bueno"
                  : encuesta.infoVivienda.estadoParedes === 2
                  ? "Regular"
                  : "Malo"
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption
                >11. Material predominante del piso</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.materialPiso != null ? encuesta.infoVivienda.materialPiso.nombre : ''
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption
                >12. Estado del material predominante del piso</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.estadoPiso === 1
                  ? "Bueno"
                  : encuesta.infoVivienda.estadoPiso === 2
                  ? "Regular"
                  : "Malo"
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption
                >13. Material predominante del techo</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.materialTecho != null ? encuesta.infoVivienda.materialTecho.nombre : ''
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption
                >14. Estado del material predominante del techo</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.estadoTecho === 1
                  ? "Bueno"
                  : encuesta.infoVivienda.estadoTecho === 2
                  ? "Regular"
                  : "Malo"
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label
                >15. ¿Con cuáles de los siguientes servicios públicos, privados
                o comunales cuenta la vivienda?</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>15.1. Energía eléctrica</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.servicioEnergia ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>15.2. Acueducto</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.servicioAcueducto ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>15.3. Gas natural</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.servicioGas ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>15.4. Conectividad a internet</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.servicioInternet ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>15.5. Televisión</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.servicioTelevision ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>15.6. Telefonía móvil</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.servicioTelefonia ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>15.7. WhatsApp</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.servicioWhatsapp ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>16. Calidad del agua</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.calidadAgua === 1
                  ? "Potable"
                  : "Impotable"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption
                >17. Frecuencia servicio de acueducto</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.frecuenciaServicioAcueducto != null ? encuesta.infoVivienda.frecuenciaServicioAcueducto.nombre : ''
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label
                >18. Otras fuentes de captación de agua</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>18.1. Pozos profundos</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.pozoProfundo ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>18.2. Quebradas</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.quebradas ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>18.3. Ríos</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.rios ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>18.4. Represas</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.represas ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>18.5. Aguas Lluvias</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.aguasLluvias ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption
                >19. Capacidad de Almacenamiento de agua</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.capacidadAlmacenamientoAgua != null ? encuesta.infoVivienda.capacidadAlmacenamientoAgua.nombre : ''
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption
                >20. ¿Qué tipo de sanitario tiene la vivienda?</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.excretas != null ? encuesta.infoVivienda.excretas.nombre : ''
              }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>21. Disposición de residuos</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.residuos != null ? encuesta.infoVivienda.residuos.nombre : ''
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label
                >22. Su vivienda se encuetra en riesgo de</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>22.1. Inundación</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.riesgoInundacion ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>22.2. Avalancha</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.riesgoAvalancha ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>22.3. Deslizamiento</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.riesgoDeslizamiento ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>22.4. Vendaval</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.riesgoVendaval ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption
                >22.5. Condición inadecuada de instalaciones
                electricas</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.riesgoElectrico ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label caption>22.6. Incendio</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.riesgoIncendio ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption
                >22.7. Presencia de ductos o instalaciones
                eléctricas</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.riesgoDuctos ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption
                >23. No. Familias en la vivienda</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.noFamilias
              }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption
                >24. No. Personas en la vivienda</q-item-label
              >
              <q-item-label>{{
                encuesta.infoVivienda.noPersonas
              }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label
                >25. Productos pecuarios, piscícola y agrícolas de la
                vivienda</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Producto</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>Cantidad</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-for="prod in encuesta.productosVivienda" :key="prod.id">
            <q-item-section>
              <q-item-label>{{ prod.producto.nombre }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ prod.cantidad }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>26. Integrantes de la vivienda</q-item-label>
            </q-item-section>
          </q-item>
          <div
            v-for="(integrante, index) in encuesta.integrantes"
            :key="integrante.id"
          >
            <q-item>
              <q-item-section>
                <q-item-label>Integrante No. {{ index + 1 }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Tipo Documento</q-item-label>
                <q-item-label>{{
                  integrante.tipoDocumento.nombre
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>No. Documento</q-item-label>
                <q-item-label>{{ integrante.noDocumento }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Nombre</q-item-label>
                <q-item-label>{{
                  integrante.nombre +
                    " " +
                    integrante.primerApellido +
                    " " +
                    integrante.segundoApellido
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Sexo</q-item-label>
                <q-item-label>{{ integrante.sexo.nombre }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Fecha de Nacimiento</q-item-label>
                <q-item-label>{{ integrante.fechaNacimiento }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Edad</q-item-label>
                <q-item-label>{{ integrante.edad }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Etnia</q-item-label>
                <q-item-label>{{ integrante.etnia.nombre }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Ocupación</q-item-label>
                <q-item-label>{{ integrante.ocupacion.nombre }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Nivel de Educativo</q-item-label>
                <q-item-label>{{
                  integrante.nivelEducativo.nombre
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Seguridad Social</q-item-label>
                <q-item-label>{{
                  integrante.seguridadSocial.nombre
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption
                  >¿Presenta alguna Discapacidad?</q-item-label
                >
                <q-item-label>{{
                  !integrante.discapacidadNoPresenta ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="!integrante.discapacidadNoPresenta">
              <q-item-section>
                <q-item-label caption>¿Discapacidad Física?</q-item-label>
                <q-item-label>{{
                  integrante.discapacidadFisica ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>¿Discapacidad Mental?</q-item-label>
                <q-item-label>{{
                  integrante.discapacidadMental ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>¿Discapacidad visual?</q-item-label>
                <q-item-label>{{
                  integrante.discapacidadVisual ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>¿Discapacidad auditiva?</q-item-label>
                <q-item-label>{{
                  integrante.discapacidadAuditiva ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption
                  >¿Se encuentra registrado en Familias en Acción?</q-item-label
                >
                <q-item-label>{{
                  integrante.programaFamiliasEnAccion ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption
                  >¿Se encuentra registrado como Desplazado o
                  Víctima?</q-item-label
                >
                <q-item-label>{{
                  integrante.programaDesplazadoVictima ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption
                  >¿Se encuetra registrado en el programa de Jóvenes en
                  Acción?</q-item-label
                >
                <q-item-label>{{
                  integrante.programaJovenesEnAccion ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption
                  >¿Ha sido beneficiario de Ingresos Solidario?</q-item-label
                >
                <q-item-label>{{
                  integrante.programaIngresoSolidario ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption
                  >¿Se encuentra registrado en el programa de Adulto
                  Mayor?</q-item-label
                >
                <q-item-label>{{
                  integrante.programaAdultoMayor ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <q-item>
            <q-item-section>
              <q-item-label
                >Autorización del Jefe de Hogar o de la persona que brinda la
                información</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Nombre</q-item-label>
              <q-item-label>{{
                encuesta.infoVivienda.nombre +
                  " " +
                  encuesta.infoVivienda.primerApellido +
                  " " +
                  encuesta.infoVivienda.segundoApellido
              }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Teléfono</q-item-label>
              <q-item-label>{{ encuesta.infoVivienda.telefono }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Email</q-item-label>
              <q-item-label>{{ encuesta.infoVivienda.email }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-page-sticky class="botones" position="bottom-right" :offset="[18, 18]">
      <q-fab
        vertical-actions-align="right"
        color="primary"
        glossy
        icon="keyboard_arrow_up"
        direction="up"
      >
        <q-fab-action
          label-position="left"
          color="positive"
          @click="bajarVivienda"
          icon="download"
          label="Descargar"
        />
        <q-fab-action
          label-position="left"
          color="primary"
          @click="imprimir"
          icon="print"
          label="Imprimir"
        />
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import print from "print-js";
import axios from "axios";
import { URL_API } from "src/utils/config";
export default {
  data() {
    return {
      encuesta: {},
      encuestaID: ""
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.buscarEncuestaAction(this.encuestaID).then(data => {
      this.encuesta = data;
    });
  },
  methods: {
    ...mapActions("encuesta", ["buscarEncuestaAction"]),
    imprimir() {
      // print('imprimir', 'html')
      window.print();
    },

    bajarVivienda() {
      const urlService = "reportes/ficha-municipal";
      const encuestaID = this.encuesta.id;
      axios
        .get(`${URL_API}/${urlService}/${encuestaID}`, { responseType: "blob" })
        .then(({ data }) => {
          console.log("DATA: ", data);
          setTimeout(() => {
            const url = window.URL.createObjectURL(data);
            console.log("Url: ", url);
            const a = document.createElement("a");
            a.setAttribute("style", "display:none;");
            document.body.appendChild(a);
            a.href = url;
            a.download = this.encuesta.descripcion + ".xls";
            a.click();
            return url;
          }, 500);
        })
        .catch(error => {
          console.log("Error: ", error.response);
        });
    }
  },

  computed: {
    // ...mapGetters("encuesta", ["getEncuestaState"]),
    // encuesta() {
    //   return this.getEncuestaState.objEncuesta;
    // }
  }
};
</script>

<style lang="sass">

.report-list
  .q-item
    padding-top: 0 !important
    padding-bottom: 0 !important
    padding-right: 0 !important

  .q-item__section
    border-right: 1px solid #ccc

body
  font-size: 12px !important

.fondo
  background-color: #E8E8E8

.bordes
  border: 1px solid #ccc !important

@media screen
  .logo
    display: none

@media print
  .logo
    display: block
    text-align: right !important

  .botones
    display: none !important

  .q-item__label--caption
    font-family: Arial, monospace
    color: rgba(0, 0, 0, 0.85)
</style>
