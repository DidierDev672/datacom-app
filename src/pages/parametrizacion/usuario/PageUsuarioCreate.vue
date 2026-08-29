<template>
  <div class="usuario-create-page">
    <!-- Header con gradiente verde cromático y animación slide-in -->
    <Transition appear enter-active-class="slide-enter-active" leave-active-class="slide-leave-active"
      enter-from-class="slide-enter-from" leave-to-class="slide-leave-to">
      <header class="usuario-header">
        <div class="usuario-header-content">
          <q-icon name="person_add" size="40px" class="usuario-header-icon" />
          <div class="usuario-header-texts">
            <h1 class="usuario-header-title text-white">Suma a un nuevo miembro a tu equipo</h1>
            <p class="usuario-header-subtitle text-white">
              Completa los datos de la persona y esta listo en pocos pasos
            </p>
          </div>
        </div>
      </header>
    </Transition>

    <!-- Sección Colaboradores -->
    <Transition appear enter-active-class="slide-enter-active" leave-active-class="slide-leave-active"
      enter-from-class="slide-enter-from" leave-to-class="slide-leave-to">
      <q-card class="colaboradores-card">
        <q-card-section class="colaboradores-card__section">
          <div class="colaboradores-card__header">
            <q-icon name="groups" size="32px" class="colaboradores-card__icon" />
            <div class="colaboradores-card__texts">
              <h2 class="colaboradores-card__title">¿A quién quieres darle acceso al sistema?</h2>
              <p class="colaboradores-card__description">
                Selecciona un colaborador para asignarle su usuario y contraseña, y así podrá iniciar sesión.
                Es tan sencillo como elegir a la persona y continuar.
              </p>
            </div>
          </div>

          <div class="colaboradores-card__body">
            <!-- Estado: selección previa -->
            <div v-if="colaboradorSeleccionado" class="colaborador-actual">
              <span class="colaborador-actual__label">Colaborador asignado</span>
              <q-badge class="colaborador-actual__badge" color="green-7">
                <q-icon name="check_circle" size="16px" class="colaborador-actual__badge-icon" />
                {{ colaboradorSeleccionado.nombreCompleto }}
                <span class="colaborador-actual__badge-detail">
                  · {{ colaboradorSeleccionado.numeroDocumento }}
                </span>
              </q-badge>
            </div>

            <!-- Botón para abrir el modal -->
            <div class="colaboradores-card__actions">
              <q-btn color="primary" unelevated no-caps icon="person_search" label="Seleccionar colaborador"
                :loading="store.isLoading" @click="abrirModal">
                <template v-slot:loading>
                  <q-spinner-dots color="white" />
                </template>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </Transition>

    <!-- Sección Credenciales de acceso -->
    <Transition appear enter-active-class="slide-enter-active" leave-active-class="slide-leave-active"
      enter-from-class="slide-enter-from" leave-to-class="slide-leave-to">
      <q-card class="credenciales-card">
        <q-card-section class="credenciales-card__section">
          <div class="credenciales-card__header">
            <q-icon name="vpn_key" size="32px" class="credenciales-card__icon" />
            <div class="credenciales-card__texts">
              <h2 class="credenciales-card__title">Crea las llaves de acceso</h2>
              <p class="credenciales-card__description">
                Define el usuario y la contraseña con los que el colaborador entrará al sistema.
                Son sus llaves personales, nadie más debería conocerlas.
              </p>
            </div>
          </div>

          <div class="credenciales-card__body">
            <div class="credenciales-card__campo">
              <label class="credenciales-card__label">Usuario</label>
              <q-input
                v-model="form.username"
                outlined
                dense
                placeholder="Ej. juan.perez"
                bg-color="white"
                class="credenciales-card__input"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="credenciales-card__campo">
              <label class="credenciales-card__label">Contraseña</label>
              <q-input
                v-model="form.password"
                outlined
                dense
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa una contraseña"
                bg-color="white"
                class="credenciales-card__input"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="primary" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    color="grey-6"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
            </div>

            <div class="credenciales-card__switch">
              <q-toggle
                v-model="usarServidorCorreo"
                color="green"
                keep-color
                dense
              />
              <div class="credenciales-card__switch-texts">
                <span class="credenciales-card__switch-label">
                  ¿El colaborador maneja servidor de correo?
                </span>
                <span class="credenciales-card__switch-hint">
                  Activa esta opción si la persona usa su propio correo corporativo.
                </span>
              </div>
            </div>

            <div class="credenciales-card__actions">
              <q-btn color="primary" unelevated no-caps icon="check" label="Asignar acceso" size="lg"
                :disable="asignando || !colaboradorSeleccionado" @click="asignarAcceso" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </Transition>

    <!-- Modal: lista de colaboradores -->
    <q-dialog v-model="modalAbierto" persistent>
      <q-card class="colaboradores-modal">
        <q-card-section class="colaboradores-modal__header">
          <div class="colaboradores-modal__title-row">
            <div class="colaboradores-modal__title-icon">
              <q-icon name="groups" size="24px" />
            </div>
            <div>
              <div class="colaboradores-modal__title">Elige a tu colaborador</div>
              <div class="colaboradores-modal__subtitle">
                Toca el nombre de la persona que quieres habilitar y lista.
              </div>
            </div>
          </div>
          <q-btn flat round dense icon="close" v-close-popup class="colaboradores-modal__close" />
        </q-card-section>

        <!-- Estado de carga -->
        <q-card-section v-if="store.isLoading" class="colaboradores-modal__state">
          <q-spinner color="primary" size="40px" />
          <p class="colaboradores-modal__state-text">Buscando colaboradores...</p>
        </q-card-section>

        <!-- Error amigable -->
        <q-card-section v-else-if="errorAlCargar" class="colaboradores-modal__state">
          <q-icon name="sentiment_dissatisfied" size="44px" color="amber-8" />
          <p class="colaboradores-modal__error-title">¡Vaya! No pudimos cargar la lista</p>
          <p class="colaboradores-modal__error-text">
            No te preocupes, no fue tu culpa. Estamos teniendo un pequeño impase al consultar
            los colaboradores. Inténtalo de nuevo en un momento.
          </p>
          <q-btn color="primary" flat no-caps icon="refresh" label="Reintentar" @click="cargarColaboradores" />
        </q-card-section>

        <!-- Lista vacía -->
        <q-card-section v-else-if="!store.colaboradores.length" class="colaboradores-modal__state">
          <q-icon name="search_off" size="44px" color="grey-5" />
          <p class="colaboradores-modal__error-text">Aún no hay colaboradores registrados.</p>
        </q-card-section>

        <!-- Lista de colaboradores -->
        <q-card-section v-else class="colaboradores-modal__list">
          <div
            v-for="colaborador in store.colaboradores"
            :key="colaborador.id"
            class="colaborador-row"
            @click="onSeleccionar(colaborador.id)"
          >
            <div class="colaborador-card">
              <div class="colaborador-card__info">
                <div class="colaborador-card__nombre">{{ colaborador.nombreCompleto }}</div>
                <div class="colaborador-card__meta">
                  <span class="colaborador-card__meta-item">
                    <q-icon name="badge" size="14px" />
                    {{ colaborador.numeroDocumento }}
                  </span>
                  <span class="colaborador-card__meta-item">
                    <q-icon name="phone" size="14px" />
                    {{ colaborador.telefono || 'Sin teléfono' }}
                  </span>
                </div>
              </div>
            </div>
            <q-radio
              v-model="seleccion"
              :val="colaborador.id"
              color="primary"
              class="colaborador-row__check"
              @input="onSeleccionar(colaborador.id)"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="colaboradores-modal__footer">
          <q-btn flat no-caps color="grey-7" label="Cancelar" v-close-popup />
          <q-btn flat no-caps color="primary" label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal: creando acceso -->
    <q-dialog v-model="modalCreando" persistent>
      <q-card class="estado-modal">
        <q-card-section class="estado-modal__state">
          <q-spinner color="primary" size="52px" />
          <p class="estado-modal__title">Estamos creando el acceso</p>
          <p class="estado-modal__text">
            Un momentito, por favor. Estamos preparando las llaves de acceso
            para que <strong>{{ colaboradorSeleccionado ? colaboradorSeleccionado.nombreCompleto : 'el colaborador' }}</strong>
            pueda entrar al sistema.
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal: éxito -->
    <q-dialog v-model="modalExito" persistent>
      <q-card class="estado-modal">
        <q-card-section class="estado-modal__state">
          <div class="estado-modal__icon estado-modal__icon--success">
            <q-icon name="check_circle" size="48px" />
          </div>
          <p class="estado-modal__title">¡Acceso otorgado!</p>
          <p class="estado-modal__text">
            <strong>{{ colaboradorSeleccionado ? colaboradorSeleccionado.nombreCompleto : 'El colaborador' }}</strong>
            ya puede iniciar sesión en el sistema. Todo listo para comenzar.
          </p>
        </q-card-section>
        <q-card-actions align="right" class="estado-modal__footer">
          <q-btn flat no-caps color="primary" label="Entendido" @click="cerrarAccesoExito" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal: error -->
    <q-dialog v-model="modalError" persistent>
      <q-card class="estado-modal">
        <q-card-section class="estado-modal__state">
          <div class="estado-modal__icon estado-modal__icon--error">
            <q-icon name="error_outline" size="48px" />
          </div>
          <p class="estado-modal__title">No pudimos otorgar el acceso</p>
          <p class="estado-modal__text">
            Tómalo con calma, que no es tu culpa. En este momento no logramos
            darle acceso a <strong>{{ colaboradorSeleccionado ? colaboradorSeleccionado.nombreCompleto : 'el colaborador' }}</strong>.
            Inténtalo de nuevo en un momento.
          </p>
        </q-card-section>
        <q-card-actions align="right" class="estado-modal__footer">
          <q-btn flat no-caps color="grey-7" label="Cerrar" @click="modalError = false" />
          <q-btn flat no-caps color="primary" icon="refresh" label="Reintentar" @click="reintentarAsignacion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api';
import { useColaboradoresStore } from 'src/piña/colaboradores';
import { userAccessApi } from 'src/api/userAccess.api';

export default defineComponent({
  name: 'PageUsuarioCreate',

  setup() {
    const store = useColaboradoresStore();
    const modalAbierto = ref(false);
    const seleccion = ref(null);
    const errorAlCargar = ref(false);
    const colaboradorSeleccionado = ref(null);
    const form = ref({
      username: '',
      password: ''
    });
    const showPassword = ref(false);
    const usarServidorCorreo = ref(false);
    const modalCreando = ref(false);
    const modalExito = ref(false);
    const modalError = ref(false);
    const asignando = ref(false);

    const cargarColaboradores = async () => {
      errorAlCargar.value = false;
      try {
        const data = await store.fetchColaboradores();
        if (!data || !data.length) {
          // lista vacía: simplemente se muestra la vista vacía
        }
      } catch (error) {
        // Detecta el status 400 específicamente
        var status = error && error.response ? error.response.status : null;
        if (status === 400) {
          errorAlCargar.value = true;
        }
      }
    };

    const abrirModal = async () => {
      modalAbierto.value = true;
      seleccion.value = null;
      await cargarColaboradores();
    };

    const onSeleccionar = (id) => {
      var colaborador = (store.colaboradores || []).find((c) => c.id === id);
      if (colaborador) {
        colaboradorSeleccionado.value = colaborador;
        modalAbierto.value = false;
      }
    };

    const obtenerAccessToken = async () => {
      // El token de acceso se genera en el servidor (JWT) y se usa como accessToken.
      var data = await userAccessApi.generateToken();
      return (data && data.token) || '';
    };

    const asignarAcceso = async () => {
      modalError.value = false;
      modalExito.value = false;
      asignando.value = true;
      modalCreando.value = true;

      try {
        if (!colaboradorSeleccionado.value) {
          return;
        }

        var accessToken = await obtenerAccessToken();

        var payload = {
          collaboratorId: colaboradorSeleccionado.value.id,
          username: (form.value.username || '').trim().toLowerCase(),
          password: form.value.password,
          accessToken: accessToken,
          active: true,
          forcePasswordChange: true,
          sendWelcomeEmail: true,
          requireMfa: false
        };

        await userAccessApi.create(payload);

        modalCreando.value = false;
        modalExito.value = true;
      } catch (error) {
        console.error('Error al asignar acceso:', error);
        modalCreando.value = false;
        modalError.value = true;
      } finally {
        asignando.value = false;
      }
    };

    const reintentarAsignacion = async () => {
      modalError.value = false;
      await asignarAcceso();
    };

    const cerrarAccesoExito = () => {
      modalExito.value = false;
    };

    return {
      store,
      modalAbierto,
      seleccion,
      errorAlCargar,
      colaboradorSeleccionado,
      form,
      showPassword,
      usarServidorCorreo,
      modalCreando,
      modalExito,
      modalError,
      asignando,
      cargarColaboradores,
      abrirModal,
      onSeleccionar,
      asignarAcceso,
      reintentarAsignacion,
      cerrarAccesoExito,
    };
  },
});
</script>

<style scoped>
.usuario-create-page {
  min-height: 100vh;
  background: #f4f7f5;
  padding: 16px;
  box-sizing: border-box;
}

/* ===== Header ===== */
.usuario-header {
  background: linear-gradient(135deg, #004d26 0%, #1f8a3c 45%, #6fcf6f 100%);
  border-radius: 14px;
  padding: 28px 32px;
  box-shadow: 0 10px 30px rgba(31, 138, 60, 0.35);
  color: #ffffff;
}

.usuario-header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.usuario-header-icon {
  flex-shrink: 0;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.usuario-header-texts {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.usuario-header-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.usuario-header-subtitle {
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  opacity: 0.92;
}

/* ===== Card Colaboradores ===== */
.colaboradores-card {
  margin-top: 20px;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.colaboradores-card__section {
  padding: 24px 28px;
}

.colaboradores-card__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.colaboradores-card__icon {
  flex-shrink: 0;
  color: #1f8a3c;
  margin-top: 4px;
}

.colaboradores-card__texts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.colaboradores-card__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a2e1f;
}

.colaboradores-card__description {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: #5b6b60;
  max-width: 640px;
}

.colaboradores-card__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 24px;
}

/* Badge colaborador asignado */
.colaborador-actual {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.colaborador-actual__label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1f8a3c;
}

.colaborador-actual__badge {
  font-size: 14px;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 20px;
}

.colaborador-actual__badge-icon {
  margin-right: 4px;
  vertical-align: middle;
}

.colaborador-actual__badge-detail {
  font-weight: 400;
  opacity: 0.9;
}

/* ===== Card Credenciales ===== */
.credenciales-card {
  margin-top: 20px;
  border-radius: 14px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.credenciales-card__section {
  padding: 24px 28px;
}

.credenciales-card__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.credenciales-card__icon {
  flex-shrink: 0;
  color: #1f8a3c;
  margin-top: 4px;
}

.credenciales-card__texts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.credenciales-card__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #1a2e1f;
}

.credenciales-card__description {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: #5b6b60;
  max-width: 640px;
}

.credenciales-card__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.credenciales-card__campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 520px;
}

.credenciales-card__label {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #374151;
}

.credenciales-card__input {
  border-radius: 8px;
}

.credenciales-card__switch {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #f4f7f5;
  border: 1px solid #e3e8e5;
  border-radius: 10px;
  padding: 14px 16px;
}

.credenciales-card__switch-texts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.credenciales-card__switch-label {
  font-size: 15px;
  font-weight: 600;
  color: #1a2e1f;
}

.credenciales-card__switch-hint {
  font-size: 13px;
  color: #5b6b60;
}

.credenciales-card__actions {
  margin-top: 8px;
}

/* ===== Modal ===== */
.colaboradores-modal {
  width: 100%;
  max-width: 720px;
  border-radius: 16px;
}

.colaboradores-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.colaboradores-modal__title-row {
  display: flex;
  gap: 12px;
}

.colaboradores-modal__title-icon {
  color: #1f8a3c;
  background: rgba(31, 138, 60, 0.12);
  border-radius: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.colaboradores-modal__title {
  font-size: 18px;
  font-weight: 700;
  color: #1a2e1f;
}

.colaboradores-modal__subtitle {
  font-size: 13px;
  color: #6b7a70;
  margin-top: 2px;
}

.colaboradores-modal__close {
  flex-shrink: 0;
}

.colaboradores-modal__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 24px;
  text-align: center;
}

.colaboradores-modal__state-text {
  margin: 0;
  color: #5b6b60;
  font-size: 15px;
}

.colaboradores-modal__error-title {
  margin: 4px 0 0;
  font-size: 18px;
  font-weight: 700;
  color: #4a3a10;
}

.colaboradores-modal__error-text {
  margin: 0;
  max-width: 460px;
  color: #6b7a70;
  font-size: 14px;
  line-height: 1.55;
}

.colaboradores-modal__list {
  max-height: 420px;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Fila: card a la izquierda + control de selección a la derecha */
.colaborador-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  border-radius: 10px;
}

.colaborador-row:hover .colaborador-card {
  background: #eef6f0;
  border-color: #9fd0ab;
}

.colaborador-row__check {
  flex-shrink: 0;
  margin-right: 4px;
}

/* Card por colaborador dentro del modal */
.colaborador-card {
  display: flex;
  align-items: center;
  width: 100%;
  background: #f8faf9;
  border: 1px solid #e3e8e5;
  border-radius: 10px;
  padding: 14px 16px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.colaborador-card__info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.colaborador-card__nombre {
  font-size: 15px;
  font-weight: 600;
  color: #1a2e1f;
}

.colaborador-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.colaborador-card__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #5b6b60;
}

.colaboradores-modal__footer {
  padding: 12px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* ===== Modales de estado (creando / éxito / error) ===== */
.estado-modal {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
}

.estado-modal__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 32px;
  text-align: center;
}

.estado-modal__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 88px;
  height: 88px;
  margin-bottom: 4px;
}

.estado-modal__icon--success {
  background: rgba(31, 138, 60, 0.12);
  color: #1f8a3c;
}

.estado-modal__icon--error {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.estado-modal__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a2e1f;
}

.estado-modal__text {
  margin: 0;
  max-width: 340px;
  color: #5b6b60;
  font-size: 14px;
  line-height: 1.6;
}

.estado-modal__footer {
  padding: 12px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* ===== Transición slide-in (API nativa de Vue 2) ===== */
.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-enter-active {
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.6s ease;
}

.slide-leave-active {
  transition: transform 0.6s cubic-bezier(0.55, 0, 0.55, 0.2),
    opacity 0.6s ease;
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
