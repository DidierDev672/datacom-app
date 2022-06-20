<template>
  <q-page>
    <div class="text-h6 page-title-box" >Opciones de encuestas</div>
    <div class="q-ma-md">
<div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <q-list padding bordered class="bg-white">
          <q-item
            clickable
            v-ripple
            class="q-mb-md v-step-1"
            v-for="opt in menu"
            :to="{ name: 'PageNewEncuesta', params: { id: opt.id } }"
            :key="opt.id"
          >
            <q-item-section avatar top>
              <q-avatar
                :icon="opt.icono"
                :color="opt.colorIcono"
                text-color="white"
              />
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

          <q-item
            clickable
            v-ripple
            class="q-mb-md v-step-2"
            :to="{ name: 'PageEncuestasEnProceso' }"
          >
            <q-item-section avatar top>
              <q-avatar icon="ti-settings" color="grey" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Encuestas en proceso</q-item-label>
              <q-item-label caption
                >Listado de encuestas pendientes por cerrar</q-item-label
              >
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            class="q-mb-md v-step-3"
            :to="{ name: 'PageEncuestasCerradas' }"
          >
            <q-item-section avatar top>
              <q-avatar icon="ti-lock" color="grey" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Encuestas cerradas</q-item-label>
              <q-item-label caption
                >Listado de encuestas finalizadas</q-item-label
              >
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" color="amber" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
    </div>
    
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "PageMenuEncuestas",
  data() {
    return {
      menu: []
    };
  },
  created() {
    this.cargarListaTipoEncuestaAction().then(data => {
      this.menu = data;
    });
  },
  methods: {
    ...mapActions("tipoEncuesta", ["cargarListaTipoEncuestaAction"])
  },
  computed: {
    ...mapGetters("tipoEncuesta", ["getTipoEncuestaState"])
  }
};
</script>
