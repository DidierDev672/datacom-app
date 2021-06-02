<template>
<q-list bordered class="rounded-borders bg-white">
    <q-item>
        <q-item-section top>
            <q-item-label>{{ producto.nombre }}</q-item-label>
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
</q-list>
</template>

<script>
export default {
    props: {
        producto: {
            type: Object,
            required: true
        }
    },
    methods: {
      editar(){
        this.$emit("editar", this.producto)
      }
    }

}
</script>

<style>

</style>