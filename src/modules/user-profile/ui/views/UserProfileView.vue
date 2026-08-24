<template>
  <q-page class="user-profile-page q-pa-md">
    <q-dialog v-model="showLoadingModal" persistent>
      <q-card class="loading-card">
        <q-card-section class="q-pt-xl q-pb-sm text-center">
          <q-spinner color="primary" size="52px" class="q-mb-md" />
          <div class="loading-card__title">Estamos preparando tu espacio</div>
        </q-card-section>

        <q-card-section class="q-px-lg q-pb-lg text-center">
          <p class="loading-card__message">{{ loadingMessage }}</p>
          <div class="loading-card__dots q-mt-sm">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <template v-if="!loadingUser">
      <header class="profile-header q-mb-lg">
        <div class="profile-header__left">
          <h1 class="profile-header__title">Perfil de usuario</h1>
          <p class="profile-header__sub">Datos básicos de la sesión activa</p>
        </div>
        <div class="profile-header__actions">
          <button class="btn-action btn-edit" type="button" aria-label="Editar perfil" @click="abrirEditor">
            <q-icon name="edit" class="btn-action__icon" aria-hidden="true" />
            Editar perfil
          </button>
          <router-link :to="{ name: 'abastecimiento-inicio' }" class="btn-action btn-home" aria-label="Ir al inicio">
            <q-icon name="home" class="btn-action__icon" aria-hidden="true" />
            Inicio
          </router-link>
        </div>
      </header>

      <!-- Section 1: Profile data -->
      <section class="profile-card" aria-label="Datos del perfil">
        <div class="profile-card__header">
          <q-icon name="person" class="profile-card__header-icon" aria-hidden="true" />
          <span class="profile-card__title">Datos del perfil</span>
        </div>
        <div class="profile-card__body">
          <div class="profile-identity q-mb-md">
            <q-avatar size="64px" class="profile-identity__avatar">
              <q-icon name="person" size="32px" />
            </q-avatar>
            <div>
              <div class="profile-identity__name">{{ displayName }}</div>
              <div class="profile-identity__username">{{ userName || '-' }}</div>
            </div>
          </div>

          <div class="profile-grid">
            <div class="profile-field">
              <span class="field-label">Usuario</span>
              <span class="field-value">{{ userName || '-' }}</span>
            </div>

            <div class="profile-field">
              <span class="field-label">Rol</span>
              <span v-if="userRole" class="field-value field-value--badge">{{ userRole }}</span>
              <span v-else class="field-value">-</span>
            </div>

            <div class="profile-field">
              <span class="field-label">Nombre completo</span>
              <span class="field-value">{{ userFullName || displayName }}</span>
            </div>

            <div class="profile-field">
              <span class="field-label">Tenant</span>
              <span class="field-value field-value--mono">{{ tenant || '-' }}</span>
            </div>

            <div class="profile-field profile-field--full">
              <span class="field-label">Correo electr&oacute;nico</span>
              <span class="field-value">{{ userEmail || '-' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: Assigned areas -->
      <section class="profile-card" aria-label="Áreas asignadas">
        <div class="profile-card__header">
          <q-icon name="corporate_fare" class="profile-card__header-icon" aria-hidden="true" />
          <span class="profile-card__title">Áreas asignadas</span>
        </div>
        <div class="profile-card__body">
          <div v-if="cargandoAreas" class="profile-empty profile-empty--inline">
            <q-spinner size="16px" color="grey-6" />
            <span>Cargando áreas...</span>
          </div>

          <div v-else-if="areaLabels.length" class="areas-wrap">
            <span v-for="(area, index) in areaLabels" :key="index" class="area-chip">
              {{ area }}
            </span>
          </div>

          <div v-else class="profile-empty">
            <q-icon name="corporate_fare" size="32px" color="grey-4" />
            <p>Este usuario aún no tiene áreas asignadas.</p>
          </div>
        </div>
      </section>

      <!-- Section 3: Available routes -->
      <section class="profile-card" aria-label="Rutas disponibles">
        <div class="profile-card__header">
          <q-icon name="alt_route" class="profile-card__header-icon" aria-hidden="true" />
          <span class="profile-card__title">Rutas disponibles</span>
        </div>
        <div class="profile-card__body">
          <p class="section-intro">
            Rutas del sistema a las que tienes permiso de acceder.
          </p>

          <div v-if="colaboradorRutasStore.isLoading" class="profile-empty profile-empty--inline">
            <q-spinner size="16px" color="grey-6" />
            <span>Cargando rutas...</span>
          </div>

          <ul v-else-if="colaboradorRutasStore.rutas.length" class="rutas-list" aria-label="Rutas disponibles">
            <li v-for="ruta in colaboradorRutasStore.rutas" :key="ruta.id" class="ruta-item">
              <q-icon name="link" class="ruta-item__icon" aria-hidden="true" />
              <div class="ruta-item__content">
                <span class="ruta-item__name">{{ ruta.rutaNombre }}</span>
                <span class="ruta-item__path">{{ ruta.rutaPath }}</span>
              </div>
            </li>
          </ul>

          <div v-else class="profile-empty">
            <q-icon name="signpost" size="32px" color="grey-4" />
            <p>No tienes rutas asignadas.</p>
          </div>
        </div>
      </section>

      <!-- Section 4: User permissions -->
      <section class="profile-card" aria-label="Permisos del usuario">
        <div class="profile-card__header">
          <q-icon name="verified_user" class="profile-card__header-icon" aria-hidden="true" />
          <span class="profile-card__title">Permisos del usuario</span>
        </div>
        <div class="profile-card__body">
          <template v-if="tieneAlgunPermiso">
            <div v-if="permissionStatusLabel" class="permission-badge">
              <q-icon name="check" size="14px" aria-hidden="true" />
              <span>{{ permissionStatusLabel }}</span>
            </div>

            <div v-for="group in permissionGroups" :key="group.key" class="perm-group">
              <div class="perm-group__header">
                <q-icon :name="group.icon" class="perm-group__icon" aria-hidden="true" />
                <span class="perm-group__label">{{ group.label }}</span>
              </div>

              <ul class="perm-list" :aria-label="group.label">
                <li v-for="(item, index) in group.items" :key="index" class="perm-item">
                  <span class="perm-item__name">{{ item.name }}</span>
                  <span v-if="item.description" class="perm-item__desc">{{ item.description }}</span>
                </li>
              </ul>
            </div>
          </template>

          <template v-else>
            <div class="profile-empty">
              <q-icon name="lock_open" size="40px" color="grey-4" />
              <p class="profile-empty__title">Aún no tienes permisos asignados</p>
              <p class="profile-empty__desc">
                Solicita a tu administrador que te otorgue los permisos necesarios para acceder a las
                funcionalidades del sistema.
              </p>
              <q-btn unelevated no-caps color="primary" icon="admin_panel_settings" label="Ir a asignación de permisos"
                :to="{ name: 'abastecimiento-colaborador-permisos-create' }" />
            </div>
          </template>
        </div>
      </section>

      <!-- Section 4: Component permissions -->
      <section class="profile-card" aria-label="Permisos de componentes">
        <div class="profile-card__header">
          <q-icon name="visibility" class="profile-card__header-icon" aria-hidden="true" />
          <span class="profile-card__title">Permisos de componentes</span>
        </div>
        <div class="profile-card__body">
          <p class="section-intro">
            Componentes a los que tienes permiso de acceder en el m&oacute;dulo de abastecimiento.
          </p>

          <ul v-if="componentPermissions.length" class="comp-list" aria-label="Permisos de componentes">
            <li v-for="comp in componentPermissions" :key="comp.key" class="comp-item">
              <q-icon name="visibility" class="comp-item__icon" aria-hidden="true" />
              <div class="comp-item__content">
                <span class="comp-item__name">{{ comp.label }}</span>
                <span v-if="comp.component" class="comp-item__file">{{ comp.component }}</span>
              </div>
            </li>
          </ul>

          <div v-else class="profile-empty profile-empty--compact">
            <q-icon name="visibility_off" size="32px" color="grey-4" />
            <p>Aún no tienes permisos de componentes asignados.</p>
          </div>

          <div v-if="mostrarGuiaAccesoComponentes === false" class="access-notice" role="note">
            <q-icon name="info" class="access-notice__icon" aria-hidden="true" />
            <div>
              <p class="access-notice__title">
                Acceso a páginas del módulo de abastecimiento
              </p>
              <p class="access-notice__body">
                En el menú lateral, los ítems con
                <strong class="access-notice__highlight">subrayado amarillo</strong>
                corresponden a páginas a las que
                <strong>no puedes entrar</strong> con tu usuario actual.
                Para acceder, solicita a un administrador que te otorgue el permiso de visibilidad
                del componente correspondiente.
              </p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 480px; max-width: 560px">
        <q-linear-progress v-if="guardando" indeterminate color="primary" class="q-mb-none" style="height: 4px" />
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Editar perfil</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup :disabled="guardando" />
        </q-card-section>

        <q-card-section class="edit-profile-form">
          <AppInput v-model="editForm.username" label="Usuario" placeholder="Nombre de usuario" />
          <AppInput v-model="editForm.nombreCompleto" label="Nombre completo" placeholder="Nombre completo" />
          <AppInput v-model="editForm.email" label="Correo electrónico" type="email"
            placeholder="correo@ejemplo.com" />
          <AppInput v-model="editForm.tenant" label="Tenant" placeholder="Organización" />
          <div class="edit-profile-form__select">
            <span class="edit-profile-form__select-label">Rol</span>
            <q-select v-model="editForm.rol" :options="rolesOptions" option-value="value" option-label="label" dense
              outlined emit-value map-options />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated no-caps label="Guardar" color="primary" :loading="guardando" @click="guardarPerfil" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showErrorModal" persistent>
      <q-card style="min-width: 400px; max-width: 480px">
        <q-card-section class="q-pb-none">
          <div class="row items-center">
            <q-avatar icon="sentiment_neutral" color="warning" text-color="white" size="48px" class="q-mr-md" />
            <div>
              <div class="text-h6 text-weight-bold text-dark">Algo no salió bien</div>
              <div class="text-caption text-grey-7">No pudimos cargar tu información de perfil</div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-py-md">
          <p class="text-body2 text-grey-8" style="line-height: 1.6">
            No te preocupes, no perdiste ningún dato. Esto puede ocurrir por una interrupción temporal en
            la comunicación con el servidor.
          </p>
          <p class="text-body2 text-grey-8" style="line-height: 1.6">
            <strong>Te sugerimos:</strong>
          </p>
          <ul class="text-body2 text-grey-8 q-mb-none" style="line-height: 1.8; padding-left: 20px;">
            <li>Verifica que tu conexión a internet esté activa</li>
            <li>Intenta recargar la página presionando <kbd>F5</kbd></li>
            <li>Si el problema persiste, contacta al equipo de soporte técnico</li>
          </ul>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Recargar página" color="primary" icon="refresh" @click="recargarPagina" />
          <q-btn unelevated no-caps label="Entendido" color="primary" @click="showErrorModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showUpdateErrorModal" persistent>
      <q-card style="min-width: 420px; max-width: 520px">
        <q-card-section class="q-pb-none">
          <div class="row items-center">
            <q-avatar icon="cloud_off" color="negative" text-color="white" size="52px" class="q-mr-md" />
            <div>
              <div class="text-h6 text-weight-bold text-dark">No se pudo guardar</div>
              <div class="text-caption text-grey-7">El cambio no se aplic&oacute; a tu perfil</div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-py-md">
          <p class="text-body2 text-grey-8" style="line-height: 1.6">
            Tranquilo, no has perdido nada. Tus datos siguen intactos. Esto suele ser una molestia temporal del
            servidor, no un problema tuyo ni de tu cuenta.
          </p>
          <p class="text-body2 text-grey-7 q-mt-sm" style="line-height: 1.6">
            <strong>Por qu&eacute; pudo pasar:</strong>
          </p>
          <ul class="text-body2 text-grey-7 q-mb-none" style="line-height: 1.8; padding-left: 20px;">
            <li v-if="updateErrorType === 'connections'">
              <strong>Demasiadas conexiones simultáneas:</strong> El servidor está saturado porque muchas
              personas est&aacute;n usando el sistema al mismo tiempo.
            </li>
            <li v-else-if="updateErrorType === 'network'">
              <strong>Sin conexión al servidor:</strong> Revisa que tu internet esté funcionando.
            </li>
            <li v-else-if="updateErrorType === 'auth'">
              <strong>Sesión expirada:</strong> Tu acceso se venció mientras editabas.
            </li>
            <li v-else>
              <strong>Error inesperado:</strong> Algo salió mal en el servidor. Nuestro equipo ya fue notificado.
            </li>
          </ul>
        </q-card-section>

        <q-card-section v-if="updateErrorDetail" class="q-py-none text-caption text-grey-5" style="line-height: 1.4">
          <em>Detalle del error: {{ updateErrorDetail }}</em>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Intentar de nuevo" color="primary" icon="refresh" @click="reintentarGuardado"
            :loading="guardando" />
          <q-btn unelevated no-caps label="Entendido" color="primary" @click="showUpdateErrorModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { colaboradorAreasApi } from 'src/api/colaboradorAreas.api';
import { PERMISOS_OPERATIVOS, PERMISOS_VISIBILIDAD } from 'src/modules/talento-humano/ui/constants/permisosOperativos';
import { useAuthStore } from 'src/stores/authStore';
import { useColaboradorRutasStore } from 'src/stores/colaboradorRutasStore';
import { useOperativosPermisosStore } from 'src/stores/operativosPermisosStore';
import AppInput from 'src/utils/components/AppInput.vue';

var PERMISO_GROUP_LABELS = {
  aprobacion: { label: 'Aprobaciones', icon: 'fact_check' },
  eliminacion: { label: 'Eliminaciones', icon: 'delete_sweep' },
};

function getGroupInfo(groupKey) {
  return PERMISO_GROUP_LABELS[groupKey] || { label: groupKey, icon: 'lock' };
}

export default {
  name: 'UserProfileView',

  components: {
    AppInput,
  },

  data() {
    return {
      showEditDialog: false,
      showErrorModal: false,
      showUpdateErrorModal: false,
      updateErrorType: 'unknown',
      updateErrorDetail: '',
      loadingUser: true,
      showLoadingModal: true,
      loadingMessage: '',
      loadingMessages: [
        'Revisando que todo esté en orden…',
        'Asegurando tu sesión…',
        'Cargando tus permisos y accesos…',
        'Casi listo, esto es cuestión de segundos…',
        'Localizando tu perfil en el sistema…',
      ],
      guardando: false,
      colaboradorId: null,
      areasAsignadas: [],
      cargandoAreas: false,
      rolesOptions: [
        { label: 'admin', value: 1 },
        { label: 'usuario', value: 2 },
        { label: 'colaborador', value: 3 },
        { label: 'funcionario', value: 4 },
      ],
      editForm: {
        username: '',
        nombreCompleto: '',
        email: '',
        tenant: '',
        rol: '',
      },
    };
  },

  async created() {
    this.loadingMessage = this.loadingMessages[0];
    var msgIndex = 0;
    var msgInterval = setInterval(function () {
      msgIndex = (msgIndex + 1) % this.loadingMessages.length;
      this.loadingMessage = this.loadingMessages[msgIndex];
    }.bind(this), 1500);

    var minTime = new Promise(function (resolve) {
      setTimeout(resolve, 5000);
    });

    var result = await this.authStore.fetchCurrentUserDetails();

    var colaboradorPromise = result.success ? this.resolverColaborador() : Promise.resolve();

    await Promise.all([minTime, colaboradorPromise]);

    clearInterval(msgInterval);
    this.showLoadingModal = false;
    this.loadingUser = false;

    if (!result.success) {
      this.showErrorModal = true;
    } else {
      this.cargarRutasDisponibles();
    }
  },

  computed: {
    authStore() {
      return useAuthStore();
    },

    usuario() {
      return this.authStore.user;
    },

    tenant() {
      return this.authStore.tenant;
    },

    userName() {
      var u = this.usuario;
      if (!u) return '';
      if (typeof u === 'string') return u;
      return u.username || '';
    },

    userFullName() {
      var u = this.usuario;
      if (!u) return '';
      var t = u.tercero;
      if (t) {
        return [t.primerNombre, t.segundoNombre]
          .filter(function (p) { return p && p.trim(); })
          .join(' ');
      }
      return u.nombreCompleto || u.nombre || '';
    },

    userEmail() {
      var u = this.usuario;
      if (!u) return '';
      if (u.tercero && u.tercero.email) return u.tercero.email;
      return u.email || '';
    },

    userRole() {
      var u = this.usuario;
      if (!u) return '';
      if (u.rol) {
        if (typeof u.rol === 'object') {
          var roleMap = { 1: 'admin', 2: 'usuario', 3: 'colaborador', 4: 'funcionario' };
          return roleMap[u.rol.id] || u.rol.nombre || '';
        }
        return u.rol;
      }
      if (u.roles && Array.isArray(u.roles) && u.roles.length > 0) {
        var r = u.roles[0];
        if (typeof r === 'object') {
          var roleMapRoles = { 1: 'admin', 2: 'usuario', 3: 'colaborador', 4: 'funcionario' };
          return roleMapRoles[r.id] || r.nombre || r.name || '';
        }
        return r;
      }
      return u.role || '';
    },

    displayName() {
      return this.userFullName || this.userName || 'Invitado';
    },

    permisosStore() {
      return useOperativosPermisosStore();
    },

    colaboradorRutasStore() {
      return useColaboradorRutasStore();
    },

    areaLabels() {
      return this.areasAsignadas.map(function (area) {
        return area.departamentoNombre || 'Área #' + area.departamentoId;
      });
    },

    permisosActivosList() {
      var store = this.permisosStore;
      return PERMISOS_OPERATIVOS.filter(function (p) {
        return !!store.permisos[p.key];
      });
    },

    visibilidadActivosList() {
      var store = this.permisosStore;
      return PERMISOS_VISIBILIDAD.filter(function (p) {
        return !!store.visibilidad[p.key];
      });
    },

    visibilidadInactivosList() {
      var store = this.permisosStore;
      if (!store.tieneVisibilidadActiva) {
        return [];
      }
      return PERMISOS_VISIBILIDAD.filter(function (p) {
        return !store.visibilidad[p.key];
      });
    },

    mostrarGuiaAccesoComponentes() {

      const tieneVisibilidadActivos = this.visibilidadActivosList.length <= 0 ? false : true;
      const tieneVisibilidadInactivos = this.visibilidadInactivosList.length >= 1 ? false : true;

      console.log(`tieneVisibilidadActivos: ${tieneVisibilidadActivos}`);
      console.log(`tieneVisibilidadInactivos: ${tieneVisibilidadInactivos}`);
      return tieneVisibilidadActivos && tieneVisibilidadInactivos;
    },

    isSystemApprover() {
      return this.permisosStore.isSystemApprover;
    },

    permissionStatusLabel() {
      if (this.isSystemApprover) {
        return 'Aprobador registrado en el sistema';
      }
      if (this.permisosActivosList.length > 0) {
        return 'Permisos operativos activos';
      }
      return '';
    },

    tieneAlgunPermiso() {
      return (
        this.permisosActivosList.length > 0 ||
        this.visibilidadActivosList.length > 0 ||
        this.isSystemApprover
      );
    },

    permisosAgrupados() {
      var grupos = {};
      var list = this.permisosActivosList;
      var i;
      for (i = 0; i < list.length; i++) {
        var p = list[i];
        var g = p.group || 'otros';
        if (!grupos[g]) {
          grupos[g] = [];
        }
        grupos[g].push(p);
      }
      return grupos;
    },

    permissionGroups() {
      var self = this;
      return Object.keys(this.permisosAgrupados)
        .filter(function (key) {
          return key !== 'visibilidad';
        })
        .map(function (key) {
          var info = getGroupInfo(key);
          return {
            key: key,
            label: info.label,
            icon: info.icon,
            items: self.permisosAgrupados[key].map(function (p) {
              return {
                name: p.label,
                description: p.description || '',
              };
            }),
          };
        });
    },

    componentPermissions() {
      return this.visibilidadActivosList.map(function (p) {
        return {
          key: p.key,
          label: p.label,
          component: p.componente || '',
        };
      });
    },
  },

  methods: {
    async cargarAreasAsignadas() {
      if (this.areasAsignadas.length) return;
      var usuarioId = this.authStore.userId || this.userName;
      if (!usuarioId) return;
      this.cargandoAreas = true;
      try {
        var asignaciones = await colaboradorAreasApi.getAsignaciones(null, usuarioId);
        if (Array.isArray(asignaciones)) {
          var asig = asignaciones.find(function (a) {
            return a.colaboradorId === usuarioId || a.usuarioId === usuarioId;
          });
          if (!asig && asignaciones.length) asig = asignaciones[0];
          this.areasAsignadas = asig && asig.areas ? asig.areas : [];
        } else {
          this.areasAsignadas = [];
        }
      } catch (err) {
        console.error('[UserProfileView] Error al cargar áreas asignadas:', err);
        this.areasAsignadas = [];
      } finally {
        this.cargandoAreas = false;
      }
    },

    async resolverColaborador() {
      try {
        var asignaciones = await colaboradorAreasApi.getAsignaciones(null, this.authStore.userId || this.userName);
        if (Array.isArray(asignaciones)) {
          var fullName = this.userFullName;
          if (fullName) {
            var match = asignaciones.find(function (a) {
              return a.colaboradorNombre && a.colaboradorNombre.toLowerCase() === fullName.toLowerCase();
            });
            if (match) {
              this.colaboradorId = match.colaboradorId;
              this.areasAsignadas = match.areas || [];
            }
          }
        }
      } catch (e) {
        console.warn('[UserProfileView] Error al buscar colaborador por nombre:', e);
      }
    },

    cargarRutasDisponibles() {
      var id = this.colaboradorId || this.authStore.userId || this.userName;
      if (id) {
        this.colaboradorRutasStore.fetchRutas(id);
      }
    },

    abrirEditor() {
      var u = this.usuario || {};
      var t = u.tercero || {};
      var currentRole = null;
      if (u.rol) {
        currentRole = typeof u.rol === 'object' ? u.rol.id : u.rol;
      } else if (u.roles && u.roles.length > 0) {
        currentRole = typeof u.roles[0] === 'object' ? u.roles[0].id : u.roles[0];
      }
      var username = u.username || '';
      this.editForm = {
        username: username,
        nombreCompleto: u.nombreCompleto || u.nombre || '',
        email: t.email || u.email || '',
        tenant: this.tenant || '',
        rol: currentRole || '',
      };
      this.authStore.searchUserProfile(username).then(function (data) {
        if (!data) return;
        if (data.workers && data.workers.length > 0) {
          var w = data.workers[0];
          if (w.fullName) this.editForm.nombreCompleto = w.fullName;
          if (w.email) this.editForm.email = w.email;
        }
        if (data.username) this.editForm.username = data.username;
      }.bind(this));
      this.showEditDialog = true;
    },

    recargarPagina() {
      window.location.reload();
    },

    async guardarPerfil() {
      this.guardando = true;
      try {
        var payload = {
          username: this.editForm.username,
          nombreCompleto: this.editForm.nombreCompleto,
          email: this.editForm.email,
          tenant: this.editForm.tenant,
          rol: this.editForm.rol,
        };
        await this.authStore.updateProfile(payload);
        this.showEditDialog = false;
        this.$q.notify({
          type: 'positive',
          message: 'Perfil actualizado correctamente',
          position: 'bottom-right',
        });
      } catch (error) {
        var errMsg = typeof error === 'string' ? error : (error.message || 'Error al actualizar el perfil');
        var errCode = error.status || (error.response && error.response.status) || '';
        this.clasificarError(errMsg, errCode);
        this.showUpdateErrorModal = true;
      } finally {
        this.guardando = false;
      }
    },

    clasificarError(msg, code) {
      this.updateErrorDetail = msg;
      var lower = (msg || '').toLowerCase();
      if (lower.indexOf('too many connections') !== -1 || lower.indexOf('1040') !== -1) {
        this.updateErrorType = 'connections';
      } else if (code === 401 || lower.indexOf('no autenticado') !== -1 || lower.indexOf('sesi') !== -1) {
        this.updateErrorType = 'auth';
      } else if (
        lower.indexOf('network') !== -1 ||
        lower.indexOf('conexi') !== -1 ||
        lower.indexOf('econnrefused') !== -1 ||
        lower.indexOf('timeout') !== -1
      ) {
        this.updateErrorType = 'network';
      } else {
        this.updateErrorType = 'unknown';
      }
    },

    reintentarGuardado() {
      this.showUpdateErrorModal = false;
      this.$nextTick(function () {
        this.guardarPerfil();
      }.bind(this));
    },
  },
};
</script>

<style scoped>
.user-profile-page {
  max-width: 720px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 24px;
  border-bottom: 0.5px solid #e5e7eb;
  background: #ffffff;
  border-radius: 12px;
}

.profile-header__title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 3px;
  line-height: 1.3;
}

.profile-header__sub {
  font-size: 12px;
  color: #d97706;
  margin: 0;
  font-weight: 400;
  line-height: 1.4;
}

.profile-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  font-family: inherit;
  line-height: 1.2;
  transition: box-shadow 0.18s ease, filter 0.18s ease;
}

.btn-action:hover {
  filter: brightness(1.06);
}

.btn-action:active {
  filter: brightness(0.96);
  transform: translateY(0.5px);
}

.btn-action:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}

.btn-action::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.14) 0%,
      rgba(255, 255, 255, 0) 60%);
  border-radius: inherit;
  pointer-events: none;
}

.btn-edit {
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #60a5fa 100%);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.btn-edit:hover {
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.42);
}

.btn-home {
  background: linear-gradient(135deg, #15803d 0%, #16a34a 45%, #4ade80 100%);
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
}

.btn-home:hover {
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.42);
}

.btn-action__icon {
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}

.profile-card {
  border: 0.5px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  margin-bottom: 12px;
}

.profile-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f9fafb;
  border-bottom: 0.5px solid #e5e7eb;
}

.profile-card__header-icon {
  font-size: 14px;
  color: #6b7280;
}

.profile-card__title {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.profile-card__body {
  padding: 16px;
}

.profile-identity {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-identity__avatar {
  background: #4e9c4c;
  color: #ffffff;
}

.profile-identity__name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.profile-identity__username {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 20px;
}

.profile-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-field--full {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 10px;
  font-weight: 400;
  color: #9ca3af;
  line-height: 1.4;
}

.field-value {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
}

.field-value--mono {
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
}

.field-value--badge {
  display: inline-block;
  background: #eff6ff;
  border: 0.5px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 20px;
  width: fit-content;
}

.areas-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.area-chip {
  display: inline-flex;
  align-items: center;
  background: #eff6ff;
  border: 0.5px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
}

.section-intro {
  font-size: 11px;
  color: #6b7280;
  margin: 0 0 12px;
  line-height: 1.5;
}

.permission-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #dcfce7;
  border: 0.5px solid #86efac;
  color: #15803d;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
}

.perm-group {
  margin-bottom: 20px;
}

.perm-group:last-child {
  margin-bottom: 0;
}

.perm-group__header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
}

.perm-group__icon {
  font-size: 14px;
  color: #16a34a;
}

.perm-group__label {
  font-size: 11px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.perm-list {
  list-style: none;
  margin: 0;
  padding: 0 0 0 16px;
  position: relative;
}

.perm-list::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, #16a34a 0%, #4ade80 50%, #86efac 100%);
  border-radius: 2px;
}

.perm-item {
  position: relative;
  padding: 7px 0 7px 12px;
  border-bottom: 0.5px solid #f3f4f6;
}

.perm-item:last-child {
  border-bottom: none;
}

.perm-item::before {
  content: '';
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 1.5px;
  background: linear-gradient(90deg, #16a34a, #4ade80);
}

.perm-item__name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
}

.perm-item__desc {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 1px;
  line-height: 1.4;
}

.comp-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.comp-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 0.5px solid #f3f4f6;
}

.comp-item:last-child {
  border-bottom: none;
}

.comp-item__icon {
  font-size: 14px;
  color: #9ca3af;
  margin-top: 1px;
  flex-shrink: 0;
}

.comp-item__name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
}

.comp-item__file {
  display: block;
  font-size: 10px;
  color: #9ca3af;
  font-family: 'Courier New', Courier, monospace;
  margin-top: 1px;
  line-height: 1.4;
}

.rutas-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ruta-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 0.5px solid #f3f4f6;
}

.ruta-item:last-child {
  border-bottom: none;
}

.ruta-item__icon {
  font-size: 14px;
  color: #9ca3af;
  margin-top: 1px;
  flex-shrink: 0;
}

.ruta-item__name {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
}

.ruta-item__path {
  display: block;
  font-size: 10px;
  color: #9ca3af;
  font-family: 'Courier New', Courier, monospace;
  margin-top: 1px;
  line-height: 1.4;
}

.access-notice {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: #fffbeb;
  border: 0.5px solid #fde68a;
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 16px;
}

.access-notice__icon {
  font-size: 16px;
  color: #d97706;
  flex-shrink: 0;
  margin-top: 1px;
}

.access-notice__title {
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
  margin: 0 0 4px;
}

.access-notice__body {
  font-size: 12px;
  color: #78350f;
  line-height: 1.6;
  margin: 0;
}

.access-notice__highlight {
  text-decoration: underline;
  text-decoration-color: #ffc107;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  font-weight: 600;
}

.profile-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  padding: 20px 12px;
  color: #9ca3af;
}

.profile-empty--inline {
  flex-direction: row;
  justify-content: flex-start;
  padding: 4px 0;
  font-size: 12px;
}

.profile-empty--compact {
  padding: 16px 12px;
}

.profile-empty p {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}

.profile-empty__title {
  font-size: 14px !important;
  font-weight: 500;
  color: #6b7280 !important;
}

.profile-empty__desc {
  max-width: 360px;
  margin-bottom: 8px !important;
}

@media (max-width: 520px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .profile-field--full {
    grid-column: auto;
  }
}

.edit-profile-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.edit-profile-form__select {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.edit-profile-form__select-label {
  font-size: 10px;
  font-weight: 500;
  color: #6b7280;
  padding-left: 2px;
}

.loading-card {
  min-width: 360px;
  max-width: 420px;
  border-radius: 16px;
}

.loading-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.loading-card__message {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  min-height: 20px;
  transition: opacity 0.3s;
}

.loading-card__dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.loading-card__dots .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1d5db;
  animation: dotPulse 1.4s ease-in-out infinite both;
}

.loading-card__dots .dot:nth-child(1) { animation-delay: 0s; }
.loading-card__dots .dot:nth-child(2) { animation-delay: 0.2s; }
.loading-card__dots .dot:nth-child(3) { animation-delay: 0.4s; }
.loading-card__dots .dot:nth-child(4) { animation-delay: 0.6s; }

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.6); background: #d1d5db; }
  40% { transform: scale(1); background: #3b82f6; }
}
</style>
