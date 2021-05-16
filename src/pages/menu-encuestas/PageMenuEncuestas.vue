<template>
  <q-page class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-list padding class="bg-white">

          <q-item clickable v-ripple class="q-mb-md" :to="{name: 'localizacion-vivienda'}">
            <q-item-section avatar top>
              <q-avatar icon="ti-align-justify" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Vivienda</q-item-label>
              <q-item-label caption>Iniciar encuesta de vivienda</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" color="green" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-mb-md">
            <q-item-section avatar top>
              <q-avatar icon="ti-align-justify" color="orange" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Comunidad</q-item-label>
              <q-item-label caption>Iniciar encuesta de comunidad</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-mb-md" to="/municipios">
            <q-item-section avatar top>
              <q-avatar icon="ti-align-justify" color="teal" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">Municipios</q-item-label>
              <q-item-label caption>Iniciar encuesta de municipios</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="q-mb-md">
            <q-item-section avatar top>
              <q-avatar icon="ti-align-justify" color="purple" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">JAC</q-item-label>
              <q-item-label caption>Iniciar encuesta de Juntas de Acción Comunal</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="info" />
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header>Otras opciones</q-item-label>

          <q-item clickable v-ripple class="q-mb-md">
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
export default {
  name: 'PageMenuEncuestas'
}
</script>
