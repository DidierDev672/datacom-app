<template>
  <div>
    <div class="requesting-area-section">
      <label class="status-field-label">Gerente de compras</label>
      <div class="requesting-area-row q-mb-md">
        <q-input
          v-model="purchaseManager"
          outlined
          dense
          readonly
          bg-color="white"
          class="requesting-area-input"
          placeholder="Seleccione el gerente de compras"
        >
          <template v-slot:prepend>
            <q-icon name="manage_accounts" color="grey-6" />
          </template>
        </q-input>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="person_search"
          label="Seleccionar gerente"
          class="btn-select-requesting-area"
          @click="openPurchaseManagerDialog"
        />
      </div>

      <label class="status-field-label">Proveedor</label>
      <div class="requesting-area-row q-mb-md">
        <q-input
          v-model="supplierLabel"
          outlined
          dense
          readonly
          bg-color="white"
          class="requesting-area-input"
          placeholder="Seleccione el proveedor de la orden"
        >
          <template v-slot:prepend>
            <q-icon name="store" color="grey-6" />
          </template>
        </q-input>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="search"
          label="Seleccionar proveedor"
          class="btn-select-requesting-area"
          @click="openSupplierDialog"
        />
      </div>

      <label class="status-field-label">Área solicitante</label>
      <div class="requesting-area-row">
        <q-input
          v-model="requestingArea"
          outlined
          dense
          readonly
          bg-color="white"
          class="requesting-area-input"
          placeholder="Seleccione el área solicitante"
        >
          <template v-slot:prepend>
            <q-icon name="domain" color="grey-6" />
          </template>
        </q-input>
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="apartment"
          label="Seleccionar área"
          class="btn-select-requesting-area"
          @click="openRequestingAreaDialog"
        />
      </div>
    </div>

    <q-card-actions align="right" class="q-px-none q-pt-lg q-pb-none registration-actions">
      <q-btn
        flat
        no-caps
        color="grey-7"
        icon="cleaning_services"
        label="Limpiar campos"
        class="btn-clear-registration"
        :disable="registeringTransaction"
        @click="clearRegistrationFields"
      />
      <q-btn
        unelevated
        no-caps
        color="deep-orange"
        icon="receipt_long"
        label="Registrar transacción de compra"
        class="btn-register-transaction"
        :loading="registeringTransaction"
        @click="registerTransaction"
      />
    </q-card-actions>

    <q-dialog
      v-model="showRequestingAreaDialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="requesting-area-dialog">
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar icon="domain" color="primary" text-color="white" />
          <div class="text-h6 q-ml-md">Seleccionar área solicitante</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="requestingAreaSearch"
            outlined
            dense
            clearable
            debounce="300"
            placeholder="Buscar área..."
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>

          <q-inner-loading :showing="loadingAreas">
            <q-spinner-dots size="32px" color="primary" />
          </q-inner-loading>

          <q-list
            v-if="!loadingAreas && filteredAreas.length"
            bordered
            separator
            class="requesting-area-list"
          >
            <q-item
              v-for="a in filteredAreas"
              :key="a.id || a.name"
              clickable
              @click="selectRequestingArea(a)"
            >
              <q-item-section>
                <q-item-label class="text-weight-medium">{{
                  a.name
                }}</q-item-label>
                <q-item-label caption>
                  {{ a.departmentName || "Sin departamento" }}
                  <span v-if="a.status"> · {{ a.status }} </span>
                  <span v-if="a.code"> · Código: {{ a.code }} </span>
                  <span v-if="a.manager"> · Responsable: {{ a.manager }} </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense no-caps color="primary" label="Seleccionar" />
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-else-if="!loadingAreas"
            class="text-center text-grey-6 q-py-lg"
          >
            No se encontraron áreas registradas en el sistema.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showPurchaseManagerDialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="requesting-area-dialog">
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar icon="manage_accounts" color="primary" text-color="white" />
          <div class="text-h6 q-ml-md">Seleccionar gerente de compras</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="purchaseManagerSearch"
            outlined
            dense
            clearable
            debounce="300"
            placeholder="Buscar por nombre, documento o cargo..."
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>

          <q-inner-loading :showing="loadingCollaborators">
            <q-spinner-dots size="32px" color="primary" />
          </q-inner-loading>

          <q-list
            v-if="!loadingCollaborators && filteredManagerCollaborators.length"
            bordered
            separator
            class="requesting-area-list"
          >
            <q-item
              v-for="c in filteredManagerCollaborators"
              :key="c.id || c.numeroDocumento || c.nombreCompleto"
              clickable
              @click="selectPurchaseManager(c)"
            >
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ c.nombreCompleto || "Sin nombre" }}
                </q-item-label>
                <q-item-label caption>
                  {{ c.codigoCargo || "Sin cargo" }}
                  <span v-if="collaboratorDepartment(c)">
                    · {{ collaboratorDepartment(c) }}
                  </span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense no-caps color="primary" label="Seleccionar" />
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-else-if="!loadingCollaborators"
            class="text-center text-grey-6 q-py-lg"
          >
            No se encontraron colaboradores registrados.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="showSupplierDialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="requesting-area-dialog">
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar icon="store" color="primary" text-color="white" />
          <div class="text-h6 q-ml-md">Seleccionar proveedor</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="supplierSearch.nit"
                outlined
                dense
                clearable
                debounce="300"
                placeholder="Buscar por NIT..."
                @input="searchSuppliers"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="supplierSearch.name"
                outlined
                dense
                clearable
                debounce="300"
                placeholder="Buscar por nombre..."
                @input="searchSuppliers"
              />
            </div>
          </div>

          <q-inner-loading :showing="loadingSuppliers">
            <q-spinner-dots size="32px" color="primary" />
          </q-inner-loading>

          <q-list
            v-if="!loadingSuppliers && suppliers.length"
            bordered
            separator
            class="requesting-area-list"
          >
            <q-item
              v-for="supplier in suppliers"
              :key="supplier.nit || supplier.id || supplier.name"
              clickable
              @click="selectSupplier(supplier)"
            >
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{ supplier.name || supplier.supplier || "Sin nombre" }}
                </q-item-label>
                <q-item-label caption>
                  NIT: {{ supplier.nit || "—" }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense no-caps color="primary" label="Seleccionar" />
              </q-item-section>
            </q-item>
          </q-list>

          <div
            v-else-if="!loadingSuppliers"
            class="text-center text-grey-6 q-py-lg"
          >
            No se encontraron proveedores registrados.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { colaboradoresApi } from "src/api/colaboradores.api";
import { departmentApi } from "src/api/department.api";
import { purchaseTransactionApi } from "../../infrastructure/PurchaseTransactionApi";

export default {
  name: "PurchaseOrderRegistrationPanel",

  props: {
    selectedRequest: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      registeringTransaction: false,
      purchaseManager: "",
      showPurchaseManagerDialog: false,
      purchaseManagerSearch: "",
      supplierId: "",
      supplierLabel: "",
      showSupplierDialog: false,
      supplierSearch: {
        nit: "",
        name: "",
      },
      suppliers: [],
      loadingSuppliers: false,
      requestingArea: "",
      showRequestingAreaDialog: false,
      requestingAreaSearch: "",
      areasCatalog: [],
      loadingAreas: false,
      collaborators: [],
      loadingCollaborators: false,
    };
  },

  watch: {
    selectedRequest: {
      immediate: true,
      handler(request) {
        if (!request) {
          this.supplierId = "";
          this.supplierLabel = "";
          return;
        }

        const resolvedSupplierId =
          request.supplierId ||
          request._resolvedSupplierId ||
          "";
        const linkedSupplier =
          request._linkedSupplyOrder && request._linkedSupplyOrder.supplier;

        this.supplierId = resolvedSupplierId;
        this.supplierLabel =
          (linkedSupplier && (linkedSupplier.name || linkedSupplier.contactName)) ||
          resolvedSupplierId ||
          "";
      },
    },
  },

  computed: {
    filteredAreas() {
      const term = (this.requestingAreaSearch || "").toLowerCase().trim();
      if (!term) {
        return this.areasCatalog;
      }
      return this.areasCatalog.filter((area) => {
        const areaName = (area.name || "").toLowerCase();
        const departmentName = (area.departmentName || "").toLowerCase();
        const status = (area.status || "").toLowerCase();
        const code = (area.code || "").toLowerCase();
        const manager = (area.manager || "").toLowerCase();
        return (
          areaName.includes(term) ||
          departmentName.includes(term) ||
          status.includes(term) ||
          code.includes(term) ||
          manager.includes(term)
        );
      });
    },
    filteredManagerCollaborators() {
      const term = (this.purchaseManagerSearch || "").toLowerCase().trim();
      if (!term) {
        return this.collaborators;
      }

      return this.collaborators.filter((c) => {
        const nombre = (c.nombreCompleto || "").toLowerCase();
        const documento = (c.numeroDocumento || "").toLowerCase();
        const cargo = (c.codigoCargo || "").toLowerCase();
        const dept = this.collaboratorDepartment(c).toLowerCase();
        return (
          nombre.includes(term) ||
          documento.includes(term) ||
          cargo.includes(term) ||
          dept.includes(term)
        );
      });
    },
  },

  methods: {
    collaboratorDepartment(colaborador) {
      if (!colaborador) {
        return "";
      }
      return (
        colaborador.areaDepartamento ||
        colaborador.departamento ||
        colaborador.dependencia ||
        colaborador.area ||
        ""
      );
    },
    async loadCollaborators() {
      this.loadingCollaborators = true;
      try {
        const list = await colaboradoresApi.getAll();
        const arr = Array.isArray(list) ? list : [];
        this.collaborators = arr.filter((c) => {
          if (!c || !c.estado) return true;
          return c.estado === "Activo" || c.estado === "ACTIVO";
        });
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            "No se pudieron cargar los colaboradores: " +
            (error.message || "Error de conexión"),
        });
      } finally {
        this.loadingCollaborators = false;
      }
    },
    normalizeAreasFromDepartments(departments) {
      const normalized = [];
      const source = Array.isArray(departments) ? departments : [];

      source.forEach((department) => {
        const departmentName =
          (department && department.name) || "Sin departamento";
        const areas =
          department && Array.isArray(department.areas) ? department.areas : [];

        areas.forEach((area, index) => {
          const name =
            (area &&
              (area.name || area.areaName || area.nombre || area.title)) ||
            "";
          if (!name) return;

          normalized.push({
            id:
              (area && (area.id || area.areaCode || area.code)) ||
              `${departmentName}-${index}`,
            name,
            departmentName,
            status:
              (area && (area.status || area.estado)) ||
              (department && (department.status || department.estado)) ||
              "",
            code: (area && (area.areaCode || area.code)) || "",
            manager:
              (area && (area.manager || area.responsable || area.owner)) || "",
          });
        });
      });

      return normalized;
    },
    normalizeAreasFromWorkspaceRegistry() {
      try {
        const raw = localStorage.getItem("workspaces_registry");
        if (!raw) return [];
        const rows = JSON.parse(raw);
        if (!Array.isArray(rows)) return [];
        return rows
          .map((row, index) => ({
            id: row.areaCode || `workspace-${index}`,
            name: row.areaName || "",
            departmentName: row.departmentName || "Sin departamento",
            status: row.status || "",
            code: row.areaCode || "",
            manager: row.manager || "",
          }))
          .filter((row) => row.name);
      } catch (error) {
        return [];
      }
    },
    mergeAreaCatalog(items) {
      const map = new Map();
      (items || []).forEach((item) => {
        if (!item || !item.name) return;
        const key = `${String(item.name).toLowerCase()}|${String(
          item.departmentName || ""
        ).toLowerCase()}`;
        if (!map.has(key)) {
          map.set(key, item);
          return;
        }
        const current = map.get(key);
        map.set(key, {
          ...current,
          code: current.code || item.code || "",
          manager: current.manager || item.manager || "",
          status: current.status || item.status || "",
        });
      });
      return Array.from(map.values()).sort((a, b) =>
        String(a.name).localeCompare(String(b.name), "es")
      );
    },
    async loadAreas() {
      this.loadingAreas = true;
      try {
        const departments = await departmentApi.getAll().catch(() => []);
        const fromDepartments = this.normalizeAreasFromDepartments(departments);
        const fromWorkspaceRegistry =
          this.normalizeAreasFromWorkspaceRegistry();
        this.areasCatalog = this.mergeAreaCatalog([
          ...fromDepartments,
          ...fromWorkspaceRegistry,
        ]);
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            "No se pudieron cargar las áreas registradas: " +
            (error.message || "Error de conexión"),
        });
      } finally {
        this.loadingAreas = false;
      }
    },
    openRequestingAreaDialog() {
      this.requestingAreaSearch = "";
      this.showRequestingAreaDialog = true;
      if (!this.areasCatalog.length) {
        this.loadAreas();
      }
    },
    selectRequestingArea(area) {
      this.requestingArea = area && area.name ? area.name : "";
      this.showRequestingAreaDialog = false;
      this.$emit("requesting-area-selected", this.requestingArea);
    },
    openPurchaseManagerDialog() {
      this.purchaseManagerSearch = "";
      this.showPurchaseManagerDialog = true;
      if (!this.collaborators.length) {
        this.loadCollaborators();
      }
    },
    selectPurchaseManager(colaborador) {
      this.purchaseManager =
        colaborador && colaborador.nombreCompleto
          ? colaborador.nombreCompleto
          : "";
      this.showPurchaseManagerDialog = false;
      this.$emit("purchase-manager-selected", this.purchaseManager);
    },
    openSupplierDialog() {
      this.showSupplierDialog = true;
      this.searchSuppliers();
    },
    async searchSuppliers() {
      this.loadingSuppliers = true;
      try {
        const result = await this.$store.dispatch("purchaseorder/searchSuppliers", {
          nit: this.supplierSearch.nit || "",
          name: this.supplierSearch.name || "",
          page: 0,
          size: 20,
        });
        this.suppliers = (result && result.items) || [];
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            "No se pudieron cargar los proveedores: " +
            (error.message || "Error de conexión"),
        });
      } finally {
        this.loadingSuppliers = false;
      }
    },
    selectSupplier(supplier) {
      this.supplierId = supplier && supplier.nit ? supplier.nit : "";
      this.supplierLabel =
        supplier && (supplier.name || supplier.supplier)
          ? supplier.name || supplier.supplier
          : this.supplierId;
      this.showSupplierDialog = false;
    },
    clearRegistrationFields() {
      this.purchaseManager = "";
      this.purchaseManagerSearch = "";
      this.supplierId = "";
      this.supplierLabel = "";
      this.supplierSearch = { nit: "", name: "" };
      this.suppliers = [];
      this.requestingArea = "";
      this.requestingAreaSearch = "";
      this.showPurchaseManagerDialog = false;
      this.showSupplierDialog = false;
      this.showRequestingAreaDialog = false;
      this.$emit("registration-cleared");
    },
    validateRegistration() {
      if (!this.selectedRequest) {
        return "Seleccione una solicitud del plan antes de registrar.";
      }

      if (!this.purchaseManager || !this.purchaseManager.trim()) {
        return "Seleccione un gerente de compras antes de registrar.";
      }

      const payload = purchaseTransactionApi.buildPayloadFromSelection({
        selectedRequest: this.selectedRequest,
        purchaseManager: this.purchaseManager,
        supplierId: this.supplierId,
      });

      if (!payload.supplyOrderId) {
        return "La solicitud seleccionada no tiene una orden de suministro vinculada. Verifique que exista una orden aprobada en estado pendiente de abastecimiento.";
      }

      if (!payload.supplierId) {
        return "Seleccione un proveedor antes de registrar la transacción.";
      }

      if (!payload.items || payload.items.length === 0) {
        return "La solicitud no tiene productos válidos para registrar la transacción.";
      }

      return null;
    },
    async registerTransaction() {
      const validationMessage = this.validateRegistration();
      if (validationMessage) {
        this.$q.notify({
          type: "warning",
          message: validationMessage,
        });
        return;
      }

      const payload = purchaseTransactionApi.buildPayloadFromSelection({
        selectedRequest: this.selectedRequest,
        purchaseManager: this.purchaseManager,
        supplierId: this.supplierId,
      });

      this.registeringTransaction = true;
      try {
        const result = await purchaseTransactionApi.registerTransaction(
          payload
        );
        this.$q.notify({
          type: "positive",
          message: "Transacción de compra registrada correctamente.",
        });
        this.$emit("transaction-registered", result);
        this.clearRegistrationFields();
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            "No fue posible registrar la transacción: " +
            (error && error.message
              ? error.message
              : "Error del servidor al registrar"),
        });
      } finally {
        this.registeringTransaction = false;
      }
    },
  },
};
</script>

<style scoped>
.requesting-area-section {
  width: 100%;
  max-width: none;
  margin-top: 1.25rem;
}

.status-field-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.requesting-area-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 280px);
  gap: 10px;
  align-items: center;
  width: 100%;
}

.requesting-area-input {
  flex: 1;
}

.requesting-area-input ::v-deep .q-field__control {
  border-radius: 8px;
  min-height: 40px;
}

.btn-select-requesting-area {
  border-radius: 8px;
  min-height: 40px;
  font-weight: 600;
  width: 100%;
  padding: 0 14px;
}

.registration-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.btn-clear-registration {
  border-radius: 8px;
  min-height: 42px;
  font-weight: 600;
  padding: 0 14px;
}

.btn-register-transaction {
  border-radius: 8px;
  min-height: 42px;
  font-weight: 700;
  padding: 0 18px;
}

.requesting-area-dialog {
  width: min(760px, 95vw);
  max-width: 95vw;
  border-radius: 12px;
}

.requesting-area-list {
  max-height: 360px;
  overflow: auto;
}

@media (max-width: 768px) {
  .requesting-area-row {
    grid-template-columns: 1fr;
  }
}
</style>
