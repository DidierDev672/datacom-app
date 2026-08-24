<template>
  <div class="base-modal-anchor">
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-overlay"
        role="dialog"
        aria-modal="true"
        @click.self="cerrar"
      >
        <div class="modal-window">
          <button
            type="button"
            class="modal-close-btn"
            aria-label="Cerrar modal"
            @click="cerrar"
          >
            <span aria-hidden="true">&times;</span>
          </button>

          <header class="modal-window__header">
            <slot name="header" />
          </header>

          <div class="modal-window__body">
            <slot />
          </div>

          <footer v-if="$scopedSlots.footer" class="modal-window__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "BaseModal",

  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },

  watch: {
    isOpen: {
      immediate: true,
      handler(abierto) {
        if (abierto) {
          document.addEventListener("keydown", this.onKeydown);
          document.body.style.overflow = "hidden";
        } else {
          document.removeEventListener("keydown", this.onKeydown);
          document.body.style.overflow = "";
        }
      },
    },
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$el && this.$el.parentNode !== document.body) {
        this._parentOriginal = this.$el.parentNode;
        document.body.appendChild(this.$el);
      }
    });
  },

  beforeDestroy() {
    document.removeEventListener("keydown", this.onKeydown);
    document.body.style.overflow = "";
    if (this._parentOriginal && this._parentOriginal.appendChild) {
      this._parentOriginal.appendChild(this.$el);
    }
  },

  methods: {
    cerrar() {
      this.$emit("close");
    },
    onKeydown(e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        this.cerrar();
      }
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(3px);
}

.modal-window {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 680px;
  max-height: 85vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(2, 8, 23, 0.35);
  overflow: hidden;
}

.modal-close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 1;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: #f1f5f9;
  color: #475569;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.modal-close-btn:hover,
.modal-close-btn:focus {
  background: #fee2e2;
  color: #b91c1c;
  outline: none;
}

.modal-window__header {
  padding: 20px 56px 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-window__body {
  flex: 1 1 auto;
  padding: 20px 24px;
  overflow-y: auto;
}

.modal-window__footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

@media (max-width: 599px) {
  .modal-overlay {
    padding: 12px;
  }

  .modal-window {
    max-height: 92vh;
    border-radius: 12px;
  }

  .modal-window__header {
    padding: 16px 48px 12px 16px;
  }

  .modal-window__body {
    padding: 16px;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.modal-fade-enter-active .modal-window,
.modal-fade-leave-active .modal-window {
  transition: transform 0.25s ease-in-out;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .modal-window,
.modal-fade-leave-to .modal-window {
  transform: translateY(12px) scale(0.98);
}
</style>
