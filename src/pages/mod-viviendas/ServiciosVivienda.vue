<template>
  <div>
    <p class="text-h6 q-mt-md">Servicios de la vivienda</p>
    <q-card
      flat
      bordered
      class="my-card q-mb-md">
      <q-card-section>
        <div class="text-h6">6. Departamento</div>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <q-input placeholder="Nombre del departamento" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      flat
      bordered
      class="my-card q-mb-md">
      <q-card-section>
        <div class="text-h6">7. Su vivienda es:</div>
      </q-card-section>

      <q-card-section>
        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <q-option-group
              :options="options"
              type="checkbox"
              v-model="group"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="flex justify-center">
        <q-btn label="Anterior" no-caps color="primary" flat class="q-mr-sm" :to="{ name: 'estado-vivienda'}" />
        <q-btn label="Siguiente" no-caps color="primary" :to="{ name: 'productos-vivienda' }"/>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            check1: true,
            check2: false,
            check3: true,
            group: [],
            options: [
              { label: 'Propia sin escritura', value: 'bat' },
              { label: 'Sana posesión', value: 'friend', color: 'green' },
              { label: 'Familiar', value: 'upload', color: 'red' }
            ]
        }
    }

}
</script>

<style>
.q-item__label--header {
  color: #464d69;
  /* font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em; */
}

</style>