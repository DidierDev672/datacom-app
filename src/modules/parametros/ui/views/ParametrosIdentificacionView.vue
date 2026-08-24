<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <div class="row items-center q-mb-md">
          <div>
            <div class="text-h5 text-weight-bold text-dark">Parámetros de identificación</div>
            <div class="text-caption text-grey-7">Administra los tipos de identificación y su categoría</div>
          </div>
          <q-space />
          <q-btn unelevated no-caps color="primary" icon="add" label="Nuevo tipo" @click="abrirDialogParametro(null)" :disable="!categoriaTd.id" />
        </div>

        <q-card flat bordered class="q-mb-md">
          <q-card-section class="bg-primary text-white">
            <div class="row items-center">
              <div class="text-subtitle1 text-weight-bold">Categoría: Tipo de Documento</div>
              <q-space />
              <q-btn flat dense icon="edit" class="text-white" @click="abrirDialogCategoria" />
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <label class="custom-label">Código</label>
                <div class="text-body1 text-weight-bold">{{ categoriaTd.codigo || '-' }}</div>
              </div>
              <div class="col-12 col-sm-4">
                <label class="custom-label">Descripción</label>
                <div class="text-body1 text-weight-bold">{{ categoriaTd.descripcion || '-' }}</div>
              </div>
              <div class="col-12 col-sm-4">
                <label class="custom-label">Estado</label>
                <q-badge :color="categoriaTd.estado ? 'positive' : 'negative'">{{ categoriaTd.estado ? 'Activo' : 'Inactivo' }}</q-badge>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section class="bg-primary text-white">
            <div class="text-subtitle1 text-weight-bold">Tipos de identificación</div>
          </q-card-section>
          <q-separator />
          <q-card-section v-if="loadingParametros" class="text-center q-pa-lg">
            <q-spinner color="primary" size="36px" />
          </q-card-section>
          <template v-else-if="parametros.length === 0">
            <q-card-section class="text-center q-pa-lg">
              <q-icon name="info" size="48px" color="grey-4" />
              <div class="text-body1 text-grey-6 q-mt-sm">No hay tipos de identificación registrados</div>
              <q-btn unelevated no-caps color="primary" icon="add" label="Crear primero" class="q-mt-md" @click="abrirDialogParametro(null)" />
            </q-card-section>
          </template>
          <template v-else>
            <q-list separator>
              <q-item v-for="p in parametros" :key="p.id" class="q-py-sm">
                <q-item-section avatar>
                  <q-icon name="badge" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ p.codigo }} - {{ p.nombre }}</q-item-label>
                  <q-item-label caption>
                    <q-badge :color="p.estado ? 'positive' : 'negative'" class="q-mr-sm">{{ p.estado ? 'Activo' : 'Inactivo' }}</q-badge>
                    ID: {{ p.id }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat dense round icon="edit" color="primary" @click="abrirDialogParametro(p)" />
                  <q-btn flat dense round icon="delete" color="negative" @click="eliminarParametro(p)" />
                </q-item-section>
              </q-item>
            </q-list>
          </template>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showCategoriaDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold">Editar categoría</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="categoriaForm.codigo" outlined dense label="Código" class="q-mb-md" />
          <q-input v-model="categoriaForm.descripcion" outlined dense label="Descripción" class="q-mb-md" />
          <q-toggle v-model="categoriaForm.estado" label="Activo" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated no-caps label="Guardar" color="primary" :loading="guardandoCategoria" @click="guardarCategoria" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showParametroDialog" persistent>
      <q-card style="min-width: 420px">
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-weight-bold">{{ editandoParametro ? 'Editar' : 'Nuevo' }} tipo de identificación</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="parametroForm.nombre" outlined dense label="Nombre" class="q-mb-md" placeholder="Ej: Cédula de Extranjería" />
          <q-input v-model="parametroForm.codigo" outlined dense label="Código" class="q-mb-md" placeholder="Ej: CE" maxlength="10" />
          <q-toggle v-model="parametroForm.estado" label="Activo" />
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup />
          <q-btn unelevated no-caps label="Guardar" color="primary" :loading="guardandoParametro" @click="guardarParametro" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import client from 'src/api/client';
import axios from 'axios';
import { URL_API } from 'src/utils/config';

export default {
  name: 'ParametrosIdentificacionView',
  data: function () {
    return {
      categoriaTd: { id: null, codigo: '', descripcion: '', estado: true },
      parametros: [],
      showCategoriaDialog: false,
      showParametroDialog: false,
      editandoParametro: false,
      categoriaForm: { codigo: '', descripcion: '', estado: true },
      parametroForm: { id: null, nombre: '', codigo: '', estado: true },
      loadingParametros: false,
      guardandoCategoria: false,
      guardandoParametro: false,
    };
  },
  methods: {
    async loadCategoriaTd() {
      try {
        var res = await client.get('/categoria/');
        var lista = res.data || [];
        var td = lista.find(function (c) { return c.codigo === 'TD'; });
        if (td) {
          this.categoriaTd = td;
          this.loadParametros();
        } else {
          this.categoriaTd = { id: null, codigo: 'TD', descripcion: 'Tipo de Documento', estado: true };
        }
      } catch (err) {
        console.error('[ParametrosView] Error al cargar categorías:', err);
        this.$q.notify({ type: 'negative', message: 'Error al cargar categorías', icon: 'warning' });
      }
    },

    async loadParametros() {
      this.loadingParametros = true;
      try {
        var res = await axios.get(URL_API + '/parametro/categoria/TD');
        this.parametros = res.data || [];
      } catch (err) {
        console.error('[ParametrosView] Error al cargar parámetros:', err);
        this.$q.notify({ type: 'negative', message: 'Error al cargar tipos de identificación', icon: 'warning' });
      } finally {
        this.loadingParametros = false;
      }
    },

    abrirDialogCategoria() {
      this.categoriaForm = { ...this.categoriaTd };
      this.showCategoriaDialog = true;
    },

    async guardarCategoria() {
      this.guardandoCategoria = true;
      try {
        if (this.categoriaTd.id) {
          await client.put('/categoria/' + this.categoriaTd.id, this.categoriaForm);
        } else {
          await client.post('/categoria/', this.categoriaForm);
        }
        this.$q.notify({ type: 'positive', message: 'Categoría guardada', icon: 'check_circle' });
        this.showCategoriaDialog = false;
        await this.loadCategoriaTd();
      } catch (err) {
        console.error('[ParametrosView] Error al guardar categoría:', err);
        this.$q.notify({ type: 'negative', message: 'Error al guardar categoría', icon: 'error' });
      } finally {
        this.guardandoCategoria = false;
      }
    },

    abrirDialogParametro(p) {
      if (p) {
        this.editandoParametro = true;
        this.parametroForm = { id: p.id, nombre: p.nombre, codigo: p.codigo, estado: p.estado };
      } else {
        this.editandoParametro = false;
        this.parametroForm = { id: null, nombre: '', codigo: '', estado: true };
      }
      this.showParametroDialog = true;
    },

    async guardarParametro() {
      if (!this.parametroForm.nombre) {
        this.$q.notify({ type: 'warning', message: 'El nombre es obligatorio', icon: 'warning' });
        return;
      }
      this.guardandoParametro = true;
      try {
        var catId = this.categoriaTd.id;
        if (!catId) {
          var catRes = await client.post('/categoria/', { codigo: 'TD', descripcion: 'Tipo de Documento', estado: true });
          catId = catRes.data;
          await this.loadCategoriaTd();
        }
        if (this.editandoParametro) {
          await client.put('/parametro/' + this.parametroForm.id, {
            nombre: this.parametroForm.nombre,
            codigo: this.parametroForm.codigo,
            estado: this.parametroForm.estado,
            categoria: { id: catId },
          });
        } else {
          await client.post('/parametro/', {
            nombre: this.parametroForm.nombre,
            codigo: this.parametroForm.codigo,
            categoria: { id: catId },
            estado: this.parametroForm.estado,
          });
        }
        this.$q.notify({ type: 'positive', message: 'Tipo de identificación guardado', icon: 'check_circle' });
        this.showParametroDialog = false;
        await this.loadParametros();
      } catch (err) {
        console.error('[ParametrosView] Error al guardar parámetro:', err);
        this.$q.notify({ type: 'negative', message: 'Error al guardar tipo de identificación', icon: 'error' });
      } finally {
        this.guardandoParametro = false;
      }
    },

    async eliminarParametro(p) {
      this.$q.dialog({
        title: 'Eliminar',
        message: '¿Eliminar ' + p.codigo + ' - ' + p.nombre + '?',
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        try {
          await client.put('/parametro/' + p.id, { estado: false });
          this.$q.notify({ type: 'positive', message: 'Tipo desactivado', icon: 'check_circle' });
          await this.loadParametros();
        } catch (err) {
          console.error('[ParametrosView] Error al desactivar:', err);
          this.$q.notify({ type: 'negative', message: 'Error al desactivar', icon: 'error' });
        }
      });
    },
  },
  mounted() {
    this.loadCategoriaTd();
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
</style>
