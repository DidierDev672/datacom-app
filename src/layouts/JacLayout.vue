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
          Datacom
        </q-toolbar-title>
        <nav-bar-user />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      class="bg-sidebar"
      show-if-above
      bordered
      :width="255"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Opciones
        </q-item-label>

        <q-item clickable to="/jac" exact>
          <q-item-section avatar>
            <q-icon size="14px" name="ti-home" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Regresar</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'jac-info', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Informacion General</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'jac-representante-legal', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Representante Legal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'jac-afiliados', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Datos de Afiliados</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-junta-directiva', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Junta Directiva</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-fiscal', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Fiscal</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-comites-trabajo', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Comisiones de Trabajo</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-organos-representacion', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Órganos de representación</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-organos-justicia', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Órganos de justicia y Conv.</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-nivel-gerencial', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Nivel Gerencial</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-nivel-administrativo', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Nivel Administrativo</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'j-balance', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Balance</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'j-contratos', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Contratos </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'j-proyectos-productivos', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Proyectos Productivos</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          :to="{ name: 'j-participacion', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Participacion</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{ name: 'j-habilidades', params: { id: jacID } }"
          exact
        >
          <q-item-section avatar>
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Habilidades</q-item-label>
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
import { mapActions } from "vuex";
import NavBarUser from "components/NavBarUser";

export default {
  name: "JacLayout",
  components: {
    NavBarUser
  },
  data() {
    return {
      showAppInstallBanner: false,
      jacID: 0,
      leftDrawerOpen: false
    };
  },
  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction"])
  },
  created() {
    this.jacID = this.$route.params.id;
    this.buscarJacInfoAction(this.jacID);
  }
};
</script>

<style lang="sass">
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
  background: linear-gradient( 135deg, #248b48 0%,#95b947 52%,#64ab9b 100%)
</style>
