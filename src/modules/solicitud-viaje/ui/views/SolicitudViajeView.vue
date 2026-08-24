<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col title-main">
        Solicitud de Viaje
      </div>
    </div>

    <!-- SECCIÓN DE ADJUNTOS EXCEL -->
    <div class="excel-adjuntos-section q-mb-lg">
      <div class="row items-center q-mb-sm">
        <div class="adjuntos-label">
          <q-icon name="attach_file" size="18px" class="q-mr-xs" />
          Documentos de Referencia (Excel)
        </div>
        <q-space />
        <q-btn
          unelevated
          class="btn-excel"
          icon="upload_file"
          label="Seleccionar Excel"
          @click="triggerExcelInput"
        />
        <input
          ref="fileInputExcel"
          type="file"
          accept=".xls,.xlsx"
          multiple
          style="display:none"
          @change="onExcelFilesSelected"
        />
      </div>

      <!-- Lista de archivos -->
      <div v-if="archivosExcel.length > 0" class="archivos-lista">
        <q-expansion-item
          v-model="listaExpanded"
          class="archivos-expansion"
          :label="`${archivosExcel.length} archivo${archivosExcel.length > 1 ? 's' : ''} seleccionado${archivosExcel.length > 1 ? 's' : ''}`"
          icon="folder_open"
          header-class="archivos-expansion-header"
        >
          <q-list separator class="archivos-q-list">
            <q-item v-for="(archivo, index) in archivosExcel" :key="index" class="archivo-item">
              <q-item-section avatar>
                <q-icon name="table_chart" color="green-7" size="22px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="archivo-nombre">{{ archivo.nombre }}</q-item-label>
                <q-item-label caption>{{ archivo.tamaño }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-xs">
                  <q-btn flat round dense icon="visibility" class="btn-ver-excel" @click="verExcel(index)">
                    <q-tooltip>Ver contenido</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense icon="close" class="btn-quitar-excel" @click="quitarArchivo(index)">
                    <q-tooltip>Quitar</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </div>

    <!-- MODAL VISUALIZADOR DE EXCEL -->
    <q-dialog v-model="excelState.modalVisible" maximized>
      <q-card class="excel-modal-card">
        <!-- HEADER -->
        <div class="excel-modal-header">
          <div class="row items-center no-wrap q-gutter-sm">
            <div class="excel-modal-icon-wrap">
              <q-icon name="table_chart" size="20px" color="white" />
            </div>
            <div class="col">
              <div class="excel-modal-title">{{ excelState.archivoNombre }}</div>
              <div class="excel-modal-subtitle">Previsualización de datos para la solicitud</div>
            </div>
            <div class="row items-center q-gutter-xs">
              <div class="excel-badge excel-badge--blue">
                <q-icon name="grid_on" size="12px" class="q-mr-xs" />
                {{ excelState.datosHoja.length }} filas
              </div>
            </div>
            <q-btn icon="close" flat round dense color="white" class="excel-modal-close" v-close-popup />
          </div>
        </div>

        <!-- TABS DE HOJAS -->
        <div v-if="excelState.hojas.length > 0" class="excel-tabs-bar">
          <div class="excel-tabs-scroll">
            <button
              v-for="hoja in excelState.hojas"
              :key="hoja"
              class="excel-tab-btn"
              :class="{ 'excel-tab-btn--active': excelState.hojaActiva === hoja }"
              @click="excelState.hojaActiva = hoja"
            >
              <q-icon name="description" size="14px" class="q-mr-xs" />
              {{ hoja }}
            </button>
          </div>
        </div>

        <!-- CUERPO / TABLA -->
        <div class="excel-modal-body">
          <q-table
            :data="excelState.datosHoja"
            :columns="excelState.columnas"
            :row-key="(row, i) => i"
            flat bordered dense
            :pagination="{ rowsPerPage: 20 }"
            class="excel-preview-table"
          />
        </div>

        <!-- FOOTER -->
        <div class="excel-modal-footer">
          <div class="excel-footer-info">
            Hoja seleccionada: <strong>{{ excelState.hojaActiva }}</strong>
          </div>
          <div class="row q-gutter-sm">
            <q-btn
              unelevated
              class="btn-excel-importar"
              label="Pasar al formulario"
              icon="input"
              @click="importarDatosExcel"
            />
            <q-btn unelevated class="btn-excel-cerrar" label="Cerrar" icon="close" v-close-popup />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-stepper
      v-model="store.currentStep"
      ref="stepper"
      color="primary"
      animated
      flat
      bordered
      class="wizard-stepper"
    >
      <!-- PASO 1: Identificación -->
      <q-step :name="1" title="Identificación" icon="person" :done="store.currentStep > 1">
        <StepIdentificacion />
      </q-step>

      <!-- PASO 2: Tipo de Servicio -->
      <q-step :name="2" title="Tipo de Servicio" icon="settings" :done="store.currentStep > 2">
        <StepTipoServicio />
      </q-step>

      <!-- PASO 3: Transporte -->
      <q-step :name="3" title="Transporte" icon="directions_bus" :done="store.currentStep > 3">
        <StepTransporte />
      </q-step>

      <!-- PASO 4: Alojamiento -->
      <q-step :name="4" title="Alojamiento" icon="hotel" :done="store.currentStep > 4">
        <StepAlojamiento />
      </q-step>

      <!-- PASO 5: Personas -->
      <q-step :name="5" title="Personas" icon="groups" :done="store.currentStep > 5">
        <StepPersonas />
      </q-step>

      <!-- PASO 6: Justificación -->
      <q-step :name="6" title="Justificación" icon="description" :done="store.currentStep > 6">
        <StepJustificacion />
      </q-step>

      <!-- PASO 7: Revisión -->
      <q-step :name="7" title="Revisión" icon="preview" :done="store.currentStep > 7">
        <StepRevision />
      </q-step>

      <!-- NAVEGACIÓN -->
      <template v-slot:navigation>
        <q-stepper-navigation class="action-buttons">
          <q-btn
            v-if="store.currentStep < 7"
            @click="next"
            unelevated
            class="btn-primario"
            label="Siguiente"
          />
          <q-btn
            v-else
            @click="submit"
            unelevated
            class="btn-primario"
            label="Enviar Solicitud"
            :loading="store.loading"
          >
            <template v-slot:loading> ⏳ Guardando... </template>
          </q-btn>

          <q-btn
            v-if="store.currentStep > 1"
            unelevated
            class="btn-secundario"
            @click="store.setStep(store.currentStep - 1)"
            label="Anterior"
          />
        </q-stepper-navigation>
        
        <div v-if="store.error" class="text-negative q-mt-md q-px-md">
          {{ store.error }}
        </div>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import { reactive, ref, watch } from '@vue/composition-api';
import * as XLSX from 'xlsx';
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';
import StepAlojamiento from '../components/StepAlojamiento.vue';
import StepIdentificacion from '../components/StepIdentificacion.vue';
import StepJustificacion from '../components/StepJustificacion.vue';
import StepPersonas from '../components/StepPersonas.vue';
import StepRevision from '../components/StepRevision.vue';
import StepTipoServicio from '../components/StepTipoServicio.vue';
import StepTransporte from '../components/StepTransporte.vue';

const COLUMN_MAPPING = {
  'proyecto': ['proyecto', 'obra', 'contrato'],
  'area': ['area', 'área', 'departamento', 'seccion'],
  'solicitanteNombre': ['solicitante', 'nombre solicitante', 'empleado'],
  'motivoViaje': ['motivo', 'justificacion', 'porque viaja', 'razon'],
  'relacionProyecto': ['relacion proyecto', 'vínculo proyecto', 'enlace'],
  'transporte.origen': ['origen', 'ciudad origen', 'desde'],
  'transporte.destino': ['destino', 'ciudad destino', 'hacia'],
  'transporte.fechaSalida': ['fecha salida', 'fecha ida', 'salida'],
  'transporte.fechaRegreso': ['fecha regreso', 'fecha vuelta', 'regreso'],
  'transporte.tipoTransporte': ['tipo transporte', 'medio', 'transporte'],
  'hospedaje.ciudad': ['ciudad hospedaje', 'ciudad hotel'],
  'hospedaje.hotel': ['hotel', 'nombre hotel', 'alojamiento'],
  'hospedaje.fechaIngreso': ['fecha ingreso', 'checkin', 'entrada'],
  'hospedaje.fechaSalida': ['fecha salida hospedaje', 'checkout', 'salida hotel'],
  'personas.nombre': ['nombre persona', 'pasajero', 'viajero', 'nombre completo', 'nombre'],
  'personas.documento': ['documento', 'cedula', 'id persona', 'identificacion', 'n_identidad'],
  'personas.cargo': ['cargo', 'puesto', 'rol', 'oficio'],
  'personas.telefono': ['telefono persona', 'celular', 'contacto', 'movil']
};

export default {
  name: 'SolicitudViajeView',
  components: {
    StepIdentificacion,
    StepTipoServicio,
    StepTransporte,
    StepAlojamiento,
    StepPersonas,
    StepJustificacion,
    StepRevision
  },
  setup(props, { root }) {
    const store = useSolicitudViajeStore();
    const $q = root.$q;

    // Excel State
    const fileInputExcel = ref(null);
    const archivosExcel = ref([]);
    const listaExpanded = ref(true);
    const excelState = reactive({
      modalVisible: false,
      archivoNombre: '',
      hojas: [],
      hojaActiva: '',
      workbook: null,
      datosHoja: [],
      columnas: []
    });

    watch(() => excelState.hojaActiva, (newHoja) => {
      if (newHoja) cargarHoja(newHoja);
    });

    const triggerExcelInput = () => fileInputExcel.value.click();

    const onExcelFilesSelected = (event) => {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (!archivosExcel.value.some(a => a.nombre === file.name)) {
          archivosExcel.value.push({
            nombre: file.name,
            tamaño: (file.size / 1024).toFixed(1) + ' KB',
            fileObj: file
          });
        }
      });
      event.target.value = '';
      listaExpanded.value = true;
    };

    const quitarArchivo = (index) => archivosExcel.value.splice(index, 1);

    const verExcel = (index) => {
      const archivo = archivosExcel.value[index];
      excelState.archivoNombre = archivo.nombre;
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        excelState.workbook = wb;
        excelState.hojas = wb.SheetNames;
        excelState.hojaActiva = wb.SheetNames[0];
        cargarHoja(wb.SheetNames[0]);
        excelState.modalVisible = true;
      };
      reader.readAsArrayBuffer(archivo.fileObj);
    };

    const cargarHoja = (nombre) => {
      const sheet = excelState.workbook.Sheets[nombre];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      if (!json.length) {
        excelState.datosHoja = [];
        excelState.columnas = [];
        return;
      }
      excelState.columnas = Object.keys(json[0]).map(k => ({
        name: k, label: k, field: k, align: 'left', sortable: true
      }));
      excelState.datosHoja = json;
    };

    const importarDatosExcel = () => {
      if (!excelState.datosHoja.length) return;
      const headers = Object.keys(excelState.datosHoja[0]);
      
      const findH = (key) => {
        const aliases = COLUMN_MAPPING[key] || [];
        return headers.find(h => aliases.includes(h.toLowerCase().trim().replace(/[^\w\s]/g, '')));
      };

      // Mapeo simple (Base, Transporte, Hospedaje)
      const baseFields = ['proyecto', 'area', 'solicitanteNombre', 'motivoViaje', 'relacionProyecto'];
      baseFields.forEach(f => {
        const h = findH(f);
        if (h) store.form[f] = excelState.datosHoja[0][h];
      });

      const transFields = ['origen', 'destino', 'fechaSalida', 'fechaRegreso', 'tipoTransporte'];
      transFields.forEach(f => {
        const h = findH(`transporte.${f}`);
        if (h) store.form.transporte[f] = excelState.datosHoja[0][h];
      });

      const hospFields = ['ciudad', 'hotel', 'fechaIngreso', 'fechaSalida'];
      hospFields.forEach(f => {
        const h = findH(`hospedaje.${f}`);
        if (h) store.form.hospedaje[f] = excelState.datosHoja[0][h];
      });

      // Mapeo de Personas (List)
      const pMap = {
        nombre: findH('personas.nombre'),
        documento: findH('personas.documento'),
        cargo: findH('personas.cargo'),
        telefono: findH('personas.telefono')
      };

      if (pMap.nombre || pMap.documento) {
        const personas = excelState.datosHoja.map(row => ({
          nombre: row[pMap.nombre] || '',
          documento: row[pMap.documento] || '',
          cargo: row[pMap.cargo] || '',
          telefono: row[pMap.telefono] || ''
        })).filter(p => p.nombre || p.documento);
        
        if (personas.length) store.form.personas = [...store.form.personas, ...personas];
      }

      $q.notify({ color: 'positive', message: 'Datos importados correctamente', icon: 'check_circle' });
      excelState.modalVisible = false;
    };

    return { 
      store, fileInputExcel, archivosExcel, listaExpanded, excelState,
      triggerExcelInput, onExcelFilesSelected, quitarArchivo, verExcel, importarDatosExcel
    };
  },
  methods: {
    next() {
      this.store.setStep(this.store.currentStep + 1);
    },
    async submit() {
      try {
        await this.store.createSolicitud();
        this.$q.notify({ type: 'positive', message: 'Solicitud de viaje creada exitosamente' });
        this.store.resetForm();
        this.$router.push('/abastecimiento/solicitudes-viaje');
      } catch (err) {
        console.error(err);
      }
    }
  }
}
</script>

<style scoped>
.title-main {
  font-size: 24px !important;
  font-weight: 600 !important;
  color: #111827 !important;
}

.wizard-stepper {
  border-radius: 12px;
}

::v-deep .q-stepper__header {
  border-bottom: 1px solid #E5E7EB;
}

/* --- ESTILOS DE ADJUNTOS EXCEL --- */
.excel-adjuntos-section {
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 16px;
  background: #F9FAFB;
}

.adjuntos-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
}

.btn-excel {
  height: 40px !important;
  padding: 0 16px !important;
  border-radius: 8px;
  background: #16A34A !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
}

.archivos-expansion {
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  margin-top: 12px;
  background: white;
}

.archivo-item:hover {
  background: #F8FAFC;
}

.btn-ver-excel { color: #2563EB; }
.btn-quitar-excel { color: #DC2626; }

/* --- MODAL EXCEL UX --- */
.excel-modal-card { display: flex; flex-direction: column; background: #F8FAFC; }
.excel-modal-header { background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); padding: 16px 20px; }
.excel-modal-icon-wrap { width: 36px; height: 36px; background: rgba(255,255,255,0.15); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.excel-modal-title { color: white; font-size: 18px; font-weight: 600; }
.excel-modal-subtitle { color: rgba(255,255,255,0.7); font-size: 12px; }
.excel-badge { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: rgba(255,255,255,0.2); color: white; }

.excel-tabs-bar { display: flex; background: white; border-bottom: 1px solid #E5E7EB; padding: 0 16px; overflow-x: auto; }
.excel-tab-btn { padding: 12px 16px; border: none; background: transparent; cursor: pointer; color: #6B7280; font-weight: 500; border-bottom: 2px solid transparent; }
.excel-tab-btn--active { color: #2563EB; border-bottom-color: #2563EB; background: #EFF6FF; }

.excel-modal-body { flex: 1; overflow: auto; background: white; }
.excel-modal-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; background: white; border-top: 1px solid #E5E7EB; }

.btn-excel-importar { background: #2563EB !important; color: white !important; font-weight: 600; height: 40px; border-radius: 8px; text-transform: none; }
.btn-excel-cerrar { background: #111827 !important; color: white !important; height: 40px; border-radius: 8px; text-transform: none; }

/* --- BOTONES NAVEGACIÓN --- */
.action-buttons {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  gap: 12px;
  padding: 24px;
}

.btn-primario, .btn-secundario {
  height: 44px !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
}

.btn-primario {
  background: #2563EB !important;
  color: white !important;
}

.btn-secundario {
  background: transparent !important;
  border: 1px solid #D1D5DB !important;
  color: #374151 !important;
}
</style>
