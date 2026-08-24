<template>
  <q-page class="th-page q-pa-md">
    <!-- Encabezado + métricas -->
    <header class="th-header q-mb-md">
      <div class="th-header__inner row items-start items-md-center no-wrap q-col-gutter-y-sm">
        <div class="col-12 col-md">
          <div class="th-title">Lista de empleados</div>
          <div class="th-subtitle">
            Consulta y gestión de empleados registrados en el sistema
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <div class="row q-col-gutter-xs justify-stretch justify-md-end">
            <div class="col-4">
              <div class="th-metric" aria-label="Total de empleados">
                <span class="th-metric__value">{{ stats.total }}</span>
                <span class="th-metric__label">Total</span>
              </div>
            </div>
            <div class="col-4">
              <div class="th-metric" aria-label="Empleados activos">
                <span class="th-metric__value th-metric__value--positive">{{
                  stats.activos
                }}</span>
                <span class="th-metric__label">Activos</span>
              </div>
            </div>
            <div class="col-4">
              <div class="th-metric" aria-label="Empleados inactivos">
                <span class="th-metric__value th-metric__value--muted">{{
                  stats.inactivos
                }}</span>
                <span class="th-metric__label">Inactivos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <UsuarioSesionPermisosPanel @edit-sesion="irEditarPermisosSesion" />

    <!-- Buscador, filtros y acción -->
    <div class="th-toolbar q-mb-md">
      <div class="row q-col-gutter-sm items-stretch items-md-end">
        <div class="col-12 col-md-12 col-lg-5">
          <q-input v-model="filter" dense outlined clearable debounce="300"
            placeholder="Buscar por nombre, documento o correo…" aria-label="Buscar empleados" class="th-search">
            <template v-slot:prepend>
              <q-icon name="search" class="text-grey-6" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="estadoFilter" :options="estadoOptions" dense outlined emit-value map-options label="Estado"
            class="th-filter" />
        </div>
        <div class="col-12 col-sm-6 col-md-auto">
          <q-btn color="primary" unelevated icon="person_add" label="Nuevo empleado" class="full-width th-btn-action"
            :to="{ name: thRoutes.employeeBasicData }" />
        </div>
      </div>
      <div v-if="filter || estadoFilter" class="th-results-hint q-mt-sm text-caption text-grey-7">
        Mostrando <strong>{{ filteredEmpleados.length }}</strong> de
        {{ empleados.length }} empleados
        <template v-if="estadoFilter"> · filtro: {{ estadoFilter }} </template>
      </div>
    </div>

    <!-- Tabla -->
    <q-card flat bordered class="th-card">
      <div class="th-table-scroll">
        <q-table :data="filteredEmpleados" :columns="columns" row-key="id" :loading="loading" binary-state-sort
          :pagination.sync="pagination" :rows-per-page-options="rowsPerPageOptions" hide-bottom flat
          :dense="$q.screen.lt.md" class="th-table" separator="horizontal" wrap-cells>
          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-7 q-pa-lg">
              <div class="column items-center q-gutter-sm">
                <q-icon name="groups" size="48px" />
                <span v-if="loading">Cargando empleados…</span>
                <span v-else-if="empleados.length === 0">
                  No hay empleados registrados.
                </span>
                <span v-else> Ningún resultado con los filtros actuales. </span>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip dense outline :color="props.value === 'Activo' ? 'positive' : 'grey-8'"
                :text-color="props.value === 'Activo' ? 'positive' : 'grey-8'" class="th-status-chip">
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <div class="row no-wrap items-center justify-center th-actions">
                <q-btn flat round dense color="grey-8" icon="visibility" class="th-action-btn"
                  @click="verDetalle(props.row)">
                  <q-tooltip>Ver detalle</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="grey-8" icon="edit" class="th-action-btn" @click="editar(props.row)">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="negative" icon="delete" class="th-action-btn"
                  @click="eliminar(props.row)">
                  <q-tooltip>Eliminar</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Paginación explícita -->
      <q-separator />
      <div class="row items-center justify-between q-pa-sm th-pagination-wrap">
        <div class="text-caption text-grey-7 th-pagination-summary">
          {{ paginationLabel }}
        </div>
        <q-pagination v-model="pagination.page" color="primary" :max="totalPages" :max-pages="7" direction-links
          boundary-links dense class="th-pagination" />
        <q-select v-model="pagination.rowsPerPage" :options="rowsPerPageSelectOptions" dense outlined emit-value
          map-options options-dense class="th-rows-select" aria-label="Filas por página" />
      </div>
    </q-card>

    <!-- Detalle empleado (modal) -->
    <q-dialog v-model="showDetalle" transition-show="scale" transition-hide="scale">
      <div v-if="selectedEmpleado" class="th-detail-modal">
        <div class="th-detail-modal__inner">
          <header class="th-detail-modal__head">
            <h2 class="th-detail-modal__title">Detalle del empleado</h2>
            <p class="th-detail-modal__sub">
              Información de identificación, contacto y asignación laboral.
            </p>
          </header>

          <div class="th-detail-modal__rule" aria-hidden="true" />

          <section class="th-detail-modal__hero" aria-label="Identidad">
            <q-avatar size="52px" font-size="18px" text-color="white" class="th-detail-modal__avatar">
              {{ detalleInitials }}
            </q-avatar>
            <div class="th-detail-modal__hero-text">
              <p class="th-detail-modal__name">
                {{ selectedEmpleado.nombreCompleto }}
              </p>
            </div>
          </section>

          <dl class="th-detail-modal__list">
            <div class="th-detail-row">
              <dt class="th-detail-row__label">Documento</dt>
              <dd class="th-detail-row__value">
                {{ detalleDocumento }}
              </dd>
            </div>
            <div class="th-detail-row">
              <dt class="th-detail-row__label">Correo</dt>
              <dd class="th-detail-row__value th-detail-row__value--copy">
                {{ selectedEmpleado.correoElectronico }}
              </dd>
            </div>
            <div class="th-detail-row">
              <dt class="th-detail-row__label">Estado</dt>
              <dd class="th-detail-row__value th-detail-row__value--compact">
                <q-chip dense outline square :color="selectedEmpleado.estado === 'Activo' ? 'positive' : 'grey-8'
                  " :text-color="selectedEmpleado.estado === 'Activo' ? 'positive' : 'grey-8'
                    " class="th-detail-status">
                  {{ selectedEmpleado.estado || "—" }}
                </q-chip>
              </dd>
            </div>
          </dl>

          <div class="th-detail-modal__rule" aria-hidden="true" />

          <footer class="th-detail-modal__foot">
            <q-btn outline no-caps rounded color="grey-7" label="Cerrar" class="th-detail-close-btn full-width-sm"
              v-close-popup />
          </footer>
        </div>
      </div>
    </q-dialog>

    <!-- Editar empleado (modal) -->
    <q-dialog v-model="showEditModal" maximized transition-show="slide-up" transition-hide="slide-down"
      @hide="onEditModalHide">
      <q-card class="th-edit-modal">
        <q-card-section class="th-edit-modal__toolbar row items-center q-pb-sm">
          <div class="text-h6 text-weight-medium">Editar empleado</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" aria-label="Cerrar" />
        </q-card-section>
        <q-separator />
        <q-card-section class="th-edit-modal__body q-pa-none">
          <EmployeeBasicDataForm v-if="editingEmpleado" edit-mode :seed-colaborador="editingEmpleado"
            :saving="savingEdit" @save="guardarEdicion" @cancel="cerrarEdicion" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import EmployeeBasicDataForm from "../components/EmployeeBasicDataForm.vue";
import UsuarioSesionPermisosPanel from "../components/UsuarioSesionPermisosPanel.vue";
import { useTalentoHumanoStore } from "../store/useTalentoHumanoStore";
import { formToColaboradorDto } from "../utils/colaboradorFormMapper";
import { talentoHumanoRouteNames } from "../utils/talentoHumanoRoutes";

const ROWS_OPTIONS = [10, 25, 50];

const DOCUMENT_TYPE_LABELS = {
  NATIONAL_ID: "Cédula de ciudadanía",
  FOREIGNER_ID: "Cédula de extranjería",
  PASSPORT: "Pasaporte",
  NIT: "NIT",
  OTHER: "Otro",
};

export default {
  name: "ListaEmpleadosView",
  components: {
    EmployeeBasicDataForm,
    UsuarioSesionPermisosPanel,
  },
  data() {
    return {
      store: useTalentoHumanoStore(),
      filter: "",
      estadoFilter: null,
      estadoOptions: [
        { label: "Todos", value: null },
        { label: "Activo", value: "Activo" },
        { label: "Inactivo", value: "Inactivo" },
      ],
      showDetalle: false,
      selectedEmpleado: null,
      showEditModal: false,
      editingEmpleado: null,
      savingEdit: false,
      pagination: {
        sortBy: "nombreCompleto",
        descending: false,
        page: 1,
        rowsPerPage: 10,
      },
      rowsPerPageOptions: ROWS_OPTIONS,
      columns: [
        {
          name: "nombreCompleto",
          align: "left",
          label: "Nombre completo",
          field: "nombreCompleto",
          sortable: true,
          style: "max-width: 200px",
          classes: "ellipsis",
        },
        {
          name: "tipoDocumento",
          align: "left",
          label: "Tipo de documento",
          field: (row) => {
            const code = row.tipoDocumento || row.documentType;
            if (!code) return "—";
            return DOCUMENT_TYPE_LABELS[code] || code;
          },
          sortable: true,
          style: "max-width: 160px",
          classes: "ellipsis",
        },
        {
          name: "numeroDocumento",
          align: "left",
          label: "Número de documento",
          field: "numeroDocumento",
          sortable: true,
          style: "max-width: 140px",
          classes: "ellipsis",
        },
        {
          name: "correoElectronico",
          align: "left",
          label: "Correo electrónico",
          field: "correoElectronico",
          sortable: true,
          style: "max-width: 200px",
          classes: "ellipsis",
        },
        {
          name: "estado",
          align: "center",
          label: "Estado",
          field: "estado",
          sortable: true,
          style: "width: 120px",
        },
        {
          name: "acciones",
          align: "center",
          label: "Acciones",
          field: "id",
          sortable: false,
          style: "width: 156px",
        },
      ],
    };
  },
  computed: {
    thRoutes() {
      return talentoHumanoRouteNames(this.$route);
    },
    empleados() {
      return this.store.colaboradores || [];
    },
    loading() {
      return this.store.loading;
    },
    filteredEmpleados() {
      const list = Array.isArray(this.empleados) ? this.empleados.slice() : [];
      const q = (this.filter || "").toLowerCase().trim();
      let out = list;
      if (q) {
        out = out.filter((c) => {
          const nombre = (c.nombreCompleto || "").toLowerCase();
          const email = (c.correoElectronico || "").toLowerCase();
          const documento = (c.numeroDocumento || "").toLowerCase();
          return (
            nombre.indexOf(q) >= 0 ||
            email.indexOf(q) >= 0 ||
            documento.indexOf(q) >= 0
          );
        });
      }
      if (this.estadoFilter) {
        out = out.filter((c) => c.estado === this.estadoFilter);
      }
      return out;
    },
    stats() {
      const all = this.empleados;
      let activos = 0;
      for (let i = 0; i < all.length; i++) {
        if (all[i].estado === "Activo") {
          activos += 1;
        }
      }
      return {
        total: all.length,
        activos,
        inactivos: Math.max(0, all.length - activos),
      };
    },
    totalPages() {
      const total = this.filteredEmpleados.length;
      const per = this.pagination.rowsPerPage || 10;
      const pages = Math.ceil(total / per);
      return pages > 0 ? pages : 1;
    },
    paginationLabel() {
      const total = this.filteredEmpleados.length;
      if (total === 0) {
        return "Sin registros";
      }
      const per = this.pagination.rowsPerPage;
      const page = this.pagination.page;
      const from = (page - 1) * per + 1;
      const to = Math.min(page * per, total);
      return `${from}–${to} de ${total}`;
    },
    rowsPerPageSelectOptions() {
      return ROWS_OPTIONS.map((v) => ({ label: String(v), value: v }));
    },
    detalleInitials() {
      const c = this.selectedEmpleado;
      if (!c || !c.nombreCompleto || !String(c.nombreCompleto).trim()) {
        return "?";
      }
      const parts = String(c.nombreCompleto)
        .trim()
        .split(/\s+/)
        .filter(function (w) {
          return w.length > 0;
        });
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
      }
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    },
    detalleTipoDocumento() {
      const c = this.selectedEmpleado;
      if (!c) {
        return "";
      }
      const label = this.tipoDocumentoLabel(c);
      return label && label !== "—" ? label : "";
    },
    detalleDocumento() {
      const c = this.selectedEmpleado;
      if (!c) {
        return "—";
      }
      const numero = (c.numeroDocumento && String(c.numeroDocumento).trim()) || "";
      return numero || "—";
    },
  },
  watch: {
    filter() {
      this.pagination.page = 1;
    },
    estadoFilter() {
      this.pagination.page = 1;
    },
    "pagination.rowsPerPage"() {
      this.pagination.page = 1;
    },
    totalPages(val) {
      if (this.pagination.page > val) {
        this.pagination.page = val;
      }
    },
  },
  methods: {
    irEditarPermisosSesion() {
      try {
        window.sessionStorage.setItem("colaboradorPermisoEditSesion", "1");
      } catch (e) {
        // ignore storage errors
      }
      this.$router.push({ name: this.thRoutes.colaboradorPermisosCreate });
    },
    async cargarDatos() {
      try {
        await this.store.fetchColaboradores();
      } catch (e) {
        this.$q.notify({
          color: "negative",
          message: "Error al cargar los empleados",
          icon: "error",
        });
      }
    },
    tipoDocumentoLabel(row) {
      const code = row.tipoDocumento || row.documentType;
      if (!code) {
        return "—";
      }
      return DOCUMENT_TYPE_LABELS[code];
    },
    verDetalle(row) {
      this.selectedEmpleado = row;
      this.showDetalle = true;
    },
    editar(row) {
      if (!row || !row.id) {
        this.$q.notify({
          color: "warning",
          message: "No se pudo identificar el empleado a editar.",
          icon: "warning",
        });
        return;
      }
      this.editingEmpleado = Object.assign({}, row);
      this.showEditModal = true;
    },
    cerrarEdicion() {
      this.showEditModal = false;
    },
    onEditModalHide() {
      this.editingEmpleado = null;
      this.savingEdit = false;
    },
    async guardarEdicion(formPayload) {
      if (!this.editingEmpleado || !this.editingEmpleado.id) {
        return;
      }
      const dto = formToColaboradorDto(formPayload, this.editingEmpleado);
      this.savingEdit = true;
      try {
        const updated = await this.store.updateColaborador(
          this.editingEmpleado.id,
          dto
        );
        if (
          this.selectedEmpleado &&
          this.selectedEmpleado.id === this.editingEmpleado.id
        ) {
          this.selectedEmpleado = updated;
        }
        this.showEditModal = false;
        this.$q.notify({
          color: "positive",
          message: "Empleado actualizado correctamente.",
          icon: "check_circle",
        });
      } catch (e) {
        const errData = e.response && e.response.data;
        this.$q.notify({
          color: "negative",
          message:
            (errData && (errData.detail || errData.message)) ||
            "No fue posible actualizar el empleado.",
          icon: "error",
        });
      } finally {
        this.savingEdit = false;
      }
    },
    eliminar(row) {
      if (!row || !row.id) {
        this.$q.notify({
          color: "warning",
          message: "No se pudo identificar el empleado a eliminar.",
          icon: "warning",
        });
        return;
      }

      var exists = this.empleados.some(function (empleado) {
        return empleado.id === row.id;
      });
      if (!exists) {
        this.$q.notify({
          color: "warning",
          message: "El empleado seleccionado ya no existe en la lista.",
          icon: "warning",
        });
        return;
      }

      var self = this;
      this.$q
        .dialog({
          title: "Confirmar eliminación",
          message:
            "Esta acción eliminará el empleado seleccionado. ¿Deseas continuar?",
          cancel: { label: "Cancelar", flat: true, color: "grey-7" },
          ok: { label: "Eliminar", color: "negative", unelevated: true },
          persistent: true,
        })
        .onOk(async function () {
          try {
            await self.store.deleteColaborador(row.id);
            if (self.selectedEmpleado && self.selectedEmpleado.id === row.id) {
              self.showDetalle = false;
              self.selectedEmpleado = null;
            }
            self.$q.notify({
              color: "positive",
              message: "Empleado eliminado correctamente.",
              icon: "delete",
            });
          } catch (e) {
            console.log("🚨 Error al eliminar empleado:", e);
            if (e && e.response && e.response.status === 404) {
              self.$q.notify({
                color: "warning",
                message: "El empleado no existe o ya fue eliminado.",
                icon: "warning",
              });
              await self.cargarDatos();
              return;
            }
            self.$q.notify({
              color: "negative",
              message: "No fue posible eliminar el empleado.",
              icon: "error",
            });
          }
        });
    },
  },
  mounted() {
    this.cargarDatos();
  },
  activated() {
    this.cargarDatos();
  },
};
</script>

<style scoped>
/* Paleta tipo slate (sin Tailwind) */
.th-page {
  background-color: #f8fafc;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.th-header {
  background-color: #fff;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px 20px;
}

.th-title {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 700;
  color: #0f172a;
}

.th-subtitle {
  font-size: 0.875rem;
  line-height: 1.4;
  color: #64748b;
  margin-top: 4px;
}

.th-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-height: 64px;
}

.th-metric__value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.th-metric__value--positive {
  color: #15803d;
}

.th-metric__value--muted {
  color: #64748b;
}

.th-metric__label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-top: 4px;
}

.th-toolbar {
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
}

.th-results-hint strong {
  color: #0f172a;
  font-weight: 600;
}

.th-card {
  border-color: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.th-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.th-table-scroll>>>.q-table {
  min-width: 900px;
}

.th-table>>>thead tr th {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #475569;
  background-color: #f8fafc;
}

.th-table>>>tbody tr:hover {
  background-color: #f1f5f9;
}

.th-status-chip {
  font-weight: 500;
}

.th-area-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.th-area-cell__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
}

.th-area-cell__cargo-hint {
  line-height: 1.2;
}

.th-actions {
  gap: 2px;
}

.th-action-btn {
  opacity: 0.85;
}

.th-action-btn:hover {
  opacity: 1;
  background-color: #f1f5f9;
}

.th-pagination-wrap {
  flex-wrap: wrap;
  gap: 8px;
  background-color: #fff;
}

.th-pagination {
  order: 3;
}

.th-rows-select {
  min-width: 88px;
  order: 2;
}

@media (min-width: 600px) {
  .th-pagination {
    order: 2;
  }

  .th-rows-select {
    order: 3;
  }
}

.text-slate-strong {
  color: #0f172a;
}

/* Modal detalle — estilo ligero tipo producto SaaS */
.th-detail-modal {
  width: calc(100vw - 24px);
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.14),
    0 12px 24px -8px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}

.th-detail-modal__inner {
  padding: 24px;
}

@media (min-width: 768px) {
  .th-detail-modal__inner {
    padding: 32px;
  }
}

.th-detail-modal__head {
  margin: 0;
  padding: 0;
}

.th-detail-modal__title {
  margin: 0;
  padding: 0;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.35;
  color: #0f172a;
}

.th-detail-modal__sub {
  margin: 10px 0 0;
  padding: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #64748b;
}

.th-detail-modal__rule {
  height: 1px;
  margin: 20px 0;
  background: linear-gradient(to right,
      transparent,
      #e2e8f0 12%,
      #e2e8f0 88%,
      transparent);
}

.th-detail-modal__hero {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}

.th-detail-modal__avatar {
  background: linear-gradient(145deg, #334155 0%, #0f172a 100%);
  font-weight: 600;
  flex-shrink: 0;
}

.th-detail-modal__hero-text {
  min-width: 0;
  flex: 1;
}

.th-detail-modal__name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.35;
  color: #0f172a;
  word-break: break-word;
}

.th-detail-modal__list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.th-detail-row {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 12px 16px;
  align-items: start;
}

@media (max-width: 359px) {
  .th-detail-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
}

.th-detail-row__label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  line-height: 1.4;
  padding-top: 2px;
}

.th-detail-row__value {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: #334155;
  word-break: break-word;
}

.th-detail-row__value--compact {
  padding-top: 0;
}

.th-detail-row__value--copy {
  color: #0f172a;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.th-detail-stacked {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.th-detail-stacked__primary {
  font-weight: 500;
  color: #0f172a;
}

.th-detail-stacked__secondary {
  line-height: 1.35;
}

.th-detail-status {
  font-weight: 500;
  border-radius: 6px !important;
}

.th-detail-modal__foot {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.th-detail-close-btn {
  min-width: 112px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

@media (max-width: 359px) {
  .full-width-sm {
    width: 100%;
  }
}

.th-edit-modal {
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
}

.th-edit-modal__toolbar {
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 2;
}

.th-edit-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
}

.th-pagination-summary {
  margin-bottom: 8px;
}

@media (min-width: 600px) {
  .th-pagination-summary {
    margin-bottom: 0;
  }
}
</style>
