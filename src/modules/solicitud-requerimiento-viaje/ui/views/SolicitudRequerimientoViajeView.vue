<template>
  <q-page class="q-pa-md" style="max-width: 960px; margin: 0 auto;">
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-dark">Solicitud de requerimiento</div>
        <div class="text-caption text-grey-7 q-mt-xs">
          Registro de requisición de transporte y viaje. Al guardar se genera un código único (SRV-…) y la solicitud queda en estado
          <strong> Revisión</strong>.
        </div>
      </div>
      <q-space />
      <q-btn
        outline
        no-caps
        color="primary"
        icon="format_list_bulleted"
        label="Ver listado"
        :to="{ name: 'lista-solicitud-requerimiento-viaje' }"
      />
    </div>

    <SolicitudRequerimientoViajeForm />
  </q-page>
</template>

<script>
import SolicitudRequerimientoViajeForm from '../components/SolicitudRequerimientoViajeForm.vue';

export default {
  name: 'SolicitudRequerimientoViajeView',

  components: {
    SolicitudRequerimientoViajeForm
  }
};
</script>
