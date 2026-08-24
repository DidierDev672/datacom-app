<template>
  <q-page class="ptl-page q-pa-md">
    <div class="ptl-container">
      <header class="ptl-header">
        <h1 class="ptl-title">Gestión de puestos de trabajo</h1>
        <p class="ptl-subtitle">
          Consulta, filtra y administra cargos de forma rápida y clara.
        </p>
      </header>

      <q-card flat bordered class="ptl-card">
        <div class="ptl-toolbar">
          <div class="ptl-toolbar-grid">
            <div class="ptl-search-wrap">
              <q-input
                v-model="search"
                dense
                outlined
                clearable
                debounce="250"
                placeholder="Buscar puesto, área o tipo de contrato"
                class="ptl-search-input"
              >
                <template v-slot:prepend>
                  <q-icon name="search" size="18px" class="text-slate-400" />
                </template>
              </q-input>
            </div>

            <div class="ptl-filter-wrap">
              <q-select
                v-model="estadoFilter"
                :options="estadoOptions"
                dense
                outlined
                emit-value
                map-options
                label="Estado"
                class="ptl-filter"
              />
            </div>

            <div class="ptl-filter-wrap">
              <q-select
                v-model="areaFilter"
                :options="areaOptions"
                dense
                outlined
                emit-value
                map-options
                label="Área"
                class="ptl-filter"
              />
            </div>

            <div class="ptl-filter-wrap">
              <q-select
                v-model="contratoFilter"
                :options="contratoOptions"
                dense
                outlined
                emit-value
                map-options
                label="Contrato"
                class="ptl-filter"
              />
            </div>

            <div class="ptl-action-wrap">
              <q-btn
                to="/talento-humano/puestos-trabajo/nuevo"
                icon="add"
                label="Nuevo puesto"
                no-caps
                unelevated
                class="ptl-primary-btn"
              />
            </div>
          </div>
        </div>

        <q-separator />

        <q-table
          :data="filteredPuestos"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination.sync="pagination"
          :rows-per-page-options="rowsPerPageOptions"
          flat
          hide-bottom
          class="ptl-table"
          :dense="$q.screen.lt.md"
        >
          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-7 q-pa-lg">
              <div class="column items-center q-gutter-sm">
                <q-icon name="work_off" size="42px" />
                <span v-if="loading">Cargando puestos...</span>
                <span v-else-if="filteredPuestos.length === 0"
                  >No se encontraron puestos con los filtros actuales.</span
                >
              </div>
            </div>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                dense
                outline
                square
                :color="props.value === 'ACTIVO' ? 'positive' : 'grey-7'"
                :text-color="props.value === 'ACTIVO' ? 'positive' : 'grey-7'"
                class="ptl-status-chip"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <div class="row no-wrap items-center justify-center ptl-actions">
                <q-btn
                  flat
                  round
                  dense
                  color="grey-8"
                  icon="visibility"
                  class="ptl-action-btn"
                  @click="viewPuesto(props.row)"
                >
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="grey-8"
                  icon="edit"
                  class="ptl-action-btn"
                  @click="editPuesto(props.row.id)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  color="negative"
                  icon="delete"
                  class="ptl-action-btn"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>Desactivar</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>

        <q-separator />

        <div class="ptl-pagination row items-center justify-between">
          <div class="text-caption text-grey-7">{{ paginationLabel }}</div>

          <q-pagination
            v-model="pagination.page"
            color="primary"
            :max="totalPages"
            :max-pages="7"
            direction-links
            boundary-links
            dense
          />

          <q-select
            v-model="pagination.rowsPerPage"
            :options="rowsPerPageSelectOptions"
            dense
            outlined
            emit-value
            map-options
            options-dense
            class="ptl-rows-select"
            aria-label="Filas por página"
          />
        </div>
      </q-card>

      <q-dialog v-model="showDetailModal">
        <q-card class="ptl-detail-card">
          <q-card-section class="ptl-detail-header">
            <h3 class="ptl-detail-title">Detalle del puesto de trabajo</h3>
            <p class="ptl-detail-subtitle">Información organizacional y contractual</p>
          </q-card-section>

          <q-card-section v-if="selectedPuesto">
            <div class="ptl-detail-stack">
              <section class="ptl-detail-block">
                <div class="ptl-detail-caption">Información principal</div>
                <div class="ptl-detail-main-title">
                  {{ selectedPuesto.nombreCargo || "Sin nombre de cargo" }}
                </div>
                <div class="ptl-detail-row">
                  <span class="ptl-detail-label">Estado</span>
                  <span class="ptl-detail-value">
                    <q-chip
                      dense
                      outline
                      square
                      :color="selectedPuesto.estado === 'ACTIVO' ? 'positive' : 'grey-7'"
                      :text-color="selectedPuesto.estado === 'ACTIVO' ? 'positive' : 'grey-7'"
                    >
                      {{ selectedPuesto.estado || "—" }}
                    </q-chip>
                  </span>
                </div>
              </section>

              <section class="ptl-detail-block">
                <div class="ptl-detail-caption">Información organizacional</div>
                <div class="ptl-detail-row">
                  <span class="ptl-detail-label">Área</span>
                  <span class="ptl-detail-value">{{ selectedPuesto.area || "—" }}</span>
                </div>
                <div class="ptl-detail-row">
                  <span class="ptl-detail-label">Nivel</span>
                  <span class="ptl-detail-value">{{ selectedPuesto.nivelJerarquico || "—" }}</span>
                </div>
                <div class="ptl-detail-row">
                  <span class="ptl-detail-label">Contrato</span>
                  <span class="ptl-detail-value">{{ selectedPuesto.tipoContrato || "—" }}</span>
                </div>
              </section>

              <section class="ptl-detail-block">
                <div class="ptl-detail-caption">Información secundaria</div>
                <div class="ptl-detail-row">
                  <span class="ptl-detail-label">Código</span>
                  <span class="ptl-detail-value">{{ selectedPuesto.codigoCargo || "—" }}</span>
                </div>
                <div class="ptl-detail-row">
                  <span class="ptl-detail-label">Fecha</span>
                  <span class="ptl-detail-value">{{ selectedPuesto.fechaCreacion || selectedPuesto.createdAt || "—" }}</span>
                </div>
              </section>

              <section class="ptl-detail-block ptl-detail-block--description">
                <div class="ptl-detail-caption">Descripción</div>
                <p class="ptl-detail-description">
                  {{ selectedPuesto.descripcion || "Sin descripción registrada." }}
                </p>
              </section>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-px-md q-pb-md q-pt-sm">
            <q-btn flat no-caps color="grey-8" label="Cerrar" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, computed, watch } from "@vue/composition-api";
import { usePuestosTrabajoStore } from "../../../../piña/puestosTrabajo";

const ROWS_OPTIONS = [10, 25, 50];

export default {
  name: "PuestoTrabajoList",
  setup(props, { root }) {
    const store = usePuestosTrabajoStore();
    const router = root.$router;
    const $q = root.$q;

    const search = ref("");
    const estadoFilter = ref(null);
    const areaFilter = ref(null);
    const contratoFilter = ref(null);
    const showDetailModal = ref(false);
    const selectedPuesto = ref(null);

    const pagination = ref({
      sortBy: "nombreCargo",
      descending: false,
      page: 1,
      rowsPerPage: 10,
    });

    const rowsPerPageOptions = ROWS_OPTIONS;

    const columns = [
      {
        name: "codigoCargo",
        label: "Código",
        field: "codigoCargo",
        align: "left",
        sortable: true,
      },
      {
        name: "nombreCargo",
        label: "Cargo",
        field: "nombreCargo",
        align: "left",
        sortable: true,
      },
      {
        name: "area",
        label: "Área",
        field: "area",
        align: "left",
        sortable: true,
      },
      {
        name: "nivelJerarquico",
        label: "Nivel",
        field: "nivelJerarquico",
        align: "left",
        sortable: true,
      },
      {
        name: "tipoContrato",
        label: "Contrato",
        field: "tipoContrato",
        align: "left",
        sortable: true,
      },
      {
        name: "estado",
        label: "Estado",
        field: "estado",
        align: "center",
        sortable: true,
      },
      {
        name: "actions",
        label: "Acciones",
        field: "id",
        align: "center",
        sortable: false,
      },
    ];

    onMounted(async function () {
      await store.fetchPuestos();
    });

    const puestos = computed(function () {
      return store.puestos || [];
    });

    const loading = computed(function () {
      return store.loading;
    });

    const areaOptions = computed(function () {
      const values = puestos.value
        .map(function (p) {
          return p.area;
        })
        .filter(function (v) {
          return !!v;
        });
      const unique = Array.from(new Set(values)).sort();
      return [{ label: "Todas", value: null }].concat(
        unique.map(function (v) {
          return { label: v, value: v };
        })
      );
    });

    const contratoOptions = computed(function () {
      const values = puestos.value
        .map(function (p) {
          return p.tipoContrato;
        })
        .filter(function (v) {
          return !!v;
        });
      const unique = Array.from(new Set(values)).sort();
      return [{ label: "Todos", value: null }].concat(
        unique.map(function (v) {
          return { label: v, value: v };
        })
      );
    });

    const estadoOptions = [
      { label: "Todos", value: null },
      { label: "Activo", value: "ACTIVO" },
      { label: "Inactivo", value: "INACTIVO" },
    ];

    const filteredPuestos = computed(function () {
      const q = (search.value || "").toLowerCase().trim();
      return puestos.value.filter(function (p) {
        const matchQuery =
          !q ||
          (p.nombreCargo || "").toLowerCase().indexOf(q) >= 0 ||
          (p.codigoCargo || "").toLowerCase().indexOf(q) >= 0 ||
          (p.area || "").toLowerCase().indexOf(q) >= 0 ||
          (p.tipoContrato || "").toLowerCase().indexOf(q) >= 0;

        const matchEstado =
          !estadoFilter.value || p.estado === estadoFilter.value;
        const matchArea = !areaFilter.value || p.area === areaFilter.value;
        const matchContrato =
          !contratoFilter.value || p.tipoContrato === contratoFilter.value;

        return matchQuery && matchEstado && matchArea && matchContrato;
      });
    });

    const totalPages = computed(function () {
      const total = filteredPuestos.value.length;
      const per = pagination.value.rowsPerPage || 10;
      const pages = Math.ceil(total / per);
      return pages > 0 ? pages : 1;
    });

    const paginationLabel = computed(function () {
      const total = filteredPuestos.value.length;
      if (total === 0) {
        return "Sin registros";
      }
      const per = pagination.value.rowsPerPage;
      const page = pagination.value.page;
      const from = (page - 1) * per + 1;
      const to = Math.min(page * per, total);
      return from + "–" + to + " de " + total;
    });

    const rowsPerPageSelectOptions = computed(function () {
      return ROWS_OPTIONS.map(function (v) {
        return { label: String(v), value: v };
      });
    });

    watch([search, estadoFilter, areaFilter, contratoFilter], function () {
      pagination.value.page = 1;
    });

    watch(
      function () {
        return pagination.value.rowsPerPage;
      },
      function () {
        pagination.value.page = 1;
      }
    );

    watch(totalPages, function (val) {
      if (pagination.value.page > val) {
        pagination.value.page = val;
      }
    });

    const editPuesto = function (id) {
      router.push("/talento-humano/puestos-trabajo/editar/" + id);
    };

    const viewPuesto = function (puesto) {
      selectedPuesto.value = puesto || null;
      showDetailModal.value = true;
    };

    const confirmDelete = function (puesto) {
      $q.dialog({
        title: "Confirmar desactivación",
        message: "¿Deseas desactivar el cargo " + puesto.nombreCargo + "?",
        cancel: true,
        persistent: true,
      }).onOk(async function () {
        try {
          await store.deletePuesto(puesto.id);
          $q.notify({
            type: "positive",
            message: "Cargo desactivado correctamente",
          });
        } catch (error) {
          $q.notify({
            type: "negative",
            message: "Error al desactivar el cargo",
          });
        }
      });
    };

    return {
      puestos,
      loading,
      columns,
      search,
      estadoFilter,
      areaFilter,
      contratoFilter,
      areaOptions,
      contratoOptions,
      estadoOptions,
      filteredPuestos,
      showDetailModal,
      selectedPuesto,
      viewPuesto,
      editPuesto,
      confirmDelete,
      pagination,
      rowsPerPageOptions,
      rowsPerPageSelectOptions,
      totalPages,
      paginationLabel,
    };
  },
};
</script>

<style scoped>
.ptl-page {
  background: #f8fafc;
}

.ptl-container {
  max-width: 2520px;
  margin: 0 auto;
}

.ptl-header {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem 1.25rem;
  margin-bottom: 1rem;
}

.ptl-title {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  color: #0f172a;
}

.ptl-subtitle {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.ptl-card {
  border-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.ptl-toolbar {
  padding: 1rem 1.25rem;
}

.ptl-toolbar-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 1200px) {
  .ptl-toolbar-grid {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
}

.ptl-search-wrap {
  width: 100%;
  max-width: 32rem;
}

.ptl-search-input {
  width: 100%;
}

:deep(.ptl-search-input .q-field__control) {
  min-height: 48px;
  border-radius: 16px;
  background-color: #fff;
}

:deep(.ptl-search-input .q-field__native) {
  font-size: 0.875rem;
}

:deep(.ptl-search-input.q-field--focused .q-field__control) {
  box-shadow: 0 0 0 4px rgba(134, 239, 172, 0.35);
}

.ptl-filter-wrap {
  width: 100%;
}

@media (min-width: 600px) {
  .ptl-filter-wrap {
    max-width: 220px;
  }
}

:deep(.ptl-filter .q-field__control) {
  min-height: 44px;
  border-radius: 12px;
}

.ptl-action-wrap {
  width: 100%;
}

@media (min-width: 600px) {
  .ptl-action-wrap {
    width: auto;
    margin-left: auto;
  }
}

.ptl-primary-btn {
  border-radius: 16px;
  background: #16a34a !important;
  color: #fff !important;
  font-weight: 500;
  padding: 0.7rem 1.15rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  transition: all 0.2s ease;
  width: 100%;
}

@media (min-width: 600px) {
  .ptl-primary-btn {
    width: auto;
  }
}

.ptl-primary-btn:hover {
  background: #15803d !important;
}

:deep(.ptl-table .q-table thead th) {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  color: #64748b;
  background-color: #f8fafc;
}

:deep(.ptl-table .q-table tbody td) {
  font-size: 0.875rem;
  line-height: 1.5;
  color: #334155;
  font-weight: 500;
  padding-top: 14px;
  padding-bottom: 14px;
}

:deep(.ptl-table .q-table tbody tr:hover) {
  background: #f8fafc;
  transition: background-color 0.2s ease;
}

.ptl-status-chip {
  font-weight: 500;
  border-radius: 6px !important;
}

.ptl-actions {
  gap: 2px;
}

.ptl-action-btn {
  opacity: 0.9;
}

.ptl-action-btn:hover {
  opacity: 1;
  background-color: #f1f5f9;
}

.ptl-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
}

.ptl-rows-select {
  min-width: 88px;
}

.ptl-detail-card {
  width: 100%;
  max-width: 760px;
  border-radius: 24px;
  box-shadow:
    0 20px 30px -12px rgba(15, 23, 42, 0.12),
    0 8px 12px -8px rgba(15, 23, 42, 0.08);
}

.ptl-detail-header {
  border-bottom: 1px solid #f1f5f9;
  padding: 24px 24px 20px;
  margin-bottom: 8px;
}

.ptl-detail-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
}

.ptl-detail-subtitle {
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: #64748b;
}

.ptl-detail-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 8px;
}

.ptl-detail-block {
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 14px 16px;
  background: #fff;
}

.ptl-detail-block--description {
  background: #fafafa;
}

.ptl-detail-caption {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 10px;
}

.ptl-detail-main-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 10px;
}

.ptl-detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.ptl-detail-row:last-child {
  margin-bottom: 0;
}

.ptl-detail-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 500;
  color: #94a3b8;
}

.ptl-detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  line-height: 1.45;
}

.ptl-detail-description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #475569;
  white-space: pre-line;
}

@media (min-width: 768px) {
  .ptl-detail-header {
    padding: 32px 32px 20px;
  }

  .ptl-detail-stack {
    padding: 0 16px 8px;
  }
}
</style>
