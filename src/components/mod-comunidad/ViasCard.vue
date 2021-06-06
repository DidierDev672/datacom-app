<template>
<q-list bordered class="rounded-borders bg-white">
    <q-item>
        <q-item-section top>
            <q-item-label>{{ vias.tipoVia.nombre }}</q-item-label>
        </q-item-section>

        <q-item-section side top>              
            <div class="text-grey-8 ">
                <q-btn size="12px" flat dense round icon="more_vert" >
                    <q-menu cover auto-close>
                        <q-list>
                            <q-item clickable @click="editar">
                                <q-item-section>Editar información</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            </div>        
        </q-item-section>
    </q-item>    

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Estado
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ vias.estadoVia }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            ¿Es transitable todo el año?
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ vias.transitable ? 'Si' : 'No' }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>   

</q-list>
</template>

<script>
export default {
    props: {
        vias: {
            type: Object,
            required: true
        }
    },
    methods: {
      editar(){
        this.$emit("editar", this.vias)
      }
    }

}
</script>

<style>

</style>