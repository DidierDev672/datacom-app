<template>
    <div id="imprimir" ref="testHtml">
        <div class="text-right logo">
            <img width="164px" src="/icons/logo.png" />
        </div>
        <q-card flat bordered class="">
            <q-card-section>
                <q-list
                    bordered
                    separator
                    class="report-list"
                    v-if="encuesta.informacionGeneral"
                >
                    <q-item>
                        <q-item-section class="text-center q-pa-sm">
                            <p>Sistema de Información DATACOM</p>
                            FICHA COMUNIDAD
                            {{
                                encuesta.informacionGeneral.comunidad
                                    .nombreComunidad
                            }}
                        </q-item-section>
                    </q-item>

                    <!-- Infraestructura Pública -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >1. Informaci&oacute;n general</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item>
                        <q-item-section>
                            <q-item-label>Departamento</q-item-label>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.municipio
                                    .departamento.nombreDepartamento
                            }}</q-item-label>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>Municipio</q-item-label>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.municipio
                                    .nombreMunicipio
                            }}</q-item-label>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>Comunidad</q-item-label>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.comunidad
                                    .nombreComunidad
                            }}</q-item-label>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>Extensi&oacute;n en KM</q-item-label>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.extension
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >Distancia a la cabecera en tiempo</q-item-label
                            >
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.distanciaTiempo
                            }}</q-item-label>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label
                                >Distancia a la cabecera en
                                kil&oacute;metros</q-item-label
                            >
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.distanciaKm
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label>Nombre del Inspector</q-item-label>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.nombreInspector
                            }}</q-item-label>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>Tel&eacute;fono</q-item-label>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.telefonoInspector
                            }}</q-item-label>
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Direcci&oacute;n</q-item-label>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.direccionInspector
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <!-- Organizaciones -->
                    <q-item>
                        <q-item-section>
                            <q-item-label>2. Organizaciones.</q-item-label>
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
                                <q-item-label
                                    >Tipo de Organización</q-item-label
                                >
                                <q-item-label caption>{{
                                    org.idOrganizacion.nombre
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Teléfono</q-item-label>
                                <q-item-label caption>{{
                                    org.telefono
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Email</q-item-label>
                                <q-item-label caption>{{
                                    org.correo
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-item>
                            <q-item-section>
                                <q-item-label>Contacto</q-item-label>
                                <q-item-label caption>{{
                                    org.contacto
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Dirección</q-item-label>
                                <q-item-label caption>{{
                                    org.direccion
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >Actividades que realizan</q-item-label
                                >
                                <q-item-label caption>{{
                                    org.tipoActividad
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />
                    </div>

                    <!-- Vias de acceso -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >3. Vias de acceso a la comunidad</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div v-for="via in encuesta.viasAcceso" :key="via.id">
                        <q-item>
                            <q-item-section>
                                <q-item-label>Vía</q-item-label>
                                <q-item-label caption>{{
                                    via.tipoVia.nombre
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Estado</q-item-label>
                                <q-item-label caption>{{
                                    via.estadoVia
                                }}</q-item-label>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label
                                    >¿Es transitable todo el año?</q-item-label
                                >
                                <q-item-label caption>{{
                                    via.transitable ? 'Si' : 'No'
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator />
                    </div>

                    <!-- Infraestructura Pública -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >4. Infraestructura P&uacute;blica</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div
                        v-for="infraestructura in encuesta.infraestructuras"
                        :key="infraestructura.id"
                    >
                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >Tipo de Infraestructura</q-item-label
                                >
                                <q-item-label caption>{{
                                    infraestructura.tipoInfraestructura.nombre
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />
                        <q-item>
                            <q-item-section>
                                <q-item-label>Contacto</q-item-label>
                                <q-item-label caption>{{
                                    infraestructura.contacto
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Tel&eacute;fono</q-item-label>
                                <q-item-label caption>{{
                                    infraestructura.telefono
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Correo</q-item-label>
                                <q-item-label caption>{{
                                    infraestructura.correo
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Direcci&oacute;n</q-item-label>
                                <q-item-label caption>{{
                                    infraestructura.direccion
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator />
                    </div>

                    <!-- Medios de Comunicación -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >5. Medios de Comunicaci&oacute;n</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div v-for="medio in encuesta.medios" :key="medio.id">
                        <q-item>
                            <q-item-section>
                                <q-item-label>Tipo de Medio</q-item-label>
                                <q-item-label caption
                                    >{{ medio.tipoMedio.nombre }}
                                    {{ medio.nombre }}</q-item-label
                                >
                            </q-item-section>
                        </q-item>

                        <q-separator />
                        <q-item>
                            <q-item-section>
                                <q-item-label>Contacto</q-item-label>
                                <q-item-label caption>{{
                                    medio.contacto
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Tel&eacute;fono</q-item-label>
                                <q-item-label caption>{{
                                    medio.telefono
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator />
                    </div>

                    <!-- Ecosistemas -->
                    <q-item>
                        <q-item-section>
                            <q-item-label>6. Ecosistemas</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div
                        v-for="ecosistema in encuesta.ecosistemas"
                        :key="ecosistema.id"
                    >
                        <q-item>
                            <q-item-section>
                                <q-item-label>Tipo de Ecosistema</q-item-label>
                                <q-item-label caption>{{
                                    ecosistema.tipoEcosistema.nombre
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Nombre</q-item-label>
                                <q-item-label caption>{{
                                    ecosistema.nombre
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator />
                    </div>

                    <!-- Salud -->
                    <q-item>
                        <q-item-section>
                            <q-item-label>7. Salud</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div
                        v-for="infrasalud in encuesta.infraestructuraSalud"
                        :key="infrasalud.id"
                    >
                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >Tipo de Infraestructura</q-item-label
                                >
                                <q-item-label caption>{{
                                    infrasalud.tipoInfraestructura.nombre
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-item>
                            <q-item-section>
                                <q-item-label>tel&eacute;fono</q-item-label>
                                <q-item-label caption>{{
                                    infrasalud.telefono
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Celular</q-item-label>
                                <q-item-label caption>{{
                                    infrasalud.celular
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >&Aacute;rea construida</q-item-label
                                >
                                <q-item-label caption>{{
                                    infrasalud.areaConstruida
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>&Aacute;rea total</q-item-label>
                                <q-item-label caption>{{
                                    infrasalud.areaTotal
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-separator />
                    </div>

                    <!-- Vivienda -->
                    <q-item>
                        <q-item-section>
                            <q-item-label>8. Viviendas</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item v-if="encuesta.vivienda">
                        <q-item-section>
                            <q-item-label>No. Viviendas</q-item-label>
                            <q-item-label caption>{{
                                encuesta.vivienda.numeroDeViviendasUrbanas
                            }}</q-item-label>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label>No. Familias</q-item-label>
                            <q-item-label caption>{{
                                encuesta.vivienda.numeroDeHogaresUrbanos
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-separator />

                    <!-- Instituciones Educativas -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >9. Instituciones Educativas</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div
                        v-for="institucionEducativa in encuesta.institucionesEducativas"
                        :key="institucionEducativa.id"
                    >
                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >Tipo de Instituci&oacute;n</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.tipoInstitucion
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Nivel Ofertado</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.nivel.nombre
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>No. de Aulas</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.noAulas
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>No. de Docentes</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.noProfesores
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>No. de Alumnos</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.noAlumnos
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-item>
                            <q-item-section>
                                <q-item-label>Direcci&oacute;n</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.direccion
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Tel&eacute;fono</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.telefono
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Email</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.email
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label
                                    >Estado Planta F&iacute;sica</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.estadoPlantaFisica
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label
                                    >&Aacute;rea construida</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.areaConstruida
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>&Aacute;rea total</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.areaTotal
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >¿Tiene restaurante escolar?</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.restauranteEscolar
                                        ? 'Si'
                                        : 'No'
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label
                                    >¿Tiene unidad sanitaria?</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.unidadSanitaria
                                        ? 'Si'
                                        : 'No'
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>¿Tiene biblioteca?</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.biblioteca
                                        ? 'Si'
                                        : 'No'
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>¿Tiene auditorio?</q-item-label>
                                <q-item-label caption>{{
                                    institucionEducativa.auditorio ? 'Si' : 'No'
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >Sistema de Disposici&oacute;n de
                                    excretas</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.disposicionExcreta
                                        .nombre
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label
                                    >¿Tiene servicio de energ&iacute;a
                                    el&eacute;ctrica?</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.servicioEnergia
                                        ? 'Si'
                                        : 'No'
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label
                                    >¿Tiene servicio de acueducto?</q-item-label
                                >
                                <q-item-label caption>{{
                                    institucionEducativa.servicioAcueducto
                                        ? 'Si'
                                        : 'No'
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <div
                            v-if="
                                institucionEducativa
                                    .personalInstitucionEducativa.length > 0
                            "
                        >
                            <q-item>
                                <q-item-section>
                                    <q-item-label
                                        >Personal Instituci&oacute;n
                                        Educativa</q-item-label
                                    >
                                </q-item-section>
                            </q-item>

                            <q-separator />

                            <div
                                v-for="personal in institucionEducativa.personalInstitucionEducativa"
                                :key="personal.id"
                            >
                                <q-item>
                                    <q-item-section>
                                        <q-item-label>Cargo</q-item-label>
                                        <q-item-label caption>{{
                                            personal.cargo.nombre
                                        }}</q-item-label>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>Nombre</q-item-label>
                                        <q-item-label caption
                                            >{{ personal.nombre }}
                                            {{ personal.primerApellido }}
                                            {{
                                                personal.segundoApellido
                                            }}</q-item-label
                                        >
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label
                                            >Tel&eacute;fono</q-item-label
                                        >
                                        <q-item-label caption>{{
                                            personal.telefono
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                    </div>

                    <!-- Comité; de Emergencias -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >10. Comit&eacute; de Emergencias</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div
                        v-for="comite in encuesta.comiteEmergencia"
                        :key="comite.id"
                    >
                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >Nombre del Comit&eacute;</q-item-label
                                >
                                <q-item-label caption>{{
                                    comite.nombreComite
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />

                        <div
                            v-if="comite.integrantesComiteEmergencia.length > 0"
                        >
                            <q-item>
                                <q-item-section>
                                    <q-item-label
                                        >Integrantes del Comit&eacute; de
                                        Emergencias</q-item-label
                                    >
                                </q-item-section>
                            </q-item>

                            <q-separator />

                            <div
                                v-for="persona in comite.integrantesComiteEmergencia"
                                :key="persona.id"
                            >
                                <q-item>
                                    <q-item-section>
                                        <q-item-label>Cargo</q-item-label>
                                        <q-item-label caption>{{
                                            persona.tipoCargo.nombre
                                        }}</q-item-label>
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label>Nombre</q-item-label>
                                        <q-item-label caption
                                            >{{ persona.nombre }}
                                            {{ persona.primerApellido }}
                                            {{
                                                persona.segundoApellido
                                            }}</q-item-label
                                        >
                                    </q-item-section>

                                    <q-item-section>
                                        <q-item-label
                                            >Tel&eacute;fono</q-item-label
                                        >
                                        <q-item-label caption>{{
                                            persona.telefono
                                        }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </div>
                    </div>

                    <!-- Actividades económicas -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >11. Actividades Econ&oacute;micas</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div
                        v-for="actEconomica in encuesta.actividadesEconomicas"
                        :key="actEconomica.id"
                    >
                        <q-item>
                            <q-item-section>
                                <q-item-label caption>{{
                                    actEconomica.actividadEconomica.nombre
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />
                    </div>

                    <!-- Participación Ciudadana -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >12. Participaci&oacute;n
                                Ciudadana</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <div
                        v-for="participacion in encuesta.participacionCiudadana"
                        :key="participacion.id"
                    >
                        <q-item>
                            <q-item-section>
                                <q-item-label
                                    >Espacio de
                                    Participac&oacute;n</q-item-label
                                >
                                <q-item-label caption>{{
                                    participacion.tipoParticipacion.nombre
                                }}</q-item-label>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>Observaci&oacute;n</q-item-label>
                                <q-item-label caption>{{
                                    participacion.observacion
                                }}</q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-separator />
                    </div>

                    <!-- Fiestas Tradicionales -->
                    <q-item>
                        <q-item-section>
                            <q-item-label
                                >13. Fiestas Tradicionales</q-item-label
                            >
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item>
                        <q-item-section>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.expresionCultural
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item>
                        <q-item-section>
                            <q-item-label caption>{{
                                encuesta.informacionGeneral.expresionArtistica
                            }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

        <q-page-sticky
            class="botones"
            position="bottom-right"
            :offset="[18, 18]"
        >
            <q-fab
                vertical-actions-align="right"
                color="primary"
                glossy
                icon="keyboard_arrow_up"
                direction="up"
            >
                <!-- <q-fab-action
          label-position="left"
          color="positive"
          @click="bajarMunicipios"
          icon="download"
          label="Descargar"
        /> -->
                <q-fab-action
                    label-position="left"
                    color="primary"
                    @click="generarPdf"
                    icon="print"
                    label="Imprimir"
                />
            </q-fab>
        </q-page-sticky>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import print from 'print-js';
import axios from 'axios';
import { URL_API } from 'src/utils/config';
import { jsPDF } from 'jspdf';
export default {
    methods: {
        imprimir() {
            // print('imprimir', 'html')
            window.print();
        },

        generarPdf() {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'in',
                format: [11, 8.5],
            });

            console.log('DOC: ', doc);

            const margins = {
                top: 80,
                bottom: 60,
                left: 40,
                width: 522,
            };

            //doc.html(this.$refs.testHtml, 40, 80);

            doc.html(this.$refs.testHtml, {
                callback: function(doc) {
                    doc.save();
                },
                x: 10,
                y: 10,
            });

            // doc.fromHTML(this.$refs.testHtml, margins.left, margins.top, {
            //     width: margins.width,
            // });

            // doc.save('test.pdf');
        },

        bajarMunicipios() {
            const urlService = 'reportes/ficha-municipal';
            const encuestaID = this.encuesta.id;
            axios
                .get(`${URL_API}/${urlService}/${encuestaID}`, {
                    responseType: 'blob',
                })
                .then(({ data }) => {
                    console.log('DATA: ', data);
                    setTimeout(() => {
                        const url = window.URL.createObjectURL(data);
                        console.log('Url: ', url);
                        const a = document.createElement('a');
                        a.setAttribute('style', 'display:none;');
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = this.encuesta.descripcion + '.xls';
                        a.click();
                        return url;
                    }, 500);
                })
                .catch((error) => {
                    console.log('Error: ', error.response);
                });
        },
    },

    computed: {
        ...mapGetters('encuesta', ['getEncuestaState']),
        encuesta() {
            return this.getEncuestaState.objEncuesta;
        },
        totalPoblacion() {
            let total = 0;

            total =
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de0A4Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de5A9Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de10A14Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de20A24Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de15A19Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de25A29Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de30A34Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de35A39Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de40A44Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de45A49Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de50A54Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de55A59Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de60A64Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de65A69Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de70A74Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .de75A79Anos +
                this.getEncuestaState.objEncuesta.poblacionPorRangoDeEdads
                    .mayorA80Anos;

            return total;
        },
    },
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
