<template>
  <q-page class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-list padding class="bg-white">

          <q-item
            clickable
            v-ripple
            class="q-mb-md"
            v-for="opt in menu"
            :to="{name: 'nueva-encuesta', params:{ id: opt.id }}"
            :key="opt.id">
            <q-item-section avatar top>
              <q-avatar :icon="opt.icono" :color="opt.colorIcono" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ opt.title }}</q-item-label>
              <q-item-label caption>{{ opt.subTitle }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" color="grey" />
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header>Otras opciones</q-item-label>

          <q-item clickable v-ripple class="q-mb-md" :to="{name: 'encuesta-proceso'}">
            <q-item-section avatar top>
              <q-avatar icon="ti-settings" color="grey" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Encuestas en proceso</q-item-label>
              <q-item-label caption>Listado de encuestas pendientes por cerrar</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-mb-md">
            <q-item-section avatar top>
              <q-avatar icon="ti-lock" color="grey" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Ecuestas cerradas</q-item-label>
              <q-item-label caption>Listado de encuestas finalizadas</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>         

          <!-- <q-item clickable v-ripple>
            <q-item-section avatar top>
              <q-avatar icon="library_music" color="grey" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">My favorite song</q-item-label>
              <q-item-label caption>Singing it all day</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item> -->
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'PageMenuEncuestas',
  data(){
    return {
      menu: []
    }
  },
  created () {
    this.cargarListaTipoEncuestaAction().then(data => {
      this.menu = data
    })
  },
  methods: {
    ...mapActions('tipoEncuesta', ['cargarListaTipoEncuestaAction']),
  },
  computed: {
    ...mapGetters('tipoEncuesta', ['getTipoEncuestaState'])
  }
}
</script>
