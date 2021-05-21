<template>
<q-list bordered class="rounded-borders bg-white">
    <q-item>
        <q-item-section top>
            <q-item-label>Cobertura en Servicios</q-item-label>
        </q-item-section>

        <q-item-section side top>              
            <div class="text-grey-8 ">
                <q-btn size="12px" flat dense round icon="more_vert" >
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
        </q-item-section>
    </q-item>

    <q-item-label header>Energía eléctrica: {{ cobertura.coberturaEnergiaElectrica }}</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Urbano
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.energiaElectricaUrbana }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Rural
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.energiaElectricaRural }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item-label header>Acueducto: {{ cobertura.coberturaAcueducto }}</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Urbano
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.acueductoUrbano }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Rural
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.acueductoRural }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item-label header>Alcantarillado: {{ cobertura.coberturaAlcantarillado }}</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Urbano
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.alcantarilladoUrbana }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Rural
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.alcantarilladoRural }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item-label header>Gas Natural: {{ cobertura.coberturaGasNatural }}</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Urbano
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.gasNaturalUrbana }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Rural
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.gasNaturalRural }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item-label header>Internet: {{ cobertura.coberturaInternet }}</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Urbano
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.internetUrbana }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Rural
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ cobertura.internetRural }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>        

</q-list>
</template>

<script>
export default {
    props: {
        cobertura: {
            type: Object,
            required: true
        }
    },
    methods: {
      editar(){
        this.$emit("editar", this.cobertura)
      }
    }
}
</script>

<style>

</style>