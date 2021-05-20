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
        </q-item>

        <q-item
          clickable
          :to="{name: 'info-general', params: {id: municipioID}}"
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

        <q-item
          clickable
          :to="{name: 'poblacion', params: {id: municipioID}}"
          exact
        >
          <q-item-section
            avatar
          >
            <q-icon size="14px" name="ti-angle-right" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Población</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          :to="{name: 'calidad-vida', params: {id: municipioID}}"
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

        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
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
import EssentialLink from 'components/EssentialLink'

export default {
  name: 'MunicipioLayout',

  components: {
    EssentialLink
  },

  data () {
    return {
      showAppInstallBanner: false,
      municipioID: 0,
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: 'Regresar',
          icon: 'ti-arrow-left',
          link: '/municipios'
        },
        {
          title: 'Información general',
          icon: 'ti-angle-right',
          link: '/municipio'
        },
        {
          title: 'Población',
          icon: 'ti-angle-right',
          link: `{name: 'calidad-vida', params: {id: municipioID}}`
        },
        {
          title: 'Calidad de vida',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Educación',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Viviendas',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Cobertura en servicios',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Seguridad',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Secretarias de gobierno',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Políticas públicas',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Organizaciones',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Infraestructura pública',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Finanzas',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Indicadores de Gestión',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Territorio',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Participación',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Medios de Comunicación',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Productos',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
        {
          title: 'Otra información',
          icon: 'ti-angle-right',
          link: '/municipio/5/calidad-vida'
        },
      ]
    }
  },
  methods: {
    ...mapActions('municipios', ['buscarMunicipioAction']),
  },
  created () {
    this.municipioID = this.$route.params.id
    this.buscarMunicipioAction(this.municipioID)
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
