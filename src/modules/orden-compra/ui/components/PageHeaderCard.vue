<template>
  <q-card flat class="page-header-card">
    <q-card-section class="page-header-card__banner">
      <div class="row items-center no-wrap q-col-gutter-md">
        <div class="page-header-card__icon-wrap">
          <q-icon name="shopping_cart_checkout" size="28px" />
        </div>

        <div class="col page-header-card__body">
          <!-- Título de la página, recibido por props -->
          <h1 class="page-header-card__title text-white">{{ title }}</h1>
          <!-- Ranura para elementos adicionales: subtítulo, chips, botones -->
          <div v-if="$slots.default" class="page-header-card__extra">
            <slot />
          </div>
        </div>

        <div v-if="$slots.actions" class="col-auto">
          <slot name="actions" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
/**
 * Header de página reutilizable.
 *
 * - Prop obligatoria `title`: nombre de la página.
 * - Slot por defecto: elementos adicionales como el subtítulo.
 * - Slot con nombre `actions`: acciones alineadas a la derecha.
 */
export default {
  name: "PageHeaderCard",

  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.page-header-card {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #d7e3cf;
}

.page-header-card__banner {
  padding: 20px 22px;
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
  color: #fff;
}

.page-header-card__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  flex-shrink: 0;
  margin-right: 4px;
}

.page-header-card__body {
  min-width: 0;
}

.page-header-card__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.01em;
  word-break: break-word;
}

.page-header-card__extra {
  margin-top: 4px;
  font-size: 0.86rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.92);
}

@media (max-width: 600px) {
  .page-header-card__banner {
    padding: 16px;
  }

  .page-header-card__title {
    font-size: 1.15rem;
  }
}
</style>
