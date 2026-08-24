<template>
  <div class="q-pa-lg bg-grey-2" style="min-height: 100vh;">
    <div class="full-width q-gutter-y-lg animate-in">
      <!-- Back Link -->
      <div class="row items-center justify-between no-wrap">
        <q-btn 
          flat 
          dense 
          no-caps
          color="grey-7"
          @click="$router.push({ name: 'lista-solicitudes-terrestre' })"
          class="text-weight-bold"
        >
          <q-icon left name="arrow_back" size="20px" class="q-mr-sm" />
          Volver al listado
        </q-btn>

        <q-btn
          unelevated
          class="btn-excel-tool"
          icon="upload_file"
          label="Soporte Excel"
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

      <!-- Header -->
      <div class="row justify-between items-end q-col-gutter-md q-pb-sm">
        <div class="col-12 col-md-auto">
          <q-badge 
            rounded 
            color="blue-1" 
            text-color="blue-7" 
            label="Formulario FOD-T-023"
            class="q-px-md q-py-xs text-weight-bolder q-mb-md"
            style="letter-spacing: 0.1em; font-size: 10px;"
          />
          <h1 class="text-h4 text-weight-bolder text-dark q-my-none" style="letter-spacing: -0.02em;">Nueva Solicitud</h1>
          <p class="text-grey-7 q-mt-sm text-weight-medium">Complete los siguientes pasos para formalizar su requerimiento de transporte.</p>
        </div>
        <div class="col-12 col-md-auto text-right gt-sm">
          <p class="text-caption text-weight-bold text-grey-6 text-uppercase q-mb-none" style="letter-spacing: 0.1em;">Estado Actual</p>
          <p class="text-h6 text-weight-bolder text-dark q-mb-none">BORRADOR</p>
        </div>
      </div>

      <!-- LISTA DE EXCEL -->
      <div v-if="archivosExcel.length > 0" class="row animate-in">
        <div class="col-12">
          <q-expansion-item
            v-model="listaExpanded"
            class="excel-manager-expansion"
            :label="`${archivosExcel.length} archivos de Excel cargados`"
            icon="description"
            header-class="excel-manager-header"
          >
            <q-list separator class="bg-white">
              <q-item v-for="(archivo, index) in archivosExcel" :key="index" class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="table_view" color="green-14" size="28px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-blue-grey-9">{{ archivo.nombre }}</q-item-label>
                  <q-item-label caption>{{ archivo.tamaño }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row q-gutter-x-sm">
                    <q-btn flat round dense icon="visibility" color="blue-8" @click="verExcel(index)">
                      <q-tooltip>Ver datos</q-tooltip>
                    </q-btn>
                    <q-btn flat round dense icon="delete_outline" color="red-8" @click="quitarArchivo(index)">
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </div>
      </div>

      <!-- MODAL VISUALIZADOR -->
      <q-dialog v-model="excelState.modalVisible" maximized transition-show="slide-up" transition-hide="slide-down">
        <q-card class="excel-view-card">
          <!-- TOP BAR -->
          <div class="excel-view-top-bar">
            <div class="row items-center no-wrap q-gutter-x-md">
              <div class="excel-view-icon-box">
                <q-icon name="table_chart" size="24px" color="white" />
              </div>
              <div class="col">
                <div class="excel-view-title">{{ excelState.archivoNombre }}</div>
                <div class="excel-view-info">Visualizando contenido del libro de Excel</div>
              </div>
              <div class="row items-center q-gutter-x-sm">
                <div class="excel-view-badge">
                  <q-icon name="format_list_numbered" size="14px" class="q-mr-xs" />
                  {{ excelState.datosHoja.length }} filas
                </div>
                <q-btn icon="close" flat round dense color="white" class="excel-view-close" v-close-popup />
              </div>
            </div>
          </div>

          <!-- SHEET TABS -->
          <div class="excel-view-tabs" v-if="excelState.hojas.length > 0">
            <div class="excel-tabs-wrapper">
              <div
                v-for="hoja in excelState.hojas"
                :key="hoja"
                class="excel-tab-node"
                :class="{ 'excel-tab-node--active': excelState.hojaActiva === hoja }"
                @click="excelState.hojaActiva = hoja"
              >
                {{ hoja }}
              </div>
            </div>
          </div>

          <!-- TABLE -->
          <div class="excel-view-content">
            <q-table
              :data="excelState.datosHoja"
              :columns="excelState.columnas"
              :row-key="(row, i) => i"
              flat bordered dense
              :pagination="{ rowsPerPage: 15 }"
              class="excel-view-table"
            />
          </div>

          <!-- ACTIONS FOOTER -->
          <div class="excel-view-footer">
            <div class="text-caption text-grey-8">
              Pestaña activa: <span class="text-weight-bolder text-indigo-7">{{ excelState.hojaActiva }}</span>
            </div>
            <div class="row q-gutter-x-md">
              <q-btn
                unelevated
                class="btn-import-to-form"
                label="Transferir al formulario"
                icon="forward_to_inbox"
                @click="importarDatosExcel"
              />
              <q-btn flat class="btn-cancel-view" label="Cerrar vista" v-close-popup />
            </div>
          </div>
        </q-card>
      </q-dialog>

      <!-- Main Form -->
      <SolicitudTerrestreForm ref="formComponent" @success="handleSuccess" />

      <!-- Footer Info -->
      <div class="row justify-center items-center q-gutter-x-xl q-py-xl text-grey-4">
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="lock" size="18px" />
          <span class="text-caption text-weight-bold">Conexión Segura SSL</span>
        </div>
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="verified_user" size="18px" />
          <span class="text-caption text-weight-bold">Protección de Datos</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { useSolicitudTerrestreStore } from '../../application/solicitudTerrestre.store.js';
import SolicitudTerrestreForm from '../components/SolicitudTerrestreForm.vue';

const COLUMN_MAPPING = {
  // Base
  'proyecto': ['proyecto', 'obra', 'contrato'],
  'area': ['area', 'área', 'departamento', 'seccion'],
  'solicitante': ['solicitante', 'nombre solicitante', 'empleado'],
  // Servicio
  'servicio.tipoServicio': ['tipo servicio', 'servicio', 'modalidad'],
  'servicio.tipoVehiculo': ['tipo vehiculo', 'vehiculo', 'tipo unidad'],
  // Transporte
  'transporte.origen': ['origen', 'desde', 'ciudad partida'],
  'transporte.destino': ['destino', 'hacia', 'ciudad llegada'],
  'transporte.fechaHoraSalida': ['fecha salida', 'fecha hora salida', 'salida'],
  'transporte.fechaHoraRegreso': ['fecha regreso', 'fecha hora regreso', 'regreso'],
  // Pasajeros
  'pasajeros.nombre': ['nombre', 'pasajero', 'viajero', 'nombre completo'],
  'pasajeros.documento': ['documento', 'cedula', 'id', 'identificacion'],
  'pasajeros.cargo': ['cargo', 'puesto', 'rol'],
  'pasajeros.telefono': ['telefono', 'celular', 'contacto'],
  // Justificación
  'justificacion.motivoTraslado': ['motivo', 'justificacion', 'motivo traslado'],
  'justificacion.relacionProyecto': ['relacion proyecto', 'vinculo proyecto']
};

export default {
  name: 'SolicitudTerrestreCreateView',
  components: { SolicitudTerrestreForm },
  
  data() {
    return {
      store: useSolicitudTerrestreStore(),
      // Excel State
      archivosExcel: [],
      listaExpanded: true,
      excelState: {
        modalVisible: false,
        archivoNombre: '',
        hojas: [],
        hojaActiva: '',
        workbook: null,
        datosHoja: [],
        columnas: []
      }
    };
  },

  watch: {
    'excelState.hojaActiva'(nuevaHoja) {
      if (nuevaHoja) this.cargarHoja(nuevaHoja);
    }
  },
  
  mounted() {
    this.store.resetSolicitudActual();
  },
  
  methods: {
    triggerExcelInput() {
      this.$refs.fileInputExcel.click();
    },

    onExcelFilesSelected(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (!this.archivosExcel.some(a => a.nombre === file.name)) {
          this.archivosExcel.push({
            nombre: file.name,
            tamaño: (file.size / 1024).toFixed(1) + ' KB',
            fileObj: file
          });
        }
      });
      event.target.value = '';
      this.listaExpanded = true;
    },

    quitarArchivo(index) {
      this.archivosExcel.splice(index, 1);
    },

    verExcel(index) {
      const archivo = this.archivosExcel[index];
      this.excelState.archivoNombre = archivo.nombre;
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        this.excelState.workbook = wb;
        this.excelState.hojas = wb.SheetNames;
        this.excelState.hojaActiva = wb.SheetNames[0];
        this.cargarHoja(wb.SheetNames[0]);
        this.excelState.modalVisible = true;
      };
      reader.readAsArrayBuffer(archivo.fileObj);
    },

    cargarHoja(nombre) {
      const sheet = this.excelState.workbook.Sheets[nombre];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      if (!json.length) {
        this.excelState.datosHoja = [];
        this.excelState.columnas = [];
        return;
      }
      this.excelState.columnas = Object.keys(json[0]).map(k => ({
        name: k, label: k, field: k, align: 'left', sortable: true
      }));
      this.excelState.datosHoja = json;
    },

    importarDatosExcel() {
      if (!this.excelState.datosHoja.length) return;
      const rows = this.excelState.datosHoja;
      const headers = Object.keys(rows[0]);
      
      const findH = (key) => {
        const aliases = COLUMN_MAPPING[key] || [];
        return headers.find(h => aliases.includes(h.toLowerCase().trim().replace(/[^\w\s]/g, '')));
      };

      const mappedData = {
        proyecto: rows[0][findH('proyecto')] || '',
        area: rows[0][findH('area')] || '',
        solicitante: rows[0][findH('solicitante')] || '',
        servicio: {
          tipoServicio: rows[0][findH('servicio.tipoServicio')],
          tipoVehiculo: rows[0][findH('servicio.tipoVehiculo')]
        },
        transporte: {
          origen: rows[0][findH('transporte.origen')],
          destino: rows[0][findH('transporte.destino')],
          fechaHoraSalida: rows[0][findH('transporte.fechaHoraSalida')],
          fechaHoraRegreso: rows[0][findH('transporte.fechaHoraRegreso')]
        },
        justificacion: {
          motivoTraslado: rows[0][findH('justificacion.motivoTraslado')],
          relacionProyecto: rows[0][findH('justificacion.relacionProyecto')]
        },
        pasajeros: []
      };

      // Limpiar undefined
      if (!mappedData.servicio.tipoServicio) delete mappedData.servicio.tipoServicio;
      if (!mappedData.servicio.tipoVehiculo) delete mappedData.servicio.tipoVehiculo;

      // Pasajeros
      const pHeaders = {
        nombre: findH('pasajeros.nombre'),
        documento: findH('pasajeros.documento'),
        cargo: findH('pasajeros.cargo'),
        telefono: findH('pasajeros.telefono')
      };

      if (pHeaders.nombre || pHeaders.documento) {
        mappedData.pasajeros = rows.map(row => ({
          nombre: row[pHeaders.nombre] || '',
          documento: row[pHeaders.documento] || '',
          cargo: row[pHeaders.cargo] || '',
          telefono: row[pHeaders.telefono] || ''
        })).filter(p => p.nombre || p.documento);
      }

      // Transferir al formulario mediante ref
      if (this.$refs.formComponent) {
        this.$refs.formComponent.importData(mappedData);
        this.$q.notify({
          color: 'indigo-8',
          message: 'Información del Excel cargada en el formulario',
          icon: 'auto_awesome'
        });
        this.excelState.modalVisible = false;
      }
    },

    handleSuccess(data) {
      this.$q.notify({
        message: 'Solicitud guardada exitosamente en modo BORRADOR',
        color: 'positive',
        textColor: 'white',
        icon: 'check_circle',
        position: 'top',
        timeout: 3000
      });
      this.$router.push({ name: 'lista-solicitudes-terrestre' });
    }
  }
};
</script>

<style scoped>
@keyframes in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: in 0.6s ease-out forwards;
}

.btn-excel-tool {
  height: 44px;
  border-radius: 12px;
  background: #10b981 !important;
  color: white !important;
  font-weight: 700;
  text-transform: none;
  padding: 0 24px;
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
}

.excel-manager-expansion {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  overflow: hidden;
}

.excel-manager-header {
  font-weight: 700;
  color: #475569;
}

/* --- EXCEL VIEWER MODAL --- */
.excel-view-card { display: flex; flex-direction: column; background: #f8fafc; }

.excel-view-top-bar {
  background: linear-gradient(135deg, #3730a3 0%, #4f46e5 100%);
  padding: 16px 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
}

.excel-view-icon-box {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.excel-view-title { font-size: 20px; font-weight: 800; color: white; letter-spacing: -0.02em; }
.excel-view-info { font-size: 13px; color: rgba(255, 255, 255, 0.7); }

.excel-view-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
}

.excel-view-tabs {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 16px;
  flex-shrink: 0;
}

.excel-tabs-wrapper { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }

.excel-tab-node {
  padding: 14px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.excel-tab-node:hover { color: #1e293b; background: #f1f5f9; }
.excel-tab-node--active { color: #4f46e5; border-bottom-color: #4f46e5; background: #eff6ff; }

.excel-view-content { flex: 1; overflow: auto; background: white; }
.excel-view-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.btn-import-to-form {
  background: #4f46e5 !important;
  color: white !important;
  font-weight: 700;
  height: 48px;
  padding: 0 32px;
  border-radius: 14px;
  text-transform: none;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.2);
}

.btn-cancel-view { font-weight: 700; color: #475569; text-transform: none; }
</style>
