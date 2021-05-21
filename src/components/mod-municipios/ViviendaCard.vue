<template>
<q-list bordered class="rounded-borders bg-white">
    <q-item>
        <q-item-section top>
            <q-item-label>Viviendas</q-item-label>
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

    <q-item-label header>Informaci&oacute;n de viviendas</q-item-label>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            No. Viviendas Urbanas
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ vivienda.numeroDeViviendasUrbanas }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        No. Viviendas Rurales
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ vivienda.numeroDeViviendasRurales }}</span>
        </q-item-label>
    </q-item-section>
    </q-item>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        Total Viviendas
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ vivienda.numeroDeViviendasUrbanas + vivienda.numeroDeViviendasRurales }}</span>
        </q-item-label>
    </q-item-section>
    </q-item>         

    <q-separator spaced />

    <q-item-label header>Hogares</q-item-label>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        No. Hogares Urbanos
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ vivienda.numeroDeHogaresUrbanos }}</span>
        </q-item-label>
    </q-item-section>
    </q-item>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        No. Hogares Rurales
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ vivienda.numeroDeHogaresRurales }}</span>
        </q-item-label>
    </q-item-section>
    </q-item>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        Total Hogares
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ vivienda.numeroDeHogaresUrbanos + vivienda.numeroDeHogaresRurales  }}</span>
        </q-item-label>
    </q-item-section>
    </q-item> 

    <q-separator spaced />

    <q-item-label header>Otros datos</q-item-label>

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        D&eacute;ficit Cu&aacute;ntitativo
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ vivienda.deficitCuantitativo }}%</span>
        </q-item-label>
    </q-item-section>
    </q-item> 

    <q-item >
    <q-item-section top>
        <q-item-label caption lines="1">
        Déficit Cuálitativo
        </q-item-label>
        <q-item-label lines="1">
        <span class="text-weight-medium">{{ vivienda.deficitCualitativo }}%</span>
        </q-item-label>
    </q-item-section>
    </q-item>          

</q-list>
</template>

<script>
export default {
    props: {
        vivienda: {
            type: Object,
            required: true
        }
    },
    methods: {
      editar(){
        this.$emit("editar", this.vivienda)
      }
    }

}
</script>

<style>

</style>