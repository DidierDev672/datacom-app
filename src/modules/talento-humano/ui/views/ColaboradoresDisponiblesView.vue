<template>
  <q-page class="th-page q-pa-md">
    <!-- Encabezado + métricas -->
    <header class="th-header q-mb-md">
      <div
        class="th-header__inner row items-start items-md-center no-wrap q-col-gutter-y-sm"
      >
        <div class="col-12 col-md">
          <div class="th-title">Colaboradores registrados</div>
          <div class="th-subtitle">
            Directorio de personas disponibles en el sistema (solo consulta)
          </div>
        </div>
        <div class="col-12 col-md-auto">
          <div class="row q-col-gutter-xs justify-stretch justify-md-end">
            <div class="col-4">
              <div class="th-metric" aria-label="Total de colaboradores">
                <span class="th-metric__value">{{ stats.total }}</span>
                <span class="th-metric__label">Total</span>
              </div>
            </div>
            <div class="col-4">
              <div class="th-metric" aria-label="Colaboradores activos">
                <span class="th-metric__value th-metric__value--positive">{{
                  stats.activos
                }}</span>
                <span class="th-metric__label">Activos</span>
              </div>
            </div>
            <div class="col-4">
              <div class="th-metric" aria-label="Colaboradores inactivos">
                <span class="th-metric__value th-metric__value--muted">{{
                  stats.inactivos
                }}</span>
                <span class="th-metric__label">Otros</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Buscador, filtros y acción -->
    <div class="th-toolbar q-mb-md">
      <div class="row q-col-gutter-sm items-stretch items-md-end">
        <div class="col-12 col-md-12 col-lg-5">
          <q-input
            v-model="filter"
            dense
            outlined
            clearable
            debounce="300"
            placeholder="Buscar por nombre, correo o cargo…"
            aria-label="Buscar colaboradores"
            class="th-search"
          >
            <template v-slot:prepend>
              <q-icon name="search" class="text-grey-6" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-select
            v-model="estadoFilter"
            :options="estadoOptions"
            dense
            outlined
            emit-value
            map-options
            label="Estado"
            class="th-filter"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-auto">
          <q-btn
            outline
            color="primary"
            icon="person_add"
            label="Registrar colaborador"
            class="full-width th-btn-action"
            :to="{ name: 'registro-colaborador' }"
            no-caps
          />
        </div>
      </div>
      <div
        v-if="filter || estadoFilter"
        class="th-results-hint q-mt-sm text-caption text-grey-7"
      >
        Mostrando <strong>{{ filteredColaboradores.length }}</strong> de
        {{ colaboradores.length }} colaboradores
        <template v-if="estadoFilter"> · filtro: {{ estadoFilter }} </template>
      </div>
    </div>

    <!-- Tabla -->
    <q-card flat bordered class="th-card">
      <div class="th-table-scroll">
        <q-table
          :data="filteredColaboradores"
          :columns="columns"
          row-key="id"
          :loading="loading"
          binary-state-sort
          :pagination.sync="pagination"
          :rows-per-page-options="rowsPerPageOptions"
          hide-bottom
          flat
          :dense="$q.screen.lt.md"
          class="th-table"
          separator="horizontal"
          wrap-cells
        >
          <template v-slot:no-data>
            <div class="full-width row flex-center text-grey-7 q-pa-lg">
              <div class="column items-center q-gutter-sm">
                <q-icon name="person_off" size="48px" />
                <span v-if="loading">Cargando…</span>
                <span v-else-if="colaboradores.length === 0">
                  No hay colaboradores registrados.
                </span>
                <span v-else> Ningún resultado con los filtros actuales. </span>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip
                dense
                outline
                :color="props.value === 'Activo' ? 'positive' : 'grey-8'"
                :text-color="props.value === 'Activo' ? 'positive' : 'grey-8'"
                class="th-status-chip"
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <div class="row no-wrap items-center justify-center th-actions">
                <q-btn
                  flat
                  round
                  dense
                  color="grey-8"
                  icon="visibility"
                  class="th-action-btn"
                  @click="verDetalle(props.row)"
                >
                  <q-tooltip>Ver ficha</q-tooltip>
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
        <q-pagination
          v-model="pagination.page"
          color="primary"
          :max="totalPages"
          :max-pages="7"
          direction-links
          boundary-links
          dense
          class="th-pagination"
        />
        <q-select
          v-model="pagination.rowsPerPage"
          :options="rowsPerPageSelectOptions"
          dense
          outlined
          emit-value
          map-options
          options-dense
          class="th-rows-select"
          aria-label="Filas por página"
        />
      </div>
    </q-card>

    <!-- Detalle colaborador (modal) -->
    <q-dialog
      v-model="showDetalle"
      transition-show="scale"
      transition-hide="scale"
    >
      <div v-if="selectedColaborador" class="th-detail-modal">
        <div class="th-detail-modal__inner">
          <header class="th-detail-modal__head">
            <h2 class="th-detail-modal__title">Detalle del colaborador</h2>
            <p class="th-detail-modal__sub">
              Información de contacto y asignación en la organización.
            </p>
          </header>

          <div class="th-detail-modal__rule" aria-hidden="true" />

          <section class="th-detail-modal__hero" aria-label="Identidad">
            <q-avatar
              size="52px"
              font-size="18px"
              text-color="white"
              class="th-detail-modal__avatar"
            >
              {{ detalleInitials }}
            </q-avatar>
            <div class="th-detail-modal__hero-text">
              <p class="th-detail-modal__name">
                {{ selectedColaborador.nombreCompleto }}
              </p>
            </div>
          </section>

          <dl class="th-detail-modal__list">
            <div class="th-detail-row">
              <dt class="th-detail-row__label">Correo</dt>
              <dd class="th-detail-row__value th-detail-row__value--copy">
                {{ selectedColaborador.correoElectronico || "—" }}
              </dd>
            </div>
            <div class="th-detail-row">
              <dt class="th-detail-row__label">Cargo</dt>
              <dd class="th-detail-row__value">
                {{ detalleCargo }}
              </dd>
            </div>
            <div class="th-detail-row">
              <dt class="th-detail-row__label">Estado</dt>
              <dd class="th-detail-row__value th-detail-row__value--compact">
                <q-chip
                  dense
                  outline
                  square
                  :color="
                    selectedColaborador.estado === 'Activo'
                      ? 'positive'
                      : 'grey-8'
                  "
                  :text-color="
                    selectedColaborador.estado === 'Activo'
                      ? 'positive'
                      : 'grey-8'
                  "
                  class="th-detail-status"
                >
                  {{ selectedColaborador.estado || "—" }}
                </q-chip>
              </dd>
            </div>
          </dl>

          <div class="th-detail-modal__rule" aria-hidden="true" />

          <footer class="th-detail-modal__foot">
            <q-btn
              outline
              no-caps
              rounded
              color="grey-7"
              label="Cerrar"
              class="th-detail-close-btn full-width-sm"
              v-close-popup
            />
          </footer>
        </div>
      </div>
    </q-dialog>
  </q-page>
</template>

<script>
import { useTalentoHumanoStore } from "../store/useTalentoHumanoStore";

const ROWS_OPTIONS = [10, 25, 50];

export default {
  name: "ColaboradoresDisponiblesView",
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
      selectedColaborador: null,
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
          label: "Nombre",
          field: "nombreCompleto",
          sortable: true,
          style: "max-width: 200px",
          classes: "ellipsis",
        },
        {
          name: "correoElectronico",
          align: "left",
          label: "Correo",
          field: "correoElectronico",
          sortable: true,
          style: "max-width: 220px",
          classes: "ellipsis",
        },
        {
          name: "cargo",
          align: "left",
          label: "Cargo",
          field: (row) => row.cargoAsignado || row.nombreCargo || "—",
          sortable: true,
          style: "max-width: 180px",
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
          label: "Detalle",
          field: "id",
          sortable: false,
          style: "width: 88px",
        },
      ],
    };
  },
  computed: {
    colaboradores() {
      return this.store.colaboradores || [];
    },
    loading() {
      return this.store.loading;
    },
    filteredColaboradores() {
      const list = Array.isArray(this.colaboradores)
        ? this.colaboradores.slice()
        : [];
      const q = (this.filter || "").toLowerCase().trim();
      let out = list;
      if (q) {
        out = out.filter((c) => {
          const nombre = (c.nombreCompleto || "").toLowerCase();
          const email = (c.correoElectronico || "").toLowerCase();
          const cargo = (c.cargoAsignado || c.nombreCargo || "").toLowerCase();
          return (
            nombre.indexOf(q) >= 0 ||
            email.indexOf(q) >= 0 ||
            cargo.indexOf(q) >= 0
          );
        });
      }
      if (this.estadoFilter) {
        out = out.filter((c) => c.estado === this.estadoFilter);
      }
      return out;
    },
    stats() {
      const all = this.colaboradores;
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
      const total = this.filteredColaboradores.length;
      const per = this.pagination.rowsPerPage || 10;
      const pages = Math.ceil(total / per);
      return pages > 0 ? pages : 1;
    },
    paginationLabel() {
      const total = this.filteredColaboradores.length;
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
      const c = this.selectedColaborador;
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
    detalleCargo() {
      const c = this.selectedColaborador;
      if (!c) {
        return "—";
      }
      var cargo = c.cargoAsignado || c.nombreCargo;
      return cargo && String(cargo).trim() ? cargo : "—";
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
    async cargarDatos() {
      try {
        await this.store.fetchColaboradores();
      } catch (e) {
        this.$q.notify({
          color: "negative",
          message: "Error al cargar los colaboradores",
          icon: "error",
        });
      }
    },
    verDetalle(row) {
      this.selectedColaborador = row;
      this.showDetalle = true;
    },
  },
  mounted() {
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

.th-table-scroll >>> .q-table {
  min-width: 640px;
}

.th-table >>> thead tr th {
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #475569;
  background-color: #f8fafc;
}

.th-table >>> tbody tr:hover {
  background-color: #f1f5f9;
}

.th-status-chip {
  font-weight: 500;
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
  background: linear-gradient(
    to right,
    transparent,
    #e2e8f0 12%,
    #e2e8f0 88%,
    transparent
  );
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

.th-pagination-summary {
  margin-bottom: 8px;
}

@media (min-width: 600px) {
  .th-pagination-summary {
    margin-bottom: 0;
  }
}
</style>
