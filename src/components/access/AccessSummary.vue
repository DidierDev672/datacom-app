<template>
  <!--
    PASO 4 — Confirmación y resumen.

    UX aplicada:
      - Resumen escaneable con jerarquía clara (colaborador → username → opciones).
      - Solo mostramos las opciones de seguridad que están ACTIVAS (chunking).
      - Aviso destacado para recordar compartir credenciales de forma segura.
      - Cuando isSuccess === true, reemplazamos el resumen por un banner
        positivo + acciones de continuación (Crear otro / Ver lista).
  -->
  <div class="ac-step">

    <!-- ============== ESTADO ÉXITO ============== -->
    <q-banner v-if="store.isSuccess && store.createdAccessResult" class="ac-success-banner q-pa-lg" rounded>
      <template v-slot:avatar>
        <q-avatar color="positive" text-color="white" icon="check_circle" size="48px" />
      </template>

      <div class="text-h6 text-weight-bold text-positive q-mb-xs">
        {{ store.isEditingExistingAccess ? 'Credenciales actualizadas' : 'Acceso creado correctamente' }}
      </div>
      <div class="text-body2 text-grey-8 q-mb-sm">
        <strong>{{ store.createdAccessResult.collaboratorName }}</strong>
        {{ store.isEditingExistingAccess
          ? 'puede volver a ingresar al sistema con el username'
          : 'ahora puede ingresar al sistema con el username' }}
        <code class="ac-code">{{ store.createdAccessResult.username }}</code>.
      </div>

      <div v-if="store.createdAccessResult.emailSent" class="text-caption text-positive q-mt-sm">
        <q-icon name="mark_email_read" size="14px" class="q-mr-xs" />
        Correo de bienvenida enviado al colaborador
      </div>
      <div v-if="store.createdAccessResult.forcePasswordChange" class="text-caption text-warning q-mt-xs">
        <q-icon name="lock_reset" size="14px" class="q-mr-xs" />
        El colaborador deberá cambiar su contraseña al ingresar
      </div>

      <template v-slot:action>
        <q-btn flat no-caps color="grey-7" label="Crear otro acceso" @click="onCreateAnother" />
      </template>
    </q-banner>

    <!-- ============== RESUMEN PREVIO A CREAR ============== -->
    <template v-else>
      <q-card flat bordered class="ac-summary-card q-pa-lg">
        <div class="ac-section-label q-mb-md">Resumen</div>

        <!-- Colaborador -->
        <div class="ac-summary-row">
          <div class="ac-summary-icon">
            <q-icon name="person" color="primary" size="20px" />
          </div>
          <div class="col">
            <div class="ac-summary-label">Colaborador</div>
            <div class="ac-summary-value">
              {{ collaboratorName }}
              <span v-if="collaboratorPosition" class="text-caption text-grey-6">
                · {{ collaboratorPosition }}
              </span>
            </div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Username -->
        <div class="ac-summary-row">
          <div class="ac-summary-icon">
            <q-icon name="account_circle" color="primary" size="20px" />
          </div>
          <div class="col">
            <div class="ac-summary-label">
              {{ store.isEditingExistingAccess ? 'Username' : 'Username asignado' }}
            </div>
            <div class="ac-summary-value">
              <code class="ac-code">{{ store.username }}</code>
            </div>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Estado -->
        <div class="ac-summary-row">
          <div class="ac-summary-icon">
            <q-icon name="shield" :color="statusBadge.color" size="20px" />
          </div>
          <div class="col">
            <div class="ac-summary-label">Estado inicial</div>
            <q-badge :color="statusBadge.color" rounded class="q-px-md q-py-xs q-mt-xs">
              <q-icon :name="statusBadge.icon" size="14px" class="q-mr-xs" />
              {{ statusBadge.label }}
            </q-badge>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <!-- Opciones activas (solo las que son true) -->
        <div class="ac-summary-row">
          <div class="ac-summary-icon">
            <q-icon name="tune" color="primary" size="20px" />
          </div>
          <div class="col">
            <div class="ac-summary-label">Opciones de seguridad activadas</div>
            <ul class="ac-active-list q-mt-xs q-pl-none">
              <li v-for="opt in activeOptions" :key="opt.key">
                <q-icon name="check" size="14px" color="positive" class="q-mr-xs" />
                {{ opt.label }}
              </li>
              <li v-if="activeOptions.length === 0" class="text-grey-5 text-caption">
                Sin opciones adicionales activadas
              </li>
            </ul>
          </div>
        </div>

        <!-- Token (si aplica) -->
        <template v-if="store.accessToken">
          <q-separator class="q-my-md" />
          <div class="ac-summary-row">
            <div class="ac-summary-icon">
              <q-icon name="vpn_key" color="primary" size="20px" />
            </div>
            <div class="col">
              <div class="ac-summary-label">Token de acceso</div>
              <code class="ac-code ac-token-text">{{ store.accessToken }}</code>
            </div>
          </div>
        </template>
      </q-card>

      <!-- Aviso de seguridad -->
      <q-banner class="ac-warning-banner q-mt-md q-pa-md" rounded>
        <template v-slot:avatar>
          <q-icon name="warning_amber" color="warning" size="20px" />
        </template>
        <div class="text-body2 text-grey-8">
          <strong>Recuerda compartir las credenciales de forma segura.</strong>
          Evita enviarlas por canales no cifrados. Si activaste el correo de
          bienvenida, el sistema se encargará del envío automáticamente.
        </div>
      </q-banner>
    </template>
  </div>
</template>

<script>
import { useAccessStore } from 'src/stores/accessStore';

export default {
  name: 'AccessSummary',

  computed: {
    store() {
      return useAccessStore();
    },
    collaboratorName() {
      return this.store.selectedCollaborator
        ? this.store.selectedCollaborator.fullName
        : '';
    },
    collaboratorPosition() {
      return this.store.selectedCollaborator
        ? this.store.selectedCollaborator.position
        : '';
    },
    /** Solo lista las opciones que están en true → reduce ruido visual. */
    activeOptions() {
      const opts = [];
      if (this.store.forcePasswordChange) {
        opts.push({ key: 'fpc', label: 'Cambio de contraseña al ingresar' });
      }
      if (this.store.sendWelcomeEmail) {
        opts.push({ key: 'mail', label: 'Envío de correo de bienvenida' });
      }
      if (this.store.requireMfa) {
        opts.push({ key: 'mfa', label: 'Doble autenticación (MFA)' });
      }
      if (this.store.active) {
        opts.push({ key: 'active', label: 'Acceso activo desde el inicio' });
      }
      return opts;
    },
    statusBadge() {
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
    onCreateAnother() {
      this.store.resetForm();
      this.$emit('reset');
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

.ac-summary-card {
  border-radius: 16px;
  background: #fff;
}

.ac-summary-row {
  display: flex;
  align-items: flex-start;
}

.ac-summary-icon {
  width: 32px;
  display: flex;
  justify-content: center;
  padding-top: 2px;
}

.ac-summary-label {
  font-size: 11px;
  color: #94A3B8;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 2px;
}

.ac-summary-value {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

.ac-code {
  background: #F1F5F9;
  padding: 2px 8px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #1E293B;
}

.ac-token-text {
  letter-spacing: 0.05em;
  font-weight: 600;
}

.ac-active-list {
  list-style: none;
  margin: 0;
}

.ac-active-list li {
  font-size: 13px;
  color: #334155;
  line-height: 1.7;
  display: flex;
  align-items: center;
}

.ac-warning-banner {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-radius: 12px;
}

.ac-success-banner {
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  border-radius: 16px;
}
</style>
