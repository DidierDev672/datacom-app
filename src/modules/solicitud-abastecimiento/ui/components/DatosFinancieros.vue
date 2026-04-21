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
            <input 
              type="text" 
              class="field-input" 
              :value="formatoPesosSinSimbolo(solicitud.presupuestoDisponible)"
              readonly
              disabled
            />
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
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
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
            <span class="badge">{{ p.porcentaje }}% ({{ formatoPesos(p.presupuestoAsignado) }})</span>
          </div>
          <button type="button" class="btn-remove btn-remove-header" @click="removerProyecto(pIndex)">Eliminar Proyecto</button>
        </div>
        <div class="project-card-body">
          <div class="mb-3">
             <button type="button" class="btn-add btn-sm btn-producto" @click="abrirModalProducto(pIndex)">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
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
                <tr v-if="!p.productosServicios || p.productosServicios.length === 0">
                  <td colspan="5" class="empty-row text-center">No hay productos agregados a este proyecto</td>
                </tr>
                <tr v-for="(prod, prodIndex) in p.productosServicios" :key="prodIndex">
                  <td>{{ prod.descripcion }}</td>
                  <td>{{ prod.cantidad }} {{ prod.unidadMedida }}</td>
                  <td>{{ formatoPesos(prod.valorUnitario) }}</td>
                  <td><strong>{{ formatoPesos(calcularSubtotal(prod)) }}</strong></td>
                  <td class="col-actions">
                    <button type="button" class="btn-remove" @click="removerProducto(pIndex, prodIndex)">Quitar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="project-footer">
            Total Proyecto: <span class="project-total">{{ formatoPesos(calcularTotalProyecto(p)) }}</span>
          </div>
        </div>
      </div>

      <!-- Resumen Global -->
      <div class="summary-box" v-if="solicitud.proyectos.length > 0">
        <div class="summary-label">Costo Global Estimado (Basado en Proyectos)</div>
        <div class="summary-value">
          {{ formatoPesos(solicitud.presupuestoDisponible) }}
        </div>
        <div class="summary-warning" v-if="calcularTotalGlobal() > solicitud.presupuestoDisponible">
          ⚠️ El detalle de productos ({{ formatoPesos(calcularTotalGlobal()) }}) supera el presupuesto disponible asignado.
        </div>
      </div>

      <!-- Observaciones -->
      <div class="field mt-4">
        <label class="field-label">Observaciones generales de productos y servicios</label>
        <textarea
          class="field-input textarea-field"
          rows="3"
          v-model="solicitud.observacionesProductos"
          placeholder="Observaciones adicionales o justificaciones..."
        ></textarea>
      </div>

    </div>

    <!-- Modal agregar proyecto -->
    <div class="modal-overlay" v-if="state.showModalProyecto" @click.self="state.showModalProyecto = false">
      <div class="modal-box">
        <div class="modal-header">
          <p class="modal-title">Registrar Proyecto de Abastecimiento</p>
          <button type="button" class="modal-close" @click.prevent="state.showModalProyecto = false">×</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label class="field-label">1. Plan de abastecimiento</label>
            <select class="field-input" v-model="nuevoProyecto.planAbastecimientoId" @change="alCambiarPlan">
              <option value="" disabled>Seleccionar...</option>
              <option v-for="(plan, index) in dropdowns.planes" :key="`plan-${index}`" :value="plan.id || plan.planId || plan.codigo || plan">
                {{ plan.nombre || plan.name || plan.descripcion || plan.id || plan.planId || plan }}
              </option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">2. Ítem</label>
            <select class="field-input" v-model="nuevoProyecto.itemId" :disabled="!nuevoProyecto.planAbastecimientoId">
              <option value="" disabled>Seleccionar...</option>
              <option v-for="(rubro, index) in dropdowns.rubros" :key="`rubro-${index}`" :value="rubro.id || rubro.rubroId || rubro.item || rubro.codigo || rubro">
                {{ rubro.nombre || rubro.name || rubro.descripcion || rubro.item || rubro.id || rubro }}
              </option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Porcentaje (%)</label>
            <input type="number" class="field-input" v-model.number="nuevoProyecto.porcentaje" placeholder="Ej: 50" min="1" max="100"/>
          </div>

          <div class="detail-box" v-if="planSeleccionado">
            <h6 class="detail-title">Resumen de la configuración</h6>
            
            <div class="detail-item">
              <span class="detail-label">Plan seleccionado:</span>
              <span class="detail-value">{{ planSeleccionado.nombre || planSeleccionado.descripcion || planSeleccionado.name || 'Sin nombre' }}</span>
              <div class="detail-sub">
                <strong>Año:</strong> {{ planSeleccionado.year || planSeleccionado.año || 'N/A' }} | 
                <strong>Estado:</strong> {{ planSeleccionado.status || planSeleccionado.estado || 'N/A' }}
              </div>
              <div class="detail-sub" v-if="planSeleccionado.startDate || planSeleccionado.fechaInicio">
                <strong>Vigencia Plan:</strong> {{ formatFecha(planSeleccionado.startDate || planSeleccionado.fechaInicio) }} - {{ formatFecha(planSeleccionado.endDate || planSeleccionado.fechaFin) || 'N/A' }}
              </div>
            </div>

            <div class="detail-item" v-if="rubroSeleccionado">
              <span class="detail-label">Ítem / Rubro seleccionado:</span>
              <span class="detail-value">{{ rubroSeleccionado.name || rubroSeleccionado.nombre || rubroSeleccionado.item || rubroSeleccionado.descripcion || 'Sin nombre' }}</span>
              <div class="detail-sub">
                <strong>Descripción:</strong> {{ rubroSeleccionado.description || rubroSeleccionado.descripcion || 'Sin descripción' }}
              </div>
              <div class="detail-sub">
                <strong>Vigencia Rubro:</strong> {{ formatFecha(rubroSeleccionado.startDate || rubroSeleccionado.fechaInicio) }} a {{ formatFecha(rubroSeleccionado.endDate || rubroSeleccionado.fechaFin) }}
              </div>
              
              <div class="budget-grid">
                <div class="budget-mini">
                  <span class="mini-label">Total Rubro</span>
                  <span class="mini-value">{{ formatoPesos(rubroSeleccionado.totalBudget || rubroSeleccionado.presupuesto || rubroSeleccionado.valor || 0) }}</span>
                </div>
                <div class="budget-mini">
                  <span class="mini-label">Usado</span>
                  <span class="mini-value text-red">{{ formatoPesos(rubroSeleccionado.usedBudget || rubroSeleccionado.presupuestoUsado || 0) }}</span>
                </div>
                <div class="budget-mini">
                  <span class="mini-label">Disponible</span>
                  <span class="mini-value text-green">{{ formatoPesos(getPresupuestoDisponibleRubro(rubroSeleccionado)) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-item highlight-box" v-if="rubroSeleccionado && nuevoProyecto.porcentaje > 0">
              <span class="detail-label">Presupuesto para esta Solicitud ({{ nuevoProyecto.porcentaje }}% del Disponible):</span>
              <span class="detail-value highlight-text">{{ formatoPesos(presupuestoCalculado) }}</span>
              <div class="detail-sub" v-if="presupuestoCalculado > getPresupuestoDisponibleRubro(rubroSeleccionado)">
                <strong class="text-red">⚠️ Alerta: Supera el disponible del rubro.</strong>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click.prevent="state.showModalProyecto = false">Cancelar</button>
          <button type="button" class="btn-save" @click="agregarProyecto">Añadir proyecto</button>
        </div>
      </div>
    </div>

    <!-- Modal agregar producto o servicio -->
    <div class="modal-overlay" v-if="state.showModalProducto" @click.self="state.showModalProducto = false">
      <div class="modal-box">
        <div class="modal-header">
          <p class="modal-title">Agregar producto a proyecto</p>
          <button type="button" class="modal-close" @click.prevent="state.showModalProducto = false">×</button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label class="field-label">1. Descripción del ítem</label>
            <input type="text" class="field-input" v-model="nuevoProducto.descripcion" placeholder="Ej: Computador portátil" />
          </div>
          <div class="field">
            <label class="field-label">2. Cantidad</label>
            <input type="number" class="field-input" v-model.number="nuevoProducto.cantidad" min="1" />
          </div>
          <div class="field">
            <label class="field-label">3. Unidad de medida</label>
            <select class="field-input" v-model="nuevoProducto.unidadMedida">
              <option value="" disabled>Seleccione unidad</option>
              <option v-for="u in unidadesDisponibles" :key="u" :value="u">{{ u }}</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">4. Valor unitario estimado</label>
            <div class="input-prefix">
              <span class="prefix-symbol">$</span>
              <input 
                type="text" 
                class="field-input" 
                :value="formatoPesosSinSimbolo(nuevoProducto.valorUnitario)"
                @input="onInputValorUnitario"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click.prevent="state.showModalProducto = false">Cancelar</button>
          <button type="button" class="btn-save" @click="agregarProducto">Añadir producto</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { useSolicitudStore } from '../store/useSolicitudStore';
import axios from 'axios';
import { URL_API } from '../../../../utils/config';

export default {
  name: 'DatosFinancieros',
  data() {
    return {
      unidadesDisponibles: ['UND', 'MTS', 'KG', 'GR', 'MGR', 'LT', 'HORA', 'DIA', 'MES', 'SERV'],
      state: {
        showModalProyecto: false,
        showModalProducto: false,
        proyectoSeleccionadoIndex: null
      },
      dropdowns: {
        planes: [],
        rubros: []
      },
      nuevoProyecto: {
        planAbastecimientoId: '',
        itemId: '',
        porcentaje: 0,
        productosServicios: []
      },
      nuevoProducto: {
        descripcion: '',
        cantidad: 1,
        unidadMedida: '',
        valorUnitario: 0
      }
    };
  },
  computed: {
    solicitud() {
      return useSolicitudStore().solicitud;
    },
    planSeleccionado() {
      if (!this.nuevoProyecto.planAbastecimientoId) return null;
      return this.dropdowns.planes.find(p => (p.id || p.planId || p.codigo || p) === this.nuevoProyecto.planAbastecimientoId);
    },
    rubroSeleccionado() {
      if (!this.nuevoProyecto.itemId) return null;
      return this.dropdowns.rubros.find(r => (r.id || r.rubroId || r.item || r.codigo || r) === this.nuevoProyecto.itemId);
    },
    presupuestoCalculado() {
      if (!this.rubroSeleccionado) return 0;
      // Calculamos sobre el disponible del rubro
      const disponible = this.getPresupuestoDisponibleRubro(this.rubroSeleccionado);
      const porcentaje = this.nuevoProyecto.porcentaje || 0;
      return (disponible * porcentaje) / 100;
    }
  },
  methods: {
    formatFecha(fecha) {
      if (!fecha) return 'N/A';
      // Si ya es un string formateado por el backend
      if (typeof fecha === 'string') return fecha;
      // Si es un objeto Calendar/Date
      try {
        const d = new Date(fecha);
        return d.toLocaleDateString('es-CO');
      } catch (e) {
        return String(fecha);
      }
    },
    getPresupuestoDisponibleRubro(rubro) {
       const total = rubro.totalBudget || rubro.presupuesto || rubro.valor || 0;
       const usado = rubro.usedBudget || rubro.presupuestoUsado || 0;
       return total - usado;
    },
    async cargarPlanes() {
      try {
        const res = await axios.get(`${URL_API}/api/v1/legacy/supply-plans`);
        this.dropdowns.planes = (res.data && res.data.data) ? res.data.data : (res.data || []);
      } catch (e) {
        console.error('Error al cargar planes', e);
      }
    },
    async cargarRubros(planId) {
      this.dropdowns.rubros = [];
      this.nuevoProyecto.itemId = ''; 
      if (!planId) return;
      try {
        const res = await axios.get(`${URL_API}/api/v1/rubros/plan/${planId}`);
        this.dropdowns.rubros = (res.data && res.data.data) ? res.data.data : (res.data || []);
      } catch (e) {
        console.error('Error al cargar rubros', e);
      }
    },
    alCambiarPlan() {
      this.cargarRubros(this.nuevoProyecto.planAbastecimientoId);
    },
    abrirModalProyecto() {
      if (this.dropdowns.planes.length === 0) {
        this.cargarPlanes();
      }
      Object.assign(this.nuevoProyecto, { planAbastecimientoId: '', itemId: '', porcentaje: 0, productosServicios: [] });
      this.state.showModalProyecto = true;
    },
    agregarProyecto() {
      if (!this.nuevoProyecto.planAbastecimientoId || !this.nuevoProyecto.itemId || this.nuevoProyecto.porcentaje <= 0) {
        alert("Porcentaje y campos seleccionados son obligatorios para crear el proyecto.");
        return;
      }
      const plan = this.dropdowns.planes.find(p => (p.id || p.planId || p.codigo || p) === this.nuevoProyecto.planAbastecimientoId);
      const rubro = this.dropdowns.rubros.find(r => (r.id || r.rubroId || r.item || r.codigo || r) === this.nuevoProyecto.itemId);
      
      const proyectoFinal = {
        planAbastecimientoId: this.nuevoProyecto.planAbastecimientoId,
        planAbastecimiento: plan ? (plan.nombre || plan.name || plan.descripcion || plan.id || plan.planId || plan) : '',
        itemId: this.nuevoProyecto.itemId,
        item: rubro ? (rubro.nombre || rubro.name || rubro.descripcion || rubro.item || rubro.id || rubro) : '',
        porcentaje: this.nuevoProyecto.porcentaje,
        presupuestoAsignado: this.presupuestoCalculado, // Guardamos el valor calculado
        productosServicios: []
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
      const total = this.solicitud.proyectos.reduce((acc, p) => acc + (p.presupuestoAsignado || 0), 0);
      this.solicitud.presupuestoDisponible = total;
    },
    abrirModalProducto(proyectoIndex) {
      this.state.proyectoSeleccionadoIndex = proyectoIndex;
      Object.assign(this.nuevoProducto, { descripcion: '', cantidad: 1, unidadMedida: '', valorUnitario: 0 });
      this.state.showModalProducto = true;
    },
    agregarProducto() {
      if (!this.nuevoProducto.descripcion || this.nuevoProducto.cantidad <= 0 || !this.nuevoProducto.unidadMedida || this.nuevoProducto.valorUnitario < 0) {
        alert("Por favor complete correctamente todos los campos del producto (montos no pueden ser negativos).");
        return;
      }
      const proyectoTarget = this.solicitud.proyectos[this.state.proyectoSeleccionadoIndex];
      if (!proyectoTarget.productosServicios) {
        proyectoTarget.productosServicios = [];
      }
      proyectoTarget.productosServicios.push({ ...this.nuevoProducto });
      this.state.showModalProducto = false;
    },
    removerProducto(pIndex, prodIndex) {
      this.solicitud.proyectos[pIndex].productosServicios.splice(prodIndex, 1);
    },
    calcularSubtotal(prod) {
      return prod.cantidad * prod.valorUnitario;
    },
    calcularTotalProyecto(proyecto) {
      const prods = proyecto.productosServicios || [];
      return prods.reduce((acc, current) => acc + this.calcularSubtotal(current), 0);
    },
    calcularTotalGlobal() {
      return this.solicitud.proyectos.reduce((acc, proy) => acc + this.calcularTotalProyecto(proy), 0);
    },
    formatoPesos(valor) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor || 0);
    },
    formatoPesosSinSimbolo(valor) {
      if (valor === undefined || valor === null) return '0';
      return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor);
    },
    onInputValorUnitario(event) {
      // Eliminar todo lo que no sea número
      const value = event.target.value.replace(/\D/g, '');
      const numericValue = value ? parseInt(value, 10) : 0;
      
      // Actualizar el modelo
      this.nuevoProducto.valorUnitario = numericValue;
      
      // Forzar el renderizado del input con el valor formateado
      event.target.value = this.formatoPesosSinSimbolo(numericValue);
    }
  }
}
</script>

<style scoped>
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
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
  border-bottom: 2px solid #4E9C4C;
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
  background-color: #6B7C85;
  color: #ffffff;
  border: none;
}
.btn-proyecto:hover {
  background-color: #5a6870;
}
.btn-proyecto svg {
  stroke: #ffffff;
}

.btn-producto {
  background-color: #A7B1B7;
  color: #ffffff;
  border: none;
}
.btn-producto:hover {
  background-color: #8c969b;
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
  color: #c0392b;
  background: none;
  border: 0.5px solid rgba(192, 57, 43, 0.3);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-remove:hover {
  background: rgba(192, 57, 43, 0.06);
}

.btn-remove-header {
  border: none;
  background: transparent;
  padding: 0;
  text-decoration: underline;
  font-weight: 500;
}
.btn-remove-header:hover {
  background: transparent;
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
  text-align: right;
  margin-top: 16px;
  font-size: 13px;
  color: #6b6b6b;
}

.project-total {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
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
  width: 80px;
}

.empty-row {
  color: #b0b0b0;
  padding: 20px 12px;
}

.empty-state {
  text-align: center;
  color: #9e9e9e;
  padding: 2rem;
  border: 1px dashed rgba(0,0,0,0.15);
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
  border: 1px solid rgba(0,0,0,0.08);
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

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: #ffffff;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  overflow: hidden;
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
  color: #4E9C4C;
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
  background: #f0f4f7;
  padding: 8px;
  border-radius: 6px;
}

.budget-mini {
  text-align: center;
}

.mini-label {
  display: block;
  font-size: 10px;
  text-transform: uppercase;
  color: #777;
  margin-bottom: 2px;
}

.mini-value {
  font-size: 11px;
  font-weight: 600;
  display: block;
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
  color: #6b6b6b;
  background: #f7f7f6;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
}

.btn-save {
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  background: #1a1a1a;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-save:hover {
  background: #333333;
}
</style>