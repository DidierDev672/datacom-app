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
        <q-toolbar-title>
          Datacom
        </q-toolbar-title>
        <!-- <nav-bar-user /> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-sidebar"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <div class="logo-sidebar">
        <img width="170px" src="/icons/logo-sidebar.png" alt="" />
      </div>
      <q-list>
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
    <q-footer class="bg-white" bordered>
      <div v-if="showAppInstallBanner" class="banner-container bg-primary">
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
      <q-tabs
        class="text-dark small-screen-only q-pt-sm"
        active-color="primary"
        indicator-color="transparent"
      >
        <q-route-tab dense to="/" name="home" icon="ti-home" label="Inicio" />
        <q-route-tab
          dense
          to="/encuestas"
          name="ecuestas"
          icon="ti-view-list"
          label="Encuestas"
        />
        <!-- <q-route-tab
          to="/reportes"
          name="reportes"
          icon="ti-export"
          label="Reportes" /> -->
        <q-route-tab
          dense
          to="/parametrizacion"
          name="parametrizacion"
          icon="ti-settings"
          label="Parametros"
        />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <keep-alive :include="['PageCategorias']">
        <router-view />
      </keep-alive>
    </q-page-container>
    <!-- <tour></tour> -->
  </q-layout>
</template>

<script>
// import { exportFile } from 'quasar'
import { mapActions } from "vuex";
import EssentialLink from "components/EssentialLink";
// import NavBarUser from "components/NavBarUser";
// import Tour from "components/Tour/Tour";
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
export default {
  name: "MainLayout",

  components: {
    EssentialLink
    // NavBarUser,
    // Tour
  },

  data() {
    return {
      showAppInstallBanner: false,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "Inicio",
          caption: "",
          icon: "ti-home",
          link: "/"
        },
        {
          title: "Encuestas",
          caption: "",
          icon: "ti-bar-chart-alt",
          link: "/encuestas"
        },
        {
          title: "Jac",
          caption: "",
          icon: "ti-view-list",
          link: "/jac"
        },
        {
          title: "Icos",
          caption: "",
          icon: "ti-pencil-alt",
          link: "/icos"
        },
        {
          title: "Planes de Trabajo",
          caption: "",
          icon: "ti-bar-chart-alt",
          link: "/plan-trabajo"
        },
        {
          title: "Parametrización",
          caption: "",
          icon: "ti-settings",
          link: "/parametrizacion"
        }
        // {
        //   title: "Reportes",
        //   caption: "",
        //   icon: "ti-export",
        //   link: "/reportes"
        // }
      ]
    };
  },
  methods: {
    ...mapActions("auth", ["logoutAction"]),
    logout() {
      this.logoutAction();
    },
    installApp() {
      this.showAppInstallBanner = false;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User acepted install");
          this.neverShowAppInstallBanner();
        } else {
          console.log("User dismissed install");
        }
      });
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false;
      this.$q.localStorage.set("neverShowInstallBanner", true);
    }
  },
  mounted() {
    // this.$tours["datacomTour"].start();
    // const status = exportFile('important.pdf', 'Some important content', 'application/pdf')

    const neverShowAppInstallBanner = this.$q.localStorage.getItem(
      "neverShowInstallBanner"
    );
    if (!neverShowAppInstallBanner) {
      window.addEventListener("beforeinstallprompt", e => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        this.showAppInstallBanner = true;
      });
    }
  }
};
</script>
<style lang="sass">
body
  background-color: #fff

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
  background-color: #333333
  color: #fff


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
