<template>
  <q-page class="q-pa-md">
    <q-linear-progress v-if="loadingInitial" indeterminate color="primary" />

    <template v-if="!loadingInitial">
      <div class="row justify-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="row items-center q-mb-lg">
            <q-btn flat round dense icon="arrow_back" class="q-mr-sm" @click="goBack" />
            <div>
              <div class="text-h5 text-weight-bold text-dark">Crear usuario</div>
              <div class="text-caption text-grey-7">Registro de nuevo usuario en el sistema</div>
            </div>
          </div>

          <q-form ref="formRef" @submit.prevent="submit">
            <q-stepper
              v-model="step"
              ref="stepper"
              color="primary"
              animated
              header-nav
              flat
              bordered
            >
              <q-step
                :name="1"
                title="Datos de acceso"
                icon="lock"
                :done="step > 1"
              >
                <q-card flat>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Usuario *</label>
                        <q-input
                          v-model="form.username"
                          outlined dense
                          :error="$v.form.username.$error"
                          :error-message="usernameErrorMsg"
                          placeholder="Nombre de usuario"
                          @blur="$v.form.username.$touch()"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Contraseña *</label>
                        <q-input
                          v-model="form.password"
                          outlined dense
                          :type="showPassword ? 'text' : 'password'"
                          :error="$v.form.password.$error"
                          placeholder="Contraseña"
                          @blur="$v.form.password.$touch()"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="showPassword ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="showPassword = !showPassword"
                            />
                          </template>
                        </q-input>
                        <div class="q-mt-xs">
                          <div class="password-rule" :class="{ 'text-positive': hasUpperCase, 'text-grey-6': !hasUpperCase }">
                            <q-icon :name="hasUpperCase ? 'check_circle' : 'radio_button_unchecked'" size="14px" class="q-mr-xs" />
                            <span class="text-caption">Una mayúscula</span>
                          </div>
                          <div class="password-rule" :class="{ 'text-positive': hasLowerCase, 'text-grey-6': !hasLowerCase }">
                            <q-icon :name="hasLowerCase ? 'check_circle' : 'radio_button_unchecked'" size="14px" class="q-mr-xs" />
                            <span class="text-caption">Una minúscula</span>
                          </div>
                          <div class="password-rule" :class="{ 'text-positive': hasNumber, 'text-grey-6': !hasNumber }">
                            <q-icon :name="hasNumber ? 'check_circle' : 'radio_button_unchecked'" size="14px" class="q-mr-xs" />
                            <span class="text-caption">Un número</span>
                          </div>
                          <div class="password-rule" :class="{ 'text-positive': hasSpecialChar, 'text-grey-6': !hasSpecialChar }">
                            <q-icon :name="hasSpecialChar ? 'check_circle' : 'radio_button_unchecked'" size="14px" class="q-mr-xs" />
                            <span class="text-caption">Un carácter especial</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Confirmar contraseña *</label>
                        <q-input
                          v-model="form.passwordConfirm"
                          outlined dense
                          :type="showPasswordConfirm ? 'text' : 'password'"
                          :error="$v.form.passwordConfirm.$error"
                          error-message="Las contraseñas no coinciden"
                          placeholder="Repite la contraseña"
                          @blur="$v.form.passwordConfirm.$touch()"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="showPasswordConfirm ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="showPasswordConfirm = !showPasswordConfirm"
                            />
                          </template>
                        </q-input>
                      </div>
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Roles</label>
                        <q-select
                          v-model="form.roles"
                          :options="roleOptions"
                          outlined dense multiple
                          emit-value map-options
                          placeholder="Selecciona uno o varios roles"
                          :loading="loadingRoles"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-stepper-navigation class="q-mt-md">
                  <q-btn unelevated no-caps color="primary" label="Siguiente" @click="step = 2" />
                  <q-btn flat no-caps color="grey-7" label="Cancelar" @click="goBack" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="2"
                title="Identificación"
                icon="badge"
                :done="step > 2"
              >
                <q-card flat>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Tipo de identificación *</label>
                        <q-select
                          v-if="tipoIdentificacionOptions.length > 0"
                          v-model="form.tercero.tipoIdentificacion"
                          :options="tipoIdentificacionOptions"
                          outlined dense
                          emit-value map-options
                          :loading="loadingTipoIdentificacion"
                          :error="$v.form.tercero.tipoIdentificacion.$error"
                          error-message="Campo obligatorio"
                          placeholder="Selecciona tipo"
                          @blur="$v.form.tercero.tipoIdentificacion.$touch()"
                        />
                        <div v-else class="row items-end q-col-gutter-sm">
                          <div class="col">
                            <q-input
                              v-model="form.tercero.tipoIdentificacion"
                              outlined dense
                              :loading="loadingTipoIdentificacion"
                              :error="$v.form.tercero.tipoIdentificacion.$error"
                              error-message="Campo obligatorio"
                              placeholder="Escribe el tipo de identificación"
                              @blur="$v.form.tercero.tipoIdentificacion.$touch()"
                            />
                          </div>
                        </div>
                        <div v-if="tipoIdentificacionOptions.length === 0 && !loadingTipoIdentificacion" class="text-caption text-grey-6 q-mt-xs">
                          No se encontraron tipos predefinidos. Escribe el nombre manualmente y se creará automáticamente al guardar.
                        </div>
                      </div>
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Número de identificación *</label>
                        <q-input
                          v-model="form.tercero.identificacion"
                          outlined dense
                          :error="$v.form.tercero.identificacion.$error"
                          error-message="Campo obligatorio"
                          placeholder="Número de identificación"
                          @blur="$v.form.tercero.identificacion.$touch()"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-stepper-navigation class="q-mt-md">
                  <q-btn flat no-caps label="Atrás" @click="step = 1" />
                  <q-btn unelevated no-caps color="primary" label="Siguiente" @click="step = 3" class="q-ml-sm" />
                  <q-btn flat no-caps color="grey-7" label="Cancelar" @click="goBack" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="3"
                title="Nombre del tercero"
                icon="person"
                :done="step > 3"
              >
                <q-card flat>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Primer nombre *</label>
                        <q-input
                          v-model="form.tercero.primerNombre"
                          outlined dense
                          :error="$v.form.tercero.primerNombre.$error"
                          error-message="Campo obligatorio"
                          placeholder="Primer nombre"
                          @blur="$v.form.tercero.primerNombre.$touch()"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Segundo nombre</label>
                        <q-input
                          v-model="form.tercero.segundoNombre"
                          outlined dense
                          placeholder="Segundo nombre"
                        />
                      </div>
                    </div>
                    <div class="row q-col-gutter-md q-mt-sm">
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Primer apellido *</label>
                        <q-input
                          v-model="form.tercero.primerApellido"
                          outlined dense
                          :error="$v.form.tercero.primerApellido.$error"
                          error-message="Campo obligatorio"
                          placeholder="Primer apellido"
                          @blur="$v.form.tercero.primerApellido.$touch()"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Segundo apellido</label>
                        <q-input
                          v-model="form.tercero.segundoApellido"
                          outlined dense
                          placeholder="Segundo apellido"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-stepper-navigation class="q-mt-md">
                  <q-btn flat no-caps label="Atrás" @click="step = 2" />
                  <q-btn unelevated no-caps color="primary" label="Siguiente" @click="step = 4" class="q-ml-sm" />
                  <q-btn flat no-caps color="grey-7" label="Cancelar" @click="goBack" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="4"
                title="Ubicación geográfica"
                icon="map"
                :done="step > 4"
              >
                <q-card flat>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <label class="custom-label">País</label>
                        <q-select
                          v-model="selectedPais"
                          :options="paises"
                          outlined dense
                          option-label="nombrePais"
                          :loading="loadingPaises"
                          placeholder="Selecciona país"
                          clearable
                        />
                      </div>
                      <div class="col-12 col-sm-4">
                        <label class="custom-label">Departamento</label>
                        <q-select
                          v-model="form.tercero.departamento"
                          :options="departamentos"
                          outlined dense
                          option-label="nombreDepartamento"
                          :loading="loadingDepartamentos"
                          :disable="!selectedPais"
                          placeholder="Selecciona departamento"
                          clearable
                          @input="onDepartamentoChange"
                        />
                      </div>
                      <div class="col-12 col-sm-4">
                        <label class="custom-label">Ciudad / Municipio</label>
                        <q-select
                          v-model="form.tercero.ciudad"
                          :options="municipios"
                          outlined dense
                          option-label="nombreMunicipio"
                          :loading="loadingMunicipios"
                          :disable="!form.tercero.departamento"
                          placeholder="Selecciona ciudad"
                          clearable
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-stepper-navigation class="q-mt-md">
                  <q-btn flat no-caps label="Atrás" @click="step = 3" />
                  <q-btn unelevated no-caps color="primary" label="Siguiente" @click="step = 5" class="q-ml-sm" />
                  <q-btn flat no-caps color="grey-7" label="Cancelar" @click="goBack" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>

              <q-step
                :name="5"
                title="Contacto"
                icon="contact_mail"
                :done="step > 5"
              >
                <q-card flat>
                  <q-card-section>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Teléfono</label>
                        <q-input
                          v-model="form.tercero.telefono"
                          outlined dense
                          placeholder="Teléfono de contacto"
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <label class="custom-label">Correo electrónico</label>
                        <q-input
                          v-model="form.tercero.email"
                          outlined dense type="email"
                          :error="$v.form.tercero.email.$error"
                          error-message="Correo electrónico inválido"
                          placeholder="correo@ejemplo.com"
                          @blur="$v.form.tercero.email.$touch()"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
                <q-stepper-navigation class="q-mt-md">
                  <q-btn flat no-caps label="Atrás" @click="step = 4" />
                  <q-btn unelevated no-caps color="primary" icon="save" label="Guardar usuario" type="submit" :loading="submitting" :disable="submitting" class="q-ml-sm" />
                  <q-btn flat no-caps color="grey-7" label="Cancelar" @click="goBack" class="q-ml-sm" />
                </q-stepper-navigation>
              </q-step>
            </q-stepper>
          </q-form>
        </div>
      </div>
    </template>

    <q-dialog v-model="showSuccessDialog" persistent>
      <q-card style="min-width: 380px">
        <q-card-section class="text-center q-pt-lg">
          <q-icon name="check_circle" color="positive" size="64px" />
          <div class="text-h6 text-weight-bold q-mt-md q-mb-sm">Usuario creado exitosamente</div>
          <div class="text-body2 text-grey-7">
            El usuario <strong>{{ createdUsername }}</strong> fue registrado correctamente en el sistema.
          </div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-pt-sm">
          <q-btn unelevated no-caps color="primary" icon="add" label="Crear otro usuario" @click="resetForm" />
          <q-btn flat no-caps color="primary" label="Volver" @click="goBack" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showErrorDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-center q-pt-lg">
          <q-icon name="error_outline" color="negative" size="64px" />
          <div class="text-h6 text-weight-bold q-mt-md q-mb-sm">Error al crear usuario</div>
          <div class="text-body2 text-grey-7">{{ errorMessage }}</div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-pt-sm">
          <q-btn unelevated no-caps color="primary" label="Intentar de nuevo" @click="showErrorDialog = false" />
          <q-btn flat no-caps color="grey-7" label="Cancelar" @click="showErrorDialog = false; goBack()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showTipoIdentErrorDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="text-center q-pt-lg">
          <q-icon name="warning" color="warning" size="64px" />
          <div class="text-h6 text-weight-bold q-mt-md q-mb-sm">Error al cargar tipos de identificación</div>
          <div class="text-body2 text-grey-7">{{ tipoIdentErrorMessage }}</div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-pt-sm">
          <q-btn unelevated no-caps color="primary" label="Reintentar" @click="showTipoIdentErrorDialog = false; loadTipoIdentificacion()" />
          <q-btn flat no-caps color="grey-7" label="Cerrar" @click="showTipoIdentErrorDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import client from 'src/api/client';

function strongPassword(val) {
  if (!val) return false;
  return /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val);
}

var ROLE_MAP = {};

export default {
  name: 'UserCreateView',

  validations: {
    form: {
      username: { required },
      password: { required, minLength: minLength(6), strongPassword: strongPassword },
      passwordConfirm: { sameAsPassword: sameAs('password') },
      tercero: {
        tipoIdentificacion: { required },
        identificacion: { required },
        primerNombre: { required },
        primerApellido: { required },
        email: { email },
      },
    },
  },

  data: function () {
    return {
      form: {
        username: '',
        password: '',
        passwordConfirm: '',
        roles: [],
        tenant: 'tenant_fodc',
        tercero: {
          tipoIdentificacion: null,
          identificacion: '',
          primerNombre: '',
          segundoNombre: '',
          primerApellido: '',
          segundoApellido: '',
          codigoPais: '',
          departamento: null,
          ciudad: null,
          telefono: '',
          email: '',
        },
      },
      step: 1,
      showPassword: false,
      showPasswordConfirm: false,
      selectedPais: null,
      roleOptions: [],
      tipoIdentificacionOptions: [],
      paises: [],
      departamentos: [],
      municipios: [],

      loadingInitial: true,
      loadingTipoIdentificacion: false,
      loadingPaises: false,
      loadingDepartamentos: false,
      loadingMunicipios: false,
      loadingRoles: false,
      submitting: false,

      showSuccessDialog: false,
      showErrorDialog: false,
      errorMessage: '',
      createdUsername: '',
      showTipoIdentErrorDialog: false,
      tipoIdentErrorMessage: '',
    };
  },

  computed: {
    hasUpperCase: function () {
      return /[A-Z]/.test(this.form.password);
    },
    hasLowerCase: function () {
      return /[a-z]/.test(this.form.password);
    },
    hasNumber: function () {
      return /[0-9]/.test(this.form.password);
    },
    hasSpecialChar: function () {
      return /[^A-Za-z0-9]/.test(this.form.password);
    },
    usernameErrorMsg: function () {
      var v = this.$v.form.username;
      if (!v.$dirty || v.$pending) return '';
      if (!v.required) return 'El nombre de usuario es obligatorio';
      return '';
    },
    passwordErrorMsg: function () {
      var v = this.$v.form.password;
      if (!v.$dirty || v.$pending) return '';
      if (!v.required) return 'La contraseña es obligatoria';
      if (!v.minLength) return 'Mínimo 6 caracteres';
      if (!v.strongPassword) return 'Debe contener mayúscula, minúscula, número y carácter especial';
      return '';
    },
  },

  watch: {
    'selectedPais': function (val) {
      if (val) {
        this.form.tercero.codigoPais = val.abreviatura || val.codigoInternacional || '';
        this.loadDepartamentos(val.id);
      } else {
        this.form.tercero.codigoPais = '';
        this.form.tercero.departamento = null;
        this.form.tercero.ciudad = null;
        this.departamentos = [];
        this.municipios = [];
      }
    },
  },

  methods: {
    async loadInitialData() {
      this.loadingInitial = true;
      try {
        await Promise.all([
          this.loadTipoIdentificacion(),
          this.loadPaises(),
          this.loadRoles(),
        ]);
      } catch (err) {
        console.error('[UserCreateView] Error al cargar datos iniciales:', err);
      } finally {
        this.loadingInitial = false;
      }
    },

    async loadRoles() {
      this.loadingRoles = true;
      try {
        var res = await client.get('/roles/');
        var data = res.data || [];
        this.roleOptions = data.map(function (r) {
          return { label: r.nombre, value: { id: r.id } };
        });
      } catch (err) {
        console.error('[UserCreateView] Error al cargar roles:', err);
        this.$q.notify({ type: 'negative', message: 'Error al cargar roles', icon: 'warning' });
      } finally {
        this.loadingRoles = false;
      }
    },

    async loadTipoIdentificacion() {
      this.loadingTipoIdentificacion = true;
      try {
        var res = await client.get('/parametro/categoria/TD');
        var data = res.data;
        this.tipoIdentificacionOptions = (data || []).map(function (p) {
          return { label: p.nombre, value: { id: p.id } };
        });
      } catch (err) {
        console.error('[UserCreateView] Error al cargar tipos de identificación:', err);
        this.tipoIdentErrorMessage = err.message || 'No se pudieron cargar los tipos de identificación. Verifica la conexión e intenta de nuevo.';
        this.showTipoIdentErrorDialog = true;
      } finally {
        this.loadingTipoIdentificacion = false;
      }
    },

    async loadPaises() {
      this.loadingPaises = true;
      try {
        var res = await client.get('/pais/');
        this.paises = res.data || [];
      } catch (err) {
        console.error('[UserCreateView] Error al cargar países:', err);
        this.$q.notify({ type: 'negative', message: 'Error al cargar países', icon: 'warning' });
      } finally {
        this.loadingPaises = false;
      }
    },

    async loadDepartamentos(paisId) {
      this.loadingDepartamentos = true;
      this.departamentos = [];
      this.form.tercero.departamento = null;
      this.form.tercero.ciudad = null;
      this.municipios = [];
      try {
        var res = await client.get('/departamento/pais/' + paisId);
        this.departamentos = res.data || [];
      } catch (err) {
        console.error('[UserCreateView] Error al cargar departamentos:', err);
        this.$q.notify({ type: 'negative', message: 'Error al cargar departamentos', icon: 'warning' });
      } finally {
        this.loadingDepartamentos = false;
      }
    },

    async loadMunicipios(departamentoId) {
      this.loadingMunicipios = true;
      this.municipios = [];
      this.form.tercero.ciudad = null;
      try {
        var res = await client.get('/departamento/' + departamentoId + '/municipios');
        this.municipios = res.data || [];
      } catch (err) {
        console.error('[UserCreateView] Error al cargar municipios:', err);
        this.$q.notify({ type: 'negative', message: 'Error al cargar ciudades', icon: 'warning' });
      } finally {
        this.loadingMunicipios = false;
      }
    },

    async crearTipoIdentificacion(nombre) {
      try {
        var catRes = await client.get('/categoria/');
        var categorias = catRes.data || [];
        var tdCat = categorias.find(function (c) { return c.codigo === 'TD'; });
        if (!tdCat) {
          this.$q.notify({ type: 'negative', message: 'No se encontró la categoría TD para crear el tipo de identificación', icon: 'warning' });
          return { nombre: nombre };
        }
        var codigo = nombre.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase();
        var paramRes = await client.post('/parametro/', {
          nombre: nombre,
          codigo: codigo,
          categoria: { id: tdCat.id },
          estado: true,
        });
        var newId = paramRes.data;
        console.log('[UserCreateView] Tipo de identificación creado con ID:', newId);
        return { id: newId };
      } catch (err) {
        console.error('[UserCreateView] Error al crear tipo de identificación:', err);
        this.$q.notify({ type: 'negative', message: 'Error al crear el tipo de identificación. Intenta de nuevo.', icon: 'error' });
        throw err;
      }
    },

    onDepartamentoChange() {
      var dept = this.form.tercero.departamento;
      if (dept) {
        this.loadMunicipios(dept.id);
      } else {
        this.form.tercero.ciudad = null;
        this.municipios = [];
      }
    },

    async submit() {
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        this.$q.notify({ type: 'warning', message: 'Corrige los campos marcados en rojo antes de guardar', icon: 'warning' });
        return;
      }

      this.submitting = true;
      try {
        var tipoIdentificacionFinal = this.form.tercero.tipoIdentificacion;

        if (this.tipoIdentificacionOptions.length === 0 && this.form.tercero.tipoIdentificacion) {
          tipoIdentificacionFinal = await this.crearTipoIdentificacion(this.form.tercero.tipoIdentificacion);
        }

        var payload = {
          username: this.form.username,
          password: this.form.password,
          tenant: this.form.tenant,
          roles: this.form.roles,
          tercero: {
            tipoIdentificacion: tipoIdentificacionFinal,
            identificacion: this.form.tercero.identificacion,
            primerNombre: this.form.tercero.primerNombre,
            segundoNombre: this.form.tercero.segundoNombre || null,
            primerApellido: this.form.tercero.primerApellido,
            segundoApellido: this.form.tercero.segundoApellido || null,
            codigoPais: this.form.tercero.codigoPais || null,
            departamento: this.form.tercero.departamento ? { id: this.form.tercero.departamento.id } : null,
            ciudad: this.form.tercero.ciudad ? { id: this.form.tercero.ciudad.id } : null,
            telefono: this.form.tercero.telefono || null,
            email: this.form.tercero.email || null,
          },
        };
        var res = await client.post('/usuario/', payload);
        this.createdUsername = this.form.username;
        this.showSuccessDialog = true;
      } catch (err) {
        console.error('[UserCreateView] Error al crear usuario:', err);
        this.errorMessage = err.message || 'Ocurrió un error al intentar crear el usuario. Intenta de nuevo.';
        this.showErrorDialog = true;
      } finally {
        this.submitting = false;
      }
    },

    resetForm() {
      this.form = {
        username: '',
        password: '',
        passwordConfirm: '',
        roles: [],
        tenant: 'tenant_fodc',
        tercero: {
          tipoIdentificacion: null,
          identificacion: '',
          primerNombre: '',
          segundoNombre: '',
          primerApellido: '',
          segundoApellido: '',
          codigoPais: '',
          departamento: null,
          ciudad: null,
          telefono: '',
          email: '',
        },
      };
      this.step = 1;
      this.selectedPais = null;
      this.departamentos = [];
      this.municipios = [];
      this.showSuccessDialog = false;
      this.showErrorDialog = false;
      this.$v.$reset();
      if (this.$refs.formRef) {
        this.$refs.formRef.resetValidation();
      }
    },

    goBack() {
      if (this.$route && this.$route.name === 'user-create') {
        this.$router.push({ name: 'usuarios' });
      } else {
        this.$router.back();
      }
    },
  },

  mounted() {
    this.loadInitialData();
  },
};
</script>

<style scoped>
.custom-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6B7C85;
  margin-bottom: 4px;
}

.password-rule {
  display: flex;
  align-items: center;
  line-height: 1.6;
}
</style>
