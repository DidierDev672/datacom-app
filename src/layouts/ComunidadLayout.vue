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
      </q-toolbar>
    </q-header>

    <q-drawer
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
          Opciones
        </q-item-label>

        <q-item
          clickable
          :to="{name: 'c-info-general', params: {id: encuestaID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>información General</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable :to="{ name: 'c-poblacion', params: { id: encuestaID } }" exact>
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Composición etaria</q-item-label>
          </q-item-section>
        </q-item>



        <q-item
          clickable
          :to="{name: 'c-organizaciones', params: {id: encuestaID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Organizaciones</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{name: 'c-vias-acceso', params: {id: encuestaID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Vias de Acceso</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{name: 'c-infraestructura', params: {id: encuestaID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Infraestructura Pública</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{name: 'c-comunicaciones', params: {id: encuestaID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Medios de Comunicación</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{name: 'c-ecosistema', params: {id: encuestaID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Ecosistemas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{name: 'c-salud', params: {id: encuestaID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Salud</q-item-label>
          </q-item-section>
        </q-item>

          <q-item
            clickable
            :to="{name: 'c-calidad-de-vida', params: {id: encuestaID}}"
            exact
          >
            <q-item-section
              avatar
            >
              <q-icon size="14px" name="ti-angle-right" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Calidad de Vida</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :to="{name: 'c-poblacion-infantil', params: {id: encuestaID}}"
            exact
          >
            <q-item-section
              avatar
            >
              <q-icon size="14px" name="ti-angle-right" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Atención Población Infantil</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :to="{name: 'c-vivienda', params: {id: encuestaID}}"
            exact
          >
            <q-item-section
              avatar
            >
              <q-icon size="14px" name="ti-angle-right" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Viviendas</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            :to="{name: 'c-programas-educativos', params: {id: encuestaID}}"
            exact
          >
            <q-item-section
              avatar
            >
              <q-icon size="14px" name="ti-angle-right" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Instituciones Educativas</q-item-label>
            </q-item-section>
          </q-item>



        <q-item clickable :to="{ name: 'fin-encuesta', params: { id: encuestaID } }" exact>
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Fin</q-item-label>
          </q-item-section>
        </q-item>

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
    </q-footer>

    <q-page-container>
      <keep-alive :include="['PageCategorias']">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions } from 'vuex'
// import EssentialLink from 'components/EssentialLink'

export default {
  name: 'ComunidadLayout',

  data () {
    return {
      showAppInstallBanner: false,
      encuestaID: 0,
      leftDrawerOpen: false,      
    }
  },
  methods: {
    ...mapActions('encuesta', ['buscarEncuestaAction']),
  },
  created () {
    this.encuestaID = this.$route.params.id
    this.buscarEncuestaAction(this.encuestaID)
  },
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
