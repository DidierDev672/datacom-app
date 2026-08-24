<template>
  <div class="purchases-table-wrap">
    <table class="purchases-table">
      <thead>
        <tr>
          <!-- Encabezados dinámicos -->
          <th
            v-for="header in headers"
            :key="header.key"
            :class="header.align ? 'is-' + header.align : ''"
            scope="col"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Filas dinámicas -->
        <tr v-for="item in items" :key="item.id" class="purchases-table__row">
          <!-- Columnas dinámicas por fila -->
          <td
            v-for="header in headers"
            :key="header.key"
            :class="header.align ? 'is-' + header.align : ''"
          >
            <!-- Columna de acciones -->
            <template v-if="header.key === 'acciones'">
              <div class="purchases-table__actions">
                <button
                  type="button"
                  class="purchases-table__action purchases-table__action--view"
                  aria-label="Ver detalle"
                  title="Ver detalle"
                  @click="$emit('view', item)"
                >
                  <q-icon name="visibility" size="18px" />
                </button>
                <button
                  type="button"
                  class="purchases-table__action purchases-table__action--delete"
                  aria-label="Eliminar"
                  title="Eliminar"
                  @click="$emit('remove', item)"
                >
                  <q-icon name="delete_outline" size="18px" />
                </button>
              </div>
            </template>

            <!-- Celdas de datos -->
            <template v-else>
              <!-- Nota enriquecida (ej. problema al obtener comprador/proveedor) -->
              <span
                v-if="richCell(item, header.key)"
                class="purchases-table__note"
                :class="
                  'purchases-table__note--' + richCell(item, header.key).tone
                "
                role="note"
              >
                <q-icon
                  class="purchases-table__note-icon"
                  :name="richCell(item, header.key).icon || 'error_outline'"
                  size="14px"
                />
                <span>
                  <strong>{{ richCell(item, header.key).title }}</strong>
                  {{ richCell(item, header.key).detail }}
                </span>
              </span>

              <!-- Valor simple -->
              <template v-else>
                <span
                  class="purchases-table__cell"
                  :class="{ 'purchases-table__cell--strong': header.strong }"
                >
                  {{ displayValue(item, header.key) }}
                </span>
                <span
                  v-if="header.hint && cellHint(item, header)"
                  class="purchases-table__hint"
                >
                  {{ cellHint(item, header) }}
                </span>
              </template>
            </template>
          </td>
        </tr>

        <!-- Estado vacío -->
        <tr v-if="!items.length">
          <td :colspan="headers.length" class="purchases-table__empty">
            <q-icon name="inbox" size="34px" />
            <span>No hay compras registradas por ahora.</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
/**
 * Tabla de compras registradas.
 *
 * NOTA sobre <script setup>: este proyecto usa Vue 2.6 con webpack
 * (@quasar/app v2), que NO soporta la compilación de <script setup>.
 * Se aplica la Composition API equivalente vía @vue/composition-api,
 * el patrón oficial del repositorio.
 */
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "PurchasesTable",

  props: {
    /** Arreglo de encabezados: [{ key, label, align?, strong?, hint? }] */
    headers: {
      type: Array,
      required: true,
    },
    /** Arreglo de datos: cada objeto se renderiza como una fila. */
    items: {
      type: Array,
      required: true,
    },
  },

    setup(props) {
      /**
       * Celda enriquecida: si el valor es un objeto con forma
       * { tone, title, detail?, icon? }, la tabla lo pinta como nota
       * destacada en lugar de texto plano.
       */
      function richCell(item, key) {
        if (!item) {
          return null;
        }
        const value = item[key];
        if (!value || typeof value !== "object" || Array.isArray(value)) {
          return null;
        }
        if (!value.title) {
          return null;
        }
        return value;
      }

      function displayValue(item, key) {
        if (!item) {
          return "—";
        }
        const value = item[key];
        if (value == null || value === "") {
          return "—";
        }
        // Las celdas enriquecidas se renderizan vía richCell
        if (typeof value === "object") {
          return "";
        }
        if (Array.isArray(value)) {
          return value.length ? value.join(", ") : "—";
        }
        return String(value);
      }

    function cellHint(item, header) {
      if (!item || !header || !header.hint) {
        return "";
      }
      const value = item[header.hint];
      if (value == null || value === "") {
        return "";
      }
      return String(value);
    }

    return { richCell, displayValue, cellHint };
  },
});
</script>

<style scoped>
.purchases-table-wrap {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
}

.purchases-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  font-size: 0.86rem;
  color: #0f172a;
}

/* Encabezados */
.purchases-table thead th {
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  text-align: left;
  white-space: nowrap;
}

/* Filas */
.purchases-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid #eef2f7;
  vertical-align: middle;
  text-align: left;
}

.purchases-table__row:hover {
  background: #f8fafc;
}

.purchases-table tbody tr:last-child td {
  border-bottom: none;
}

/* Alineaciones opcionales por columna */
.purchases-table th.is-center,
.purchases-table td.is-center {
  text-align: center;
}

.purchases-table th.is-right,
.purchases-table td.is-right {
  text-align: right;
}

/* Contenido de celdas */
.purchases-table__cell {
  display: block;
  word-break: break-word;
}

.purchases-table__cell--strong {
  font-weight: 600;
}

.purchases-table__hint {
  display: block;
  margin-top: 2px;
  font-size: 0.74rem;
  color: #94a3b8;
  word-break: break-word;
}

/*
 * Nota enriquecida de celda (advertencias amigables).
 * Tipografía pequeña pero legible: ámbar de alto contraste
 * (#92400e sobre #fffbeb, ratio ~8:1), título en negrita para
 * escaneo rápido y una sola acción clara a continuación.
 */
.purchases-table__note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  max-width: 300px;
  padding: 6px 9px;
  border-radius: 8px;
  border: 1px solid #fde68a;
  background: #fffbeb;
  color: #92400e;
  font-size: 0.7rem;
  line-height: 1.45;
  text-align: left;
}

.purchases-table__note strong {
  font-weight: 700;
}

.purchases-table__note-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

/* Acciones */
.purchases-table__actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.purchases-table__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.purchases-table__action:focus-visible {
  outline: 2px solid #4e9c4c;
  outline-offset: 2px;
}

.purchases-table__action--view {
  background: #eef2ff;
  color: #4338ca;
}

.purchases-table__action--view:hover {
  background: #e0e7ff;
}

.purchases-table__action--delete {
  background: #fee2e2;
  color: #b91c1c;
}

.purchases-table__action--delete:hover {
  background: #fecaca;
}

/* Estado vacío */
.purchases-table__empty {
  padding: 40px 16px !important;
  text-align: center !important;
  color: #94a3b8;
  font-size: 0.86rem;
}

.purchases-table__empty .q-icon {
  display: block;
  margin: 0 auto 8px;
}
</style>
