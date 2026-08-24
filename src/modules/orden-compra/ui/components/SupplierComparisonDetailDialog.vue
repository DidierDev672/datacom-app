<template>
  <q-dialog
    :value="value"
    transition-show="scale"
    transition-hide="scale"
    content-class="supplier-comparison-detail-dialog"
    @input="$emit('input', $event)"
  >
    <q-card class="detail-dialog">
      <template v-if="comparison">
        <!--
          Patrón Z de lectura:
          Z₁ arriba-izq (qué es) → arriba-der (resultado)
          Z₂ barrido horizontal (métricas clave)
          Z₃ cuerpo principal (ranking, ancho completo)
          Z₄ detalle de soporte (matriz colapsada)
          Z₅ abajo-izq (meta) → abajo-der (acción)
        -->
        <q-card-section
          class="z-zone z-zone--hero"
          aria-label="Resumen de comparación"
        >
          <div class="z-hero__start">
            <q-avatar
              icon="visibility"
              color="primary"
              text-color="white"
              size="42px"
            />
            <div class="z-hero__identity">
              <div class="z-hero__eyebrow">Comparación de proveedores</div>
              <div class="z-hero__title">
                {{ comparison.code || "Sin código" }}
              </div>
            </div>
          </div>

          <div v-if="hasProductWinners" class="z-hero__end">
            <div class="z-winner-wrap">
              <span v-if="hasRegisteredPurchase" class="z-purchase-badge">
                <q-icon name="verified" size="13px" />
                Compra registrada
              </span>
              <div class="z-winner w-90">
                <q-icon name="emoji_events" size="32px" class="z-winner__icon" />
                <div class="z-winner__content">
                  <div class="z-winner__label">
                    {{
                      hasMixedProductWinners
                        ? "Ganadores por producto"
                        : "Ganador"
                    }}
                  </div>
                  <div class="z-winner__name">{{ winnerHeroTitle }}</div>
                  <div class="z-winner__meta">
                    <span v-if="winnerHeroSubtitle">{{ winnerHeroSubtitle }}</span>
                    <span class="z-winner__total">{{
                      formatCurrency(optimalSelectionTotal)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="z-hero__end z-hero__end--empty">
            <q-icon name="help_outline" size="20px" color="grey-6" />
            <span>Sin ganador definido</span>
          </div>

          <q-btn
            v-close-popup
            flat
            round
            dense
            icon="close"
            class="z-hero__close"
            aria-label="Cerrar"
          />
        </q-card-section>

        <!-- Z₂: barrido horizontal — una sola pasada de lectura -->
        <div class="z-zone z-zone--metrics" aria-label="Indicadores clave">
          <div
            v-for="metric in scanMetrics"
            :key="metric.key"
            class="z-metric"
            :class="{ 'z-metric--accent': metric.accent }"
          >
            <q-icon :name="metric.icon" size="18px" />
            <div class="z-metric__body">
              <span class="z-metric__label">{{ metric.label }}</span>
              <span class="z-metric__value">{{ metric.value }}</span>
            </div>
          </div>
        </div>

        <q-separator />

        <q-card-section class="detail-content">
          <!-- Chips de contexto: solo información que no está en Z₂ -->
          <div
            v-if="contextChips.length || displayedPurchaserLabel"
            class="z-zone z-zone--chips"
            aria-label="Contexto adicional"
          >
            <q-chip
              v-if="displayedPurchaserLabel"
              key="purchaser-badge"
              dense
              icon="person"
              :removable="!hasRegisteredPurchase"
              color="teal-1"
              text-color="teal-9"
              class="z-chip z-chip--purchaser"
              @remove="clearSelectedPurchaser"
            >
              Comprador: {{ displayedPurchaserLabel }}
            </q-chip>
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

          <!-- Z₃: resultados — un ganador por producto, puede haber varios proveedores -->
          <section
            class="z-zone z-zone--ranking"
            aria-label="Resultados de la comparación"
          >
            <div class="z-section-head">
              <h3 class="z-section-head__title">Resultados de la comparación</h3>
              <span class="z-section-head__hint"
                >Un ganador por producto · puede ser uno o varios proveedores</span
              >
            </div>

            <ol class="z-ranking">
              <li
                v-for="summary in orderedSupplierSummaries"
                :key="`rank-${summary.key}`"
                class="z-rank"
                :class="{
                  'z-rank--winner': summary.productsWon > 0,
                  'z-rank--best': summary.isBestPrice && summary.productsWon === 0,
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
                    <div class="z-rank__totals">
                      <span
                        v-if="summary.productsWon > 0"
                        class="z-rank__selected"
                      >
                        {{ formatCurrency(summary.selectedTotal) }}
                      </span>
                      <span class="z-rank__total">
                        Cotización total:
                        {{ formatCurrency(summary.total) }}
                      </span>
                    </div>
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
          </section>

          <!-- Z₄: detalle de soporte — oculto por defecto para reducir ruido -->
          <section
            class="z-zone z-zone--matrix q-mt-md"
            aria-label="Matriz de cotización"
          >
            <q-expansion-item
              v-model="matrixExpanded"
              expand-separator
              icon="grid_on"
              :label="matrixLabel"
              caption="Abrir solo si necesita el desglose por producto"
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
                        v-for="supplier in comparison.suppliers"
                        :key="`head-${supplier.key}`"
                        class="text-center supplier-col"
                      >
                        {{ supplier.name }}
                      </th>
                      <th class="text-left winner-col">Ganador</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="product in comparison.products"
                      :key="product.id"
                    >
                      <td class="sticky-col">
                        <div class="text-weight-medium">
                          {{ product.productName }}
                        </div>
                        <div
                          v-if="product.planName"
                          class="text-caption text-grey-6"
                        >
                          {{ product.planName }}
                        </div>
                      </td>
                      <td class="text-right">{{ product.quantity }}</td>
                      <td>{{ product.unit }}</td>
                      <td
                        v-for="supplier in comparison.suppliers"
                        :key="`${supplier.key}-${product.id}`"
                        class="text-right supplier-col"
                        :class="{
                          'is-winner-cell': isWinnerForProduct(
                            supplier.key,
                            product.id
                          ),
                        }"
                      >
                        <div class="quote-cell">
                          <q-icon
                            v-if="isWinnerForProduct(supplier.key, product.id)"
                            name="emoji_events"
                            size="14px"
                            color="amber-9"
                            class="quote-cell__icon"
                          />
                          <span>
                            {{
                              formatCurrency(
                                getQuoteValue(
                                  comparison.quotes,
                                  supplier.key,
                                  product.id
                                ) || 0
                              )
                            }}
                          </span>
                        </div>
                        <div class="text-caption text-grey-6">
                          Sub:
                          {{
                            formatCurrency(
                              lineTotal(
                                product.quantity,
                                getQuoteValue(
                                  comparison.quotes,
                                  supplier.key,
                                  product.id
                                )
                              )
                            )
                          }}
                        </div>
                      </td>
                      <td class="winner-col">
                        <span
                          v-if="getWinnerSupplierName(product.id)"
                          class="winner-col__name"
                        >
                          {{ getWinnerSupplierName(product.id) }}
                        </span>
                        <span v-else class="text-grey-6">—</span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="totals-row">
                      <td colspan="3" class="text-right text-weight-bold">
                        Total por proveedor
                      </td>
                      <td
                        v-for="supplier in comparison.suppliers"
                        :key="`total-${supplier.key}`"
                        class="text-right text-weight-bold supplier-col"
                      >
                        {{ formatCurrency(getSupplierTotal(supplier.key)) }}
                      </td>
                      <td class="winner-col text-weight-bold">
                        {{ formatCurrency(optimalSelectionTotal) }}
                      </td>
                    </tr>
                    <tr class="totals-row totals-row--wins">
                      <td colspan="3" class="text-right text-weight-medium">
                        Productos ganados
                      </td>
                      <td
                        v-for="supplier in comparison.suppliers"
                        :key="`wins-${supplier.key}`"
                        class="text-center supplier-col"
                      >
                        {{ getSupplierWinCount(supplier.key) }}
                      </td>
                      <td class="winner-col" />
                    </tr>
                  </tfoot>
                </q-markup-table>
              </div>
            </q-expansion-item>
          </section>

          <!-- Z₅: resumen financiero calculado con la matriz -->
          <section
            class="z-zone z-zone--finance q-mt-md"
            aria-label="Resumen financiero"
          >
            <q-card flat bordered class="finance-card">
              <q-card-section class="finance-card__head">
                <h3 class="z-section-head__title">Resumen financiero</h3>
                <span class="z-section-head__hint"
                  >Calculado con los productos ganadores de la matriz</span
                >
              </q-card-section>

              <q-separator />

              <q-card-section class="finance-body">
                <div class="finance-rows">
                  <div class="finance-row">
                    <span class="finance-row__label">Subtotal</span>
                    <strong class="finance-row__value">{{
                      formatCurrency(matrixSubtotal)
                    }}</strong>
                  </div>
                  <div class="finance-row">
                    <span class="finance-row__label">IVA 16%</span>
                    <strong class="finance-row__value">{{
                      formatCurrency(iva16)
                    }}</strong>
                  </div>
                  <div class="finance-row">
                    <span class="finance-row__label">IVA 10%</span>
                    <strong class="finance-row__value">{{
                      formatCurrency(iva10)
                    }}</strong>
                  </div>
                  <div class="finance-row">
                    <span class="finance-row__label">IVA teórico 15%</span>
                    <strong class="finance-row__value">{{
                      formatCurrency(theoreticalIva15)
                    }}</strong>
                  </div>
                </div>

                <div class="finance-inputs">
                  <q-input
                    v-model.number="manualDiscount"
                    dense
                    outlined
                    type="number"
                    min="0"
                    label="Descuento (manual)"
                    prefix="$"
                    class="finance-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="percent" size="18px" color="grey-6" />
                    </template>
                  </q-input>
                  <q-input
                    v-model.number="freightCost"
                    dense
                    outlined
                    type="number"
                    min="0"
                    label="Flete"
                    prefix="$"
                    class="finance-input"
                  >
                    <template v-slot:prepend>
                      <q-icon name="local_shipping" size="18px" color="grey-6" />
                    </template>
                  </q-input>
                  <q-select
                    v-model="appliedIvaRate"
                    dense
                    outlined
                    emit-value
                    map-options
                    label="IVA aplicado al total"
                    class="finance-input"
                    :options="ivaRateOptions"
                  />
                </div>

                <q-separator class="q-my-md" />

                <div class="finance-total">
                  <span>Total estimado</span>
                  <strong>{{ formatCurrency(financeTotal) }}</strong>
                </div>
              </q-card-section>
            </q-card>
          </section>
        </q-card-section>

        <q-separator />

        <!-- Z₅: meta abajo-izq → acción abajo-der -->
        <q-card-actions class="z-zone z-zone--footer" aria-label="Acciones">
          <div class="z-footer__meta">
            <span>Creada {{ formatComparisonDate(comparison.createdAt) }}</span>
            <span v-if="comparison.updatedAt" class="z-footer__meta-sep"
              >·</span
            >
            <span v-if="comparison.updatedAt">
              Actualizada {{ formatComparisonDate(comparison.updatedAt) }}
            </span>
          </div>
          <q-space />
          <q-btn
            outline
            no-caps
            color="primary"
            icon="person_search"
            :label="purchaserButtonLabel"
            :disable="hasRegisteredPurchase"
            @click="openPurchaserDialog"
          >
            <q-tooltip>{{ purchaserButtonTooltip }}</q-tooltip>
          </q-btn>
          <q-btn
            unelevated
            no-caps
            color="green-8"
            icon="save"
            label="Registrar compra"
            :loading="isRegisteringPurchase"
            :disable="!canRegisterPurchase"
            @click="onRegisterPurchase"
          >
            <q-tooltip>{{ registerPurchaseTooltip }}</q-tooltip>
          </q-btn>
          <q-btn
            v-close-popup
            unelevated
            no-caps
            color="primary"
            label="Cerrar"
          />
        </q-card-actions>
      </template>
    </q-card>

    <PurchaserSelectionDialog
      v-model="showPurchaserDialog"
      @confirmed="onPurchaserConfirmed"
    />

    <PurchaseLoadingModal
      :is-loading="purchaseStore.isLoading"
      :is-success="purchaseStore.isSuccess"
      :error-message="purchaseStore.errorMessage"
      @close="closePurchaseModal"
    />

    <LoadingSpinnerOverlay
      :is-loading="detailIsLoading"
      label="Cargando información de la compra…"
    />
  </q-dialog>
</template>

<script>
import { formatCurrency, shortId } from "../utils/purchaseOrderFinance";
import { formatComparisonDate } from "../utils/supplierComparisonList";
import PurchaserSelectionDialog from "./PurchaserSelectionDialog.vue";
import PurchaseLoadingModal from "./PurchaseLoadingModal.vue";
import LoadingSpinnerOverlay from "./LoadingSpinnerOverlay.vue";
import { purchaserApi } from "../../infrastructure/PurchaserApi";
import { usePurchaseServiceStore } from "../../../../stores/purchaseServiceStore";
import {
  buildComparisonResult,
  buildProductWinnersMap,
  buildSupplierSummaries,
  calculateLineTotal,
  calculateProductWinnersTotal,
  countProductsWonBySupplier,
  getQuoteValue,
  hasManualProductWinnerOverrides,
} from "../utils/supplierComparison";

export default {
  name: "SupplierComparisonDetailDialog",

  components: {
    PurchaserSelectionDialog,
    PurchaseLoadingModal,
    LoadingSpinnerOverlay,
  },

  setup() {
    const purchaseStore = usePurchaseServiceStore();
    return { purchaseStore };
  },

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
      matrixExpanded: false,
      showPurchaserDialog: false,
      selectedPurchaser: null,
      // true mientras se consulta GET /purchase-service/quote/{idQuote}
      detailIsLoading: false,
      // Compradores (ids) presentes en las compras ya registradas
      registeredPurchaserIds: [],
      registeredPurchaserLabel: "",
      manualDiscount: 0,
      freightCost: 0,
      appliedIvaRate: 0.16,
      ivaRateOptions: [
        { label: "IVA 16%", value: 0.16 },
        { label: "IVA 10%", value: 0.1 },
        { label: "IVA teórico 15%", value: 0.15 },
      ],
    };
  },

  computed: {
    productWinnersMap() {
      if (!this.comparison) {
        return {};
      }
      return buildProductWinnersMap(
        this.comparison.products,
        this.comparison.suppliers,
        this.comparison.quotes,
        this.comparison.productWinners
      );
    },
    productWinCounts() {
      return countProductsWonBySupplier(this.productWinnersMap);
    },
    winnerSupplierKeys() {
      return [
        ...new Set(
          Object.values(this.productWinnersMap).filter((supplierKey) =>
            Boolean(supplierKey)
          )
        ),
      ];
    },
    hasProductWinners() {
      return this.winnerSupplierKeys.length > 0;
    },
    hasMixedProductWinners() {
      return this.winnerSupplierKeys.length > 1;
    },
    singleWinnerSupplier() {
      if (!this.hasProductWinners || this.hasMixedProductWinners) {
        return null;
      }
      const winnerKey = this.winnerSupplierKeys[0];
      return (
        (this.comparison.suppliers || []).find(
          (supplier) => supplier.key === winnerKey
        ) || null
      );
    },
    winnerHeroTitle() {
      if (this.singleWinnerSupplier) {
        return this.singleWinnerSupplier.name;
      }
      if (this.hasMixedProductWinners) {
        return `${this.winnerSupplierKeys.length} proveedores`;
      }
      return "";
    },
    winnerHeroSubtitle() {
      if (this.singleWinnerSupplier && this.singleWinnerSupplier.nit) {
        return `NIT ${this.singleWinnerSupplier.nit}`;
      }
      if (this.hasMixedProductWinners) {
        return "Cada producto tiene su proveedor ganador";
      }
      return "";
    },
    optimalSelectionTotal() {
      if (!this.comparison) {
        return 0;
      }
      return calculateProductWinnersTotal(
        this.comparison.products,
        this.productWinnersMap,
        this.comparison.quotes
      );
    },
    resolvedComparison() {
      if (!this.comparison) {
        return null;
      }
      const winnerSelectionMode =
        this.comparison.winnerSelectionMode ||
        (this.comparison.preferredSupplierKey ? "manual" : "auto");

      return buildComparisonResult({
        products: this.comparison.products,
        suppliers: this.comparison.suppliers,
        quotes: this.comparison.quotes,
        preferredSupplierKey: this.comparison.preferredSupplierKey,
        productWinners:
          winnerSelectionMode === "manual"
            ? this.comparison.productWinners
            : null,
        winnerSelectionMode,
      });
    },
    hasManualSelections() {
      if (!this.comparison) {
        return false;
      }
      return hasManualProductWinnerOverrides(
        this.comparison.products,
        this.comparison.suppliers,
        this.comparison.quotes,
        this.comparison.productWinners
      );
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
          value: String(this.comparison.suppliersCount || 0),
        },
        {
          key: "products",
          icon: "inventory_2",
          label: "Productos",
          value: String(this.comparison.productsCount || 0),
        },
      ];
    },
    contextChips() {
      if (!this.comparison) {
        return [];
      }

      const chips = [];
      if (this.hasMixedProductWinners) {
        chips.push({
          key: "mixed-winners",
          icon: "groups",
          label: "La orden se divide entre varios proveedores",
          color: "indigo-1",
          textColor: "indigo-9",
        });
      }
      if (
        this.hasManualSelections ||
        (this.comparison.preferredSupplierKey &&
          !this.comparison.winnerSelectionMode)
      ) {
        chips.push({
          key: "manual-winner",
          icon: "thumb_up",
          label: "Algunos productos tienen ganador manual",
          color: "deep-orange-1",
          textColor: "deep-orange-9",
        });
      }
      return chips;
    },
    orderedSupplierSummaries() {
      if (
        !this.resolvedComparison ||
        !Array.isArray(this.resolvedComparison.supplierSummaries)
      ) {
        return [];
      }

      const summaries = [...this.resolvedComparison.supplierSummaries];
      summaries.sort((left, right) => {
        const leftWon = left.productsWon || 0;
        const rightWon = right.productsWon || 0;
        if (leftWon !== rightWon) {
          return rightWon - leftWon;
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
      const totals = this.orderedSupplierSummaries.map((item) => {
        if (item.productsWon > 0) {
          return item.selectedTotal || 0;
        }
        return item.total || 0;
      });
      return Math.max(...totals, 1);
    },
    matrixLabel() {
      const products =
        this.comparison && this.comparison.productsCount
          ? this.comparison.productsCount
          : 0;
      const suppliers =
        this.comparison && this.comparison.suppliersCount
          ? this.comparison.suppliersCount
          : 0;
      return `Matriz de cotización (${products} × ${suppliers})`;
    },
    matrixSubtotal() {
      if (!this.comparison || !Array.isArray(this.comparison.products)) {
        return 0;
      }
      return this.comparison.products.reduce((subtotal, product) => {
        const winnerKey = this.productWinnersMap[product.id];
        if (!winnerKey) {
          return subtotal;
        }
        const unitPrice = getQuoteValue(
          this.comparison.quotes,
          winnerKey,
          product.id
        );
        if (unitPrice == null) {
          return subtotal;
        }
        return subtotal + calculateLineTotal(product.quantity, unitPrice);
      }, 0);
    },
    financeNetBase() {
      const subtotal = Number(this.matrixSubtotal) || 0;
      const discount = Number(this.manualDiscount) || 0;
      const freight = Number(this.freightCost) || 0;
      const base = subtotal - discount + freight;
      return base > 0 ? base : 0;
    },
    iva16() {
      return this.financeNetBase * 0.16;
    },
    iva10() {
      return this.financeNetBase * 0.1;
    },
    theoreticalIva15() {
      return this.financeNetBase * 0.15;
    },
    financeTotal() {
      const rate = Number(this.appliedIvaRate);
      return this.financeNetBase * (1 + (Number.isNaN(rate) ? 0 : rate));
    },
    isRegisteringPurchase() {
      return Boolean(this.purchaseStore && this.purchaseStore.isLoading);
    },
    canRegisterPurchase() {
      return Boolean(this.selectedPurchaser) && this.hasProductWinners;
    },
    registerPurchaseTooltip() {
      if (!this.selectedPurchaser) {
        return "Primero selecciona un comprador para registrar la compra.";
      }
      if (!this.hasProductWinners) {
        return "La comparación no tiene productos ganadores para comprar.";
      }
      return "Guarda la compra con los productos ganadores de la matriz.";
    },
    /** true cuando GET /purchase-service/quote/{idQuote} devolvió 200 con órdenes. */
    hasRegisteredPurchase() {
      return Boolean(
        this.purchaseStore &&
          Array.isArray(this.purchaseStore.quotePurchases) &&
          this.purchaseStore.quotePurchases.length > 0
      );
    },
    /**
     * Nombre mostrado en el chip de comprador: si la compra ya existe se
     * muestra el comprador registrado; si no, el seleccionado manualmente.
     */
    displayedPurchaserLabel() {
      if (this.hasRegisteredPurchase && this.registeredPurchaserLabel) {
        return this.registeredPurchaserLabel;
      }
      return this.selectedPurchaser && this.selectedPurchaser.comprador
        ? this.selectedPurchaser.comprador
        : "";
    },
    purchaserButtonLabel() {
      if (this.hasRegisteredPurchase) {
        return "Comprador asignado";
      }
      return this.selectedPurchaser
        ? "Cambiar comprador"
        : "Seleccionar comprador";
    },
    purchaserButtonTooltip() {
      if (this.hasRegisteredPurchase) {
        return "La compra ya fue registrada; el comprador asignado no puede modificarse.";
      }
      return "Asignar un comprador a esta comparación";
    },
  },

  watch: {
    value(isOpen) {
      if (isOpen) {
        this.matrixExpanded = false;
        this.selectedPurchaser = null;
        this.manualDiscount = 0;
        this.freightCost = 0;
        this.appliedIvaRate = 0.16;
        this.detailIsLoading = false;
        this.registeredPurchaserIds = [];
        this.registeredPurchaserLabel = "";
        if (this.purchaseStore) {
          this.purchaseStore.resetStatus();
        }
        this.loadRegisteredPurchaseState();
      }
    },
  },

  methods: {
    formatCurrency,
    formatComparisonDate,
    getQuoteValue,
    lineTotal: calculateLineTotal,
    openPurchaserDialog() {
      this.showPurchaserDialog = true;
    },
    /**
     * Antes de renderizar la información consulta si la comparación ya
     * tiene compras registradas (GET /purchase-service/quote/{idQuote}).
     * Solo una respuesta 200 activa los cambios de UI (badge, comprador
     * asignado y botón deshabilitado); cualquier otro código se ignora.
     */
    async loadRegisteredPurchaseState() {
      const idQuote =
        this.comparison && this.comparison.id != null
          ? String(this.comparison.id).trim()
          : "";
      if (!idQuote || !this.purchaseStore) {
        return;
      }

      this.detailIsLoading = true;
      try {
        const response = await this.purchaseStore.fetchPurchasesByQuote(idQuote);
        if (!response || !response.ok) {
          // Status != 200 (p. ej. 400): no se realiza ninguna tarea extra.
          return;
        }
        const orders = Array.isArray(response.results) ? response.results : [];
        if (!orders.length) {
          return;
        }
        this.registeredPurchaserIds = collectPurchaserIds(orders);
        await this.resolveRegisteredPurchaserLabel();
      } finally {
        this.detailIsLoading = false;
      }
    },
    /** Resuelve el nombre de los compradores registrados a partir de sus ids. */
    async resolveRegisteredPurchaserLabel() {
      const ids = this.registeredPurchaserIds;
      if (!ids.length) {
        return;
      }

      let purchasers = [];
      try {
        const response = await purchaserApi.listPurchasers();
        if (response && response.ok) {
          purchasers = response.results || [];
        }
      } catch (error) {
        purchasers = [];
      }

      const purchasersById = {};
      purchasers.forEach((purchaser) => {
        if (purchaser && purchaser.id) {
          purchasersById[purchaser.id] = purchaser;
        }
      });

      const labels = ids.map((id) => {
        const match = purchasersById[id];
        return match && match.comprador ? match.comprador : shortId(id);
      });
      this.registeredPurchaserLabel = labels.filter(Boolean).join(", ");
    },
    onPurchaserConfirmed(purchaser) {
      this.selectedPurchaser = purchaser || null;
    },
    clearSelectedPurchaser() {
      this.selectedPurchaser = null;
    },
    buildPurchasePayload() {
      const payload = {
        // Id de la cotización/comparación asociada a esta compra.
        id_quote:
          this.comparison && this.comparison.id != null
            ? String(this.comparison.id)
            : "",
        purchaserIds: [],
        supplierIds: [],
        products: [],
      };
      if (!this.comparison) {
        return payload;
      }

      if (this.selectedPurchaser && this.selectedPurchaser.id != null) {
        payload.purchaserIds.push(String(this.selectedPurchaser.id));
      }

      const supplierByKey = {};
      (this.comparison.suppliers || []).forEach((supplier) => {
        supplierByKey[supplier.key] = supplier;
      });
      this.winnerSupplierKeys.forEach((winnerKey) => {
        const supplier = supplierByKey[winnerKey];
        const supplierId =
          supplier && supplier.id != null ? String(supplier.id) : "";
        if (supplierId && payload.supplierIds.indexOf(supplierId) === -1) {
          payload.supplierIds.push(supplierId);
        }
      });

      const quotes = this.comparison.quotes || {};
      (this.comparison.products || []).forEach((product) => {
        const winnerKey = this.productWinnersMap[product.id];
        if (!winnerKey) {
          return;
        }
        const unitPrice = getQuoteValue(quotes, winnerKey, product.id);
        if (unitPrice == null) {
          return;
        }
        payload.products.push({
          productName: product.productName,
          quantity: Number(product.quantity) || 0,
          unitPrice: unitPrice,
        });
      });

      return payload;
    },
    async onRegisterPurchase() {
      if (!this.selectedPurchaser) {
        this.$q.notify({
          type: "warning",
          message: "Selecciona un comprador antes de registrar la compra.",
        });
        return;
      }
      if (!this.hasProductWinners) {
        this.$q.notify({
          type: "warning",
          message:
            "No hay productos ganadores en la matriz de cotización para registrar la compra.",
        });
        return;
      }

      await this.purchaseStore.registerPurchase(this.buildPurchasePayload());
    },
    closePurchaseModal() {
      this.purchaseStore.resetStatus();
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
      if (
        summary.differenceFromBest != null &&
        summary.differenceFromBest > 0 &&
        !summary.isBestPrice
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
      const total =
        summary && summary.productsWon > 0
          ? summary.selectedTotal || 0
          : summary.total || 0;
      const width = Math.min(100, (total / this.maxSupplierTotal) * 100);
      return `${width}%`;
    },
    isWinnerForProduct(supplierKey, productId) {
      return this.productWinnersMap[productId] === supplierKey;
    },
    getWinnerSupplierName(productId) {
      const winnerKey = this.productWinnersMap[productId];
      if (!winnerKey) {
        return "";
      }
      const supplier = (this.comparison.suppliers || []).find(
        (item) => item.key === winnerKey
      );
      return supplier ? supplier.name : "";
    },
    getSupplierWinCount(supplierKey) {
      return this.productWinCounts[supplierKey] || 0;
    },
    getSupplierTotal(supplierKey) {
      if (!this.comparison) {
        return 0;
      }
      const summaries = buildSupplierSummaries(
        this.comparison.products,
        this.comparison.suppliers,
        this.comparison.quotes
      );
      const match = summaries.find((item) => item.key === supplierKey);
      return match ? match.total : 0;
    },
  },
};

/** Ids de comprador únicos a partir de las órdenes devueltas por el backend. */
function collectPurchaserIds(orders) {
  const uniqueIds = [];
  orders.forEach((order) => {
    const ids =
      order && Array.isArray(order.purchaserIds) ? order.purchaserIds : [];
    ids.forEach((id) => {
      const cleanId = id != null ? String(id).trim() : "";
      if (cleanId && uniqueIds.indexOf(cleanId) === -1) {
        uniqueIds.push(cleanId);
      }
    });
  });
  return uniqueIds;
}
</script>

<style scoped>
.detail-dialog {
  width: 95vw;
  max-width: 1400px;
  max-height: 94vh;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.detail-dialog > .z-zone--hero,
.detail-dialog > .z-zone--metrics,
.detail-dialog > .q-separator,
.detail-dialog > .z-zone--footer {
  flex-shrink: 0;
}

.detail-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 18px 20px 20px;
}

/* Z₁ — Identidad (izq) → Resultado (der) */
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

/* Contenedor de la card de ganador + badge de compra registrada */
.z-winner-wrap {
  position: relative;
  display: inline-flex;
  width: 90%;
}

.z-winner-wrap .z-winner {
  width: 100%;
}

.z-purchase-badge {
  position: absolute;
  top: -11px;
  right: -10px;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 999px;
  background: #16a34a;
  color: #fff;
  font-size: 0.66rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  box-shadow: 0 8px 18px rgba(22, 163, 74, 0.35);
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

/* Chips de contexto — entre Z₂ y Z₃ */
.z-zone--chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.z-chip {
  font-size: 0.78rem;
}

.z-chip--purchaser {
  font-weight: 700;
}

/* Z₃ — Ranking principal */
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

.z-rank__totals {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  text-align: right;
}

.z-rank__selected {
  font-size: 0.95rem;
  font-weight: 800;
  color: #92400e;
  white-space: nowrap;
}

.z-rank__total {
  font-size: 0.74rem;
  font-weight: 600;
  color: #64748b;
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

/* Z₄ — Matriz colapsable */
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

.is-winner-cell {
  background: rgba(254, 243, 199, 0.55);
}

.winner-col {
  min-width: 150px;
}

.winner-col__name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #92400e;
}

.quote-cell {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.quote-cell__icon {
  flex-shrink: 0;
}

.totals-row {
  background: #f8fafc;
}

.totals-row--wins {
  background: #fff;
  font-size: 0.82rem;
  color: #64748b;
}

/* Resumen financiero */
.z-zone--finance {
  display: block;
}

.finance-card {
  border-radius: 10px;
  border-color: #e2e8f0;
}

.finance-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
}

.finance-body {
  padding: 14px 16px 16px;
}

.finance-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.finance-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.finance-row__label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  font-weight: 700;
}

.finance-row__value {
  font-size: 0.88rem;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
}

.finance-inputs {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.finance-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #eef2ff 0%, #ecfdf5 100%);
  border: 1px solid #d1d5db;
}

.finance-total span {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #475569;
  font-weight: 700;
}

.finance-total strong {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

/* Z₅ — Pie */
.z-zone--footer {
  padding: 12px 20px;
  background: #f8fafc;
}

.z-footer__meta {
  font-size: 0.76rem;
  color: #94a3b8;
  line-height: 1.4;
}

.z-footer__meta-sep {
  margin: 0 4px;
}

@media (max-width: 760px) {
  .z-zone--hero {
    grid-template-columns: 1fr;
    padding-right: 48px;
  }

  .z-hero__end {
    justify-self: stretch;
  }

  .detail-dialog {
    width: 100vw;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  .detail-content {
    flex-basis: auto;
  }

  .z-winner-wrap {
    width: 100%;
  }

  .z-zone--metrics {
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
.supplier-comparison-detail-dialog {
  width: 95vw;
  max-width: 1400px;
}

@media (max-width: 760px) {
  .supplier-comparison-detail-dialog {
    width: 100vw;
    max-width: 100vw;
  }
}
</style>
