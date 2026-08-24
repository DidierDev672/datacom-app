<template>
  <q-dialog
    :value="value"
    transition-show="scale"
    transition-hide="scale"
    content-class="purchaser-selection-dialog"
    @input="$emit('input', $event)"
  >
    <q-card class="purchaser-card-dialog">
      <q-card-section class="purchaser-header">
        <div class="row items-center no-wrap">
          <q-avatar icon="person_search" color="primary" text-color="white" size="40px" />
          <div class="q-ml-md col">
            <div class="text-h6 text-weight-bold">Seleccionar comprador</div>
            <div class="text-caption text-grey-6">
              Elige la persona responsable de dar seguimiento a esta comparación.
            </div>
          </div>
          <q-btn v-close-popup flat round dense icon="close" aria-label="Cerrar" />
        </div>

        <q-input v-model="searchQuery" outlined dense clearable debounce="200" bg-color="white"
          placeholder="Buscar por nombre, NIT o ciudad..." class="q-mt-md">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>
      </q-card-section>

      <q-separator />

      <q-card-section class="purchaser-list">
        <div v-if="loading" class="column items-center justify-center q-pa-xl">
          <q-spinner-dots size="44px" color="primary" />
          <div class="text-body2 text-grey-6 q-mt-sm">
            Buscando compradores disponibles...
          </div>
        </div>

        <div v-else-if="error" class="column items-center justify-center q-pa-xl text-center">
          <q-icon name="sentiment_dissatisfied" size="52px" color="orange-7" />
          <div class="text-subtitle1 text-weight-medium q-mt-sm">
            Aún no pudimos cargar los compradores
          </div>
          <div class="text-body2 text-grey-6 q-mt-xs purchaser-error-message">
            {{ error }}
          </div>
          <q-btn outline color="primary" no-caps icon="refresh" label="Intentar de nuevo"
            class="q-mt-md" :loading="loading" @click="loadPurchasers" />
        </div>

        <div v-else-if="!filteredPurchasers.length" class="column items-center justify-center q-pa-xl text-center">
          <q-icon name="person_off" size="48px" color="grey-5" />
          <div class="text-subtitle1 text-weight-medium q-mt-sm">
            Sin resultados
          </div>
          <div class="text-body2 text-grey-6 q-mt-xs">
            No encontramos compradores que coincidan con tu búsqueda.
          </div>
        </div>

        <template v-else>
          <div class="text-caption text-grey-6 q-mb-sm">
            {{ filteredPurchasers.length }}
            {{ filteredPurchasers.length === 1 ? "comprador disponible" : "compradores disponibles" }}
            · selecciona uno para continuar
          </div>

          <div role="radiogroup" aria-label="Lista de compradores" class="column q-gutter-sm">
            <div v-for="purchaser in filteredPurchasers" :key="purchaser.id" role="radio"
              :aria-checked="isSelected(purchaser)" tabindex="0" class="purchaser-item"
              :class="{ 'purchaser-item--selected': isSelected(purchaser) }"
              @click="toggleSelection(purchaser)"
              @keydown.enter.prevent="toggleSelection(purchaser)"
              @keydown.space.prevent="toggleSelection(purchaser)">
              <q-avatar :color="isSelected(purchaser) ? 'primary' : 'grey-3'"
                :text-color="isSelected(purchaser) ? 'white' : 'grey-8'" size="38px" class="q-mr-md">
                <q-icon :name="isSelected(purchaser) ? 'check' : 'person'" />
              </q-avatar>

              <div class="purchaser-item__body">
                <div class="purchaser-item__field">
                  <span class="purchaser-item__label">Comprador</span>
                  <span class="purchaser-item__name">{{ purchaser.comprador || "—" }}</span>
                </div>

                <div class="purchaser-item__details">
                  <div class="purchaser-item__detail">
                    <q-icon name="badge" size="14px" />
                    <span><strong>NIT:</strong> {{ purchaser.nit || "—" }}</span>
                  </div>
                  <div class="purchaser-item__detail">
                    <q-icon name="location_city" size="14px" />
                    <span><strong>Ciudad:</strong> {{ purchaser.ciudad || "—" }}</span>
                  </div>
                  <div class="purchaser-item__detail">
                    <q-icon name="local_shipping" size="14px" />
                    <span><strong>Despacho:</strong> {{ purchaser.despacho || "—" }}</span>
                  </div>
                  <div class="purchaser-item__detail purchaser-item__detail--wide">
                    <q-icon name="place" size="14px" />
                    <span><strong>Dirección:</strong> {{ purchaser.direccion || "—" }}</span>
                  </div>
                </div>
              </div>

              <div class="purchaser-item__check" @click.stop>
                <q-checkbox :value="isSelected(purchaser)" dense color="primary"
                  :aria-label="'Seleccionar comprador ' + (purchaser.comprador || '')"
                  @input="toggleSelection(purchaser)" />
              </div>
            </div>
          </div>
        </template>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md" align="right">
        <q-btn v-close-popup flat no-caps color="grey-7" label="Cancelar" />
        <q-btn unelevated no-caps color="primary" icon="check_circle"
          label="Confirmar comprador" :disable="!selectedPurchaser" @click="confirmSelection" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { purchaserApi } from "../../infrastructure/PurchaserApi";

export default {
  name: "PurchaserSelectionDialog",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      loading: false,
      error: null,
      purchasers: [],
      selectedPurchaser: null,
      searchQuery: "",
    };
  },

  computed: {
    filteredPurchasers() {
      const query = (this.searchQuery || "").trim().toLowerCase();
      if (!query) {
        return this.purchasers;
      }
      return this.purchasers.filter((purchaser) => {
        const haystack = [
          purchaser.comprador,
          purchaser.nit,
          purchaser.ciudad,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.indexOf(query) >= 0;
      });
    },
  },

  watch: {
    value(isOpen) {
      if (isOpen) {
        this.searchQuery = "";
        this.selectedPurchaser = null;
        this.loadPurchasers();
      }
    },
  },

  methods: {
    async loadPurchasers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await purchaserApi.listPurchasers();
        if (response && response.ok) {
          this.purchasers = response.results || [];
        } else {
          this.purchasers = [];
          this.error =
            (response && response.message) ||
            "Por ahora no pudimos obtener los compradores. No te preocupes, suele ser algo temporal.";
        }
      } catch (error) {
        this.purchasers = [];
        this.error =
          (error && error.message) ||
          "Sin conexión en este momento. Revisa tu red e intenta de nuevo.";
      } finally {
        this.loading = false;
      }
    },
    isSelected(purchaser) {
      return Boolean(
        this.selectedPurchaser &&
          purchaser &&
          this.selectedPurchaser.id === purchaser.id
      );
    },
    toggleSelection(purchaser) {
      if (this.isSelected(purchaser)) {
        this.selectedPurchaser = null;
        return;
      }
      this.selectedPurchaser = purchaser;
    },
    confirmSelection() {
      if (!this.selectedPurchaser) {
        return;
      }
      this.$emit("confirmed", this.selectedPurchaser);
      this.$q.notify({
        type: "positive",
        message:
          "Comprador seleccionado: " + (this.selectedPurchaser.comprador || ""),
        icon: "person",
      });
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped>
.purchaser-card-dialog {
  width: 92vw;
  max-width: 640px;
  max-height: 86vh;
  border-radius: 12px;
  overflow: hidden;
}

.purchaser-header {
  padding-bottom: 4px;
}

.purchaser-list {
  max-height: 52vh;
  overflow-y: auto;
}

.purchaser-error-message {
  max-width: 380px;
  line-height: 1.45;
}

.purchaser-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.18s ease, background-color 0.18s ease,
    box-shadow 0.18s ease;
}

.purchaser-item:hover {
  border-color: #a5b4fc;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.08);
}

.purchaser-item:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

.purchaser-item--selected {
  border-color: rgba(59, 130, 246, 0.55);
  background: rgba(59, 130, 246, 0.05);
}

.purchaser-item__body {
  flex: 1;
  min-width: 0;
}

.purchaser-item__field {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin-bottom: 6px;
}

.purchaser-item__label {
  font-size: 0.64rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #94a3b8;
}

.purchaser-item__name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
  word-break: break-word;
}

.purchaser-item__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 12px;
}

.purchaser-item__detail {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  font-size: 0.76rem;
  color: #475569;
  min-width: 0;
}

.purchaser-item__detail strong {
  color: #64748b;
  font-weight: 600;
}

.purchaser-item__detail span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.purchaser-item__detail--wide {
  grid-column: 1 / -1;
}

.purchaser-item__check {
  flex-shrink: 0;
  padding-left: 6px;
}

@media (max-width: 600px) {
  .purchaser-card-dialog {
    width: 100vw;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  .purchaser-list {
    max-height: calc(100vh - 230px);
  }

  .purchaser-item__details {
    grid-template-columns: 1fr;
  }
}
</style>
