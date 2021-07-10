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
              <p>Sistema de Información DATACOM</p>
              FICHA MUNICIPIO
              {{ encuesta.informacionGeneral.municipio.nombreMunicipio }}
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>1. Ubicación</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Departamento</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.municipio.departamento
                  .nombreDepartamento
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Municipio</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.municipio.nombreMunicipio
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Región</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.region
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Límite Norte</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.limiteNorte
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Límite Sur</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.limiteSur
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Límite Oriente</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.limiteOriente
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Límite Occidente</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.limiteOccidente
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Composición</q-item-label>
              <q-item-label caption
                >{{ encuesta.informacionGeneral.composicion }} (Veredas)
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Gentilicio</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.gentilicio
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Altitud</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.altitud
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Fecha de Fundación</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.fechaFundacion
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Categoria</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.categoria
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Emblema</q-item-label>
              <q-item-label caption
                >{{ encuesta.informacionGeneral.emblema }}
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Personaje representativo</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.personajeRepresentativo
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>2. Demografía</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Población Urbana</q-item-label>
              <q-item-label caption
                >{{ encuesta.informacionGeneral.poblacionUrbana }}
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Población Rural</q-item-label>
              <q-item-label caption>{{
                new Intl.NumberFormat().format(
                  encuesta.informacionGeneral.poblacionRural
                )
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>No. de Hombres</q-item-label>
              <q-item-label caption
                >{{
                  new Intl.NumberFormat().format(
                    encuesta.informacionGeneral.noHombres
                  )
                }}
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>No. Mujeres</q-item-label>
              <q-item-label caption>{{
                new Intl.NumberFormat().format(
                  encuesta.informacionGeneral.noMujeres
                )
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>No. de Indígenas</q-item-label>
              <q-item-label caption
                >{{
                  new Intl.NumberFormat().format(
                    encuesta.informacionGeneral.noIndigenas
                  )
                }}
              </q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>No. de Afros</q-item-label>
              <q-item-label caption>{{
                new Intl.NumberFormat().format(
                  encuesta.informacionGeneral.noAfro
                )
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Tasa de Fecundidad</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.informacionGeneral.tasaFecundidad
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Tasa de Natalidad</q-item-label>
              <q-item-label caption
                >{{ encuesta.informacionGeneral.tasaNatalidad }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Densidad (Personas/Kilómetros (2))</q-item-label>
              <q-item-label caption
                >{{ encuesta.informacionGeneral.densidad }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>2.1. Composición Etaria</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Rango de edades</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-center">Nro. De Personas</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-center">%</q-item-label>
            </q-item-section>
          </q-item>

          <div v-if="encuesta.poblacionPorRangoDeEdads">
            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 0 y 4 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  new Intl.NumberFormat().format(
                    encuesta.poblacionPorRangoDeEdads.de0A4Anos
                  )
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de0A4Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 5 y 9 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  new Intl.NumberFormat().format(
                    encuesta.poblacionPorRangoDeEdads.de5A9Anos
                  )
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de5A9Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 10 y 14 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de10A14Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de10A14Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 15 y 19 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de15A19Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de15A19Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 20 y 24 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de20A24Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de20A24Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 25 y 29 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de25A29Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de25A29Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 30 y 34 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de30A34Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de30A34Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 35 y 39 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de35A39Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de35A39Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 40 y 44 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de40A44Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de40A44Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 45 y 49 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de45A49Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de45A49Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 50 y 54 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de50A54Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de50A54Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 55 y 59 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de55A59Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de55A59Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 60 y 64 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de60A64Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de60A64Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 65 y 69 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de65A69Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de65A69Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 70 y 74 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de70A74Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de70A74Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Entre los 75 y 79 años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.de75A79Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.de75A79Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>De 80 o más años</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  encuesta.poblacionPorRangoDeEdads.mayorA80Anos
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  (
                    (encuesta.poblacionPorRangoDeEdads.mayorA80Anos /
                      totalPoblacion) *
                    100
                  ).toFixed(2)
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Total</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption class="text-center">{{
                  totalPoblacion
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label caption></q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <q-item>
            <q-item-section>
              <q-item-label
                >3. Calidad de vida ({{
                  encuesta.calidadVida.ano
                }})</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Índice de pobreza multidimensional</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>IPM Total</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.ipmTotal }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>IPM Urbano</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.ipmUrbana }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>IPM Rural</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.ipmRural }} %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Necesidades básicas insatisfechas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>NBI Urbano</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.nbi_urbano }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>NBI Rural</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.nbi_rural }} %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Población en condición de miseria</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>PCM Total</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.pcm }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>PCM Urbano</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.pcmUrbano }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>PCM Rural</q-item-label>
              <q-item-label caption
                >{{ encuesta.calidadVida.pcmRural }} %</q-item-label
              >
            </q-item-section>
          </q-item>

          <!-- Educación -->
          <q-item>
            <q-item-section>
              <q-item-label
                >4. Educación ({{ encuesta.educacion.ano }})</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura neta transición</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaNetaTransicion
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura neta básica primaria</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaNetaBasicaPrimaria
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura neta básica secundaria</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaNetaBasicaSecundaria
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura neta media</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaNetaEducacionMedia
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura neta total</q-item-label>
              <q-item-label caption
                >{{ encuesta.educacion.coberturaNetaTotal }} %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura bruta transición</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaBrutaTransicion
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura bruta básica primaria</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaBrutaBasicaPrimaria
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura bruta básica secundaria</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaBrutaBasicaSecundaria
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura bruta media</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.coberturaBrutaEducacionMedia
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura bruta total</q-item-label>
              <q-item-label caption
                >{{ encuesta.educacion.coberturaBrutaTotal }} %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Tasa de analfabetismo urbano</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.tasaDeAnalfabestismoUrbano
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Tasa de analfabetismo rural</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.educacion.tasaDeAnalfabestismoRural
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label
                >Puntaje promedio prueba saber 11 matemáticas</q-item-label
              >
              <q-item-label caption>{{
                encuesta.educacion.puntajePromedioSaberMatematica
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label
                >Puntaje promedio prueba saber 11 lectura crítica</q-item-label
              >
              <q-item-label caption>{{
                encuesta.educacion.puntajePromedioSaberLectura
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Vivienda -->
          <q-item>
            <q-item-section>
              <q-item-label>5. Vivienda</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Número de viviendas urbanas</q-item-label>
              <q-item-label caption>{{
                encuesta.vivienda.numeroDeViviendasUrbanas
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Número de viviendas rurales</q-item-label>
              <q-item-label caption>{{
                encuesta.vivienda.numeroDeViviendasRurales
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Número de hogares urbanos</q-item-label>
              <q-item-label caption>{{
                encuesta.vivienda.numeroDeHogaresUrbanos
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Número de hogares rurales</q-item-label>
              <q-item-label caption>{{
                encuesta.vivienda.numeroDeHogaresRurales
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Déficit cuantitativo</q-item-label>
              <q-item-label caption
                >{{ encuesta.vivienda.deficitCuantitativo }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Déficit cualitativo</q-item-label>
              <q-item-label caption
                >{{ encuesta.vivienda.deficitCualitativo }} %</q-item-label
              >
            </q-item-section>
          </q-item>

          <!-- Servicios públicos -->
          <q-item>
            <q-item-section>
              <q-item-label>Servicios</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura energía eléctrica urbana</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.energiaElectricaUrbana
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura energía eléctrica rural</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.energiaElectricaRural
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura acueducto urbano</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.acueductoUrbano
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura acueducto rural</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.acueductoRural
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura alcantarillado urbano</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.alcantarilladoUrbana
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura alcantarillado rural</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.alcantarilladoRural
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura gas natural urbano</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.gasNaturalUrbana
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura gas natural rural</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.gasNaturalRural
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Cobertura internet urbano</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.internetUrbana
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Cobertura internet rural</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.coberturaEnServicios.internetRural
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <!-- Seguridad -->
          <q-item>
            <q-item-section>
              <q-item-label>6. Seguridad</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="encuesta.seguridad">
            <q-item-section>
              <q-item-label>Homicidios año</q-item-label>
              <q-item-label caption>{{
                encuesta.seguridad.homicidiosPorAno
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Tasa de Homicidios</q-item-label>
              <q-item-label caption
                >{{ encuesta.seguridad.tasaHomicidios }} %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Población víctima</q-item-label>
              <q-item-label caption>{{
                encuesta.seguridad.poblacionVictimaDelConflicto
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-if="encuesta.seguridad">
            <q-item-section>
              <q-item-label>Otros delitos</q-item-label>
              <q-item-label caption>{{
                encuesta.seguridad.otrosDelitos
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Administración pública -->
          <q-item>
            <q-item-section>
              <q-item-label>7. Administración Pública</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Dirección Alcaldía</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.direccionAlcaldia
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Teléfono fijo</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.telefono
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Horario de Atención</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.horarioDeAtencion
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Email</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.correo
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Página Web</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.paginaWeb
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Facebook</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.paginaDeFacebook
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Alcalde</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.alcalde
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Partido político</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.partidoPolitico
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Teléfono</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.telefonoAlcalde
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Email alcalde</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.correoAlcalde
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>No. Funcionarios de la Alcaldia</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.numeroFuncionarios
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Gabinete Municipal -->
          <q-item>
            <q-item-section>
              <q-item-label>Gabinete municipal</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <div
            v-for="secretaria in encuesta.administracionPublica"
            :key="secretaria.id"
          >
            <q-item>
              <q-item-section>
                <q-item-label>{{ secretaria.idGabinete.nombre }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Contacto</q-item-label>
                <q-item-label caption>{{
                  secretaria.nombreContacto
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Teléfono</q-item-label>
                <q-item-label caption>{{ secretaria.telefono }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-item-label caption>{{ secretaria.correo }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <!-- Políticas públicas -->
          <q-item>
            <q-item-section>
              <q-item-label>Políticas públicas</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <div v-for="politica in encuesta.politicas" :key="politica.id">
            <q-item>
              <q-item-section>
                <!-- <q-item-label>Política</q-item-label> -->
                <q-item-label>{{ politica.tipoPolitica.nombre }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>No. Acuerdo municipal</q-item-label>
                <q-item-label caption>{{ politica.numero }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Año</q-item-label>
                <q-item-label caption>{{ politica.ano }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <!-- Organizaciones -->
          <q-item>
            <q-item-section>
              <q-item-label>8. Organizaciones</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <div v-for="org in encuesta.organizaciones" :key="org.id">
            <q-item>
              <q-item-section>
                <!-- <q-item-label>Tipo</q-item-label> -->
                <q-item-label>{{ org.nombre }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Tipo de Organización</q-item-label>
                <q-item-label caption>{{
                  org.idOrganizacion.nombre
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Teléfono</q-item-label>
                <q-item-label caption>{{ org.telefono }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-item-label caption>{{ org.correo }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Contacto</q-item-label>
                <q-item-label caption>{{ org.contacto }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Dirección</q-item-label>
                <q-item-label caption>{{ org.direccion }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Actividades que realizan</q-item-label>
                <q-item-label caption>{{ org.tipoActividad }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <!-- Infraestructura -->
          <q-item>
            <q-item-section>
              <q-item-label>9. Infraestructura Pública</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <div v-for="infra in encuesta.infraestructuras" :key="infra.id">
            <q-item>
              <q-item-section>
                <q-item-label>{{
                  infra.tipoInfraestructura.nombre
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Contacto</q-item-label>
                <q-item-label caption>{{ infra.contacto }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Teléfono</q-item-label>
                <q-item-label caption>{{ infra.telefono }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Dirección</q-item-label>
                <q-item-label caption>{{ infra.direccion }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Email</q-item-label>
                <q-item-label caption>{{ infra.correo }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <!-- Finanzas -->
          <q-item>
            <q-item-section>
              <q-item-label>10. Finanzas municipales</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <div v-for="finanza in encuesta.finanzas" :key="finanza.id">
            <q-item>
              <q-item-section>
                <q-item-label>{{
                  finanza.tipoIndicadorFinanza.nombre
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Monto (en pesos)</q-item-label>
                <q-item-label caption
                  >${{
                    new Intl.NumberFormat().format(finanza.valor)
                  }}</q-item-label
                >
              </q-item-section>

              <q-item-section>
                <q-item-label>Periodo</q-item-label>
                <q-item-label caption>{{ finanza.periodo }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Observación</q-item-label>
                <q-item-label caption>{{ finanza.observacion }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <!-- Indicadores -->
          <q-item>
            <q-item-section>
              <q-item-label>11. Indicadores de Gestión</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Índice de desempeño fiscal</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.indiceDeDesempenoFiscal
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Nivel</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.nivelDeDesempeño
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Índice de funcionamiento</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.indiceDeFuncionamiento
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>¿Cumple límite de ley 617 de 2000?</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.cumpleLimiteDeley ? "Si" : "No"
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Dependencia de transferencia</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.dependenciaDetransferencia
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Índice de gestión y transparencia</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.indiceDeGestionYTransferencia
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Índice de resultados</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.indiceDeResultado
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Medidor de desempeño municipal</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.medidorDesempenoMunicipal
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>Nivel</q-item-label>
              <q-item-label caption>{{
                encuesta.indicadores.nivelDesempenoMunicipal
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <!-- Territorio -->
          <q-item>
            <q-item-section>
              <q-item-label>12. Territorio</q-item-label>
            </q-item-section>
          </q-item>

          <div v-if="encuesta.territorio">
            <q-item>
              <q-item-section>
                <q-item-label
                  >¿Cuenta con Plan de ordenamiento territorial?</q-item-label
                >
                <q-item-label caption>{{
                  encuesta.territorio.planDeOrdenamiento ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Documento Anexo</q-item-label>
                <q-item-label caption>{{
                  encuesta.territorio.planDeOrdenamientoFile
                    ? encuesta.territorio.planDeOrdenamientoFile.nombreOriginal
                    : "No registra"
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label
                  >¿Cuenta con Plan de gestión ambiental?</q-item-label
                >
                <q-item-label caption>{{
                  encuesta.territorio.planDeGestionAmbiental ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Documento Anexo</q-item-label>
                <q-item-label caption>{{
                  encuesta.territorio.planDeGestionAmbientalFile
                    ? encuesta.territorio.planDeGestionAmbientalFile
                        .nombreOriginal
                    : "No registra"
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label
                  >¿Cuenta con delimitación de áreas protegidas?</q-item-label
                >
                <q-item-label caption>{{
                  encuesta.territorio.delimitacionDeAreasProtegidas
                    ? "Si"
                    : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Documento Anexo</q-item-label>
                <q-item-label caption>{{
                  encuesta.territorio.delimitacionDeAreasProtegidasFile
                    ? encuesta.territorio.delimitacionDeAreasProtegidasFile
                        .nombreOriginal
                    : "No registra"
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label
                  >¿Cuenta con plan de ordenamiento de cuencas
                  hidrográficas?</q-item-label
                >
                <q-item-label caption>{{
                  encuesta.territorio.planDeOrdenamientoDeCuentasHidricas
                    ? "Si"
                    : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Documento Anexo</q-item-label>
                <q-item-label caption>{{
                  encuesta.territorio.planDeOrdenamientoDeCuentasHidricasFile
                    ? encuesta.territorio
                        .planDeOrdenamientoDeCuentasHidricasFile.nombreOriginal
                    : "No registra"
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label
                  >¿Cuenta con zonas forestales protectoras?</q-item-label
                >
                <q-item-label caption>{{
                  encuesta.territorio.zonasForestalesProtectoras ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Documento Anexo</q-item-label>
                <q-item-label caption>{{
                  encuesta.territorio.zonasForestalesProtectorasFile
                    ? encuesta.territorio.zonasForestalesProtectorasFile
                        .nombreOriginal
                    : "No registra"
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label
                  >¿Está el municipio en zona de parques nacionales
                  naturales?</q-item-label
                >
                <q-item-label caption>{{
                  encuesta.territorio.enZonaDeParquesNaturales ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Nombre del parque</q-item-label>
                <q-item-label caption>{{
                  encuesta.territorio.nombreParque
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label
                  >¿Cuenta con el catastro actualizado?</q-item-label
                >
                <q-item-label caption>{{
                  encuesta.territorio.catastroActualizado ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Documento Anexo</q-item-label>
                <q-item-label caption>{{
                  encuesta.territorio.catastroActualizadoFile
                    ? encuesta.territorio.catastroActualizadoFile.nombreOriginal
                    : "No registra"
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <!-- Participación -->
          <q-item>
            <q-item-section>
              <q-item-label>13. Participación</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>% de participación elecciones locales</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.informacionGeneral.porcentajeElecciones
                }}
                %</q-item-label
              >
            </q-item-section>

            <q-item-section>
              <q-item-label>Total votos del alcalde</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.totalVotosAlcalde
              }}</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label>% votos</q-item-label>
              <q-item-label caption
                >{{
                  encuesta.informacionGeneral.porcentajeVotos
                }}
                %</q-item-label
              >
            </q-item-section>
          </q-item>

          <!-- Participación -->
          <q-item>
            <q-item-section>
              <q-item-label>14. Medios de Comunicación</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <div v-for="medio in encuesta.medios" :key="medio.id">
            <q-item>
              <q-item-section>
                <q-item-label>Tipo medio de comunicación</q-item-label>
                <q-item-label caption>{{
                  medio.tipoMedio.nombre
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>¿El medio es público?</q-item-label>
                <q-item-label caption>{{
                  medio.publico ? "Si" : "No"
                }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Nombre</q-item-label>
                <q-item-label caption>{{ medio.nombre }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section>
                <q-item-label>Contacto</q-item-label>
                <q-item-label caption>{{ medio.contacto }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Teléfono</q-item-label>
                <q-item-label caption>{{ medio.telefono }}</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>Alcance</q-item-label>
                <q-item-label caption>{{ medio.alcance }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <!-- Economía -->
          <q-item>
            <q-item-section>
              <q-item-label>15. Economía y marca propia</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section>
              <q-item-label>Productos principales del municipio</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <div v-for="producto in encuesta.productos" :key="producto.id">
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ producto.nombre }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
          </div>

          <q-item>
            <q-item-section>
              <q-item-label>Producto artesanal característico</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.productoArtesanal
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Riqueza natural orgullo del municipio</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.riquezaNatural
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Bien o expresión cultural</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.expresionCultural
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>Expresión artística</q-item-label>
              <q-item-label caption>{{
                encuesta.informacionGeneral.expresionArtistica
              }}</q-item-label>
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
          @click="bajarMunicipios"
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
import { mapGetters } from "vuex";
import print from "print-js";
import axios from "axios";
import { URL_API } from "src/utils/config";
export default {
  methods: {
    imprimir() {
      // print('imprimir', 'html')
      window.print();
    },

    bajarMunicipios() {
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
    ...mapGetters("encuesta", ["getEncuestaState"]),
    encuesta() {
      return this.getEncuestaState.objEncuesta;
    },
    totalPoblacion() {
      let total = 0;

      total =
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de0A4Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de5A9Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de10A14Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de20A24Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de15A19Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de25A29Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de30A34Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de35A39Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de40A44Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de45A49Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de50A54Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de55A59Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de60A64Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de65A69Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de70A74Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.de75A79Anos +
        this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads.mayorA80Anos;

      return total;
    }
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
