<template>
<div>
    <q-list bordered class="rounded-borders bg-white">
        <q-item>
            <q-item-section top>
                <q-item-label>{{ infrasalud.tipoInfraestructura.nombre }}</q-item-label>
            </q-item-section>

            <q-item-section side top>
                <div class="text-grey-8 ">
                    <q-btn size="12px" flat dense round icon="more_vert" >
                        <q-menu cover auto-close>
                            <q-list>
                                <q-item clickable @click="editar">
                                    <q-item-section>Editar información</q-item-section>
                                </q-item>
                                <!-- <q-item clickable @click="agregarPersonal">
                                    <q-item-section>Agregar Personal</q-item-section>
                                </q-item> -->
                                <q-item clickable @click="agregarServicio">
                                    <q-item-section>Agregar Servicio</q-item-section>
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
                Área Construida
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ infrasalud.areaConstruida }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section top>
                <q-item-label caption lines="1">
                Área Total
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ infrasalud.areaTotal }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section top>
                <q-item-label caption lines="1">
                Teléfono
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ infrasalud.telefono }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section top>
                <q-item-label caption lines="1">
                Celular
                </q-item-label>
                <q-item-label lines="1">
                <span class="text-weight-medium">{{ infrasalud.celular }}</span>
                </q-item-label>
            </q-item-section>
        </q-item>




    </q-list>

    <persona-infrasalud @close="closedPersonaModal" v-if="showPersonasDialog" />

    <servicio-infrasalud @close="closedServicioModal" v-if="showServicioDialog" />

</div>
</template>

<script>
import { mapMutations } from "vuex"
import PersonaInfrasalud from "src/components/mod-comunidad/persona-infrasalud/PersonaInfrasalud.vue"
import ServicioInfrasalud from "src/components/mod-comunidad/servicio-infrasalud/ServicioInfrasalud.vue"
export default {
    props: {
        infrasalud: {
            type: Object,
            required: true
        }
    },
    components: { PersonaInfrasalud, ServicioInfrasalud },
    data(){
        return {
            showPersonasDialog: false,
            showServicioDialog: false
        }
    },
    methods: {
        ...mapMutations("infrasalud", ["setInfrasaludSuccess"]),
      editar(){
        this.$emit("editar", this.infrasalud)
      },
      agregarPersonal(){
          this.setInfrasalud()
          this.showPersonasDialog = true
      },
      closedPersonaModal(){
          this.showPersonasDialog = false
      },
      agregarServicio(){
          this.setInfrasalud()
          this.showServicioDialog = true
      },
      closedServicioModal(){
          this.showServicioDialog = false
      },
      setInfrasalud(){
          this.setInfrasaludSuccess(this.infrasalud);
      }
    }

}
</script>

<style>

</style>
