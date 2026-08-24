<template>
  <div class="card mb-3">
    <div class="card-header">
      <span class="card-step">02</span>
      <h5 class="card-title">Finanzas y Detalle de Productos</h5>
    </div>
    <div class="card-body">
      <!-- Campos financieros globales -->
      <div class="row-fields">
        <div class="field">
          <label class="field-label">Presupuesto disponible (Calculado)</label>
          <div class="input-prefix">
            <span class="prefix-symbol">$</span>
            <input type="text" class="field-input" :value="formatoPesosSinSimbolo(solicitud.presupuestoDisponible)"
              readonly disabled />
          </div>
        </div>
        <div class="field">
          <label class="field-label">Nivel de aprobación</label>
          <select class="field-input" v-model="solicitud.nivelAprobacion">
            <option value="" disabled>Seleccione un nivel</option>
            <option value="Nivel 1">Nivel 1</option>
            <option value="Nivel 2">Nivel 2</option>
            <option value="Nivel 3">Nivel 3</option>
          </select>
        </div>
      </div>

      <!-- Botón agregar proyecto -->
      <div class="field mt-4">
        <button type="button" class="btn-add btn-proyecto" @click="abrirModalProyecto">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          Agregar proyecto
        </button>
      </div>

      <!-- Lista de proyectos anidados -->
      <div v-if="solicitud.proyectos.length === 0" class="empty-state">
        No hay proyectos registrados en este plan de abastecimiento.
      </div>

      <div class="project-card" v-for="(p, pIndex) in solicitud.proyectos" :key="pIndex">
        <div class="project-card-header">
          <div class="project-card-title">
            {{ p.planAbastecimiento }} - {{ p.item }}
            <span class="badge">{{ p.porcentaje }}% ({{
              formatoPesos(p.presupuestoAsignado)
            }})</span>
          </div>
          <button type="button" class="btn-remove btn-remove-header" @click="removerProyecto(pIndex)">
            Eliminar Proyecto
          </button>
        </div>
        <div class="project-card-body">
          <div class="mb-3">
            <button type="button" class="btn-add btn-sm btn-producto" @click="abrirModalProducto(pIndex)">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              Añadir Producto
            </button>
          </div>

          <div class="table-wrapper field">
            <table class="product-table">
              <thead>
                <tr>
                  <th>Ítem</th>
                  <th>Cant. / Unidad</th>
                  <th>Valor Ud.</th>
                  <th>Subtotal</th>
                  <th class="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="
                  !p.productosServicios || p.productosServicios.length === 0
                ">
                  <td colspan="5" class="empty-row text-center">
                    No hay productos agregados a este proyecto
                  </td>
                </tr>
                <tr v-for="(prod, prodIndex) in p.productosServicios" :key="prodIndex">
                  <td>{{ prod.descripcion }}</td>
                  <td>
                    {{ prod.cantidad }} {{ prod.unidadMedida }}
                    <div v-if="prod.unidadMedida === 'SUSCRIPCIÓN' && prod.fechaInicio && prod.fechaFin"
                      class="subscription-range">
                      {{ prod.fechaInicio }} → {{ prod.fechaFin }}
                    </div>
                  </td>
                  <td>{{ formatoPesos(prod.valorUnitario) }}</td>
                  <td>
                    <strong>{{ formatoPesos(calcularSubtotal(prod)) }}</strong>
                  </td>
                  <td class="col-actions">
                    <div class="actions-group">
                      <button type="button" class="icon-btn" title="Editar producto"
                        @click="abrirModalEditarProducto(pIndex, prodIndex)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21v-3.75L14.81 5.44a2 2 0 0 1 2.83 0l1.92 1.92a2 2 0 0 1 0 2.83L7.75 21H3z"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M14 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </button>
                      <button type="button" class="btn-remove" @click="removerProducto(pIndex, prodIndex)">
                        Quitar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="project-footer">
            <div class="project-footer-row">
              <span>Total Proyecto:</span>
              <span class="project-total">
                {{ formatoPesos(calcularTotalProyectoCalculado(p)) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen Global -->
      <div class="summary-box" v-if="solicitud.proyectos.length > 0">
        <div class="summary-label cost-progress-legend-item">
          Costo Global Estimado (Basado en Proyectos)
        </div>
        <div class="summary-value" :class="{ 'over-budget': costoGlobalExcedePresupuesto }">
          {{ formatoPesos(costoGlobalEstimado) }}
        </div>

        <div class="cost-progress-section">
          <BudgetProgressBar :value="porcentajeConsumoPresupuesto" label="Consumido" />
          <div class="cost-progress-legend">
            <span class="cost-progress-legend-item">
              Total proyectos:
              <strong>{{ formatoPesos(costoGlobalEstimado) }}</strong>
            </span>
            <span class="cost-progress-legend-item">
              Presupuesto asignado:
              <span class="presupuesto-asignado-wrapper">
                <strong :class="{
                  'project-total--manual': tienePresupuestoManualGlobal(),
                }">
                  {{ formatoPesos(presupuestoAsignadoEfectivo) }}
                </strong>
                <button type="button" class="icon-btn icon-btn--sm" title="Editar presupuesto asignado"
                  @click="abrirModalEditarPresupuestoAsignado">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21v-3.75L14.81 5.44a2 2 0 0 1 2.83 0l1.92 1.92a2 2 0 0 1 0 2.83L7.75 21H3z"
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                </button>
              </span>
            </span>
          </div>
          <ul class="global-project-totals">
            <li v-for="(proyecto, proyectoIndex) in solicitud.proyectos" :key="`global-total-${proyectoIndex}`"
              class="global-project-totals__item">
              <span class="global-project-totals__label">
                {{ proyecto.planAbastecimiento }} - {{ proyecto.item }}:
              </span>
              <span class="global-project-totals__value">
                <strong :class="{
                  'project-total--manual': tienePresupuestoProyectoManual(proyecto),
                }">
                  {{ proyecto.porcentaje }}% ·
                  {{ formatoPesos(proyecto.presupuestoAsignado) }}
                </strong>
              </span>
            </li>
          </ul>
          <span v-if="tienePresupuestoManualGlobal()" class="project-total-hint presupuesto-asignado-hint">
            Calculado por porcentajes:
            {{ formatoPesos(presupuestoAsignadoCalculadoGlobal) }}
          </span>
          <div v-if="!costoGlobalExcedePresupuesto && montoRestantePresupuesto > 0" class="cost-progress-remaining">
            Faltan {{ formatoPesos(montoRestantePresupuesto) }} para alcanzar el
            presupuesto asignado.
          </div>
        </div>

        <div class="summary-warning" v-if="costoGlobalExcedePresupuesto">
          ⚠️ El detalle de productos ({{ formatoPesos(costoGlobalEstimado) }})
          supera el presupuesto disponible asignado ({{
            formatoPesos(presupuestoAsignadoEfectivo)
          }}).
        </div>
      </div>

      <!-- Observaciones -->
      <div class="field mt-4">
        <label class="field-label">Observaciones generales de productos y servicios</label>
        <textarea class="field-input textarea-field" rows="3" v-model="solicitud.observacionesProductos"
          placeholder="Observaciones adicionales o justificaciones..."></textarea>
      </div>
    </div>

    <!-- Modal agregar proyecto -->
    <div class="modal-overlay" v-if="state.showModalProyecto" @click.self="state.showModalProyecto = false">
      <div class="modal-box w-77">
        <div class="modal-header">
          <p class="modal-title">Seleccionar Proyecto de la Solicitud</p>
          <button type="button" class="modal-close" @click.prevent="state.showModalProyecto = false">
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label class="field-label">1. Plan de Abastecimiento</label>
            <select class="field-input" v-model="nuevoProyecto.planAbastecimientoId" :disabled="loadingPlanes"
              @change="alCambiarPlan">
              <option value="" disabled>
                {{ loadingPlanes ? "Cargando planes..." : "Seleccionar..." }}
              </option>
              <option v-for="(plan, index) in dropdowns.planes" :key="`plan-${index}`"
                :value="plan.id || plan.planId || plan.codigo || plan">
                {{
                  plan.nombre ||
                  plan.name ||
                  plan.descripcion ||
                  plan.id ||
                  plan.planId ||
                  plan
                }}
              </option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">2. Rubro</label>
            <select class="field-input" v-model="nuevoProyecto.itemId" :disabled="!nuevoProyecto.planAbastecimientoId"
              @change="alCambiarRubro">
              <option value="" disabled>Seleccionar...</option>
              <option v-for="(rubro, index) in dropdowns.rubros" :key="`rubro-${index}`" :value="rubro.id ||
                rubro.rubroId ||
                rubro.item ||
                rubro.codigo ||
                rubro
                ">
                {{
                  rubro.nombre ||
                  rubro.name ||
                  rubro.descripcion ||
                  rubro.item ||
                  rubro.id ||
                  rubro
                }}
              </option>
            </select>
          </div>
          <div class="presupuesto-edit-grid presupuesto-edit-grid--nuevo">
            <div class="field">
              <label class="field-label">Presupuesto asignado</label>
              <div class="input-prefix">
                <span class="prefix-symbol">$</span>
                <input type="text" class="field-input"
                  :value="nuevoProyecto.presupuestoAsignadoInput ? formatoPesosSinSimbolo(nuevoProyecto.presupuestoAsignadoInput) : ''"
                  @input="onInputPresupuestoAsignado" @keydown="onKeydownNumerico" placeholder="0"
                  :disabled="!nuevoProyecto.planAbastecimientoId || !nuevoProyecto.itemId" />
              </div>
              <div v-if="errorPorcentajeNuevoProyecto" class="detail-sub text-red">
                {{ errorPorcentajeNuevoProyecto }}
              </div>
            </div>
            <div class="field">
              <label class="field-label">Porcentaje (%)</label>
              <input type="number" class="field-input" :value="porcentajeCalculadoDesdePresupuesto"
                placeholder="Calculado automáticamente" disabled tabindex="-1" />
            </div>
          </div>

          <div class="detail-box" v-if="planSeleccionado">
            <h6 class="detail-title">Resumen de la configuración</h6>

            <div class="detail-item">
              <span class="detail-label">Presupuesto de la requesición seleccionado:</span>
              <span class="detail-value">{{
                planSeleccionado.nombre ||
                planSeleccionado.descripcion ||
                planSeleccionado.name ||
                "Sin nombre"
              }}</span>
              <div class="detail-sub">
                <strong>Año:</strong>
                {{ planSeleccionado.year || planSeleccionado.año || "N/A" }} |
                <strong>Estado:</strong>
                {{
                  planSeleccionado.status || planSeleccionado.estado || "N/A"
                }}
              </div>
              <div class="detail-sub" v-if="
                planSeleccionado.startDate || planSeleccionado.fechaInicio
              ">
                <strong>Vigencia Plan:</strong>
                {{
                  formatFecha(
                    planSeleccionado.startDate || planSeleccionado.fechaInicio
                  )
                }}
                -
                {{
                  formatFecha(
                    planSeleccionado.endDate || planSeleccionado.fechaFin
                  ) || "N/A"
                }}
              </div>
            </div>

            <div class="detail-item" v-if="rubroSeleccionado">
              <span class="detail-label">Ítem / Rubro seleccionado:</span>
              <span class="detail-value">{{
                rubroSeleccionado.name ||
                rubroSeleccionado.nombre ||
                rubroSeleccionado.item ||
                rubroSeleccionado.descripcion ||
                "Sin nombre"
              }}</span>
              <div class="detail-sub">
                <strong>Descripción:</strong>
                {{
                  rubroSeleccionado.description ||
                  rubroSeleccionado.descripcion ||
                  "Sin descripción"
                }}
              </div>
              <div class="detail-sub">
                <strong>Vigencia Rubro:</strong>
                {{
                  formatFecha(
                    rubroSeleccionado.startDate || rubroSeleccionado.fechaInicio
                  )
                }}
                a
                {{
                  formatFecha(
                    rubroSeleccionado.endDate || rubroSeleccionado.fechaFin
                  )
                }}
              </div>

              <div class="budget-grid">
                <StatCard icon="account_balance_wallet" label="Total Rubro"
                  :value="formatoPesos(rubroSeleccionado.totalBudget || rubroSeleccionado.presupuesto || rubroSeleccionado.valor || 0)"
                  format="raw" accent-color="blue" compact />
                <StatCard icon="receipt_long" label="Usado"
                  :value="formatoPesos(rubroSeleccionado.usedBudget || rubroSeleccionado.presupuestoUsado || 0)"
                  format="raw" accent-color="red" compact />
                <StatCard icon="savings" label="Disponible"
                  :value="formatoPesos(getPresupuestoDisponibleRubro(rubroSeleccionado))" format="raw"
                  accent-color="green" compact highlight />
              </div>
            </div>

            <div class="detail-item highlight-box"
              v-if="rubroSeleccionado && nuevoProyecto.presupuestoAsignadoInput > 0">
              <span class="detail-label">Presupuesto para esta Solicitud ({{
                porcentajeCalculadoDesdePresupuesto
              }}% del Disponible):</span>
              <span class="detail-value highlight-text">{{
                formatoPesos(presupuestoCalculado)
              }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click.prevent="state.showModalProyecto = false">
            Cancelar
          </button>
          <button type="button" class="btn-save" @click="agregarProyecto">
            Añadir proyecto
          </button>
        </div>
      </div>
    </div>

    <!-- Modal editar presupuesto asignado -->
    <div class="modal-overlay modal-overlay--fade-up" v-if="state.showModalPresupuestoAsignado"
      @click.self="cerrarModalPresupuestoAsignado">
      <div class="modal-box w-55 modal-box--fade-up">
        <div class="modal-header">
          <p class="modal-title">Editar presupuesto asignado</p>
          <button type="button" class="modal-close" @click.prevent="cerrarModalPresupuestoAsignado">
            ×
          </button>
        </div>
        <div class="modal-body">
          <p class="detail-sub mb-3">
            Ajuste el presupuesto asignado de cada proyecto. El porcentaje se
            calcula automáticamente según el plan de abastecimiento y el rubro
            seleccionados.
          </p>
          <div v-if="loadingPresupuestoEdit" class="detail-sub text-center">
            Cargando información de planes y rubros...
          </div>
          <div v-for="(proyectoEdit, editIndex) in proyectosPresupuestoEdit" :key="`presupuesto-edit-${editIndex}`"
            class="presupuesto-edit-item">
            <div class="detail-sub presupuesto-edit-item__title">
              <strong>{{ proyectoEdit.label }}</strong>
            </div>
            <div class="detail-sub presupuesto-edit-item__meta">
              Plan:
              <strong>{{ proyectoEdit.planAbastecimiento || "N/A" }}</strong>
              · Rubro:
              <strong>{{ proyectoEdit.item || "N/A" }}</strong>
            </div>
            <div class="detail-sub presupuesto-edit-item__meta">
              Disponible del rubro:
              <strong>{{
                formatoPesos(proyectoEdit.presupuestoDisponibleRubro)
              }}</strong>
            </div>
            <div class="presupuesto-edit-grid">
              <div class="field">
                <label class="field-label">Presupuesto asignado *</label>
                <div class="input-prefix">
                  <span class="prefix-symbol">$</span>
                  <input type="text" class="field-input"
                    :value="formatoPesosSinSimbolo(proyectoEdit.presupuestoAsignado)"
                    @input="onInputPresupuestoEdit(editIndex, $event)" placeholder="0"
                    :disabled="loadingPresupuestoEdit" />
                </div>
              </div>
              <div class="field">
                <label class="field-label">Porcentaje (%)</label>
                <input type="number" class="field-input" :value="calcularPorcentajeDesdePresupuesto(
                  proyectoEdit.presupuestoDisponibleRubro, proyectoEdit.presupuestoAsignado
                )" placeholder="Calculado automáticamente" disabled tabindex="-1" />
              </div>
            </div>
            <div class="detail-sub">
              Calculado inicial:
              <strong>{{
                formatoPesos(proyectoEdit.presupuestoAsignadoCalculado)
              }}</strong>
            </div>
          </div>
          <div v-if="errorValidacionPresupuestoEdit" class="summary-warning presupuesto-edit-error">
            {{ errorValidacionPresupuestoEdit }}
          </div>
          <div class="detail-item highlight-box">
            <span class="detail-label">Total presupuesto asignado:</span>
            <span class="detail-value highlight-text">{{
              formatoPesos(totalPresupuestoEditModal)
            }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click.prevent="restaurarPresupuestoAsignadoCalculado"
            v-if="tienePresupuestoManualGlobal()">
            Usar calculado
          </button>
          <button type="button" class="btn-cancel" @click.prevent="cerrarModalPresupuestoAsignado">
            Cancelar
          </button>
          <button type="button" class="btn-save" :disabled="loadingPresupuestoEdit || !!errorValidacionPresupuestoEdit"
            @click="guardarPresupuestoAsignado">
            Guardar presupuesto
          </button>
        </div>
      </div>
    </div>

    <!-- Modal agregar / editar producto o servicio -->
    <div class="modal-overlay" v-if="state.showModalProducto" @click.self="cerrarModalProducto">
      <div class="modal-box w-50">
        <div class="modal-header">
          <p class="modal-title">
            {{
              state.modoProducto === "editar"
                ? "Editar producto del proyecto"
                : "Agregar producto a proyecto"
            }}
          </p>
          <button type="button" class="modal-close" @click.prevent="cerrarModalProducto">
            ×
          </button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label class="field-label">1. Nombre del producto o servicio</label>
            <input type="text" class="field-input" v-model="nuevoProducto.descripcion"
              placeholder="Ej: Computador portátil" />
          </div>
          <div class="field">
            <label class="field-label">2. Cantidad</label>
            <input type="number" class="field-input" v-model.number="nuevoProducto.cantidad" min="1" />
          </div>
          <div class="field">
            <label class="field-label">3. Unidad de medida</label>
            <select class="field-input" v-model="nuevoProducto.unidadMedida">
              <option value="" disabled>Seleccione unidad</option>
              <option v-for="u in unidadesDisponibles" :key="u" :value="u">
                {{ u }}
              </option>
            </select>
          </div>
          <div v-if="nuevoProducto.unidadMedida === 'SUSCRIPCIÓN'" class="subscription-dates">
            <div class="field">
              <label class="field-label">Fecha de inicio</label>
              <input type="date" class="field-input" v-model="nuevoProducto.fechaInicio" />
            </div>
            <div class="field">
              <label class="field-label">Fecha de fin</label>
              <input type="date" class="field-input" v-model="nuevoProducto.fechaFin"
                :min="nuevoProducto.fechaInicio" />
            </div>
          </div>
          <div class="field">
            <label class="field-label">4. Valor unitario estimado</label>
            <div class="input-prefix">
              <span class="prefix-symbol">$</span>
              <input type="text" class="field-input"
                :value="nuevoProducto.valorUnitario ? formatoPesosSinSimbolo(nuevoProducto.valorUnitario) : ''"
                @input="onInputValorUnitario" @keydown="onKeydownNumerico" placeholder="0" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click.prevent="cerrarModalProducto">
            Cancelar
          </button>
          <button type="button" class="btn-save" @click="guardarProducto">
            {{
              state.modoProducto === "editar"
                ? "Guardar cambios"
                : "Añadir producto"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRubrosStore } from "../../../../piña/rubros";
import { useSupplyPlansStore } from "../../../../piña/supplyPlans";
import StatCard from "../../../abastecimiento/ui/components/StatCard.vue";
import { useSolicitudStore } from "../store/useSolicitudStore";
import BudgetProgressBar from './BudgetProgressBar.vue';

export default {
  name: "DatosFinancieros",
  components: {
    BudgetProgressBar,
    StatCard,
  },
  data() {
    return {
      unidadesDisponibles: [
        "UND",
        "MTS",
        "KG",
        "GR",
        "MGR",
        "LT",
        "HORA",
        "DIA",
        "MES",
        "SUSCRIPCIÓN",
        "PAGO ÚNICO"
        , "SERVICIO",
      ],
      state: {
        showModalProyecto: false,
        showModalProducto: false,
        showModalPresupuestoAsignado: false,
        modoProducto: "agregar",
        proyectoSeleccionadoIndex: null,
        productoSeleccionadoIndex: null,
      },
      proyectosPresupuestoEdit: [],
      dropdowns: {
        planes: [],
        rubros: [],
      },
      nuevoProyecto: {
        planAbastecimientoId: "",
        itemId: "",
        porcentaje: 0,
        presupuestoAsignadoInput: "",
        productosServicios: [],
      },
      nuevoProducto: {
        descripcion: "",
        cantidad: 1,
        unidadMedida: "",
        valorUnitario: "",
        fechaInicio: "",
        fechaFin: "",
      },
      supplyPlansStore: null,
      rubrosStore: null,
      loadingPlanes: false,
      loadingPresupuestoEdit: false,
      errorValidacionPresupuestoEdit: "",
      errorPorcentajeNuevoProyecto: "",
    };
  },
  created() {
    this.supplyPlansStore = useSupplyPlansStore();
    this.rubrosStore = useRubrosStore();
  },
  computed: {
    solicitud() {
      return useSolicitudStore().solicitud;
    },
    planSeleccionado() {
      if (!this.nuevoProyecto.planAbastecimientoId) return null;
      return this.dropdowns.planes.find(
        (p) =>
          (p.id || p.planId || p.codigo || p) ===
          this.nuevoProyecto.planAbastecimientoId
      );
    },
    rubroSeleccionado() {
      if (!this.nuevoProyecto.itemId) return null;
      return this.dropdowns.rubros.find(
        (r) =>
          (r.id || r.rubroId || r.item || r.codigo || r) ===
          this.nuevoProyecto.itemId
      );
    },
    presupuestoCalculado() {
      return Number(this.nuevoProyecto.presupuestoAsignadoInput) || 0;
    },
    porcentajeCalculadoDesdePresupuesto() {
      if (!this.rubroSeleccionado) return 0;
      const disponible = this.getPresupuestoDisponibleRubro(
        this.rubroSeleccionado
      );
      return this.calcularPorcentajeDesdePresupuesto(
        disponible,
        this.nuevoProyecto.presupuestoAsignadoInput
      );
    },
    costoGlobalEstimado() {
      return this.calcularTotalGlobal();
    },
    presupuestoAsignadoEfectivo() {
      return this.solicitud.presupuestoDisponible;
    },
    presupuestoAsignadoCalculadoGlobal() {
      return this.solicitud.proyectos.reduce(
        (acc, proyecto) =>
          acc + (proyecto.presupuestoAsignadoCalculado || 0),
        0
      );
    },
    totalPresupuestoEditModal() {
      return this.proyectosPresupuestoEdit.reduce(
        (acc, proyecto) => acc + (proyecto.presupuestoAsignado || 0),
        0
      );
    },
    costoGlobalExcedePresupuesto() {
      return this.costoGlobalEstimado > this.presupuestoAsignadoEfectivo;
    },
    porcentajeConsumoPresupuesto() {
      const presupuesto = this.presupuestoAsignadoEfectivo || 0;
      if (presupuesto <= 0) {
        return this.costoGlobalEstimado > 0 ? 100 : 0;
      }
      return Math.round((this.costoGlobalEstimado / presupuesto) * 100);
    },
    anchoBarraProgreso() {
      return Math.min(100, this.porcentajeConsumoPresupuesto);
    },
    montoRestantePresupuesto() {
      return Math.max(
        0,
        this.presupuestoAsignadoEfectivo - this.costoGlobalEstimado
      );
    },
  },
  methods: {
    formatFecha(fecha) {
      if (!fecha) return "N/A";
      // Si ya es un string formateado por el backend
      if (typeof fecha === "string") return fecha;
      // Si es un objeto Calendar/Date
      try {
        const d = new Date(fecha);
        return d.toLocaleDateString("es-CO");
      } catch (e) {
        return String(fecha);
      }
    },
    tienePresupuestoProyectoManual(proyecto) {
      if (!proyecto) return false;
      const calculado = proyecto.presupuestoAsignadoCalculado;
      if (calculado === null || calculado === undefined) return false;
      return proyecto.presupuestoAsignado !== calculado;
    },
    tienePresupuestoManualGlobal() {
      return this.solicitud.proyectos.some((proyecto) =>
        this.tienePresupuestoProyectoManual(proyecto)
      );
    },
    async abrirModalEditarPresupuestoAsignado() {
      this.errorValidacionPresupuestoEdit = "";
      this.loadingPresupuestoEdit = true;
      this.state.showModalPresupuestoAsignado = true;

      try {
        const rubrosPorPlan = {};

        this.proyectosPresupuestoEdit = await Promise.all(
          this.solicitud.proyectos.map(async (proyecto) => {
            const planId = proyecto.planAbastecimientoId;
            const itemId = proyecto.itemId;
            let presupuestoDisponibleRubro =
              proyecto.presupuestoDisponibleRubro || 0;

            if (planId && itemId) {
              if (!rubrosPorPlan[planId]) {
                try {
                  const rubros =
                    await this.rubrosStore.fetchRubrosByPlanId(planId);
                  rubrosPorPlan[planId] = Array.isArray(rubros) ? rubros : [];
                } catch (e) {
                  console.error("Error al cargar rubros para edición", e);
                  rubrosPorPlan[planId] = [];
                }
              }

              const rubro = rubrosPorPlan[planId].find((r) =>
                this.rubroCoincideConItemId(r, itemId)
              );

              if (rubro) {
                presupuestoDisponibleRubro =
                  this.getPresupuestoDisponibleRubro(rubro);
              }
            }

            const presupuestoAsignadoCalculado =
              proyecto.presupuestoAsignadoCalculado != null
                ? proyecto.presupuestoAsignadoCalculado
                : proyecto.presupuestoAsignado != null
                  ? proyecto.presupuestoAsignado
                  : 0;

            let porcentaje = Number(proyecto.porcentaje) || 0;
            if (porcentaje <= 0 && presupuestoDisponibleRubro > 0) {
              const basePresupuesto =
                presupuestoAsignadoCalculado > 0
                  ? presupuestoAsignadoCalculado
                  : proyecto.presupuestoAsignado || 0;
              if (basePresupuesto > 0) {
                porcentaje = Math.round(
                  (basePresupuesto / presupuestoDisponibleRubro) * 100
                );
              }
            }

            return {
              label: `${proyecto.planAbastecimiento || "Proyecto"} - ${proyecto.item || ""
                }`.trim(),
              planAbastecimiento: proyecto.planAbastecimiento || "",
              item: proyecto.item || "",
              planAbastecimientoId: planId || "",
              itemId: itemId || "",
              porcentaje,
              porcentajePredeterminado: porcentaje,
              presupuestoDisponibleRubro,
              presupuestoAsignado: proyecto.presupuestoAsignado || 0,
              presupuestoAsignadoCalculado,
            };
          })
        );

        this.actualizarErrorValidacionPresupuestoEdit();
      } finally {
        this.loadingPresupuestoEdit = false;
      }
    },
    cerrarModalPresupuestoAsignado() {
      this.state.showModalPresupuestoAsignado = false;
      this.proyectosPresupuestoEdit = [];
      this.errorValidacionPresupuestoEdit = "";
      this.loadingPresupuestoEdit = false;
    },
    calcularPresupuestoPorPorcentaje(disponible, porcentaje) {
      const disponibleRubro = Number(disponible) || 0;
      const pct = Number(porcentaje) || 0;
      return Math.round((disponibleRubro * pct) / 100);
    },
    calcularPorcentajeDesdePresupuesto(disponible, asignado) {
      const disponibleRubro = Number(disponible) || 0;
      const asignadoNum = Number(asignado) || 0;
      if (disponibleRubro <= 0) return 0;
      return Math.min(100, Math.round((asignadoNum / disponibleRubro) * 100));
    },
    onInputPresupuestoAsignado(e) {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      const value = raw ? parseInt(raw, 10) : "";
      this.nuevoProyecto.presupuestoAsignadoInput = value;
      this.nuevoProyecto.porcentaje = this.porcentajeCalculadoDesdePresupuesto;
      this.onChangePresupuestoNuevoProyecto();
    },
    onKeydownNumerico(e) {
      const permitidos = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
      if (permitidos.indexOf(e.key) !== -1) return;
      if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].indexOf(e.key.toLowerCase()) !== -1) return;
      if (e.key < "0" || e.key > "9") {
        e.preventDefault();
      }
    },
    onChangePorcentajeEdit(editIndex) {
      const proyectoEdit = this.proyectosPresupuestoEdit[editIndex];
      if (!proyectoEdit) return;

      let porcentaje = Number(proyectoEdit.porcentaje) || 0;
      if (porcentaje < 0) {
        porcentaje = 0;
      }

      proyectoEdit.porcentaje = porcentaje;
      proyectoEdit.presupuestoAsignado = this.calcularPresupuestoPorPorcentaje(
        proyectoEdit.presupuestoDisponibleRubro,
        porcentaje
      );

      this.actualizarErrorValidacionPresupuestoEdit();
    },
    onInputPresupuestoEdit(editIndex, e) {
      const proyectoEdit = this.proyectosPresupuestoEdit[editIndex];
      if (!proyectoEdit) return;

      const raw = e.target.value.replace(/[^0-9]/g, "");
      const value = raw ? parseInt(raw, 10) : 0;
      proyectoEdit.presupuestoAsignado = value;
      proyectoEdit.porcentaje = this.calcularPorcentajeDesdePresupuesto(
        proyectoEdit.presupuestoDisponibleRubro,
        value
      );

      this.actualizarErrorValidacionPresupuestoEdit();
    },
    actualizarErrorValidacionPresupuestoEdit() {
      const error = this.validarPorcentajesPresupuestoEdit();
      this.errorValidacionPresupuestoEdit = error || "";
      return !error;
    },
    validarPorcentajesPresupuestoEdit() {
      const presupuestoInvalido = this.proyectosPresupuestoEdit.find(
        (proyecto) => !proyecto.presupuestoAsignado || proyecto.presupuestoAsignado <= 0
      );
      if (presupuestoInvalido) {
        return "El presupuesto asignado es obligatorio para cada proyecto y debe ser mayor a 0.";
      }

      return null;
    },
    onChangePresupuestoNuevoProyecto() {
      this.errorPorcentajeNuevoProyecto = "";

      if (
        !this.nuevoProyecto.planAbastecimientoId ||
        !this.nuevoProyecto.itemId
      ) {
        return;
      }

      const asignado = Number(this.nuevoProyecto.presupuestoAsignadoInput) || 0;

      if (asignado < 0) {
        this.nuevoProyecto.presupuestoAsignadoInput = 0;
      }

      this.nuevoProyecto.porcentaje = this.porcentajeCalculadoDesdePresupuesto;
    },
    validarPresupuestoNuevoProyecto() {
      if (
        !this.nuevoProyecto.planAbastecimientoId ||
        !this.nuevoProyecto.itemId ||
        this.nuevoProyecto.presupuestoAsignadoInput <= 0
      ) {
        return "Presupuesto y campos seleccionados son obligatorios para crear el proyecto.";
      }

      return null;
    },
    guardarPresupuestoAsignado() {
      if (!this.actualizarErrorValidacionPresupuestoEdit()) {
        alert(this.errorValidacionPresupuestoEdit);
        return;
      }

      this.proyectosPresupuestoEdit.forEach((proyectoEdit, index) => {
        const proyecto = this.solicitud.proyectos[index];
        if (!proyecto) return;

        proyecto.porcentaje = proyectoEdit.porcentaje;
        proyecto.presupuestoAsignado = proyectoEdit.presupuestoAsignado;
        proyecto.presupuestoDisponibleRubro =
          proyectoEdit.presupuestoDisponibleRubro;
      });

      this.actualizarPresupuestoGlobal();
      this.cerrarModalPresupuestoAsignado();
    },
    restaurarPresupuestoAsignadoCalculado() {
      this.proyectosPresupuestoEdit.forEach((proyectoEdit) => {
        const disponible = proyectoEdit.presupuestoDisponibleRubro || 0;
        const presupuestoBase = proyectoEdit.presupuestoAsignadoCalculado || 0;

        let porcentaje = proyectoEdit.porcentajePredeterminado || 0;
        if (porcentaje <= 0 && disponible > 0 && presupuestoBase > 0) {
          porcentaje = Math.round((presupuestoBase / disponible) * 100);
        }

        proyectoEdit.porcentaje = porcentaje;
        proyectoEdit.presupuestoAsignado = this.calcularPresupuestoPorPorcentaje(
          disponible,
          porcentaje
        );
      });

      if (!this.actualizarErrorValidacionPresupuestoEdit()) {
        return;
      }

      this.proyectosPresupuestoEdit.forEach((proyectoEdit, index) => {
        const proyecto = this.solicitud.proyectos[index];
        if (!proyecto) return;

        proyecto.porcentaje = proyectoEdit.porcentaje;
        proyecto.presupuestoAsignado = proyectoEdit.presupuestoAsignado;
        proyecto.presupuestoDisponibleRubro =
          proyectoEdit.presupuestoDisponibleRubro;
      });

      this.actualizarPresupuestoGlobal();
      this.cerrarModalPresupuestoAsignado();
    },
    normalizarRubroId(rubro) {
      if (!rubro) return "";
      const id =
        rubro.id != null
          ? rubro.id
          : rubro.rubroId != null
            ? rubro.rubroId
            : rubro.item != null
              ? rubro.item
              : rubro.codigo != null
                ? rubro.codigo
                : rubro;
      return id != null ? String(id) : "";
    },
    rubroCoincideConItemId(rubro, itemId) {
      if (!rubro || itemId == null || itemId === "") return false;
      return this.normalizarRubroId(rubro) === String(itemId);
    },
    getPresupuestoDisponibleRubro(rubro) {
      if (!rubro) return 0;

      if (rubro.availableBudget != null) {
        return Math.max(0, Number(rubro.availableBudget) || 0);
      }

      const total =
        rubro.totalBudget != null
          ? rubro.totalBudget
          : rubro.valorPresupuesto != null
            ? rubro.valorPresupuesto
            : rubro.presupuesto != null
              ? rubro.presupuesto
              : rubro.valor != null
                ? rubro.valor
                : 0;
      const usado =
        rubro.usedBudget != null
          ? rubro.usedBudget
          : rubro.presupuestoUsado != null
            ? rubro.presupuestoUsado
            : 0;
      return Math.max(0, Number(total) - Number(usado));
    },
    async cargarPlanes() {
      this.loadingPlanes = true;
      try {
        const plans = await this.supplyPlansStore.fetchAllPlans();
        this.dropdowns.planes = Array.isArray(plans) ? plans : [];
      } catch (e) {
        console.error("Error al cargar planes", e);
        this.dropdowns.planes = [];
      } finally {
        this.loadingPlanes = false;
      }
    },
    async cargarRubros(planId) {
      this.dropdowns.rubros = [];
      this.nuevoProyecto.itemId = "";
      this.nuevoProyecto.porcentaje = 0;
      this.nuevoProyecto.presupuestoAsignadoInput = 0;
      this.errorPorcentajeNuevoProyecto = "";
      if (!planId) return;
      try {
        const rubros = await this.rubrosStore.fetchRubrosByPlanId(planId);
        this.dropdowns.rubros = Array.isArray(rubros) ? rubros : [];
      } catch (e) {
        console.error("Error al cargar rubros", e);
        this.dropdowns.rubros = [];
      }
    },
    alCambiarPlan() {
      this.nuevoProyecto.porcentaje = 0;
      this.nuevoProyecto.presupuestoAsignadoInput = 0;
      this.errorPorcentajeNuevoProyecto = "";
      this.cargarRubros(this.nuevoProyecto.planAbastecimientoId);
    },
    alCambiarRubro() {
      this.nuevoProyecto.porcentaje = 0;
      this.nuevoProyecto.presupuestoAsignadoInput = 0;
      this.errorPorcentajeNuevoProyecto = "";
    },
    async abrirModalProyecto() {
      Object.assign(this.nuevoProyecto, {
        planAbastecimientoId: "",
        itemId: "",
        porcentaje: 0,
        presupuestoAsignadoInput: "",
        productosServicios: [],
      });
      this.dropdowns.rubros = [];
      this.errorPorcentajeNuevoProyecto = "";
      this.state.showModalProyecto = true;
      await this.cargarPlanes();
    },
    agregarProyecto() {
      this.onChangePresupuestoNuevoProyecto();
      const errorPresupuesto = this.validarPresupuestoNuevoProyecto();
      if (errorPresupuesto) {
        this.errorPorcentajeNuevoProyecto = errorPresupuesto;
        alert(errorPresupuesto);
        return;
      }
      const plan = this.dropdowns.planes.find(
        (p) =>
          (p.id || p.planId || p.codigo || p) ===
          this.nuevoProyecto.planAbastecimientoId
      );
      const rubro = this.dropdowns.rubros.find(
        (r) =>
          (r.id || r.rubroId || r.item || r.codigo || r) ===
          this.nuevoProyecto.itemId
      );

      const proyectoFinal = {
        planAbastecimientoId: this.nuevoProyecto.planAbastecimientoId,
        planAbastecimiento: plan
          ? plan.nombre ||
          plan.name ||
          plan.descripcion ||
          plan.id ||
          plan.planId ||
          plan
          : "",
        itemId: this.nuevoProyecto.itemId,
        item: rubro
          ? rubro.nombre ||
          rubro.name ||
          rubro.descripcion ||
          rubro.item ||
          rubro.id ||
          rubro
          : "",
        porcentaje: this.nuevoProyecto.porcentaje,
        presupuestoDisponibleRubro: rubro
          ? this.getPresupuestoDisponibleRubro(rubro)
          : 0,
        presupuestoAsignado: this.presupuestoCalculado,
        presupuestoAsignadoCalculado: this.presupuestoCalculado,
        productosServicios: [],
      };

      this.solicitud.proyectos.push(proyectoFinal);
      this.actualizarPresupuestoGlobal();
      this.state.showModalProyecto = false;
    },
    removerProyecto(index) {
      this.solicitud.proyectos.splice(index, 1);
      this.actualizarPresupuestoGlobal();
    },
    actualizarPresupuestoGlobal() {
      const total = this.solicitud.proyectos.reduce(
        (acc, p) => acc + (p.presupuestoAsignado || 0),
        0
      );
      this.solicitud.presupuestoDisponible = total;
    },
    resetProductoForm() {
      Object.assign(this.nuevoProducto, {
        descripcion: "",
        cantidad: 1,
        unidadMedida: "",
        valorUnitario: "",
        fechaInicio: "",
        fechaFin: "",
      });
    },
    cerrarModalProducto() {
      this.state.showModalProducto = false;
      this.state.modoProducto = "agregar";
      this.state.proyectoSeleccionadoIndex = null;
      this.state.productoSeleccionadoIndex = null;
      this.resetProductoForm();
    },
    abrirModalProducto(proyectoIndex) {
      this.state.modoProducto = "agregar";
      this.state.proyectoSeleccionadoIndex = proyectoIndex;
      this.state.productoSeleccionadoIndex = null;
      this.resetProductoForm();
      this.state.showModalProducto = true;
    },
    abrirModalEditarProducto(proyectoIndex, productoIndex) {
      const proyecto = this.solicitud.proyectos[proyectoIndex];
      const producto =
        proyecto && proyecto.productosServicios
          ? proyecto.productosServicios[productoIndex]
          : null;
      if (!producto) return;

      this.state.modoProducto = "editar";
      this.state.proyectoSeleccionadoIndex = proyectoIndex;
      this.state.productoSeleccionadoIndex = productoIndex;
      Object.assign(this.nuevoProducto, { ...producto });
      this.state.showModalProducto = true;
    },
    validarProductoForm() {
      if (
        !this.nuevoProducto.descripcion ||
        this.nuevoProducto.cantidad <= 0 ||
        !this.nuevoProducto.unidadMedida ||
        !this.nuevoProducto.valorUnitario ||
        this.nuevoProducto.valorUnitario <= 0
      ) {
        alert(
          "Por favor complete correctamente todos los campos del producto (el valor unitario debe ser mayor a 0)."
        );
        return false;
      }

      if (this.nuevoProducto.unidadMedida === "SUSCRIPCIÓN") {
        if (!this.nuevoProducto.fechaInicio || !this.nuevoProducto.fechaFin) {
          alert("Para suscripciones, debe seleccionar las fechas de inicio y fin.");
          return false;
        }
        if (new Date(this.nuevoProducto.fechaInicio) >= new Date(this.nuevoProducto.fechaFin)) {
          alert("La fecha de inicio debe ser menor a la fecha de fin.");
          return false;
        }
      }

      return true;
    },
    guardarProducto() {
      if (!this.validarProductoForm()) return;

      const proyectoTarget =
        this.solicitud.proyectos[this.state.proyectoSeleccionadoIndex];
      if (!proyectoTarget) return;

      if (!proyectoTarget.productosServicios) {
        proyectoTarget.productosServicios = [];
      }

      if (this.state.modoProducto === "editar") {
        const productoIndex = this.state.productoSeleccionadoIndex;
        if (productoIndex === null || productoIndex < 0) return;
        proyectoTarget.productosServicios.splice(productoIndex, 1, {
          ...this.nuevoProducto,
        });
      } else {
        proyectoTarget.productosServicios.push({ ...this.nuevoProducto });
      }

      this.cerrarModalProducto();
    },
    removerProducto(pIndex, prodIndex) {
      this.solicitud.proyectos[pIndex].productosServicios.splice(prodIndex, 1);
    },
    calcularSubtotal(prod) {
      return prod.cantidad * prod.valorUnitario;
    },
    calcularTotalProyectoCalculado(proyecto) {
      const prods = proyecto.productosServicios || [];
      return prods.reduce(
        (acc, current) => acc + this.calcularSubtotal(current),
        0
      );
    },
    calcularTotalGlobal() {
      return this.solicitud.proyectos.reduce(
        (acc, proy) => acc + this.calcularTotalProyectoCalculado(proy),
        0
      );
    },
    formatoPesos(valor) {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(valor || 0);
    },
    formatoPesosSinSimbolo(valor) {
      if (valor === undefined || valor === null) return "0";
      return new Intl.NumberFormat("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(valor);
    },
    onInputValorUnitario(event) {
      const value = event.target.value.replace(/[^0-9]/g, "");
      const numericValue = value ? parseInt(value, 10) : "";
      this.nuevoProducto.valorUnitario = numericValue;
    },
  },
};
</script>

<style scoped>
.subscription-dates {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.subscription-range {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* ── Card General ── */
.card {
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.card-header {
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #84b24d, #75af7e, #4e9c4c);
  border-bottom: 2px solid #4e9c4c;
}

.card-step {
  display: block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.85);
  text-transform: uppercase;
}

.card-title {
  margin: 2px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
}

.card-body {
  padding: 1.25rem;
}

.mt-4 {
  margin-top: 1.5rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

/* ── Campos ── */
.field {
  margin-bottom: 1.25rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 12px;
  color: #6b6b6b;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.field-input {
  width: 100%;
  font-size: 14px;
  padding: 8px 10px;
  background: #f7f7f6;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  color: #1a1a1a;
  font-family: inherit;
  appearance: none;
  box-sizing: border-box;
  transition: border-color 0.15s ease;
}

.field-input:focus {
  outline: none;
  border-color: rgba(0, 0, 0, 0.3);
}

.field-input::placeholder {
  color: #b0b0b0;
}

.textarea-field {
  resize: vertical;
}

.row-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* ── Input con prefijo $ ── */
.input-prefix {
  display: flex;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
  background: #f7f7f6;
}

.prefix-symbol {
  padding: 8px 10px;
  font-size: 13px;
  color: #6b6b6b;
  border-right: 0.5px solid rgba(0, 0, 0, 0.08);
}

.input-prefix .field-input {
  border: none;
  border-radius: 0;
  background: transparent;
}

.input-prefix--readonly {
  background: #efefee;
}

.input-prefix--readonly .field-input:disabled,
.field-input--locked:disabled {
  color: #6b6b6b;
  cursor: not-allowed;
  pointer-events: none;
  user-select: none;
}

.presupuesto-edit-item__meta {
  margin-bottom: 0.5rem;
}

.presupuesto-edit-error {
  text-align: left;
  margin-top: 0.75rem;
}

/* ── Botones Generales ── */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
  background: #f7f7f6;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-add:hover {
  background: #efefee;
}

.btn-proyecto {
  background-color: #6DAB74;
  color: #ffffff;
  border: none;
}

.btn-proyecto:hover {
  background-color: #5EA465;
}

.btn-proyecto svg {
  stroke: #ffffff;
}

.btn-producto {
  background-color: #6DAB74;
  color: #ffffff;
  border: none;
}

.btn-producto:hover {
  background-color: #5EA465;
}

.btn-producto svg {
  stroke: #ffffff;
}

.btn-sm {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-remove {
  font-size: 12px;
  color: #D9534F;
  background: #FFFFFF;
  border: 1px solid #D9534F;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-remove:hover {
  background: #FFF4F3;
}

.btn-remove:active {
  background: #FDE8E7;
}

.btn-remove-header {
  border: 1px solid #D9534F;
  background: transparent;
  padding: 4px 10px;
  text-decoration: none;
  font-weight: 500;
}

.btn-remove-header:hover {
  background: #FFF4F3;
}

/* ── Estructura de Proyecto Nidado ── */
.project-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  margin-top: 1.5rem;
  background: #ffffff;
  overflow: hidden;
}

.project-card-header {
  background: #fcfcfc;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.project-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  background: #e0e0e0;
  color: #444;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 12px;
}

.project-card-body {
  padding: 16px;
}

.project-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-top: 16px;
  font-size: 13px;
  color: #6b6b6b;
}

.project-footer-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.project-total-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.project-total {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.project-total--manual {
  color: #4e9c4c;
}

.project-total-hint {
  font-size: 11px;
  color: #9e9e9e;
}

.icon-btn--sm {
  width: 28px;
  height: 28px;
}

/* ── Tabla de Productos ── */
.table-wrapper {
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.product-table thead tr {
  background: #f7f7f6;
}

.product-table th {
  padding: 8px 12px;
  text-align: left;
  font-weight: 500;
  color: #6b6b6b;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
}

.product-table td {
  padding: 9px 12px;
  color: #1a1a1a;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.06);
}

.product-table tbody tr:last-child td {
  border-bottom: none;
}

.col-actions {
  text-align: center;
  width: 120px;
}

.actions-group {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  background: #f7f7f6;
  color: #4e9c4c;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.icon-btn:hover {
  background: rgba(78, 156, 76, 0.1);
  border-color: rgba(78, 156, 76, 0.35);
}

.empty-row {
  color: #b0b0b0;
  padding: 20px 12px;
}

.empty-state {
  text-align: center;
  color: #9e9e9e;
  padding: 2rem;
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 13px;
  margin-top: 1rem;
}

/* ── Resumen Financiero ── */
.summary-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f7f7f6;
  border-radius: 8px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.summary-label {
  font-size: 13px;
  color: #6b6b6b;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

.summary-value.over-budget {
  color: #c0392b;
}

.summary-warning {
  margin-top: 8px;
  font-size: 12px;
  color: #c0392b;
  font-weight: 500;
}

.cost-progress-section {
  margin-top: 1.25rem;
  text-align: left;
}

.cost-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #6b6b6b;
  margin-bottom: 8px;
}

.cost-progress-percent {
  font-weight: 700;
  color: #1a1a1a;
}

.cost-progress-track {
  width: 100%;
  height: 14px;
  background: #ececec;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.cost-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ef4444 0%, #f97316 55%, #fb923c 100%);
  transition: width 0.35s ease;
  min-width: 0;
}

.cost-progress-fill--over {
  background: linear-gradient(90deg, #b91c1c 0%, #ef4444 45%, #ea580c 100%);
  box-shadow: inset 0 0 0 1px rgba(185, 28, 28, 0.25);
}

.cost-progress-legend {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
  font-size: 12px;
  color: #6b6b6b;
  flex-wrap: wrap;
}

.cost-progress-legend strong {
  color: #1a1a1a;
}

.cost-progress-remaining {
  margin-top: 8px;
  font-size: 16px;
  color: #ea580c;
  font-weight: 500;
}

.global-project-totals {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.global-project-totals__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #6b6b6b;
}

.global-project-totals__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.global-project-totals__value {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.presupuesto-asignado-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
}

.presupuesto-asignado-hint {
  display: block;
  margin-top: 8px;
}

.presupuesto-edit-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.presupuesto-edit-item:last-of-type {
  border-bottom: none;
}

.presupuesto-edit-item__title {
  margin-bottom: 0.5rem;
}

.presupuesto-edit-grid {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 0.75rem;
}

.presupuesto-edit-grid--nuevo {
  grid-template-columns: 1fr 1fr;
}

/* ── Modal ── */
@keyframes modal-overlay-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modal-fade-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-overlay--fade-up {
  animation: modal-overlay-fade-in 0.25s ease-out;
}

.modal-box {
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.modal-box--fade-up {
  animation: modal-fade-up 0.35s ease-out;
}

.w-55 {
  width: 55vw;
  max-width: 900px;
}

.w-64 {
  width: 64vw;
  max-width: 1000px;
}

.w-77 {
  width: 77vw;
  max-width: 1200px;
}

.w-80 {
  width: 80vw;
  max-width: 1300px;
}

.w-87 {
  width: 87vw;
  max-width: 1400px;
}

.modal-header {
  padding: 0.875rem 1.25rem;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  color: #9e9e9e;
  cursor: pointer;
  padding: 0;
}

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-body .field {
  margin-bottom: 0;
}

/* ── Detalle de Configuración en Modal ── */
.detail-box {
  margin-top: 1rem;
  background: #fdfdfd;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  padding: 1rem;
}

.detail-title {
  margin: 0 0 0.75rem;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.detail-item {
  margin-bottom: 0.75rem;
  font-size: 13px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-label {
  display: block;
  color: #6b6b6b;
  margin-bottom: 2px;
}

.detail-value {
  display: block;
  font-weight: 500;
  color: #1a1a1a;
}

.detail-sub {
  font-size: 12px;
  color: #888;
  margin-top: 3px;
}

.highlight-box {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(132, 178, 77, 0.1);
  border: 1px solid rgba(132, 178, 77, 0.3);
  border-radius: 6px;
}

.highlight-box .detail-label {
  color: #4e9c4c;
  font-weight: 600;
}

.highlight-text {
  font-size: 16px;
  color: #3e813c;
  font-weight: 700;
}

.budget-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.text-red {
  color: #c0392b;
}

.text-green {
  color: #27ae60;
}

.modal-footer {
  padding: 0.875rem 1.25rem;
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-cancel {
  font-size: 13px;
  color: #4A8F49;
  background: #FFFFFF;
  border: 1px solid #B7C8B2;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-cancel:hover {
  background: #F3F8F2;
}

.btn-cancel:active {
  background: #E8F2E6;
}

.btn-save {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  background: #539E52;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-save:hover {
  background: #4A8F49;
}

.btn-save:active {
  background: #3F7C3F;
}

.cost-progress-legend-item {
  font-size: 16px;
  font-weight: 400;
  color: #6b6b6b;
}
</style>
