<template>
    <div class="q-ma-sm">
        <div class="row">
            <div class="col-xs-12 col-sm-8 offset-sm-2">
                <q-list bordered class="rounded-borders bg-white">
                    <q-item>
                        <q-item-section top>
                            <q-item-label>Administración municipal</q-item-label>
                        </q-item-section>

                        <q-item-section side top>              
                            <div class="text-grey-8 ">
                                <q-btn size="12px" flat dense round icon="more_vert">
                                    <q-menu cover auto-close>
                                        <q-list>
                                            <q-item clickable @click="modalEditarAdministracion = true">
                                                <q-item-section>Editar información</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                                </q-btn>
                            </div>        
                        </q-item-section>
                    </q-item>

                    <q-item-label header>Datos de contacto</q-item-label>

                    <q-item >
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Dirección de la Alcaldia
                            </q-item-label>
                            <q-item-label lines="1">
                            <span class="text-weight-medium">{{ infoGeneral.direccionAlcaldia }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Teléfono fijo
                            </q-item-label>
                            <q-item-label lines="1">
                            <span class="text-weight-medium">{{ infoGeneral.telefono }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Horario de atención
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.horarioDeAtencion }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Email
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.correo }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Página web
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.paginaWeb }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Página facebook
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.paginaDeFacebook }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item-label header>Datos del Alcalde</q-item-label>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Nombre completo
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.alcalde }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Partido político
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.partidoPolitico }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Teléfono
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.telefonoAlcalde }}</span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section top>
                            <q-item-label caption lines="1">
                            Email
                            </q-item-label>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{ infoGeneral.correoAlcalde }}
                                </span>
                            </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
                <editar-administracion
                  @close="closeModalEditarAdministracion"
                  v-if="modalEditarAdministracion"></editar-administracion>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditarAdministracion from 'src/components/mod-municipios/EditarAdministracion.vue'

export default {
	components: { EditarAdministracion },

    data(){
        return {
            modalEditarAdministracion: false
        }
    },

    methods: {
        closeModalEditarAdministracion(){ this.modalEditarAdministracion = false }
    },

    computed: {
    ...mapGetters('municipios', ['getMunicipioState']),
    departamento(){
      return this.getMunicipioState.municipio.departamento
    },
    infoGeneral(){
      return this.getMunicipioState.municipio.informacionGeneral
    },
    municipio(){
      return this.getMunicipioState.municipio
    }
  }

}
</script>

<style>

</style>