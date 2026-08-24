<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <q-icon :name="icon" :size="iconSize" />
    </div>
    <div class="empty-state-title">{{ title }}</div>
    <div v-if="description" class="empty-state-description">{{ description }}</div>
    <div v-if="$slots.action" class="empty-state-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'inbox'
    },
    iconSize: {
      type: String,
      default: '64px'
    }
  }
};
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #9CA3AF;
}

.empty-state-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.empty-state-description {
  font-size: 14px;
  color: #6B7280;
  max-width: 360px;
  line-height: 1.5;
}

.empty-state-action {
  margin-top: 20px;
}
</style>
