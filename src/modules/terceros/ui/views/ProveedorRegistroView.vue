<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Header with Gradient -->
    <div class="registration-header q-mb-lg shadow-2">
      <div class="header-content q-pa-lg text-white text-center">
        <h1 class="text-h4 text-bold text-white q-ma-none">{{ isEditMode ? 'Editar proveedor' : 'Registro de Proveedores' }}</h1>
        <p class="q-mt-sm opacity-80 text-white text-subtitle1">
          {{ isEditMode ? 'Actualice la información del tercero y guarde los cambios.' : 'Gestión Unificada de Terceros - Datacom' }}
        </p>
      </div>
    </div>

    <!-- Barra de herramientas secundaria: importar Excel -->
    <div class="row justify-center q-mb-md">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card flat bordered class="excel-toolbar q-pa-sm">
          <div class="row items-center q-gutter-sm">
            <q-icon name="table_chart" color="positive" size="sm" />
            <span class="text-caption text-grey-7 text-weight-medium">Importar desde Excel</span>
            <q-space />
            <q-btn
              flat
              color="grey-7"
              icon="download"
              label="Descargar plantilla"
              size="sm"
              class="rounded-btn"
              @click="descargarPlantillaCSV"
            />
            <q-btn
              unelevated
              color="primary"
              icon="upload_file"
              label="Cargar Archivo (Excel/CSV)"
              size="sm"
              class="rounded-btn"
              @click="triggerFileInput"
            />
            <input
              ref="fileInputRef"
              type="file"
              accept=".xls,.xlsx,.csv"
              style="display:none"
              @change="onFileSelected"
            />

            <q-chip
              v-if="activeFileName"
              dense
              color="positive"
              text-color="white"
              icon="insert_drive_file"
              removable
              @remove="clearFile"
            >
              {{ activeFileName }}
            </q-chip>

            <q-btn
              v-if="activeFileName"
              flat
              dense
              color="secondary"
              icon="visibility"
              label="Ver Detalle"
              size="sm"
              class="q-ml-sm"
              @click="showPreviewModal = true"
            />
          </div>
        </q-card>
      </div>
    </div>

    <!-- Modal Previsualización CSV -->
    <q-dialog v-model="showPreviewModal" persistent max-width="95vw">
      <q-card style="width: 1300px; max-width: 95vw; min-height: 600px;">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6 text-white">Detalle de Importación (CSV)</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>

        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="tabla" label="Vista Tabla" icon="grid_view" />
          <q-tab name="raw" label="Contenido CSV" icon="description" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated>
          <q-tab-panel name="tabla" class="q-pa-none">
            <q-card-section>
              <div class="row items-center q-mb-sm">
                <p class="text-subtitle2 text-grey-7 q-mb-none">Seleccione los registros que desea cargar o importar.</p>
                <q-space />
                <q-chip
                  v-if="selectedRow.length > 0"
                  dense
                  color="primary"
                  text-color="white"
                  icon="check_circle"
                  class="q-mr-none"
                >
                  {{ selectedRow.length }} seleccionado{{ selectedRow.length > 1 ? 's' : '' }}
                </q-chip>
              </div>
              <q-table
                flat
                bordered
                :data="previewData || []"
                :columns="previewColumns || []"
                row-key="id_index"
                selection="multiple"
                :selected.sync="selectedRow"
                class="preview-table"
                :pagination="{ rowsPerPage: 10 }"
                style="height: 450px"
              >
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width>
                      <q-checkbox
                        v-model="allSelected"
                        :indeterminate="someSelected"
                        color="primary"
                        dense
                        @click.native="toggleSelectAll"
                      />
                    </q-th>
                    <q-th v-for="col in props.cols" :key="col.name" :props="props">
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <div class="row items-center justify-center q-gutter-xs">
                      <q-btn
                        flat
                        round
                        dense
                        color="blue"
                        icon="edit"
                        size="sm"
                        @click="openEditRow(props.row, props.pageIndex)"
                      >
                        <q-tooltip>Editar campos</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        dense
                        color="negative"
                        icon="delete"
                        size="sm"
                        @click="deleteRow(props.pageIndex)"
                      >
                        <q-tooltip>Eliminar ítem</q-tooltip>
                      </q-btn>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-tab-panel>

          <q-tab-panel name="raw">
            <q-card-section>
              <p class="text-subtitle2 text-grey-7 q-mb-md">Texto plano del archivo procesado (formato CSV):</p>
              <q-input
                v-model="csvResultado"
                type="textarea"
                filled
                readonly
                input-style="font-family: monospace; height: 400px; font-size: 12px; background: #f8f9fa;"
                label="CSV Generado"
              />
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cerrar" color="grey-7" v-close-popup />
          <q-btn
            v-if="activeTab === 'tabla' && previewData.length > 0"
            color="secondary"
            :label="selectedRow.length > 0 ? `Registrar seleccionados (${selectedRow.length})` : `Registrar todos (${previewData.length})`"
            icon="auto_fix_high"
            class="rounded-btn q-px-lg q-mr-sm"
            :loading="loading"
            @click="confirmarRegistroMasivo"
          />
          <q-btn
            v-if="activeTab === 'tabla'"
            color="primary"
            label="Importar al Formulario"
            icon="input"
            class="rounded-btn q-px-lg"
            :disable="!selectedRow || selectedRow.length !== 1"
            @click="importSelectedRow"
          >
            <q-tooltip v-if="selectedRow.length !== 1">Seleccione exactamente 1 registro para importar al formulario</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Editar Fila -->
    <q-dialog v-model="showEditRowModal" persistent>
      <q-card style="width: 700px; max-width: 90vw;">
        <q-card-section class="row items-center bg-blue text-white">
          <div class="text-h6 text-white">Editar Campos del Registro</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup color="white" />
        </q-card-section>

        <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
          <div class="row q-col-gutter-md">
            <div 
              v-for="col in CSV_COLUMNS" 
              :key="col" 
              class="col-12 col-sm-6"
            >
              <label class="text-caption text-grey-7 text-uppercase">{{ CANONICAL_LABELS[col] || col }}</label>
              <q-input
                v-model="editingRow[col]"
                outlined
                dense
                class="q-mt-xs"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn 
            color="blue" 
            label="Guardar Cambios" 
            icon="save"
            class="rounded-btn"
            @click="saveEditedRow" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Stepper Container -->
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card flat bordered class="stepper-card">
          <q-stepper
            v-model="step"
            ref="stepper"
            color="primary"
            animated
            header-class="text-weight-bold"
            class="custom-stepper"
          >
            <!-- STEP 1: IDENTIFICACION -->
            <q-step
              :name="1"
              title="Tipo de Tercero"
              icon="person_search"
              :done="step > 1"
            >
              <div class="section-title text-h6 q-mb-md">Información de Identificación</div>
              <p class="section-subtitle q-mb-lg">Seleccione el tipo de entidad y su documento legal</p>
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Tipo de Tercero</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.tipoTercero"
                    :options="options.tipoTercero"
                    emit-value
                    map-options
                    class="custom-input"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Tipo de Documento</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.identificacion.tipoDocumento"
                    :options="filteredDocumentTypes"
                    emit-value
                    map-options
                    class="custom-input"
                  />
                </div>
                <div class="col-12">
                  <label class="custom-label">Número de Documento / NIT</label>
                  <q-input
                    outlined
                    dense
                    v-model="formData.identificacion.numeroDocumento"
                    placeholder="Ej. 900.123.456-7"
                    class="custom-input"
                  />
                </div>
              </div>
            </q-step>

            <!-- STEP 2: INFORMACION BASICA Y CONTACTO -->
            <q-step
              :name="2"
              title="Información Básica"
              icon="business"
              :done="step > 2"
            >
              <div class="section-title text-h6 q-mb-md">Datos de Contacto y Representación</div>
              
              <!-- Persona Juridica -->
              <div v-if="formData.tipoTercero === 'PERSONA_JURIDICA'" class="row q-col-gutter-md">
                <div class="col-12">
                  <label class="custom-label">Razón Social</label>
                  <q-input outlined dense v-model="formData.informacionBasica.razonSocial" class="custom-input" />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Nombre Comercial</label>
                  <q-input outlined dense v-model="formData.informacionBasica.nombreComercial" class="custom-input" />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Representante Legal</label>
                  <q-input outlined dense v-model="formData.informacionBasica.representanteLegal" class="custom-input" />
                </div>
              </div>

              <!-- Persona Natural -->
              <div v-if="formData.tipoTercero === 'PERSONA_NATURAL'" class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Nombres</label>
                  <q-input outlined dense v-model="formData.informacionBasica.nombres" class="custom-input" />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Apellidos</label>
                  <q-input outlined dense v-model="formData.informacionBasica.apellidos" class="custom-input" />
                </div>
              </div>

              <q-separator class="q-my-lg" />
              
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Teléfono</label>
                  <q-input outlined dense v-model="formData.contacto.telefono" class="custom-input" />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Correo Electrónico</label>
                  <q-input outlined dense v-model="formData.contacto.email" type="email" class="custom-input" />
                </div>
                <div class="col-12">
                  <label class="custom-label">Dirección</label>
                  <q-input outlined dense v-model="formData.contacto.direccion" class="custom-input" />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Ciudad</label>
                  <q-input outlined dense v-model="formData.contacto.ciudad" class="custom-input" />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">País</label>
                  <q-input outlined dense v-model="formData.contacto.pais" class="custom-input" />
                </div>
              </div>
            </q-step>

            <!-- STEP 3: INFORMACION FINANCIERA -->
            <q-step
              :name="3"
              title="Finanzas"
              icon="account_balance"
              :done="step > 3"
            >
              <div class="section-title text-h6 q-mb-md">Información Bancaria</div>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Banco</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.informacionFinanciera.banco"
                    :options="options.bancos"
                    class="custom-input"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Tipo de Cuenta</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.informacionFinanciera.tipoCuenta"
                    :options="options.tiposCuenta"
                    class="custom-input"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Número de Cuenta</label>
                  <q-input outlined dense v-model="formData.informacionFinanciera.numeroCuenta" class="custom-input" />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Titular de la Cuenta</label>
                  <q-input outlined dense v-model="formData.informacionFinanciera.titularCuenta" class="custom-input" />
                </div>
              </div>
            </q-step>

            <!-- STEP 4: FORMA DE PAGO -->
            <q-step
              :name="4"
              title="Forma de pago"
              icon="payments"
              :done="step > 4"
            >
              <div class="section-title text-h6 q-mb-md">Condiciones de pago</div>
              <p class="section-subtitle q-mb-lg">
                Defina cómo se liquidan las obligaciones con este proveedor (contado, crédito por días o meses, cuotas y meses preferidos de pago). Inspiración típica de planes tipo crédito comercial (30/45/60 días o cuotas).
              </p>

              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <label class="custom-label">Forma de pago principal</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.formaPago.tipoFormaPago"
                    :options="options.formasPagoTipo"
                    emit-value
                    map-options
                    class="custom-input"
                  />
                </div>

                <div v-if="formData.formaPago.tipoFormaPago === 'CREDITO_DIAS'" class="col-12 col-sm-6">
                  <label class="custom-label">Días de crédito</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.formaPago.diasCredito"
                    :options="options.diasCreditoComercial"
                    emit-value
                    map-options
                    clearable
                    class="custom-input"
                    hint="Plazo desde la fecha de factura hasta el pago"
                  />
                </div>

                <div v-if="formData.formaPago.tipoFormaPago === 'CREDITO_MESES'" class="col-12 col-sm-6">
                  <label class="custom-label">Plazo total (meses)</label>
                  <q-input
                    outlined
                    dense
                    type="number"
                    :min="1"
                    :max="60"
                    v-model.number="formData.formaPago.mesesPlazo"
                    class="custom-input"
                    hint="Meses calendario para saldar la obligación"
                  />
                </div>

                <div v-if="formData.formaPago.tipoFormaPago === 'CUOTAS'" class="col-12 col-sm-6">
                  <label class="custom-label">Número de cuotas</label>
                  <q-input
                    outlined
                    dense
                    type="number"
                    :min="2"
                    :max="48"
                    v-model.number="formData.formaPago.numeroCuotas"
                    class="custom-input"
                    hint="Cantidad de pagos parciales acordados"
                  />
                </div>
                <div v-if="formData.formaPago.tipoFormaPago === 'CUOTAS'" class="col-12 col-sm-6">
                  <label class="custom-label">Plazo máximo (meses)</label>
                  <q-input
                    outlined
                    dense
                    type="number"
                    :min="1"
                    :max="60"
                    v-model.number="formData.formaPago.mesesPlazo"
                    class="custom-input"
                    hint="Opcional: meses para completar todas las cuotas"
                  />
                </div>

                <div class="col-12">
                  <label class="custom-label">Meses de pago / liquidación preferidos</label>
                  <q-select
                    outlined
                    dense
                    multiple
                    use-chips
                    v-model="formData.formaPago.mesesPago"
                    :options="options.mesesCalendario"
                    emit-value
                    map-options
                    class="custom-input"
                    hint="Opcional: meses del año en que normalmente se concilian pagos con este proveedor"
                  />
                </div>
              </div>
            </q-step>

            <!-- STEP 5: TRIBUTARIA Y CONTROL -->
            <q-step
              :name="5"
              title="Impuestos y Control"
              icon="fact_check"
            >
              <div class="section-title text-h6 q-mb-md">Configuración Tributaria y Estado</div>
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Régimen Tributario</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.informacionTributaria.regimen"
                    :options="options.regimenes"
                    class="custom-input"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Responsabilidades DIAN</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.informacionTributaria.responsabilidades"
                    :options="options.responsabilidades"
                    multiple
                    use-chips
                    class="custom-input"
                  />
                </div>
                <div class="col-12 col-sm-6 flex items-center">
                  <q-toggle
                    v-model="formData.informacionTributaria.agenteRetenedor"
                    label="¿Es agente retenedor?"
                    color="primary"
                    left-label
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <label class="custom-label">Estado de Control</label>
                  <q-select
                    outlined
                    dense
                    v-model="formData.estado"
                    :options="options.estados"
                    emit-value
                    map-options
                    class="custom-input"
                  />
                </div>
                <div class="col-12">
                  <label class="custom-label">Observaciones</label>
                  <q-input
                    outlined
                    dense
                    v-model="formData.observaciones"
                    type="textarea"
                    rows="3"
                    class="custom-input"
                  />
                </div>
              </div>
            </q-step>

            <!-- NAVIGATION BUTTONS -->
            <template v-slot:navigation>
              <q-stepper-navigation class="flex justify-between items-center q-mt-lg">
                <div class="row q-gutter-md">
                  <q-btn
                    v-if="step > 1"
                    flat
                    color="grey-7"
                    @click="$refs.stepper.previous()"
                    label="Anterior"
                    class="q-px-md"
                  />
                  <q-btn
                    outline
                    color="negative"
                    icon="refresh"
                    label="Limpiar Formulario"
                    @click="limpiarFormulario"
                    class="q-px-md rounded-btn"
                    flat
                  />
                </div>

                <q-btn
                  @click="onNext"
                  color="primary"
                  :label="step === 5 ? 'Finalizar Registro' : 'Siguiente'"
                  :loading="loading"
                  class="q-px-xl text-bold rounded-btn"
                />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent, reactive, ref, onMounted } from '@vue/composition-api';
import { useTercerosStore } from 'src/piña/terceros';
import * as XLSX from 'xlsx';

var PROVEEDOR_EDIT_STORAGE_KEY = 'proveedor_edit_payload';

export default defineComponent({
  name: 'ProveedorRegistroView',
  setup(props, { root }) {
    const $q = root.$q
    const store = useTercerosStore()

    const isEditMode = ref(false)

    // --- State / Refs ---
    const step = ref(1)
    const loading = ref(false)
    const stepper = ref(null)
    const showPreviewModal = ref(false)
    const activeFileName = ref('')
    const fileInputRef = ref(null)
    const excelFileName = ref('')
    const csvFileName = ref('')
    const csvResultado = ref('')
    const previewData = ref([])
    const previewColumns = ref([])
    const selectedRow = ref([])
    const activeTab = ref('tabla')

    // Computed for select-all checkbox state
    const allSelected = computed(() =>
      previewData.value.length > 0 && selectedRow.value.length === previewData.value.length
    )
    const someSelected = computed(() =>
      selectedRow.value.length > 0 && selectedRow.value.length < previewData.value.length
    )

    const toggleSelectAll = () => {
      if (allSelected.value || someSelected.value) {
        selectedRow.value = []
      } else {
        selectedRow.value = [...previewData.value]
      }
    }
    
    // Edit Row State
    const showEditRowModal = ref(false)
    const editingRow = ref({})
    const editingRowIndex = ref(-1)

    const formData = reactive({
      id: null,
      tipoTercero: 'PERSONA_JURIDICA',
      identificacion: {
        tipoDocumento: 'NIT',
        numeroDocumento: ''
      },
      informacionBasica: {
        razonSocial: '',
        nombreComercial: '',
        nombres: '',
        apellidos: '',
        representanteLegal: ''
      },
      contacto: {
        telefono: '',
        email: '',
        direccion: '',
        ciudad: '',
        pais: 'Colombia'
      },
      informacionFinanciera: {
        banco: '',
        tipoCuenta: 'Ahorros',
        numeroCuenta: '',
        titularCuenta: ''
      },
      formaPago: {
        tipoFormaPago: 'CONTADO',
        diasCredito: null,
        numeroCuotas: null,
        mesesPlazo: null,
        mesesPago: []
      },
      informacionTributaria: {
        regimen: '',
        responsabilidades: [],
        agenteRetenedor: false
      },
      estado: 'ACTIVO',
      observaciones: ''
    })

    const options = reactive({
      tipoTercero: [
        { label: 'Persona Jurídica', value: 'PERSONA_JURIDICA' },
        { label: 'Persona Natural', value: 'PERSONA_NATURAL' }
      ],
      tiposDocumento: [
        { label: 'NIT', value: 'NIT', type: 'PERSONA_JURIDICA' },
        { label: 'Cédula de Ciudadanía', value: 'CC', type: 'PERSONA_NATURAL' },
        { label: 'Cédula de Extranjería', value: 'CE', type: 'ANY' },
        { label: 'Pasaporte', value: 'PASAPORTE', type: 'ANY' }
      ],
      bancos: ['Bancolombia', 'Banco de Bogotá', 'Davivienda', 'BBVA', 'Itaú', 'Scotiabank', 'Nequi', 'Daviplata'],
      tiposCuenta: ['Ahorros', 'Corriente'],
      regimenes: ['Común', 'Simplificado', 'Gran Contribuyente', 'Autorretenedor'],
      responsabilidades: ['IVA', 'Renta', 'ICA', 'Retención'],
      estados: [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' },
        { label: 'Bloqueado', value: 'BLOQUEADO' }
      ],
      formasPagoTipo: [
        { label: 'Contado — sin crédito', value: 'CONTADO' },
        { label: 'Crédito por días (30/45/60…)', value: 'CREDITO_DIAS' },
        { label: 'Crédito por meses calendario', value: 'CREDITO_MESES' },
        { label: 'Pago en cuotas', value: 'CUOTAS' }
      ],
      diasCreditoComercial: [
        { label: '15 días', value: 15 },
        { label: '30 días', value: 30 },
        { label: '45 días', value: 45 },
        { label: '60 días', value: 60 },
        { label: '75 días', value: 75 },
        { label: '90 días', value: 90 },
        { label: '120 días', value: 120 }
      ],
      mesesCalendario: [
        { label: 'Enero', value: 1 },
        { label: 'Febrero', value: 2 },
        { label: 'Marzo', value: 3 },
        { label: 'Abril', value: 4 },
        { label: 'Mayo', value: 5 },
        { label: 'Junio', value: 6 },
        { label: 'Julio', value: 7 },
        { label: 'Agosto', value: 8 },
        { label: 'Septiembre', value: 9 },
        { label: 'Octubre', value: 10 },
        { label: 'Noviembre', value: 11 },
        { label: 'Diciembre', value: 12 }
      ]
    })

    // --- Computed ---
    const filteredDocumentTypes = computed(() => {
      return options.tiposDocumento.filter(opt =>
        opt.type === 'ANY' || opt.type === formData.tipoTercero
      )
    })

    // --- Esquema de columnas del CSV ---
    const CSV_COLUMNS = [
      'tipoTercero', 'tipoDocumento', 'numeroDocumento', 'razonSocial', 'nombreComercial',
      'nombres', 'apellidos', 'representanteLegal', 'telefono', 'email', 'direccion',
      'ciudad', 'pais', 'banco', 'tipoCuenta', 'numeroCuenta', 'titularCuenta',
      'formaPagoTipo', 'diasCredito', 'numeroCuotas', 'mesesPlazo', 'mesesPago',
      'regimen', 'responsabilidades', 'agenteRetenedor', 'estado', 'observaciones'
    ]

    const COLUMN_ALIASES = {
      'tipo tercero': 'tipoTercero', 'tipo_tercero': 'tipoTercero',
      'tipo documento': 'tipoDocumento', 'tipo_documento': 'tipoDocumento', 'tipodocumento': 'tipoDocumento',
      'numero documento': 'numeroDocumento', 'numero_documento': 'numeroDocumento', 'nit': 'numeroDocumento',
      'cedula': 'numeroDocumento', 'identificacion': 'numeroDocumento', 'identificación': 'numeroDocumento',
      'nit / cédula': 'numeroDocumento', 'nit/cedula': 'numeroDocumento', 'identificación (nit/cédula) Prospero': 'numeroDocumento',
      'razon social': 'razonSocial', 'razon_social': 'razonSocial', 'razonsocial': 'razonSocial', 'razón social': 'razonSocial',
      'contratista o aliado': 'nombreAlias', 'nombre_aliado': 'nombreAlias', 'contratista': 'nombreAlias',
      'tipo de aliado': 'tipoAliado', 'tipo_aliado': 'tipoAliado', 'tipo_de_aliado': 'tipoAliado',
      'nombre comercial': 'nombreComercial', 'nombre_comercial': 'nombreComercial',
      'nombre': 'nombres', 'nombres': 'nombres',
      'apellido': 'apellidos', 'apellidos': 'apellidos',
      'representante legal': 'representanteLegal', 'representante_legal': 'representanteLegal',
      'telefono': 'telefono', 'teléfono': 'telefono', 'celular': 'telefono', 'tel': 'telefono',
      'email': 'email', 'correo': 'email', 'correo electronico': 'email', 'correo electrónico': 'email',
      'direccion': 'direccion', 'dirección': 'direccion',
      'ciudad': 'ciudad', 'municipio': 'ciudad', 'municipio de ubicación del contratista': 'ciudad',
      'pais': 'pais', 'país': 'pais',
      'banco': 'banco',
      'tipo cuenta': 'tipoCuenta', 'tipo_cuenta': 'tipoCuenta', 'tipocuenta': 'tipoCuenta',
      'numero cuenta': 'numeroCuenta', 'numero_cuenta': 'numeroCuenta', 'cuenta': 'numeroCuenta',
      'titular': 'titularCuenta', 'titular cuenta': 'titularCuenta',
      'forma de pago': 'formaPagoTipo', 'forma_pago': 'formaPagoTipo', 'tipo forma pago': 'formaPagoTipo',
      'dias credito': 'diasCredito', 'días crédito': 'diasCredito', 'dias_credito': 'diasCredito',
      'numero cuotas': 'numeroCuotas', 'número cuotas': 'numeroCuotas', 'cuotas': 'numeroCuotas',
      'meses plazo': 'mesesPlazo', 'plazo meses': 'mesesPlazo',
      'meses pago': 'mesesPago', 'meses de pago': 'mesesPago',
      'regimen': 'regimen', 'régimen': 'regimen',
      'responsabilidades': 'responsabilidades',
      'agente retenedor': 'agenteRetenedor', 'agente_retenedor': 'agenteRetenedor',
      'estado': 'estado',
      'observaciones': 'observaciones', 'observacion': 'observaciones', 'notas': 'observaciones'
    }

    const CANONICAL_LABELS = {
      tipoTercero: 'Tipo Tercero', tipoDocumento: 'Tipo Docto', numeroDocumento: 'Identificación',
      razonSocial: 'Razón Social', nombreComercial: 'Nombre Comercial', nombres: 'Nombres',
      apellidos: 'Apellidos', representanteLegal: 'Rep. Legal', telefono: 'Teléfono',
      email: 'Email', direccion: 'Dirección', ciudad: 'Ciudad', pais: 'País', banco: 'Banco',
      tipoCuenta: 'Tipo Cuenta', numeroCuenta: 'No. Cuenta', titularCuenta: 'Titular',
      formaPagoTipo: 'Forma pago', diasCredito: 'Días crédito', numeroCuotas: 'Cuotas',
      mesesPlazo: 'Plazo (meses)', mesesPago: 'Meses pago',
      regimen: 'Régimen', responsabilidades: 'Resp. DIAN', agenteRetenedor: 'Retenedor',
      estado: 'Estado', observaciones: 'Observaciones'
    }

    // --- Methods ---
    const descargarPlantillaCSV = () => {
      const header = CSV_COLUMNS.join(',')
      const exampleRow = [
        'PERSONA_JURIDICA', 'NIT', '900123456-7', 'Mi Empresa S.A.S', 'Mi Empresa', '', '',
        'Juan Rep', '3001234567', 'empresa@email.com', 'Calle 10', 'Bogotá', 'Colombia',
        'Bancolombia', 'Ahorros', '12345', 'Mi Empresa',
        'CONTADO', '', '', '', '1,6,12',
        'Común', 'IVA', 'false', 'ACTIVO', ''
      ].map(v => `"${v}"`).join(',')
      const blob = new Blob([`${header}\n${exampleRow}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'plantilla_proveedores.csv'
      link.click()
    }

    const triggerFileInput = () => { if (fileInputRef.value) fileInputRef.value.click() }

    const normalizeFileRows = (jsonRows) => {
      return jsonRows.map((row, index) => {
        const normalized = {}
        const rowKeys = Object.keys(row).map(k => ({
          raw: k, clean: k.toLowerCase().replace(/[^\w\s/áéíóúüñ]/gi, '').replace(/\s+/g, ' ').trim()
        }))

        CSV_COLUMNS.forEach(col => {
          const m = rowKeys.find(rk => COLUMN_ALIASES[rk.clean] === col || rk.clean === col.toLowerCase())
          normalized[col] = m ? String(row[m.raw]).trim() : ''
        })

        const rawNameKey = rowKeys.find(rk => COLUMN_ALIASES[rk.clean] === 'nombreAlias')
        if (rawNameKey) {
          const fullName = String(row[rawNameKey.raw]).trim()
          const isCompany = ['S.A.S', 'SAS', 'LTDA'].some(kw => fullName.toUpperCase().includes(kw))
          if (isCompany) {
            normalized.razonSocial = fullName; normalized.tipoTercero = 'PERSONA_JURIDICA'
          } else {
            const parts = fullName.split(' ')
            if (parts.length >= 2) {
              normalized.apellidos = parts.slice(-2).join(' '); normalized.nombres = parts.slice(0, -2).join(' ') || parts[0]
            } else { normalized.nombres = fullName }
            normalized.tipoTercero = 'PERSONA_NATURAL'
          }
        }
        if (normalized.numeroDocumento && !normalized.tipoDocumento) {
          normalized.tipoDocumento = normalized.numeroDocumento.includes('-') ? 'NIT' : 'CC'
        }
        return { ...normalized, id_index: index }
      })
    }

    const refreshRawCsv = () => {
      const header = CSV_COLUMNS.join(',')
      const body = previewData.value.map(row => 
        CSV_COLUMNS.map(col => {
          const val = String(row[col] || '').replace(/"/g, '""')
          return `"${val}"`
        }).join(',')
      ).join('\n')
      csvResultado.value = `${header}\n${body}`
    }

    const onFileSelected = (event) => {
      const file = event.target.files[0]
      if (!file) return
      activeFileName.value = file.name
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' })
          const jsonRows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' })
          if (!jsonRows.length) return
          previewData.value = normalizeFileRows(jsonRows)
          
          // Columnas con Acciones al inicio
          previewColumns.value = [
            { name: 'actions', label: 'Acciones', align: 'center', style: 'width: 100px' },
            ...CSV_COLUMNS.map(col => ({
              name: col, label: CANONICAL_LABELS[col] || col, field: col, align: 'left', sortable: true
            }))
          ]

          refreshRawCsv()
          showPreviewModal.value = true
        } catch (err) { console.error(err) }
      }
      reader.readAsArrayBuffer(file)
    }

    const openEditRow = (row, index) => {
      editingRow.value = { ...row }
      editingRowIndex.value = index
      showEditRowModal.value = true
    }

    const saveEditedRow = () => {
      if (editingRowIndex.value > -1) {
        previewData.value.splice(editingRowIndex.value, 1, { ...editingRow.value })
        refreshRawCsv()
      }
      showEditRowModal.value = false
    }

    const deleteRow = (index) => {
      $q.dialog({
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este registro de la lista?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        previewData.value.splice(index, 1)
        refreshRawCsv()
        if (selectedRow.value.length > 0 && selectedRow.value[0].id_index === index) {
          selectedRow.value = []
        }
      })
    }

    const mapRowToDTO = (row) => {
      const getVal = (col) => row[col] || ''
      
      const arValue = String(getVal('agenteRetenedor')).toLowerCase()
      const respStr = getVal('responsabilidades')

      return {
        id: null,
        tipoTercero: getVal('tipoTercero') || 'PERSONA_JURIDICA',
        identificacion: {
          tipoDocumento: getVal('tipoDocumento') || 'NIT',
          numeroDocumento: getVal('numeroDocumento') || ''
        },
        informacionBasica: {
          razonSocial: getVal('razonSocial') || '',
          nombreComercial: getVal('nombreComercial') || '',
          nombres: getVal('nombres') || '',
          apellidos: getVal('apellidos') || '',
          representanteLegal: getVal('representanteLegal') || ''
        },
        contacto: {
          telefono: getVal('telefono') || '',
          email: getVal('email') || '',
          direccion: getVal('direccion') || '',
          ciudad: getVal('ciudad') || '',
          pais: getVal('pais') || 'Colombia'
        },
        informacionFinanciera: {
          banco: getVal('banco') || '',
          tipoCuenta: getVal('tipoCuenta') || 'Ahorros',
          numeroCuenta: getVal('numeroCuenta') || '',
          titularCuenta: getVal('titularCuenta') || ''
        },
        formaPago: (function () {
          const diasParsed = parseInt(String(getVal('diasCredito')), 10)
          const cuotasParsed = parseInt(String(getVal('numeroCuotas')), 10)
          const mesesPlazoParsed = parseInt(String(getVal('mesesPlazo')), 10)
          const mesesPagoRaw = getVal('mesesPago')
          var mesesPagoArr = []
          if (mesesPagoRaw) {
            mesesPagoArr = String(mesesPagoRaw).split(/[,;]/).map(function (s) {
              return parseInt(String(s).trim(), 10)
            }).filter(function (n) { return !isNaN(n) && n >= 1 && n <= 12 })
          }
          return {
            tipoFormaPago: getVal('formaPagoTipo') || 'CONTADO',
            diasCredito: !isNaN(diasParsed) && diasParsed > 0 ? diasParsed : null,
            numeroCuotas: !isNaN(cuotasParsed) && cuotasParsed > 0 ? cuotasParsed : null,
            mesesPlazo: !isNaN(mesesPlazoParsed) && mesesPlazoParsed > 0 ? mesesPlazoParsed : null,
            mesesPago: mesesPagoArr
          }
        })(),
        informacionTributaria: {
          regimen: getVal('regimen') || '',
          responsabilidades: respStr ? respStr.split(',').map(s => s.trim()) : [],
          agenteRetenedor: arValue === 'true' || arValue === 'si' || arValue === '1'
        },
        estado: getVal('estado') || 'ACTIVO',
        observaciones: getVal('observaciones') || ''
      }
    }

    const importSelectedRow = () => {
      if (!selectedRow.value || !selectedRow.value.length) return
      const dto = mapRowToDTO(selectedRow.value[0])
      applyMappedDtoToForm(dto, null)
      showPreviewModal.value = false
    }

    /** Adapta la fila plana del listado/API al esquema que espera mapRowToDTO (CSV). */
    const apiRowToCsvShape = (apiRow) => {
      if (!apiRow) return {}
      var mesesRaw = apiRow.mesesPago
      if (Array.isArray(mesesRaw)) {
        mesesRaw = mesesRaw.join(',')
      }
      return {
        tipoTercero: apiRow.tipoTercero || '',
        tipoDocumento: apiRow.tipoDocumento || '',
        numeroDocumento: apiRow.identificacion != null ? String(apiRow.identificacion) : '',
        razonSocial: apiRow.razonSocial || '',
        nombreComercial: apiRow.nombreComercial || '',
        nombres: apiRow.nombres || '',
        apellidos: apiRow.apellidos || '',
        representanteLegal: apiRow.representanteLegal || '',
        telefono: apiRow.telefono || '',
        email: apiRow.email || '',
        direccion: apiRow.direccion || '',
        ciudad: apiRow.ciudad || '',
        pais: apiRow.pais || '',
        banco: apiRow.banco || '',
        tipoCuenta: apiRow.tipoCuenta || '',
        numeroCuenta: apiRow.numeroCuenta || '',
        titularCuenta: apiRow.titularCuenta || '',
        formaPagoTipo: apiRow.formaPagoTipo || '',
        diasCredito: apiRow.diasCredito != null && apiRow.diasCredito !== '' ? apiRow.diasCredito : '',
        numeroCuotas: apiRow.numeroCuotas != null && apiRow.numeroCuotas !== '' ? apiRow.numeroCuotas : '',
        mesesPlazo: apiRow.mesesPlazo != null && apiRow.mesesPlazo !== '' ? apiRow.mesesPlazo : '',
        mesesPago: mesesRaw != null && mesesRaw !== '' ? mesesRaw : '',
        regimen: apiRow.regimen || '',
        responsabilidades: apiRow.responsabilidades || '',
        agenteRetenedor: apiRow.agenteRetenedor != null ? apiRow.agenteRetenedor : '',
        estado: apiRow.estado || '',
        observaciones: apiRow.observaciones || ''
      }
    }

    /** Aplica el DTO del mapa CSV al formulario reactivo; `persistentId` conserva el id del proveedor al editar. */
    const applyMappedDtoToForm = (dto, persistentId) => {
      formData.id = persistentId != null ? persistentId : null
      formData.tipoTercero = dto.tipoTercero
      formData.identificacion.tipoDocumento = dto.identificacion.tipoDocumento
      formData.identificacion.numeroDocumento = dto.identificacion.numeroDocumento
      formData.informacionBasica.razonSocial = dto.informacionBasica.razonSocial
      formData.informacionBasica.nombreComercial = dto.informacionBasica.nombreComercial
      formData.informacionBasica.nombres = dto.informacionBasica.nombres
      formData.informacionBasica.apellidos = dto.informacionBasica.apellidos
      formData.informacionBasica.representanteLegal = dto.informacionBasica.representanteLegal
      formData.contacto.telefono = dto.contacto.telefono
      formData.contacto.email = dto.contacto.email
      formData.contacto.direccion = dto.contacto.direccion
      formData.contacto.ciudad = dto.contacto.ciudad
      formData.contacto.pais = dto.contacto.pais
      formData.informacionFinanciera.banco = dto.informacionFinanciera.banco
      formData.informacionFinanciera.tipoCuenta = dto.informacionFinanciera.tipoCuenta
      formData.informacionFinanciera.numeroCuenta = dto.informacionFinanciera.numeroCuenta
      formData.informacionFinanciera.titularCuenta = dto.informacionFinanciera.titularCuenta
      formData.formaPago.tipoFormaPago = dto.formaPago.tipoFormaPago
      formData.formaPago.diasCredito = dto.formaPago.diasCredito
      formData.formaPago.numeroCuotas = dto.formaPago.numeroCuotas
      formData.formaPago.mesesPlazo = dto.formaPago.mesesPlazo
      formData.formaPago.mesesPago = dto.formaPago.mesesPago && dto.formaPago.mesesPago.slice
        ? dto.formaPago.mesesPago.slice()
        : []
      formData.informacionTributaria.regimen = dto.informacionTributaria.regimen
      formData.informacionTributaria.responsabilidades = [...dto.informacionTributaria.responsabilidades]
      formData.informacionTributaria.agenteRetenedor = dto.informacionTributaria.agenteRetenedor
      formData.estado = dto.estado
      formData.observaciones = dto.observaciones
    }

    const applyEditPrefillFromRoute = () => {
      var route = root.$route
      if (!route.query || route.query.modo !== 'editar' || !route.query.id) return
      var raw = null
      try {
        raw = window.sessionStorage.getItem(PROVEEDOR_EDIT_STORAGE_KEY)
      } catch (e) {
        raw = null
      }
      if (!raw) {
        $q.notify({
          color: 'warning',
          message: 'No se encontraron datos para editar. Abra la edición desde el listado de proveedores.',
          icon: 'warning'
        })
        root.$router.replace({ name: 'registrar-proveedor-nuevo', query: {} })
        return
      }
      var row = null
      try {
        row = JSON.parse(raw)
      } catch (e) {
        row = null
      }
      if (!row || String(row.id) !== String(route.query.id)) {
        try {
          window.sessionStorage.removeItem(PROVEEDOR_EDIT_STORAGE_KEY)
        } catch (e2) {}
        $q.notify({
          color: 'warning',
          message: 'Los datos de edición no coinciden. Vuelva a intentar desde el listado.',
          icon: 'warning'
        })
        root.$router.replace({ name: 'registrar-proveedor-nuevo', query: {} })
        return
      }
      var dto = mapRowToDTO(apiRowToCsvShape(row))
      applyMappedDtoToForm(dto, row.id)
      isEditMode.value = true
      step.value = 1
      try {
        window.sessionStorage.removeItem(PROVEEDOR_EDIT_STORAGE_KEY)
      } catch (e3) {}
      root.$router.replace({ name: 'registrar-proveedor-nuevo', query: {} }).catch(function () {})
    }

    onMounted(function () {
      applyEditPrefillFromRoute()
    })

    const confirmarRegistroMasivo = () => {
      const targetRows = selectedRow.value.length > 0 ? selectedRow.value : previewData.value
      const count = targetRows.length
      const scope = selectedRow.value.length > 0 ? 'seleccionados' : 'totales'
      $q.dialog({
        title: 'Confirmar registro masivo',
        message: `Se van a registrar ${count} proveedor${count !== 1 ? 'es' : ''} ${scope}. ¿Deseas continuar?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        registrarMasivamente(targetRows)
      })
    }

    const registrarMasivamente = async (rows) => {
      $q.loading.show({ message: 'Procesando registros masivamente...' })
      try {
        const payloadList = (rows || previewData.value).map(row => mapRowToDTO(row))
        await store.registerMassiveTerceros(payloadList)
        $q.notify({
          color: 'positive',
          message: `${payloadList.length} proveedores registrados exitosamente`,
          icon: 'check_circle'
        })
        showPreviewModal.value = false
        root.$router.push({ name: 'lista-proveedores-terceros' })
      } catch (err) {
        $q.notify({
          color: 'negative',
          message: 'Error al realizar el registro masivo: ' + (err.response && err.response.data && err.response.data.message || err.message),
          icon: 'error'
        })
      } finally {
        $q.loading.hide()
      }
    }

    const parsePayloadFormaPago = function () {
      const fp = formData.formaPago
      var out = {
        tipoFormaPago: fp.tipoFormaPago || 'CONTADO',
        diasCredito: null,
        numeroCuotas: null,
        mesesPlazo: null,
        mesesPago: []
      }
      if (fp.tipoFormaPago === 'CREDITO_DIAS' && fp.diasCredito) {
        out.diasCredito = fp.diasCredito
      }
      if (fp.tipoFormaPago === 'CREDITO_MESES' && fp.mesesPlazo) {
        out.mesesPlazo = fp.mesesPlazo
      }
      if (fp.tipoFormaPago === 'CUOTAS') {
        if (fp.numeroCuotas) out.numeroCuotas = fp.numeroCuotas
        if (fp.mesesPlazo) out.mesesPlazo = fp.mesesPlazo
      }
      if (fp.mesesPago && fp.mesesPago.length) {
        out.mesesPago = fp.mesesPago.slice()
      }
      return out
    }

    const validateFormaPago = () => {
      const fp = formData.formaPago
      if (!fp || !fp.tipoFormaPago) {
        $q.notify({ color: 'warning', message: 'Seleccione la forma de pago', icon: 'warning' })
        return false
      }
      if (fp.tipoFormaPago === 'CREDITO_DIAS' && !fp.diasCredito) {
        $q.notify({ color: 'warning', message: 'Indique los días de crédito', icon: 'warning' })
        return false
      }
      if (fp.tipoFormaPago === 'CREDITO_MESES' && (!fp.mesesPlazo || fp.mesesPlazo < 1)) {
        $q.notify({ color: 'warning', message: 'Indique el plazo en meses (mínimo 1)', icon: 'warning' })
        return false
      }
      if (fp.tipoFormaPago === 'CUOTAS' && (!fp.numeroCuotas || fp.numeroCuotas < 2)) {
        $q.notify({ color: 'warning', message: 'Indique al menos 2 cuotas', icon: 'warning' })
        return false
      }
      return true
    }

    const onNext = async () => {
      if (step.value < 5 && stepper.value) stepper.value.next()
      else if (step.value < 5) step.value++
      else await handleSave()
    }

    const handleSave = async () => {
      if (!validateFormaPago()) return
      var updating = !!(formData.id)
      $q.loading.show({ message: updating ? 'Guardando cambios...' : 'Procesando registro...' })
      try {
        var payload = Object.assign({}, formData)
        payload.formaPago = parsePayloadFormaPago()
        await store.registerTercero(payload)
        var okMsg = updating ? 'Proveedor actualizado correctamente' : 'Proveedor registrado exitosamente'
        $q.notify({ color: 'positive', message: okMsg, icon: 'check_circle' })
        isEditMode.value = false
        root.$router.push({ name: 'lista-proveedores-terceros' })
      } catch (err) {
        $q.notify({ color: 'negative', message: 'Error al guardar', icon: 'error' })
        console.log('Error: ' + err);
      } finally { $q.loading.hide() }
    }

    const clearFile = () => { activeFileName.value = ''; previewData.value = [] }

    const limpiarFormulario = () => {
      $q.dialog({
        title: 'Limpiar Formulario',
        message: '¿Estás seguro de que deseas borrar todos los campos? Esta acción no se puede deshacer.',
        cancel: true,
        persistent: true
      }).onOk(() => {
        Object.assign(formData, {
          id: null,
          tipoTercero: 'PERSONA_JURIDICA',
          identificacion: {
            tipoDocumento: 'NIT',
            numeroDocumento: ''
          },
          informacionBasica: {
            razonSocial: '',
            nombreComercial: '',
            nombres: '',
            apellidos: '',
            representanteLegal: ''
          },
          contacto: {
            telefono: '',
            email: '',
            direccion: '',
            ciudad: '',
            pais: 'Colombia'
          },
          informacionFinanciera: {
            banco: '',
            tipoCuenta: 'Ahorros',
            numeroCuenta: '',
            titularCuenta: ''
          },
          formaPago: {
            tipoFormaPago: 'CONTADO',
            diasCredito: null,
            numeroCuotas: null,
            mesesPlazo: null,
            mesesPago: []
          },
          informacionTributaria: {
            regimen: '',
            responsabilidades: [],
            agenteRetenedor: false
          },
          estado: 'ACTIVO',
          observaciones: ''
        })
        step.value = 1
        isEditMode.value = false
        $q.notify({
          color: 'info',
          message: 'Formulario reiniciado',
          icon: 'refresh',
          timeout: 2000
        })
      })
    }

    return {
      step, stepper, formData, options, filteredDocumentTypes, loading, onNext,
      isEditMode,
      activeFileName, fileInputRef, triggerFileInput, onFileSelected,
      descargarPlantillaCSV, showPreviewModal, previewData, previewColumns,
      selectedRow, importSelectedRow, clearFile, csvResultado, activeTab,
      showEditRowModal, editingRow, openEditRow, saveEditedRow, deleteRow,
      confirmarRegistroMasivo, limpiarFormulario,
      allSelected, someSelected, toggleSelectAll,
      CANONICAL_LABELS, CSV_COLUMNS
    }
  }
})
</script>

<style scoped>
/* Color Palette */
:root {
  --titulos: #6B7C85;
  --subtitulos: #A7B1B7;
  --parrafos: #4A5A63;
  --success: #5CB85C;
  --error: #D9534F;
}

.registration-header {
  width: 67%;
  margin: 15px auto;
  background: linear-gradient(135deg, #84B24D 0%, #75AF7E 50%, #4E9C4C 100%);
  border-radius: 12px;
  overflow: hidden;
}

.excel-toolbar {
  border-radius: 10px;
  border-color: #e0e0e0 !important;
  background: #fafafa;
}

.header-content h1 {
  font-size: 24px !important;
  letter-spacing: 0.5px;
}

.header-content p {
  font-size: 16px;
  margin-top: 4px;
}

.stepper-card {
  border-radius: 16px;
  overflow: hidden;
}

.custom-stepper {
  box-shadow: none;
}

.section-title {
  color: #6B7C85;
  font-weight: 700;
  font-size: 18px;
}

.section-subtitle {
  color: #A7B1B7;
  font-size: 14px;
}

.custom-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #6B7C85;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Custom Input States */
.custom-input :deep(.q-field__control) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-input :deep(.q-field__control:hover) {
  border-color: #75AF7E;
}

.custom-input :deep(.q-field--focused .q-field__control) {
  border-color: #4E9C4C !important;
  box-shadow: 0 0 0 2px rgba(78, 156, 76, 0.2);
}

.custom-input :deep(.q-field--error .q-field__control) {
  border-color: #D9534F !important;
}

/* Typography Overrides */
p {
  color: #4A5A63;
  line-height: 1.6;
}

.rounded-btn {
  border-radius: 8px;
  padding: 10px 24px;
}

/* Transitions */
.q-stepper__step-content {
  transition: transform 0.3s ease-out;
}
</style>
