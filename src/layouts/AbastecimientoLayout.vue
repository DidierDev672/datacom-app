<template>
    <q-layout view="lHh Lpr lFf">
        <q-header class="fondo-nav">
            <q-toolbar class="constrain">
                <q-btn
                    class="q-mr-sm v-step-0"
                    flat
                    dense
                    round
                    icon="menu"
                    aria-label="Menu"
                    @click="leftDrawerOpen = !leftDrawerOpen"
                />
                <q-input dark filled placeholder="Buscar" class="q-ml-md">
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </q-toolbar>
        </q-header>

        <q-drawer
            class="bg-sidebar"
            v-model="leftDrawerOpen"
            show-if-above
            bordered
            :width="255"
        >
            <div class="logo-sidebar">
                <img width="80px" src="/icons/app-icon.png" alt="" />
            </div>
            <q-list>
                <!-- Grupo: Solicitudes -->
                <q-expansion-item default-opened icon="description" label="Solicitudes" expand-separator :header-class="['menu-header', isSolicitudesActive ? 'menu-header--active' : '']">
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'mis-ordenes-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="list_alt" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Mis Órdenes</q-item-label>
                            <q-item-label caption>Ver y gestionar mis solicitudes</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'Crear-plan-abastecimiento' }">
                       <q-item-section avatar>
                         <q-icon name="add_circle" />
                       </q-item-section>
                       <q-item-section>
                        <q-item-label>Crear plan de abastecimiento</q-item-label>
                        <q-item-label>Planifica el suministro según la demanda proyectada.</q-item-label>
                       </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'lista-planes-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="list_alt" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Registro plan abastecimiento</q-item-label>
                            <q-item-label caption>Visualizar datos registrados del plan</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'crear-rubros' }">
                       <q-item-section avatar>
                         <q-icon name="add_circle" />
                       </q-item-section>
                       <q-item-section>
                        <q-item-label>Crear rubros</q-item-label>
                        <q-item-label>Sección dentro de la actividad.</q-item-label>
                       </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'crear-solicitud-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="add_circle" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Crear abastecimiento</q-item-label>
                            <q-item-label caption>Nueva solicitud de abastecimiento</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'lista-solicitudes-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="list_alt" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Solicitudes del plan de abastecimiento</q-item-label>
                            <q-item-label caption>Información abastecimiento creado</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'aprobaciones-pendientes' }">
                        <q-item-section avatar>
                            <q-icon name="approval" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Aprobaciones (Legacy)</q-item-label>
                            <q-item-label caption>Órdenes pendientes (tradicional)</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'aprobacion-solicitudes-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="fact_check" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Aprobación de Abastecimiento</q-item-label>
                            <q-item-label caption>Validar nuevas solicitudes del plan</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-expansion-item>

                <!-- Grupo: Órdenes de compra -->
                <q-expansion-item icon="shopping_cart" label="Órdenes de compra" expand-separator :header-class="['menu-header', isGestionActive ? 'menu-header--active' : '']">
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'ordenes-compra-lista' }">
                        <q-item-section avatar>
                            <q-icon name="list_alt" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Listado</q-item-label>
                            <q-item-label caption>Órdenes de compra</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-expansion-item>

                <!-- Grupo: Proveedores -->
                <q-expansion-item default-opened icon="local_shipping" label="Proveedores" expand-separator :header-class="['menu-header', isProveedoresActive ? 'menu-header--active' : '']">
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'registrar-proveedor-nuevo' }">
                        <q-item-section avatar>
                            <q-icon name="add_circle" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Crear registro de proveedores</q-item-label>
                            <q-item-label caption>Nuevo registro unificado de tercero</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'lista-proveedores-terceros' }">
                        <q-item-section avatar>
                            <q-icon name="view_list" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Listado de proveedores</q-item-label>
                            <q-item-label caption>Gestión y visualización de terceros</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-expansion-item>

                <!-- Otros accesos -->
                <EssentialLink
                    v-for="link in essentialLinks"
                    :key="link.title"
                    v-bind="link"
                />
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
            <keep-alive>
                <router-view />
            </keep-alive>
        </q-page-container>
    </q-layout>
</template>

<script>
import { mapActions } from 'vuex';
import EssentialLink from 'components/EssentialLink';

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
export default {
    name: 'AbastecimientoLayout',

    components: {
        EssentialLink
    },

    data() {
        return {
            showAppInstallBanner: false,
            leftDrawerOpen: false,
            essentialLinks: [
                {
                    title: 'Inicio',
                    caption: 'Volver al menú principal',
                    icon: 'home',
                    link: '/',
                },
            ],
        };
    },
    computed: {
        isSolicitudesActive() {
            return this.$route.name === 'mis-ordenes-abastecimiento'
                || this.$route.name === 'crear-solicitud-abastecimiento'
                || this.$route.name === 'lista-solicitudes-abastecimiento'
                || this.$route.name === 'aprobaciones-pendientes'
                || this.$route.name === 'aprobacion-solicitudes-abastecimiento'
                || this.$route.name === 'Crear-plan-abastecimiento'
                || this.$route.name === 'lista-planes-abastecimiento'
        },
        isGestionActive() {
            return this.$route.name === 'ordenes-compra-lista'
        },
        isProveedoresActive() {
            return this.$route.name === 'registrar-proveedor-nuevo'
                || this.$route.name === 'lista-proveedores-terceros'
        }
    },
    methods: {
        ...mapActions('auth', ['logoutAction']),
        logout() {
            this.logoutAction();
        }
    }
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


body
  background-color: #f3f3f9

.q-separator
  background-color: rgba(255,255,255,0.13)
  align-items: center

.logo-sidebar
  display: flex
  align-items: center
  margin-top: 30px
  margin-bottom: 30px

.logo-sidebar
  img
    margin: 0 auto

.bg-sidebar
 aside
  color: #6d7080


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

// Estilos de menú
.menu-header
  background: rgba(255, 255, 255, 0.06)
  border-radius: 6px
  &:hover
    background: rgba(102, 187, 106, 0.25)
    color: #1b5e20

.menu-header--active
  background: linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)
  color: #fff

.submenu-item
  font-size: 13px
  border-radius: 6px
  margin-left: 8px
  margin-right: 6px
  &.q-router-link--active
    background: rgba(102, 187, 106, 0.15)
    color: #1b5e20
  &:hover
    background: rgba(255, 255, 255, 0.08)
</style>
