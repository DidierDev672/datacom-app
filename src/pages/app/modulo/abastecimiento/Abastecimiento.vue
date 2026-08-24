<template>
  <div class="abastecimiento-page">
    <!-- Header de página optimizado -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">{{ isEditMode ? 'Editar Orden' : 'Nueva Solicitud' }}</h1>
        <span class="page-subtitle">Módulo de Abastecimiento</span>
      </div>
      <q-btn flat icon="arrow_back" color="grey-7" label="Volver" @click="$router.back()" no-caps />
    </div>

    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          flat
          bordered
          header-class="stepper-header-premium"
          class="abastecimiento-stepper shadow-2"
        >
          <!-- PASO 1: INFORMACIÓN GENERAL -->
          <q-step
            :name="1"
            title="General"
            icon="info"
            :done="step > 1"
          >
            <div class="step-content">
              <div class="section-info">
                <h2 class="section-title">Información de Identificación</h2>
                <p class="section-desc">Defina la subdirección responsable y la necesidad principal de la solicitud.</p>
              </div>
              
              <div class="form-container q-gutter-y-lg">
                <div class="field-group">
                  <label class="field-label">Subdirección Responsable</label>
                  <q-select
                    v-model="abastecimiento.subdireccion"
                    :options="subdirecciones"
                    outlined dense
                    placeholder="Seleccione la subdirección..."
                    class="field-input"
                  />
                </div>

                <div class="field-group">
                  <label class="field-label">Descripción de la Necesidad</label>
                  <q-input
                    v-model="abastecimiento.descripcion"
                    type="textarea"
                    outlined dense
                    rows="4"
                    placeholder="Detalle de forma clara el propósito de esta solicitud..."
                    class="field-input"
                    :rules="[requiredRule]"
                  />
                </div>
              </div>
            </div>
          </q-step>

          <!-- PASO 2: INFORMACIÓN FINANCIERA -->
          <q-step
            :name="2"
            title="Financiero"
            icon="account_balance_wallet"
            :done="step > 2"
          >
            <div class="step-content">
              <div class="section-info">
                <h2 class="section-title">Centro de Costo y Presupuesto</h2>
                <p class="section-desc">Asigne los proyectos relacionados y defina el nivel de aprobación requerido.</p>
              </div>

              <div class="form-container">
                <div class="table-card q-mb-xl">
                  <div class="table-header">
                    <span class="table-title">Proyectos Asignados</span>
                    <q-btn @click="showProjectModal" flat color="primary" icon="add" label="Agregar Proyecto" no-caps class="btn-add" />
                  </div>
                  <q-table
                    :data="projectData"
                    :columns="projectColumns"
                    row-key="id"
                    flat
                    :rows-per-page-options="[0]"
                    hide-bottom
                    class="modern-table"
                  >
                    <template v-slot:body-cell-accion="props">
                      <q-td :props="props" align="right">
                        <q-btn flat round dense color="negative" icon="delete" @click="removeProject(props.row)" />
                      </q-td>
                    </template>
                  </q-table>
                </div>

                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <div class="field-group">
                      <label class="field-label">Presupuesto Disponible</label>
                      <q-input
                        v-model="abastecimiento.availableBudget"
                        type="number"
                        outlined dense
                        prefix="$"
                        class="field-input"
                        :rules="[requiredRule]"
                      />
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="field-group">
                      <label class="field-label">Nivel de Aprobación</label>
                      <q-select
                        v-model="abastecimiento.nivelAprobacion"
                        :options="niveles"
                        outlined dense
                        class="field-input"
                        @input="onLevelChange"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-step>

          <!-- PASO 3: PRODUCTOS / SERVICIOS -->
          <q-step
            :name="3"
            title="Items"
            icon="inventory_2"
            :done="step > 3"
          >
            <div class="step-content">
              <div class="section-info">
                <h2 class="section-title">Detalle de Productos o Servicios</h2>
                <p class="section-desc">
                  Liste los ítems y, si cotiza con varios proveedores, selecciónelos aquí: por cada uno podrá
                  ingresar el precio u observaciones en la tabla.
                </p>
              </div>

              <div class="form-container">
                <div class="field-group q-mb-lg max-w-table">
                  <label class="field-label">Proveedores para precios por ítem</label>
                  <q-select
                    v-model="proveedoresInvitadosItems"
                    :options="opcionesProveedoresItems"
                    outlined
                    dense
                    multiple
                    emit-value
                    map-options
                    option-value="value"
                    option-label="label"
                    :loading="tercerosStore.loading"
                    placeholder="Seleccione uno o más proveedores…"
                    clearable
                    class="field-input"
                  />
                  <div class="text-caption text-grey-7 q-mt-xs">
                    Por cada proveedor elegido aparecerá un cuadro de texto en cada fila para el valor unitario u observaciones.
                  </div>
                </div>

                <div class="table-card q-mb-lg">
                  <div class="table-header">
                    <span class="table-title">Items de la Solicitud</span>
                    <q-btn @click="showProductModal" flat color="primary" icon="add" label="Agregar Item" no-caps class="btn-add" />
                  </div>
                  <q-table
                    :data="data"
                    :columns="columns"
                    row-key="id"
                    flat
                    :rows-per-page-options="[0]"
                    class="modern-table tabla-items-proveedores"
                  >
                    <template v-slot:body-cell-preciosProv="props">
                      <q-td :props="props" class="precios-prov-cell">
                        <div
                          v-if="!proveedoresInvitadosItems.length"
                          class="text-caption text-grey-7"
                        >
                          Seleccione proveedores arriba para habilitar los cuadros de precio.
                        </div>
                        <div v-else class="column q-gutter-md precios-prov-grid">
                          <div
                            v-for="pid in proveedoresInvitadosItems"
                            :key="'prec-' + props.row.id + '-' + String(pid)"
                            class="precio-proveedor-box"
                          >
                            <div class="precio-proveedor-box__titulo ellipsis">
                              {{ etiquetaProveedorPorId(pid) }}
                            </div>
                            <q-input
                              :value="valorPrecioItem(props.row, pid)"
                              type="textarea"
                              outlined
                              dense
                              :rows="3"
                              placeholder="Precio unitario, condiciones u observaciones"
                              class="precio-proveedor-box__textarea"
                              @input="setPrecioItem(props.row, pid, $event)"
                            />
                          </div>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-acciones="props">
                      <q-td :props="props" align="right">
                        <q-btn flat round dense color="negative" icon="delete" @click="eliminarProducto(props.row)" />
                      </q-td>
                    </template>
                    <template v-slot:bottom-row>
                      <q-tr class="bg-grey-1">
                        <q-td colspan="3" class="text-right text-weight-bold">Total estimado:</q-td>
                        <q-td class="text-right text-primary text-weight-bolder text-h6">
                          ${{ totalProductos }}
                        </q-td>
                        <q-td></q-td>
                      </q-tr>
                    </template>
                  </q-table>
                  <div class="text-caption text-grey-7 q-mt-sm q-px-sm">
                    El total usa el menor valor numérico indicado por proveedor en cada línea (si hay varios); si no hay precios por proveedor, se usa el valor del ítem al agregarlo.
                  </div>
                </div>

                <div class="field-group q-mt-md">
                  <label class="field-label">Observaciones Adicionales</label>
                  <q-input
                    v-model="abastecimiento.notes"
                    type="textarea"
                    outlined dense
                    rows="3"
                    class="field-input"
                  />
                </div>
              </div>
            </div>
          </q-step>

          <!-- PASO 4: ENTREGA -->
          <q-step
            :name="4"
            title="Entrega"
            icon="local_shipping"
            :done="step > 4"
          >
            <div class="step-content">
              <div class="section-info">
                <h2 class="section-title">Datos de Entrega</h2>
                <p class="section-desc">Indique dónde y a quién se le debe entregar el bien o servicio.</p>
              </div>

              <div class="form-container">
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <div class="field-group">
                      <label class="field-label">Departamento</label>
                      <q-input v-model="abastecimiento.shippingAddress.departamento" outlined dense class="field-input" :rules="[requiredRule]" />
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="field-group">
                      <label class="field-label">Municipio</label>
                      <q-input v-model="abastecimiento.shippingAddress.ciudad" outlined dense class="field-input" :rules="[requiredRule]" />
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="field-group">
                      <label class="field-label">Dirección Completa</label>
                      <q-input v-model="abastecimiento.shippingAddress.address" outlined dense class="field-input" :rules="[requiredRule]" />
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="field-group">
                      <label class="field-label">Contacto (Persona)</label>
                      <q-input v-model="abastecimiento.shippingAddress.contact" outlined dense class="field-input" :rules="[requiredRule]" />
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="field-group">
                      <label class="field-label">Teléfono de Contacto</label>
                      <q-input v-model="abastecimiento.shippingAddress.cellphone" outlined dense class="field-input" :rules="[requiredRule]" />
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="field-group">
                      <label class="field-label">Fecha Estimada de Entrega</label>
                      <q-input v-model="abastecimiento.shippingAddress.deliveryDate" outlined dense readonly class="field-input">
                        <template v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                              <q-date v-model="abastecimiento.shippingAddress.deliveryDate" mask="YYYY-MM-DD" :options="dateOptions" />
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="col-12 col-md-6 flex items-center">
                    <q-checkbox v-model="abastecimiento.requiereFlete" label="Requiere servicio de flete" color="primary" class="q-mt-sm" />
                  </div>
                  <div class="col-12">
                    <div class="field-group">
                      <label class="field-label">Garantías Requeridas</label>
                      <q-input v-model="abastecimiento.warranty" type="textarea" outlined dense rows="2" class="field-input" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-step>

          <!-- PASO 5: APROBADORES -->
          <q-step
            :name="5"
            title="Aprobadores"
            icon="how_to_reg"
            :done="step > 5"
          >
            <div class="step-content">
              <div class="section-info">
                <h2 class="section-title">Flujo de Autorización</h2>
                <p class="section-desc">Usuarios encargados de revisar y aprobar esta solicitud.</p>
              </div>

              <div class="form-container">
                <div class="table-card">
                  <div class="table-header">
                    <span class="table-title">Usuarios Aprobadores</span>
                    <q-btn @click="showAprobadorModal" flat color="primary" icon="add" label="Agregar Aprobador" no-caps class="btn-add" />
                  </div>
                  <q-table
                    :data="usuariosData"
                    :columns="usuariosColumns"
                    row-key="id"
                    flat
                    :rows-per-page-options="[0]"
                    class="modern-table"
                  >
                    <template v-slot:body-cell-acciones="props">
                      <q-td :props="props" align="right">
                        <q-btn flat round dense color="negative" icon="delete" @click="eliminarAprobador(props.row)" />
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </div>
            </div>
          </q-step>

          <!-- PASO 6: REVISIÓN FINAL -->
          <q-step
            :name="6"
            title="Resumen"
            icon="task_alt"
          >
            <div class="step-content">
              <div class="section-info">
                <h2 class="section-title">Revisión y Confirmación</h2>
                <p class="section-desc">Verifique que toda la información sea correcta antes de enviar.</p>
              </div>

              <div class="form-container summary-container">
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-md-6">
                    <q-card flat bordered class="summary-card">
                      <q-card-section>
                        <div class="summary-label">Subdirección</div>
                        <div class="summary-value">{{ abastecimiento.subdireccion ? abastecimiento.subdireccion.label : 'No definida' }}</div>
                        
                        <div class="summary-label q-mt-md">Total Estimado</div>
                        <div class="summary-value text-primary text-h6 text-weight-bold">${{ totalProductos }}</div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-card flat bordered class="summary-card">
                      <q-card-section>
                        <div class="summary-label">Destino</div>
                        <div class="summary-value">{{ abastecimiento.shippingAddress.ciudad }}, {{ abastecimiento.shippingAddress.departamento }}</div>
                        
                        <div class="summary-label q-mt-md">Contacto</div>
                        <div class="summary-value">{{ abastecimiento.shippingAddress.contact }}</div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
                
                <div class="row q-mt-xl justify-center">
                  <q-btn
                    @click="onSubmit"
                    :color="'primary'"
                    size="lg"
                    class="btn-submit"
                    :label="isEditMode ? 'Actualizar Solicitud' : 'Enviar Solicitud'"
                    no-caps
                  />
                </div>
              </div>
            </div>
          </q-step>

          <!-- Botones de navegación del stepper -->
          <template v-slot:navigation>
            <q-stepper-navigation class="stepper-nav q-px-xl q-pb-xl">
              <q-btn v-if="step > 1" flat color="grey-7" @click="$refs.stepper.previous()" label="Anterior" class="q-mr-sm" no-caps />
              <q-btn v-if="step < 6" @click="$refs.stepper.next()" color="primary" label="Siguiente" no-caps class="btn-next" />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </div>
    </div>

    <!-- Modales (Preservados) -->
    <agregar-project-form v-if="showProjectDialog" @close="closeProjectModal" @onSubmitProject="agregarProyecto" />
    <agregar-producto-form v-if="showProductDialog" @close="closeProductModal" @onSubmitProduct="agregarProducto" />
    <agregar-aprobador-form v-if="showAprobadorDialog" @close="closeAprobadorModal" @onSubmitAprobador="agregarAprobador" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AgregarProjectForm from 'components/abastecimiento/AgregarProjectForm';
import AgregarProductoForm from 'components/abastecimiento/AgregarProductoForm';
import AgregarAprobadorForm from 'components/abastecimiento/AgregarAprobadorForm';
import { uid } from 'quasar';
import { useTercerosStore } from 'src/piña/terceros';

export default {
  name: "Abastecimiento",
  components: { AgregarProjectForm, AgregarProductoForm, AgregarAprobadorForm },
  props: {
    orderId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      step: 1,
      abastecimiento: this.iniciarModeloAbastecimiento(),
      showProjectDialog: false,
      showProductDialog: false,
      showAprobadorDialog: false,
      subdirecciones: [],
      requiredRule: val => (val !== null && val !== '' && val !== undefined) || 'Este campo es obligatorio',
      proveedoresInvitadosItems: [],
      columns: [
        { name: 'item', required: true, label: 'Item', align: 'left', field: 'item', sortable: true },
        { name: 'cant', align: 'center', label: 'Cant.', field: 'cantidad', sortable: true },
        { name: 'und', label: 'Unidad', field: 'unidad', sortable: true },
        {
          name: 'preciosProv',
          label: 'Precios por proveedor',
          align: 'left',
          field: 'preciosPorProveedor',
          sortable: false,
          style: 'min-width: 280px; vertical-align: top;',
        },
        { name: 'acciones', label: '', field: 'acciones', align: 'right' }
      ],
      data: [],
      usuariosColumns: [
        { name: 'usuario', required: true, label: 'Usuario', align: 'left', field: 'nombre', sortable: true },
        { name: 'rol', align: 'center', label: 'Rol', field: 'rol', sortable: true },
        { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
        { name: 'acciones', label: '', field: 'acciones', align: 'right' }
      ],
      usuariosData: [],
      projectColumns: [
        { name: 'title', required: true, label: 'Proyecto', align: 'left', field: 'title', sortable: true },
        { name: 'porcentaje', align: 'center', label: '%', field: 'percentage', sortable: true, format: val => `${val}%` },
        { name: 'accion', align: 'right', label: '', field: 'accion' }
      ],
      projectData: [],
      niveles: [],
      isEditMode: false,
      originalOrderId: null
    };
  },
  created() {
    this.initializeComponent();
  },
  methods: {
    ...mapActions('projects', ['fetchProjects']),
    ...mapActions('orderSupply', ['createOrder', 'updateOrder', 'fetchApprovalLevels', 'fetchLevelApprovers', 'fetchOrderById']),
    ...mapActions('supplyPlans', ['fetchSupplyPlans']),

    initializeComponent() {
      this.subdirecciones = [
        { value: 1, label: 'Subdirección programática' },
        { value: 2, label: 'Subdirección administrativa' }
      ];
      this.fetchProjects();
      this.fetchApprovalLevels();
      this.fetchSupplyPlans();
      this.tercerosStore.fetchTerceros().catch(function () {});
      if (this.orderId) this.loadOrderForEdit();
    },

    resetComponent() {
      this.step = 1;
      this.abastecimiento = this.iniciarModeloAbastecimiento();
      this.data = [];
      this.usuariosData = [];
      this.projectData = [];
      this.isEditMode = false;
      this.originalOrderId = null;
      this.proveedoresInvitadosItems = [];
    },

    dateOptions(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(date) >= today;
    },

    async onLevelChange(selectedLevel) {
      if (selectedLevel && selectedLevel.value) {
        try {
          this.usuariosData = [];
          const currentUser = this.getUser;
          if (currentUser) {
            const response = await this.fetchLevelApprovers({ userId: currentUser, levelCode: selectedLevel.value });
            if (response) {
              const approversToAdd = [];
              if (response.voBoApprover) {
                approversToAdd.push({ id: uid(), username: response.voBoApprover.userId, nombre: response.voBoApprover.name, email: response.voBoApprover.email, rol: 'VoBo' });
              }
              if (response.decisionApprover) {
                approversToAdd.push({ id: uid(), username: response.decisionApprover.userId, nombre: response.decisionApprover.name, email: response.decisionApprover.email, rol: 'Autorizador' });
              }
              this.usuariosData = approversToAdd;
            }
          }
        } catch (error) {
          console.error('Error loading approvers:', error);
        }
      }
    },

    iniciarModeloAbastecimiento() {
      return {
        id: "",
        subdireccion: '',
        descripcion: '',
        availableBudget: 0,
        nivelAprobacion: '',
        notes: '',
        warranty: '',
        requiereFlete: false,
        shippingAddress: { departamento: '', ciudad: '', contact: '', cellphone: '', deliveryDate: '', address: '' },
        details: [],
        approvers: [],
        projects: []
      }
    },

    async onSubmit() {
      try {
        const orderData = {
          id: this.isEditMode ? this.originalOrderId : uid(),
          subdireccion: this.abastecimiento.subdireccion.label,
          availableBudget: this.abastecimiento.availableBudget,
          approvalLevel: this.abastecimiento.nivelAprobacion.value,
          description: this.abastecimiento.descripcion,
          notes: this.abastecimiento.notes,
          warranty: this.abastecimiento.warranty,
          ownerUserId: this.getUser,
          requiereFlete: this.abastecimiento.requiereFlete,
          shippingAddress: this.abastecimiento.shippingAddress,
          details: this.data.map(item => ({
            id: item.id || uid(),
            productName: item.item,
            quantity: item.cantidad,
            unit: item.unidad,
            unitPrice: this.representativeUnitPrice(item),
            supplierUnitPrices: this.serializeSupplierPrices(item),
          })),
          approvers: this.usuariosData.map(user => ({ id: user.id || uid(), userId: user.username, email: user.email, userPosition: user.rol, approved: user.approved || false, approvalDate: user.approvalDate || null })),
          planItems: this.projectData.map(project => ({ id: project.id || uid(), planItemId: project.projectId, percentage: project.percentage, planItemDescription: project.title }))
        };

        if (this.isEditMode) {
          await this.updateOrder(orderData);
          this.$q.notify({ color: 'positive', message: 'Orden actualizada', icon: 'check' });
        } else {
          await this.createOrder(orderData);
          this.$q.notify({ color: 'positive', message: 'Orden creada', icon: 'check' });
        }
        this.$router.push({ name: 'mis-ordenes-abastecimiento' });
      } catch (error) {
        this.$q.notify({ color: 'negative', message: 'Error al procesar la orden', icon: 'error' });
      }
    },

    removeProject(item) { this.projectData = this.projectData.filter(p => p.id != item.id); },
    showProjectModal() { this.showProjectDialog = true; },
    closeProjectModal() { this.showProjectDialog = false; },
    agregarProyecto(data) {
      this.projectData.unshift({ id: data.id, percentage: data.percentage, projectId: data.supplyPlanItem.id, title: data.supplyPlan.name + ' - ' + data.supplyPlanItem.name });
      this.closeProjectModal();
    },
    showProductModal() { this.showProductDialog = true; },
    closeProductModal() { this.showProductDialog = false; },
    agregarProducto(data) {
      var row = Object.assign({}, data, { preciosPorProveedor: {} });
      var seed =
        data.valor != null && data.valor !== ''
          ? String(data.valor)
          : '';
      var self = this;
      (this.proveedoresInvitadosItems || []).forEach(function (pid) {
        self.$set(row.preciosPorProveedor, String(pid), seed);
      });
      this.data.unshift(row);
      this.closeProductModal();
    },
    showAprobadorModal() { this.showAprobadorDialog = true; },
    closeAprobadorModal() { this.showAprobadorDialog = false; },
    agregarAprobador(data) { this.usuariosData.unshift(data); this.closeAprobadorModal(); },
    eliminarProducto(row) { this.data = this.data.filter(item => item.id !== row.id); },
    eliminarAprobador(row) { this.usuariosData = this.usuariosData.filter(item => item.id !== row.id); },

    async loadOrderForEdit() {
      if (this.orderId) {
        try {
          this.isEditMode = true;
          this.originalOrderId = this.orderId;
          const orderData = await this.fetchOrderById(this.orderId);
          this.abastecimiento.subdireccion = this.subdirecciones.find(s => s.label === orderData.subdireccion);
          this.abastecimiento.descripcion = orderData.description;
          this.abastecimiento.notes = orderData.notes;
          this.abastecimiento.warranty = orderData.warranty;
          this.abastecimiento.requiereFlete = orderData.requiereFlete;
          this.abastecimiento.availableBudget = orderData.availableBudget;
          if (orderData.shippingAddress) this.abastecimiento.shippingAddress = { ...orderData.shippingAddress };
          if (orderData.details) {
            this.data = orderData.details.map(function (d) {
              var precios =
                d.supplierUnitPrices && typeof d.supplierUnitPrices === 'object'
                  ? Object.assign({}, d.supplierUnitPrices)
                  : {};
              return {
                id: d.id,
                item: d.productName,
                cantidad: d.quantity,
                unidad: d.unit,
                valor: d.unitPrice,
                preciosPorProveedor: precios,
              };
            });
            var idsSet = {};
            var i;
            for (i = 0; i < this.data.length; i++) {
              var row = this.data[i];
              var keys = Object.keys(row.preciosPorProveedor || {});
              var j;
              for (j = 0; j < keys.length; j++) {
                idsSet[keys[j]] = true;
              }
            }
            this.proveedoresInvitadosItems = Object.keys(idsSet);
          }
          if (orderData.planItems) this.projectData = orderData.planItems.map(p => ({ id: p.id, projectId: p.planItemId, percentage: p.percentage, title: p.planItemDescription }));
          if (orderData.approvalLevel) {
            this.abastecimiento.nivelAprobacion = this.niveles.find(n => n.value === orderData.approvalLevel);
            if (orderData.approvers) this.usuariosData = orderData.approvers.map(a => ({ id: a.id, username: a.userId, nombre: a.userId, email: a.email, rol: a.userPosition, approved: a.approved, approvalDate: a.approvalDate }));
          }
        } catch (error) {
          console.error('Error loading order:', error);
        }
      }
    },

    etiquetaProveedorLabel(t) {
      if (!t) return '';
      if (t.tipoTercero === 'PERSONA_JURIDICA') {
        if (t.razonSocial) return t.razonSocial + ' — ' + (t.identificacion || '');
        return t.identificacion || String(t.id || '');
      }
      var n = ((t.nombres || '') + ' ' + (t.apellidos || '')).trim();
      if (n) return n + ' — ' + (t.identificacion || '');
      return t.identificacion || String(t.id || '');
    },
    resolverProveedorPorId(pid) {
      var list = this.tercerosStore.terceros || [];
      var i;
      for (i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(pid)) return list[i];
      }
      return null;
    },
    etiquetaProveedorPorId(pid) {
      var t = this.resolverProveedorPorId(pid);
      if (t) return this.etiquetaProveedorLabel(t);
      return 'Proveedor ' + pid;
    },
    sincronizarPreciosProveedorEnFilaItems(row, allowedIds) {
      if (!row.preciosPorProveedor) this.$set(row, 'preciosPorProveedor', {});
      var map = row.preciosPorProveedor;
      var self = this;
      Object.keys(map).forEach(function (key) {
        if (allowedIds.indexOf(key) === -1) self.$delete(map, key);
      });
      allowedIds.forEach(function (kid) {
        if (!(kid in map)) self.$set(map, kid, '');
      });
    },
    valorPrecioItem(row, pid) {
      var map = row.preciosPorProveedor || {};
      var k = String(pid);
      return map[k] != null ? map[k] : '';
    },
    setPrecioItem(row, pid, raw) {
      if (!row.preciosPorProveedor) this.$set(row, 'preciosPorProveedor', {});
      var k = String(pid);
      var val = raw;
      if (
        raw != null &&
        typeof raw === 'object' &&
        raw.target != null &&
        raw.target.value !== undefined
      ) {
        val = raw.target.value;
      }
      this.$set(row.preciosPorProveedor, k, val != null ? String(val) : '');
    },
    parsePrecioTexto(item, pid) {
      var map = item.preciosPorProveedor || {};
      var raw = map[String(pid)];
      if (raw == null || raw === '') return 0;
      var s = String(raw).replace(/\s/g, '');
      var match = s.match(/[\d]+(?:[.,]\d+)*/);
      if (!match) return 0;
      var n = parseFloat(match[0].replace(',', '.'));
      return isNaN(n) ? 0 : n;
    },
    lineTotalEstimate(item) {
      var c = Number(item.cantidad);
      if (isNaN(c) || c < 0) c = 0;
      var inv = this.proveedoresInvitadosItems || [];
      if (!inv.length) {
        var v = Number(item.valor);
        return c * (isNaN(v) ? 0 : v);
      }
      var prices = [];
      var self = this;
      inv.forEach(function (pid) {
        var n = self.parsePrecioTexto(item, pid);
        if (n > 0) prices.push(n);
      });
      if (!prices.length) {
        var v2 = Number(item.valor);
        return c * (isNaN(v2) ? 0 : v2);
      }
      var minP = Math.min.apply(null, prices);
      return c * minP;
    },
    representativeUnitPrice(item) {
      var inv = this.proveedoresInvitadosItems || [];
      if (!inv.length) {
        var v = Number(item.valor);
        return isNaN(v) ? 0 : v;
      }
      var cands = [];
      var self = this;
      inv.forEach(function (pid) {
        var n = self.parsePrecioTexto(item, pid);
        if (n > 0) cands.push(n);
      });
      if (!cands.length) {
        var v2 = Number(item.valor);
        return isNaN(v2) ? 0 : v2;
      }
      return Math.min.apply(null, cands);
    },
    serializeSupplierPrices(item) {
      return Object.assign({}, item.preciosPorProveedor || {});
    },
  },
  computed: {
    ...mapGetters('orderSupply', ['getApprovalLevels']),
    ...mapGetters("auth", ["getUser"]),
    tercerosStore() {
      return useTercerosStore();
    },
    opcionesProveedoresItems() {
      var list = this.tercerosStore.terceros || [];
      var self = this;
      return list.map(function (t) {
        return {
          value: String(t.id),
          label: self.etiquetaProveedorLabel(t),
        };
      });
    },
    totalProductos() {
      var self = this;
      var sum = this.data.reduce(function (total, item) {
        return total + self.lineTotalEstimate(item);
      }, 0);
      return sum.toLocaleString('es-CO');
    },
    nivelOptions() {
      return this.getApprovalLevels.map(level => ({ label: level.description, value: level.code }));
    }
  },
  watch: {
    orderId: {
      handler(newId) {
        if (!newId) this.resetComponent();
        else if (newId !== this.originalOrderId) {
          this.resetComponent();
          this.$nextTick(() => this.loadOrderForEdit());
        }
      }
    },
    nivelOptions: {
      immediate: true,
      handler(newValue) { this.niveles = newValue; }
    },
    proveedoresInvitadosItems: {
      handler: function () {
        var allowed = (this.proveedoresInvitadosItems || []).map(function (id) {
          return String(id);
        });
        var self = this;
        this.data.forEach(function (row) {
          self.sincronizarPreciosProveedorEnFilaItems(row, allowed);
        });
      },
      deep: true,
    },
  }
};
</script>

<style scoped>
.abastecimiento-page {
  padding: 24px;
  background: #F5F7FA;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #4A5A63;
  margin: 0;
  letter-spacing: -0.03em;
}

.page-subtitle {
  color: #A7B1B7;
  font-size: 14px;
  font-weight: 500;
}

/* Stepper Customization */
.abastecimiento-stepper {
  border-radius: 16px;
  overflow: hidden;
  background: white;
}

::v-deep .stepper-header-premium {
  background: #FFFFFF;
  padding: 16px 24px;
  border-bottom: 1px solid #E8ECEF;
}

::v-deep .q-stepper__header--alternative-labels .q-stepper__tab {
  padding: 24px;
}

::v-deep .q-stepper__title {
  font-weight: 600;
  color: #6B7C85;
}

::v-deep .q-stepper__tab--active .q-stepper__title {
  color: #4E9C4C;
}

/* Step Content */
.step-content {
  padding: 32px 48px;
  max-width: 900px;
  margin: 0 auto;
}

.section-info {
  margin-bottom: 40px;
  text-align: center;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #4A5A63;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #6B7C85;
  font-size: 15px;
  max-width: 600px;
  margin: 0 auto;
}

/* Form Elements */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 600;
  color: #4A5A63;
  padding-left: 2px;
}

::v-deep .field-input .q-field__control {
  border-radius: 10px;
  transition: all 0.2s ease;
}

::v-deep .field-input .q-field__control:hover {
  background: #F9FAFB;
}

/* Tables */
.table-card {
  border: 1px solid #E8ECEF;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  padding: 16px 20px;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #E8ECEF;
}

.table-title {
  font-size: 15px;
  font-weight: 700;
  color: #4A5A63;
}

.modern-table {
  background: transparent;
}

::v-deep .modern-table thead th {
  background: #F1F5F9;
  color: #6B7C85;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.05em;
}

/* Summary Card */
.summary-card {
  border-radius: 12px;
  background: #F9FAFB;
}

.summary-label {
  font-size: 12px;
  color: #A7B1B7;
  font-weight: 600;
  text-transform: uppercase;
}

.summary-value {
  font-size: 16px;
  color: #4A5A63;
  font-weight: 500;
}

/* Navigation Buttons */
.stepper-nav {
  display: flex;
  justify-content: center;
}

.btn-next, .btn-submit {
  min-width: 160px;
  height: 48px;
  border-radius: 10px;
  font-weight: 700;
  background: linear-gradient(135deg, #84B24D 0%, #4E9C4C 100%) !important;
  box-shadow: 0 4px 12px rgba(78, 156, 76, 0.25);
}

.btn-next:hover, .btn-submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(78, 156, 76, 0.35);
}

.max-w-table {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.tabla-items-proveedores ::v-deep .q-table tbody td {
  vertical-align: top;
}

.precio-proveedor-box {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
}

.precio-proveedor-box__titulo {
  font-size: 12px;
  font-weight: 600;
  color: #4a5a63;
  margin-bottom: 8px;
  max-width: 100%;
}

.precio-proveedor-box__textarea ::v-deep textarea {
  min-height: 72px;
  resize: vertical;
}
</style>