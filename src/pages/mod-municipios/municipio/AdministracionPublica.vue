<template>
    <div class="q-ma-sm">
        <div class="row">
            <div class="col-xs-12 col-sm-8 offset-sm-2">
                
                <q-form ref="ubicacionForm">        

                    <p class="text-h6 q-mt-md q-mb-sm">7. Administración Pública</p>

                   <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Dirección de la Alcaldía</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.direccionAlcaldia" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Teléfono fijo</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.telefono" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Horario de Atención</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.horarioDeAtencion" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Correo electrónico</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.correo" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Página Web</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.paginaWeb" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Facebook</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.paginaDeFacebook" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <p class="text-h6 q-mt-md q-mb-sm">7.1. Datos del Alcalde</p>

                   <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Nombre completo</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.alcalde" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Partido Político</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.partidoPolitico" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Teléfono</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.telefonoAlcalde" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                       <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Correo electrónico</div>
                       </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="infoGeneral.correoAlcalde" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                </q-form>

                <div class="flex justify-center">
                    <q-btn label="Guardar y continuar" no-caps color="primary" @click="onSubmit"/>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    data(){
        return {
            encuestaID: 0,
            infoGeneral: {}
        }
    },

    created () {
        this.encuestaID = this.$route.params.id
        this.infoGeneral = {
            id: 0,
            alcalde: "",
            partidoPolitico: "",
            telefonoAlcalde: "",
            correoAlcalde: "",
            direccionAlcaldia: "",
            telefono: "",
            horarioDeAtencion: "",
            correo: "",
            paginaDeFacebook: "",
            paginaWeb: ""
        }

        this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
            console.log(data);
            if(data.id > 0){
                this.infoGeneral = {...data}
            }
        })
    },

    methods: {
        ...mapActions('informacionGeneral',['buscarInformacionGeneralAction','actualizarInformacionGeneralAction']),
        onSubmit(){
            this.actualizarInformacionGeneralAction(this.infoGeneral).then(data => {
                this.$router.push({name: 'secretarias', params: {id: this.encuestaID}})
            })
        }
    },

    computed: {
     ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),
  }

}
</script>

<style>

</style>