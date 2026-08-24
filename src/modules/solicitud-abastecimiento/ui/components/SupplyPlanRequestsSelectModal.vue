<template>
  <q-dialog
    :value="value"
    persistent
    transition-show="scale"
    transition-hide="scale"
    content-class="supply-plan-requests-dialog"
    @input="$emit('input', $event)"
  >
    <q-card class="select-requests-dialog w-87">
      <q-card-section class="row items-center q-pb-none">
        <q-avatar icon="fact_check" color="primary" text-color="white" />
        <div class="q-ml-md">
          <div class="text-h6">{{ dialogTitle }}</div>
          <div class="text-caption text-grey-7">
            {{ dialogSubtitle }}
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" :disable="loading" />
      </q-card-section>

      <q-card-section class="q-pt-sm">
        <q-input
          v-model="searchQuery"
          dense
          outlined
          clearable
          debounce="250"
          bg-color="white"
          placeholder="Buscar por nombre de orden o ID..."
          class="q-mb-md search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="grey-5" />
          </template>
        </q-input>

        <q-banner
          v-if="loadError"
          dense
          rounded
          class="bg-red-1 text-red-9 q-mb-md"
        >
          {{ loadError }}
        </q-banner>

        <q-table
          v-if="filteredRequests && filteredRequests.length > 0"
          flat
          bordered
          :data="filteredRequests"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 8 }"
          class="requests-select-table"
          :rows-per-page-options="[5, 8, 15, 25]"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              class="requests-select-table__row"
              @mouseenter="hoveredRowId = props.row.id"
              @mouseleave="hoveredRowId = null"
            >
              <!-- Nombre de la orden -->
              <q-td key="nombreOrden" :props="props">
                <div class="order-name-cell">
                  <span class="order-name-cell__name">
                    {{ toTitleCase(props.row.nombreOrden) }}
                  </span>
                  <span class="order-name-cell__id">
                    <q-tooltip
                      class="id-tooltip"
                      anchor="top left"
                      self="bottom left"
                    >
                      ID completo: {{ props.row.id }}
                    </q-tooltip>
                    ID: {{ shortId(props.row.id) }}
                  </span>
                </div>
              </q-td>

              <!-- Presupuesto -->
              <q-td key="presupuestoDisponible" :props="props" class="text-right">
                <span class="presupuesto-value">
                  {{ formatCurrency(props.row.presupuestoDisponible) }}
                </span>
              </q-td>

              <!-- Estado -->
              <q-td key="estado" :props="props" class="text-center">
                <q-badge
                  :color="statusColor(props.row.estado)"
                  :label="statusLabel(props.row.estado)"
                  class="estado-badge"
                />
              </q-td>

              <!-- Acción -->
              <q-td key="acciones" :props="props" class="text-center">
                <q-btn
                  :outline="hoveredRowId !== props.row.id"
                  dense
                  no-caps
                  :color="hoveredRowId === props.row.id ? 'primary' : 'grey-6'"
                  :label="hoveredRowId === props.row.id ? 'Seleccionar' : 'Elegir'"
                  :class="[
                    'select-btn',
                    { 'select-btn--active': hoveredRowId === props.row.id },
                  ]"
                  @click="selectRow(props.row)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>

        <div v-if="!loading && (!filteredRequests || filteredRequests.length === 0)"
          class="modal-empty-state">
          <div class="modal-empty-icon">
            <q-icon :name="searchQuery ? 'search_off' : 'assignment_late'" size="36px" color="white" />
          </div>
          <div class="modal-empty-title">
            {{ searchQuery ? "Sin resultados" : "No hay solicitudes registradas" }}
          </div>
          <div class="modal-empty-desc">
            {{ searchQuery
              ? "Ninguna solicitud coincide con \"" + searchQuery + "\". Prueba con otro término."
              : "Aún no hay solicitudes de plan de abastecimiento registradas en el sistema."
            }}
          </div>
          <q-btn v-if="searchQuery" flat no-caps icon="close" label="Limpiar búsqueda" color="grey-7"
            class="q-mt-sm" @click="searchQuery = ''" />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { SolicitudHttpRepository } from "../../infrastructure/SolicitudHttpRepository";
import EmptyState from "src/components/EmptyState.vue";

/**
 * Convierte un string a Title Case de forma legible.
 * Maneja MAYÚSCULAS SIN ESPACIOS, camelCase, PascalCase y texto normal.
 * Ejemplos:
 *   "CAPACITACIONTECNOLOGICA2026" → "Capacitacion Tecnologica 2026"
 *   "EquiposCientificoLaboratorio" → "Equipos Cientifico Laboratorio"
 *   "CableInfra"                   → "Cable Infra"
 *   "Hardware"                     → "Hardware"
 */
function toTitleCase(str) {
  if (!str) return "";
  var trimmed = str.trim();
  if (!trimmed) return "";

  var spaced = trimmed
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_-]+/g, " ");

  return spaced
    .toLowerCase()
    .replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    });
}

function shortId(id) {
  if (!id) return "—";
  return String(id).split("-")[0];
}

function formatCurrency(value) {
  var amount = Number(value) || 0;
  return "$" + amount.toLocaleString("es-CO");
}

export default {
  name: "SupplyPlanRequestsSelectModal",

  components: {
    EmptyState,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "Solicitudes de plan de abastecimiento",
    },
    dialogSubtitle: {
      type: String,
      default: "Seleccione una solicitud registrada en el sistema.",
    },
    noDataLabel: {
      type: String,
      default: "No hay solicitudes de plan de abastecimiento registradas",
    },
    requests: {
      type: Array,
      default: null,
    },
  },

  data() {
    return {
      searchQuery: "",
      loading: false,
      loadError: "",
      loadedRequests: [],
      hoveredRowId: null,
      columns: [
        {
          name: "nombreOrden",
          label: "Nombre de la orden",
          field: function (row) {
            return (row.nombreOrden && row.nombreOrden.trim()) || "";
          },
          align: "left",
          sortable: true,
        },
        {
          name: "presupuestoDisponible",
          label: "Presupuesto",
          field: "presupuestoDisponible",
          align: "right",
          sortable: true,
        },
        {
          name: "estado",
          label: "Estado",
          field: "estado",
          align: "center",
        },
        {
          name: "acciones",
          label: "Acción",
          field: "id",
          align: "center",
        },
      ],
    };
  },

  computed: {
    allRequests: function () {
      if (Array.isArray(this.requests)) {
        return this.requests;
      }
      return this.loadedRequests;
    },
    filteredRequests: function () {
      if (!this.searchQuery) {
        return this.allRequests;
      }

      var needle = this.searchQuery.toLowerCase();
      return this.allRequests.filter(function (item) {
        return (
          (item.nombreOrden &&
            item.nombreOrden.toLowerCase().includes(needle)) ||
          (item.id && String(item.id).toLowerCase().includes(needle))
        );
      });
    },
  },

  watch: {
    value: function (isOpen) {
      if (isOpen) {
        this.searchQuery = "";
        this.loadError = "";
        this.hoveredRowId = null;
        if (!Array.isArray(this.requests)) {
          this.loadRequests();
        }
      }
    },
  },

  methods: {
    toTitleCase: toTitleCase,
    shortId: shortId,
    formatCurrency: formatCurrency,
    hasNombreOrden: function (row) {
      return !!(row && row.nombreOrden && row.nombreOrden.trim());
    },
    statusColor: function (status) {
      var normalized = String(status || "").toUpperCase();
      if (normalized === "ACEPTADO" || normalized === "APROBADO") {
        return "green-7";
      }
      if (normalized === "DEVUELTO" || normalized === "RECHAZADO") {
        return "red";
      }
      if (normalized === "PENDIENTE") {
        return "orange";
      }
      return "grey";
    },
    statusLabel: function (status) {
      var normalized = String(status || "").toUpperCase();
      if (normalized === "ACEPTADO" || normalized === "APROBADO") {
        return "Aceptado";
      }
      if (normalized === "PENDIENTE") {
        return "Pendiente";
      }
      if (normalized === "DEVUELTO") {
        return "Devuelto";
      }
      if (normalized === "RECHAZADO") {
        return "Rechazado";
      }
      return normalized || "Registrada";
    },
    loadRequests: function () {
      var self = this;
      self.loading = true;
      self.loadError = "";

      var repository = new SolicitudHttpRepository();
      repository
        .obtenerTodas()
        .then(function (data) {
          self.loadedRequests = Array.isArray(data) ? data : [];
        })
        .catch(function (error) {
          self.loadedRequests = [];
          self.loadError =
            (error && error.message) ||
            "No fue posible cargar las solicitudes de plan de abastecimiento.";
        })
        .finally(function () {
          self.loading = false;
        });
    },
    selectRow: function (row) {
      this.$emit("selected", row);
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped>
.w-87 {
  width: 87vw;
  max-width: 1400px;
}

.select-requests-dialog {
  border-radius: 12px;
  overflow: hidden;
}

/* ── Search input ── */
.search-input .q-field__control {
  border-radius: 10px !important;
  height: 42px !important;
}

/* ── Table ── */
.requests-select-table {
  max-height: min(62vh, 560px);
}

.requests-select-table ::v-deep th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  font-weight: 600;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.requests-select-table ::v-deep td {
  padding: 0;
  vertical-align: middle;
}

/* ── Row ── */
.requests-select-table__row {
  transition: background 200ms ease;
}

.requests-select-table__row:nth-child(even) {
  background: #f9fafb;
}

.requests-select-table__row:hover {
  background: #f0fdf4 !important;
}

/* ── Order name cell ── */
.order-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
}

.order-name-cell__name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.order-name-cell__id {
  font-size: 11px;
  color: #94a3b8;
  font-family: "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
  cursor: help;
  user-select: all;
}

/* ── Presupuesto ── */
.presupuesto-value {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  font-variant-numeric: tabular-nums;
}

/* ── Estado badge ── */
.estado-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: none;
}

/* ── Select button ── */
.select-btn {
  min-width: 100px;
  font-weight: 600;
  font-size: 13px;
  border-radius: 8px;
  padding: 6px 14px;
  transition: all 200ms ease;
  border: 1.5px solid transparent;
}

.select-btn:not(.select-btn--active) {
  border-color: #d1d5db;
  color: #6b7280;
  background: transparent;
}

.select-btn--active {
  background: #4e9c4c !important;
  color: #ffffff !important;
  border-color: #4e9c4c !important;
  box-shadow: 0 2px 8px rgba(78, 156, 76, 0.3);
}

/* ── Pagination ── */
.requests-select-table ::v-deep .q-table__bottom {
  font-size: 13px;
  color: #64748b;
  padding: 10px 16px;
  border-top: 1px solid #e2e8f0;
}

.requests-select-table ::v-deep .q-table__bottom .q-btn {
  min-width: 36px;
  min-height: 36px;
}

/* ── Tooltip ── */
.id-tooltip {
  font-size: 12px;
  font-family: "SFMono-Regular", "Consolas", "Liberation Mono", monospace;
  background: #1e293b;
}

/* ── Empty state ── */
.modal-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px 40px;
  text-align: center;
}

.modal-empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 4px 14px rgba(116, 175, 126, 0.35);
}

.modal-empty-title {
  font-size: 17px;
  font-weight: 700;
  background: linear-gradient(135deg, #84b24d 0%, #4e9c4c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.modal-empty-desc {
  font-size: 13px;
  color: #64748b;
  max-width: 360px;
  line-height: 1.6;
}
</style>

<style>
.supply-plan-requests-dialog {
  width: 87vw;
  max-width: 1400px;
}

@media (max-width: 760px) {
  .supply-plan-requests-dialog {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>
