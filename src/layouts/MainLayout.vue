<template>
    <q-layout view="lHh Lpr lFf">
        <q-header class="fondo-nav">
            <q-toolbar class="constrain">
                <q-btn class="q-mr-sm v-step-0" flat dense round icon="menu" aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen" />
                <q-input dark filled placeholder="Buscar" class="q-ml-md">
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <!-- <nav-bar-user /> -->
            </q-toolbar>
        </q-header>

        <q-drawer class="bg-sidebar" v-model="leftDrawerOpen" show-if-above bordered :width="255">
            <div class="logo-sidebar">
                <img width="80px" src="/icons/app-icon.png" alt="" />
            </div>
            <div class="q-px-md q-pb-md">
                <q-input
                    v-model="searchQuery"
                    dense
                    filled
                    placeholder="Buscar en el menú..."
                    class="sidebar-search"
                    clearable
                >
                    <template v-slot:prepend>
                        <q-icon name="search" size="18px" color="grey-6" />
                    </template>
                </q-input>
            </div>

            <q-list class="q-pt-sm">
                <template v-for="(link, index) in filteredLinks">
                    <!-- Section Header -->
                    <q-item-label 
                        v-if="link.sectionHeader" 
                        header 
                        class="sidebar-section"
                        :key="'header-' + index"
                    >
                        {{ link.sectionHeader }}
                    </q-item-label>

                    <q-expansion-item
                        v-if="link.children"
                        :key="link.title"
                        :icon="link.icon"
                        :label="link.title"
                        :caption="link.caption"
                        :value="searchQuery ? true : undefined"
                        class="sidebar-expansion-item text-weight-medium"
                    >
                        <EssentialLink v-for="sublink in link.children" :key="sublink.title" v-bind="sublink" />
                    </q-expansion-item>
                    <EssentialLink v-else :key="link.title" v-bind="link" />
                </template>
                <q-separator />
                <q-item clickable v-ripple @click="logout">
                    <q-item-section avatar>
                        <q-icon name="logout" />
                    </q-item-section>

                    <q-item-section>Cerrar sesión</q-item-section>
                </q-item>
            </q-list>
        </q-drawer>

        <q-page-container>
            <keep-alive :include="['PageCategorias']">
                <router-view />
            </keep-alive>
        </q-page-container>
        <!-- <tour></tour> -->
    </q-layout>
</template>

<script>
import { mapActions } from 'vuex';
import EssentialLink from 'components/EssentialLink';

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
export default {
    name: 'MainLayout',

    components: {
        EssentialLink,
        // NavBarUser,
        // Tour
    },

    data() {
        return {
            searchQuery: '',
            showAppInstallBanner: false,
            leftDrawerOpen: false,
            essentialLinks: [
                {
                    sectionHeader: 'Gestión General',
                    title: 'Inicio',
                    caption: '',
                    icon: 'ti-home',
                    link: '/',
                },
                {
                    title: 'Encuestas',
                    caption: '',
                    icon: 'ti-bar-chart-alt',
                    link: '/encuestas',
                },
                {
                    title: "Municipios",
                    caption: "",
                    icon: "ti-map-alt",
                    link: "/app/municipios"
                },
                {
                    title: "Comunidades",
                    caption: "",
                    icon: "ti-location-pin",
                    link: "/app/comunidad"
                },
                {
                    title: "Viviendas",
                    caption: "",
                    icon: "ti-home",
                    link: "/app/vivienda"
                },
                {
                    title: 'Jac',
                    caption: '',
                    icon: 'ti-view-list',
                    link: '/jac',
                },
                {
                    title: 'Icos',
                    caption: '',
                    icon: 'ti-pencil-alt',
                    link: '/icos',
                },
                {
                    title: 'Planes de Trabajo',
                    caption: '',
                    icon: 'ti-bar-chart-alt',
                    link: '/plan-trabajo',
                },
                {
                    sectionHeader: 'Abastecimiento',
                    title: 'Abastecimiento',
                    caption: '',
                    icon: 'ti-layout-grid2',
                    link: '/abastecimiento',
                },
                {
                    title: 'Gestión de Compras',
                    caption: '',
                    icon: 'ti-shopping-cart',
                    children: [
                        {
                            title: 'Crear registro de proveedor',
                            caption: '',
                            icon: 'ti-truck',
                            link: '/abastecimiento/proveedores/nuevo',
                        },
                        {
                            title: 'Requisicion de compra',
                            caption: '',
                            icon: 'ti-clipboard',
                            link: '/abastecimiento/requisiciones/nueva',
                        },
                        {
                            title: 'Autorizacion de compra',
                            caption: '',
                            icon: 'ti-shopping-cart',
                            link: '/abastecimiento/autorizacion-compra/nueva',
                        },
                        {
                            title: 'Lista de proveedores',
                            caption: '',
                            icon: 'ti-shopping-cart-full',
                            link: '/lista-proveedores-terceros',
                        },
                        {
                            title: 'Lista de requesicion de compra',
                            caption: '',
                            icon: 'ti-view-list',
                            link: '/abastecimiento/requisiciones',
                        },
                        {
                            title: 'Lista de autorizacion de compra',
                            caption: '',
                            icon: 'ti-view-list',
                            link: '/abastecimiento/autorizacion-compra',
                        },
                    ]
                },
                {
                    title: 'Gestión de Viajes',
                    caption: '',
                    icon: 'ti-map',
                    children: [
                        {
                            title: 'Solicitud de Viaje',
                            caption: '',
                            icon: 'ti-map-alt',
                            link: '/abastecimiento/solicitudes-viaje/nueva',
                        },
                        {
                            title: 'Solicitud transporte y alojamiento',
                            caption: '',
                            icon: 'ti-car',
                            link: '/abastecimiento/solicitudes-viaje/nueva',
                        },
                        {
                            title: 'Solicitar transporte aero',
                            caption: '',
                            icon: 'ti-location-arrow',
                            link: '/abastecimiento/transporte-aereo/nueva',
                        },
                        {
                            title: 'Solicitar servicio de transporte terrestre',
                            caption: '',
                            icon: 'ti-truck',
                            link: '/abastecimiento/transporte-terrestre/nueva',
                        },
                        {
                            title: 'Lista solicitud de viaje',
                            caption: '',
                            icon: 'ti-view-list',
                            link: '/abastecimiento/solicitudes-viaje',
                        },
                        {
                            title: 'Lista solicitud transporte aero',
                            caption: '',
                            icon: 'ti-view-list-alt',
                            link: '/abastecimiento/transporte-aereo',
                        },
                        {
                            title: 'Lista solicitud servicio de transporte terrestre',
                            caption: '',
                            icon: 'ti-view-list-alt',
                            link: '/abastecimiento/transporte-terrestre',
                        },
                    ]
                },
                {
                    sectionHeader: 'Talento Humano',
                    title: 'Gestión de empleados y colaboradores',
                    caption: '',
                    icon: 'ti-user',
                    children: [
                        {
                            title: 'Crear puesto de trabajo',
                            caption: '',
                            icon: 'ti-briefcase',
                            link: '/talento-humano/puestos-trabajo/nuevo',
                        },
                        {
                            title: 'Crear registro de empleado',
                            caption: '',
                            icon: 'ti-user',
                            link: '/talento-humano/colaboradores/nuevo',
                        },
                        {
                            title: 'Registro de cargos profesionales',
                            caption: '',
                            icon: 'ti-id-badge',
                            link: '/talento-humano/registro',
                        },
                        {
                            title: 'Gestión de colaboradores',
                            caption: '',
                            icon: 'ti-agenda',
                            link: '/talento-humano/lista',
                        },
                    ]
                },
                {
                    sectionHeader: 'Sistema',
                    title: 'Parametrización',
                    caption: '',
                    icon: 'ti-settings',
                    link: '/parametrizacion',
                },
                {
                    title: 'Reportes',
                    caption: '',
                    icon: 'ti-export',
                    link: '/reporte',
                },
            ],
        };
    },
    computed: {
        filteredLinks() {
            const query = this.searchQuery.toLowerCase().trim();
            if (!query) return this.essentialLinks;

            const results = [];
            let lastSection = null;

            this.essentialLinks.forEach(link => {
                // Determine the section this item belongs to
                if (link.sectionHeader) lastSection = link.sectionHeader;
                
                const matchesTitle = link.title && link.title.toLowerCase().includes(query);
                let filteredChildren = [];
                if (link.children) {
                    filteredChildren = link.children.filter(child =>
                        child.title.toLowerCase().includes(query)
                    );
                }

                if (matchesTitle || filteredChildren.length > 0) {
                    results.push({
                        ...link,
                        _tempSection: lastSection,
                        children: link.children ? filteredChildren : undefined
                    });
                }
            });

            // Re-apply section headers to the first visible item in each section
            let currentHeader = null;
            return results.map(link => {
                const item = { ...link };
                if (link._tempSection !== currentHeader) {
                    item.sectionHeader = link._tempSection;
                    currentHeader = link._tempSection;
                } else {
                    delete item.sectionHeader;
                }
                return item;
            });
        }
    },
    methods: {
        ...mapActions('auth', ['logoutAction']),
        logout() {
            this.logoutAction();
        },
        installApp() {
            this.showAppInstallBanner = false;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User acepted install');
                    this.neverShowAppInstallBanner();
                } else {
                    console.log('User dismissed install');
                }
            });
        },
        neverShowAppInstallBanner() {
            this.showAppInstallBanner = false;
            this.$q.localStorage.set('neverShowInstallBanner', true);
        },
    },
    mounted() {
        // this.$tours["datacomTour"].start();
        // const status = exportFile('important.pdf', 'Some important content', 'application/pdf')

        const neverShowAppInstallBanner = this.$q.localStorage.getItem(
            'neverShowInstallBanner'
        );
        if (!neverShowAppInstallBanner) {
            window.addEventListener('beforeinstallprompt', (e) => {
                // Prevent the mini-infobar from appearing on mobile
                e.preventDefault();
                // Stash the event so it can be triggered later.
                deferredPrompt = e;
                // Update UI notify the user they can install the PWA
                this.showAppInstallBanner = true;
            });
        }
    },
};
</script>
<style lang="sass">
.WAL
    &__layout
        margin: 0 auto
        z-index: 4000
        height: 100%
        width: 90%
        max-width: 950px
        border-radius: 5px


.sidebar-section
  font-size: 11px
  font-weight: 600
  color: #6B7280 !important
  text-transform: uppercase
  margin-top: 16px
  margin-bottom: 8px
  padding-left: 16px
  letter-spacing: 0.5px
  line-height: normal
  min-height: auto

.sidebar-item
  margin: 4px 12px
  border-radius: 8px
  transition: all 0.2s ease
  color: #111827
  min-height: 44px

  &:hover
    background-color: #F3F4F6

  &--active
    background-color: #E0E7FF !important
    color: #111827 !important
    font-weight: 600

.sidebar-item-label
  font-size: 14px
  font-weight: inherit

.sidebar-item-caption
  font-size: 12px
  color: #6B7280

.sidebar-icon
  color: #6B7280

.sidebar-search
  .q-field__control
    background-color: #F3F4F6 !important
    border-radius: 8px !important
    &:before, &:after
        display: none
  .q-field__native
    font-size: 13px
  
.sidebar-expansion-item
  margin: 4px 12px
  border-radius: 8px
  color: #111827
  
  .q-expansion-item__container .q-item
    border-radius: 8px
    min-height: 44px
    
    &:hover
        background-color: #F3F4F6

body
  background-color: #f3f3f9

.q-separator
  background-color: rgba(0,0,0,0.05)
  margin: 12px 16px

.logo-sidebar
  display: flex
  align-items: center
  margin-top: 24px
  margin-bottom: 24px

.logo-sidebar
  img
    margin: 0 auto

.bg-sidebar
  background-color: #ffffff !important

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
  background: linear-gradient( 135deg, #248b48 0%,#95b947 62%,#64ab9b 100%)
</style>
