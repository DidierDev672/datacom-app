<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card class="error-modal">
      <q-card-section class="error-header">
        <div class="error-icon-wrapper">
          <q-icon :name="headerIcon" size="28px" color="white" />
        </div>
        <div class="error-header-text">
          <div class="error-title">{{ headerTitle }}</div>
          <div class="error-subtitle">{{ headerSubtitle }}</div>
        </div>
      </q-card-section>

      <q-card-section class="error-body">
        <div class="empathy-block">
          <q-icon name="sentiment_neutral" size="20px" color="amber-7" class="empathy-icon" />
          <p class="empathy-text">
            {{ empathyMessage }}
          </p>
        </div>

        <div class="details-section">
          <div class="details-title">¿Qué ocurrió?</div>
          <div class="detail-list">
            <div class="detail-item" :class="'detail-item--' + errorCategory">
              <q-icon :name="categoryIcon" size="18px" />
              <div>
                <div class="detail-label">{{ categoryLabel }}</div>
                <div class="detail-desc">{{ categoryDescription }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="suggestions-section">
          <div class="suggestions-title">¿Qué puedes hacer?</div>
          <div class="suggestion-list">
            <div class="suggestion-item" @click="$emit('retry')">
              <q-icon name="refresh" size="20px" color="primary" />
              <div>
                <div class="sug-label">Intentar de nuevo</div>
                <div class="sug-desc">Revisa los datos y vuelve a intentarlo</div>
              </div>
              <q-icon name="chevron_right" size="18px" color="grey-4" />
            </div>
            <div class="suggestion-item" @click="$emit('review')">
              <q-icon name="edit" size="20px" color="warning" />
              <div>
                <div class="sug-label">Revisar formulario</div>
                <div class="sug-desc">Verifica que todos los campos estén correctos</div>
              </div>
              <q-icon name="chevron_right" size="18px" color="grey-4" />
            </div>
            <div class="suggestion-item" @click="$emit('contact')">
              <q-icon name="support_agent" size="20px" color="blue-7" />
              <div>
                <div class="sug-label">Contactar soporte</div>
                <div class="sug-desc">Si el problema persiste, reporta el incidente</div>
              </div>
              <q-icon name="chevron_right" size="18px" color="grey-4" />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="error-footer">
        <q-btn flat label="Cerrar" color="grey-7" @click="$emit('update:modelValue', false)" no-caps class="btn-close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
const ERROR_CATEGORIES = {
  VALIDATION: {
    icon: 'warning',
    label: 'Datos incompletos o inválidos',
    desc: 'Algunos campos requeridos no fueron diligenciados correctamente.',
    title: 'Ajusta los datos',
    subtitle: 'Faltan campos obligatorios',
    empathy: 'Revisamos que los datos estén completos antes de guardar. Parece que faltan algunos campos por diligenciar.'
  },
  CONFLICT: {
    icon: 'lock',
    label: 'Conflicto con datos existentes',
    desc: 'El rubro que intentas actualizar tiene restricciones que impiden el cambio.',
    title: 'No pudimos aplicar el cambio',
    subtitle: 'El rubro tiene restricciones activas',
    empathy: 'Entendemos que necesitas actualizar esta información. Sin embargo, el rubro está vinculado a procesos que protegen su integridad.'
  },
  SERVER: {
    icon: 'cloud_off',
    label: 'Error interno del servidor',
    desc: 'Ocurrió un problema inesperado en el servidor. Tus datos están a salvo.',
    title: 'Algo salió mal',
    subtitle: 'Error temporal en el servidor',
    empathy: 'No te preocupes, tus datos no se han perdido. Fue un problema momentáneo de conexión con el servidor.'
  },
  NETWORK: {
    icon: 'wifi_off',
    label: 'Problema de conexión',
    desc: 'No se pudo establecer comunicación con el servidor. Verifica tu conexión.',
    title: 'Sin conexión',
    subtitle: 'No pudimos comunicarnos con el servidor',
    empathy: 'Parece que hay un problema de conexión. No te preocupes, los datos que ingresaste aún están disponibles.'
  },
  UNKNOWN: {
    icon: 'error_outline',
    label: 'Error inesperado',
    desc: 'Ocurrió un problema que no pudimos identificar automáticamente.',
    title: 'Algo salió mal',
    subtitle: 'Error inesperado',
    empathy: 'Lamentamos el inconveniente. Ocurrió un error inesperado y no pudimos completar la operación.'
  }
};

export default {
  name: 'UpdateErrorModal',
  props: {
    modelValue: { type: Boolean, default: false },
    error: { type: [Object, Error, String], default: null },
    rubroName: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'retry', 'review', 'contact'],
  computed: {
    errorCategory() {
      if (!this.error) return 'UNKNOWN';
      if (typeof this.error === 'string') return 'UNKNOWN';
      var status = this.error.status || (this.error.response && this.error.response.status);
      if (!status) return 'UNKNOWN';
      if (status >= 400 && status < 500) {
        if (status === 400 || status === 422) return 'VALIDATION';
        if (status === 409) return 'CONFLICT';
        return 'VALIDATION';
      }
      if (status >= 500) return 'SERVER';
      return 'UNKNOWN';
    },
    categoryConfig() {
      return ERROR_CATEGORIES[this.errorCategory] || ERROR_CATEGORIES.UNKNOWN;
    },
    headerIcon() {
      var map = { VALIDATION: 'fact_check', CONFLICT: 'lock', SERVER: 'cloud_off', NETWORK: 'wifi_off', UNKNOWN: 'error_outline' };
      return map[this.errorCategory] || 'error_outline';
    },
    headerTitle() {
      return this.categoryConfig.title;
    },
    headerSubtitle() {
      return this.categoryConfig.subtitle;
    },
    empathyMessage() {
      var name = this.rubroName || 'el rubro';
      var base = this.categoryConfig.empathy;
      if (name && base.indexOf('el rubro') !== -1) {
        return base.replace('el rubro', '"' + name + '"');
      }
      return base;
    },
    categoryLabel() {
      return this.categoryConfig.label;
    },
    categoryDescription() {
      return this.categoryConfig.desc;
    },
    categoryIcon() {
      return this.categoryConfig.icon;
    }
  }
};
</script>

<style scoped>
.error-modal {
  max-width: 500px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #FFFFFF;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
}

.error-icon-wrapper {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.error-subtitle {
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
}

.error-body {
  padding: 16px 24px 20px;
}

.empathy-block {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  background: #FFFBEB;
  border-radius: 10px;
  margin-bottom: 20px;
}

.empathy-icon {
  margin-top: 2px;
  flex-shrink: 0;
}

.empathy-text {
  font-size: 13.5px;
  color: #374151;
  line-height: 1.55;
  margin: 0;
}

.details-section {
  margin-bottom: 20px;
}

.details-title,
.suggestions-title {
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid transparent;
}

.detail-item--VALIDATION {
  background: #FFFBEB;
  border-left-color: #F59E0B;
  color: #92400E;
}

.detail-item--CONFLICT {
  background: #FEF2F2;
  border-left-color: #EF4444;
  color: #991B1B;
}

.detail-item--SERVER {
  background: #EFF6FF;
  border-left-color: #3B82F6;
  color: #1E40AF;
}

.detail-item--NETWORK {
  background: #F5F3FF;
  border-left-color: #8B5CF6;
  color: #5B21B6;
}

.detail-item--UNKNOWN {
  background: #F9FAFB;
  border-left-color: #9CA3AF;
  color: #374151;
}

.detail-label {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

.detail-desc {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 1px;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  border: 1px solid #E5E7EB;
}

.suggestion-item:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.sug-label {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.sug-desc {
  font-size: 12px;
  color: #6B7280;
  margin-top: 1px;
}

.error-footer {
  padding: 8px 16px;
  border-top: 1px solid #F3F4F6;
}

.btn-close {
  font-weight: 600;
}
</style>
