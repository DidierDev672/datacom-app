<template>
  <div class="audit-timeline-container">
    <!-- Loading state -->
    <div v-if="loading" class="flex flex-center q-pa-lg">
      <q-spinner-dots size="50px" color="primary" />
      <span class="q-ml-md">Cargando historial...</span>
    </div>

    <!-- Error state -->
    <div v-if="error" class="q-pa-md">
      <q-banner class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Error al cargar el historial: {{ error }}
        <template v-slot:action>
          <q-btn flat label="Reintentar" @click="$emit('retry')" />
        </template>
      </q-banner>
    </div>

         <!-- Timeline -->
     <div v-if="!loading && !error" class="audit-timeline">
              <q-timeline color="primary" class="q-pa-md q-pl-xl">
         <q-timeline-entry
           v-for="entry in sortedAuditEntries"
           :key="entry.id"
          :color="getActionColor(entry.action)"
          :icon="getActionIcon(entry.action)"
          :title="entry.summary"
          :subtitle="formatDate(entry.occurredAt)"
          class="timeline-entry"
        >
          <!-- Entry header with performer and action -->
          <div class="row items-center q-mb-sm">
            <q-chip
              :color="getActionColor(entry.action)"
              text-color="white"
              :icon="getActionIcon(entry.action)"
              size="sm"
              class="q-mr-sm"
            >
              {{ getActionLabel(entry.action) }}
            </q-chip>
            <q-space />
            <div class="text-caption text-grey-6">
              {{ formatDateTime(entry.occurredAt) }}
            </div>
          </div>

          <!-- Performer information -->
          <div class="q-mb-sm">
            <div class="row items-center">
              <q-icon name="person" color="grey-6" size="xs" class="q-mr-xs" />
              <span class="text-weight-medium">{{ entry.performedBy }}</span>
              <q-space />
              <q-chip
                v-if="entry.tenantId"
                color="grey-4"
                text-color="grey-8"
                size="xs"
                dense
                :label="entry.tenantId"
              />
            </div>
          </div>

          <!-- Summary -->
          <div class="q-mb-sm">
            <p class="text-body2 q-ma-none">{{ entry.summary }}</p>
          </div>          

                     <!-- Rejection reason if available -->
           <q-card
             v-if="entry.action === 'REJECTED' && entry.metadata && entry.metadata.reason"
             flat
             bordered
             class="bg-red-1 q-pa-sm q-mt-sm"
           >
             <div class="row items-center q-mb-xs">
               <q-icon name="cancel" color="negative" size="xs" class="q-mr-xs" />
               <span class="text-caption text-negative text-weight-bold">Motivo del rechazo</span>
             </div>
             <p class="text-body2 q-ma-none text-negative">{{ entry.metadata.reason }}</p>
           </q-card>

           <q-card
             v-if="entry.action === 'UPDATED' && entry.metadata && entry.metadata.note"
             flat
             bordered
             class="bg-blue-1 q-pa-sm q-mt-sm"
           >
             <div class="row items-center q-mb-xs">
               <q-icon name="cancel" color="info" size="xs" class="q-mr-xs" />
               <span class="text-caption text-info text-weight-bold">Motivo de la reactivación</span>
             </div>
             <p class="text-body2 q-ma-none text-info">{{ entry.metadata.note }}</p>
           </q-card>
        </q-timeline-entry>

        <!-- Empty state -->
        <q-timeline-entry
          v-if="auditEntries.length === 0"
          color="grey"
          icon="history"
          title="Sin historial disponible"
          subtitle="No se encontraron registros de auditoría"
        >
          <div class="text-grey-6">
            <q-icon name="info" class="q-mr-xs" />
            No hay eventos registrados para esta orden.
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>

  </div>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'AuditHistoryTimeline',
  props: {
    auditEntries: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
     },
   emits: ['retry'],
   computed: {
     sortedAuditEntries() {
       // Ordenar eventos por fecha de forma descendente (más reciente primero)
       return [...this.auditEntries].sort((a, b) => {
         return new Date(b.occurredAt) - new Date(a.occurredAt)
       })
     }
   },
   methods: {
    getActionColor(action) {
      const colors = {
        'CREATED': 'positive',
        'UPDATED': 'info', 
        'APPROVED': 'positive',
        'REJECTED': 'negative',
        'SUBMITTED': 'warning',
        'CANCELED': 'negative',
        'ASSIGNED': 'purple'
      }
      return colors[action] || 'grey'
    },
    
    getActionIcon(action) {
      const icons = {
        'CREATED': 'add_circle',
        'UPDATED': 'edit',
        'APPROVED': 'check_circle',
        'REJECTED': 'cancel',
        'SUBMITTED': 'send',
        'CANCELED': 'block',
        'ASSIGNED': 'assignment_ind'
      }
      return icons[action] || 'history'
    },
    
    getActionLabel(action) {
      const labels = {
        'CREATED': 'Creada',
        'UPDATED': 'Actualizada',
        'APPROVED': 'Aprobada',
        'REJECTED': 'Rechazada',
        'SUBMITTED': 'Enviada',
        'CANCELED': 'Cancelada',
        'ASSIGNED': 'Asignada'
      }
      return labels[action] || action
    },
    
    formatDate(dateString) {
      if (!dateString) return 'Fecha no disponible'
      return date.formatDate(new Date(dateString), 'DD/MM/YYYY')
    },
    
    formatDateTime(dateString) {
      if (!dateString) return 'Fecha no disponible'
      return date.formatDate(new Date(dateString), 'DD/MM/YYYY HH:mm')
    },
    
    formatMetadataKey(key) {
      const keyMappings = {
        'state': 'Estado',
        'reason': 'Razón',
        'orderCode': 'Código de orden',
        'amount': 'Monto',
        'approver': 'Aprobador',
        'assignedTo': 'Asignado a'
      }
      return keyMappings[key] || key.charAt(0).toUpperCase() + key.slice(1)
    },
    
    formatMetadataValue(key, value) {
      if (key === 'state') {
        const stateMappings = {
          'PENDING_AUTHORIZATION': 'Pendiente de autorización',
          'APPROVED': 'Aprobada',
          'REJECTED': 'Rechazada',
          'PENDING_SUPPLY': 'Pendiente de abastecimiento'
        }
        return stateMappings[value] || value
      }
      
      if (key === 'amount' && typeof value === 'number') {
        return `$${value.toLocaleString()}`
      }
      
      return value
    },
    
    getUniquePerformers() {
      return [...new Set(this.auditEntries.map(entry => entry.performedBy))]
    },
    
    getTimeSpan() {
      if (this.auditEntries.length < 2) return 'N/A'
      
      const dates = this.auditEntries.map(entry => new Date(entry.occurredAt)).sort()
      const firstDate = dates[0]
      const lastDate = dates[dates.length - 1]
      
      const diffInMs = lastDate - firstDate
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
      
      if (diffInDays === 0) return 'Mismo día'
      if (diffInDays === 1) return '1 día'
      return `${diffInDays} días`
    },
    
         getLastAction() {
       if (this.sortedAuditEntries.length === 0) return 'N/A'
       
       // El primer elemento ya es el más reciente por el ordenamiento
       return this.getActionLabel(this.sortedAuditEntries[0].action)
     }
  }
}
</script>

 <style scoped>
 .audit-timeline-container {
   max-height: 70vh;
   overflow-y: auto;
   padding-left: 8px; /* Extra espacio para evitar cortes */
 }
 
 .audit-timeline {
   margin-left: 16px; /* Margen adicional para la línea de tiempo */
 }
 
 .audit-timeline .q-timeline {
   padding: 0;
   margin-left: 24px; /* Asegurar espacio suficiente para los círculos */
 }

.timeline-entry {
  margin-bottom: 1rem;
}

/* Asegurar que los iconos de la línea de tiempo no se corten */
.audit-timeline ::v-deep .q-timeline__subtitle {
  margin-left: 0;
}

.audit-timeline ::v-deep .q-timeline__dot {
  margin-left: 0;
  z-index: 1;
}

.audit-timeline ::v-deep .q-timeline__content {
  padding-left: 24px;
}

.metadata-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metadata-key {
  font-weight: 500;
  color: #666;
  min-width: 120px;
  font-size: 0.75rem;
}

.metadata-value {
  font-weight: 400;
  color: #333;
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .metadata-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metadata-key {
    min-width: 100px;
  }
}

/* Custom scrollbar for timeline container */
.audit-timeline-container::-webkit-scrollbar {
  width: 6px;
}

.audit-timeline-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.audit-timeline-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.audit-timeline-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Timeline entry animations */
.timeline-entry {
  transition: all 0.2s ease;
}

.timeline-entry:hover {
  transform: translateX(4px);
}

/* Card hover effects */
.q-card {
  transition: all 0.2s ease;
}

.q-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
