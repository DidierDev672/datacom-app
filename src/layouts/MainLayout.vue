<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="fondo-nav">
      <q-toolbar class="constrain">
        <q-btn
        class="large-screen-only q-mr-sm"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-toolbar-title>
          Datacom
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
    class="large-screen-only"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Opciones de acceso
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-footer
      class="bg-white"
      bordered
      >
      <div
      v-if="showAppInstallBanner"
        class="banner-container bg-primary">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div class="constrain">
            <q-banner inline-actions class="bg-primary text-white q-mb-sm" dense>
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
                  class="q-mr-sm" />
                <q-btn
                  dense
                  @click="neverShowAppInstallBanner"
                  flat
                  label="No" />
              </template>
            </q-banner>
          </div>
        </transition>
      </div>
      <q-tabs
        dense
        class="text-dark small-screen-only"
        active-color="primary"
        indicator-color="transparent">
        <q-route-tab
          to="/"
          name="home"
          icon="ti-home"
          label="Inicio" />
        <q-route-tab
          to="/encuestas"
          name="ecuestas"
          icon="ti-view-list"
          label="Encuestas" />
        <!-- <q-route-tab
          to="/reportes"
          name="reportes"
          icon="ti-export"
          label="Reportes" /> -->
        <q-route-tab
          to="/parametrizacion"
          name="parametrizacion"
          icon="ti-settings"
          label="Parametros" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <keep-alive :include="['PageCategorias']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink'
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt
export default {
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      showAppInstallBanner: false,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Inicio',
          caption: '',
          icon: 'ti-home',
          link: '/'
        },
        {
          title: 'Encuestas',
          caption: '',
          icon: 'ti-bar-chart-alt',
          link: '/encuestas'
        },
        {
          title: 'Parametrización',
          caption: '',
          icon: 'ti-settings',
          link: '/parametrizacion'
        },          
      ]
    }
  },
  methods: {
    installApp () {
      this.showAppInstallBanner = false
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User acepted install')
          this.neverShowAppInstallBanner()
        } else {
          console.log('User dismissed install')
        }
      })
    },
    neverShowAppInstallBanner () {
      this.showAppInstallBanner = false
      this.$q.localStorage.set('neverShowInstallBanner', true)
    }
  },
  mounted () {
    const neverShowAppInstallBanner = this.$q.localStorage.getItem('neverShowInstallBanner')
    if (!neverShowAppInstallBanner) {
      window.addEventListener('beforeinstallprompt', (e) => {        
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later.
        deferredPrompt = e
        // Update UI notify the user they can install the PWA
        this.showAppInstallBanner = true
      })
    }
  }
}
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
    background: rgb(175,202,11)
    background: linear-gradient(90deg, rgba(175,202,11,1) 0%, rgba(100,194,200, 1) 100%)
    background: --prefix-linear-gradient(90deg, rgba(175,202,11,1) 0%, rgba(100,194,200, 1) 100%)
</style>
