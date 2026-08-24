<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div>
        <div class="title-xl">Nueva Requisición de Compras</div>
        <div class="text-body-custom">
          Complete el Formulario de Requisición de Compras (FODC-PCO-F-019).
        </div>
      </div>
      <q-space />
      <q-btn 
        unelevated
        icon="attach_file" 
        label="Adjuntar documentos" 
        @click="$refs.fileInput.click()"
        class="btn btn-primary"
      />
      <q-btn 
        outline
        color="primary"
        icon="view_list" 
        label="Lista de requisiciones" 
        :to="{ name: 'requisiciones-compras-lista' }"
        class="q-ml-sm"
        style="border-radius: 8px; text-transform: none; font-weight: 600;"
      />
      <q-btn 
        outline
        color="negative"
        icon="cleaning_services" 
        label="Limpiar formulario" 
        @click="$refs.stepperComponent.limpiarFormulario()"
        class="q-ml-sm"
        style="border-radius: 8px; text-transform: none; font-weight: 600;"
      />
      <input 
        type="file" 
        ref="fileInput" 
        style="display: none" 
        multiple 
        @change="onFilesSelected"
      />
    </div>
    
    <!-- Lista de Documentos Globales (Colapsable) -->
    <div v-if="documentos && documentos.length > 0" class="accordion-wrapper">
      <q-expansion-item
        header-class="accordion-header"
        expand-icon-class="accordion-icon"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="folder_zip" color="primary" size="24px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="title-md no-margin">Documentos Adjuntos ({{ documentos.length }})</q-item-label>
            <q-item-label class="text-secondary-custom">Archivos guardados en esta requisición</q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section class="q-pa-none accordion-content">
            <q-list separator>
              <q-item v-for="(doc, index) in documentos" :key="index" class="q-py-sm hover-item">
                <q-item-section avatar>
                  <q-icon :name="getFileIcon(doc.type)" color="grey-7" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ doc.name }}</q-item-label>
                  <q-item-label caption>{{ formatFileSize(doc.size) }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row q-gutter-xs">
                    <q-btn flat round dense color="primary" icon="visibility" @click="viewDocument(doc)" />
                    <q-btn flat round dense color="negative" icon="delete" @click="store.removeDocumento(index)" />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <RequisicionStepper ref="stepperComponent" />

    <!-- Modal de Detalles (Global) -->
    <q-dialog v-model="showDocModal">
      <q-card style="min-width: 350px; border-radius: 16px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="title-lg no-margin">Detalles del Documento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedDoc" class="q-pt-md">
          <div class="column q-gutter-y-sm">
            <div class="row border-bottom q-pb-xs">
              <div class="col-4 text-grey-7">Nombre:</div>
              <div class="col-8 text-weight-medium text-break-all">{{ selectedDoc.name }}</div>
            </div>
            <div class="row border-bottom q-pb-xs q-mt-sm">
              <div class="col-4 text-grey-7">Tamaño:</div>
              <div class="col-8 text-weight-medium">{{ formatFileSize(selectedDoc.size) }}</div>
            </div>
            <div class="row border-bottom q-pb-xs q-mt-sm">
              <div class="col-4 text-grey-7">Tipo:</div>
              <div class="col-8 text-weight-medium">{{ selectedDoc.type || 'No especificado' }}</div>
            </div>
          </div>

          <!-- Sección de Contenido -->
          <div class="q-mt-lg">
            <div class="title-sm">Contenido / Información:</div>
            
            <div v-if="loadingContent" class="flex flex-center q-pa-md">
              <q-spinner-dots color="primary" size="40px" />
            </div>

            <div v-else class="content-preview bg-grey-1 q-pa-md rounded-borders border">
              <template v-if="selectedDocContent">
                <div v-if="isHtmlContent" v-html="selectedDocContent" class="word-preview-content"></div>
                <div v-else class="text-body2 whitespace-pre-wrap">{{ selectedDocContent }}</div>
              </template>
              <template v-else-if="selectedDoc && selectedDoc.type && selectedDoc.type.startsWith('image/')">
                <div class="text-center">
                  <p class="text-caption text-grey-7 q-mb-xs">Imagen detectada</p>
                  <img 
                    :src="getDocPreview(selectedDoc)" 
                    style="max-width: 100%; max-height: 250px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" 
                  />
                </div>
              </template>
              <template v-else>
                <div class="column items-center q-py-lg text-negative">
                  <q-icon name="warning" size="32px" />
                  <div class="text-weight-bold">no cuenta informacion este documento</div>
                </div>
              </template>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn unelevated label="Cerrar detalles" v-close-popup class="btn btn-secondary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import * as mammoth from 'mammoth';
import RequisicionStepper from '../components/RequisicionStepper.vue';
import { useRequisicionStore } from '../store/useRequisicionStore';

export default {
  name: 'RequisicionFormView',
  components: {
    RequisicionStepper
  },
  data() {
    return {
      showDocModal: false,
      selectedDoc: null,
      selectedDocContent: null,
      isHtmlContent: false,
      loadingContent: false
    }
  },
  computed: {
    store() {
      return useRequisicionStore();
    },
    documentos() {
      return this.store.documentos;
    }
  },
  methods: {
    onFilesSelected(event) {
      const files = Array.from(event.target.files);
      this.store.addDocumentos(files);
      event.target.value = '';
    },
    async viewDocument(doc) {
      this.selectedDoc = doc;
      this.showDocModal = true;
      await this.loadFileContent(doc);
    },
    async loadFileContent(file) {
      if (!file || file.size === 0) {
        this.selectedDocContent = null;
        this.isHtmlContent = false;
        return;
      }

      this.loadingContent = true;
      this.selectedDocContent = null;
      this.isHtmlContent = false;

      try {
        const fileName = file.name.toLowerCase();
        
        if (file.type === 'text/plain' || fileName.endsWith('.txt')) {
          this.selectedDocContent = await this.readAsText(file);
          this.isHtmlContent = false;
        } else if (file.type.includes('word') || fileName.endsWith('.docx')) {
          const arrayBuffer = await this.readAsArrayBuffer(file);
          const result = await mammoth.convertToHtml({ arrayBuffer });
          this.selectedDocContent = result.value || 'El documento no tiene contenido legible.';
          this.isHtmlContent = true;
          
          if (result.messages.length > 0) {
            console.warn('Mammoth messages:', result.messages);
          }
        } else {
          this.selectedDocContent = null;
        }
      } catch (e) {
        console.error('Error reading file:', e);
        this.selectedDocContent = null;
      } finally {
        this.loadingContent = false;
      }
    },
    readAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },
    readAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },
    getFileIcon(type) {
      if (!type) return 'insert_drive_file';
      if (type.startsWith('image/')) return 'image';
      if (type.includes('pdf')) return 'picture_as_pdf';
      if (type.includes('word') || type.includes('officedocument.word')) return 'description';
      if (type.includes('excel') || type.includes('officedocument.spreadsheet')) return 'table_chart';
      return 'insert_drive_file';
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    getDocPreview(doc) {
      if (doc && doc instanceof File && doc.type.startsWith('image/')) {
        return URL.createObjectURL(doc);
      }
      return '';
    }
  }
}
</script>

<style scoped>
/* --- Design System: Accordion (Expansion Item) --- */
.accordion-wrapper {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.accordion-header {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  padding: 12px 16px;
  transition: background 0.2s ease;
}

.accordion-header:hover {
  background: #F9FAFB;
}

.accordion-subtext {
  font-size: 12px;
  color: #6B7280;
  font-weight: 400;
  margin-top: 2px;
}

.accordion-content {
  font-size: 14px;
  line-height: 1.5;
  padding: 12px 16px;
  color: #374151;
  background: #FFFFFF;
}

.accordion-icon {
  font-size: 20px;
  color: #2563EB;
  transition: transform 0.2s ease;
}

/* Quasar specific overrides for expansion item */
::v-deep .q-expansion-item--expanded .accordion-icon {
  transform: rotate(180deg);
}

.hover-item {
  transition: background-color 0.2s ease;
}

.hover-item:hover {
  background-color: #f8fafc;
}

.text-break-all {
  word-break: break-all;
}

.border-bottom {
  border-bottom: 1px solid #f1f5f9;
}

.content-preview {
  max-height: 250px;
  overflow-y: auto;
  border-radius: 8px;
}

.border {
  border: 1px solid #e2e8f0;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}

.word-preview-content {
  font-family: 'Inter', 'Segoe UI', serif;
  line-height: 1.5;
  color: #334155;
}

.word-preview-content p {
  margin-bottom: 0.75rem;
}

.word-preview-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.word-preview-content th, .word-preview-content td {
  border: 1px solid #cbd5e1;
  padding: 8px;
  text-align: left;
}

.word-preview-content th {
  background-color: #f1f5f9;
}

.word-preview-content ul, .word-preview-content ol {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}



/* Estados: focus + error obligatorios */
::v-deep .q-field--focused .q-field__control:after {
  border-width: 2px !important;
}
::v-deep .q-field--error .q-field__control:before {
  border-color: #C10015 !important;
  border-width: 2px !important;
}
</style>
