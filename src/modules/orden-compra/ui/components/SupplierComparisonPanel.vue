<template>
  <div class="supplier-comparison-panel">
    <q-card class="comparison-card shadow-lg">
      <q-card-section class="header-gradient text-white q-pa-lg">
        <div class="header-toolbar">
          <div>
            <div class="text-h5 text-weight-bold text-white">
              Comparación de proveedores
            </div>
            <div class="text-caption opacity-80 q-mt-xs">
              Seleccione una solicitud del plan, asigne proveedores y compare
              precios por producto para determinar el ganador.
            </div>
          </div>
          <q-btn flat no-caps color="white" icon="delete_sweep" label="Limpiar comparaciones guardadas"
            class="header-action-btn" :loading="clearingComparisons" @click="confirmClearAllComparisons" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <SupplyPlanRequestSelector :value="selectedRequest" @input="onRequestSelected" @selected="onRequestSelected"
          @cleared="onRequestCleared" />

        <div v-if="selectedRequest" class="comparison-workspace q-mt-lg">
          <div class="section-block">
            <div class="section-title">
              Lista de productos y servicios de la orden
            </div>
            <p v-if="products.length" class="section-help">
              {{ products.length }} ítem(s) cargados desde la solicitud y la
              orden de suministro vinculada.
            </p>
            <q-table flat bordered :data="products" :columns="productColumns" row-key="id" :loading="loadingProducts"
              :pagination="{ rowsPerPage: 8 }" :no-data-label="productsNoDataLabel" class="products-table">
              <template v-slot:body-cell-referenceUnitPrice="props">
                <q-td :props="props" class="text-right">
                  {{ formatCurrency(props.row.referenceUnitPrice) }}
                </q-td>
              </template>
              <template v-slot:body-cell-lineReferenceTotal="props">
                <q-td :props="props" class="text-right text-weight-medium">
                  {{
                    formatCurrency(
                      lineTotal(
                        props.row.quantity,
                        props.row.referenceUnitPrice
                      )
                    )
                  }}
                </q-td>
              </template>
            </q-table>
          </div>

          <div class="section-block q-mt-lg">
            <div class="section-header row items-center">
              <div class="section-title q-mb-none">
                Proveedores en comparación
              </div>
              <q-space />
              <q-btn unelevated no-caps color="primary" icon="add_business" label="Agregar proveedor"
                @click="openSupplierDialog" />
            </div>

            <div v-if="!suppliers.length" class="empty-suppliers q-mt-md">
              Agregue al menos dos proveedores para iniciar la comparación.
            </div>

            <div v-else class="supplier-chip-row q-mt-md">
              <q-chip v-for="supplier in suppliers" :key="supplier.key" removable color="primary" text-color="white"
                icon="store" @remove="removeSupplier(supplier.key)">
                {{ supplier.name }}
                <span v-if="supplier.nit" class="q-ml-xs">({{ supplier.nit }})</span>
              </q-chip>
            </div>
          </div>

          <div v-if="products.length && suppliers.length" class="section-block q-mt-lg">
            <div class="section-title">Matriz de cotización por proveedor</div>
            <p class="section-help">
              Compare cada cotización de proveedor contra el precio registrado en
              la orden. Ingrese el precio unitario cotizado por proveedor; los
              totales se calculan al completar los valores.
            </p>
            <div class="quote-matrix q-mt-sm">
              <q-markup-table flat bordered dense class="quote-table">
                <thead>
                  <tr>
                    <th class="text-left sticky-col">Producto</th>
                    <th class="text-right">Cant.</th>
                    <th class="text-left">Unidad</th>
                    <th class="text-center order-price-col">
                      Precio en orden
                    </th>
                    <th v-for="supplier in suppliers" :key="`head-${supplier.key}`" class="text-center supplier-col">
                      <div class="supplier-col-header">
                        <span>{{ supplier.name }}</span>
                        <q-btn flat dense round size="sm" icon="content_copy" color="grey-7"
                          @click="fillReferencePrices(supplier.key)">
                          <q-tooltip>
                            Copiar precios de la orden en esta columna
                          </q-tooltip>
                        </q-btn>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td class="sticky-col">
                      <div class="text-weight-medium">
                        {{ product.productName }}
                      </div>
                      <div v-if="product.planName" class="text-caption text-grey-6">
                        {{ product.planName }}
                      </div>
                    </td>
                    <td class="text-right">{{ product.quantity }}</td>
                    <td>{{ product.unit }}</td>
                    <td class="order-price-col text-center">
                      <div class="order-price-value">
                        {{ formatCurrency(product.referenceUnitPrice) }}
                      </div>
                      <div class="text-caption text-grey-7 q-mt-xs">
                        Subtotal:
                        {{
                          formatCurrency(
                            lineTotal(
                              product.quantity,
                              product.referenceUnitPrice
                            )
                          )
                        }}
                      </div>
                    </td>
                    <td v-for="supplier in suppliers" :key="`${supplier.key}-${product.id}`" class="supplier-col"
                      :class="{
                        'is-winner-cell': isProductWinner(supplier.key, product.id),
                        'is-winner-selectable':
                          winnerSelectionMode === 'manual' &&
                          canSelectProductWinner(supplier.key, product.id),
                      }" @click="selectProductWinner(product.id, supplier.key)">
                      <q-input :value="getQuoteInputValue(supplier.key, product.id)" outlined dense type="number"
                        min="0" step="1" prefix="$" placeholder="0" class="quote-input"
                        @input="setQuote(supplier.key, product.id, $event)" @click.native.stop />
                      <div class="text-caption text-right q-mt-xs" :class="quoteDiffClass(supplier.key, product)">
                        Subtotal:
                        {{
                          formatCurrency(
                            lineTotal(
                              product.quantity,
                              getQuoteInputValue(supplier.key, product.id)
                            )
                          )
                        }}
                        <span v-if="hasQuoteDiff(supplier.key, product)" class="q-ml-xs">
                          ({{ quoteDiffLabel(supplier.key, product) }})
                        </span>
                      </div>
                      <div v-if="isProductWinner(supplier.key, product.id)" class="product-winner-badge">
                        <q-icon name="emoji_events" size="14px" color="amber-9" />
                        Ganador
                      </div>
                      <div v-else-if="
                        winnerSelectionMode === 'manual' &&
                        canSelectProductWinner(supplier.key, product.id)
                      " class="product-winner-hint text-caption text-grey-6">
                        Clic para elegir
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="totals-row">
                    <td colspan="3" class="text-right text-weight-bold">
                      Total por proveedor
                    </td>
                    <td class="text-center text-weight-bold order-price-col">
                      {{ formatCurrency(orderReferenceTotal) }}
                    </td>
                    <td v-for="supplier in suppliers" :key="`total-${supplier.key}`"
                      class="text-center text-weight-bold">
                      {{ formatCurrency(getSupplierTotal(supplier.key)) }}
                    </td>
                  </tr>
                </tfoot>
              </q-markup-table>
            </div>
          </div>

          <div v-if="comparison.supplierSummaries.length" class="section-block q-mt-lg">
            <div class="section-title">Resultado de la comparación</div>
            <div class="comparison-grid q-mt-sm">
              <div v-for="summary in comparison.supplierSummaries" :key="`summary-${summary.key}`"
                class="comparison-card-item" :class="{
                  'is-best': summary.isBestPrice && summary.productsWon === 0,
                  'is-winner': summary.productsWon > 0,
                }">
                <div class="comparison-card-item__header">
                  <q-icon name="store" size="18px" />
                  <span class="text-weight-bold">{{ summary.name }}</span>
                </div>
                <div class="comparison-card-item__total">
                  <template v-if="summary.productsWon > 0">
                    {{ formatCurrency(summary.selectedTotal) }}
                  </template>
                  <template v-else>
                    {{ formatCurrency(summary.total) }}
                  </template>
                </div>
                <div v-if="summary.productsWon > 0" class="comparison-card-item__subtotal text-caption text-grey-7">
                  {{ summary.productsWon }}
                  producto(s) seleccionado(s)
                </div>
                <div class="comparison-card-item__meta">
                  <q-badge v-if="summary.productsWon > 0" color="primary" :label="summary.productsWon === 1
                      ? '1 producto ganado'
                      : `${summary.productsWon} productos ganados`
                    " />
                  <q-badge v-if="summary.isBestPrice" color="positive" label="Mejor precio total" class="q-ml-xs" />
                </div>
                <div v-if="
                  summary.differenceFromBest != null && !summary.isBestPrice
                " class="comparison-card-item__diff text-negative">
                  +{{ formatCurrency(summary.differenceFromBest) }}
                  <span v-if="summary.differencePercent != null">
                    ({{ summary.differencePercent.toFixed(1) }}%)
                  </span>
                  vs mejor precio
                </div>
                <div v-else-if="summary.isBestPrice" class="comparison-card-item__diff text-positive">
                  Mejor oferta del plan
                </div>
                <div v-if="summary.missingQuotes" class="comparison-card-item__warning text-warning">
                  Faltan {{ summary.missingQuotes }} precio(s) por completar
                </div>
              </div>
            </div>
          </div>

          <div v-if="comparison.supplierSummaries.length" class="section-block q-mt-lg">
            <div class="section-title">Ganadores por producto</div>
            <p class="section-help">
              Debe elegir un proveedor ganador para cada producto. Puede asignar
              un solo proveedor para toda la orden o combinar varios según la
              comparación.
            </p>
            <q-option-group v-model="winnerSelectionMode" :options="winnerSelectionModeOptions" color="primary" inline
              class="q-mb-md" @input="onWinnerSelectionModeChange" />
            <p v-if="winnerSelectionMode === 'manual'" class="section-help text-deep-orange-9">
              Haga clic en la celda cotizada de cada producto para marcar al
              proveedor ganador.
            </p>
          </div>

          <q-banner v-if="selectionSummary" rounded class="winner-banner q-mt-lg" :class="winnerBannerClass">
            <template v-slot:avatar>
              <q-icon name="emoji_events" color="amber-9" size="28px" />
            </template>
            <div class="text-weight-bold">
              {{
                selectionSummary.hasMixedWinners
                  ? "Selección combinada"
                  : "Proveedor seleccionado"
              }}:
              {{ selectionSummary.title }}
            </div>
            <div class="text-caption">
              Total de la selección:
              {{ formatCurrency(selectionSummary.total) }}
              <span v-if="selectionSummary.hasMixedWinners">
                · {{ selectionSummary.supplierCount }} proveedores en esta
                orden.
              </span>
              <span v-else-if="winnerSelectionMode === 'auto'">
                · Mejor precio automático por producto.
              </span>
              <span v-else>
                · Selección manual por producto.
              </span>
            </div>
          </q-banner>

          <div class="actions-row q-mt-lg">
            <q-btn flat no-caps color="grey-7" icon="restart_alt" label="Reiniciar comparación"
              @click="resetComparison" />
            <q-btn flat no-caps color="grey-7" icon="note_add" label="Nueva comparación" @click="startNewComparison" />
            <q-space />
            <q-btn unelevated no-caps color="primary" icon="check_circle" label="Confirmar selección de proveedores"
              :disable="!canConfirmSelection || savingComparison" :loading="savingComparison" @click="confirmWinner" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="showSupplierDialog" transition-show="scale" transition-hide="scale">
      <q-card class="supplier-dialog">
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar icon="store" color="primary" text-color="white" />
          <div class="text-h6 q-ml-md">Agregar proveedor a la comparación</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-12 col-md-6">
              <q-input v-model="supplierSearch.nit" outlined dense clearable debounce="300"
                placeholder="Buscar por NIT..." @input="searchSuppliers" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="supplierSearch.name" outlined dense clearable debounce="300"
                placeholder="Buscar por nombre..." @input="searchSuppliers" />
            </div>
          </div>

          <q-inner-loading :showing="loadingSuppliers">
            <q-spinner-dots size="32px" color="primary" />
          </q-inner-loading>

          <div v-if="!loadingSuppliers && supplierLoadError" class="supplier-load-error q-py-lg text-center"
            role="alert">
            <q-icon name="sentiment_dissatisfied" size="40px" color="orange-8" />
            <div class="supplier-load-error__title q-mt-sm">
              No pudimos cargar los proveedores
            </div>
            <div class="text-grey-7 q-mt-xs">
              {{ supplierLoadError }}
            </div>
            <q-btn unelevated no-caps color="primary" icon="refresh" label="Reintentar" class="q-mt-md"
              @click="loadTerceros" />
          </div>

          <q-list v-else-if="!loadingSuppliers && supplierResults.length" bordered separator class="supplier-results">
            <q-item v-for="supplier in supplierResults" :key="supplier.id ||
              supplier.identificacion ||
              supplier.nit ||
              supplier.razonSocial
              " clickable @click="addSupplier(supplier)">
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  {{
                    supplier.razonSocial ||
                    supplier.name ||
                    supplier.supplier ||
                    "Sin nombre"
                  }}
                </q-item-label>
                <q-item-label caption>
                  Identificación:
                  {{ supplier.identificacion || supplier.nit || "—" }}
                </q-item-label>
                <q-item-label v-if="supplier.tipoTercero" class="q-mt-xs">
                  <span class="tipo-tercero-badge">{{
                    supplier.tipoTercero
                  }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat dense no-caps color="primary" label="Agregar" />
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else-if="!loadingSuppliers" class="empty-supplier-search q-py-lg text-center">
            <q-icon name="search_off" size="40px" color="grey-5" />
            <div class="text-grey-7 q-mt-sm">
              No se encontraron proveedores con esos criterios.
            </div>
            <q-btn unelevated no-caps color="primary" icon="person_add" label="Crear nuevo proveedor" class="q-mt-md"
              @click="openCreateSupplierDialog" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="between" class="q-pa-md">
          <q-btn flat no-caps color="primary" icon="person_add" label="Crear proveedor"
            @click="openCreateSupplierDialog" />
          <q-btn flat no-caps label="Cerrar" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <SupplierQuickCreateDialog v-model="showCreateSupplierDialog" :initial-nit="supplierSearch.nit"
      :initial-name="supplierSearch.name" @created="onSupplierCreated" />
  </div>
</template>

<script>
import axios from "axios";
import { getRawToken } from "src/utils/authHelper";
import { URL_API } from "src/utils/config";
import { SolicitudHttpRepository } from "../../../solicitud-abastecimiento/infrastructure/SolicitudHttpRepository";
import { supplierComparisonStorageApi } from "../../infrastructure/SupplierComparisonStorageApi";
import { supplyOrderApi } from "../../infrastructure/SupplyOrderApi";
import {
  enrichRequestWithOrderLineItems,
  ensureSolicitudLineItems,
} from "../../utils/supplyOrderLinkage";
import { formatCurrency } from "../utils/purchaseOrderFinance";
import {
  buildComparisonPayload,
  buildComparisonResult,
  buildSupplierSummaries,
  calculateLineTotal,
  createSupplierEntry,
  extractComparisonProducts,
  getQuoteValue,
} from "../utils/supplierComparison";
import SupplierQuickCreateDialog from "./SupplierQuickCreateDialog.vue";
import SupplyPlanRequestSelector from "./SupplyPlanRequestSelector.vue";

export default {
  name: "SupplierComparisonPanel",

  components: {
    SupplyPlanRequestSelector,
    SupplierQuickCreateDialog,
  },

  data() {
    return {
      selectedRequest: null,
      products: [],
      suppliers: [],
      quotes: {},
      winnerSelectionMode: "auto",
      productWinners: {},
      showSupplierDialog: false,
      showCreateSupplierDialog: false,
      supplierSearch: { nit: "", name: "" },
      allTerceros: [],
      supplierResults: [],
      supplierLoadError: null,
      loadingSuppliers: false,
      loadingProducts: false,
      savingComparison: false,
      clearingComparisons: false,
      productColumns: [
        {
          name: "productName",
          label: "Producto",
          field: "productName",
          align: "left",
        },
        { name: "planName", label: "Plan", field: "planName", align: "left" },
        {
          name: "quantity",
          label: "Cantidad",
          field: "quantity",
          align: "right",
        },
        { name: "unit", label: "Unidad", field: "unit", align: "left" },
        {
          name: "referenceUnitPrice",
          label: "Precio en orden",
          field: "referenceUnitPrice",
          align: "right",
        },
        {
          name: "lineReferenceTotal",
          label: "Subtotal orden",
          field: "lineReferenceTotal",
          align: "right",
        },
      ],
      winnerSelectionModeOptions: [
        { label: "Mejor precio por producto (automático)", value: "auto" },
        { label: "Elegir ganador por producto (manual)", value: "manual" },
      ],
    };
  },

  computed: {
    comparison() {
      return buildComparisonResult({
        products: this.products,
        suppliers: this.suppliers,
        quotes: this.quotes,
        productWinners:
          this.winnerSelectionMode === "manual" ? this.productWinners : null,
        winnerSelectionMode: this.winnerSelectionMode,
      });
    },
    canConfirmSelection() {
      return (
        this.comparison.hasAllProductWinners &&
        this.comparison.hasComparableSuppliers
      );
    },
    selectionSummary() {
      if (!this.comparison.hasAllProductWinners) {
        return null;
      }

      const winnerKeys = [
        ...new Set(
          Object.values(this.comparison.productWinners || {}).filter(Boolean)
        ),
      ];

      if (!winnerKeys.length) {
        return null;
      }

      const suppliers = this.suppliers.filter((supplier) =>
        winnerKeys.includes(supplier.key)
      );
      const title =
        winnerKeys.length === 1
          ? suppliers[0]
            ? suppliers[0].name
            : winnerKeys[0]
          : `${winnerKeys.length} proveedores`;

      return {
        title,
        total: this.comparison.optimalTotal,
        hasMixedWinners: winnerKeys.length > 1,
        supplierCount: winnerKeys.length,
      };
    },
    winnerBannerClass() {
      if (!this.selectionSummary) {
        return "";
      }
      return this.winnerSelectionMode === "manual"
        ? "winner-banner--manual"
        : "winner-banner--auto";
    },
    orderReferenceTotal() {
      return (this.products || []).reduce(
        (total, product) =>
          total +
          calculateLineTotal(product.quantity, product.referenceUnitPrice),
        0
      );
    },
    productsNoDataLabel() {
      if (this.loadingProducts) {
        return "Cargando productos de la orden...";
      }
      if (
        this.selectedRequest &&
        (this.selectedRequest.supplyOrderId ||
          this.selectedRequest._resolvedSupplyOrderId)
      ) {
        return "La orden de suministro vinculada no tiene productos registrados.";
      }
      return "La solicitud no tiene productos o servicios registrados para comparar.";
    },
  },

  methods: {
    formatCurrency,
    lineTotal: calculateLineTotal,
    async onRequestSelected(request) {
      this.loadingProducts = true;
      this.resetComparisonState(false);

      try {
        const solicitudRepository = new SolicitudHttpRepository();
        const requestWithItems = await ensureSolicitudLineItems(
          request,
          solicitudRepository,
          { forceRefresh: true }
        );
        const enrichedRequest = await enrichRequestWithOrderLineItems(
          requestWithItems,
          supplyOrderApi
        );
        this.selectedRequest = enrichedRequest;
        this.products = extractComparisonProducts(enrichedRequest);

        if (!this.products.length) {
          this.$q.notify({
            type: "warning",
            message:
              "La orden seleccionada no tiene productos o servicios registrados en su lista. Verifique los ítems en Datos financieros de la solicitud o en el detalle de la orden de suministro.",
          });
        }
      } catch (error) {
        this.selectedRequest = request;
        this.products = extractComparisonProducts(request);
        this.$q.notify({
          type: "negative",
          message:
            (error && error.message) ||
            "No se pudieron cargar los productos de la orden.",
        });
      } finally {
        this.loadingProducts = false;
      }
    },
    onRequestCleared() {
      this.selectedRequest = null;
      this.products = [];
      this.resetComparisonState(true);
    },
    resetComparisonState(clearProducts) {
      this.suppliers = [];
      this.quotes = {};
      this.winnerSelectionMode = "auto";
      this.productWinners = {};
      if (clearProducts) {
        this.products = [];
      }
    },
    resetComparison() {
      this.suppliers = [];
      this.quotes = {};
      this.winnerSelectionMode = "auto";
      this.productWinners = {};
    },
    clearFormForNewComparison() {
      this.selectedRequest = null;
      this.products = [];
      this.suppliers = [];
      this.quotes = {};
      this.winnerSelectionMode = "auto";
      this.productWinners = {};
      this.showSupplierDialog = false;
      this.showCreateSupplierDialog = false;
      this.supplierSearch = { nit: "", name: "" };
      this.allTerceros = [];
      this.supplierResults = [];
      this.supplierLoadError = null;
      this.loadingProducts = false;
      supplyOrderApi.clearApprovedOrdersCache();
      this.$emit("form-cleared");
    },
    startNewComparison() {
      this.clearFormForNewComparison();
      if (this.$q) {
        this.$q.notify({
          type: "info",
          message: "Formulario limpio. Seleccione una orden para iniciar una nueva comparación.",
          timeout: 2500,
        });
      }
    },
    confirmClearAllComparisons() {
      if (!this.$q) {
        this.clearAllSavedComparisons();
        return;
      }

      this.$q
        .dialog({
          title: "Limpiar comparaciones guardadas",
          message:
            "Se eliminarán todas las comparaciones de proveedores almacenadas en este navegador. Esta acción no se puede deshacer.",
          cancel: {
            label: "Cancelar",
            flat: true,
            color: "grey-7",
          },
          ok: {
            label: "Eliminar todas",
            color: "negative",
            unelevated: true,
          },
          persistent: true,
        })
        .onOk(() => {
          this.clearAllSavedComparisons();
        });
    },
    async clearAllSavedComparisons() {
      this.clearingComparisons = true;
      try {
        await supplierComparisonStorageApi.clearAllComparisons();
        this.$emit("comparisons-cleared");
        if (this.$q) {
          this.$q.notify({
            type: "positive",
            message: "Todas las comparaciones guardadas fueron eliminadas.",
          });
        }
      } catch (error) {
        if (this.$q) {
          this.$q.notify({
            type: "negative",
            message:
              (error && error.message) ||
              "No fue posible limpiar las comparaciones guardadas.",
          });
        }
      } finally {
        this.clearingComparisons = false;
      }
    },
    openSupplierDialog() {
      this.showSupplierDialog = true;
      this.supplierLoadError = null;
      this.loadTerceros();
    },
    openCreateSupplierDialog() {
      this.showCreateSupplierDialog = true;
    },
    onSupplierCreated(supplier) {
      this.addSupplier(supplier, { keepSearchDialogOpen: false });
      this.loadTerceros();
    },
    async loadTerceros() {
      this.loadingSuppliers = true;
      this.supplierLoadError = null;

      try {
        var token = getRawToken();
        var headers = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = "Bearer " + token;
        }

        var response = await axios.get(URL_API + "/api/v1/terceros/", {
          headers: headers,
        });

        if (response.status === 200) {
          var body = response.data || {};
          var results = body.results;
          if (!Array.isArray(results)) {
            results = [];
          }
          this.allTerceros = results;
          this.applySupplierFilter();
        }
      } catch (error) {
        this.allTerceros = [];
        this.supplierResults = [];

        var status =
          error && error.response ? error.response.status : null;

        if (status === 400) {
          this.supplierLoadError =
            "Se presentó un inconveniente al obtener la lista de proveedores. No es tu culpa: puedes reintentar en unos segundos o continuar más tarde.";
          this.$q.notify({
            type: "warning",
            message: this.supplierLoadError,
            timeout: 4500,
          });
        } else {
          var fallback =
            (error && error.message) ||
            "No pudimos conectar con el servicio de proveedores. Revisa tu conexión e intenta de nuevo.";
          this.supplierLoadError = fallback;
          this.$q.notify({
            type: "negative",
            message: fallback,
          });
        }
      } finally {
        this.loadingSuppliers = false;
      }
    },
    applySupplierFilter() {
      var list = this.allTerceros || [];
      var nitQuery = (this.supplierSearch.nit || "").trim().toLowerCase();
      var nameQuery = (this.supplierSearch.name || "").trim().toLowerCase();

      if (nitQuery) {
        list = list.filter(function (item) {
          var identificacion = String(
            item.identificacion || item.nit || ""
          ).toLowerCase();
          return identificacion.indexOf(nitQuery) !== -1;
        });
      }

      if (nameQuery) {
        list = list.filter(function (item) {
          var razon = String(item.razonSocial || "").toLowerCase();
          var comercial = String(item.nombreComercial || "").toLowerCase();
          var name = String(item.name || item.supplier || "").toLowerCase();
          return (
            razon.indexOf(nameQuery) !== -1 ||
            comercial.indexOf(nameQuery) !== -1 ||
            name.indexOf(nameQuery) !== -1
          );
        });
      }

      this.supplierResults = list;
    },
    searchSuppliers() {
      if (this.supplierLoadError) {
        return;
      }
      if (!this.allTerceros.length && !this.loadingSuppliers) {
        this.loadTerceros();
        return;
      }
      this.applySupplierFilter();
    },
    addSupplier(supplier, options = {}) {
      const { keepSearchDialogOpen = false } = options;
      const entry = createSupplierEntry(supplier);
      if (this.suppliers.some((item) => item.key === entry.key)) {
        this.$q.notify({
          type: "warning",
          message: "Este proveedor ya está en la comparación.",
        });
        return;
      }

      this.suppliers.push(entry);
      this.$set(this.quotes, entry.key, {});
      this.products.forEach((product) => {
        this.$set(this.quotes[entry.key], product.id, "");
      });

      if (!keepSearchDialogOpen) {
        this.showSupplierDialog = false;
      }
    },
    fillReferencePrices(supplierKey) {
      if (!this.quotes[supplierKey]) {
        this.$set(this.quotes, supplierKey, {});
      }
      this.products.forEach((product) => {
        const reference = product.referenceUnitPrice;
        this.$set(
          this.quotes[supplierKey],
          product.id,
          reference > 0 ? reference : ""
        );
      });
    },
    hasQuoteDiff(supplierKey, product) {
      const quote = getQuoteValue(this.quotes, supplierKey, product.id);
      const orderPrice = Number(product.referenceUnitPrice) || 0;
      return quote != null && orderPrice > 0 && quote !== orderPrice;
    },
    quoteDiffClass(supplierKey, product) {
      const quote = getQuoteValue(this.quotes, supplierKey, product.id);
      const orderPrice = Number(product.referenceUnitPrice) || 0;
      if (quote == null || orderPrice <= 0) {
        return "text-grey-7";
      }
      if (quote < orderPrice) {
        return "text-positive";
      }
      if (quote > orderPrice) {
        return "text-negative";
      }
      return "text-grey-7";
    },
    quoteDiffLabel(supplierKey, product) {
      const quote = getQuoteValue(this.quotes, supplierKey, product.id);
      const orderPrice = Number(product.referenceUnitPrice) || 0;
      if (quote == null || orderPrice <= 0) {
        return "";
      }
      const diff = quote - orderPrice;
      if (diff === 0) {
        return "igual a la orden";
      }
      const prefix = diff > 0 ? "+" : "";
      return `${prefix}${this.formatCurrency(diff)} vs orden`;
    },
    removeSupplier(supplierKey) {
      this.suppliers = this.suppliers.filter(
        (item) => item.key !== supplierKey
      );
      this.$delete(this.quotes, supplierKey);
      Object.keys(this.productWinners).forEach((productId) => {
        if (this.productWinners[productId] === supplierKey) {
          this.$delete(this.productWinners, productId);
        }
      });
    },
    getQuoteInputValue(supplierKey, productId) {
      const value = getQuoteValue(this.quotes, supplierKey, productId);
      return value == null ? "" : value;
    },
    setQuote(supplierKey, productId, value) {
      if (!this.quotes[supplierKey]) {
        this.$set(this.quotes, supplierKey, {});
      }
      this.$set(this.quotes[supplierKey], productId, value);
      if (
        this.winnerSelectionMode === "manual" &&
        this.productWinners[productId] === supplierKey &&
        getQuoteValue(this.quotes, supplierKey, productId) == null
      ) {
        this.$delete(this.productWinners, productId);
      }
    },
    getSupplierTotal(supplierKey) {
      const summaries = buildSupplierSummaries(
        this.products,
        this.suppliers,
        this.quotes
      );
      const match = summaries.find((item) => item.key === supplierKey);
      return match ? match.total : 0;
    },
    onWinnerSelectionModeChange(mode) {
      if (mode === "auto") {
        this.productWinners = {};
        return;
      }
      this.productWinners = {
        ...(this.comparison.productWinners || {}),
      };
    },
    isProductWinner(supplierKey, productId) {
      return this.comparison.productWinners[productId] === supplierKey;
    },
    canSelectProductWinner(supplierKey, productId) {
      return getQuoteValue(this.quotes, supplierKey, productId) != null;
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
    async confirmWinner() {
      if (!this.canConfirmSelection || this.savingComparison) {
        return;
      }

      const payload = buildComparisonPayload({
        request: this.selectedRequest,
        products: this.products,
        suppliers: this.suppliers,
        quotes: this.quotes,
        comparison: this.comparison,
      });

      this.savingComparison = true;
      try {
        const saved = await supplierComparisonStorageApi.createComparison(payload);

        if (this.$q) {
          this.$q.notify({
            type: "positive",
            message: `Comparación ${saved.code} registrada. ${this.selectionSummary.title}`,
            timeout: 3500,
          });
        }

        this.$emit("comparison-confirmed", saved);
        this.clearFormForNewComparison();
      } catch (error) {
        if (this.$q) {
          this.$q.notify({
            type: "negative",
            message:
              (error && error.message) ||
              "No fue posible registrar la comparación de proveedores.",
          });
        }
      } finally {
        this.savingComparison = false;
      }
    },
  },
};
</script>

<style scoped>
.supplier-comparison-panel {
  width: 100%;
}

.comparison-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}

.header-toolbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.header-action-btn {
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 8px;
}

.section-block {
  width: 100%;
}

.section-header {
  gap: 12px;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.section-help {
  margin: 0 0 10px;
  font-size: 0.85rem;
  color: #64748b;
}

.empty-suppliers {
  padding: 14px 16px;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
}

.supplier-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quote-matrix {
  overflow: auto;
}

.quote-table {
  min-width: 760px;
  background: #fff;
}

.sticky-col {
  min-width: 220px;
}

.order-price-col {
  min-width: 130px;
  vertical-align: top;
  background: rgba(59, 130, 246, 0.04);
}

.order-price-value {
  font-weight: 700;
  color: #1e3a8a;
}

.supplier-col {
  min-width: 170px;
  vertical-align: top;
}

.supplier-col-header {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
}

.empty-supplier-search {
  padding: 8px 12px;
}

.quote-input ::v-deep .q-field__control {
  min-height: 36px;
}

.is-winner-cell {
  background: rgba(254, 243, 199, 0.55);
}

.is-winner-selectable {
  cursor: pointer;
}

.is-winner-selectable:hover {
  background: rgba(254, 243, 199, 0.25);
}

.product-winner-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #92400e;
}

.product-winner-hint {
  margin-top: 4px;
}

.totals-row {
  background: #f8fafc;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.comparison-card-item {
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
}

.comparison-card-item.is-best {
  border-color: rgba(34, 197, 94, 0.45);
  background: rgba(34, 197, 94, 0.06);
}

.comparison-card-item.is-preferred {
  box-shadow: inset 0 0 0 1px rgba(249, 115, 22, 0.35);
}

.comparison-card-item.is-winner {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.35);
}

.comparison-card-item__header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.comparison-card-item__total {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}

.comparison-card-item__meta {
  margin-top: 8px;
}

.comparison-card-item__diff,
.comparison-card-item__warning {
  margin-top: 8px;
  font-size: 0.8rem;
}

.preferred-select {
  max-width: 420px;
}

.winner-banner {
  background: linear-gradient(90deg,
      rgba(254, 243, 199, 0.95) 0%,
      rgba(253, 230, 138, 0.95) 100%);
  color: #78350f;
}

.winner-banner--manual {
  background: linear-gradient(90deg,
      rgba(255, 237, 213, 0.95) 0%,
      rgba(254, 215, 170, 0.95) 100%);
}

.actions-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.supplier-dialog {
  width: min(760px, 95vw);
  border-radius: 12px;
}

.supplier-results {
  max-height: 360px;
  overflow: auto;
}

.tipo-tercero-badge {
  display: inline-block;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1.4;
  color: #fff;
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 45%, #4e9c4c 100%);
  box-shadow: 0 1px 2px rgba(78, 156, 76, 0.2);
  text-transform: uppercase;
}

.supplier-load-error {
  border: 1px dashed rgba(245, 158, 11, 0.45);
  border-radius: 12px;
  background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
  padding: 24px 16px;
}

.supplier-load-error__title {
  font-size: 1rem;
  font-weight: 700;
  color: #92400e;
}

.products-table ::v-deep th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
}
</style>
