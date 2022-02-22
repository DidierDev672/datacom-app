<template>
<q-list bordered class="rounded-borders bg-white">
    <q-item>
        <q-item-section top>
            <q-item-label>{{ medio.tipoMedio.nombre }}</q-item-label>
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
            Nombre
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ medio.nombre }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Persona de Contacto
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ medio.contacto }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item>
        <q-item-section top>
            <q-item-label caption lines="1">
            Teléfono
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ medio.telefono }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <!-- <q-item>
        <q-item-section top>
            <q-item-label caption lines="1">
            Alcance
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ medio.alcance }}</span>
            </q-item-label>
        </q-item-section>
    </q-item> -->

    <!-- <q-item>
        <q-item-section top>
            <q-item-label caption lines="1">
            ¿El medio de comunicación es de carácter público?
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ medio.publico ? 'Si' : 'No, es privado' }}</span>
            </q-item-label>
        </q-item-section>
    </q-item> -->



</q-list>
</template>

<script>
export default {
    props: {
        medio: {
            type: Object,
            required: true
        }
    },
    methods: {
      editar(){
        this.$emit("editar", this.medio)
      }
    }
}
</script>

<style>

</style>
