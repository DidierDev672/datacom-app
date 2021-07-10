<template>
  <div>
    <q-table
      title="Integrantes de la vivienda"
      :data="personas"
      :columns="columns"
      row-key="name"
      :loading="getPersonaState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top>
        <div class="col-xs-12 col-md-4 q-table__title">
          Integrantes de la vivienda
        </div>
        <q-space />
        <q-btn
          :to="{ name: 'agregar-persona', params: { id: viviendaID } }"
          outline
          class="q-ml-md"
          color="primary"
          label="Agregar Integrante"
        />
        <!-- <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" class="q-ml-md" /> -->
      </template>

      <q-td slot="body-cell-acciones" slot-scope="props" :props="props">
        <q-btn
          @click="seleccionar(props.row)"
          flat
          round
          icon="ti-pencil-alt"
        />
        <q-btn @click="eliminarModal(props.row)" flat round icon="ti-trash" />
      </q-td>
    </q-table>

    <div class="q-ma-sm">
      <div class="row">
        <div class="col-xs-12 col-sm-8 offset-sm-2">
          <div>
            <div class="flex justify-center">
              <!-- <q-btn label="Anterior" no-caps color="primary" flat class="q-mr-sm" :to="{ name: 'saneamiento-basico', params:{id: encuestaID}}" /> -->
              <q-btn
                label="Guardar y continuar"
                no-caps
                color="primary"
                :to="{
                  name: 'productos-vivienda',
                  params: { id: this.viviendaID }
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showModalDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <!-- <q-avatar icon="ti-info" color="red" text-color="white" /> -->
          <span class="q-ml-sm">¿Desea eliminar la persona?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn label="Eliminar" color="red" @click="eliminar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      viviendaID: 0,
      showModalDialog: false,
      personas: [],
      personaSelected: null,
      columns: [
        {
          name: "tipoDocumento",
          align: "left",
          label: "Tipo de Documento",
          field: row => row.tipoDocumento.nombre,
          sortable: true
        },
        {
          name: "noDocumento",
          align: "left",
          label: "Número de documento",
          field: "noDocumento",
          sortable: true
        },
        {
          name: "nombre",
          align: "left",
          label: "Nombre",
          field: row =>
            row.nombre + " " + row.primerApellido + " " + row.segundoApellido
        },
        {
          name: "sexo",
          align: "left",
          label: "Sexo",
          field: row => row.sexo.nombre,
          sortable: true
        },
        { name: "edad", align: "left", label: "Años cumplidos", field: "edad" },
        { name: "acciones", label: "", field: "acciones" }
      ]
    };
  },

  created() {
    this.viviendaID = this.$route.params.id;
    this.cargarListaPersonaAction(this.viviendaID).then(data => {
      data.forEach(opt => {
        this.personas.push({
          ...opt,
          encuesta: {
            id: this.viviendaID
          }
        });
      });
      // this.personas = data
    });
  },
  methods: {
    ...mapActions("persona", [
      "cargarListaPersonaAction",
      "eliminarPersonaAction"
    ]),
    ...mapMutations("persona", ["setPersonaSuccess"]),
    seleccionar(row) {
      this.setPersonaSuccess(row);
      this.$router.push({
        name: "editar-persona",
        params: { id: this.viviendaID }
      });
    },
    eliminarModal(row) {
      this.personaSelected = row;
      this.showModalDialog = true;
    },
    eliminar() {
      this.eliminarPersonaAction(this.personaSelected.id).then(data => {
        if (data) {
          this.personas = this.personas.filter(
            opt => opt.id != this.personaSelected.id
          );
          this.showModalDialog = false;
        }
      });
    }
  },

  computed: {
    ...mapGetters("persona", ["getPersonaState"])
  }
};
</script>

<style></style>
