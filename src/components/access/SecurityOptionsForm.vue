<template>
  <!--
    PASO 3 — Token + opciones de seguridad.

    UX aplicada:
      - El token es server-side (UUID con formato XXXX-XXXX-XXXX-XXXX).
        El cliente NUNCA lo genera por sí mismo.
      - El input es readonly y la única forma de cambiarlo es a través del botón
        [Generar token] (Recognition over Recall).
      - Las opciones de seguridad se agrupan visualmente — primero las
        habituales (cambio de password, correo) y luego las avanzadas (MFA).
      - El estado calculado (ACTIVE / BLOCKED / PENDING_CHANGE) se muestra
        como QBadge en tiempo real → feedback inmediato.
  -->
  <div class="ac-step">

    <!-- ============== TOKEN DE ACCESO ============== -->
    <div class="ac-section-label q-mb-xs">Token de acceso</div>
    <div class="row q-col-gutter-sm items-center">
      <div class="col-12 col-sm">
        <q-input
          :value="store.accessToken"
          readonly
          outlined
          label="Token (generado por el sistema)"
          hint="Permite autenticar aplicaciones o sesiones seguras"
          placeholder="Aún sin token"
          class="ac-token-input"
        >
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
          <template v-slot:append>
            <q-btn
              flat
              dense
              round
              color="grey-7"
              icon="content_copy"
              :disable="!store.accessToken"
              @click="onCopy"
            >
              <q-tooltip>Copiar token</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-auto">
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="refresh"
          :label="store.accessToken ? 'Regenerar' : 'Generar token'"
          :loading="store.isGeneratingToken"
          @click="onGenerateToken"
        />
      </div>
    </div>

    <q-separator class="q-my-lg" />

    <!-- ============== OPCIONES DE SEGURIDAD ============== -->
    <div class="ac-section-label q-mb-sm">Opciones de seguridad</div>

    <div class="ac-toggles">
      <q-toggle
        :value="store.forcePasswordChange"
        @input="(v) => store.forcePasswordChange = v"
        color="primary"
        left-label
        label="Requerir cambio de contraseña al ingresar"
        class="ac-toggle q-mb-sm"
      />
      <div class="ac-toggle-hint">
        Mayor seguridad: el colaborador definirá su propia contraseña al primer acceso.
      </div>

      <q-toggle
        :value="store.sendWelcomeEmail"
        @input="(v) => store.sendWelcomeEmail = v"
        color="primary"
        left-label
        label="Enviar correo de bienvenida"
        class="ac-toggle q-mb-sm q-mt-md"
      />
      <div class="ac-toggle-hint">
        El colaborador recibirá sus credenciales en su correo registrado.
      </div>

      <q-toggle
        :value="store.requireMfa"
        @input="(v) => store.requireMfa = v"
        color="primary"
        left-label
        label="Requerir doble autenticación (MFA)"
        class="ac-toggle q-mb-sm q-mt-md"
      />
      <div class="ac-toggle-hint">
        Añade una segunda capa de seguridad. Recomendado para cuentas administrativas.
      </div>

      <q-toggle
        :value="store.active"
        @input="(v) => store.active = v"
        color="primary"
        left-label
        label="Acceso activo"
        class="ac-toggle q-mb-sm q-mt-md"
      />
      <div class="ac-toggle-hint">
        Si lo desactivas, el colaborador no podrá iniciar sesión hasta que lo reactives.
      </div>
    </div>

    <!-- ============== INDICADOR DE ESTADO ============== -->
    <q-separator class="q-my-lg" />

    <div class="row items-center q-col-gutter-sm">
      <div class="text-body2 text-weight-medium text-grey-8">Estado resultante:</div>
      <q-badge
        :color="statusBadge.color"
        rounded
        class="q-px-md q-py-xs"
      >
        <q-icon :name="statusBadge.icon" size="14px" class="q-mr-xs" />
        {{ statusBadge.label }}
      </q-badge>
    </div>
  </div>
</template>

<script>
import { useAccessStore } from 'src/stores/accessStore';

export default {
  name: 'SecurityOptionsForm',

  computed: {
    store () {
      return useAccessStore();
    },
    /**
     * Mapeo entre el estado calculado y su representación visual.
     * - ACTIVE: verde (operativo)
     * - PENDING_CHANGE: naranja (debe cambiar contraseña al ingresar)
     * - BLOCKED: rojo (no puede ingresar)
     */
    statusBadge () {
      const status = this.store.accessStatusLabel;
      if (status === 'BLOCKED') {
        return { color: 'negative', icon: 'block', label: 'Bloqueado' };
      }
      if (status === 'PENDING_CHANGE') {
        return { color: 'warning', icon: 'lock_reset', label: 'Debe cambiar contraseña' };
      }
      return { color: 'positive', icon: 'check_circle', label: 'Activo' };
    }
  },

  methods: {
    async onGenerateToken () {
      await this.store.generateToken();
      if (this.store.accessToken) {
        this.$q.notify({
          type: 'positive',
          message: 'Token generado',
          position: 'top-right',
          timeout: 1500,
          icon: 'vpn_key'
        });
      }
    },
    onCopy () {
      if (!this.store.accessToken) return;
      this.$q.copyToClipboard(this.store.accessToken)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Token copiado al portapapeles',
            position: 'top-right',
            timeout: 1500,
            icon: 'content_copy'
          });
        })
        .catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'No se pudo copiar el token',
            position: 'top-right'
          });
        });
    }
  }
};
</script>

<style scoped>
.ac-section-label {
  font-size: 11px;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ac-token-input >>> .q-field__native {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.ac-toggle {
  font-size: 13px;
}

.ac-toggle-hint {
  font-size: 11px;
  color: #94A3B8;
  margin-left: 4px;
  margin-bottom: 4px;
  line-height: 1.5;
}
</style>
