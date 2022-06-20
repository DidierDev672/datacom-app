<template>
  <div>
    <q-list bordered padding class="q-mb-sm">
      <q-item-label header>Información General</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Nombre de la Organización</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.nombre }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Dirección</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.direccion }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Email</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.email }}
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

    <!-- Personería juridica -->

    <q-list bordered padding class="q-mb-sm">
      <q-item-label header>Personería Jurídica</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Número</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.noPersoneriaJuridica }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Fecha de expedición</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.fechaExpedicionPersoneria }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>¿Soporte escaneado?</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.personeriaJuridicaEscaneada ? 'Si' : 'No' }}
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

    <!-- Autoreconocimiento -->

    <q-list bordered padding class="q-mb-sm">
      <q-item-label header>Autoreconocimiento</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Número</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.noAutorecocimiento }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Expedido por</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.autorecocimientoExpedidoPor }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Fecha de expedición</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.fechaExpedicionAutoreconocimiento }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>¿Soporte escaneado?</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.autoreconocimientoEscaneada ? 'Si' : 'No' }}
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

    <!-- Rut -->

    <q-list bordered padding class="q-mb-sm">
      <q-item-label header>RUT</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Número</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.noRut }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Fecha de expedición</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.fechaExpedicionRut }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Actividades económica</q-item-label>
          <q-item-label caption>
            {{ "("+getJacInfoState.objJacInfo.actividadEconomica1 + ", " + getJacInfoState.objJacInfo.actividadEconomica2 + ", " + getJacInfoState.objJacInfo.actividadEconomica3 +")"}}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>¿Soporte escaneado?</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.rutEscaneada ? 'Si' : 'No' }}
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

    <!-- Rut -->

    <q-list bordered padding class="q-mb-sm">
      <q-item-label header>RUC</q-item-label>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Número</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.noRuc }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>Fecha de expedición</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.fechaExpedicionRuc }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>¿Soporte escaneado?</q-item-label>
          <q-item-label caption>
            {{ getJacInfoState.objJacInfo.rucEscaneada ? 'Si' : 'No' }}
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
  export default {


      computed: {
        ...mapGetters("jacInfo", ["getJacInfoState"]),
        ...mapGetters("auth", ["getUser"])
      }


  }
</script>

<style lang="scss" scoped>

</style>
