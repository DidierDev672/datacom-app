<template>
  <q-dialog :value="value" persistent @input="$emit('input', $event)">
    <q-card class="budget-detail-dialog">
      <q-card-section class="row items-center justify-between q-pb-sm">
        <div>
          <div class="text-h6 text-weight-bold">Detalles del presupuesto</div>
          <div v-if="budget" class="text-body2 text-grey-7">
            {{ budget.name }}
          </div>
        </div>
        <q-btn icon="close" flat round dense color="grey-7" @click="cerrar" />
      </q-card-section>

      <q-separator />

      <!-- Tabla de captura para crear detalles -->
      <q-card-section>
        <div class="row items-center justify-between q-mb-sm">
          <div>
            <div class="text-subtitle2 text-weight-medium">
              Captura de detalles
            </div>
            <div class="text-caption text-grey-7">
              El total por fila se calcula como precio unitario × cantidad. Al
              guardar, se registran con fecha de hoy ({{ fechaHoy }}) e ID
              automático.
            </div>
          </div>
          <div class="row items-center q-gutter-sm">
            <q-badge
              color="primary"
              class="total-pedido-badge text-subtitle2 q-px-md q-py-sm"
            >
              Total del pedido: {{ formatCurrency(totalPedidoCaptura) }}
            </q-badge>
            <q-btn
              outline
              no-caps
              color="primary"
              icon="add"
              label="Agregar fila"
              :disable="!!editandoId"
              @click="agregarFila"
            />
          </div>
        </div>

        <q-table
          :data="filasCaptura"
          :columns="columnasCaptura"
          row-key="_key"
          flat
          bordered
          dense
          hide-bottom
          :pagination="{ rowsPerPage: 0 }"
          no-data-label="Agrega al menos una fila para registrar detalles"
          class="captura-table q-mb-md"
        >
          <template v-slot:body-cell-areaName="props">
            <q-td :props="props">
              <q-input
                v-model.trim="props.row.areaName"
                dense
                outlined
                hide-bottom-space
                placeholder="Nombre del área"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-description="props">
            <q-td :props="props">
              <q-input
                v-model.trim="props.row.description"
                dense
                outlined
                hide-bottom-space
                placeholder="Descripción"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <q-input
                v-model.number="props.row.quantity"
                dense
                outlined
                hide-bottom-space
                type="number"
                min="1"
                step="1"
                placeholder="Cant."
                @input="actualizarTotalFila(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-spentAmount="props">
            <q-td :props="props">
              <q-input
                v-model.number="props.row.spentAmount"
                dense
                outlined
                hide-bottom-space
                type="number"
                min="0"
                step="0.01"
                prefix="$"
                placeholder="Precio unitario"
                @input="actualizarTotalFila(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-orderTotal="props">
            <q-td :props="props" class="text-right">
              <span class="text-weight-medium text-primary">
                {{ formatCurrency(calcularTotalFila(props.row)) }}
              </span>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="remove_circle_outline"
                :disable="filasCaptura.length <= 1 && !editandoId"
                @click="quitarFila(props.row._key)"
              >
                <q-tooltip>Quitar fila</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>

        <div v-if="errorGlobal" class="text-negative text-caption q-mb-sm">
          {{ errorGlobal }}
        </div>

        <div class="row q-gutter-sm justify-end">
          <q-btn
            v-if="editandoId"
            flat
            no-caps
            color="grey-8"
            label="Cancelar edición"
            @click="cancelarEdicion"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="save"
            :label="editandoId ? 'Actualizar detalle' : 'Guardar detalles'"
            :loading="guardando"
            :disable="filasCaptura.length === 0"
            @click="guardar"
          />
        </div>
      </q-card-section>

      <q-separator />

      <!-- Detalles ya registrados -->
      <q-card-section>
        <div class="text-subtitle2 text-weight-medium q-mb-sm">
          Detalles registrados
        </div>
        <q-table
          :data="detalles"
          :columns="columnasRegistradas"
          row-key="id"
          flat
          bordered
          dense
          :loading="cargando"
          no-data-label="Sin detalles registrados"
        >
          <template v-slot:body-cell-spent_amount="props">
            <q-td :props="props">{{
              formatCurrency(props.row.spent_amount)
            }}</q-td>
          </template>
          <template v-slot:body-cell-order_total="props">
            <q-td :props="props">{{
              formatCurrency(props.row.order_total)
            }}</q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-xs">
              <q-btn
                flat
                round
                dense
                color="warning"
                icon="edit"
                @click="iniciarEdicion(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="eliminarDetalle(props.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          unelevated
          no-caps
          label="Cerrar"
          color="grey-3"
          text-color="grey-9"
          @click="cerrar"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { CreateBudgetDetail } from "../../application/CreateBudgetDetail";
import { GetBudgetDetails } from "../../application/GetBudgetDetails";
import { UpdateBudgetDetail } from "../../application/UpdateBudgetDetail";
import { DeleteBudgetDetail } from "../../application/DeleteBudgetDetail";

let filaKey = 0;

function nuevaFilaCaptura() {
  return {
    _key: `fila-${++filaKey}`,
    areaName: "",
    description: "",
    quantity: 1,
    spentAmount: null,
    orderTotal: null,
  };
}

function esVacio(valor) {
  return valor === null || valor === undefined || String(valor).trim() === "";
}

export default {
  name: "BudgetDetailDialog",

  props: {
    value: { type: Boolean, default: false },
    budget: { type: Object, default: null },
  },

  data() {
    return {
      detalles: [],
      filasCaptura: [nuevaFilaCaptura()],
      cargando: false,
      guardando: false,
      errorGlobal: "",
      editandoId: null,
      columnasCaptura: [
        {
          name: "areaName",
          label: "Nombre del área",
          field: "areaName",
          align: "left",
        },
        {
          name: "description",
          label: "Descripción",
          field: "description",
          align: "left",
        },
        {
          name: "quantity",
          label: "Cantidad",
          field: "quantity",
          align: "center",
          style: "width: 100px",
        },
        {
          name: "spentAmount",
          label: "Precio unitario",
          field: "spentAmount",
          align: "right",
        },
        {
          name: "orderTotal",
          label: "Total pedido",
          field: "orderTotal",
          align: "right",
        },
        {
          name: "actions",
          label: "",
          field: "actions",
          align: "center",
          style: "width: 56px",
        },
      ],
      columnasRegistradas: [
        {
          name: "detail_date",
          label: "Fecha",
          field: "detail_date",
          align: "left",
          sortable: true,
        },
        {
          name: "area_name",
          label: "Área",
          field: "area_name",
          align: "left",
          sortable: true,
        },
        {
          name: "description",
          label: "Descripción",
          field: "description",
          align: "left",
        },
        {
          name: "quantity",
          label: "Cantidad",
          field: "quantity",
          align: "center",
          sortable: true,
        },
        {
          name: "spent_amount",
          label: "Precio unitario",
          field: "spent_amount",
          align: "right",
        },
        {
          name: "order_total",
          label: "Total pedido",
          field: "order_total",
          align: "right",
        },
        {
          name: "actions",
          label: "Acciones",
          field: "actions",
          align: "center",
        },
      ],
    };
  },

  computed: {
    fechaHoy() {
      return new Date().toLocaleDateString("es-CO");
    },
    totalPedidoCaptura() {
      return this.filasCaptura.reduce(
        (suma, fila) => suma + this.calcularTotalFila(fila),
        0
      );
    },
  },

  watch: {
    value(abierto) {
      if (abierto && this.budget) {
        this.cargarDetalles();
        if (!this.editandoId && this.filasCaptura.length === 0) {
          this.filasCaptura = [nuevaFilaCaptura()];
        }
      }
    },
  },

  methods: {
    agregarFila() {
      const fila = nuevaFilaCaptura();
      this.actualizarTotalFila(fila);
      this.filasCaptura.push(fila);
    },

    quitarFila(key) {
      if (this.filasCaptura.length <= 1) return;
      this.filasCaptura = this.filasCaptura.filter((f) => f._key !== key);
    },

    calcularTotalFila(fila) {
      const precio = Number(fila.spentAmount);
      const cantidad = parseInt(fila.quantity, 10);
      if (
        isNaN(precio) ||
        precio <= 0 ||
        !Number.isInteger(cantidad) ||
        cantidad < 1
      ) {
        return 0;
      }
      return Number((precio * cantidad).toFixed(2));
    },

    actualizarTotalFila(fila) {
      fila.orderTotal = this.calcularTotalFila(fila);
    },

    validarFila(fila, indice) {
      const n = indice + 1;
      if (esVacio(fila.areaName))
        return `Fila ${n}: el nombre del área es obligatorio.`;
      if (esVacio(fila.description))
        return `Fila ${n}: la descripción es obligatoria.`;
      const qty = Number(fila.quantity);
      if (!Number.isInteger(qty) || qty < 1)
        return `Fila ${n}: la cantidad debe ser un entero mayor o igual a 1.`;
      const gastado = Number(fila.spentAmount);
      if (isNaN(gastado) || gastado <= 0)
        return `Fila ${n}: el precio unitario debe ser mayor a cero.`;
      const total = this.calcularTotalFila(fila);
      if (total <= 0)
        return `Fila ${n}: ingresa precio y cantidad para calcular el total del pedido.`;
      return null;
    },

    filaToPayload(fila) {
      const orderTotal = this.calcularTotalFila(fila);
      return {
        areaName: (fila.areaName || "").trim(),
        description: (fila.description || "").trim(),
        quantity: parseInt(fila.quantity, 10),
        spentAmount: Number(Number(fila.spentAmount).toFixed(2)),
        orderTotal,
      };
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(value || 0);
    },

    async cargarDetalles() {
      if (!this.budget || !this.budget.id) return;
      this.cargando = true;
      this.errorGlobal = "";
      try {
        const getDetails = new GetBudgetDetails();
        this.detalles = await getDetails.execute(this.budget.id);
      } catch (e) {
        this.errorGlobal =
          e && e.message ? e.message : "No se pudieron cargar los detalles.";
      } finally {
        this.cargando = false;
      }
    },

    async guardar() {
      this.errorGlobal = "";
      if (!this.budget || this.filasCaptura.length === 0) return;

      for (let i = 0; i < this.filasCaptura.length; i++) {
        const error = this.validarFila(this.filasCaptura[i], i);
        if (error) {
          this.errorGlobal = error;
          return;
        }
      }

      this.guardando = true;
      try {
        if (this.editandoId) {
          const updateDetail = new UpdateBudgetDetail();
          await updateDetail.execute(
            this.budget.id,
            this.editandoId,
            this.filaToPayload(this.filasCaptura[0])
          );
          this.$q.notify({
            type: "positive",
            message: "Detalle actualizado",
            position: "top-right",
          });
        } else {
          const createDetail = new CreateBudgetDetail();
          for (const fila of this.filasCaptura) {
            await createDetail.execute(
              this.budget.id,
              this.filaToPayload(fila)
            );
          }
          this.$q.notify({
            type: "positive",
            message: `${this.filasCaptura.length} detalle(s) registrado(s)`,
            position: "top-right",
          });
        }
        this.resetCaptura();
        await this.cargarDetalles();
        this.$emit("saved");
      } catch (e) {
        let mensaje = "No se pudo guardar el detalle.";
        if (e && Array.isArray(e.fieldErrors) && e.fieldErrors.length) {
          mensaje = e.fieldErrors.map((err) => err.message).join(" · ");
        } else if (e && e.message) {
          mensaje = e.message;
        }
        this.errorGlobal = mensaje;
      } finally {
        this.guardando = false;
      }
    },

    iniciarEdicion(row) {
      this.editandoId = row.id;
      const fila = {
        _key: `edit-${row.id}`,
        areaName: row.area_name,
        description: row.description,
        quantity: row.quantity != null ? row.quantity : 1,
        spentAmount: row.spent_amount,
        orderTotal: row.order_total,
      };
      this.actualizarTotalFila(fila);
      this.filasCaptura = [fila];
      this.errorGlobal = "";
    },

    cancelarEdicion() {
      this.editandoId = null;
      this.resetCaptura();
    },

    eliminarDetalle(row) {
      this.$q
        .dialog({
          title: "Eliminar detalle",
          message: `¿Eliminar el detalle del área "${row.area_name}"?`,
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            const deleteDetail = new DeleteBudgetDetail();
            await deleteDetail.execute(this.budget.id, row.id);
            this.$q.notify({
              type: "positive",
              message: "Detalle eliminado",
              position: "top-right",
            });
            if (this.editandoId === row.id) this.cancelarEdicion();
            await this.cargarDetalles();
            this.$emit("saved");
          } catch (e) {
            this.$q.notify({
              type: "negative",
              message: e && e.message ? e.message : "Error al eliminar",
              position: "top-right",
            });
          }
        });
    },

    resetCaptura() {
      this.editandoId = null;
      this.filasCaptura = [nuevaFilaCaptura()];
    },

    cerrar() {
      this.resetCaptura();
      this.errorGlobal = "";
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped>
.budget-detail-dialog {
  width: 95vw;
  max-width: 95vw;
  border-radius: 12px;
}
.captura-table >>> .q-field {
  min-width: 0;
}
.captura-table >>> .q-field__control {
  min-height: 36px;
}
.total-pedido-badge {
  border-radius: 8px;
  font-weight: 600;
}
</style>
