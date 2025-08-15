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
                <q-expansion-item icon="description" label="Solicitudes" expand-separator :header-class="['menu-header', isSolicitudesActive ? 'menu-header--active' : '']">
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'mis-ordenes-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="list_alt" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Mis Órdenes</q-item-label>
                            <q-item-label caption>Ver y gestionar mis solicitudes</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'crear-orden-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="add_circle" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Crear Orden</q-item-label>
                            <q-item-label caption>Nueva solicitud de abastecimiento</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'aprobaciones-pendientes' }">
                        <q-item-section avatar>
                            <q-icon name="approval" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Aprobaciones</q-item-label>
                            <q-item-label caption>Órdenes pendientes de aprobación</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-expansion-item>

                <!-- Grupo: Órdenes de abastecimiento -->
                <q-expansion-item icon="assignment" label="Órdenes de abastecimiento" expand-separator :header-class="['menu-header', isGestionActive ? 'menu-header--active' : '']">
                    <q-item class="submenu-item" clickable v-ripple :to="{ name: 'gestion-abastecimiento' }">
                        <q-item-section avatar>
                            <q-icon name="manage_search" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Gestionar</q-item-label>
                            <q-item-label caption>Órdenes aprobadas</q-item-label>
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
                || this.$route.name === 'crear-orden-abastecimiento'
                || this.$route.name === 'aprobaciones-pendientes'
        },
        isGestionActive() {
            return this.$route.name === 'gestion-abastecimiento'
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
