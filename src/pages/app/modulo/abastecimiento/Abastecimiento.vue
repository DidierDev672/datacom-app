<template>
  <div>
    <div class="text-h6 page-title-box" >{{ isEditMode ? 'Editar solicitud de abastecimiento' : 'Solicitud de abastecimiento' }}</div>

    <div class="row">
      <div class="col-xs-12 col-md-8 offset-sm-2 q-ma-md">
          <q-form ref="solicitudForm" class="bg-white q-pa-md">
          <q-chip class="full-width q-py-md text-bold text-h6 q-mb-md" square color="info" text-color="white" icon="ti-minus">
            Datos de la solicitud
          </q-chip>
  
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-md-3">
              <p class="text-h6">General</p>
              <p>Información general de identificación de la solicitud</p>
            </div>
            <div class="col-xs-12 col-md-9">
              <div class="q-mb-md">
                <p class="text-weight-bold"></p>
                <!-- <q-input dense outlined v-model="abastecimiento.subdireccion" :rules="[requiredRule]" /> -->
                <q-select label="Seleccione una opción" dense outlined v-model="abastecimiento.subdireccion" :options="subdirecciones" />
              </div>
              <div>
                <p class="text-weight-bold">Descripción de la necesidad</p>
                <q-input type="textarea" dense outlined v-model="abastecimiento.descripcion" :rules="[requiredRule]" />
              </div>
            </div>
          </div>
  
          <q-chip class="full-width q-py-md text-bold text-h6 q-mb-md" square color="info" text-color="white" icon="ti-minus">
            Datos financieros
          </q-chip>
  
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-md-3">
              <p class="text-h6">Centro de costo</p>
              <p>Seleccione el proyecto y el centro de costo.</p>
            </div>
            <div class="col-xs-12 col-md-9">
              <div>
                <q-btn @click="showProjectModal" outline icon="add" no-caps label="Agregar proyecto" class="q-mb-sm" />
                <p class="text-weight-bold">Proyectos</p>
                <q-table
                  ref="projectTable"
                  flat
                  bordered
                  :rows-per-page-options="[0]"
                  :data="projectData"
                  :columns="projectColumns"
                  row-key="title"
                >
                <q-td slot="body-cell-accion" slot-scope="props" :props="props">
                  <q-btn flat
                        round
                        color="negative"
                        icon="delete" @click="removeProject(props.row)" />
                </q-td>
              </q-table>
              </div>
              <div>
                <p class="text-weight-bold q-mt-md">Nivel de aprobación</p>
                <q-select 
                    label="Seleccione un nivel" 
                    dense 
                    outlined 
                    v-model="abastecimiento.nivelAprobacion" 
                    :options="niveles"
                    @input="onLevelChange"
                />
              </div>
            </div>
          </div>

          <q-chip class="full-width q-py-md text-bold text-h6 q-mb-md" square color="info" text-color="white" icon="ti-minus">
            Detalle de productos o servicios
          </q-chip>
  
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-md-3">
              <p class="text-h6">Detalle de la orden</p>
              <p>Ingrese el detalle de su solicitud..</p>
            </div>
            <div class="col-xs-12 col-md-9">
              <div>
                <q-btn outline icon="add" no-caps label="Agregar detalle" class="q-mb-sm" @click="showProductModal" />
                <q-table
                  ref="productTable"
                  flat
                  bordered
                  :data="data"
                  :columns="columns"
                  row-key="name"
                >
                  <template v-slot:body-cell-acciones="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        @click="eliminarProducto(props.row)"
                      >
                        <q-tooltip>Eliminar producto</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                  <template v-slot:bottom>
                    <div class="row full-width">
                      <div class="col-12 text-right q-pr-md">
                        <span class="text-weight-bold">Total: ${{ totalProductos }}</span>
                      </div>
                    </div>
                  </template>
                </q-table>
              </div>

              <div class="col-xs-12 col-md-9">
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <p class="text-weight-bold">Observaciones</p>
                    <q-input type="textarea" dense outlined v-model="abastecimiento.notes" />
                  </div>
                </div>
              </div>  
              
            </div>
          </div>

          <q-chip class="full-width q-py-md text-bold text-h6 q-mb-md" square color="info" text-color="white" icon="ti-minus">
            Datos de la entrega
          </q-chip>
  
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-md-3">
              <p class="text-h6">Entrega del bien o servicio</p>
              <p>Suministre la dirección y los datos de la persona de contacto encargado de recibir el bien o servicio.</p>
            </div>
            <div class="col-xs-12 col-md-9">
              <div class="row q-col-gutter-sm">
                <div class="col">
                  <p class="text-weight-bold">Departamento</p>
                  <q-input dense outlined v-model="abastecimiento.shippingAddress.departamento" :rules="[requiredRule]" />
                </div>
                <div class="col">
                  <p class="text-weight-bold">Municipio</p>
                  <q-input dense outlined v-model="abastecimiento.shippingAddress.ciudad" :rules="[requiredRule]" />
                </div>
              </div>

              <div class="col-xs-12 col-md-9">
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <p class="text-weight-bold">Dirección</p>
                    <q-input dense outlined v-model="abastecimiento.shippingAddress.address" :rules="[requiredRule]" />
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-md-9">
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <p class="text-weight-bold">Contacto</p>
                    <q-input dense outlined v-model="abastecimiento.shippingAddress.contact" :rules="[requiredRule]" />
                  </div>
                  <div class="col">
                    <p class="text-weight-bold">Teléfono</p>
                    <q-input dense outlined v-model="abastecimiento.shippingAddress.cellphone" :rules="[requiredRule]" />
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-md-9">
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <p class="text-weight-bold">Fecha de entrega</p>
                    <q-input 
                      dense 
                      outlined 
                      v-model="abastecimiento.shippingAddress.deliveryDate" 
                      :rules="[requiredRule]"
                      readonly
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date 
                              v-model="abastecimiento.shippingAddress.deliveryDate"
                              mask="YYYY-MM-DD"
                              :options="dateOptions"
                              today-btn
                              @update:model-value="formatDeliveryDate"
                            />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col">
                    <p class="text-weight-bold">¿Requiere flete?</p>
                    <q-checkbox v-model="abastecimiento.requiereFlete" label="¿Requiere flete?" />
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-md-9">
                <div class="row q-col-gutter-sm">
                  <div class="col">
                    <p class="text-weight-bold">Garantías</p>
                    <q-input type="textarea" dense outlined v-model="abastecimiento.warranty" />
                  </div>
                </div>
              </div>              

            </div>
          </div>

          <q-chip class="full-width q-py-md text-bold text-h6 q-mb-md" square color="info" text-color="white" icon="ti-minus">
            Proceso de autorización
          </q-chip>
  
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-md-3">
              <p class="text-h6">Aprobadores</p>
              <p>Agregue las personas que deben aprobar esta solicitud.</p>
            </div>
            <div class="col-xs-12 col-md-9">
              <div>
                <q-btn outline icon="add" no-caps label="Agregar aprobador" class="q-mb-sm" @click="showAprobadorModal" />
                <q-table
                  ref="usuariosTable"
                  flat
                  bordered
                  :data="usuariosData"
                  :columns="usuariosColumns"
                  row-key="name"
                >
                  <template v-slot:body-cell-acciones="props">
                    <q-td :props="props">
                      <q-btn
                        flat
                        round
                        color="negative"
                        icon="delete"
                        @click="eliminarAprobador(props.row)"
                      >
                        <q-tooltip>Eliminar aprobador</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                </q-table>
              </div>
              
            </div>
          </div>
  
          <q-btn @click="onSubmit()" color="primary">{{ isEditMode ? 'Actualizar orden' : 'Crear orden' }}</q-btn>
          </q-form>
      </div>
    </div>

    <agregar-project-form
    v-if="showProjectDialog"
    @close="closeProjectModal"
    @onSubmitProject="agregarProyecto" />

    <agregar-producto-form
    v-if="showProductDialog"
    @close="closeProductModal"
    @onSubmitProduct="agregarProducto" />

    <agregar-aprobador-form
    v-if="showAprobadorDialog"
    @close="closeAprobadorModal"
    @onSubmitAprobador="agregarAprobador" />

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import AgregarProjectForm from 'components/abastecimiento/AgregarProjectForm';
import AgregarProductoForm from 'components/abastecimiento/AgregarProductoForm';
import AgregarAprobadorForm from 'components/abastecimiento/AgregarAprobadorForm';
import { uid } from 'quasar';

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
            abastecimiento: this.iniciarModeloAbastecimiento(), 
            showProjectDialog: false,
            showProductDialog: false,
            showAprobadorDialog: false,
            subdirecciones: [],     
            requiredRule: val => (val !== null && val !== '' && val !== undefined) || 'Este campo es obligatorio',
            selected: [],
            lastIndex: null,
            columns: [
                {
                    name: 'item',
                    required: true,
                    label: 'Item',
                    align: 'left',
                    field: row => row.item,
                    format: val => `${val}`,
                    sortable: true,
                    classes: 'bg-grey-2 ellipsis',
                    headerClasses: 'bg-secondary text-white'
                },
                { name: 'cant', align: 'center', label: 'Cant.', field: 'cantidad', sortable: true },
                { name: 'und', label: 'Unidad', field: 'unidad', sortable: true },
                { name: 'precio', label: 'Valor', field: 'valor' },
                { 
                    name: 'acciones',
                    label: 'Acciones',
                    field: 'acciones',
                    align: 'center',
                    sortable: false
                }
            ],
            data: [],
            usuariosColumns: [
                {
                    name: 'usuario',
                    required: true,
                    label: 'Usuario',
                    align: 'left',
                    field: row => row.nombre,
                    format: val => `${val}`,
                    sortable: true,
                    classes: 'bg-grey-2 ellipsis',
                    headerClasses: 'bg-secondary text-white'
                },
                { name: 'rol', align: 'center', label: 'Rol', field: 'rol', sortable: true },
                { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
                { 
                    name: 'acciones',
                    label: 'Acciones',
                    field: 'acciones',
                    align: 'center',
                    sortable: false
                }
            ],
            usuariosData: [],
            projectColumns: [
                {
                    name: 'title',
                    required: true,
                    label: 'Proyecto',
                    align: 'left',
                    field: row => row.title,
                    format: val => `${val}`,
                    sortable: true,
                    classes: 'bg-grey-2 ellipsis',
                    headerClasses: 'bg-secondary text-white'
                },
                { name: 'porcentaje', align: 'center', label: 'Porcentaje.', field: 'percentage', sortable: true },
                { name: 'accion', align: 'center', label: '.', field: 'accion' }
            ],
            projectData: [],
            niveles: [],
            isEditMode: false,
            originalOrderId: null
        };
    },
    created(){
        this.subdirecciones = [
            {
                value: 1,
                label: 'Subdirección programática'
            },
            {
                value: 2,
                label: 'Subdirección administrativa'
            }
        ]

        this.fetchProjects();
        this.fetchApprovalLevels();
        this.fetchSupplyPlans();
        
        // Cargar datos si es modo edición
        if (this.orderId) {
            this.loadOrderForEdit();
        }
    },
    methods: {
        ...mapActions('projects', ['fetchProjects']),
        ...mapActions('orderSupply', ['createOrder', 'fetchApprovalLevels', 'fetchLevelApprovers', 'fetchOrderById']),
        ...mapActions('supplyPlans', ['fetchSupplyPlans']),
        
        dateOptions(date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const selectedDate = new Date(date);
            return selectedDate >= today;
        },
        formatDeliveryDate(date) {
            if (!date) return;
            
            // Convertir la fecha al formato ISO que Spring Boot espera
            const [year, month, day] = date.split('-');
            const isoDate = new Date(year, month - 1, day);
            this.abastecimiento.shippingAddress.deliveryDate = isoDate.toISOString().split('T')[0];
        },
        
        // Nueva función para manejar el cambio de nivel
        async onLevelChange(selectedLevel) {
            console.log('Nivel seleccionado: ', selectedLevel.value)
            if (selectedLevel && selectedLevel.value) {
                try {
                    // Limpiar la tabla de usuarios aprobadores antes de cargar los nuevos
                    this.usuariosData = [];
                    
                    // Obtener el usuario actual
                    const currentUser = this.getUser;
                    if (currentUser) {
                        // Llamar a la API para obtener los usuarios aprobadores
                        const response = await this.fetchLevelApprovers({
                            userId: currentUser,
                            levelCode: selectedLevel.value
                        });
                        
                        // Procesar la respuesta y agregar usuarios a la tabla
                        if (response) {
                          console.log('Respuesta:', response);
                            const approversToAdd = [];
                            
                            // Agregar VoBo Approver si existe
                            if (response.voBoApprover) {
                                approversToAdd.push({
                                    id: uid(),
                                    username: response.voBoApprover.userId,
                                    nombre: response.voBoApprover.name,
                                    email: response.voBoApprover.email,
                                    rol: 'VoBo'
                                });
                            }
                            
                            // Agregar Decision Approver si existe
                            if (response.decisionApprover) {
                                approversToAdd.push({
                                    id: uid(),
                                    username: response.decisionApprover.userId,
                                    nombre: response.decisionApprover.name,
                                    email: response.decisionApprover.email,
                                    rol: 'Autorizador'
                                });
                            }
                            
                            // Agregar los usuarios a la tabla
                            this.usuariosData = approversToAdd;
                            
                            console.log('Usuarios aprobadores agregados:', this.usuariosData);
                        }
                        
                        // Mostrar notificación de éxito
                        this.$q.notify({
                            color: 'positive',
                            message: `Usuarios aprobadores cargados correctamente (${this.usuariosData.length} usuarios)`,
                            icon: 'check'
                        });
                    } else {
                        console.error('No se pudo obtener el usuario actual');
                        this.$q.notify({
                            color: 'negative',
                            message: 'Error: No se pudo obtener el usuario actual',
                            icon: 'error'
                        });
                    }
                } catch (error) {
                    console.error('Error al obtener los usuarios aprobadores:', error);
                    this.$q.notify({
                        color: 'negative',
                        message: 'Error al cargar los usuarios aprobadores',
                        icon: 'error'
                    });
                }
            }
        },
        
        iniciarModeloAbastecimiento(){
            return {
                id: "",
                subdireccion: '',
                descripcion: '',
                nivelAprobacion: '',
                notes: '',
                warranty: '',
                requiereFlete: false,
                shippingAddress: {
                    departamento: '',
                    ciudad: '',
                    contact: '',
                    cellphone: '',
                    deliveryDate: '',
                    address: ''
                },
                details: [],
                approvers: [],
                projects: []
            }
        },
        async onSubmit(){
            try {
                const orderData = {
                    id: this.isEditMode ? this.originalOrderId : uid(),
                    subdireccion: this.abastecimiento.subdireccion.label,
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
                        unitPrice: item.valor
                    })),
                    approvers: this.usuariosData.map(user => ({
                        id: user.id || uid(),
                        userId: user.username,
                        email: user.email,
                        userPosition: user.rol,
                        approved: user.approved || false,
                        approvalDate: user.approvalDate || null
                    })),
                    planItems: this.projectData.map(project => ({
                        id: project.id || uid(),
                        planItemId: project.projectId,
                        percentage: project.percentage,
                        planItemDescription: project.title
                    }))
                };

                await this.createOrder(orderData);
                this.$q.notify({
                    color: 'positive',
                    message: this.isEditMode ? 'Orden actualizada exitosamente' : 'Orden de abastecimiento creada exitosamente',
                    icon: 'check'
                });

                // Redirigir a la lista
                this.$router.push({ name: 'mis-ordenes-abastecimiento' });

            } catch (error) {
                this.$q.notify({
                    color: 'negative',
                    message: this.isEditMode ? 'Error al actualizar la orden' : 'Error al crear la orden de abastecimiento',
                    icon: 'error'
                });
                console.error('Error:', error);
            }
        },  
        removeProject(item){
            console.log('Item: ', item)
            this.projectData = this.projectData.filter(project => project.id != item.id);
        },
        showProjectModal(){
            this.showProjectDialog = true;
        },
        closeProjectModal(){
            this.showProjectDialog = false;
        },
        agregarProyecto(data){
            console.log('Proyecto a agregar: ', data);
            this.projectData.unshift({
                id: data.id,
                percentage: data.percentage,
                projectId: data.supplyPlanItem.id,
                title: data.supplyPlan.name + ' - ' + data.supplyPlanItem.name
            })
            this.closeProjectModal();
        },
        showProductModal(){
            this.showProductDialog = true;
        },
        closeProductModal(){
            this.showProductDialog = false;
        },
        agregarProducto(data){
            console.log('Producto a agregar: ', data);
            this.data.unshift(data);
            this.closeProductModal();
        },
        showAprobadorModal(){
            this.showAprobadorDialog = true;
        },
        closeAprobadorModal(){
            this.showAprobadorDialog = false;
        },
        agregarAprobador(data){
            console.log('Aprobador a agregar: ', data);
            this.usuariosData.unshift(data);
            this.closeAprobadorModal();
        },
        eliminarProducto(row) {
            this.data = this.data.filter(item => item.id !== row.id);
        },
        eliminarAprobador(row) {
            this.usuariosData = this.usuariosData.filter(item => item.id !== row.id);
        },
        async loadOrderForEdit() {
            if (this.orderId) {
                try {
                    this.isEditMode = true;
                    this.originalOrderId = this.orderId;
                    
                    const orderData = await this.fetchOrderById(this.orderId);
                    
                    // Cargar datos básicos
                    this.abastecimiento.subdireccion = this.subdirecciones.find(s => s.label === orderData.subdireccion);
                    this.abastecimiento.descripcion = orderData.description;
                    this.abastecimiento.notes = orderData.notes;
                    this.abastecimiento.warranty = orderData.warranty;
                    this.abastecimiento.requiereFlete = orderData.requiereFlete;
                    
                    // Cargar dirección de entrega
                    if (orderData.shippingAddress) {
                        this.abastecimiento.shippingAddress = { ...orderData.shippingAddress };
                    }
                    
                    // Cargar productos
                    if (orderData.details) {
                        this.data = orderData.details.map(detail => ({
                            id: detail.id,
                            item: detail.productName,
                            cantidad: detail.quantity,
                            unidad: detail.unit,
                            valor: detail.unitPrice
                        }));
                    }
                    
                    // Cargar proyectos
                    if (orderData.planItems) {
                        this.projectData = orderData.planItems.map(item => ({
                            id: item.id,
                            projectId: item.planItemId,
                            percentage: item.percentage,
                            title: item.planItemDescription
                        }));
                    }
                    
                    // Cargar nivel de aprobación y aprobadores
                    if (orderData.approvalLevel) {
                        this.abastecimiento.nivelAprobacion = this.niveles.find(n => n.value === orderData.approvalLevel);
                        
                        if (orderData.approvers) {
                            this.usuariosData = orderData.approvers.map(approver => ({
                                id: approver.id,
                                username: approver.userId,
                                nombre: approver.userId, // Ajustar si tienes el nombre completo
                                email: approver.email,
                                rol: approver.userPosition,
                                approved: approver.approved,
                                approvalDate: approver.approvalDate
                            }));
                        }
                    }
                    
                } catch (error) {
                    this.$q.notify({
                        color: 'negative',
                        message: 'Error al cargar los datos de la orden',
                        icon: 'error'
                    });
                    console.error('Error:', error);
                }
            }
        }
    },
    computed: {
        ...mapGetters('projects', ['getProjects']),
        ...mapGetters('orderSupply', ['getApprovalLevels', 'getLevelApprovers']),
        ...mapGetters("auth", ["getUser"]),
        
        totalProductos() {
            return this.data.reduce((total, item) => {
                return total + (item.cantidad * item.valor);
            }, 0).toLocaleString('es-CO');
        },
        
        nivelOptions() {
            return this.getApprovalLevels.map(level => ({
                label: level.description,
                value: level.code
            }));
        }
    },
    watch: {
        nivelOptions: {
            immediate: true,
            handler(newValue) {
                this.niveles = newValue;
            }
        }
    }
}
</script>

<style>

</style>