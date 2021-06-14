<template>
  <q-page class="q-py-md">
    <h5 class="q-px-md">Parametrización</h5>
    <q-list bordered>
      <q-item
        clickable
        :to="{name: 'categorias'}"
        v-ripple
        class="q-py-md">
        <q-item-section avatar>
          <q-icon name="ti-agenda" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Categorias</q-item-label>
          <q-item-label caption>Categorías de parametrización.</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon color="grey-6" name="ti-angle-right" />
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable :to="{name: 'parametros'}" v-ripple class="q-py-md">
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

      <q-item clickable :to="{name: 'nueva-organizacion'}" v-ripple class="q-py-md">
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

      <q-item clickable :to="{name: 'municipios'}" v-ripple class="q-py-md">
        <q-item-section avatar>
          <q-icon name="ti-agenda" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Municipios</q-item-label>
          <q-item-label caption>Municipios.</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon color="grey-6" name="ti-angle-right" />
        </q-item-section>
      </q-item>

      <q-separator />

      <q-item clickable :to="{name: 'departamentos'}" v-ripple class="q-py-md">
        <q-item-section avatar>
          <q-icon name="ti-agenda" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Departamentos</q-item-label>
          <q-item-label caption>Departamentos.</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon color="grey-6" name="ti-angle-right" />
        </q-item-section>
      </q-item>

      <q-separator />

    </q-list>
  </q-page>
</template>

<script>
export default {
  name: 'PageMenuParametrizacion'
}
</script>
