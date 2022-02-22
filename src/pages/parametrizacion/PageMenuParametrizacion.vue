<template>
  <q-page>
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div class="text-h6 q-px-xs q-py-md ">Parametrización</div>
        <q-list bordered>
          <q-item
            clickable
            :to="{ name: 'PageCategoriaIndex' }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon name="ti-agenda" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Categorías</q-item-label>
              <q-item-label caption
                >Categorías de parametrización.</q-item-label
              >
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            clickable
            :to="{ name: 'PageParametroIndex' }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon name="ti-agenda" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Parámetros</q-item-label>
              <q-item-label caption>Parámetros generales.</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            clickable
            :to="{ name: 'PageJacCreate' }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon name="ti-agenda" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Organizaciones de Base</q-item-label>
              <q-item-label caption>Jac / Cabildos</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            clickable
            :to="{ name: 'PageUsuarioIndex' }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon name="ti-agenda" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Usuarios</q-item-label>
              <q-item-label caption>Gestión de Usuarios</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            clickable
            :to="{ name: 'PageComunidadIndex' }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon name="ti-agenda" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Comunidades</q-item-label>
              <q-item-label caption>Listado de Comunidades.</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            clickable
            :to="{ name: 'PageMunicipioIndex' }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon name="ti-agenda" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Municipios</q-item-label>
              <q-item-label caption>Listado de Municipios.</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item
            clickable
            :to="{ name: 'PageDepartamentoIndex' }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon name="ti-agenda" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Departamentos</q-item-label>
              <q-item-label caption>Listado de Departamentos.</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>

          <q-separator />
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PageMenuParametrizacion"
};
</script>
