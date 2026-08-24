<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="vinculacion-card">
      <q-card-section class="text-center q-pt-xl q-px-lg">
        <div class="vinculacion-badge">
          <q-icon name="person_search" size="32px" color="white" />
        </div>

        <div class="vinculacion-title q-mt-md">
          Aún no estás vinculado a un área de trabajo
        </div>

        <p class="vinculacion-message q-mt-md">
          Esto es completamente normal: tu usuario de sistema aún no se ha asociado
          con un colaborador en Talento Humano. Sin este vínculo, algunas funciones
          no estarán disponibles — pero resolverlo es muy sencillo.
        </p>

        <div class="vinculacion-steps q-mt-lg">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              <span class="step-label">Ve al módulo Talento Humano</span>
              <span class="step-desc">Busca la sección «Colaboradores» en el menú principal.</span>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              <span class="step-label">Regístrate como colaborador</span>
              <span class="step-desc">Si aún no existes, crea un registro con tus datos.</span>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              <span class="step-label">Vincula tu usuario</span>
              <span class="step-desc">Asocia tu sesión al colaborador desde la opción «Configurar aprobadores».</span>
            </div>
          </div>
        </div>

        <p class="vinculacion-hint q-mt-md">
          Una vez vinculado, todas las funcionalidades del sistema se activarán
          automáticamente. No necesitas hacer nada más.
        </p>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-xl q-px-lg q-gutter-sm">
        <q-btn flat no-caps label="Entendido" color="grey-7" class="vinculacion-btn"
          @click="onDismiss" />
        <q-btn unelevated no-caps label="Ir a Talento Humano" color="primary"
          class="vinculacion-btn vinculacion-btn--primary" @click="onGoToTH" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ColaboradorVinculacionModal',

  data() {
    return {
      visible: false,
    };
  },

  methods: {
    show() {
      this.visible = true;
    },

    onDismiss() {
      this.visible = false;
    },

    onGoToTH() {
      this.visible = false;
      this.$router.push('/talento-humano/colaboradores');
    },
  },
};
</script>

<style scoped>
.vinculacion-card {
  width: 100%;
  max-width: 480px;
  border-radius: 16px;
  overflow: hidden;
}

.vinculacion-badge {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.vinculacion-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.01em;
}

.vinculacion-message {
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

.vinculacion-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.step-number {
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.step-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.step-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
}

.vinculacion-hint {
  font-size: 13px;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  font-style: italic;
  padding: 10px 12px;
  background: #eff6ff;
  border-radius: 8px;
}

.vinculacion-btn {
  min-width: 140px;
  border-radius: 8px;
  font-weight: 600;
}

.vinculacion-btn--primary {
  padding: 0 20px;
}
</style>
