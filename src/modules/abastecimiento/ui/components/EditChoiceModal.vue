<template>
  <q-dialog
    :value="value"
    @input="$emit('input', $event)"
    persistent
  >
    <q-card class="ecm-modal">
      <button
        class="ecm-close-x"
        @click="close"
        type="button"
        aria-label="Cerrar"
      >
        <q-icon name="close" size="18px" />
      </button>

      <q-card-section class="ecm-header">
        <div class="ecm-title">¿Cómo quieres editar este rubro?</div>
        <div class="ecm-subtitle">Elige la forma que prefieras. Ambas opciones están disponibles.</div>
      </q-card-section>

      <q-card-section class="ecm-body">
        <div class="ecm-options">
          <div
            class="option-card option-card--recommended"
            @click="chooseModal"
            role="button"
            tabindex="0"
            @keydown.enter="chooseModal"
          >
            <span class="badge--recommended">Recomendado</span>
            <div class="option-card-title">Editar en este panel</div>
            <div class="option-card-desc">
              Funciona de manera estable. Puedes editar sin salir de la página ni perder tu lugar.
            </div>
            <button
              class="btn--primary"
              type="button"
              @click.stop="chooseModal"
            >
              Editar aquí
            </button>
          </div>

          <div
            class="option-card option-card--alpha"
            @click="choosePage"
            role="button"
            tabindex="0"
            @keydown.enter="choosePage"
          >
            <span class="badge--alpha">Versión en pruebas</span>
            <div class="option-card-title">Editar en la página</div>
            <div class="option-card-desc">
              Esta vista está en mejoras activas y puede presentar comportamientos inesperados en algunos casos.
            </div>
            <button
              class="btn--ghost"
              type="button"
              @click.stop="choosePage"
            >
              Ir a la página
            </button>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="ecm-footer">
        <q-icon name="info_outline" size="14px" class="ecm-footer-icon" />
        <span class="ecm-footer-text">
          La edición en panel ha sido validada por el equipo y es la opción más confiable en este momento.
        </span>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "EditChoiceModal",

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    rubroName: {
      type: String,
      default: "",
    },
  },

  emits: ["input", "choose-modal", "choose-page"],

  methods: {
    chooseModal() {
      this.$emit("choose-modal");
      this.$emit("input", false);
    },
    choosePage() {
      this.$emit("choose-page");
      this.$emit("input", false);
    },
    close() {
      this.$emit("input", false);
    },
  },
};
</script>

<style scoped>
.ecm-modal {
  max-width: 560px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  padding: 28px 24px 16px;
  position: relative;
}

.ecm-close-x {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #9CA3AF;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;
}

.ecm-close-x:hover {
  background: #F3F4F6;
  color: #6B7280;
}

.ecm-header {
  text-align: center;
  padding: 0 0 8px;
}

.ecm-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 6px;
}

.ecm-subtitle {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.4;
}

.ecm-body {
  padding: 20px 0;
}

.ecm-options {
  display: flex;
  gap: 16px;
}

.option-card {
  flex: 1;
  min-width: 0;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: box-shadow 0.18s ease;
}

.option-card--recommended {
  border: 2px solid #2563EB;
  background: #EFF6FF;
}

.option-card--recommended:hover {
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
}

.option-card--alpha {
  border: 1.5px solid #E5E7EB;
  background: #F9FAFB;
  opacity: 0.85;
}

.option-card--alpha:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  opacity: 1;
}

.badge--recommended {
  display: inline-block;
  background: #2563EB;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.badge--alpha {
  display: inline-block;
  background: #FEF3C7;
  color: #B45309;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 20px;
  margin-bottom: 10px;
}

.option-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
  line-height: 1.3;
}

.option-card-desc {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

.btn--primary {
  width: 100%;
  padding: 10px 0;
  background: #2563EB;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
  margin-top: 16px;
}

.btn--primary:hover {
  background: #1D4ED8;
}

.btn--ghost {
  width: 100%;
  padding: 10px 0;
  background: transparent;
  color: #6B7280;
  border: 1.5px solid #D1D5DB;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
  margin-top: 16px;
}

.btn--ghost:hover {
  border-color: #9CA3AF;
  color: #374151;
}

.ecm-footer {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 0 4px;
  border-top: 0.5px solid #F3F4F6;
}

.ecm-footer-icon {
  color: #9CA3AF;
  flex-shrink: 0;
  margin-top: 1px;
}

.ecm-footer-text {
  font-size: 12px;
  color: #9CA3AF;
  line-height: 1.5;
}
</style>
