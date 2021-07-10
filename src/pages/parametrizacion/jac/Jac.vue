<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="jacForm">

          <div v-if="step==1">
            <p class="text-h6 q-mt-md q-mb-sm">
            Ubicación
          </p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Departamento</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                 <q-select
                   dense
                   use-input
                   v-model="departamento"
                   option-label="nombreDepartamento"
                   option-value="id"
                   @input="buscarMunicipios"
                   @filter="filterFnDepartamento"
                   hint="Ingrese almenos dos caracteres para filtrar departamento"
                   :options="departamentos"
                   behavior="dialog"
                   lazy-rules
                   :rules="[ val => val != null && val.id > 0 || 'Debe elegir un departamento']" />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Muncipio</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      dense
                      ref="municipio"
                      use-input
                      v-model="municipio"
                      option-label="nombreMunicipio"
                      option-value="id"
                      hint="Ingrese almenos dos caracteres para filtrar municipios"
                      :options="municipios"
                      @filter="filterFnMunicipio"
                      @input="buscarComunidades"
                      lazy-rules
                      :rules="[ val => val != null && val.id > 0 || 'Debe elegir un municipio']" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Comunidad</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      dense
                      ref="comunidad"
                      v-model="jac.comunidad"
                      option-label="nombreComunidad"
                      option-value="id"
                      :options="comunidades"
                      lazy-rules
                      :rules="[ val => val != null && val.id > 0 || 'Debe elegir una comunidad']" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

          </div>

          <div v-if="step == 2">
            <p class="text-h6 q-mt-md q-mb-sm">Datos de la Organización</p>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Nit</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                  <q-input
                    outlined
                    v-model="jac.noRut"
                    label="Nit de la Organización"
                  />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Nombre</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                  <q-input
                    outlined
                    v-model="jac.nombre"
                    label="Nombre de la Organización"
                  />
                  </div>
                </div>
              </q-card-section>
            </q-card>


          </div>

          <div v-if="step == 3">
            <p class="text-h6 q-mt-md q-mb-sm">Representante Legal</p>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Nombre completo</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                  <q-input
                    outlined
                    v-model="jac.representanteLegal"
                    label="Nombre completo del representante legal de la Organización"
                  />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

        </q-form>

        <div class="flex justify-center">
          <q-btn v-if="step > 1" label="Anterior" no-caps color="primary" flat class="q-mr-sm" @click="anterior"/>
          <q-btn v-if="step < 3" label="Siguiente" no-caps color="primary" @click="siguiente"/>

          <q-btn
          v-else
            label="Guardar"
            no-caps
            color="primary"
            :disable="getJacState.loading"
            :loading="getJacState.loading"
            @click="onSubmit"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      jac: {},
      step: 1,
      departamentos: [],
      departamentosList: [],
      municipios: [],
      municipiosList: [],
      departamento: '',
      municipio: '',
      comunidades: [],
    };
  },
  created() {
    this.jac = {
      id: 0,
      noRut: '',
      nombre: '',
      representanteLegal: '',
      areaInfluencia: true,
      comunidad: '',
    }
    this.cargarListaDepartamentoAction().then(data => {
      this.departamentosList = data
      this.departamentos = this.departamentosList
    })
  },
  methods: {
    ...mapActions('jac', ['registrarJacAction']),
    ...mapActions('departamento', ['cargarListaDepartamentoAction', 'cargarListaMunicipiosDelDepartamentoAction']),
    ...mapActions('municipios', ['cargarListaComunidadesDelMunicipioAction']),
    buscarMunicipios(departamentoID){
      this.municipio = null
      this.$refs.municipio.resetValidation()
      if(departamentoID != null){
        this.cargarListaMunicipiosDelDepartamentoAction(departamentoID.id).then(data => {
          this.municipiosList = data
          this.municipios = this.municipiosList
        })
      }
    },
    buscarComunidades(municipioID){
      this.jac.comunidad = null
      this.$refs.comunidad.resetValidation()
      if(municipioID != null){
        this.cargarListaComunidadesDelMunicipioAction(municipioID.id).then(data => {
          this.comunidades = data
        })
      }
    },
    siguiente(){
      this.step++
    },
    anterior(){
      if(this.step < 1){
        this.step = 1
        console.log('No se puede regresar mas')
      }else{
        this.step--
      }
    },
    onSubmit() {
      this.$refs.jacForm.validate().then(success => {
        if (success) {
          console.log("Form valido", this.jac);
          this.registrarJacAction(this.jac).then(data => {
            this.jac.id = data
            this.$q.notify({
              message: "Organización registrada correctamente",
              color: "positive"
            });
            this.$router.push('/parametrizacion')
          })
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });
        }
      });
    },
    filterFnDepartamento (val, update) {
      update(() => {
        const needle = val.toLowerCase()
        this.departamentos = this.departamentosList.filter(v => v.nombreDepartamento.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterFnMunicipio (val, update) {
      update(() => {
        const needle = val.toLowerCase()
        this.municipios = this.municipiosList.filter(v => v.nombreMunicipio.toLowerCase().indexOf(needle) > -1)
      })
    },
  },
  computed: {
    ...mapGetters("jac", ["getJacState"])
  }
};
</script>

<style></style>
