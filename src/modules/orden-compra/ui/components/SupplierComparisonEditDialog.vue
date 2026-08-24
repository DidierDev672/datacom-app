<template>
  <q-dialog
    :value="value"
    persistent
    transition-show="scale"
    transition-hide="scale"
    content-class="supplier-comparison-edit-dialog"
    @input="$emit('input', $event)"
  >
    <q-card class="edit-dialog">
      <template v-if="comparison">
        <!--
          Patrón Z de lectura (edición):
          Z₁ arriba-izq (qué edito) → arriba-der (ganador en vivo)
          Z₂ barrido horizontal (contexto clave)
          Z₃ cuerpo principal (criterio + ranking en vivo)
          Z₄ detalle editable (matriz colapsada)
          Z₅ abajo-izq (ayuda) → abajo-der (acción)
        -->
        <q-card-section
          class="z-zone z-zone--hero"
          aria-label="Resumen de edición"
        >
          <div class="z-hero__start">
            <q-avatar icon="edit" color="primary" text-color="white" size="42px" />
            <div class="z-hero__identity">
              <div class="z-hero__eyebrow">Editar comparación</div>
              <div class="z-hero__title">
                {{ comparison.code || "Sin código" }}
              </div>
            </div>
          </div>

          <div v-if="selectionSummary" class="z-hero__end">
            <div class="z-winner w-90">
              <q-icon name="emoji_events" size="32px" class="z-winner__icon" />
              <div class="z-winner__content">
                <div class="z-winner__label">
                  {{
                    selectionSummary.hasMixedWinners
                      ? "Ganadores por producto"
                      : "Selección actual"
                  }}
                </div>
                <div class="z-winner__name">{{ selectionSummary.title }}</div>
                <div class="z-winner__meta">
                  <span v-if="selectionSummary.subtitle">{{
                    selectionSummary.subtitle
                  }}</span>
                  <span class="z-winner__total">{{
                    formatCurrency(selectionSummary.total)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="z-hero__end z-hero__end--empty">
            <q-icon name="help_outline" size="20px" color="grey-6" />
            <span>Complete las cotizaciones y asigne un ganador por producto</span>
          </div>

          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            class="z-hero__close"
            :disable="saving"
            aria-label="Cerrar"
          />
        </q-card-section>

        <div class="z-zone z-zone--metrics" aria-label="Indicadores clave">
          <div
            v-for="metric in scanMetrics"
            :key="metric.key"
            class="z-metric"
          >
            <q-icon :name="metric.icon" size="18px" />
            <div class="z-metric__body">
              <span class="z-metric__label">{{ metric.label }}</span>
              <span class="z-metric__value">{{ metric.value }}</span>
            </div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="edit-content">
          <div
            v-if="contextChips.length"
            class="z-zone z-zone--chips"
            aria-label="Estado de la edición"
          >
            <q-chip
              v-for="chip in contextChips"
              :key="chip.key"
              dense
              :icon="chip.icon"
              :color="chip.color"
              :text-color="chip.textColor"
              class="z-chip"
            >
              {{ chip.label }}
            </q-chip>
          </div>

          <section
            class="z-zone z-zone--preference"
            aria-label="Ganadores por producto"
          >
            <div class="z-section-head">
              <h3 class="z-section-head__title">Ganadores por producto</h3>
              <span class="z-section-head__hint"
                >Un ganador por producto; puede ser uno o varios proveedores</span
              >
            </div>

            <div class="z-choice-grid">
              <button
                type="button"
                class="z-choice"
                :class="{ 'z-choice--active': winnerSelectionMode === 'auto' }"
                @click="setWinnerSelectionMode('auto')"
              >
                <q-icon name="auto_awesome" size="22px" />
                <span class="z-choice__title">Mejor precio por producto</span>
                <span class="z-choice__hint"
                  >El sistema elige automáticamente el menor precio de cada ítem</span
                >
              </button>
              <button
                type="button"
                class="z-choice"
                :class="{ 'z-choice--active': winnerSelectionMode === 'manual' }"
                @click="setWinnerSelectionMode('manual')"
              >
                <q-icon name="touch_app" size="22px" />
                <span class="z-choice__title">Selección manual</span>
                <span class="z-choice__hint"
                  >Haga clic en la celda cotizada para marcar al ganador</span
                >
              </button>
            </div>
          </section>

          <section
            class="z-zone z-zone--ranking q-mt-md"
            aria-label="Vista previa en tiempo real"
          >
            <div class="z-section-head">
              <h3 class="z-section-head__title">Vista previa en tiempo real</h3>
              <span class="z-section-head__hint"
                >Se actualiza al modificar precios o criterio</span
              >
            </div>

            <ol v-if="orderedSupplierSummaries.length" class="z-ranking">
              <li
                v-for="summary in orderedSupplierSummaries"
                :key="`preview-${summary.key}`"
                class="z-rank"
                :class="{
                  'z-rank--winner': summary.productsWon > 0,
                  'z-rank--best': summary.isBestPrice && summary.productsWon === 0,
                  'z-rank--incomplete': !summary.isComplete,
                }"
              >
                <span class="z-rank__position">
                  <q-icon
                    v-if="summary.productsWon > 0"
                    name="emoji_events"
                    size="16px"
                    color="amber-9"
                  />
                  <template v-else>{{ summary.rank }}</template>
                </span>

                <div class="z-rank__main">
                  <div class="z-rank__top">
                    <div class="z-rank__identity">
                      <span class="z-rank__name">{{ summary.name }}</span>
                      <span v-if="summary.nit" class="z-rank__nit"
                        >NIT {{ summary.nit }}</span
                      >
                    </div>
                    <span class="z-rank__total">{{
                      summary.productsWon > 0
                        ? formatCurrency(summary.selectedTotal)
                        : summary.isComplete
                          ? formatCurrency(summary.total)
                          : "Incompleto"
                    }}</span>
                  </div>
                  <div class="z-rank__bar-track">
                    <div
                      class="z-rank__bar-fill"
                      :style="{ width: supplierBarWidth(summary) }"
                    />
                  </div>
                  <div v-if="summary.badges.length" class="z-rank__tags">
                    <span
                      v-for="badge in summary.badges"
                      :key="badge.key"
                      class="z-tag"
                      :class="`z-tag--${badge.tone}`"
                    >
                      {{ badge.label }}
                    </span>
                  </div>
                </div>
              </li>
            </ol>
            <div v-else class="z-empty-ranking">
              Agregue cotizaciones para ver el ranking.
            </div>
          </section>

          <section
            class="z-zone z-zone--matrix q-mt-md"
            aria-label="Matriz de cotización editable"
          >
            <q-expansion-item
              v-model="matrixExpanded"
              expand-separator
              icon="edit_note"
              :label="matrixLabel"
              caption="Abra para editar precios unitarios por producto y proveedor"
              header-class="z-matrix-header"
              class="z-matrix-expansion"
            >
              <div class="quote-matrix">
                <q-markup-table flat bordered dense class="quote-table">
                  <thead>
                    <tr>
                      <th class="text-left sticky-col">Producto</th>
                      <th class="text-right">Cant.</th>
                      <th class="text-left">Unidad</th>
                      <th
                        v-for="supplier in form.suppliers"
                        :key="`head-${supplier.key}`"
                        class="text-center supplier-col"
                      >
                        <div class="supplier-head">
                          <span>{{ supplier.name }}</span>
                          <span
                            v-if="getSupplierWinCount(supplier.key) > 0"
                            class="supplier-head__badge"
                            >{{ getSupplierWinCount(supplier.key) }} ganado(s)</span
                          >
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in form.products" :key="product.id">
                      <td class="sticky-col">
                        <div class="text-weight-medium">
                          {{ product.productName }}
                        </div>
                      </td>
                      <td class="text-right">{{ product.quantity }}</td>
                      <td>{{ product.unit || "UND" }}</td>
                      <td
                        v-for="supplier in form.suppliers"
                        :key="`${supplier.key}-${product.id}`"
                        class="supplier-col"
                        :class="{
                          'is-winner-col': isProductWinner(supplier.key, product.id),
                          'is-winner-selectable':
                            winnerSelectionMode === 'manual' &&
                            canSelectProductWinner(supplier.key, product.id),
                        }"
                        @click="selectProductWinner(product.id, supplier.key)"
                      >
                        <q-input
                          :value="getQuoteInputValue(supplier.key, product.id)"
                          outlined
                          dense
                          type="number"
                          min="0"
                          step="1"
                          prefix="$"
                          class="quote-input"
                          @input="setQuote(supplier.key, product.id, $event)"
                          @click.native.stop
                        />
                      </td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </div>
            </q-expansion-item>
          </section>
        </q-card-section>

        <q-separator />

        <q-card-actions class="z-zone z-zone--footer" aria-label="Acciones">
          <div class="z-footer__meta">
            Los totales y los ganadores por producto se recalculan al guardar.
          </div>
          <q-space />
          <q-btn
            flat
            no-caps
            label="Cancelar"
            color="grey-7"
            v-close-popup
            :disable="saving"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="save"
            label="Guardar cambios"
            :loading="saving"
            @click="saveChanges"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script>
import { supplierComparisonStorageApi } from "../../infrastructure/SupplierComparisonStorageApi";
import { formatCurrency } from "../utils/purchaseOrderFinance";
import {
  buildComparisonResult,
  getQuoteValue,
} from "../utils/supplierComparison";

function cloneFormState(comparison) {
  let winnerSelectionMode = comparison.winnerSelectionMode || "auto";
  const productWinners = JSON.parse(
    JSON.stringify(comparison.productWinners || {})
  );

  if (!comparison.winnerSelectionMode && comparison.preferredSupplierKey) {
    winnerSelectionMode = "manual";
    if (!Object.keys(productWinners).length) {
      (comparison.products || []).forEach((product) => {
        productWinners[product.id] = comparison.preferredSupplierKey;
      });
    }
  }

  return {
    products: JSON.parse(JSON.stringify(comparison.products || [])),
    suppliers: JSON.parse(JSON.stringify(comparison.suppliers || [])),
    quotes: JSON.parse(JSON.stringify(comparison.quotes || {})),
    productWinners,
    winnerSelectionMode,
  };
}

export default {
  name: "SupplierComparisonEditDialog",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    comparison: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      saving: false,
      matrixExpanded: false,
      form: {
        products: [],
        suppliers: [],
        quotes: {},
      },
      winnerSelectionMode: "auto",
      productWinners: {},
    };
  },

  computed: {
    previewComparison() {
      return buildComparisonResult({
        products: this.form.products,
        suppliers: this.form.suppliers,
        quotes: this.form.quotes,
        productWinners:
          this.winnerSelectionMode === "manual" ? this.productWinners : null,
        winnerSelectionMode: this.winnerSelectionMode,
      });
    },
    selectionSummary() {
      if (!this.previewComparison.hasAllProductWinners) {
        return null;
      }

      const winnerKeys = [
        ...new Set(
          Object.values(this.previewComparison.productWinners || {}).filter(
            Boolean
          )
        ),
      ];

      if (!winnerKeys.length) {
        return null;
      }

      const suppliers = this.form.suppliers.filter((supplier) =>
        winnerKeys.includes(supplier.key)
      );

      return {
        title:
          winnerKeys.length === 1
            ? suppliers[0]
              ? suppliers[0].name
              : winnerKeys[0]
            : `${winnerKeys.length} proveedores`,
        subtitle:
          winnerKeys.length === 1 && suppliers[0] && suppliers[0].nit
            ? `NIT ${suppliers[0].nit}`
            : winnerKeys.length > 1
              ? "Cada producto tiene su proveedor ganador"
              : "",
        total: this.previewComparison.optimalTotal,
        hasMixedWinners: winnerKeys.length > 1,
      };
    },
    scanMetrics() {
      if (!this.comparison) {
        return [];
      }

      return [
        {
          key: "request",
          icon: "assignment",
          label: "Solicitud",
          value:
            this.comparison.requestLabel || this.comparison.requestId || "—",
        },
        {
          key: "order",
          icon: "local_shipping",
          label: "Orden",
          value: this.comparison.supplyOrderId || "—",
        },
        {
          key: "suppliers",
          icon: "store",
          label: "Proveedores",
          value: String(this.form.suppliers.length || 0),
        },
        {
          key: "products",
          icon: "inventory_2",
          label: "Productos",
          value: String(this.form.products.length || 0),
        },
      ];
    },
    contextChips() {
      const chips = [];
      const incompleteCount = (this.previewComparison.supplierSummaries || [])
        .filter((item) => !item.isComplete).length;

      if (incompleteCount > 0) {
        chips.push({
          key: "incomplete",
          icon: "warning",
          label: `${incompleteCount} proveedor(es) con cotización incompleta`,
          color: "amber-1",
          textColor: "amber-10",
        });
      }

      if (this.winnerSelectionMode === "manual") {
        chips.push({
          key: "manual-mode",
          icon: "touch_app",
          label: "Selección manual por producto",
          color: "deep-orange-1",
          textColor: "deep-orange-9",
        });
      }

      if (this.selectionSummary && this.selectionSummary.hasMixedWinners) {
        chips.push({
          key: "mixed-winners",
          icon: "groups",
          label: "La orden se divide entre varios proveedores",
          color: "indigo-1",
          textColor: "indigo-9",
        });
      }

      return chips;
    },
    orderedSupplierSummaries() {
      const summaries = [...(this.previewComparison.supplierSummaries || [])];
      summaries.sort((left, right) => {
        const leftWon = left.productsWon || 0;
        const rightWon = right.productsWon || 0;
        if (leftWon !== rightWon) {
          return rightWon - leftWon;
        }
        if (left.isComplete !== right.isComplete) {
          return left.isComplete ? -1 : 1;
        }
        if (leftWon > 0 && left.selectedTotal !== right.selectedTotal) {
          return (left.selectedTotal || 0) - (right.selectedTotal || 0);
        }
        if (left.isBestPrice !== right.isBestPrice) {
          return left.isBestPrice ? -1 : 1;
        }
        return (left.total || 0) - (right.total || 0);
      });

      return summaries.map((summary, index) => ({
        ...summary,
        rank: index + 1,
        badges: this.buildRankBadges(summary),
      }));
    },
    maxSupplierTotal() {
      const totals = this.orderedSupplierSummaries
        .filter((item) => item.isComplete)
        .map((item) => item.total || 0);
      return Math.max(...totals, 1);
    },
    matrixLabel() {
      return `Editar precios (${this.form.products.length} × ${this.form.suppliers.length})`;
    },
  },

  watch: {
    value(isOpen) {
      if (isOpen && this.comparison) {
        this.loadForm();
        this.matrixExpanded = false;
      }
    },
    comparison: {
      immediate: true,
      handler(next) {
        if (this.value && next) {
          this.loadForm();
        }
      },
    },
  },

  methods: {
    formatCurrency,
    loadForm() {
      const state = cloneFormState(this.comparison);
      this.form = {
        products: state.products,
        suppliers: state.suppliers,
        quotes: state.quotes,
      };
      this.winnerSelectionMode = state.winnerSelectionMode;
      this.productWinners = state.productWinners;
    },
    getQuoteInputValue(supplierKey, productId) {
      const value = getQuoteValue(this.form.quotes, supplierKey, productId);
      return value == null ? "" : value;
    },
    setQuote(supplierKey, productId, value) {
      if (!this.form.quotes[supplierKey]) {
        this.$set(this.form.quotes, supplierKey, {});
      }
      this.$set(this.form.quotes[supplierKey], productId, value);
      if (
        this.winnerSelectionMode === "manual" &&
        this.productWinners[productId] === supplierKey &&
        getQuoteValue(this.form.quotes, supplierKey, productId) == null
      ) {
        this.$delete(this.productWinners, productId);
      }
    },
    setWinnerSelectionMode(mode) {
      this.winnerSelectionMode = mode;
      if (mode === "auto") {
        this.productWinners = {};
        return;
      }
      this.productWinners = {
        ...(this.previewComparison.productWinners || {}),
      };
    },
    buildRankBadges(summary) {
      const badges = [];
      if (summary.productsWon > 0) {
        badges.push({
          key: "winner",
          tone: "winner",
          label:
            summary.productsWon === 1
              ? "1 producto ganado"
              : `${summary.productsWon} productos ganados`,
        });
      }
      if (summary.isBestPrice && summary.productsWon === 0) {
        badges.push({ key: "best", tone: "best", label: "Mejor precio total" });
      }
      if (!summary.isComplete) {
        badges.push({
          key: "incomplete",
          tone: "diff",
          label: `${summary.missingQuotes || 0} precio(s) faltante(s)`,
        });
      }
      if (
        summary.differenceFromBest != null &&
        summary.differenceFromBest > 0 &&
        !summary.isBestPrice &&
        summary.isComplete
      ) {
        badges.push({
          key: "diff",
          tone: "diff",
          label: `+${formatCurrency(summary.differenceFromBest)} vs mejor`,
        });
      }
      return badges;
    },
    supplierBarWidth(summary) {
      if (!summary || !summary.isComplete) {
        return "0%";
      }
      const total = summary.total || 0;
      const width = Math.min(100, (total / this.maxSupplierTotal) * 100);
      return `${width}%`;
    },
    isProductWinner(supplierKey, productId) {
      return this.previewComparison.productWinners[productId] === supplierKey;
    },
    getSupplierWinCount(supplierKey) {
      return Object.values(this.previewComparison.productWinners || {}).filter(
        (key) => key === supplierKey
      ).length;
    },
    canSelectProductWinner(supplierKey, productId) {
      return getQuoteValue(this.form.quotes, supplierKey, productId) != null;
    },
    selectProductWinner(productId, supplierKey) {
      if (this.winnerSelectionMode !== "manual") {
        return;
      }
      if (!this.canSelectProductWinner(supplierKey, productId)) {
        this.$q.notify({
          type: "warning",
          message:
            "Ingrese una cotización válida antes de marcar este proveedor como ganador.",
        });
        return;
      }
      this.$set(this.productWinners, productId, supplierKey);
    },
    async saveChanges() {
      if (!this.comparison || !this.comparison.id) {
        return;
      }

      this.saving = true;
      try {
        const comparisonResult = this.previewComparison;
        const updated = await supplierComparisonStorageApi.updateComparison(
          this.comparison.id,
          {
            products: this.form.products,
            suppliers: this.form.suppliers,
            quotes: this.form.quotes,
            bestPriceSupplierKey: comparisonResult.bestPriceSupplierKey,
            winnerSupplierKey: comparisonResult.winnerSupplierKey,
            preferredSupplierKey: comparisonResult.preferredSupplierKey,
            productWinners: comparisonResult.productWinners,
            optimalTotal: comparisonResult.optimalTotal,
            supplierSummaries: comparisonResult.supplierSummaries,
            winnerSelectionMode: comparisonResult.winnerSelectionMode,
          }
        );

        this.$q.notify({
          type: "positive",
          message: "Comparación actualizada correctamente.",
        });
        this.$emit("saved", updated);
        this.$emit("input", false);
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            (error && error.message) ||
            "No fue posible actualizar la comparación.",
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.edit-dialog {
  width: 95vw;
  max-width: 1400px;
  max-height: 94vh;
  border-radius: 12px;
  overflow: hidden;
}

.edit-content {
  max-height: calc(94vh - 220px);
  overflow: auto;
  padding: 18px 20px 20px;
}

/* Z₁ — Identidad (izq) → Ganador en vivo (der) */
.z-zone--hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 42%);
  gap: 16px;
  align-items: center;
  padding: 18px 52px 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  position: relative;
}

.z-hero__start {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.z-hero__identity {
  min-width: 0;
}

.z-hero__eyebrow {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
  font-weight: 700;
}

.z-hero__title {
  margin-top: 2px;
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  word-break: break-word;
}

.z-hero__end {
  justify-self: stretch;
  display: flex;
  justify-content: flex-end;
}

.z-hero__end--empty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.84rem;
}

.w-90 {
  width: 90%;
}

.z-winner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(254, 243, 199, 0.95) 0%,
    rgba(253, 230, 138, 0.9) 100%
  );
  border: 1px solid rgba(245, 158, 11, 0.35);
  min-width: 280px;
}

.z-winner__icon {
  color: #b45309;
  flex-shrink: 0;
}

.z-winner__label {
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #92400e;
  font-weight: 700;
}

.z-winner__name {
  margin-top: 2px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #78350f;
  line-height: 1.25;
}

.z-winner__meta {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.74rem;
  color: #92400e;
}

.z-winner__total {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.z-hero__close {
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Z₂ — Barrido horizontal */
.z-zone--metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 12px 20px;
  background: #fff;
}

.z-metric {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  min-width: 0;
  color: #475569;
}

.z-metric__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.z-metric__label {
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  font-weight: 700;
}

.z-metric__value {
  font-size: 0.84rem;
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.z-zone--chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.z-chip {
  font-size: 0.78rem;
}

.z-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.z-section-head__title {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.z-section-head__hint {
  font-size: 0.76rem;
  color: #94a3b8;
  white-space: nowrap;
}

.z-choice-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.z-choice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #475569;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.z-choice:hover {
  border-color: #cbd5e1;
}

.z-choice--active {
  border-color: rgba(59, 130, 246, 0.55);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.12);
  color: #1e3a8a;
}

.z-choice__title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
}

.z-choice__hint {
  font-size: 0.76rem;
  color: #64748b;
  line-height: 1.35;
}

.z-preferred-select {
  max-width: 460px;
}

.z-ranking {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.z-rank {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
}

.z-rank--winner {
  border-color: rgba(59, 130, 246, 0.45);
  background: rgba(59, 130, 246, 0.04);
}

.z-rank--best {
  border-color: rgba(34, 197, 94, 0.4);
  background: rgba(34, 197, 94, 0.04);
}

.z-rank--incomplete {
  opacity: 0.82;
}

.z-rank__position {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f1f5f9;
  font-size: 0.78rem;
  font-weight: 800;
  color: #64748b;
  flex-shrink: 0;
}

.z-rank--winner .z-rank__position {
  background: rgba(254, 243, 199, 0.9);
}

.z-rank__main {
  min-width: 0;
}

.z-rank__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.z-rank__identity {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.z-rank__name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
}

.z-rank__nit {
  font-size: 0.74rem;
  color: #64748b;
}

.z-rank__total {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
}

.z-rank__bar-track {
  margin-top: 8px;
  height: 5px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.z-rank__bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
  transition: width 0.25s ease;
}

.z-rank--best .z-rank__bar-fill {
  background: linear-gradient(90deg, #4ade80 0%, #22c55e 100%);
}

.z-rank--winner .z-rank__bar-fill {
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
}

.z-rank__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.z-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.z-tag--winner {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}

.z-tag--best {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.z-tag--diff {
  background: rgba(239, 68, 68, 0.08);
  color: #b91c1c;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}

.z-empty-ranking {
  padding: 16px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  font-size: 0.84rem;
  text-align: center;
}

.z-matrix-expansion {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.z-matrix-expansion ::v-deep .z-matrix-header {
  font-weight: 700;
  color: #0f172a;
}

.quote-matrix {
  overflow: auto;
  padding: 0 12px 12px;
}

.quote-table {
  width: 100%;
  min-width: 100%;
}

.sticky-col {
  min-width: 220px;
}

.supplier-col {
  min-width: 140px;
}

.is-winner-col {
  background: rgba(254, 243, 199, 0.55);
}

.is-winner-selectable {
  cursor: pointer;
}

.is-winner-selectable:hover {
  background: rgba(254, 243, 199, 0.25);
}

.supplier-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.supplier-head__badge {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #1d4ed8;
}

.quote-input {
  min-width: 110px;
}

.z-zone--footer {
  padding: 12px 20px;
  background: #f8fafc;
}

.z-footer__meta {
  font-size: 0.76rem;
  color: #94a3b8;
  line-height: 1.4;
}

@media (max-width: 760px) {
  .z-zone--hero {
    grid-template-columns: 1fr;
    padding-right: 48px;
  }

  .z-hero__end {
    justify-self: stretch;
  }

  .edit-dialog {
    width: 100vw;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  .edit-content {
    max-height: calc(100vh - 200px);
  }

  .z-winner.w-90 {
    width: 100%;
  }

  .z-zone--metrics,
  .z-choice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .z-section-head {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .z-rank__top {
    flex-direction: column;
    gap: 4px;
  }

  .z-rank__total {
    align-self: flex-start;
  }
}
</style>

<style>
.supplier-comparison-edit-dialog {
  width: 95vw;
  max-width: 1400px;
}

@media (max-width: 760px) {
  .supplier-comparison-edit-dialog {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>
