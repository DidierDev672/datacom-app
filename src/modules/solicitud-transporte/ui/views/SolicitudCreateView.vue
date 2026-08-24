<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row q-mb-md items-center">
      <div class="col">
        <h1 class="sta-title q-my-none">Nueva Solicitud de Transporte Aéreo</h1>
        <p class="text-subtitle1 text-grey-7 q-my-none">Gestión de tiquetes y traslados para personal</p>
      </div>
      <div class="col-auto">
        <q-btn
          unelevated
          class="btn-excel-manager"
          icon="upload_file"
          label="Gestionar Excel"
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
    </div>

    <!-- LISTA DESPLEGABLE DE ARCHIVOS EXCEL -->
    <div v-if="archivosExcel.length > 0" class="row q-mb-lg justify-center">
      <div style="width: 100%">
        <q-expansion-item
          v-model="listaExpanded"
          class="excel-list-expansion"
          :label="`${archivosExcel.length} archivo${archivosExcel.length > 1 ? 's' : ''} de Excel seleccionado${archivosExcel.length > 1 ? 's' : ''}`"
          icon="description"
          header-class="excel-list-header"
        >
          <q-list separator class="bg-white">
            <q-item v-for="(archivo, index) in archivosExcel" :key="index" class="q-py-md">
              <q-item-section avatar>
                <q-icon name="table_chart" color="green-7" size="24px" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-grey-9">{{ archivo.nombre }}</q-item-label>
                <q-item-label caption>{{ archivo.tamaño }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row q-gutter-sm">
                  <q-btn flat round dense icon="visibility" color="primary" @click="verExcel(index)">
                    <q-tooltip>Visualizar contenido</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense icon="delete" color="negative" @click="quitarArchivo(index)">
                    <q-tooltip>Quitar archivo</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </div>

    <!-- MODAL VISUALIZADOR DE EXCEL -->
    <q-dialog v-model="excelState.modalVisible" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="excel-preview-card">
        <!-- HEADER -->
        <div class="excel-preview-header">
          <div class="row items-center no-wrap q-gutter-md">
            <div class="excel-header-icon">
              <q-icon name="analytics" size="24px" color="white" />
            </div>
            <div class="col">
              <div class="excel-header-title">{{ excelState.archivoNombre }}</div>
              <div class="excel-header-subtitle">Vista previa de datos del archivo</div>
            </div>
            <div class="row items-center q-gutter-sm">
              <div class="excel-mini-badge">
                <q-icon name="reorder" size="14px" class="q-mr-xs" />
                {{ excelState.datosHoja.length }} registros
              </div>
              <q-btn icon="close" flat round dense color="white" v-close-popup />
            </div>
          </div>
        </div>

        <!-- TABS DE HOJAS -->
        <div class="excel-tabs-container" v-if="excelState.hojas.length > 0">
          <div class="excel-tabs-scroller">
            <button
              v-for="hoja in excelState.hojas"
              :key="hoja"
              class="excel-tab-item"
              :class="{ 'excel-tab-item--active': excelState.hojaActiva === hoja }"
              @click="excelState.hojaActiva = hoja"
            >
              {{ hoja }}
            </button>
          </div>
        </div>

        <!-- CUERPO DE LA TABLA -->
        <div class="excel-preview-body">
          <q-table
            :data="excelState.datosHoja"
            :columns="excelState.columnas"
            :row-key="(row, i) => i"
            flat bordered dense
            :pagination="{ rowsPerPage: 15 }"
            class="excel-data-table"
          />
        </div>

        <!-- FOOTER -->
        <div class="excel-preview-footer">
          <div class="text-caption text-grey-7">
            Hoja activa: <span class="text-weight-bold text-primary">{{ excelState.hojaActiva }}</span>
          </div>
          <div class="row q-gutter-md">
            <q-btn
              unelevated
              class="btn-import-excel"
              label="Pasar al formulario"
              icon="input"
              @click="importarDatosExcel"
            />
            <q-btn
              flat
              class="btn-close-preview"
              label="Cerrar"
              color="grey-9"
              v-close-popup
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <div class="row justify-center">
      <div style="width: 100%">
        <SolicitudForm @success="onSuccess" />
      </div>
    </div>

    <!-- Alerta de Error -->
    <q-dialog v-model="showError">
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm text-weight-bold">Error en la solicitud</span>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ store.error }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { reactive, ref, watch } from '@vue/composition-api';
import * as XLSX from 'xlsx';
import { useSolicitudTransporteStore } from '../../store/solicitudTransporte.store';
import SolicitudForm from '../components/SolicitudForm.vue';

const COLUMN_MAPPING = {
  // Identificación
  'proyecto': ['proyecto', 'obra', 'contrato'],
  'area': ['area', 'área', 'departamento', 'seccion'],
  'solicitante': ['solicitante', 'nombre solicitante', 'empleado'],
  // Viaje
  'viaje.ciudadOrigen': ['origen', 'ciudad origen', 'desde'],
  'viaje.ciudadDestino': ['destino', 'ciudad destino', 'hacia'],
  'viaje.fechaSalida': ['fecha salida', 'fecha ida', 'salida'],
  'viaje.fechaRegreso': ['fecha regreso', 'fecha vuelta', 'regreso'],
  // Pasajeros
  'pasajeros.nombre': ['nombre', 'pasajero', 'viajero', 'nombre completo'],
  'pasajeros.documento': ['documento', 'cedula', 'identificacion', 'id'],
  'pasajeros.fechaNacimiento': ['fecha nacimiento', 'nacimiento', 'dob'],
  'pasajeros.cargo': ['cargo', 'puesto', 'rol'],
  'pasajeros.contacto': ['contacto', 'telefono', 'celular'],
  // Justificación
  'justificacion.motivoViaje': ['motivo', 'justificacion', 'porque viaja'],
  'justificacion.relacionProyecto': ['relacion proyecto', 'vínculo proyecto']
};

export default {
  name: 'SolicitudCreateView',
  components: {
    SolicitudForm
  },
  setup(props, { root }) {
    const store = useSolicitudTransporteStore();
    const showError = ref(false);

    // Excel Management
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

    watch(() => store.error, (newVal) => {
      if (newVal) showError.value = true;
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

      // Importar campos base
      const fields = ['proyecto', 'area', 'solicitante'];
      fields.forEach(f => {
        const h = findH(f);
        if (h) store.solicitudActual[f] = excelState.datosHoja[0][h];
      });

      // Viaje
      const vFields = ['ciudadOrigen', 'ciudadDestino', 'fechaSalida', 'fechaRegreso'];
      vFields.forEach(f => {
        const h = findH(`viaje.${f}`);
        if (h) store.solicitudActual.viaje[f] = excelState.datosHoja[0][h];
      });

      // Justificación
      const jFields = ['motivoViaje', 'relacionProyecto'];
      jFields.forEach(f => {
        const h = findH(`justificacion.${f}`);
        if (h) store.solicitudActual.justificacion[f] = excelState.datosHoja[0][h];
      });

      // Pasajeros
      const pHeader = {
        nombre: findH('pasajeros.nombre'),
        documento: findH('pasajeros.documento'),
        fechaNacimiento: findH('pasajeros.fechaNacimiento'),
        cargo: findH('pasajeros.cargo'),
        contacto: findH('pasajeros.contacto')
      };

      if (pHeader.nombre || pHeader.documento) {
        const pasajeros = excelState.datosHoja.map((row, i) => ({
          numeroPasajero: i + 1,
          nombre: row[pHeader.nombre] || '',
          documento: row[pHeader.documento] || '',
          fechaNacimiento: row[pHeader.fechaNacimiento] || '',
          cargo: row[pHeader.cargo] || '',
          contacto: row[pHeader.contacto] || ''
        })).filter(p => p.nombre || p.documento);
        
        if (pasajeros.length) store.solicitudActual.pasajeros = [...store.solicitudActual.pasajeros, ...pasajeros];
      }

      root.$q.notify({
        color: 'positive',
        message: 'Datos del Excel transferidos al formulario',
        icon: 'check_circle'
      });
      excelState.modalVisible = false;
    };

    const onSuccess = (data) => {
      root.$q.notify({
        message: 'Solicitud enviada exitosamente',
        color: 'positive',
        icon: 'check_circle',
        position: 'top-right'
      });
      root.$router.push({ name: 'lista-solicitudes-transporte' });
    };

    store.resetSolicitudActual();

    return {
      store,
      showError,
      onSuccess,
      fileInputExcel, archivosExcel, listaExpanded, excelState,
      triggerExcelInput, onExcelFilesSelected, quitarArchivo, verExcel, importarDatosExcel
    };
  }
}
</script>

<style scoped>
.sta-title {
  font-size: var(--text-titulo);
  font-weight: 700;
  color: #0f172a;
}

.btn-excel-manager {
  height: 44px;
  border-radius: 8px;
  background: #16a34a !important;
  color: white !important;
  font-weight: 600;
  text-transform: none;
  padding: 0 20px;
}

.excel-list-expansion {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  overflow: hidden;
}

.excel-list-header {
  font-weight: 600;
  color: #475569;
}

/* --- MODAL PREVIEW --- */
.excel-preview-card { display: flex; flex-direction: column; background: #f1f5f9; }
.excel-preview-header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 16px 24px; flex-shrink: 0; }
.excel-header-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.excel-header-title { color: white; font-size: 18px; font-weight: 700; }
.excel-header-subtitle { color: rgba(255,255,255,0.8); font-size: 12px; }
.excel-mini-badge { background: rgba(255,255,255,0.2); color: white; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; }

.excel-tabs-container { background: white; border-bottom: 1px solid #e2e8f0; padding: 0 16px; flex-shrink: 0; }
.excel-tabs-scroller { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
.excel-tab-item { padding: 12px 20px; border: none; background: transparent; cursor: pointer; color: #64748b; font-weight: 500; font-size: 14px; border-bottom: 2px solid transparent; }
.excel-tab-item--active { color: #2563eb; border-bottom-color: #2563eb; background: #eff6ff; }

.excel-preview-body { flex: 1; overflow: auto; background: white; }
.excel-preview-footer { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: white; border-top: 1px solid #e2e8f0; flex-shrink: 0; }

.btn-import-excel { background: #2563eb !important; color: white !important; font-weight: 600; height: 44px; border-radius: 8px; text-transform: none; padding: 0 24px; }
.btn-close-preview { font-weight: 600; text-transform: none; }
</style>
