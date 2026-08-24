<template>
  <q-page class="cotizacion-page q-pa-md">
    <div class="sticky-summary q-mb-md rounded-borders">
      <div class="sticky-summary__inner row items-center q-col-gutter-md wrap">
        <div class="col-12 col-md">
          <div class="title-md text-weight-bold ellipsis">
            {{ tituloOperativoCotizacion }}
          </div>
          <div class="text-muted text-caption q-mt-xs">
            {{ subtituloOperativoCotizacion }}
          </div>
        </div>
        <div class="col-auto">
          <q-badge outline color="primary" class="text-caption">
            {{ estadoFlujoUx }}
          </q-badge>
        </div>
        <div class="col-12 col-md-auto">
          <div class="text-caption text-muted">Ganador general</div>
          <div class="text-body2 text-weight-medium">
            <template v-if="proveedorGanadorUsuarioId">
              {{ etiquetaPorId(proveedorGanadorUsuarioId) }}
            </template>
            <template v-else>
              <span class="text-muted">Sin elegir</span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <q-card flat bordered class="cotizacion-card">
      <q-card-section class="q-pt-lg q-pb-none">
        <!-- 1 · Proveedores -->
        <q-card flat bordered class="section-card">
          <div class="section-card__head row items-center q-mb-md">
            <span class="section-num">1</span>
            <span class="title-md text-weight-semibold">Proveedores</span>
          </div>

          <div class="row q-col-gutter-md items-end">
            <div class="col-12 col-md">
              <q-select
                v-model="proveedoresSeleccionados"
                :options="opcionesProveedores"
                label="Proveedores"
                outlined
                dense
                multiple
                stack-label
                emit-value
                map-options
                option-value="value"
                option-label="label"
                :loading="tercerosStore.loading"
                hint="Puede elegir uno o varios proveedores."
                clearable
              />
            </div>
            <div class="col-12 col-md-auto">
              <q-btn
                unelevated
                color="primary"
                icon="person_add"
                label="Registrar proveedor"
                class="full-width"
                style="min-height: 40px"
                @click="abrirModalRegistro"
              />
            </div>
          </div>

          <p
            v-if="proveedoresSeleccionados.length === 0"
            class="text-caption text-muted q-mt-md q-mb-none"
          >
            No hay proveedores seleccionados. Elija del listado o registre uno
            nuevo.
          </p>

          <div v-else class="q-mt-md">
            <div class="text-caption text-muted q-mb-sm">
              Seleccionados ({{ proveedoresSeleccionados.length }})
            </div>
            <div class="row q-col-gutter-xs wrap items-center">
              <div
                v-for="pid in proveedoresSeleccionados"
                :key="'chip-' + String(pid)"
                class="col-auto"
              >
                <q-chip
                  removable
                  dense
                  color="primary"
                  text-color="white"
                  :title="subtituloProveedorPorId(pid)"
                  @remove="quitarProveedor(pid)"
                >
                  {{ nombreChipProveedor(pid) }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-card>

        <!-- 2 · Productos -->
        <q-card flat bordered class="section-card">
          <div class="section-card__head row items-center q-mb-md">
            <span class="section-num">2</span>
            <span class="title-md text-weight-semibold">Productos</span>
          </div>
          <div class="text-caption text-muted q-mb-md">
            Cada producto es una tarjeta: nombre y cantidad arriba; proveedores y
            precios se despliegan solo cuando los necesite.
            <span v-if="tieneIdRequisicion" class="block q-mt-xs">
              Requisición <strong>{{ idRequisicion }}</strong>
              — importe ítems con «Desde requisición».
            </span>
          </div>

          <div
            v-if="itemsPedidoLocal.length === 0"
            class="product-list-empty text-body2 text-muted q-py-xl text-center rounded-borders"
          >
            Sin ítems — use «Agregar ítem».
          </div>

          <div v-else class="column q-gutter-md product-cards-stack">
            <q-card
              v-for="row in itemsPedidoLocal"
              :key="'prod-' + row._localId"
              flat
              bordered
              class="product-item-card"
            >
              <q-card-section class="q-pa-md">
                <!-- Zona 1: producto + cantidad -->
                <div class="row items-start no-wrap q-col-gutter-sm">
                  <div class="col">
                    <div class="row items-center q-mb-xs">
                      <q-icon
                        name="inventory_2"
                        size="20px"
                        color="grey-7"
                        class="q-mr-sm"
                      />
                      <span class="product-zone-label text-muted text-caption"
                        >Producto</span
                      >
                    </div>
                    <q-input
                      v-model="row.nombre"
                      dense
                      outlined
                      placeholder="Nombre del producto"
                      class="product-item-card__nombre"
                      hide-bottom-space
                    />
                    <div class="row items-end q-col-gutter-sm q-mt-md">
                      <div class="col-auto">
                        <div class="row items-center no-wrap">
                          <q-icon
                            name="straighten"
                            size="18px"
                            color="grey-7"
                            class="q-mr-xs"
                          />
                          <span class="product-zone-label text-muted text-caption"
                            >Cantidad</span
                          >
                        </div>
                        <div class="row items-center q-col-gutter-xs q-mt-xs">
                          <q-input
                            v-model.number="row.cantidad"
                            type="number"
                            dense
                            outlined
                            min="0"
                            step="any"
                            hide-bottom-space
                            class="product-item-card__cant-input"
                          />
                          <q-select
                            v-model="row.unidad"
                            :options="opcionesUnidadPedido"
                            dense
                            outlined
                            hide-bottom-space
                            class="product-item-card__unidad-select"
                          />
                        </div>
                      </div>
                      <div class="col">
                        <div class="product-meta-resumen text-weight-medium">
                          {{ textoCantidadUnidadResumen(row) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-btn flat round dense icon="more_vert" color="grey-8">
                      <q-menu anchor="bottom right" self="top right">
                        <q-item
                          clickable
                          v-close-popup
                          class="text-negative"
                          @click="eliminarItemPedidoLocal(row)"
                        >
                          <q-item-section avatar>
                            <q-icon name="delete_outline" color="negative" />
                          </q-item-section>
                          <q-item-section>Eliminar ítem</q-item-section>
                        </q-item>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>

                <!-- Zona 2: proveedores (compacto + expansión) -->
                <div class="product-zona-proveedores q-mt-lg">
                  <div class="row items-center justify-between q-mb-xs">
                    <div class="row items-center no-wrap">
                      <q-icon
                        name="storefront"
                        size="18px"
                        color="grey-7"
                        class="q-mr-sm"
                      />
                      <span class="product-meta">{{
                        textoResumenProveedoresLinea(row)
                      }}</span>
                    </div>
                    <q-btn
                      flat
                      dense
                      no-caps
                      color="primary"
                      :disable="proveedoresSeleccionados.length === 0"
                      :label="
                        row._provAbierto === true
                          ? 'Ocultar proveedores'
                          : 'Editar proveedores'
                      "
                      @click="toggleProveedoresPanel(row)"
                    />
                  </div>
                  <q-slide-transition>
                    <div v-show="row._provAbierto === true" class="q-mt-sm">
                      <q-select
                        v-model="row.proveedoresLinea"
                        :options="opcionesProveedoresSeleccionadosParaTabla"
                        dense
                        outlined
                        multiple
                        stack-label
                        emit-value
                        map-options
                        option-value="value"
                        option-label="label"
                        label="Proveedores del ítem"
                        placeholder="Elija uno o más"
                        hide-bottom-space
                        clearable
                        :disable="proveedoresSeleccionados.length === 0"
                        @input="onProveedoresLineaChange(row, $event)"
                      >
                        <template v-slot:no-option>
                          <q-item dense>
                            <q-item-section class="text-grey">
                              No hay proveedores seleccionados en el paso 1.
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>
                  </q-slide-transition>
                </div>

                <!-- Mejor opción / precio cotizado (solo lectura) -->
                <div
                  v-if="mejorLineaDisplay(row)"
                  class="mejor-opcion-mini q-mt-md rounded-borders"
                >
                  <div class="text-caption text-positive text-weight-medium">
                    {{ mejorLineaDisplay(row).titulo }}
                  </div>
                  <div class="product-precio-destacado q-mt-xs">
                    {{ mejorLineaDisplay(row).etiqueta }}
                  </div>
                  <div class="product-meta q-mt-xs">
                    {{ formatMoneyCustom(mejorLineaDisplay(row).precioUnitario) }}/u · subtotal
                    {{ formatMoneyCustom(mejorLineaDisplay(row).subtotal) }}
                  </div>
                </div>
                <div
                  v-else-if="
                    row.proveedoresLinea &&
                    row.proveedoresLinea.length > 1 &&
                    !mejorOpcionLineaPedido(row)
                  "
                  class="text-caption text-amber-9 q-mt-md"
                >
                  Mismo subtotal entre proveedores en esta línea (empate).
                </div>

                <!-- Zona 3: comparar precios (acción principal) -->
                <div class="product-zona-precios q-mt-md">
                  <template
                    v-if="
                      !row.proveedoresLinea || row.proveedoresLinea.length === 0
                    "
                  >
                    <div class="text-caption text-muted">
                      Elija proveedores para comparar precios.
                    </div>
                  </template>
                  <template v-else>
                    <q-btn
                      unelevated
                      no-caps
                      color="primary"
                      class="full-width product-btn-comparar"
                      padding="sm lg"
                      :icon-right="
                        row._preciosAbierto === true
                          ? 'expand_less'
                          : 'expand_more'
                      "
                      label="Comparar precios"
                      @click="togglePreciosPanel(row)"
                    />
                    <div class="text-center text-caption text-muted q-mt-xs">
                      {{
                        row.proveedoresLinea.length
                      }}
                      proveedor(es) en esta línea
                    </div>
                    <q-slide-transition>
                      <div
                        v-show="row._preciosAbierto === true"
                        class="column q-gutter-y-sm precios-cajas-column q-mt-md"
                      >
                        <div
                          v-for="pid in row.proveedoresLinea"
                          :key="'prec-' + row._localId + '-' + String(pid)"
                          class="precio-caja-item"
                        >
                          <div class="row items-baseline justify-between">
                            <div class="text-body2 ellipsis">
                              {{ nombreChipProveedor(pid) }}
                            </div>
                            <div class="text-caption text-weight-bold text-primary">
                              {{
                                formatMoneyCustom(
                                  subtotalLineaPedidoProveedor(row, String(pid))
                                )
                              }}
                            </div>
                          </div>
                          <div class="text-caption text-muted q-mb-xs">
                            Precio unitario
                          </div>
                          <q-input
                            class="precio-caja-input q-mt-xs"
                            :value="valorPrecioMapa(row, pid)"
                            type="number"
                            dense
                            outlined
                            min="0"
                            step="any"
                            hide-bottom-space
                            placeholder="Precio unitario"
                            @input="actualizarPrecioMapa(row, pid, $event)"
                          />
                        </div>
                      </div>
                    </q-slide-transition>
                  </template>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="row items-center q-mt-md q-col-gutter-sm wrap">
            <div class="col-auto">
              <q-btn
                color="secondary"
                outline
                icon="playlist_add"
                label="Desde requisición"
                :disable="!tieneIdRequisicion"
                @click="abrirModalItemsRequisicion"
              >
                <q-tooltip
                  v-if="!tieneIdRequisicion"
                  anchor="center right"
                  self="center left"
                >
                  Abra esta pantalla desde el listado de requisiciones (botón +
                  cotización) para asociar una requisición.
                </q-tooltip>
              </q-btn>
            </div>
            <div class="col-auto">
              <q-btn
                color="primary"
                icon="add"
                label="Agregar ítem"
                outline
                @click="agregarItemPedidoLocal"
              />
            </div>
            <q-space class="gt-xs" />
            <div class="col-12 col-sm-auto text-right q-mt-sm q-mt-sm-none">
              <div class="text-caption text-grey-7 q-mb-xs">
                Resumen por proveedor (igual al total general del comparativo)
              </div>
              <div
                v-if="proveedoresSeleccionados.length === 0"
                class="text-body2 text-grey-7"
              >
                —
              </div>
              <div v-else class="column items-end q-gutter-y-xs">
                <div
                  v-for="t in totalesPorProveedorPedido"
                  :key="'footer-' + t.proveedorId"
                  class="row items-baseline justify-end q-gutter-x-sm"
                >
                  <span class="text-body2">{{ t.label }}</span>
                  <span class="text-h6 text-weight-bold text-primary">
                    {{ formatMoneyCustom(t.total) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </q-card>

        <!-- 3 · Comparativo -->
        <q-card flat bordered class="section-card">
          <div class="section-card__head row items-center q-mb-md">
            <span class="section-num">3</span>
            <span class="title-md text-weight-semibold">Comparativo</span>
          </div>
          <p class="text-caption text-muted q-mb-md">
            Total por proveedor y detalle por ítem. Los detalles secundarios están
            en la ayuda al pasar el cursor sobre el ícono.
          </p>

          <div
            v-if="proveedoresSeleccionados.length === 0"
            class="text-body2 text-muted q-py-sm"
          >
            Invite proveedores para ver el comparativo.
          </div>

          <template v-else>
            <div class="row q-col-gutter-sm q-mb-lg">
              <div class="col-12 col-sm-4">
                <q-card
                  flat
                  bordered
                  class="metric-card"
                  :class="{
                    'metric-card--best':
                      !metricMejorProveedorGlobal.hayEmpate &&
                      metricMejorProveedorGlobal.total != null,
                  }"
                >
                  <div class="text-caption text-muted">
                    Mejor total (análisis)
                  </div>
                  <div class="text-h6 text-weight-bold q-mt-xs ellipsis">
                    {{ metricMejorProveedorGlobal.etiqueta }}
                  </div>
                  <div
                    v-if="metricMejorProveedorGlobal.total != null"
                    class="text-body2 q-mt-xs text-weight-medium"
                  >
                    {{ formatMoneyCustom(metricMejorProveedorGlobal.total) }}
                  </div>
                  <div
                    v-if="metricMejorProveedorGlobal.hayEmpate"
                    class="text-caption text-amber-9 q-mt-xs"
                  >
                    Empate entre proveedores en el menor total.
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-sm-4">
                <q-card flat bordered class="metric-card">
                  <div class="text-caption text-muted">Ítems comparados</div>
                  <div class="text-h6 text-weight-bold q-mt-xs">
                    {{ reporteComparativaPrecios.detalleLineas.length }}
                  </div>
                </q-card>
              </div>
              <div class="col-12 col-sm-4">
                <q-card flat bordered class="metric-card">
                  <div class="text-caption text-muted">Proveedores cotizando</div>
                  <div class="text-h6 text-weight-bold q-mt-xs">
                    {{ reporteComparativaPrecios.cantidadCotizadores }}
                  </div>
                </q-card>
              </div>
            </div>

            <q-banner
              v-if="reporteComparativaPrecios.hayEmpateEnMejorTotal"
              dense
              class="bg-amber-2 text-dark q-mb-md rounded-borders"
            >
              Hay empate en el menor total entre varios proveedores; no hay un
              único «sugerido» automático.
            </q-banner>

            <div class="title-md text-weight-semibold q-mb-sm">
              Total general por proveedor
            </div>
            <q-markup-table
              flat
              dense
              separator="horizontal"
              wrap-cells
              class="comparativa-ranking-table comparativa-ranking-table--lite q-mb-xl"
            >
              <thead>
                <tr>
                  <th class="text-left">Proveedor</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in reporteComparativaPrecios.ranking"
                  :key="'rank-' + r.proveedorId"
                  :class="{
                    'comparativa-ranking-row--best':
                      r.esSugeridoPorMenorTotalGlobal,
                  }"
                >
                  <td>
                    <div class="row items-center no-wrap">
                      <span class="ellipsis">{{ r.etiqueta }}</span>
                      <q-icon
                        name="info_outline"
                        size="16px"
                        class="text-muted q-ml-xs cursor-pointer"
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">
                          <span class="ranking-tooltip-pre">{{
                            textoTooltipRankingProveedor(r)
                          }}</span>
                        </q-tooltip>
                      </q-icon>
                    </div>
                    <div class="q-mt-xs">
                      <q-badge
                        v-if="r.esSugeridoPorMenorTotalGlobal"
                        color="positive"
                        dense
                      >
                        Sugerido
                      </q-badge>
                      <q-badge
                        v-else-if="!r.cotizaEnAlgunItem"
                        color="grey"
                        dense
                      >
                        Sin líneas
                      </q-badge>
                    </div>
                  </td>
                  <td class="text-right text-weight-medium">
                    {{
                      r.cotizaEnAlgunItem
                        ? formatMoneyCustom(r.totalPedido)
                        : "—"
                    }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>

            <div class="section-spacing">
              <div class="title-md text-weight-semibold q-mb-sm">
                Por producto
              </div>
              <p class="text-caption text-muted q-mb-md">
                Abra cada ítem para ver el mejor precio y el resto de
                proveedores.
              </p>

              <div
                v-if="reporteComparativaPrecios.detalleLineas.length === 0"
                class="text-body2 text-muted q-py-md text-center rounded-borders comparativa-productos-vacio"
              >
                No hay productos con proveedores asignados. Agregue ítems y
                seleccione proveedores en cada fila.
              </div>

              <q-list
                v-else
                bordered
                separator
                class="rounded-borders comparativa-productos-list"
              >
                <q-expansion-item
                  v-for="dl in reporteComparativaPrecios.detalleLineas"
                  :key="'exp-' + dl.localRowKey"
                  expand-separator
                  class="comparativa-exp-item"
                  header-class="comparativa-exp-item__header"
                >
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon name="inventory_2" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">
                        {{ dl.nombre || "(Sin nombre)" }}
                      </q-item-label>
                      <q-item-label caption>
                        Cant. {{ dl.cantidad }} · {{ dl.unidad }}
                      </q-item-label>
                    </q-item-section>
                  </template>

                  <q-card flat class="q-pa-md comparativa-exp-body">
                    <template v-if="mejorCotizacionEnLinea(dl)">
                      <div class="text-caption text-positive text-weight-medium">
                        Mejor en esta fila
                      </div>
                      <div class="text-body1 q-mt-xs">
                        {{ mejorCotizacionEnLinea(dl).etiqueta }}
                        —
                        {{
                          formatMoneyCustom(
                            mejorCotizacionEnLinea(dl).precioUnitario
                          )
                        }}/u · subtotal
                        {{
                          formatMoneyCustom(mejorCotizacionEnLinea(dl).subtotal)
                        }}
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-caption text-amber-9">
                        Empate o datos incompletos en esta fila.
                      </div>
                    </template>

                    <div class="q-mt-md text-caption text-muted q-mb-xs">
                      Otros proveedores
                    </div>
                    <div
                      v-if="cotizacionesRestantesProducto(dl).length === 0"
                      class="text-caption text-grey-7"
                    >
                      —
                    </div>
                    <div
                      v-for="c in cotizacionesRestantesProducto(dl)"
                      :key="dl.localRowKey + '-rest-' + c.proveedorId"
                      class="row items-center justify-between q-py-xs comparativa-detalle-fila"
                    >
                      <span class="text-body2">{{ c.etiqueta }}</span>
                      <span class="text-caption text-grey-8">
                        {{
                          formatMoneyCustom(c.precioUnitario)
                        }}/u ·
                        {{
                          formatoDiferenciaPrecio(
                            c.diferenciaPrecioUnitarioVsMinimo
                          )
                        }}
                        vs mín. pu
                      </span>
                    </div>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
          </template>
        </q-card>

        <!-- 4 · Ganador general -->
        <q-card flat bordered class="section-card">
          <div class="section-card__head row items-center q-mb-md">
            <span class="section-num">4</span>
            <span class="title-md text-weight-semibold">Ganador general</span>
          </div>
          <p class="text-caption text-muted q-mb-md">
            La decisión final es suya; puede alinearla con la sugerencia del
            análisis o no.
          </p>

          <div v-if="proveedoresSeleccionados.length === 0" class="text-muted">
            Seleccione proveedores primero.
          </div>

          <template v-else>
            <div class="row q-col-gutter-md items-end comparativa-ganador-row">
              <div class="col-12 col-md-7">
                <q-select
                  v-model="proveedorGanadorUsuarioId"
                  :options="opcionesProveedoresSeleccionadosParaTabla"
                  label="Proveedor ganador (su elección)"
                  outlined
                  dense
                  clearable
                  emit-value
                  map-options
                  option-value="value"
                  option-label="label"
                  hint="No tiene que coincidir con el proveedor sugerido."
                >
                  <template v-slot:prepend>
                    <q-icon name="emoji_events" color="amber-8" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-auto">
                <q-btn
                  outline
                  color="secondary"
                  no-caps
                  icon="tips_and_updates"
                  label="Usar sugerencia del análisis"
                  :disable="
                    !reporteComparativaPrecios.proveedorSugeridoPorMenorTotalId
                  "
                  @click="aplicarProveedorSugeridoComparativa"
                >
                  <q-tooltip
                    v-if="
                      !reporteComparativaPrecios.proveedorSugeridoPorMenorTotalId
                    "
                  >
                    No hay un único proveedor sugerido (empate o faltan datos).
                  </q-tooltip>
                </q-btn>
              </div>
            </div>

            <div
              v-if="proveedorGanadorUsuarioId"
              class="text-body2 q-mt-md comparativa-ganador-resumen"
            >
              <q-icon
                name="check_circle"
                color="positive"
                size="20px"
                class="q-mr-xs"
              />
              Ganador seleccionado:
              <strong>{{ etiquetaPorId(proveedorGanadorUsuarioId) }}</strong>
            </div>
          </template>
        </q-card>

      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pa-md cotizacion-actions">
        <q-btn
          outline
          color="grey-8"
          icon="arrow_back"
          label="Volver al listado"
          :to="{ name: 'requisiciones-compras-lista' }"
        />
      </q-card-actions>
    </q-card>

    <!-- Modal: registro rápido de proveedor (API /api/v1/terceros POST) -->
    <q-dialog
      v-model="modalRegistro"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="modal-registro-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Registrar proveedor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="text-caption text-grey-7 q-pt-xs">
          Los datos se envían al mismo servicio que el registro completo de
          terceros (backend).
        </q-card-section>
        <q-separator />
        <q-card-section class="scroll modal-registro-body">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="registroForm.tipoTercero"
                :options="opcionesTipoTercero"
                label="Tipo de tercero"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="registroForm.tipoDocumento"
                :options="opcionesTipoDocumentoFiltradas"
                label="Tipo de documento"
                outlined
                dense
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="registroForm.numeroDocumento"
                label="Número de documento"
                outlined
                dense
              />
            </div>
            <template v-if="registroForm.tipoTercero === 'PERSONA_JURIDICA'">
              <div class="col-12">
                <q-input
                  v-model="registroForm.razonSocial"
                  label="Razón social"
                  outlined
                  dense
                />
              </div>
            </template>
            <template v-else>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="registroForm.nombres"
                  label="Nombres"
                  outlined
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="registroForm.apellidos"
                  label="Apellidos"
                  outlined
                  dense
                />
              </div>
            </template>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="registroForm.telefono"
                label="Teléfono"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="registroForm.email"
                label="Correo electrónico"
                type="email"
                outlined
                dense
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="registroForm.direccion"
                label="Dirección"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="registroForm.ciudad"
                label="Ciudad"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="registroForm.pais"
                label="País"
                outlined
                dense
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            label="Guardar proveedor"
            icon="save"
            :loading="guardandoProveedor"
            @click="guardarProveedor"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal: ítems de la requisición actual -->
    <q-dialog
      v-model="modalItemsRequisicion"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="modal-items-requisicion-card">
        <q-card-section class="row items-center q-pb-sm">
          <div>
            <div class="text-h6">Ítems de la requisición</div>
            <div v-if="tieneIdRequisicion" class="text-caption text-grey-7">
              ID: {{ idRequisicion }}
            </div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pt-md relative-position">
          <q-inner-loading :showing="cargandoItemsRequisicion">
            <q-spinner-gears size="42px" color="primary" />
          </q-inner-loading>

          <div
            v-if="
              !cargandoItemsRequisicion &&
              filasItemsRequisicionModal.length === 0
            "
            class="text-body2 text-grey-7 q-py-md text-center"
          >
            No hay ítems en esta requisición o no se pudieron cargar.
          </div>

          <q-table
            v-else-if="filasItemsRequisicionModal.length > 0"
            :data="filasItemsRequisicionModal"
            :columns="columnasItemsRequisicionModal"
            row-key="_rowKey"
            flat
            bordered
            dense
            selection="multiple"
            :selected.sync="seleccionItemsRequisicion"
            class="tabla-items-req-modal"
          >
            <template v-slot:body-cell-precioUnitario="props">
              <q-td :props="props">
                {{ formatMoneyCustom(Number(props.row.precioUnitario) || 0) }}
              </q-td>
            </template>
            <template v-slot:body-cell-totalItem="props">
              <q-td :props="props">
                {{
                  formatMoneyCustom(
                    props.row.totalItem != null
                      ? Number(props.row.totalItem)
                      : totalLineaItemRequisicion(props.row)
                  )
                }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cerrar" color="grey-8" v-close-popup />
          <q-btn
            unelevated
            color="primary"
            icon="done"
            label="Agregar seleccionados a la tabla"
            :disable="
              seleccionItemsRequisicion.length === 0 ||
              filasItemsRequisicionModal.length === 0
            "
            @click="incorporarItemsRequisicionSeleccionados"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { useTercerosStore } from "src/piña/terceros";
import { useRequisicionStore } from "../store/useRequisicionStore";

export default {
  name: "RequisicionCotizacionView",
  props: {
    idRequisicion: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      proveedoresSeleccionados: [],
      proveedorGanadorUsuarioId: null,
      modalRegistro: false,
      guardandoProveedor: false,
      registroForm: {
        tipoTercero: "PERSONA_JURIDICA",
        tipoDocumento: "NIT",
        numeroDocumento: "",
        razonSocial: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        direccion: "",
        ciudad: "",
        pais: "Colombia",
      },
      opcionesTipoTercero: [
        { label: "Persona jurídica", value: "PERSONA_JURIDICA" },
        { label: "Persona natural", value: "PERSONA_NATURAL" },
      ],
      opcionesTipoDocumento: [
        { label: "NIT", value: "NIT", tipo: "PERSONA_JURIDICA" },
        { label: "Cédula de ciudadanía", value: "CC", tipo: "PERSONA_NATURAL" },
        { label: "Cédula de extranjería", value: "CE", tipo: "ANY" },
        { label: "Pasaporte", value: "PASAPORTE", tipo: "ANY" },
      ],
      itemsPedidoLocal: [],
      nextLocalItemId: 1,
      opcionesUnidadPedido: [
        "UNIDAD",
        "METROS",
        "KILOS",
        "LIBRAS",
        "MILEGRAMOS",
      ],
      modalItemsRequisicion: false,
      cargandoItemsRequisicion: false,
      filasItemsRequisicionModal: [],
      seleccionItemsRequisicion: [],
      columnasItemsRequisicionModal: [
        {
          name: "detalle",
          label: "Nombre / detalle",
          align: "left",
          field: "detalle",
          sortable: false,
        },
        {
          name: "unidad",
          label: "Unidad",
          align: "center",
          field: "unidad",
          sortable: false,
        },
        {
          name: "cantidad",
          label: "Cantidad",
          align: "right",
          field: "cantidad",
          sortable: false,
        },
        {
          name: "precioUnitario",
          label: "Precio unitario",
          align: "right",
          field: "precioUnitario",
          sortable: false,
        },
        {
          name: "totalItem",
          label: "Total ítem",
          align: "right",
          field: "totalItem",
          sortable: false,
        },
      ],
    };
  },
  computed: {
    tercerosStore() {
      return useTercerosStore();
    },
    requisicionStore() {
      return useRequisicionStore();
    },
    tieneIdRequisicion() {
      return !!(this.idRequisicion && String(this.idRequisicion).trim());
    },
    opcionesTipoDocumentoFiltradas() {
      var tt = this.registroForm.tipoTercero;
      return this.opcionesTipoDocumento.filter(function (o) {
        return o.tipo === "ANY" || o.tipo === tt;
      });
    },
    opcionesProveedores() {
      var list = this.tercerosStore.terceros || [];
      var self = this;
      return list.map(function (t) {
        return {
          value: String(t.id),
          label: self.etiquetaProveedor(t),
        };
      });
    },
    opcionesProveedoresSeleccionadosParaTabla() {
      var self = this;
      var ids = this.proveedoresSeleccionados || [];
      return ids.map(function (id) {
        return {
          value: String(id),
          label: self.etiquetaPorId(id),
        };
      });
    },
    totalesPorProveedorPedido() {
      var self = this;
      var ids = this.proveedoresSeleccionados || [];
      return ids.map(function (pid) {
        var sid = String(pid);
        var sum = self.itemsPedidoLocal.reduce(function (acc, row) {
          return acc + self.subtotalLineaPedidoProveedor(row, sid);
        }, 0);
        return {
          proveedorId: sid,
          label: self.etiquetaPorId(pid),
          total: sum,
        };
      });
    },
    reporteComparativaPrecios() {
      return this.buildComparativaPreciosProveedores();
    },
    tituloOperativoCotizacion() {
      if (this.tieneIdRequisicion) {
        return "Cotización — Req. " + String(this.idRequisicion).trim();
      }
      return "Nueva cotización";
    },
    subtituloOperativoCotizacion() {
      var nProv = this.proveedoresSeleccionados.length;
      var nProd = this.itemsPedidoLocal.length;
      var parts = [];
      parts.push(nProv + " proveedor(es)");
      parts.push(nProd + " producto(s)");
      return parts.join(" · ");
    },
    estadoFlujoUx() {
      if (!this.proveedoresSeleccionados.length) {
        return "Paso 1 · Elija proveedores";
      }
      if (!this.itemsPedidoLocal.length) {
        return "Paso 2 · Agregue productos";
      }
      var rep = this.reporteComparativaPrecios;
      if (!rep.cantidadCotizadores) {
        return "Complete cotizaciones por ítem";
      }
      if (!this.proveedorGanadorUsuarioId) {
        return "Paso 4 · Elija ganador general";
      }
      return "Comparación lista";
    },
    metricMejorProveedorGlobal() {
      var rep = this.reporteComparativaPrecios;
      var id = rep.proveedorSugeridoPorMenorTotalId;
      if (id) {
        var k;
        for (k = 0; k < rep.ranking.length; k++) {
          if (rep.ranking[k].proveedorId === String(id)) {
            return {
              etiqueta: rep.ranking[k].etiqueta,
              total: rep.ranking[k].totalPedido,
              hayEmpate: false,
            };
          }
        }
      }
      if (rep.hayEmpateEnMejorTotal) {
        return {
          etiqueta: "Empate entre proveedores",
          total: rep.mejorTotalGlobal,
          hayEmpate: true,
        };
      }
      return {
        etiqueta: "—",
        total: null,
        hayEmpate: false,
      };
    },
  },
  watch: {
    "registroForm.tipoTercero": function () {
      var opts = this.opcionesTipoDocumentoFiltradas;
      if (!opts.length) return;
      var td = this.registroForm.tipoDocumento;
      var ok = opts.some(function (o) {
        return o.value === td;
      });
      if (!ok) {
        this.registroForm.tipoDocumento = opts[0].value;
      }
    },
    proveedoresSeleccionados: {
      handler: function () {
        var allowed = (this.proveedoresSeleccionados || []).map(function (id) {
          return String(id);
        });
        var self = this;
        if (
          self.proveedorGanadorUsuarioId != null &&
          self.proveedorGanadorUsuarioId !== "" &&
          allowed.indexOf(String(self.proveedorGanadorUsuarioId)) === -1
        ) {
          self.proveedorGanadorUsuarioId = null;
        }
        this.itemsPedidoLocal.forEach(function (row) {
          var cur = row.proveedoresLinea || [];
          var filtered = cur.map(String).filter(function (id) {
            return allowed.indexOf(id) !== -1;
          });
          var prevJoined = cur.map(String).slice().sort().join("|");
          var nextJoined = filtered.slice().sort().join("|");
          if (prevJoined !== nextJoined) {
            self.$set(row, "proveedoresLinea", filtered.slice());
          }
          self.onProveedoresLineaChange(row, row.proveedoresLinea || []);
        });
      },
      deep: true,
    },
  },
  mounted() {
    this.cargarProveedores();
  },
  methods: {
    etiquetaProveedor(t) {
      if (!t) return "";
      if (t.tipoTercero === "PERSONA_JURIDICA") {
        if (t.razonSocial)
          return t.razonSocial + " — " + (t.identificacion || "");
        return t.identificacion || String(t.id || "");
      }
      var n = ((t.nombres || "") + " " + (t.apellidos || "")).trim();
      if (n) return n + " — " + (t.identificacion || "");
      return t.identificacion || String(t.id || "");
    },
    resolverProveedorPorId(pid) {
      var list = this.tercerosStore.terceros || [];
      var i;
      for (i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(pid)) return list[i];
      }
      return null;
    },
    etiquetaPorId(pid) {
      var t = this.resolverProveedorPorId(pid);
      if (t) return this.etiquetaProveedor(t);
      return "Proveedor";
    },
    subtituloProveedorPorId(pid) {
      var t = this.resolverProveedorPorId(pid);
      var parts = [];
      parts.push("ID: " + pid);
      if (t && t.identificacion) {
        parts.push("Doc: " + t.identificacion);
      }
      if (t && t.email) {
        parts.push(t.email);
      }
      if (!t) {
        parts.push("Actualice la lista si acaba de registrar");
      }
      return parts.join(" · ");
    },
    nombreChipProveedor(pid) {
      var t = this.resolverProveedorPorId(pid);
      if (t) {
        var nom = ((t.nombres || "") + " " + (t.apellidos || "")).trim();
        var doc = (t.identificacion || "").trim();
        if (nom) {
          if (nom.length > 28) {
            return nom.slice(0, 26) + "...";
          }
          return nom;
        }
        if (doc) return doc;
      }
      return "Prov. " + String(pid);
    },
    textoTooltipRankingProveedor(r) {
      var lines = [];
      lines.push(r.etiqueta);
      if (!r.cotizaEnAlgunItem) {
        lines.push("Sin cotización en ítems.");
        return lines.join("\n");
      }
      lines.push("Total: " + this.formatMoneyCustom(r.totalPedido));
      if (
        r.diferenciaVsMejorTotal != null &&
        r.diferenciaVsMejorTotal === 0
      ) {
        lines.push("Mejor total global.");
      } else if (r.diferenciaVsMejorTotal != null) {
        lines.push(
          "vs mejor: " +
            this.formatoDiferenciaPrecio(r.diferenciaVsMejorTotal)
        );
        if (r.porcentajeSobreMejor != null) {
          lines.push(
            "+" +
              this.formatPorcentajeRedondeado(r.porcentajeSobreMejor) +
              "% sobre el mejor"
          );
        }
      }
      if (r.esSugeridoPorMenorTotalGlobal) {
        lines.push("Sugerido por menor total.");
      }
      return lines.join("\n");
    },
    mejorCotizacionEnLinea(dl) {
      var list = dl.cotizaciones || [];
      if (!list.length) return null;
      var mejorSub = null;
      var cntMejor = 0;
      var uno = null;
      var i;
      for (i = 0; i < list.length; i++) {
        var sub = Number(list[i].subtotal);
        if (isNaN(sub)) sub = 0;
        if (mejorSub === null || sub < mejorSub) {
          mejorSub = sub;
          cntMejor = 1;
          uno = list[i];
        } else if (sub === mejorSub) {
          cntMejor += 1;
        }
      }
      if (cntMejor !== 1) return null;
      return uno;
    },
    cotizacionesRestantesProducto(dl) {
      var mejor = this.mejorCotizacionEnLinea(dl);
      var list = dl.cotizaciones || [];
      if (!mejor) return list;
      var mpid = String(mejor.proveedorId);
      return list.filter(function (c) {
        return String(c.proveedorId) !== mpid;
      });
    },
    togglePreciosPanel(row) {
      var cur = row._preciosAbierto === true;
      this.$set(row, "_preciosAbierto", !cur);
    },
    toggleProveedoresPanel(row) {
      var cur = row._provAbierto === true;
      this.$set(row, "_provAbierto", !cur);
    },
    textoCantidadUnidadResumen(row) {
      var c = Number(row.cantidad);
      if (isNaN(c) || c < 0) c = 0;
      var u = row.unidad ? String(row.unidad) : "UNIDAD";
      return String(c) + " " + u;
    },
    textoResumenProveedoresLinea(row) {
      var n = (row.proveedoresLinea && row.proveedoresLinea.length) || 0;
      if (n === 0) return "Sin proveedores en este ítem";
      if (n === 1) return "1 proveedor en este ítem";
      return String(n) + " proveedores en este ítem";
    },
    mejorOpcionLineaPedido(row) {
      var pids = (row.proveedoresLinea || []).map(String);
      if (!pids.length) return null;
      var mejorSub = null;
      var cntMejor = 0;
      var mejorPid = null;
      var i;
      var sub;
      for (i = 0; i < pids.length; i++) {
        sub = this.subtotalLineaPedidoProveedor(row, pids[i]);
        if (mejorSub === null || sub < mejorSub) {
          mejorSub = sub;
          cntMejor = 1;
          mejorPid = pids[i];
        } else if (sub === mejorSub) {
          cntMejor += 1;
        }
      }
      if (cntMejor !== 1 || mejorPid == null) return null;
      return {
        proveedorId: mejorPid,
        etiqueta: this.etiquetaPorId(mejorPid),
        precioUnitario: this.valorPrecioMapa(row, mejorPid),
        subtotal: mejorSub,
      };
    },
    mejorLineaDisplay(row) {
      var m = this.mejorOpcionLineaPedido(row);
      if (!m) return null;
      var n = (row.proveedoresLinea && row.proveedoresLinea.length) || 0;
      if (!n) return null;
      return {
        titulo:
          n > 1 ? "Mejor opción en esta línea" : "Precio en esta línea",
        etiqueta: m.etiqueta,
        precioUnitario: m.precioUnitario,
        subtotal: m.subtotal,
      };
    },
    onProveedoresLineaChange(row, ids) {
      var nextIds = (ids || []).map(String);
      if (!row.preciosPorProveedor) {
        this.$set(row, "preciosPorProveedor", {});
      }
      var map = row.preciosPorProveedor;
      var self = this;
      Object.keys(map).forEach(function (k) {
        if (nextIds.indexOf(k) === -1) {
          self.$delete(map, k);
        }
      });
      nextIds.forEach(function (kid) {
        if (!(kid in map)) {
          self.$set(map, kid, 0);
        }
      });
      if (nextIds.length === 0) {
        this.$set(row, "_preciosAbierto", false);
      } else if (row._preciosAbierto === undefined) {
        this.$set(row, "_preciosAbierto", false);
      }
    },
    valorPrecioMapa(row, pid) {
      var k = String(pid);
      var mapRow = row.preciosPorProveedor || {};
      var v = mapRow[k];
      if (v == null || v === "") {
        return 0;
      }
      var n = Number(v);
      return isNaN(n) ? 0 : n;
    },
    actualizarPrecioMapa(row, pid, raw) {
      var rawVal = raw;
      if (
        raw != null &&
        typeof raw === "object" &&
        raw.target != null &&
        raw.target.value !== undefined
      ) {
        rawVal = raw.target.value;
      }
      var k = String(pid);
      if (!row.preciosPorProveedor) {
        this.$set(row, "preciosPorProveedor", {});
      }
      var n = Number(rawVal);
      if (rawVal === "" || rawVal === null || isNaN(n)) {
        this.$set(row.preciosPorProveedor, k, 0);
        return;
      }
      if (n < 0) {
        n = 0;
      }
      this.$set(row.preciosPorProveedor, k, n);
    },
    filaIncluyeProveedor(row, proveedorIdStr) {
      var ids = row.proveedoresLinea || [];
      var len = ids.length;
      var j;
      for (j = 0; j < len; j++) {
        if (String(ids[j]) === proveedorIdStr) {
          return true;
        }
      }
      return false;
    },
    subtotalLineaPedidoProveedor(row, proveedorIdStr) {
      if (!this.filaIncluyeProveedor(row, proveedorIdStr)) {
        return 0;
      }
      var c = Number(row.cantidad);
      if (isNaN(c) || c < 0) {
        c = 0;
      }
      var mapRow = row.preciosPorProveedor || {};
      var p = Number(mapRow[proveedorIdStr]);
      if (isNaN(p) || p < 0) {
        p = 0;
      }
      return c * p;
    },
    quitarProveedor(pid) {
      var sid = String(pid);
      this.proveedoresSeleccionados = this.proveedoresSeleccionados.filter(
        function (id) {
          return String(id) !== sid;
        }
      );
    },
    agregarItemPedidoLocal() {
      this.itemsPedidoLocal.push({
        _localId: this.nextLocalItemId++,
        nombre: "",
        proveedoresLinea: [],
        preciosPorProveedor: {},
        unidad: "UNIDAD",
        cantidad: 1,
      });
    },
    normalizeUnidadPedido(u) {
      if (!u) return "UNIDAD";
      var up = String(u).trim().toUpperCase();
      var opts = this.opcionesUnidadPedido;
      var i;
      for (i = 0; i < opts.length; i++) {
        if (opts[i] === up) return opts[i];
      }
      return "UNIDAD";
    },
    totalLineaItemRequisicion(row) {
      var c = Number(row.cantidad);
      if (isNaN(c) || c < 0) c = 0;
      var p = Number(row.precioUnitario);
      if (isNaN(p) || p < 0) p = 0;
      return c * p;
    },
    async abrirModalItemsRequisicion() {
      if (!this.tieneIdRequisicion) {
        this.$q.notify({
          type: "warning",
          message: "No hay requisición en contexto.",
          position: "top-right",
        });
        return;
      }
      this.modalItemsRequisicion = true;
      this.seleccionItemsRequisicion = [];
      this.filasItemsRequisicionModal = [];
      this.cargandoItemsRequisicion = true;
      try {
        await this.requisicionStore.fetchById(this.idRequisicion);
        if (this.requisicionStore.error) {
          this.$q.notify({
            type: "negative",
            message: this.requisicionStore.error,
            position: "top-right",
          });
          this.filasItemsRequisicionModal = [];
          return;
        }
        var req = this.requisicionStore.currentRequisicion;
        var items = req && req.items && req.items.length ? req.items : [];
        if (!items.length) {
          this.$q.notify({
            type: "info",
            message: "Esta requisición no tiene ítems registrados.",
            position: "top-right",
          });
        }
        this.filasItemsRequisicionModal = items.map(function (it, idx) {
          var key =
            it.idItem != null && it.idItem !== ""
              ? String(it.idItem)
              : "idx-" + idx + "-" + String(it.detalle || "").slice(0, 24);
          return Object.assign({}, it, { _rowKey: key });
        });
      } catch (e) {
        this.$q.notify({
          type: "negative",
          message: (e && e.message) || "No se pudieron cargar los ítems",
          position: "top-right",
        });
        this.filasItemsRequisicionModal = [];
      } finally {
        this.cargandoItemsRequisicion = false;
      }
    },
    incorporarItemsRequisicionSeleccionados() {
      var self = this;
      if (
        !this.seleccionItemsRequisicion ||
        !this.seleccionItemsRequisicion.length
      ) {
        return;
      }
      this.seleccionItemsRequisicion.forEach(function (it) {
        var lineProv = (self.proveedoresSeleccionados || []).map(String);
        var refPrecio =
          Number(it.precioUnitario) >= 0 ? Number(it.precioUnitario) : 0;
        var precios = {};
        var idxPv;
        for (idxPv = 0; idxPv < lineProv.length; idxPv++) {
          precios[lineProv[idxPv]] = refPrecio;
        }
        self.itemsPedidoLocal.push({
          _localId: self.nextLocalItemId++,
          nombre: it.detalle || "",
          proveedoresLinea: lineProv.slice(),
          preciosPorProveedor: precios,
          _preciosAbierto: false,
          unidad: self.normalizeUnidadPedido(it.unidad),
          cantidad: Number(it.cantidad) >= 0 ? Number(it.cantidad) : 1,
        });
      });
      this.modalItemsRequisicion = false;
      this.seleccionItemsRequisicion = [];
      this.$q.notify({
        type: "positive",
        message:
          "Ítems agregados a la lista de cotización. Puede editarlos en la tabla.",
        position: "top-right",
      });
    },
    eliminarItemPedidoLocal(row) {
      var id = row._localId;
      this.itemsPedidoLocal = this.itemsPedidoLocal.filter(function (r) {
        return r._localId !== id;
      });
    },
    formatMoneyCustom(val) {
      return val
        ? new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
          }).format(val)
        : "$ 0";
    },
    /**
     * Arma el reporte de comparativa (ranking por total, diferencias y detalle
     * por ítem). No modifica el ganador elegido por el usuario.
     */
    buildComparativaPreciosProveedores() {
      var idsInvitados = (this.proveedoresSeleccionados || []).map(String);
      var rows = this.itemsPedidoLocal || [];
      var rankingBase = [];
      var cotizadores = [];
      var i;
      var j;

      for (i = 0; i < idsInvitados.length; i++) {
        var sid = idsInvitados[i];
        var totalPedido = 0;
        var cotiza = false;
        for (j = 0; j < rows.length; j++) {
          if (this.filaIncluyeProveedor(rows[j], sid)) {
            cotiza = true;
          }
          totalPedido += this.subtotalLineaPedidoProveedor(rows[j], sid);
        }
        rankingBase.push({
          proveedorId: sid,
          etiqueta: this.etiquetaPorId(sid),
          totalPedido: totalPedido,
          cotizaEnAlgunItem: cotiza,
        });
        if (cotiza) {
          cotizadores.push({
            proveedorId: sid,
            totalPedido: totalPedido,
          });
        }
      }

      var mejorTotal = null;
      for (i = 0; i < cotizadores.length; i++) {
        var ttot = cotizadores[i].totalPedido;
        if (mejorTotal === null || ttot < mejorTotal) {
          mejorTotal = ttot;
        }
      }

      var empatesIds = [];
      if (mejorTotal !== null && cotizadores.length > 0) {
        for (i = 0; i < cotizadores.length; i++) {
          if (cotizadores[i].totalPedido === mejorTotal) {
            empatesIds.push(cotizadores[i].proveedorId);
          }
        }
      }

      var hayEmpateEnMejorTotal = empatesIds.length > 1;
      var proveedorSugeridoPorMenorTotalId =
        empatesIds.length === 1 ? empatesIds[0] : null;

      var proveedorSugeridoPorMenorTotalIdRef =
        proveedorSugeridoPorMenorTotalId;
      var rankingEnriquecido = rankingBase.map(function (r) {
        var diferenciaVsMejorTotal = null;
        var porcentajeSobreMejor = null;
        var esSugerido = false;
        if (r.cotizaEnAlgunItem && mejorTotal !== null) {
          diferenciaVsMejorTotal = r.totalPedido - mejorTotal;
          if (mejorTotal > 0) {
            porcentajeSobreMejor =
              ((r.totalPedido - mejorTotal) / mejorTotal) * 100;
          } else if (r.totalPedido === 0 && mejorTotal === 0) {
            porcentajeSobreMejor = 0;
          }
          esSugerido =
            empatesIds.length === 1 &&
            r.proveedorId === proveedorSugeridoPorMenorTotalIdRef;
        }
        return {
          proveedorId: r.proveedorId,
          etiqueta: r.etiqueta,
          totalPedido: r.totalPedido,
          cotizaEnAlgunItem: r.cotizaEnAlgunItem,
          diferenciaVsMejorTotal: diferenciaVsMejorTotal,
          porcentajeSobreMejor: porcentajeSobreMejor,
          esSugeridoPorMenorTotalGlobal: esSugerido,
        };
      });

      rankingEnriquecido.sort(function (a, b) {
        if (a.cotizaEnAlgunItem !== b.cotizaEnAlgunItem) {
          return a.cotizaEnAlgunItem ? -1 : 1;
        }
        return a.totalPedido - b.totalPedido;
      });

      var detalleLineas = [];
      for (j = 0; j < rows.length; j++) {
        var row = rows[j];
        var pids = (row.proveedoresLinea || []).map(String);
        if (pids.length === 0) {
          continue;
        }
        var preciosVals = [];
        for (i = 0; i < pids.length; i++) {
          preciosVals.push(this.valorPrecioMapa(row, pids[i]));
        }
        var minPu = Math.min.apply(null, preciosVals);
        var cotizaciones = [];
        for (i = 0; i < pids.length; i++) {
          var pid = pids[i];
          var pu = this.valorPrecioMapa(row, pid);
          var sub = this.subtotalLineaPedidoProveedor(row, pid);
          cotizaciones.push({
            proveedorId: pid,
            etiqueta: this.etiquetaPorId(pid),
            precioUnitario: pu,
            subtotal: sub,
            diferenciaPrecioUnitarioVsMinimo: pu - minPu,
            esPrecioUnitarioMinimoEnLinea: pu === minPu,
          });
        }
        detalleLineas.push({
          localRowKey: row._localId,
          nombre: row.nombre || "",
          cantidad: Number(row.cantidad) || 0,
          unidad: row.unidad || "",
          cotizaciones: cotizaciones,
        });
      }

      return {
        ranking: rankingEnriquecido,
        detalleLineas: detalleLineas,
        proveedorSugeridoPorMenorTotalId: proveedorSugeridoPorMenorTotalId,
        mejorTotalGlobal: mejorTotal,
        cantidadCotizadores: cotizadores.length,
        hayEmpateEnMejorTotal: hayEmpateEnMejorTotal,
      };
    },
    formatoDiferenciaPrecio(diff) {
      if (diff == null || isNaN(Number(diff))) {
        return "—";
      }
      var n = Number(diff);
      if (n === 0) {
        return "Sin diferencia";
      }
      var formatted = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(Math.abs(n));
      var sign = n > 0 ? "+ " : "- ";
      return sign + formatted.trim();
    },
    formatPorcentajeRedondeado(p) {
      if (p == null || isNaN(Number(p))) {
        return "0";
      }
      return String(Math.round(Number(p) * 10) / 10);
    },
    aplicarProveedorSugeridoComparativa() {
      var id = this.reporteComparativaPrecios.proveedorSugeridoPorMenorTotalId;
      if (id) {
        this.proveedorGanadorUsuarioId = String(id);
        this.$q.notify({
          type: "positive",
          message:
            "Se aplicó el proveedor sugerido por menor total. Puede cambiarlo cuando quiera.",
          position: "top-right",
        });
      }
    },
    async cargarProveedores() {
      try {
        await this.tercerosStore.fetchTerceros();
      } catch (e) {
        this.$q.notify({
          type: "negative",
          message: "No se pudo cargar la lista de proveedores",
          position: "top-right",
        });
      }
    },
    abrirModalRegistro() {
      this.resetRegistroForm();
      this.modalRegistro = true;
    },
    resetRegistroForm() {
      this.registroForm = {
        tipoTercero: "PERSONA_JURIDICA",
        tipoDocumento: "NIT",
        numeroDocumento: "",
        razonSocial: "",
        nombres: "",
        apellidos: "",
        telefono: "",
        email: "",
        direccion: "",
        ciudad: "",
        pais: "Colombia",
      };
    },
    emailValido(email) {
      if (!email || String(email).trim() === "") return false;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    },
    construirPayloadProveedor() {
      var f = this.registroForm;
      var informacionBasica = {
        razonSocial: "",
        nombreComercial: "",
        nombres: "",
        apellidos: "",
        representanteLegal: "",
      };
      if (f.tipoTercero === "PERSONA_JURIDICA") {
        informacionBasica.razonSocial = (f.razonSocial || "").trim();
      } else {
        informacionBasica.nombres = (f.nombres || "").trim();
        informacionBasica.apellidos = (f.apellidos || "").trim();
      }
      return {
        tipoTercero: f.tipoTercero,
        identificacion: {
          tipoDocumento: f.tipoDocumento,
          numeroDocumento: (f.numeroDocumento || "").trim(),
        },
        informacionBasica: informacionBasica,
        contacto: {
          telefono: (f.telefono || "").trim(),
          email: (f.email || "").trim(),
          direccion: (f.direccion || "").trim(),
          ciudad: (f.ciudad || "").trim(),
          pais: (f.pais || "").trim() || "Colombia",
        },
        informacionFinanciera: {
          banco: "",
          tipoCuenta: "Ahorros",
          numeroCuenta: "",
          titularCuenta: "",
        },
        formaPago: {
          tipoFormaPago: "CONTADO",
          diasCredito: null,
          numeroCuotas: null,
          mesesPlazo: null,
          mesesPago: [],
        },
        informacionTributaria: {
          regimen: "",
          responsabilidades: [],
          agenteRetenedor: false,
        },
        estado: "ACTIVO",
        observaciones: "",
      };
    },
    async guardarProveedor() {
      var f = this.registroForm;
      if (!(f.numeroDocumento || "").trim()) {
        this.$q.notify({
          type: "warning",
          message: "Indique el número de documento",
          position: "top-right",
        });
        return;
      }
      if (
        f.tipoTercero === "PERSONA_JURIDICA" &&
        !(f.razonSocial || "").trim()
      ) {
        this.$q.notify({
          type: "warning",
          message: "Indique la razón social",
          position: "top-right",
        });
        return;
      }
      if (f.tipoTercero === "PERSONA_NATURAL") {
        if (!(f.nombres || "").trim() || !(f.apellidos || "").trim()) {
          this.$q.notify({
            type: "warning",
            message: "Indique nombres y apellidos",
            position: "top-right",
          });
          return;
        }
      }
      if (!this.emailValido(f.email)) {
        this.$q.notify({
          type: "warning",
          message: "Indique un correo electrónico válido",
          position: "top-right",
        });
        return;
      }
      var payload = this.construirPayloadProveedor();
      this.guardandoProveedor = true;
      try {
        var created = await this.tercerosStore.registerTercero(payload);
        await this.tercerosStore.fetchTerceros();
        var nuevoId = created && created.id ? String(created.id) : null;
        if (
          !nuevoId &&
          payload.identificacion &&
          payload.identificacion.numeroDocumento
        ) {
          var doc = payload.identificacion.numeroDocumento;
          var lista = this.tercerosStore.terceros || [];
          var encontrado = lista.filter(function (t) {
            return t.identificacion === doc;
          })[0];
          if (encontrado && encontrado.id) nuevoId = String(encontrado.id);
        }
        if (nuevoId && this.proveedoresSeleccionados.indexOf(nuevoId) === -1) {
          this.proveedoresSeleccionados = this.proveedoresSeleccionados.concat([
            nuevoId,
          ]);
        }
        this.$q.notify({
          type: "positive",
          message: "Proveedor registrado correctamente",
          position: "top-right",
        });
        this.modalRegistro = false;
        this.resetRegistroForm();
      } catch (err) {
        var msg = "No se pudo registrar el proveedor";
        if (err.response && err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        }
        this.$q.notify({
          type: "negative",
          message: msg,
          position: "top-right",
        });
      } finally {
        this.guardandoProveedor = false;
      }
    },
  },
};
</script>

<style scoped>
.cotizacion-page {
  background: linear-gradient(180deg, #f8faf8 0%, #eef2f0 100%);
  min-height: 60vh;
}

.cotizacion-card {
  width: 90%;
  max-width: min(1440px, 96vw);
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
}

@media (max-width: 600px) {
  .cotizacion-card {
    width: 100%;
    max-width: 100%;
  }
}

.cotizacion-bienvenida__icon-wrap {
  display: inline-flex;
  padding: 14px;
  border-radius: 50%;
  background: rgba(132, 178, 77, 0.12);
}

.modal-registro-card {
  width: 100%;
  max-width: 560px;
  border-radius: 12px;
}

.modal-registro-body {
  max-height: min(70vh, 520px);
}

.lista-proveedores-expansion {
  border: 1px solid #e5e7eb;
  overflow: hidden;
  background: #f9fafb;
}

.lista-proveedores-expansion__list {
  background: #fff;
}

/* Tarjetas de productos — menor carga cognitiva */
.product-list-empty {
  border: 1px dashed #e5e7eb;
  background: #fafafa;
}

.product-cards-stack {
  margin-bottom: 0;
}

.product-item-card {
  border-radius: 12px;
  border-color: #e8ece9 !important;
  background: #fff;
  margin-bottom: 16px;
}

.product-item-card:last-child {
  margin-bottom: 0;
}

.product-zone-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.product-item-card__nombre ::v-deep .q-field__native {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
}

.product-meta {
  font-size: 13px;
  color: #6b7280;
}

.product-meta-resumen {
  font-size: 15px;
  color: #374151;
}

.product-item-card__cant-input {
  max-width: 88px;
}

.product-item-card__unidad-select {
  min-width: 112px;
}

.mejor-opcion-mini {
  padding: 12px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.product-precio-destacado {
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.product-btn-comparar {
  font-weight: 600;
}

.product-zona-proveedores,
.product-zona-precios {
  padding-top: 4px;
}

.precios-cajas-column {
  padding-top: 2px;
}

.precio-caja-item {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #eceef2;
  background: #fafafa;
}

.precio-caja-input ::v-deep .q-field__control {
  background: #fff;
}

.comparativa-bloque__caption {
  max-width: 52rem;
}

.comparativa-productos-vacio {
  border: 1px dashed #d1d5db;
  background: #fafafa;
}

.comparativa-ranking-table__sugerido {
  background-color: rgba(132, 178, 77, 0.12);
}

.comparativa-detalle-item-cell {
  vertical-align: top;
  min-width: 140px;
}

.comparativa-detalle-fila + .comparativa-detalle-fila {
  border-top: 1px dashed #e5e7eb;
}

.comparativa-ganador-resumen {
  padding: 10px 12px;
  border-radius: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.modal-items-requisicion-card {
  width: min(720px, 96vw);
  max-height: min(90vh, 640px);
  display: flex;
  flex-direction: column;
}

.modal-items-requisicion-card .tabla-items-req-modal {
  max-height: 48vh;
}

/* UX cotizaciones — jerarquía, bloques, sticky */
.sticky-summary {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.sticky-summary__inner {
  padding: 14px 18px;
}

.page-header-operativo {
  padding-bottom: 8px;
}

.title-lg {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}

.title-md {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
}

.text-muted {
  color: #64748b;
}

.section-card {
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border-color: #e8ece9 !important;
  background: #fff;
}

.section-card:last-of-type {
  margin-bottom: 0;
}

.section-card__head {
  gap: 10px;
}

.section-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(132, 178, 77, 0.18);
  color: #3f6212;
  font-size: 13px;
  font-weight: 700;
}

.metric-card {
  border-radius: 12px;
  padding: 14px 16px;
  border-color: #e5e7eb !important;
}

.metric-card--best {
  background: #f0fdf4;
  border-left: 4px solid #22c55e !important;
}

.comparativa-ranking-table--lite ::v-deep thead th {
  border-bottom: none;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
}

.comparativa-ranking-row--best {
  background-color: rgba(132, 178, 77, 0.1);
}

.ranking-tooltip-pre {
  white-space: pre-line;
}

.section-spacing {
  margin-top: 8px;
}

.comparativa-exp-item__header {
  padding-top: 10px;
  padding-bottom: 10px;
}

.comparativa-exp-body {
  background: #f9fafb !important;
  border-top: 1px solid #eef1ef;
}

.comparativa-productos-list {
  overflow: hidden;
}
</style>
