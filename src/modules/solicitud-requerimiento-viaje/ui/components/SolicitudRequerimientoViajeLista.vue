<template>
  <q-card flat bordered class="lista-srv">
    <q-card-section class="row items-center q-col-gutter-sm lista-srv__cabecera-z">
      <div class="col">
        <div class="lista-srv__seccion-tag text-overline text-grey-6 q-mb-xs">Bandeja principal</div>
        <div class="text-subtitle1 text-weight-bold text-dark">
          Lista de solicitudes de requerimiento
        </div>
        <div class="text-caption text-grey-8 q-mt-xs lista-srv__contexto">
          Use la columna de códigos como ancla; cambie el estado con el selector. Las solicitudes nuevas comienzan en <strong>Revisión</strong>.
        </div>
      </div>
      <div class="col-auto">
        <q-btn
          outline
          no-caps
          color="primary"
          icon="refresh"
          label="Actualizar"
          :loading="store.isLoading"
          @click="reload"
        />
      </div>
    </q-card-section>
    <q-separator class="lista-srv__linea" />

    <q-banner
      v-if="privilegioAprobadorResuelto && !usuarioEsAprobadorSistema"
      class="lista-srv-aviso-aprobador q-mx-md q-mt-sm q-mb-none"
      dense
      rounded
    >
      <template v-slot:avatar>
        <q-icon name="verified_user" color="grey-7" size="sm" />
      </template>
      El estado solo puede modificarse desde esta tabla si su usuario coincide con un colaborador registrado como <strong>aprobador</strong> en Talento humano.
    </q-banner>

    <q-banner v-if="store.error" class="bg-red-1 text-red-9 q-ma-md" dense rounded inline-actions>
      {{ store.error }}
      <template v-slot:action>
        <q-btn flat dense label="Cerrar" color="grey-9" no-caps @click="clearErrorBanner" />
      </template>
    </q-banner>

    <q-separator v-if="store.error" spaced class="lista-srv__linea" />

    <q-card-section class="q-pa-none">
      <q-table
        flat
        :data="lista"
        :columns="columns"
        row-key="id"
        :loading="store.isLoading"
        loading-label="Cargando solicitudes..."
        no-data-label="Sin registros disponibles"
        class="sticky-header-table"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <div class="lista-srv-estado-wrap">
              <q-select
                dense
                outlined
                emit-value
                map-options
                :options="estadoOpciones"
                :value="props.row.estado"
                style="min-width: 160px"
                :disable="!puedeCambiarEstadoEnTabla"
                @input="function (v) { onCambioEstado(props.row, v) }"
              />
              <q-tooltip v-if="!puedeCambiarEstadoEnTabla">
                {{ textoTooltipEstadoDeshabilitado }}
              </q-tooltip>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ formatoFechaHora(props.row.createdAt) }}
          </q-td>
        </template>
        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="visibility"
              color="primary"
              @click="abrirDetalle(props.row)"
            >
              <q-tooltip>Ver detalle</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog
      v-model="modalDetalle"
      @hide="onCerrarDetalleModal"
      :maximized="$q.screen.lt.sm"
    >
      <q-card class="srv-req-modal column no-wrap relative-position">
        <q-linear-progress
          v-if="detalleCarga"
          indeterminate
          color="primary"
          class="srv-req-modal__progress z-top"
        />

        <!-- Z — paso 1: ancla izquierda (código) + derecha (estado + cierre) -->
        <q-card-section class="srv-req-modal__header">
          <div class="row items-start no-wrap q-col-gutter-sm">
            <div class="col min-w-0">
              <div class="srv-req-eyebrow">Resumen del trámite</div>
              <div v-if="detalleSolicitud" class="srv-req-modal__codigo text-wrap">
                Solicitud {{ detalleSolicitud.codigo || '—' }}
              </div>
              <div v-else class="srv-req-modal__codigo srv-req-modal__codigo--ghost">
                —
              </div>
            </div>
            <div class="col-auto shrink-0 row items-center no-wrap q-gutter-xs">
              <q-chip
                v-if="detalleSolicitud && detalleSolicitud.estado"
                dense
                outline
                :color="colorEstadoSolRequiViaje(detalleSolicitud.estado)"
                class="srv-req-modal__estado-chip text-weight-medium"
              >
                {{ labelEstadoSolRequiViaje(detalleSolicitud.estado) }}
              </q-chip>
              <q-btn
                flat
                round
                dense
                icon="close"
                aria-label="Cerrar"
                class="srv-req-modal__close-btn"
                v-close-popup
              />
            </div>
          </div>
        </q-card-section>

        <!-- Cuerpo: un solo scroll; el pie queda fuera para no “aprisionar” la lectura -->
        <div class="srv-req-modal__scroll col">
          <div v-if="detalleCarga && !detalleSolicitud" class="srv-req-modal__hint q-pa-md">
            Cargando…
          </div>
          <div v-else-if="detalleError" class="srv-req-modal__hint srv-req-modal__hint--error q-pa-md">
            {{ detalleError }}
          </div>

          <template v-else-if="detalleSolicitud">
            <!-- Z · paso 2: chunking inicial (dato operativo urgente antes del detalle) -->
            <div class="srv-req-quick">
              <div class="srv-req-quick__title">Información más consultada</div>
              <div class="srv-req-quick__grid summary-grid">
                <div class="srv-req-quick__cell">
                  <q-icon name="place" size="22px" class="srv-req-quick__ic text-grey-6" />
                  <div class="srv-req-quick__text">
                    <div class="srv-req-label">Ubicación prioritaria</div>
                    <div class="srv-req-strong">{{ detalleResumenLugarPrioritario }}</div>
                  </div>
                </div>
                <div class="srv-req-quick__cell">
                  <q-icon name="schedule" size="22px" class="srv-req-quick__ic text-grey-6" />
                  <div class="srv-req-quick__text">
                    <div class="srv-req-label">Ventana horaria sugerida</div>
                    <div class="srv-req-strong">{{ detalleResumenVentanaHoraria }}</div>
                  </div>
                </div>
                <div class="srv-req-quick__cell">
                  <q-icon name="date_range" size="22px" class="srv-req-quick__ic text-grey-6" />
                  <div class="srv-req-quick__text">
                    <div class="srv-req-label">Calendario y modo</div>
                    <div class="srv-req-strong">{{ detalleResumenFechasYTransporte }}</div>
                  </div>
                </div>
                <div class="srv-req-quick__cell">
                  <q-icon name="hotel" size="22px" class="srv-req-quick__ic text-grey-6" />
                  <div class="srv-req-quick__text">
                    <div class="srv-req-label">Pernoctación</div>
                    <div class="srv-req-strong">{{ detalleResumenPernocta }}</div>
                  </div>
                </div>
              </div>
            </div>

            <q-separator class="srv-req-modal__hr" />

            <!-- Metadatos ligeros (secundarios al resumen) -->
            <div class="srv-req-meta info-grid srv-req-pad-x">
              <div>
                <div class="srv-req-label">Fecha de la solicitud</div>
                <div class="srv-req-muted-strong">{{ fmtValor(detalleSolicitud.fechaSolicitud) }}</div>
              </div>
              <div>
                <div class="srv-req-label">Registro en sistema</div>
                <div class="srv-req-muted-strong">{{ formatoFechaHora(detalleSolicitud.createdAt) }}</div>
              </div>
            </div>

            <q-separator class="srv-req-modal__hr" />

            <!-- Solicitante -->
            <div class="srv-req-block srv-req-pad-x">
              <div class="srv-req-section-kicker">Solicitante</div>
              <div class="srv-req-stack-tight-xs">
                <div class="srv-req-label">Nombre completo</div>
                <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.nombreEmpleado) }}</div>
              </div>
              <div class="info-grid q-mt-md">
                <div>
                  <div class="srv-req-label">Cédula</div>
                  <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.cedula) }}</div>
                </div>
                <div>
                  <div class="srv-req-label">Celular</div>
                  <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.celular) }}</div>
                </div>
              </div>
              <div class="srv-req-stack-tight-xs q-mt-md">
                <div class="srv-req-label">Correo electrónico</div>
                <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.correoElectronico) }}</div>
              </div>
            </div>

            <q-separator class="srv-req-modal__hr" />

            <!-- Motivo (una sola columna cómoda) -->
            <div class="srv-req-block srv-req-pad-x">
              <div class="srv-req-section-kicker">Propósito</div>
              <div class="srv-req-label">Motivo del viaje</div>
              <div class="srv-req-info-text srv-req-prose">{{ fmtValor(detalleSolicitud.motivoViaje) }}</div>
            </div>

            <q-separator class="srv-req-modal__hr" />

            <!-- Ida -->
            <div class="srv-req-block srv-req-pad-x">
              <div class="srv-req-section-kicker">Recogida e ida</div>
              <div class="info-grid">
                <div>
                  <div class="srv-req-label">Lugar</div>
                  <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.lugarRecogida) }}</div>
                </div>
                <div>
                  <div class="srv-req-label">Hora sugerida</div>
                  <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.horarioSugeridoIda) }}</div>
                </div>
              </div>
              <div class="srv-req-stack-tight-xs">
                <div class="srv-req-label">Ruta de ida</div>
                <div class="srv-req-info-text srv-req-prose">{{ fmtValor(detalleSolicitud.rutaIda) }}</div>
              </div>
            </div>

            <q-separator class="srv-req-modal__hr" />

            <!-- Regreso — dos columnas para rutas paralelas -->
            <div class="srv-req-block srv-req-pad-x">
              <div class="srv-req-section-kicker">Trayecto · regreso</div>
              <div class="info-grid srv-req-route-pair">
                <div class="srv-req-route-cell">
                  <div class="srv-req-label">Ruta de regreso</div>
                  <div class="srv-req-info-text srv-req-prose">{{ fmtValor(detalleSolicitud.rutaRegreso) }}</div>
                </div>
                <div class="srv-req-route-cell">
                  <div class="srv-req-label">Ruta de vuelta</div>
                  <div class="srv-req-info-text srv-req-prose">{{ fmtValor(detalleSolicitud.rutaVuelta) }}</div>
                </div>
              </div>
              <div class="info-grid srv-req-gap-tight q-mt-md">
                <div>
                  <div class="srv-req-label">Recogida (regreso)</div>
                  <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.lugarRecogidaRegreso) }}</div>
                </div>
                <div>
                  <div class="srv-req-label">Hora sugerida</div>
                  <div class="srv-req-info-text">{{ fmtValor(detalleSolicitud.horarioSugeridoRegreso) }}</div>
                </div>
              </div>
            </div>

            <q-separator class="srv-req-modal__hr" />

            <!-- Proyecto -->
            <div class="srv-req-block srv-req-pad-x srv-req-pad-b-extra">
              <div class="srv-req-section-kicker">Administrativo</div>
              <div class="srv-req-label">Proyecto o centro de costo</div>
              <div class="srv-req-info-text srv-req-prose">{{ fmtValor(detalleSolicitud.proyectoCentroCosto) }}</div>
            </div>

            <!-- Observaciones destacadas -->
            <div v-if="detalleObservacionesTexto" class="srv-req-pad-x srv-req-pad-b-extra">
              <div class="observation-box">
                <div class="observation-box__head row items-center no-wrap">
                  <q-icon name="chat_bubble_outline" size="20px" class="observation-box__ico text-grey-7 q-mr-sm" />
                  <span class="observation-box__title">Observaciones</span>
                </div>
                <div class="observation-box__body srv-req-info-text srv-req-prose">
                  {{ detalleObservacionesTexto }}
                </div>
              </div>
            </div>
            <div v-else class="srv-req-pad-x srv-req-pad-b-extra">
              <div class="srv-req-sin-notas text-caption text-grey-6">
                Sin observaciones adicionales registradas.
              </div>
            </div>
          </template>
        </div>

        <q-card-actions align="stretch" class="srv-req-modal__footer column">
          <div class="row items-center justify-between no-wrap srv-req-footer__row">
            <div class="col srv-req-footer__hint text-caption text-grey-7">
              <template v-if="puedeBotonAprobar">
                Puede enviar esta solicitud a <strong>Aprobación</strong>.
              </template>
              <template v-else-if="detalleSolicitud && detalleSolicitud.estado === 'REVISION' && privilegioAprobadorResuelto && !usuarioEsAprobadorSistema">
                Solo un usuario configurado como aprobador puede aprobar aquí.
              </template>
              <template v-else-if="detalleSolicitud && detalleSolicitud.estado !== 'REVISION'">
                No disponible para aprobación rápida en este estado.
              </template>
            </div>
            <div class="col-auto row q-gutter-sm justify-end">
              <q-btn flat no-caps color="grey-8" label="Cerrar" v-close-popup />
              <q-btn
                v-if="puedeBotonAprobar"
                unelevated
                no-caps
                color="positive"
                icon="check_circle"
                label="Aprobar solicitud"
                :loading="aprobacionEnCurso"
                @click="onAprobarDesdeModal"
              />
            </div>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { useSolicitudRequerimientoViajeStore } from '../store/useSolicitudRequerimientoViajeStore';
import { ESTADOS_SOL_REQU_VIAJE_OPTIONS, labelEstadoSolRequiViaje, colorEstadoSolRequiViaje } from '../../constants/estadosSolicitudRequerimientoViaje';
import { getRequerimientoViajeById } from '../../api/solicitudRequerimientoViaje.api';
import { listAprobadores } from 'src/api/aprobadores.api';
import { colaboradoresApi } from 'src/api/colaboradores.api';

export default {
  name: 'SolicitudRequerimientoViajeLista',

  data () {
    return {
      estadoOpciones: ESTADOS_SOL_REQU_VIAJE_OPTIONS,
      modalDetalle: false,
      detalleCarga: false,
      detalleSolicitud: null,
      detalleError: '',
      usuarioEsAprobadorSistema: false,
      privilegioAprobadorResuelto: false,
      sesionCollaboratorId: '',
      aprobacionEnCurso: false,
      columns: [
        { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
        { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
        { name: 'fechaSolicitud', label: 'Fecha solicitud', field: 'fechaSolicitud', align: 'left', sortable: true },
        { name: 'nombreEmpleado', label: 'Solicitante', field: 'nombreEmpleado', align: 'left' },
        { name: 'cedula', label: 'Cédula', field: 'cedula', align: 'left' },
        { name: 'tipoTransporte', label: 'Transporte', field: 'tipoTransporte', align: 'left' },
        { name: 'createdAt', label: 'Registro', field: 'createdAt', align: 'left' },
        { name: 'acciones', label: 'Acciones', field: 'id', align: 'center', sortable: false, style: 'width: 72px' }
      ]
    };
  },

  computed: {
    ...mapGetters('auth', {
      usuarioSesion: 'getUser'
    }),
    store () {
      return useSolicitudRequerimientoViajeStore();
    },
    lista () {
      var l = this.store.lista;
      return Array.isArray(l) ? l : [];
    },
    puedeBotonAprobar () {
      return !!(
        this.detalleSolicitud &&
        this.detalleSolicitud.estado === 'REVISION' &&
        this.privilegioAprobadorResuelto &&
        this.usuarioEsAprobadorSistema
      );
    },

    /** Resumen rápido (prioridad lectura Z) — depende del detalle cargado */
    detalleResumenLugarPrioritario () {
      var d = this.detalleSolicitud;
      if (!d) return '—';
      var reg = this.fmtValor(d.lugarRecogidaRegreso);
      var ida = this.fmtValor(d.lugarRecogida);
      if (reg !== '—') return reg;
      if (ida !== '—') return ida;
      return '—';
    },

    detalleResumenVentanaHoraria () {
      var d = this.detalleSolicitud;
      if (!d) return '—';
      var a = this.fmtValor(d.horarioSugeridoIda);
      var b = this.fmtValor(d.horarioSugeridoRegreso);
      if (a === '—' && b === '—') return '—';
      if (a === '—') return b;
      if (b === '—') return a;
      return a + ' → ' + b;
    },

    detalleResumenFechasYTransporte () {
      var d = this.detalleSolicitud;
      if (!d) return '—';
      var i = this.fmtValor(d.fechaViajeIda);
      var r = this.fmtValor(d.fechaRegreso);
      var tipo = this.tipoTransporteLegible(d.tipoTransporte);
      var fechas = (i !== '—' && r !== '—') ? i + ' · ' + r : (i !== '—' ? i : r);
      if (fechas === '—' && tipo === '—') return '—';
      if (tipo === '—') return fechas;
      if (fechas === '—') return tipo;
      return fechas + ' · ' + tipo;
    },

    detalleResumenPernocta () {
      var d = this.detalleSolicitud;
      if (!d) return '—';
      return d.pernoctan ? 'Sí pernocta' : 'Sin pernoctación';
    },

    detalleObservacionesTexto () {
      var d = this.detalleSolicitud;
      if (!d || d.observaciones === null || d.observaciones === undefined) return '';
      var s = String(d.observaciones).trim();
      return s;
    },

    /** Misma regla que en el modal: solo aprobadores registrados modifican estado en tabla */
    puedeCambiarEstadoEnTabla () {
      return this.privilegioAprobadorResuelto === true &&
        this.usuarioEsAprobadorSistema === true;
    },

    textoTooltipEstadoDeshabilitado () {
      if (!this.privilegioAprobadorResuelto) {
        return 'Verificando permisos…';
      }
      return 'Solo pueden cambiar el estado los usuarios dados de alta como aprobadores (Talento humano → Configurar aprobadores). Su sesión debe coincidir con el colaborador vinculado a ese registro.';
    }
  },

  mounted () {
    var self = this;
    self.$nextTick(function () {
      self.reload().catch(function (e) {
        console.error('[SolicitudRequerimientoViajeLista] Error al cargar:', e);
      });
    });
  },

  methods: {
    labelEstadoSolRequiViaje,
    colorEstadoSolRequiViaje,

    clearErrorBanner () {
      this.store.error = null;
    },

    async reload () {
      try {
        await this.store.fetchLista();
        await this.evaluarUsuarioAprobador();
      } catch (e) {
        /* notify optional */
      }
    },

    formatoFechaHora (val) {
      if (!val) return '—';
      if (typeof val === 'string') {
        return val.replace('T', ' ').substring(0, 19);
      }
      return String(val);
    },

    async onCambioEstado (row, nuevoEstado) {
      var prev = row.estado;
      if (nuevoEstado == null || nuevoEstado === '' || nuevoEstado === prev) return;

      if (!this.puedeCambiarEstadoEnTabla) {
        this.$q.notify({
          type: 'warning',
          message: 'No puede cambiar el estado: su usuario no está registrado como aprobador en el sistema.',
          position: 'top-right',
          timeout: 4500
        });
        return;
      }

      try {
        await this.store.actualizarEstado(row.id, nuevoEstado);
        this.$q.notify({
          type: 'positive',
          message: 'Estado actualizado',
          position: 'top-right',
          timeout: 2000
        });
      } catch (e) {
        await this.reload();
        var msg = (e && e.message) ? e.message : 'No se pudo actualizar el estado';
        this.$q.notify({
          type: 'negative',
          message: msg,
          position: 'top-right',
          timeout: 4000
        });
      }
    },

    nombreUsuarioSesion () {
      var u = this.usuarioSesion;
      if (typeof u === 'string' && u.trim()) return u.trim();
      if (u && typeof u === 'object' && u.username) return String(u.username).trim();
      return '';
    },

    colaboradorIdDesdeSesion (colaboradores, usernameNorm) {
      if (!usernameNorm || !colaboradores || !colaboradores.length) return '';
      var u = usernameNorm.toLowerCase();
      var i;
      for (i = 0; i < colaboradores.length; i++) {
        var c = colaboradores[i];
        var idCol = String(c.id != null ? c.id : '').trim();
        var doc = String(c.numeroDocumento != null ? c.numeroDocumento : '').trim();
        var email = String(c.correoElectronico != null ? c.correoElectronico : '').trim().toLowerCase();
        if (doc && doc.toLowerCase() === u) return idCol;
        if (idCol && idCol.toLowerCase() === u) return idCol;
        if (email && email === u) return idCol;
        var atIx = email.indexOf('@');
        if (atIx > 0 && email.substring(0, atIx) === u) return idCol;
      }
      return '';
    },

    algunAprobadorContieneCollaboratorId (listaAprobadores, collaboratorId) {
      if (!collaboratorId || !listaAprobadores || !listaAprobadores.length) return false;
      var cid = String(collaboratorId);
      var k;
      for (k = 0; k < listaAprobadores.length; k++) {
        if (String(listaAprobadores[k].collaboratorId) === cid) return true;
      }
      return false;
    },

    async evaluarUsuarioAprobador () {
      var username = this.nombreUsuarioSesion();
      this.privilegioAprobadorResuelto = false;
      this.usuarioEsAprobadorSistema = false;
      this.sesionCollaboratorId = '';
      if (!username) {
        this.privilegioAprobadorResuelto = true;
        return;
      }
      try {
        var cols = [];
        try {
          cols = await colaboradoresApi.getAll();
          if (!Array.isArray(cols)) cols = [];
        } catch (ignore) {
          cols = [];
        }
        var aprobadores = [];
        try {
          var la = await listAprobadores();
          aprobadores = Array.isArray(la) ? la : [];
        } catch (ignore) {
          aprobadores = [];
        }
        var collaboratorId = this.colaboradorIdDesdeSesion(cols, username);
        this.sesionCollaboratorId = collaboratorId;
        if (!collaboratorId) {
          this.usuarioEsAprobadorSistema = false;
        } else {
          this.usuarioEsAprobadorSistema = this.algunAprobadorContieneCollaboratorId(
            aprobadores,
            collaboratorId
          );
        }
      } catch (ignore) {
        this.usuarioEsAprobadorSistema = false;
      } finally {
        this.privilegioAprobadorResuelto = true;
      }
    },

    fmtValor (v) {
      if (v === null || v === undefined) return '—';
      var s = String(v).trim();
      return s.length ? s : '—';
    },

    tipoTransporteLegible (raw) {
      var v = raw != null ? String(raw).trim().toUpperCase() : '';
      if (v === 'TERRESTRE') return 'Terrestre';
      if (v === 'AEREO' || v === 'AÉREO') return 'Aéreo';
      if (!v.length) return '—';
      return this.fmtValor(raw);
    },

    async abrirDetalle (row) {
      this.detalleError = '';
      this.detalleSolicitud = null;
      this.modalDetalle = true;
      if (!row || row.id == null) {
        this.detalleError = 'No hay un identificador válido para consultar.';
        return;
      }
      this.detalleCarga = true;
      await this.evaluarUsuarioAprobador();
      try {
        var datos = await getRequerimientoViajeById(row.id);
        this.detalleSolicitud = datos;
      } catch (e) {
        var d = e && e.response ? e.response.data : null;
        var backendMsg = d && (d.message || d.error);
        this.detalleError = backendMsg
          ? String(backendMsg)
          : 'No se pudo obtener el detalle de la solicitud.';
      } finally {
        this.detalleCarga = false;
      }
    },

    onCerrarDetalleModal () {
      this.detalleSolicitud = null;
      this.detalleError = '';
      this.detalleCarga = false;
    },

    async onAprobarDesdeModal () {
      if (!this.puedeBotonAprobar || !this.detalleSolicitud) return;
      this.aprobacionEnCurso = true;
      try {
        await this.store.actualizarEstado(this.detalleSolicitud.id, 'APROBACION');
        this.detalleSolicitud.estado = 'APROBACION';
        this.$q.notify({
          type: 'positive',
          message: 'Solicitud pasada a aprobación.',
          position: 'top-right',
          timeout: 2500
        });
        await this.reload();
      } catch (e) {
        var msgErr = e && e.message ? e.message : 'No fue posible aprobar la solicitud.';
        this.$q.notify({
          type: 'negative',
          message: msgErr,
          position: 'top-right',
          timeout: 4000
        });
      } finally {
        this.aprobacionEnCurso = false;
      }
    }
  }
};
</script>

<style scoped>
.sticky-header-table >>> thead tr:first-child th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
}

.lista-srv__linea {
  border-color: rgba(15, 23, 42, 0.08);
}

.lista-srv__contexto {
  max-width: 52rem;
  line-height: 1.45;
}

.lista-srv-aviso-aprobador {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.lista-srv-estado-wrap {
  display: inline-block;
  max-width: 100%;
}

/* ---------- Modal · diseño orientado al escaneo (Z) ---------- */
.srv-req-modal {
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  width: min(92vw, 760px);
  max-height: min(85vh, 920px);
  overflow: hidden;
  border-radius: 14px;
}

.srv-req-modal__progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 14px 14px 0 0;
}

.z-top {
  z-index: 3;
}

.min-w-0 {
  min-width: 0;
}

.shrink-0 {
  flex-shrink: 0;
}

.srv-req-modal__header {
  flex: 0 0 auto;
  padding: var(--space-lg) var(--space-lg) var(--space-md);
  border-bottom: 1px solid #e5e7eb;
}

.srv-req-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: var(--space-xs);
}

.srv-req-modal__codigo {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
  line-height: 1.25;
  word-break: break-word;
}

.srv-req-modal__codigo--ghost {
  color: #cbd5e1;
}

.srv-req-modal__estado-chip {
  font-size: 13px;
}

.srv-req-modal__close-btn {
  opacity: 0.65;
  transition: opacity 0.18s ease;
}

.srv-req-modal__close-btn:hover {
  opacity: 1;
}

.srv-req-modal__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.srv-req-modal__hint {
  color: #64748b;
}

.srv-req-modal__hint--error {
  color: #b91c1c;
}

.srv-req-modal__hr {
  border-color: rgba(15, 23, 42, 0.08);
}

.srv-req-pad-x {
  padding-left: var(--space-lg);
  padding-right: var(--space-lg);
}

.srv-req-pad-b-extra {
  padding-bottom: var(--space-lg);
}

.srv-req-quick {
  padding: var(--space-md) var(--space-lg) var(--space-sm);
}

.srv-req-quick__title {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: var(--space-md);
  letter-spacing: 0.02em;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .summary-grid,
  .info-grid,
  .srv-req-route-pair {
    grid-template-columns: 1fr;
  }
}

.srv-req-quick__cell {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  min-width: 0;
}

.srv-req-quick__ic {
  flex-shrink: 0;
  margin-top: 2px;
}

.srv-req-quick__text {
  min-width: 0;
}

.srv-req-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 6px;
}

.srv-req-strong {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.45;
  word-break: break-word;
}

.srv-req-muted-strong {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.srv-req-gap-tight {
  gap: var(--space-md) !important;
}

.srv-req-block {
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
}

.srv-req-section-kicker {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid #f1f5f9;
}

.srv-req-stack-tight-xs > .srv-req-label {
  margin-bottom: 4px;
}

.srv-req-meta {
  padding-top: var(--space-md);
  padding-bottom: var(--space-md);
}

.srv-req-route-pair .srv-req-route-cell {
  min-width: 0;
}

.srv-req-info-text {
  font-size: 14px;
  line-height: 1.7;
  color: #334155;
  max-width: 65ch;
  word-break: break-word;
}

.srv-req-prose {
  white-space: pre-wrap;
}

.observation-box {
  background: #f8fafc;
  border-left: 4px solid #b7d100;
  padding: 18px;
  border-radius: 12px;
}

.observation-box__title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.observation-box__body {
  margin-top: 10px;
  max-width: none;
}

.srv-req-sin-notas {
  padding-bottom: var(--space-sm);
}

.srv-req-modal__footer {
  flex: 0 0 auto;
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.srv-req-footer__row {
  width: 100%;
}

.srv-req-footer__hint {
  min-width: 0;
  line-height: 1.45;
}

@media (max-width: 600px) {
  .srv-req-footer__row {
    flex-direction: column;
    align-items: stretch !important;
  }

  .srv-req-footer__row .col-auto {
    width: 100%;
    justify-content: flex-end !important;
  }
}
</style>
