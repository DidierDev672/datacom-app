<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col text-h5 text-weight-bold">Requisiciones de Compras</div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Nueva Requisición"
          @click="$router.push('/abastecimiento/requisiciones/nueva')"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg items-center">
      <div class="col-12 col-md-5">
        <SearchInputComponent
          v-model="filtroSearch"
          placeholder="Buscar por proyecto o solicitante..."
          @input="cargarDatos"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <DateInputComponent
          v-model="filtroFecha"
          label="Fecha Solicitud"
          @input="cargarDatos"
        />
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-select
          v-model="filtroEstado"
          :options="opcionesEstado"
          label="Estado"
          dense
          outlined
          clearable
          class="status-select-modern"
          @input="cargarDatos"
        />
      </div>
    </div>

    <!-- Lista local de productos (pedido) -->
    <q-card flat bordered class="productos-pedido-card q-mb-lg">
      <q-card-section class="q-pb-none">
        <div class="text-h6 text-weight-medium q-mb-xs">Lista de productos</div>
        <div class="text-caption text-grey-7 q-mb-md">
          Registre los ítems del pedido. El total general se calcula
          automáticamente.
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-table
          :data="itemsPedidoLocal"
          :columns="columnasProductosPedido"
          row-key="_localId"
          flat
          bordered
          dense
          class="tabla-productos-pedido"
          hide-pagination
          :pagination="{ rowsPerPage: 0 }"
          no-data-label="Sin ítems — use «Agregar ítem»"
        >
          <template v-slot:body-cell-nombre="props">
            <q-td :props="props">
              <q-input
                v-model="props.row.nombre"
                dense
                outlined
                placeholder="Nombre del producto"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-unidad="props">
            <q-td :props="props">
              <q-select
                v-model="props.row.unidad"
                :options="opcionesUnidadPedido"
                dense
                outlined
              />
            </q-td>
          </template>
          <template v-slot:body-cell-cantidad="props">
            <q-td :props="props">
              <q-input
                v-model.number="props.row.cantidad"
                type="number"
                dense
                outlined
                min="0"
                step="any"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-precioUnitario="props">
            <q-td :props="props">
              <q-input
                v-model.number="props.row.precioUnitario"
                type="number"
                dense
                outlined
                min="0"
                step="any"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-totalLinea="props">
            <q-td :props="props" class="text-weight-medium">
              {{ formatMoneyCustom(totalLineaPedido(props.row)) }}
            </q-td>
          </template>
          <template v-slot:body-cell-accionesProd="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                dense
                icon="delete_outline"
                color="grey-7"
                aria-label="Eliminar ítem"
                @click="eliminarItemPedidoLocal(props.row)"
              />
            </q-td>
          </template>
        </q-table>

        <div class="row items-center q-mt-md q-col-gutter-sm wrap">
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="Agregar ítem"
              outline
              @click="agregarItemPedidoLocal"
            />
          </div>
          <q-space class="gt-xs" />
          <div class="col-12 col-sm-auto text-right q-mt-sm q-mt-sm-none">
            <div class="text-caption text-grey-7">
              Valor total del pedido (general)
            </div>
            <div class="text-h6 text-weight-bold text-primary">
              {{ formatMoneyCustom(totalPedidoLocal) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-table
      :data="store.requisiciones"
      :columns="columns"
      row-key="idRequisicion"
      :loading="store.isLoading"
      flat
      bordered
      no-data-label="No hay requisiciones"
      class="tabla-estilizada"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <span
            class="badge-estado"
            :style="{ backgroundColor: getBadgeColor(props.row.status) }"
          >
            {{ props.row.status || "SIN ESTADO" }}
          </span>
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <div class="row no-wrap justify-center q-gutter-x-xs">
            <button
              class="btn-accion btn-ver"
              title="Ver detalle"
              @click="abrirDetalle(props.row)"
            >
              <q-icon name="visibility" size="16px" />
            </button>
            <button
              class="btn-accion btn-cotizacion"
              title="Agregar cotizaciones"
              @click="irACotizaciones(props.row)"
            >
              <q-icon name="add" size="18px" />
            </button>
            <button
              class="btn-accion btn-eliminar"
              title="Eliminar"
              @click="confirmarEliminar(props.row)"
            >
              <q-icon name="delete" size="16px" />
            </button>
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <!-- Modal: Detalle de Requisición — Rediseño ejecutivo               -->
    <!-- ═══════════════════════════════════════════════════════════════════ -->
    <q-dialog v-model="modalVisible">
      <q-card class="detail-modal">
        <!-- ─── 1. HEADER EJECUTIVO ─── -->
        <div class="detail-header">
          <div class="detail-header__content">
            <div class="detail-header__title-row">
              <div>
                <div class="detail-header__title">
                  Requisición #{{
                    requisicionSeleccionada
                      ? store.requisiciones.indexOf(requisicionSeleccionada) + 1
                      : ""
                  }}
                </div>
                <div class="detail-header__meta">
                  <span
                    class="detail-badge"
                    :style="
                      requisicionSeleccionada
                        ? {
                            backgroundColor: getBadgeColor(
                              requisicionSeleccionada.status
                            ),
                          }
                        : {}
                    "
                  >
                    {{
                      requisicionSeleccionada
                        ? requisicionSeleccionada.status || "SIN ESTADO"
                        : ""
                    }}
                  </span>
                  <span class="detail-header__date">
                    <q-icon name="event" size="14px" class="q-mr-xs" />
                    {{
                      requisicionSeleccionada
                        ? requisicionSeleccionada.fechaSolicitud
                        : ""
                    }}
                  </span>
                </div>
              </div>
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
                class="detail-header__close"
              />
            </div>

            <!-- Badge financiero prominente -->
            <div class="detail-total-badge" v-if="requisicionSeleccionada">
              <div class="detail-total-badge__label">Total requisición</div>
              <div class="detail-total-badge__value">
                {{
                  formatMoneyCustom(
                    calcularTotalRequisicion(requisicionSeleccionada.items)
                  )
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- ─── CUERPO DEL MODAL ─── -->
        <q-card-section class="detail-body" v-if="requisicionSeleccionada">
          <!-- ─── 2. RESUMEN RÁPIDO — Tarjetas compactas ─── -->
          <div class="detail-summary">
            <div class="detail-summary__card">
              <div
                class="detail-summary__icon-wrap"
                style="background: #eff6ff"
              >
                <q-icon name="tag" size="18px" color="blue-7" />
              </div>
              <div>
                <div class="detail-summary__label">Nº</div>
                <div class="detail-summary__value">
                  {{ store.requisiciones.indexOf(requisicionSeleccionada) + 1 }}
                </div>
              </div>
            </div>
            <div class="detail-summary__card">
              <div
                class="detail-summary__icon-wrap"
                style="background: #f0fdf4"
              >
                <q-icon name="business_center" size="18px" color="green-7" />
              </div>
              <div>
                <div class="detail-summary__label">Proyecto</div>
                <div class="detail-summary__value">
                  {{ requisicionSeleccionada.proyecto || "—" }}
                </div>
              </div>
            </div>
            <div class="detail-summary__card">
              <div
                class="detail-summary__icon-wrap"
                style="background: #fff7ed"
              >
                <q-icon name="person" size="18px" color="orange-7" />
              </div>
              <div>
                <div class="detail-summary__label">Solicitante</div>
                <div class="detail-summary__value">
                  {{ requisicionSeleccionada.solicitante || "—" }}
                </div>
              </div>
            </div>
          </div>

          <!-- ─── 3. ÍTEMS — Cards si ≤3, tabla si >3 ─── -->
          <div class="detail-section" style="margin-top: 32px">
            <div class="detail-section__header">
              <q-icon
                name="inventory_2"
                size="20px"
                color="blue-7"
                class="q-mr-sm"
              />
              <span>Detalle de Ítems</span>
              <span class="detail-section__count">{{
                (requisicionSeleccionada.items || []).length
              }}</span>
            </div>

            <!-- Vista CARDS (pocos ítems) -->
            <div
              v-if="
                !requisicionSeleccionada.items ||
                requisicionSeleccionada.items.length <= 3
              "
              class="detail-items-cards"
            >
              <div
                v-for="(item, idx) in requisicionSeleccionada.items || []"
                :key="idx"
                class="detail-item-card"
              >
                <div class="detail-item-card__name">{{ item.detalle }}</div>
                <div class="detail-item-card__row">
                  <div class="detail-item-card__field">
                    <span class="detail-item-card__label">Cantidad</span>
                    <span class="detail-item-card__val"
                      >{{ item.cantidad }} {{ item.unidad || "" }}</span
                    >
                  </div>
                  <div class="detail-item-card__field">
                    <span class="detail-item-card__label">V. Unitario</span>
                    <span class="detail-item-card__val">{{
                      formatMoneyCustom(item.precioUnitario)
                    }}</span>
                  </div>
                  <div
                    class="detail-item-card__field detail-item-card__field--total"
                  >
                    <span class="detail-item-card__label">Total</span>
                    <span
                      class="detail-item-card__val detail-item-card__val--total"
                    >
                      {{
                        formatMoneyCustom(
                          (item.cantidad || 0) * (item.precioUnitario || 0)
                        )
                      }}
                    </span>
                  </div>
                </div>
              </div>

              <div
                v-if="
                  !requisicionSeleccionada.items ||
                  requisicionSeleccionada.items.length === 0
                "
                class="detail-empty"
              >
                <q-icon name="inbox" size="28px" color="grey-5" />
                <span>No hay ítems registrados</span>
              </div>
            </div>

            <!-- Vista TABLA (muchos ítems) -->
            <q-table
              v-else
              :data="requisicionSeleccionada.items"
              :columns="columnasItems"
              row-key="idItem"
              flat
              bordered
              dense
              hide-pagination
              :pagination="{ rowsPerPage: 0 }"
              no-data-label="No hay ítems registrados"
              class="tabla-items-detalle"
            >
              <template v-slot:bottom-row>
                <q-tr class="bg-grey-1">
                  <q-td
                    colspan="4"
                    class="text-right"
                    style="
                      font-size: 14px;
                      font-weight: 600;
                      color: #111827;
                      padding: 10px 12px;
                    "
                  >
                    TOTAL GENERAL
                  </q-td>
                  <q-td class="text-right col-total">
                    {{
                      formatMoneyCustom(
                        calcularTotalRequisicion(requisicionSeleccionada.items)
                      )
                    }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>

          <!-- ─── 4. JUSTIFICACIÓN — Bloque visual independiente ─── -->
          <div class="detail-section" style="margin-top: 32px">
            <div class="detail-section__header">
              <q-icon
                name="description"
                size="20px"
                color="indigo-5"
                class="q-mr-sm"
              />
              <span>Justificación</span>
            </div>
            <div class="detail-text-block">
              {{
                requisicionSeleccionada.justificacion ||
                "No se proporcionó justificación para esta requisición."
              }}
            </div>
          </div>

          <!-- ─── 5. RECOMENDACIONES — Bloque visual independiente ─── -->
          <div class="detail-section" style="margin-top: 32px">
            <div class="detail-section__header">
              <q-icon
                name="lightbulb"
                size="20px"
                color="amber-8"
                class="q-mr-sm"
              />
              <span>Recomendaciones</span>
            </div>
            <div class="detail-text-block">
              {{
                requisicionSeleccionada.recomendaciones ||
                "No hay recomendaciones registradas."
              }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import DateInputComponent from "../components/DateInputComponent.vue";
import SearchInputComponent from "../components/SearchInputComponent.vue";
import { useRequisicionStore } from "../store/useRequisicionStore";

export default {
  name: "RequisicionesListView",
  components: {
    SearchInputComponent,
    DateInputComponent,
  },
  data() {
    return {
      modalVisible: false,
      requisicionSeleccionada: null,
      filtroEstado: null,
      filtroSearch: "",
      filtroFecha: "",
      opcionesEstado: [
        { label: "Borrador", value: "BORRADOR" },
        { label: "Pendiente / Enviada", value: "ENVIADA" },
        { label: "Aprobada", value: "APROBADA" },
        { label: "Rechazada", value: "RECHAZADA" },
      ],
      itemsPedidoLocal: [],
      nextLocalItemId: 1,
      opcionesUnidadPedido: [
        "UNIDAD",
        "METROS",
        "KILOS",
        "LIBRAS",
        "MILIGRAMOS",
      ],
      columnasProductosPedido: [
        {
          name: "nombre",
          label: "Nombre del producto",
          align: "left",
          field: "nombre",
          sortable: false,
        },
        {
          name: "unidad",
          label: "Unidad de medida",
          align: "center",
          field: "unidad",
          sortable: false,
        },
        {
          name: "cantidad",
          label: "Cantidad",
          align: "right",
          field: "cantidad",
          sortable: false,
        },
        {
          name: "precioUnitario",
          label: "Precio unitario",
          align: "right",
          field: "precioUnitario",
          sortable: false,
        },
        {
          name: "totalLinea",
          label: "Total de pedido",
          align: "right",
          field: "totalLinea",
          sortable: false,
        },
        {
          name: "accionesProd",
          label: "",
          align: "center",
          field: "accionesProd",
          sortable: false,
          style: "width: 48px",
        },
      ],
      columns: [
        {
          name: "index",
          label: "Nº",
          align: "left",
          field: (row) => this.store.requisiciones.indexOf(row) + 1,
          sortable: false,
          classes: "col-codigo",
        },
        {
          name: "proyecto",
          label: "Proyecto",
          align: "left",
          field: "proyecto",
          sortable: true,
          classes: "col-proyecto",
        },
        {
          name: "solicitante",
          label: "Solicitante",
          align: "left",
          field: "solicitante",
          sortable: true,
          classes: "col-solicitante",
        },
        {
          name: "fechaSolicitud",
          label: "Fecha Solicitud",
          align: "center",
          field: "fechaSolicitud",
          sortable: true,
          classes: "col-fecha",
        },
        {
          name: "status",
          label: "Estado",
          align: "center",
          field: "status",
          sortable: true,
        },
        { name: "acciones", label: "Acciones", align: "center" },
      ],
      columnasItems: [
        { name: "detalle", label: "Detalle", align: "left", field: "detalle" },
        { name: "unidad", label: "Unidad", align: "center", field: "unidad" },
        {
          name: "cantidad",
          label: "Cantidad",
          align: "center",
          field: "cantidad",
          classes: "col-numerico",
        },
        {
          name: "precioUnitario",
          label: "V. Unitario",
          align: "right",
          field: "precioUnitario",
          classes: "col-numerico",
          format: (val) =>
            val
              ? new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(val)
              : "$ 0",
        },
        {
          name: "total",
          label: "V. Total",
          align: "right",
          field: (row) => (row.cantidad || 0) * (row.precioUnitario || 0),
          classes: "col-total",
          format: (val) =>
            val
              ? new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                }).format(val)
              : "$ 0",
        },
      ],
    };
  },
  computed: {
    store() {
      return useRequisicionStore();
    },
    totalPedidoLocal() {
      var self = this;
      return this.itemsPedidoLocal.reduce(function (acc, row) {
        return acc + self.totalLineaPedido(row);
      }, 0);
    },
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    abrirDetalle(row) {
      this.requisicionSeleccionada = row;
      this.modalVisible = true;
    },
    agregarItemPedidoLocal() {
      this.itemsPedidoLocal.push({
        _localId: this.nextLocalItemId++,
        nombre: "",
        unidad: "UNIDAD",
        cantidad: 1,
        precioUnitario: 0,
      });
    },
    eliminarItemPedidoLocal(row) {
      var id = row._localId;
      this.itemsPedidoLocal = this.itemsPedidoLocal.filter(function (r) {
        return r._localId !== id;
      });
    },
    totalLineaPedido(row) {
      var c = Number(row.cantidad);
      if (isNaN(c) || c < 0) c = 0;
      var p = Number(row.precioUnitario);
      if (isNaN(p) || p < 0) p = 0;
      return c * p;
    },
    irACotizaciones(row) {
      var rid =
        row &&
        (row.idRequisicion != null && row.idRequisicion !== ""
          ? row.idRequisicion
          : row.id != null && row.id !== ""
          ? row.id
          : null);
      if (rid === null || rid === undefined || rid === "") {
        this.$q.notify({
          type: "warning",
          message: "Esta fila no tiene identificador de requisición.",
          position: "top-right",
        });
        return;
      }
      this.$router.push({
        name: "requisicion-cotizaciones-bienvenida",
        params: { idRequisicion: String(rid) },
      });
    },
    calcularTotalRequisicion(items) {
      if (!items || !items.length) return 0;
      return items.reduce(
        (acc, row) => acc + (row.cantidad || 0) * (row.precioUnitario || 0),
        0
      );
    },
    formatMoneyCustom(val) {
      return val
        ? new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(val)
        : "$ 0";
    },
    confirmarEliminar(row) {
      this.$q
        .dialog({
          title: "Confirmar eliminación",
          message: `¿Estás seguro de que deseas eliminar la requisición #${
            this.store.requisiciones.indexOf(row) + 1
          }? Esta acción no se puede deshacer.`,
          cancel: true,
          persistent: true,
          ok: {
            label: "Eliminar",
            color: "negative",
            flat: true,
          },
          cancel: {
            label: "Cancelar",
            color: "primary",
            flat: true,
          },
        })
        .onOk(async () => {
          try {
            const requisicionStore = useRequisicionStore();
            await requisicionStore.deleteRequisicion(row.idRequisicion);
            this.$q.notify({
              type: "positive",
              message: "Requisición eliminada correctamente",
              position: "top-right",
            });
          } catch (error) {
            console.error("Error al eliminar requisición:", error);
            this.$q.notify({
              type: "negative",
              message: "No se pudo eliminar la requisición",
              position: "top-right",
            });
          }
        });
    },
    cargarDatos() {
      const filters = {
        status: this.filtroEstado ? this.filtroEstado.value : null,
        search: this.filtroSearch,
        fechaSolicitud: this.filtroFecha,
      };
      this.store.fetchAll(filters);
    },
    getBadgeColor(status) {
      if (!status) return "#6B7280";
      const s = status.toUpperCase();
      if (["ACTIVO", "APROBADA"].includes(s)) return "#16A34A";
      if (["PENDIENTE", "ENVIADA"].includes(s)) return "#CA8A04";
      if (["RECHAZADA", "RECHAZADO"].includes(s)) return "#DC2626";
      if (s === "BORRADOR") return "#6B7280";
      return "#6B7280";
    },
  },
};
</script>

<style scoped>
/* Espacio y Encabezados */
::v-deep .tabla-estilizada .q-table th {
  padding: 12px 16px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  color: #6b7280 !important;
}

::v-deep .tabla-estilizada .q-table tbody td {
  height: 48px !important;
  padding: 12px 16px !important;
}

/* Tipografía de columnas específicas */
::v-deep .tabla-estilizada .q-table tbody td.col-codigo {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #111827 !important;
}

::v-deep .tabla-estilizada .q-table tbody td.col-proyecto {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
}

::v-deep .tabla-estilizada .q-table tbody td.col-solicitante {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #374151 !important;
}

::v-deep .tabla-estilizada .q-table tbody td.col-fecha {
  font-size: 13px !important;
  font-weight: 400 !important;
  color: #6b7280 !important;
}

/* Estado (Badge) */
.badge-estado {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Acciones (Botón con ícono) */
.btn-accion {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition: background 0.2s ease;
}

.btn-accion:hover {
  background: #f3f4f6;
}

.btn-eliminar:hover {
  background: #fee2e2 !important;
  color: #dc2626 !important;
}

.btn-ver:hover {
  background: #dbeafe !important;
  color: #2563eb !important;
}

.btn-cotizacion:hover {
  background: #d1fae5 !important;
  color: #059669 !important;
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Modal Detalle — Rediseño ejecutivo                                */
/* ═══════════════════════════════════════════════════════════════════ */

/* --- Modal base --- */
.detail-modal {
  width: 720px;
  max-width: 92vw;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
}

/* --- 1. Header ejecutivo --- */
.detail-header {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
  padding: 0;
}

.detail-header__content {
  padding: 24px 28px 20px;
}

.detail-header__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.detail-header__title {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.detail-header__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.detail-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-header__date {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  display: inline-flex;
  align-items: center;
}

.detail-header__close {
  color: rgba(255, 255, 255, 0.7) !important;
}
.detail-header__close:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

/* --- Badge financiero --- */
.detail-total-badge {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(8px);
}

.detail-total-badge__label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.detail-total-badge__value {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
}

/* --- Cuerpo --- */
.detail-body {
  padding: 28px !important;
  background: #fafbfc;
}

/* --- 2. Tarjetas de resumen --- */
.detail-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 600px) {
  .detail-summary {
    grid-template-columns: 1fr;
  }
}

.detail-summary__card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.detail-summary__card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
}

.detail-summary__icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-summary__label {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1;
  margin-bottom: 4px;
}

.detail-summary__value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
  word-break: break-word;
}

/* --- 3. Secciones genéricas --- */
.detail-section__header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 14px;
}

.detail-section__count {
  margin-left: 8px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
}

/* --- 4. Ítems como cards --- */
.detail-items-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px 20px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.detail-item-card:hover {
  border-color: #c7d2fe;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.06);
}

.detail-item-card__name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.detail-item-card__row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.detail-item-card__field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 100px;
}

.detail-item-card__field--total {
  margin-left: auto;
}

.detail-item-card__label {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.detail-item-card__val {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
}

.detail-item-card__val--total {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

/* --- Empty state --- */
.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 400;
}

/* --- 5. Bloques de texto (justificación / recomendaciones) --- */
.detail-text-block {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.65;
  color: #374151;
}

/* Tabla productos pedido (lista local) */
.productos-pedido-card {
  border-radius: 12px;
  border-color: #e5e7eb !important;
}

.tabla-productos-pedido ::v-deep .q-table thead th {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #6b7280;
}

.tabla-productos-pedido ::v-deep .q-table tbody td {
  vertical-align: middle;
}

/* Status Select Styles */
::v-deep .status-select-modern .q-field__control {
  height: 44px !important;
  border-radius: 8px !important;
}
::v-deep .status-select-modern .q-field__native {
  font-size: 14px !important;
  font-weight: 500 !important;
}
</style>
