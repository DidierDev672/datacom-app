<template>
  <div class="budget-categories-list">
    <q-card class="categories-card shadow-lg">
      <q-card-section class="header-gradient text-white q-pa-lg">
        <div class="row items-center">
          <div>
            <div class="text-h5 text-weight-bold text-white">
              Categorías de rubros de planes de abastecimiento
            </div>
            <div class="text-caption opacity-80 q-mt-xs">
              Consulta y administra los rubros de planes de abastecimiento de los planes de abastecimiento registrados
              en el
              sistema.
            </div>
          </div>
          <q-space />
          <q-btn outline color="white" text-color="white" no-caps icon="add" label="Nueva categoría" class="q-mr-sm"
            @click="goToCreate" />
          <q-btn outline color="white" text-color="white" no-caps icon="refresh" label="Actualizar" :loading="loading"
            @click="loadCategories" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="summary-grid q-mb-md">
          <StatCard icon="category" label="Total categorías" :value="rowCount" format="number" accent-color="blue" />
          <StatCard icon="check_circle" label="Activas" :value="activeCount" format="number" accent-color="green"
            clickable @click="filterByActive" />
          <StatCard icon="paid" label="Presupuesto total" :value="totalBudget" format="currency" accent-color="amber"
            highlight />
        </div>

        <q-input v-model="searchQuery" outlined dense clearable debounce="250" bg-color="white"
          placeholder="Buscar por nombre, plan de abastecimiento o estado..." class="q-mb-md">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>

        <q-banner v-if="error" class="bg-red-1 text-red-9 q-mb-md" rounded dense>
          {{ error }}
        </q-banner>

        <div class="accordion-wrapper">
          <BaseLoading mode="inline" absolute :loading="editingLoading" message="Verificando datos de la categoría..." color="secondary" />

          <div v-if="planGroups.length > 0" class="bc-accordion">
            <div
              v-for="(group, gIdx) in planGroups"
              :key="gIdx"
              class="bc-plan-group"
            >
              <q-expansion-item
                :expanded="expandedPlan === group.planName"
                @show="expandedPlan = group.planName"
                @hide="expandedPlan = null"
                :header-class="['bc-plan-header', expandedPlan === group.planName ? 'bc-plan-header--expanded' : '']"
                expand-icon-class="bc-expand-icon"
              >
                <template v-slot:header>
                  <div class="bc-plan-header-content">
                    <div class="bc-plan-header-left">
                      <q-icon name="inventory" size="20px" class="bc-plan-icon" />
                      <div class="bc-plan-name">{{ group.planName }}</div>
                    </div>
                    <div class="bc-plan-header-right">
                      <span class="bc-plan-count">{{ group.rubros.length }} {{ group.rubros.length === 1 ? "rubro" : "rubros" }}</span>
                      <span class="bc-plan-dot" />
                      <span class="bc-plan-budget">{{ formatCurrency(group.totalBudget) }}</span>
                    </div>
                  </div>
                </template>

                <div class="bc-rubro-list">
                  <div
                    v-for="(rubro, rIdx) in group.rubros"
                    :key="rubro.id"
                    class="bc-rubro-item"
                    :style="{ '--fade-delay': rIdx * 60 + 'ms' }"
                  >
                    <div class="bc-rubro-body">
                      <div class="bc-rubro-info">
                        <div class="bc-rubro-name">{{ rubro.name }}</div>
                        <div class="bc-rubro-dates">
                          <q-icon name="event" size="12px" class="bc-rubro-date-icon" />
                          {{ formatDate(rubro.startDate) }} — {{ formatDate(rubro.endDate) }}
                        </div>
                      </div>
                      <div class="bc-rubro-meta">
                        <span class="bc-rubro-value">{{ formatCurrency(rubro.totalBudget) }}</span>
                        <span
                          :class="[
                            'badge-pill',
                            rubro.active ? 'badge--active' : 'badge--inactive',
                          ]"
                        >
                          {{ rubro.active ? "Activo" : "Inactivo" }}
                        </span>
                      </div>
                      <div class="bc-rubro-actions">
                        <q-btn flat dense round color="primary" icon="visibility" size="sm" @click="openDetail(rubro)">
                          <q-tooltip>Ver detalle</q-tooltip>
                        </q-btn>
                        <q-btn flat dense round color="secondary" icon="brush" size="sm" @click="openEdit(rubro)">
                          <q-tooltip>Editar categoría</q-tooltip>
                        </q-btn>
                        <q-btn flat dense round color="negative" icon="delete" size="sm" @click="confirmDelete(rubro)">
                          <q-tooltip>Eliminar categoría</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </q-expansion-item>
            </div>
          </div>
        </div>
      </q-card-section>
      <div v-if="!loading && (!filteredRows || filteredRows.length === 0)" class="empty-state-section">
        <div class="empty-state-icon-wrap">
          <q-icon :name="searchQuery ? 'search_off' : 'category'" size="40px" color="white" />
        </div>
        <div class="empty-state-title-gradient">
          {{ searchQuery ? "Sin resultados" : "No hay categorías registradas" }}
        </div>
        <div class="empty-state-desc">
          {{ searchQuery
            ? "Ninguna categoría coincide con \"" + searchQuery + "\". Intenta con otros términos."
            : "Crea tu primera categoría para comenzar a gestionar los rubros de presupuesto de abastecimiento."
          }}
        </div>
        <q-btn v-if="!searchQuery" unelevated no-caps icon="add" label="Nueva categoría" class="empty-state-btn q-mt-sm"
          @click="goToCreate" />
      </div>
    </q-card>

    <BudgetCategoryDetailDialog v-model="showDetailDialog" :category="selectedCategory" />

    <EditChoiceModal
      v-model="showChoiceModal"
      :rubro-name="editingRubroName"
      @choose-modal="onChooseModal"
      @choose-page="onChoosePage"
    />

    <EditRubroModal
      v-model="showEditModal"
      :rubro="editingRubro"
      @saved="onEditSaved"
      @status-updated="onEditStatusUpdated"
    />
  </div>
</template>
<script>

import EmptyState from "src/components/EmptyState.vue";
import BaseLoading from "src/components/BaseLoading.vue";
import { useRubrosStore } from "src/piña/rubros";
import { useSupplyPlansStore } from "src/piña/supplyPlans";
import BudgetCategoryDetailDialog from "./BudgetCategoryDetailDialog.vue";
import EditChoiceModal from "./EditChoiceModal.vue";
import EditRubroModal from "./EditRubroModal.vue";
import StatCard from "./StatCard.vue";

export default {
  name: "BudgetCategoriesList",

  components: {
    BudgetCategoryDetailDialog,
    EditChoiceModal,
    EditRubroModal,
    StatCard,
    EmptyState,
    BaseLoading,
  },

  props: {
    autoLoad: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      rubrosStore: null,
      supplyPlansStore: null,
      loading: false,
      editingLoading: false,
      deleting: false,
      error: null,
      rows: [],
      searchQuery: "",
      showDetailDialog: false,
      showChoiceModal: false,
      showEditModal: false,
      selectedCategory: null,
      editingRubro: null,
      editingRubroName: "",
      expandedPlan: null,
    };
  },

  computed: {
    rowCount() {
      return (this.filteredRows && this.filteredRows.length) || 0;
    },
    filteredRows() {
      var list = this.rows || [];
      var query = (this.searchQuery || "").trim().toLowerCase();
      if (!query) {
        return list;
      }

      return list.filter(function (row) {
        const statusLabel = row.active ? "activo" : "inactivo";
        const haystack = [
          row.name,
          row.description,
          row.planName,
          row.planId,
          statusLabel,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });
    },
    planGroups() {
      var groups = {};
      var list = this.filteredRows || [];

      list.forEach(function (row) {
        var key = row.planName || "Sin plan de abastecimiento";
        if (!groups[key]) {
          groups[key] = { planName: key, rubros: [], totalBudget: 0, maxDate: null };
        }
        groups[key].rubros.push(row);
        groups[key].totalBudget += Number(row.totalBudget) || 0;
        if (row.startDate && (!groups[key].maxDate || row.startDate > groups[key].maxDate)) {
          groups[key].maxDate = row.startDate;
        }
      });

      var groupList = Object.keys(groups).map(function (key) {
        return groups[key];
      });

      groupList.sort(function (a, b) {
        if (!a.maxDate && !b.maxDate) return 0;
        if (!a.maxDate) return 1;
        if (!b.maxDate) return -1;
        return b.maxDate.localeCompare(a.maxDate);
      });

      return groupList;
    },
    activeCount() {
      var list = this.filteredRows || [];
      return list.filter(function (row) { return row.active; }).length;
    },
    totalBudget() {
      var list = this.filteredRows || [];
      return list.reduce(function (sum, row) { return sum + (Number(row.totalBudget) || 0); }, 0);
    },
  },

  mounted() {
    this.rubrosStore = useRubrosStore();
    this.supplyPlansStore = useSupplyPlansStore();
    if (this.autoLoad) {
      this.loadCategories();
    }
  },

  methods: {
    formatCurrency(value) {
      if (value === null || value === undefined || value === "") {
        return "—";
      }
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(Number(value));
    },
    formatDate(value) {
      if (!value) {
        return "—";
      }
      const normalized = String(value).replace(/\//g, "-");
      const date = new Date(normalized);
      if (Number.isNaN(date.getTime())) {
        return value;
      }
      return date.toLocaleDateString("es-CO");
    },
    shortId(value) {
      if (!value) {
        return "—";
      }
      const text = String(value);
      return text.length > 8 ? `${text.slice(0, 8)}…` : text;
    },
    resolvePlanName(planId) {
      if (!planId || !this.supplyPlansStore) {
        return "";
      }
      const plan = this.supplyPlansStore.plans.find((item) => item.id === planId);
      return plan ? plan.name || `Plan ${plan.id}` : "";
    },
    normalizeRow(rubro) {
      return {
        id: rubro.id,
        name: rubro.name || rubro.nombreRubro || "",
        description: rubro.description || rubro.descripcionRubro || "",
        planId: rubro.planId || rubro.planAbastecimiento || null,
        planName: this.resolvePlanName(
          rubro.planId || rubro.planAbastecimiento
        ),
        startDate: rubro.startDate || rubro.fechaInicio || null,
        endDate: rubro.endDate || rubro.fechaFinal || null,
        totalBudget:
          rubro.totalBudget != null
            ? rubro.totalBudget
            : rubro.valorPresupuesto != null
              ? rubro.valorPresupuesto
              : 0,
        usedBudget: rubro.usedBudget != null ? rubro.usedBudget : 0,
        active:
          typeof rubro.active === "boolean"
            ? rubro.active
            : Boolean(rubro.activar),
      };
    },
    async loadCategories() {
      this.loading = true;
      this.error = null;

      try {
        await this.supplyPlansStore.fetchAllPlans();
        await this.rubrosStore.fetchAllRubros();

        const rubros = Array.isArray(this.rubrosStore.rubros)
          ? this.rubrosStore.rubros
          : [];

        this.rows = rubros.map((rubro) => this.normalizeRow(rubro));
      } catch (error) {
        this.error =
          (error && error.message) ||
          "No fue posible cargar las categorías de presupuesto.";
      } finally {
        this.loading = false;
      }
    },
    openDetail(row) {
      this.selectedCategory = row;
      this.showDetailDialog = true;
    },
    async openEdit(row) {
      if (!row || !row.id) {
        this.$q.notify({
          type: "warning",
          message: "No se pudo identificar la categoría a editar.",
        });
        return;
      }

      this.editingLoading = true;
      this.error = null;

      const startTime = Date.now();
      const MIN_LOADING_MS = 5000;

      try {
        const requiredFields = ["id", "name", "planId", "totalBudget"];
        const missingFields = requiredFields.filter(function (f) {
          return row[f] === null || row[f] === undefined || row[f] === "";
        });

        if (missingFields.length > 0) {
          throw new Error(
            "La categoría tiene datos incompletos. Campos faltantes: " +
              missingFields.join(", ") +
              "."
          );
        }

        const rubroData = this.rubrosStore.getRubroById(row.id);
        if (!rubroData) {
          throw new Error(
            "No se encontraron los datos completos de la categoría en el sistema. Recargue la lista e intente nuevamente."
          );
        }

        const planId = rubroData.planId || rubroData.planAbastecimiento;
        if (!planId) {
          throw new Error(
            "La categoría no tiene un plan de abastecimiento asociado. No es posible editar."
          );
        }

        var planValido = this.supplyPlansStore.plans.some(
          function (p) { return p.id === planId; }
        );

        if (!planValido) {
          await this.supplyPlansStore.fetchAllPlans();
          planValido = this.supplyPlansStore.plans.some(
            function (p) { return p.id === planId; }
          );

          if (!planValido) {
            throw new Error(
              "El plan de abastecimiento asociado (ID: " +
                planId +
                ") no está disponible. Verifique que el plan exista."
            );
          }
        }

        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADING_MS - elapsed;
        if (remaining > 0) {
          await new Promise(function (resolve) { setTimeout(resolve, remaining); });
        }

        this.editingRubro = this.mapRowToRubro(row);
        this.editingRubroName = row.name || "";
        this.showChoiceModal = true;
      } catch (error) {
        const elapsed = Date.now() - startTime;
        const remaining = MIN_LOADING_MS - elapsed;
        if (remaining > 0) {
          await new Promise(function (resolve) { setTimeout(resolve, remaining); });
        }

        this.error =
          (error && error.message) ||
          "Error inesperado al intentar editar la categoría.";
        this.$q.notify({
          type: "negative",
          message: this.error,
          icon: "warning",
          position: "top",
          timeout: 5000,
        });
      } finally {
        this.editingLoading = false;
      }
    },

    mapRowToRubro(row) {
      return {
        id: row.id,
        nombre: row.name || "",
        descripcion: row.description || "",
        planAbastecimiento: row.planName || "",
        planId: row.planId || null,
        fechaInicio: row.startDate || "",
        fechaFinal: row.endDate || "",
        valor: row.totalBudget != null ? row.totalBudget : 0,
        estado: row.active ? "Activo" : "Inactivo",
        historialActivacion: row.historialActivacion || [],
      };
    },

    onChooseModal() {
      this.showEditModal = true;
    },

    onChoosePage() {
      this.$router.push({
        name: "editar-rubros",
        params: { rubroId: this.editingRubro.id },
      });
    },

    onEditSaved() {
      this.$q.notify({
        type: "positive",
        message: "Rubro actualizado correctamente.",
        icon: "check_circle",
      });
      this.loadCategories();
    },

    onEditStatusUpdated() {
      this.$q.notify({
        type: "positive",
        message: "Estado actualizado correctamente.",
        icon: "check_circle",
      });
    },
    goToCreate() {
      this.$router.push({ name: "crear-rubros" });
    },
    filterByActive() {
      this.searchQuery = this.searchQuery === "activo" ? "" : "activo";
    },
    confirmDelete(row) {
      if (!row || !row.id) {
        this.$q.notify({
          type: "warning",
          message: "No se pudo identificar la categoría a eliminar.",
        });
        return;
      }

      const label = row.name || this.shortId(row.id);
      this.$q
        .dialog({
          title: "Confirmar eliminación",
          message: `Esta acción eliminará la categoría "${label}". ¿Deseas continuar?`,
          cancel: { label: "Cancelar", flat: true, color: "grey-7" },
          ok: { label: "Eliminar", color: "negative", unelevated: true },
          persistent: true,
        })
        .onOk(() => this.deleteCategory(row));
    },
    async deleteCategory(row) {
      this.deleting = true;

      try {
        await this.rubrosStore.deleteRubro(row.id);

        if (this.selectedCategory && this.selectedCategory.id === row.id) {
          this.showDetailDialog = false;
          this.selectedCategory = null;
        }

        this.rows = this.rows.filter((item) => item.id !== row.id);
        this.$q.notify({
          type: "positive",
          message: "Categoría eliminada correctamente.",
          icon: "delete",
        });
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            (error &&
              error.response &&
              error.response.data &&
              (error.response.data.message || error.response.data)) ||
            (error && error.message) ||
            "No fue posible eliminar la categoría.",
        });
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>

<style scoped>
.budget-categories-list {
  width: 100%;
}

.categories-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.accordion-wrapper {
  position: relative;
  min-height: 200px;
}

.bc-accordion {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.bc-plan-group {
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  margin-bottom: 8px;
  overflow: hidden;
  background: #FFFFFF;
  transition: box-shadow 0.18s ease;
}

.bc-plan-group:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.bc-plan-header {
  background: #F9FAFB;
  border-bottom: 1px solid transparent;
  transition: background 0.18s ease, border-color 0.18s ease;
}

.bc-plan-header--expanded {
  background: #EFF6FF;
  border-bottom-color: #E5E7EB;
}

.bc-plan-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2px 0;
}

.bc-plan-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bc-plan-icon {
  color: #6B7280;
}

.bc-plan-header--expanded .bc-plan-icon {
  color: #2563EB;
}

.bc-plan-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.bc-plan-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.bc-plan-count {
  color: #6B7280;
  font-weight: 500;
}

.bc-plan-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #D1D5DB;
}

.bc-plan-budget {
  color: #059669;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.bc-expand-icon {
  color: #9CA3AF;
}

.bc-rubro-list {
  padding: 4px 0;
}

.bc-rubro-item {
  padding: 12px 16px;
  border-bottom: 0.5px solid #F3F4F6;
  transition: background 0.12s ease;
  animation: bc-fade-in 0.35s ease both;
  animation-delay: var(--fade-delay, 0ms);
}

.bc-rubro-item:last-child {
  border-bottom: none;
}

.bc-rubro-item:hover {
  background: #FAFAFA;
}

.bc-rubro-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bc-rubro-info {
  flex: 1;
  min-width: 0;
}

.bc-rubro-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.bc-rubro-dates {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9CA3AF;
}

.bc-rubro-date-icon {
  flex-shrink: 0;
}

.bc-rubro-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.bc-rubro-value {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.bc-rubro-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

@keyframes bc-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.badge-pill {
  display: inline-block;
  border-radius: 8px;
  padding: 4px 10px;
  font-weight: 600;
  font-size: 12px;
}

.badge--active {
  background: #d4edda;
}

.badge--inactive {
  background: #e8f4f8;
}

.empty-state-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px 48px;
  text-align: center;
}

.empty-state-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(116, 175, 126, 0.35);
}

.empty-state-title-gradient {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #84b24d 0%, #4e9c4c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  letter-spacing: -0.01em;
}

.empty-state-desc {
  font-size: 14px;
  color: #64748b;
  max-width: 380px;
  line-height: 1.6;
  margin-bottom: 4px;
}

.empty-state-btn {
  background: linear-gradient(135deg, #84b24d 0%, #4e9c4c 100%) !important;
  color: #fff !important;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 600;
}
</style>
