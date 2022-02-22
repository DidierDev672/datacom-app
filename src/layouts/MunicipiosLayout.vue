<template>
    <q-layout view="lHh Lpr lFf">
        <q-header class="fondo-nav">
            <q-toolbar class="constrain">
                <q-btn
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                />
                <q-toolbar-title>
                    Datacom - {{ getEncuestaState.objEncuesta.descripcion }}
                </q-toolbar-title>
                <nav-bar-user />
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            content-class="bg-grey-1"
        >
            <q-list v-if="getEncuestaState.objEncuesta.encuestaCerrada">
                <q-item-label header class="text-grey-8">
                    Opciones
                </q-item-label>

                <q-item clickable :to="{ name: 'PageEncuestasCerradas' }" exact>
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Volver a encuestas</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>

            <q-list v-else>
                <q-item-label header class="text-grey-8">
                    Opciones
                </q-item-label>

                <!-- <q-item
          clickable
          :to="{name: 'municipios'}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-arrow-left" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Regresar</q-item-label>
          </q-item-section>
        </q-item> -->

                <q-item
                    clickable
                    :to="{ name: 'info-general', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>información General</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'demografia', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Demografía</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'poblacion', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Composición etaria</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'calidad-vida', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Calidad de Vida</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'educacion', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Educación</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{
                        name: 'viviendas-municipio',
                        params: { id: encuestaID },
                    }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Viviendas</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{
                        name: 'cobertura-servicio',
                        params: { id: encuestaID },
                    }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label
                            >Cobertura en servicios públicos</q-item-label
                        >
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'seguridad', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Seguridad</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'administracion', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Administración Pública</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'secretarias', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Secretarías de Despacho</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{
                        name: 'politicas-publicas',
                        params: { id: encuestaID },
                    }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Políticas Públicas</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'organizaciones', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Organizaciones</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{
                        name: 'infraestructura-publica',
                        params: { id: encuestaID },
                    }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Infraestructura Pública</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'finanza', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Finanzas Públicas</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'indicador', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Indicadores de Gestión</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'territorio', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Territorio</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'participacion', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Participación</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'medios', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Medios de Comunicación</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'economia', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Economía y Marca Propia</q-item-label>
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'productos', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label
                            >Principales Productos del Municipio</q-item-label
                        >
                    </q-item-section>
                </q-item>

                <q-item
                    clickable
                    :to="{ name: 'fin-encuesta', params: { id: encuestaID } }"
                    exact
                >
                    <q-item-section avatar>
                        <q-icon size="14px" name="ti-angle-right" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Fin</q-item-label>
                    </q-item-section>
                </q-item>

                <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
            </q-list>
        </q-drawer>
        <q-footer class="bg-white" bordered>
            <div
                v-if="showAppInstallBanner"
                class="banner-container bg-primary"
            >
                <transition
                    appear
                    enter-active-class="animated fadeIn"
                    leave-active-class="animated fadeOut"
                >
                    <div class="constrain">
                        <q-banner
                            inline-actions
                            class="bg-primary text-white q-mb-sm"
                            dense
                        >
                            <template v-slot:avatar>
                                <q-icon name="ti-instagram" color="white" />
                            </template>
                            <b>¿Desea instalar Datacom?</b>
                            <template v-slot:action>
                                <q-btn
                                    dense
                                    @click="installApp"
                                    flat
                                    label="Si"
                                    class="q-mr-sm"
                                />
                                <q-btn
                                    dense
                                    @click="neverShowAppInstallBanner"
                                    flat
                                    label="No"
                                />
                            </template>
                        </q-banner>
                    </div>
                </transition>
            </div>
        </q-footer>

        <q-page-container>
            <keep-alive :include="['PageCategorias']">
                <router-view />
            </keep-alive>
        </q-page-container>
    </q-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NavBarUser from 'components/NavBarUser';

export default {
    name: 'MunicipioLayout',
    components: {
        NavBarUser,
    },
    data() {
        return {
            showAppInstallBanner: false,
            encuestaID: 0,
            leftDrawerOpen: false,
            essentialLinks: [
                {
                    title: 'Regresar',
                    icon: 'ti-arrow-left',
                    link: '/municipios',
                },
                {
                    title: 'Información general',
                    icon: 'ti-angle-right',
                    link: '/municipio',
                },
                {
                    title: 'Población',
                    icon: 'ti-angle-right',
                    link: `{name: 'calidad-vida', params: {id: municipioID}}`,
                },
                {
                    title: 'Calidad de vida',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Educación',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Viviendas',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Cobertura en servicios',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Seguridad',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Secretarias de gobierno',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Políticas públicas',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Organizaciones',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Infraestructura pública',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Finanzas',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Indicadores de Gestión',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Territorio',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Participación',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Medios de Comunicación',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Productos',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
                {
                    title: 'Otra información',
                    icon: 'ti-angle-right',
                    link: '/municipio/5/calidad-vida',
                },
            ],
        };
    },
    methods: {
        ...mapActions('encuesta', ['buscarEncuestaAction']),
    },
    created() {
        this.encuestaID = this.$route.params.id;
        this.buscarEncuestaAction(this.encuestaID).then((data) => {
            if (data.encuestaCerrada) this.leftDrawerOpen = false;
        });
    },
    computed: {
        ...mapGetters('encuesta', ['getEncuestaState']),
    },
};
</script>
<style lang="sass">
.q-toolbar
  @media (min-width: $breakpoint-sm-min)
    height: 77px
.q-toolbar__title
  font-size: 30px
  @media (max-width: $breakpoint-xs-max)
    text-align: center
.q-footer
  .q-tab__icon
    font-size: 30px
.fondo-nav
  background: #248b48
  background: linear-gradient( 135deg, #248b48 0%,#95b947 52%,#64ab9b 100%)
</style>
