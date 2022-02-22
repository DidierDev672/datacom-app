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
      <q-list>
        <q-item-label header class="text-grey-8">
          Opciones
        </q-item-label>

        <q-item
          clickable
          :to="{ name: 'a-info-general', params: { id: encuestaID } }"
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
          :to="{ name: 'a-indicadores', params: { id: encuestaID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Indicadores</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'a-fin-encuesta', params: { id: encuestaID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Finalizar</q-item-label>
          </q-item-section>
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
    </q-footer>

    <q-page-container>
      <keep-alive :include="['PageCategorias']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NavBarUser from "components/NavBarUser";
// import EssentialLink from 'components/EssentialLink'

export default {
  name: "AutoevaluacionLayout",
  components: {
    NavBarUser
  },
  data() {
    return {
      showAppInstallBanner: false,
      encuestaID: 0,
      leftDrawerOpen: false
    };
  },
  methods: {
    ...mapActions("encuesta", ["buscarEncuestaAction"])
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.buscarEncuestaAction(this.encuestaID);
  },
  computed: {
    ...mapGetters("encuesta", ["getEncuestaState"])
  }
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
