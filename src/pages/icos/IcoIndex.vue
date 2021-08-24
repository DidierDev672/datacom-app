<template>
  <div>
    <q-table
      title="Evaluaciones Ico"
      :data="getIcoState.lista"
      :columns="columns"
      row-key="name"
      wrap-cells
      :loading="getIcoState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-8 q-table__title">Evaluaciones Ico</div>

        <q-space />
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>

      <q-td slot="body-cell-descripcion" slot-scope="props" :props="props">
        {{ props.row.descripcion }}
        <q-badge v-if="props.row.offline" color="orange" label="OffLine" />
      </q-td>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'IcoCreate' }">
        <q-tooltip>
          Agregar Organización
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { TIPO_ENCUESTA } from "src/utils/config";
import { openDB } from "idb";
export default {
  name: "IcoList",
  data() {
    return {
      columns: [
        {
          name: "descripcion",
          align: "left",
          label: "Evaluación",
          field: "descripcion"
        },
        {
          name: "jac",
          align: "left",
          label: "Organización",
          field: row => row.jac.nombre
        }
      ]
    };
  },
  activated() {
    if (!navigator.onLine) {
      this.getOfflineIco();
    }
  },
  created() {
    this.listenForOfflineIcoUploaded();
  },
  methods: {
    ...mapMutations("ico", [
      "addIcoStateSuccess",
      "setIcoSuccess",
      "actualizarIcoSuccess"
    ]),
    getOfflineIco() {
      let db = openDB("workbox-background-sync").then(db => {
        console.log("DB: ", db);
        db.getAll("requests")
          .then(failedRequests => {
            failedRequests.forEach(failedRequest => {
              if (failedRequest.queueName == "createIcoQueue") {
                let request = new Request(
                  failedRequest.requestData.url,
                  failedRequest.requestData
                );
                request.json().then(ico => {
                  console.log("¿Quién es ico?: ", ico);
                  let offlineIco = {
                    ...ico,
                    fechaCreacion: "2021-05-06",
                    usuarioCreacion: "user",
                    offline: true
                  };
                  this.addIcoStateSuccess(offlineIco);
                });
              } else {
                console.log("No es createIcoQueue");
              }
            });
          })
          .catch(error => {
            console.log("Error openDB: ", error);
          });
      });
    },
    listenForOfflineIcoUploaded() {
      if (this.serviceWorkerSupported) {
        const channel = new BroadcastChannel("sw-ico");
        channel.addEventListener("message", event => {
          // console.log('Received', event.data);
          if (event.data.msg == "offline-ico-uploaded") {
            let offlineIcoCount = this.getIcoState.lista.filter(
              ico => ico.offline == true
            ).length;

            let offlineIco = this.getIcoState.lista.filter(
              ico => ico.offline == true
            );

            let ico = {
              ...offlineIco[offlineIcoCount - 1],
              offline: false
            };
            console.log("ico: ", ico);
            console.log("ico Offline: ", offlineIco);
            console.log("offlineIcoCount: ", offlineIcoCount);
            // this.jacInfos[offlineJacCount - 1].offline = false;
            this.actualizarIcoSuccess(ico);
            this.$q.notify({
              message: "La evaluación ICO se sincronizó correctamente.",
              icon: "ti-check",
              textColor: "white",
              color: "positive",
              position: "bottom-right"
            });
          }
        });
      }
    }
  },
  computed: {
    ...mapGetters("ico", ["getIcoState"]),
    serviceWorkerSupported() {
      if ("serviceWorker" in navigator) return true;
      return false;
    }
  }
};
</script>

<style scoped lang="sass">
.jac-creada-offline
  tbody tr
    background-color: #c1f4cd
</style>
