<template>
  <q-card class="my-card">
    <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Calidad de Vida</div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="editar">
                    <q-item-section>Editar información</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section>Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle">Indice de pobreza multidimencional Año: {{ calidad.ano }}</div>
      </q-card-section>

      <q-markup-table>
        <thead>
          <tr>
            <th class="text-center">IPM Urbano</th>
            <th class="text-center">IPM Rural</th>
            <th class="text-center">IPM Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ calidad.ipmUrbana }}% de hogares</td>
            <td class="text-center">{{ calidad.ipmRural }}% de hogares</td>
            <td class="text-center">{{ calidad.ipmTotal }}% de hogares</td>
          </tr>          
        </tbody>
      </q-markup-table>

      <q-card-section>
        <div class="text-subtitle">Población en condiciones de miseria Año: {{ calidad.ano }}</div>
      </q-card-section>

      <q-markup-table>
        <thead>
          <tr>
            <th class="text-center">PCM Urbano</th>
            <th class="text-center">PCM Rural</th>
            <th class="text-center">PCM Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ calidad.pcmUrbano }}%</td>
            <td class="text-center">{{ calidad.pcmRural }}%</td>
            <td class="text-center">{{ calidad.pcm }}%</td>
          </tr>          
        </tbody>
      </q-markup-table>

      <q-card-section>
        <div class="text-subtitle">Necesidades básicas insatisfechas Año: {{ calidad.ano }}</div>
      </q-card-section>

      <q-markup-table>
        <thead>
          <tr>
            <th class="text-center">NBI Urbano</th>
            <th class="text-center">NBI Rural</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center">{{ calidad.nbi_urbano }}% de hogares</td>
            <td class="text-center">{{ calidad.nbi_rural }}% de hogares</td>
          </tr>          
        </tbody>
      </q-markup-table>
    </q-card>
</template>

<script>

export default {
    props: {
        calidad: {
            type: Object,
            required:true
        }
    },
    methods: {
      editar(){
        console.log('Editar del componente', this.calidad.id)
        this.$emit("editar", this.calidad)
      }
    }
}
</script>

<style>

</style>