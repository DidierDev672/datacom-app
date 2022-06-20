<template>
  <div>
    <div class="text-h6 page-title-box" >{{ jacInfoDB.nombre }}</div>
    <div class="q-ma-md">
      <div class="row bg-white q-pa-md">
        <div class="col-xs-12 col-sm-12 col-md-4 ">

          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>{{ jacInfoDB.nombre }}</q-item-label>
                <q-item-label caption lines="2" class="q-mb-sm">
                  del municipio de {{ jacInfoDB.comunidad.municipio.nombreMunicipio }}
                </q-item-label>
                <q-item-label caption lines="2">
                  Última actualización: {{ jacInfoDB.fechaActualizacion }}
                </q-item-label>
                <q-item-label caption lines="2">
                  Usuario: {{ jacInfoDB.usuarioActualizacion }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator spaced inset />

            <q-item>
              <q-item-section>
                <q-item-label>Opciones de configuración</q-item-label>
              </q-item-section>
            </q-item>


          </q-list>

        </div>
        <div class="col-xs-12 col-sm-12 col-md-8">

          <router-view />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
  export default {

    name: "JacInfo",
  data() {
    return {
      jacID: 0,
      jacInfoDB: {}
    };
  },

  created() {

    this.jacID = this.$route.params.id;

    this.buscarJacInfoAction(this.jacID).then(data => {
      if (data.id > 0) {
        this.jacInfoDB = { ...data };
        console.log(data)
        // this.municipio = data.comunidad.municipio;
        // this.departamento = data.comunidad.municipio.departamento;
      }
    });

  },

  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction", "registrarJacInfoAction"]),
  }

  }
</script>

<style lang="scss" scoped>

</style>
