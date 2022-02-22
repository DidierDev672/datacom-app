<template>
<q-list bordered class="rounded-borders bg-white">
    <q-item>
        <q-item-section top>
            <q-item-label>{{ organizacion.idOrganizacion.nombre }}</q-item-label>
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

    <!-- <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Nombre
            </q-item-label>
            <q-item-label lines="1">
            <span class="text-weight-medium">{{ organizacion.nombre }}</span>
            </q-item-label>
        </q-item-section>
    </q-item> -->

    <q-item >
        <q-item-section top>
            <q-item-label caption lines="1">
            Tipo de Actividad
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ organizacion.tipoActividad }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item>
        <q-item-section top>
            <q-item-label caption lines="1">
            Persona de Contacto
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ organizacion.contacto }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item>
        <q-item-section top>
            <q-item-label caption lines="1">
            Teléfono
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ organizacion.telefono }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item>
        <q-item-section top>
            <q-item-label caption lines="1">
            Email
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ organizacion.correo }}</span>
            </q-item-label>
        </q-item-section>
    </q-item>

    <!-- <q-item>
        <q-item-section top>
            <q-item-label caption lines="1">
            Dirección
            </q-item-label>
            <q-item-label lines="1">
                <span class="text-weight-medium">{{ organizacion.direccion }}</span>
            </q-item-label>
        </q-item-section>
    </q-item> -->



</q-list>
</template>

<script>
export default {
    props: {
        organizacion: {
            type: Object,
            required: true
        }
    },
    methods: {
      editar(){
        this.$emit("editar", this.organizacion)
      }
    }

}
</script>

<style>

</style>
