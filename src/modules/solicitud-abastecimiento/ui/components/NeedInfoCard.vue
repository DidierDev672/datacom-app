<template>
  <div>
    <!-- Section header -->
    <div class="section-header">
      <svg class="section-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14 2V8H20" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 13H15" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 17H13" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h2 class="section-title">Información de necesidad</h2>
    </div>

    <!-- Need info card -->
    <section class="need-card" aria-label="Información de necesidad">
      <div class="need-card__layout">
        <div class="need-card__meta">
          <span class="field-label">Subdirección</span>
          <span class="field-value">{{ need.subdirection | capitalize }}</span>
        </div>
        <div class="need-card__body">
          <span class="field-label">Descripción</span>
          <p class="need-card__desc">{{ need.description }}</p>
        </div>
      </div>
    </section>

    <!-- Observations card -->
    <section class="obs-card" aria-label="Observaciones">
      <div class="obs-card__header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="obs-card__title">Observaciones</span>
      </div>
      <div class="obs-card__body">
        <p v-if="need.observations" class="obs-card__text">
          {{ need.observations }}
        </p>
        <div v-else class="obs-card__empty">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Sin observaciones registradas</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'NeedInfoCard',
  props: {
    need: {
      type: Object,
      required: true
    }
  },
  filters: {
    capitalize(value) {
      if (!value) return '—'
      return value
        .toLowerCase()
        .replace(/(?:^|\s|\/)\S/g, char => char.toUpperCase())
    }
  }
}
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.section-icon {
  flex-shrink: 0;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin: 0;
}

.need-card {
  border: 0.5px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
  margin-bottom: 16px;
}

.need-card__layout {
  display: grid;
  grid-template-columns: 160px 1fr;
}

.need-card__meta {
  padding: 14px 16px;
  background: #F9FAFB;
  border-right: 0.5px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.need-card__body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.need-card__desc {
  font-size: 13px;
  color: #374151;
  line-height: 1.65;
  margin: 0;
}

.field-label {
  font-size: 11px;
  font-weight: 400;
  color: #9CA3AF;
  text-transform: none;
  line-height: 1.4;
}

.field-value {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
}

.obs-card {
  border: 0.5px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
}

.obs-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #F9FAFB;
  border-bottom: 0.5px solid #E5E7EB;
}

.obs-card__title {
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
}

.obs-card__body {
  padding: 14px 16px;
}

.obs-card__text {
  font-size: 13px;
  color: #374151;
  line-height: 1.65;
  margin: 0;
}

.obs-card__empty {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9CA3AF;
  font-style: normal;
}
</style>
