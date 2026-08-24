<template>
  <!--
    Vista de Administración de Permisos por Trabajador.
    Layout: 4 columnas en desktop, apilado en mobile.
    UX: máximo 2 decisiones visibles a la vez → buscar trabajador y configurar permisos.
  -->
  <q-page class="wp-page">
    <div class="wp-shell">

      <!-- ====== ENCABEZADO + WIZARD INDICATOR ====== -->
      <header class="wp-header">
        <div class="row items-start justify-between q-mb-xs">
          <div>
            <h1 class="wp-title q-my-none">Gestión de permisos</h1>
            <p class="wp-sub q-mt-xs q-mb-none">
              Asigna acceso a módulos y acciones por colaborador
            </p>
          </div>
          <div v-if="selectedWorker" class="col-auto">
            <q-chip dense color="indigo-1" text-color="indigo-9" class="wp-summary-chip">
              <q-icon name="verified_user" size="14px" class="q-mr-xs" />
              <strong>{{ totalGrantedCount }}</strong>&nbsp;permisos activos
            </q-chip>
          </div>
        </div>

        <!-- Wizard step bar -->
        <div class="wp-wizard-bar q-mt-md">
          <div class="wp-wizard-step" :class="{ 'wp-wizard-done': !!selectedWorker, 'wp-wizard-active': !selectedWorker }">
            <div class="wp-wizard-bubble">1</div>
            <div class="wp-wizard-label">Colaborador</div>
          </div>
          <div class="wp-wizard-arrow" :class="{ 'wp-wizard-arrow-active': !!selectedWorker }">
            <q-icon name="chevron_right" size="18px" />
          </div>
          <div class="wp-wizard-step" :class="{ 'wp-wizard-done': !!activeModule && !!selectedWorker, 'wp-wizard-active': !!selectedWorker && !activeModule }">
            <div class="wp-wizard-bubble">2</div>
            <div class="wp-wizard-label">Módulo</div>
          </div>
          <div class="wp-wizard-arrow" :class="{ 'wp-wizard-arrow-active': !!activeModule }">
            <q-icon name="chevron_right" size="18px" />
          </div>
          <div class="wp-wizard-step" :class="{ 'wp-wizard-active': !!checkedModuleId && !activeModule }">
            <div class="wp-wizard-bubble">3</div>
            <div class="wp-wizard-label">Vistas</div>
          </div>
          <div class="wp-wizard-arrow" :class="{ 'wp-wizard-arrow-active': !!activeModule && !!selectedWorker }">
            <q-icon name="chevron_right" size="18px" />
          </div>
          <div class="wp-wizard-step" :class="{ 'wp-wizard-active': !!activeModule && !!selectedWorker }">
            <div class="wp-wizard-bubble">4</div>
            <div class="wp-wizard-label">Permisos</div>
          </div>
        </div>
      </header>

      <!-- Context bar sticky: siempre visible durante la configuración -->
      <div v-if="selectedWorker" class="wp-context-bar q-mt-sm q-mb-md">
        <div class="row items-center q-gutter-sm">
          <q-icon name="person_pin" size="18px" class="text-indigo-6" />
          <span class="wp-context-label">{{ selectedWorker.fullName }}</span>
          <template v-if="selectedWorker.position">
            <span class="wp-context-sep">·</span>
            <span class="wp-context-caption">{{ selectedWorker.position }}</span>
          </template>
          <template v-if="activeModule">
            <q-icon name="chevron_right" size="16px" class="text-grey-5" />
            <q-icon :name="activeModule.icon || 'apps'" size="16px" class="text-indigo-5" />
            <span class="wp-context-label">{{ activeModule.name }}</span>
            <q-chip v-if="permissionsCount(activeModule.id) > 0" dense color="indigo-1" text-color="indigo-8" size="xs">
              {{ permissionsCount(activeModule.id) }}/{{ activeModule.actions.length }} acciones
            </q-chip>
          </template>
          <q-space />
          <q-btn
            v-if="totalGrantedCount > 0"
            flat dense no-caps size="sm"
            color="negative"
            icon="remove_circle_outline"
            label="Revocar todo"
            @click="handleRevokeAll"
            class="wp-revoke-btn"
          />
        </div>
      </div>

      <!-- ====== CUATRO COLUMNAS ====== -->
      <div class="row q-col-gutter-md wp-grid">

        <!-- =============== COL 1: BUSCADOR + TRABAJADOR =============== -->
        <div class="col-12 col-md-3">
          <q-card flat bordered class="permission-card wp-col">
            <q-card-section class="q-pb-sm">
              <div class="row items-center justify-between q-mb-xs">
                <div class="wp-step-label">Paso 1</div>
                <q-chip
                  v-if="checkedWorkers.length > 0"
                  dense color="indigo-1" text-color="indigo-8"
                  size="xs" class="wp-checked-badge"
                >
                  <q-icon name="check" size="10px" class="q-mr-xs" />
                  {{ checkedWorkers.length }} marcado{{ checkedWorkers.length === 1 ? '' : 's' }}
                </q-chip>
              </div>
              <div class="wp-col-title">Colaborador</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <!-- Botón para cargar todos los colaboradores -->
              <div v-if="!searchTerm && workers.length === 0 && !selectedWorker" class="q-mb-sm">
                <q-btn
                  outline
                  color="primary"
                  icon="people"
                  label="Ver todos los colaboradores"
                  class="full-width"
                  :loading="isLoadingWorkers"
                  @click="handleLoadAllColaboradores"
                />
              </div>

              <!-- Input de búsqueda con debounce 400ms (watch searchTerm) -->
              <q-input
                v-model="searchTerm"
                outlined
                dense
                placeholder="Buscar por nombre, código o documento..."
                clearable
                ref="searchInput"
                @clear="onSearchCleared"
              >
                <template v-slot:prepend>
                  <q-icon name="search" class="text-grey-6" />
                </template>
                <template v-slot:append>
                  <q-spinner v-if="isLoadingWorkers" color="primary" size="18px" />
                </template>
              </q-input>

              <!-- Lista de colaboradores (todos o filtrados) -->
              <div
                v-if="workers.length > 0 && !selectedWorker"
                class="wp-results q-mt-sm"
              >
                <!-- Header con checkbox "Seleccionar todos" + contador -->
                <div class="row items-center justify-between q-px-sm q-py-xs bg-grey-2">
                  <div class="row items-center q-gutter-xs">
                    <q-checkbox
                      :value="allWorkersChecked"
                      :indeterminate="someWorkersChecked && !allWorkersChecked"
                      color="primary"
                      dense
                      @input="handleToggleAllWorkers"
                    />
                    <span class="text-caption text-grey-7 text-weight-medium">
                      {{ workers.length }} colaborador{{ workers.length === 1 ? '' : 'es' }}
                    </span>
                  </div>
                  <q-badge
                    v-if="checkedWorkers.length > 0"
                    color="primary"
                    rounded
                  >
                    {{ checkedWorkers.length }}/{{ workers.length }}
                  </q-badge>
                </div>

                <q-list separator>
                  <q-item
                    v-for="w in workers"
                    :key="w.id"
                    clickable
                    v-ripple
                    :class="{ 'wp-worker-checked': isWorkerChecked(w.id) }"
                    @click="handleSelectWorker(w)"
                  >
                    <!-- Checkbox por ítem -->
                    <q-item-section avatar>
                      <q-checkbox
                        :value="isWorkerChecked(w.id)"
                        color="primary"
                        dense
                        @input="handleToggleWorkerCheck(w.id)"
                        @click.native.stop
                      />
                    </q-item-section>

                    <q-item-section avatar>
                      <q-avatar color="primary" text-color="white" icon="person" size="32px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2 text-weight-medium">
                        {{ w.fullName }}
                      </q-item-label>
                      <q-item-label caption>
                        <span class="text-weight-medium">{{ w.code }}</span>
                        <span v-if="w.position"> · {{ w.position }}</span>
                      </q-item-label>
                      <q-item-label v-if="w.department" caption class="text-grey-6">
                        <q-icon name="business" size="12px" class="q-mr-xs" />
                        {{ w.department }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="chevron_right" color="grey-5" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <!-- Mensaje "sin resultados" -->
              <div
                v-if="(searchTerm || workersLoadedOnce) && !isLoadingWorkers && workers.length === 0 && !selectedWorker"
                class="text-caption text-grey-6 q-mt-md text-center q-pa-md"
              >
                <q-icon name="search_off" size="32px" class="text-grey-4 q-mb-xs" /><br>
                No se encontraron colaboradores<br>
                <span class="text-grey-5">Intenta con otro término de búsqueda</span>
              </div>
            </q-card-section>

            <q-separator v-if="selectedWorker" />

            <!-- Card del trabajador seleccionado -->
            <q-card-section v-if="selectedWorker" class="wp-selected-card">
              <div class="row items-center no-wrap q-gutter-sm">
                <q-avatar color="primary" text-color="white" icon="person" size="48px" />
                <div class="col">
                  <div class="text-body1 text-weight-medium text-dark wp-truncate">
                    {{ selectedWorker.fullName }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ selectedWorker.position || 'Sin cargo' }}
                  </div>
                  <div class="text-caption text-grey-6">
                    {{ selectedWorker.department || '—' }}
                  </div>
                </div>
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  color="grey-7"
                  size="sm"
                  @click="handleClearSelection"
                >
                  <q-tooltip>Limpiar selección</q-tooltip>
                </q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- =============== COL 2: MÓDULOS DEL SISTEMA =============== -->
        <div class="col-12 col-md-3">
          <q-card flat bordered class="permission-card wp-col">
            <q-card-section class="q-pb-sm">
              <div class="row items-center justify-between q-mb-xs">
                <div class="wp-step-label">Paso 2</div>
                <q-chip
                  v-if="checkedModuleId !== null"
                  dense color="teal-1" text-color="teal-9"
                  size="xs" class="wp-checked-badge"
                >
                  <q-icon name="view_list" size="10px" class="q-mr-xs" />
                  Ver Paso 3
                </q-chip>
              </div>
              <div class="wp-col-title">Módulo del sistema</div>
              <div class="text-caption text-grey-5 q-mt-xs">
                {{ modules.length }} módulos disponibles
              </div>
            </q-card-section>

            <q-separator />

            <!-- Lista de módulos organizada por secciones (igual que MainLayout.vue) -->
            <q-scroll-area
              style="height: 420px;"
              :thumb-style="{ background: '#94A3B8', width: '6px', opacity: 0.6 }"
              class="wp-module-list"
            >
              <!-- Sin trabajador: mostrar lista con checkboxes visuales independientes -->
              <template v-if="!selectedWorker">
                <div class="q-pa-md text-center">
                  <q-icon name="menu_open" size="48px" class="text-grey-4" />
                  <p class="text-body2 text-grey-6 q-mt-sm q-mb-none">
                    Marca los módulos que deseas revisar:
                  </p>
                </div>

                <!-- Sección: Gestión General -->
                <q-item-label header class="sidebar-section q-px-md q-py-sm">
                  Gestión General
                </q-item-label>
                <q-list dense>
                  <q-item
                    v-for="mod in gestionGeneralModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    @click="handleToggleModuleCheck(mod.id)"
                    class="q-px-md"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="primary"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-6" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2">{{ mod.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Sección: Abastecimiento -->
                <q-item-label header class="sidebar-section q-px-md q-py-sm">
                  Abastecimiento
                </q-item-label>
                <q-list dense>
                  <q-item
                    v-for="mod in abastecimientoModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    @click="handleToggleModuleCheck(mod.id)"
                    class="q-px-md"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="primary"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-6" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2">{{ mod.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Sección: Talento Humano -->
                <q-item-label header class="sidebar-section q-px-md q-py-sm">
                  Talento Humano
                </q-item-label>
                <q-list dense>
                  <q-item
                    v-for="mod in talentoHumanoModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    @click="handleToggleModuleCheck(mod.id)"
                    class="q-px-md"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="primary"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-6" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2">{{ mod.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Sección: Sistema -->
                <q-item-label header class="sidebar-section q-px-md q-py-sm">
                  Sistema
                </q-item-label>
                <q-list dense>
                  <q-item
                    v-for="mod in sistemaModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    @click="handleToggleModuleCheck(mod.id)"
                    class="q-px-md"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="primary"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-6" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2">{{ mod.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>

              <!-- Con trabajador seleccionado: mostrar checkboxes interactivos -->
              <template v-else>
                <!-- Sección: Gestión General -->
                <div class="row items-center justify-between q-px-md q-py-sm bg-grey-2">
                  <div class="row items-center q-gutter-sm">
                    <q-checkbox
                      :value="gestionGeneralAllSelected"
                      :indeterminate="gestionGeneralPartialSelected"
                      color="primary"
                      dense
                      @input="(val) => handleSelectAllSection('gestionGeneral', val)"
                    />
                    <span class="sidebar-section q-ml-xs">Gestión General</span>
                  </div>
                  <q-badge color="primary" rounded>
                    {{ gestionGeneralSelectedCount }}/{{ gestionGeneralModules.length }}
                  </q-badge>
                </div>
                <q-list dense>
                  <q-item
                    v-for="mod in gestionGeneralModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    :active="mod.id === activeModuleId"
                    active-class="wp-module-active"
                    @click="setActiveModule(mod.id)"
                    class="wp-module-item"
                    :class="{ 'wp-module-subitem-selected': isModuleChecked(mod.id) }"
                  >
                    <q-tooltip anchor="center right" self="center left" max-width="200px">
                      {{ mod.description }}
                    </q-tooltip>
                    <q-item-section avatar>
                      <q-checkbox
                        :value="moduleHasAll(mod.id)"
                        :indeterminate="moduleHasAny(mod.id) && !moduleHasAll(mod.id)"
                        color="primary"
                        @input="(val) => handleModuleToggle(mod.id, val)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2 text-weight-medium">{{ mod.name }}</q-item-label>
                      <q-item-label caption>{{ permissionsCount(mod.id) }}/{{ mod.actions.length }} acciones</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="teal"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">Ver sub-ítems en Paso 3</q-tooltip>
                      </q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Sección: Abastecimiento -->
                <div class="row items-center justify-between q-px-md q-py-sm bg-grey-2">
                  <div class="row items-center q-gutter-sm">
                    <q-checkbox
                      :value="abastecimientoAllSelected"
                      :indeterminate="abastecimientoPartialSelected"
                      color="primary"
                      dense
                      @input="(val) => handleSelectAllSection('abastecimiento', val)"
                    />
                    <span class="sidebar-section q-ml-xs">Abastecimiento</span>
                  </div>
                  <q-badge color="primary" rounded>
                    {{ abastecimientoSelectedCount }}/{{ abastecimientoModules.length }}
                  </q-badge>
                </div>
                <q-list dense>
                  <q-item
                    v-for="mod in abastecimientoModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    :active="mod.id === activeModuleId"
                    active-class="wp-module-active"
                    @click="setActiveModule(mod.id)"
                    class="wp-module-item"
                    :class="{ 'wp-module-subitem-selected': isModuleChecked(mod.id) }"
                  >
                    <q-tooltip anchor="center right" self="center left" max-width="200px">
                      {{ mod.description }}
                    </q-tooltip>
                    <q-item-section avatar>
                      <q-checkbox
                        :value="moduleHasAll(mod.id)"
                        :indeterminate="moduleHasAny(mod.id) && !moduleHasAll(mod.id)"
                        color="primary"
                        @input="(val) => handleModuleToggle(mod.id, val)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2 text-weight-medium">{{ mod.name }}</q-item-label>
                      <q-item-label caption>{{ permissionsCount(mod.id) }}/{{ mod.actions.length }} acciones</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="teal"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">Ver sub-ítems en Paso 3</q-tooltip>
                      </q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Sección: Talento Humano -->
                <div class="row items-center justify-between q-px-md q-py-sm bg-grey-2">
                  <div class="row items-center q-gutter-sm">
                    <q-checkbox
                      :value="talentoHumanoAllSelected"
                      :indeterminate="talentoHumanoPartialSelected"
                      color="primary"
                      dense
                      @input="(val) => handleSelectAllSection('talentoHumano', val)"
                    />
                    <span class="sidebar-section q-ml-xs">Talento Humano</span>
                  </div>
                  <q-badge color="primary" rounded>
                    {{ talentoHumanoSelectedCount }}/{{ talentoHumanoModules.length }}
                  </q-badge>
                </div>
                <q-list dense>
                  <q-item
                    v-for="mod in talentoHumanoModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    :active="mod.id === activeModuleId"
                    active-class="wp-module-active"
                    @click="setActiveModule(mod.id)"
                    class="wp-module-item"
                    :class="{ 'wp-module-subitem-selected': isModuleChecked(mod.id) }"
                  >
                    <q-tooltip anchor="center right" self="center left" max-width="200px">
                      {{ mod.description }}
                    </q-tooltip>
                    <q-item-section avatar>
                      <q-checkbox
                        :value="moduleHasAll(mod.id)"
                        :indeterminate="moduleHasAny(mod.id) && !moduleHasAll(mod.id)"
                        color="primary"
                        @input="(val) => handleModuleToggle(mod.id, val)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2 text-weight-medium">{{ mod.name }}</q-item-label>
                      <q-item-label caption>{{ permissionsCount(mod.id) }}/{{ mod.actions.length }} acciones</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="teal"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">Ver sub-ítems en Paso 3</q-tooltip>
                      </q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-list>

                <!-- Sección: Sistema -->
                <div class="row items-center justify-between q-px-md q-py-sm bg-grey-2">
                  <div class="row items-center q-gutter-sm">
                    <q-checkbox
                      :value="sistemaAllSelected"
                      :indeterminate="sistemaPartialSelected"
                      color="primary"
                      dense
                      @input="(val) => handleSelectAllSection('sistema', val)"
                    />
                    <span class="sidebar-section q-ml-xs">Sistema</span>
                  </div>
                  <q-badge color="primary" rounded>
                    {{ sistemaSelectedCount }}/{{ sistemaModules.length }}
                  </q-badge>
                </div>
                <q-list dense>
                  <q-item
                    v-for="mod in sistemaModules"
                    :key="mod.id"
                    clickable
                    v-ripple
                    :active="mod.id === activeModuleId"
                    active-class="wp-module-active"
                    @click="setActiveModule(mod.id)"
                    class="wp-module-item"
                    :class="{ 'wp-module-subitem-selected': isModuleChecked(mod.id) }"
                  >
                    <q-tooltip anchor="center right" self="center left" max-width="200px">
                      {{ mod.description }}
                    </q-tooltip>
                    <q-item-section avatar>
                      <q-checkbox
                        :value="moduleHasAll(mod.id)"
                        :indeterminate="moduleHasAny(mod.id) && !moduleHasAll(mod.id)"
                        color="primary"
                        @input="(val) => handleModuleToggle(mod.id, val)"
                        @click.native.stop
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="mod.icon" size="18px" class="text-grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2 text-weight-medium">{{ mod.name }}</q-item-label>
                      <q-item-label caption>{{ permissionsCount(mod.id) }}/{{ mod.actions.length }} acciones</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-checkbox
                        :value="isModuleChecked(mod.id)"
                        color="teal"
                        dense
                        @input="handleToggleModuleCheck(mod.id)"
                        @click.native.stop
                      >
                        <q-tooltip anchor="top middle" self="bottom middle">Ver sub-ítems en Paso 3</q-tooltip>
                      </q-checkbox>
                    </q-item-section>
                  </q-item>
                </q-list>
              </template>
            </q-scroll-area>
          </q-card>
        </div>

        <!-- =============== COL 3: SUB-ÍTEMS DEL MÓDULO ACTIVO =============== -->
        <div class="col-12 col-md-3">
          <q-card flat bordered class="permission-card wp-col">
            <q-card-section class="q-pb-sm">
              <div class="row items-center justify-between q-mb-xs">
                <div class="wp-step-label">Paso 3</div>
                <q-chip
                  v-if="subItemModule && subItemModule.subItems && subItemModule.subItems.length"
                  dense color="teal-1" text-color="teal-9" size="xs"
                >
                  {{ checkedSubItemIds.length }}/{{ subItemModule.subItems.length }}
                </q-chip>
              </div>
              <div class="wp-col-title">Vistas del módulo</div>
            </q-card-section>

            <q-separator />

            <!-- Estado vacío: ningún módulo marcado con checkbox teal en Paso 2 -->
            <q-card-section v-if="!subItemModule" class="wp-empty">
              <q-icon name="view_list" size="48px" class="text-grey-4" />
              <p class="text-body2 text-grey-6 q-mt-sm text-center q-px-sm">
                Marca un módulo del Paso 2 usando el checkbox
                <q-chip dense color="teal" text-color="white" size="sm" class="q-mx-xs">
                  <q-icon name="check" size="12px" />
                </q-chip>
                de la derecha para ver sus vistas aquí
              </p>
            </q-card-section>

            <!-- Sin sub-ítems: mensaje personalizado con el módulo seleccionado -->
            <q-card-section
              v-else-if="!subItemModule.subItems || subItemModule.subItems.length === 0"
              class="wp-empty-module"
            >
              <div class="wp-no-subitems-card q-pa-md">
                <div class="row justify-center q-mb-sm">
                  <q-avatar size="56px" color="blue-grey-1" text-color="blue-grey-5">
                    <q-icon :name="subItemModule.icon || 'apps'" size="28px" />
                  </q-avatar>
                </div>
                <p class="text-subtitle2 text-weight-bold text-blue-grey-7 text-center q-mb-xs">
                  {{ subItemModule.name }}
                </p>
                <p class="text-caption text-grey-6 text-center q-mb-sm">
                  Este módulo es una vista directa del sistema.
                  No cuenta con sub-páginas registradas en el enrutador.
                </p>
                <q-separator class="q-my-sm" />
                <div class="row items-start q-gutter-xs q-mt-xs">
                  <q-icon name="info" size="14px" color="blue-grey-4" class="q-mt-xs" />
                  <span class="text-caption text-blue-grey-5" style="flex:1;">
                    Para ver acciones de este módulo, haz clic sobre él en Paso 2
                    y configúralas en Paso 4.
                  </span>
                </div>
              </div>
            </q-card-section>

            <!-- Lista de sub-ítems con checkbox -->
            <template v-else>
              <q-card-section class="q-py-sm wp-active-header">
                <div class="row items-center q-gutter-sm">
                  <q-icon :name="subItemModule.icon || 'apps'" size="20px" color="teal" />
                  <span class="text-body2 text-weight-medium text-dark">
                    {{ subItemModule.name }}
                  </span>
                </div>
              </q-card-section>
              <q-separator />
              <q-scroll-area
                style="height: 320px;"
                :thumb-style="{ background: '#94A3B8', width: '6px', opacity: 0.6 }"
              >
                <q-list dense class="q-pa-sm">
                  <q-item
                    v-for="sub in subItemModule.subItems"
                    :key="sub.id"
                    tag="label"
                    clickable
                    v-ripple
                    class="wp-subitem-item q-py-xs"
                    :class="{ 'wp-subitem-checked': isSubItemChecked(sub.id) }"
                  >
                    <q-item-section avatar>
                      <q-checkbox
                        :value="isSubItemChecked(sub.id)"
                        color="teal"
                        dense
                        @input="handleToggleSubItem(sub.id)"
                      />
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon :name="sub.icon" size="16px" class="text-grey-7" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-body2 text-grey-8">{{ sub.title }}</q-item-label>
                      <q-item-label caption class="text-grey-5">{{ sub.link }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </template>
          </q-card>
        </div>

        <!-- =============== COL 4: ACCIONES DEL MÓDULO ACTIVO =============== -->
        <div class="col-12 col-md-3">
          <q-card flat bordered class="permission-card wp-col" :class="{ 'wp-col-active': !!activeModule && !!selectedWorker }">
            <q-card-section class="q-pb-sm">
              <div class="wp-step-label">Paso 4</div>
              <div class="wp-col-title">Permisos</div>
              <div v-if="!activeModule || !selectedWorker" class="text-caption text-grey-5 q-mt-xs">
                Selecciona un módulo en Paso 2
              </div>
            </q-card-section>

            <q-separator />

            <!-- Estado vacío -->
            <q-card-section v-if="!selectedWorker || !activeModule" class="wp-empty">
              <q-icon name="lock_open" size="44px" class="text-grey-3" />
              <p class="wp-empty-text q-mt-sm">
                Haz clic en un módulo del Paso 2 para configurar sus acciones
              </p>
            </q-card-section>

            <!-- Acciones agrupadas por categoría -->
            <template v-else>
              <q-card-section class="q-py-sm wp-active-header">
                <div class="row items-center q-gutter-xs">
                  <q-icon :name="activeModule.icon || 'apps'" size="18px" color="indigo-6" />
                  <span class="wp-active-module-name">{{ activeModule.name }}</span>
                  <q-space />
                  <span class="wp-permission-count">
                    {{ permissionsCount(activeModule.id) }}/{{ activeModule.actions.length }}
                  </span>
                </div>
              </q-card-section>
              <q-separator />

              <q-scroll-area
                style="height: 340px;"
                :thumb-style="{ background: '#C7D2FE', width: '4px', opacity: 0.7 }"
              >
                <div class="q-pa-sm">
                  <!-- Grupo de acciones -->
                  <div
                    v-for="group in groupedActions"
                    :key="group.key"
                    class="wp-action-group q-mb-sm"
                  >
                    <div class="wp-action-group-label">
                      <q-icon :name="group.icon" size="13px" class="q-mr-xs" />
                      {{ group.label }}
                    </div>
                    <div
                      v-for="action in group.actions"
                      :key="action.id"
                      class="wp-action-row"
                      :class="{
                        'wp-action-granted': grantedActionIds.indexOf(action.id) !== -1,
                        'wp-action-critical': isCriticalAction(action.code)
                      }"
                      @click="toggleAction(action.id)"
                    >
                      <div class="row items-center no-wrap">
                        <q-checkbox
                          :value="grantedActionIds.indexOf(action.id) !== -1"
                          :color="isCriticalAction(action.code) ? 'deep-orange' : 'indigo'"
                          dense
                          @input="toggleAction(action.id)"
                          @click.native.stop
                          class="wp-action-cb"
                        />
                        <span class="wp-action-label q-ml-xs">{{ action.label }}</span>
                        <q-icon
                          v-if="isCriticalAction(action.code)"
                          name="warning_amber"
                          size="13px"
                          color="deep-orange-4"
                          class="q-ml-xs"
                        >
                          <q-tooltip>Acción de alto impacto</q-tooltip>
                        </q-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </q-scroll-area>
            </template>
          </q-card>
        </div>
      </div>

      <!-- ====== BARRA INFERIOR STICKY ====== -->
      <div class="wp-footer-sticky q-mt-lg">
        <div class="row items-center">
          <div class="col">
            <div v-if="selectedWorker" class="row items-center q-gutter-xs">
              <q-icon name="edit_note" size="16px" class="text-grey-5" />
              <span class="wp-footer-text">
                Configurando permisos para
                <strong class="text-grey-9">{{ selectedWorker.fullName }}</strong>
              </span>
              <q-chip v-if="totalGrantedCount > 0" dense color="indigo-1" text-color="indigo-8" size="xs">
                {{ totalGrantedCount }} activos
              </q-chip>
            </div>
            <div v-else class="wp-footer-text text-grey-5">
              <q-icon name="info_outline" size="14px" class="q-mr-xs" />
              Selecciona un colaborador en el Paso 1 para comenzar
            </div>
          </div>
          <div class="col-auto row q-gutter-sm">
            <q-btn
              flat no-caps
              color="grey-6"
              label="Cancelar"
              :disable="isSaving"
              @click="handleCancel"
              class="wp-btn-cancel"
            />
            <q-btn
              unelevated no-caps
              color="indigo-6"
              icon="save"
              :label="isSaving ? 'Guardando...' : 'Guardar permisos'"
              :loading="isSaving"
              :disable="!selectedWorker"
              @click="handleSave"
              class="wp-btn-save"
            />
          </div>
        </div>
      </div>

      <!-- Banner de error global -->
      <q-banner
        v-if="error"
        class="bg-red-1 text-red-9 q-mt-md"
        rounded
      >
        <template v-slot:avatar>
          <q-icon name="error" color="negative" />
        </template>
        {{ error }}
        <template v-slot:action>
          <q-btn flat dense rounded icon="close" @click="clearError" />
        </template>
      </q-banner>

    </div>
  </q-page>
</template>

<script>
import { usePermissionStore } from 'src/stores/permissionStore';

export default {
  name: 'WorkerPermissionsView',

  data () {
    return {
      // Término de búsqueda controlado por el usuario.
      // El watcher aplica debounce de 400ms antes de pegar al backend.
      searchTerm: '',
      // Timer interno para el debounce
      searchDebounce: null,
      // Bandera para indicar si se ha cargado la lista al menos una vez
      workersLoadedOnce: false,
      // IDs de los colaboradores marcados con checkbox (selección múltiple visual)
      checkedWorkerIds: [],
      // ID del módulo seleccionado con checkbox en Paso 2 → impulsa Paso 3 (sub-ítems)
      checkedModuleId: null,
      // IDs de los sub-ítems marcados en Paso 3
      checkedSubItemIds: []
    };
  },

  computed: {
    // Acceso a state/getters del store de Pinia desde Options API.
    // El plugin @pinia/vue2 hace reactivos los campos del store.
    store () {
      return usePermissionStore();
    },
    workers () { return this.store.workers; },
    modules () { return this.store.modules; },
    selectedWorker () { return this.store.selectedWorker; },
    activeModuleId () { return this.store.activeModuleId; },
    grantedActionIds () { return this.store.grantedActionIds; },
    isLoadingWorkers () { return this.store.isLoadingWorkers; },
    isSaving () { return this.store.isSaving; },
    error () { return this.store.error; },
    totalGrantedCount () { return this.store.totalGrantedCount; },
    activeModule () { return this.store.actionsOfActiveModule; },

    // Módulo cuyo checkbox está marcado en Paso 2 → impulsa Paso 3
    subItemModule () {
      if (this.checkedModuleId === null) return null;
      return this.modules.find(function (m) { return m.id === this.checkedModuleId; }, this) || null;
    },

    // Acciones del módulo activo agrupadas por categoría UX (Paso 4)
    groupedActions () {
      if (!this.activeModule || !this.activeModule.actions) return [];
      var actions = this.activeModule.actions;
      var groups = [
        { key: 'acceso', label: 'Acceso', icon: 'visibility', codes: ['READ'] },
        { key: 'gestion', label: 'Gestión', icon: 'edit_note', codes: ['CREATE', 'UPDATE', 'DELETE'] },
        { key: 'control', label: 'Control', icon: 'security', codes: ['VALIDATE', 'AUTHORIZE'] }
      ];
      var result = [];
      groups.forEach(function (g) {
        var groupActions = actions.filter(function (a) { return g.codes.indexOf(a.code) !== -1; });
        if (groupActions.length > 0) {
          result.push({ key: g.key, label: g.label, icon: g.icon, actions: groupActions });
        }
      });
      // Acciones sin grupo clasificado aparecen en sección "Otros"
      var classifiedCodes = ['READ', 'CREATE', 'UPDATE', 'DELETE', 'VALIDATE', 'AUTHORIZE'];
      var others = actions.filter(function (a) { return classifiedCodes.indexOf(a.code) === -1; });
      if (others.length > 0) {
        result.push({ key: 'otros', label: 'Otros', icon: 'more_horiz', actions: others });
      }
      return result;
    },

    // ---------- Selección múltiple de colaboradores (Paso 1) ----------
    // Lista de colaboradores actualmente marcados con checkbox
    checkedWorkers () {
      return this.workers.filter(w => this.checkedWorkerIds.indexOf(w.id) !== -1);
    },
    // ¿Están marcados TODOS los colaboradores visibles?
    allWorkersChecked () {
      return this.workers.length > 0 &&
        this.workers.every(w => this.checkedWorkerIds.indexOf(w.id) !== -1);
    },
    // ¿Hay al menos uno marcado (para estado indeterminado)?
    someWorkersChecked () {
      return this.workers.some(w => this.checkedWorkerIds.indexOf(w.id) !== -1);
    },

    // ---------- Filtros por sección (coinciden con MainLayout.vue) ----------
    // Sección: Gestión General (Inicio, Encuestas, Municipios, Comunidades, Viviendas, JAC, Icos, Planes de Trabajo)
    gestionGeneralModules () {
      return this.modules.filter(m =>
        ['INICIO', 'ENCUESTAS', 'MUNICIPIOS', 'COMUNIDADES', 'VIVIENDAS', 'JAC', 'ICOS', 'PLANES_TRABAJO'].includes(m.code)
      );
    },
    // Sección: Abastecimiento
    abastecimientoModules () {
      return this.modules.filter(m => m.code === 'ABASTECIMIENTO');
    },
    // Sección: Talento Humano
    talentoHumanoModules () {
      return this.modules.filter(m => m.code === 'TALENTO_HUMANO');
    },
    // Sección: Sistema (Parametrización, Reportes)
    sistemaModules () {
      return this.modules.filter(m =>
        ['PARAMETRIZACION', 'REPORTES'].includes(m.code)
      );
    },

    // ---------- Contadores y estados por sección ----------
    // Gestión General
    gestionGeneralSelectedCount () {
      return this.gestionGeneralModules.filter(m => this.moduleHasAny(m.id)).length;
    },
    gestionGeneralAllSelected () {
      return this.gestionGeneralModules.length > 0 &&
        this.gestionGeneralModules.every(m => this.moduleHasAll(m.id));
    },
    gestionGeneralPartialSelected () {
      const any = this.gestionGeneralModules.some(m => this.moduleHasAny(m.id));
      const all = this.gestionGeneralModules.every(m => this.moduleHasAll(m.id));
      return any && !all;
    },
    // Abastecimiento
    abastecimientoSelectedCount () {
      return this.abastecimientoModules.filter(m => this.moduleHasAny(m.id)).length;
    },
    abastecimientoAllSelected () {
      return this.abastecimientoModules.length > 0 &&
        this.abastecimientoModules.every(m => this.moduleHasAll(m.id));
    },
    abastecimientoPartialSelected () {
      const any = this.abastecimientoModules.some(m => this.moduleHasAny(m.id));
      const all = this.abastecimientoModules.every(m => this.moduleHasAll(m.id));
      return any && !all;
    },
    // Talento Humano
    talentoHumanoSelectedCount () {
      return this.talentoHumanoModules.filter(m => this.moduleHasAny(m.id)).length;
    },
    talentoHumanoAllSelected () {
      return this.talentoHumanoModules.length > 0 &&
        this.talentoHumanoModules.every(m => this.moduleHasAll(m.id));
    },
    talentoHumanoPartialSelected () {
      const any = this.talentoHumanoModules.some(m => this.moduleHasAny(m.id));
      const all = this.talentoHumanoModules.every(m => this.moduleHasAll(m.id));
      return any && !all;
    },
    // Sistema
    sistemaSelectedCount () {
      return this.sistemaModules.filter(m => this.moduleHasAny(m.id)).length;
    },
    sistemaAllSelected () {
      return this.sistemaModules.length > 0 &&
        this.sistemaModules.every(m => this.moduleHasAll(m.id));
    },
    sistemaPartialSelected () {
      const any = this.sistemaModules.some(m => this.moduleHasAny(m.id));
      const all = this.sistemaModules.every(m => this.moduleHasAll(m.id));
      return any && !all;
    }
  },

  watch: {
    // Debounce de 400ms sobre el término de búsqueda.
    // Si el usuario ya tiene un trabajador seleccionado, no relanzamos búsqueda.
    searchTerm (newVal) {
      if (this.searchDebounce) clearTimeout(this.searchDebounce);
      if (this.selectedWorker) return;
      if (!newVal || !newVal.trim()) {
        this.store.workers = [];
        return;
      }
      this.searchDebounce = setTimeout(() => {
        this.store.searchWorkers(newVal);
      }, 400);
    }
  },

  mounted () {
    // Al montar la vista cargamos los módulos disponibles del sistema.
    this.store.fetchModules();
  },

  beforeDestroy () {
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
  },

  methods: {
    // ---------- Getters auxiliares pasados a template ----------
    // Evitamos llamar a `store.moduleHas...` directamente en el template
    // porque algunos motores de Vue 2 + Pinia no detectan reactividad
    // sobre getters factory; aquí lo envolvemos.
    moduleHasAny (moduleId) {
      return this.store.moduleHasAnyPermission(moduleId);
    },
    moduleHasAll (moduleId) {
      return this.store.moduleHasAllPermissions(moduleId);
    },
    permissionsCount (moduleId) {
      const mod = this.modules.find((m) => m.id === moduleId);
      if (!mod || !mod.actions) return 0;
      let count = 0;
      mod.actions.forEach((a) => {
        if (this.grantedActionIds.indexOf(a.id) !== -1) count++;
      });
      return count;
    },

    // ---------- Carga y selección de colaboradores ----------
    async handleLoadAllColaboradores () {
      this.workersLoadedOnce = true;
      this.checkedWorkerIds = [];
      await this.store.searchWorkers('');
    },

    async handleSelectWorker (worker) {
      this.searchTerm = '';
      this.workersLoadedOnce = false;
      this.checkedWorkerIds = [];
      this.checkedModuleId = null;
      this.checkedSubItemIds = [];
      await this.store.selectWorker(worker);
    },

    handleClearSelection () {
      this.store.clearSelection();
      this.searchTerm = '';
      this.workersLoadedOnce = false;
      this.checkedWorkerIds = [];
      this.checkedModuleId = null;
      this.checkedSubItemIds = [];
    },

    onSearchCleared () {
      this.store.workers = [];
      this.workersLoadedOnce = false;
      this.checkedWorkerIds = [];
    },

    // ---------- Selección múltiple con checkboxes (Paso 1) ----------
    isWorkerChecked (workerId) {
      return this.checkedWorkerIds.indexOf(workerId) !== -1;
    },

    handleToggleWorkerCheck (workerId) {
      const idx = this.checkedWorkerIds.indexOf(workerId);
      if (idx === -1) {
        this.checkedWorkerIds.push(workerId);
      } else {
        this.checkedWorkerIds.splice(idx, 1);
      }
    },

    handleToggleAllWorkers (val) {
      const checked = val === null ? true : !!val;
      if (checked) {
        this.checkedWorkerIds = this.workers.map(w => w.id);
      } else {
        this.checkedWorkerIds = [];
      }
    },

    // ---------- Checkbox de módulo en Paso 2 → controla Paso 3 (sub-ítems) ----------
    // Selección tipo radio: marcar uno desmarca el anterior
    isModuleChecked (moduleId) {
      return this.checkedModuleId === moduleId;
    },

    handleToggleModuleCheck (moduleId) {
      if (this.checkedModuleId === moduleId) {
        this.checkedModuleId = null;
      } else {
        this.checkedModuleId = moduleId;
      }
      // Limpiar sub-ítems marcados al cambiar de módulo
      this.checkedSubItemIds = [];
    },

    // ---------- Checkbox visual de sub-ítems (Paso 3) ----------
    isSubItemChecked (subItemId) {
      return this.checkedSubItemIds.indexOf(subItemId) !== -1;
    },

    handleToggleSubItem (subItemId) {
      var idx = this.checkedSubItemIds.indexOf(subItemId);
      if (idx === -1) {
        this.checkedSubItemIds.push(subItemId);
      } else {
        this.checkedSubItemIds.splice(idx, 1);
      }
    },

    // ---------- Manipulación de módulos y acciones ----------
    setActiveModule (moduleId) {
      this.store.setActiveModule(moduleId);
      // Limpiar selección de sub-ítems al cambiar de módulo
      this.checkedSubItemIds = [];
    },

    toggleAction (actionId) {
      this.store.toggleAction(actionId);
    },

    // Vue 2 QCheckbox en modo indeterminado puede emitir `null`.
    // Lo tratamos como un click que pasa de "indeterminado" a "todo marcado".
    handleModuleToggle (moduleId, val) {
      const checked = val === null ? true : !!val;
      this.store.toggleModule(moduleId, checked);
    },

    // ---------- Selección masiva por sección ----------
    handleSelectAllSection (sectionName, val) {
      const checked = val === null ? true : !!val;
      let modulesInSection = [];
      switch (sectionName) {
        case 'gestionGeneral':
          modulesInSection = this.gestionGeneralModules;
          break;
        case 'abastecimiento':
          modulesInSection = this.abastecimientoModules;
          break;
        case 'talentoHumano':
          modulesInSection = this.talentoHumanoModules;
          break;
        case 'sistema':
          modulesInSection = this.sistemaModules;
          break;
      }
      modulesInSection.forEach(mod => {
        this.store.toggleModule(mod.id, checked);
      });
    },

    // ---------- Botones inferiores ----------
    handleCancel () {
      this.handleClearSelection();
    },

    async handleSave () {
      // Validación visible: requiere un trabajador seleccionado.
      if (!this.selectedWorker) {
        this.$q.notify({
          type: 'warning',
          message: 'Selecciona un trabajador antes de guardar',
          position: 'top-right'
        });
        return;
      }

      // UX: si se intenta guardar sin permisos marcados, confirmar revocación total.
      if (this.grantedActionIds.length === 0) {
        const confirmed = await this.confirmRevokeAll();
        if (!confirmed) return;
      }

      try {
        const result = await this.store.savePermissions();
        const total = (result && result.totalGranted !== undefined)
          ? result.totalGranted
          : this.grantedActionIds.length;
        this.$q.notify({
          type: 'positive',
          message: 'Permisos guardados correctamente (' + total + ' activos)',
          position: 'top-right',
          icon: 'check_circle',
          timeout: 2500
        });
      } catch (err) {
        let msg = 'No se pudieron guardar los permisos';
        if (err && err.response && err.response.data) {
          if (err.response.data.error) msg = err.response.data.error;
          else if (err.response.data.errors && err.response.data.errors.actionIds) {
            msg = err.response.data.errors.actionIds;
          }
        }
        this.$q.notify({
          type: 'negative',
          message: msg,
          position: 'top-right',
          icon: 'error'
        });
      }
    },

    confirmRevokeAll () {
      const name = this.selectedWorker ? this.selectedWorker.fullName : 'este trabajador';
      return new Promise((resolve) => {
        this.$q.dialog({
          title: 'Revocar todos los permisos',
          message: '¿Confirmas revocar todos los permisos de <strong>' + name + '</strong>? El usuario perderá acceso a todos los módulos.',
          html: true,
          ok: { label: 'Revocar', color: 'negative', unelevated: true, rounded: true },
          cancel: { label: 'Cancelar', flat: true, color: 'grey-7' },
          persistent: true
        })
          .onOk(() => resolve(true))
          .onCancel(() => resolve(false))
          .onDismiss(() => resolve(false));
      });
    },

    clearError () {
      this.store.error = null;
    },

    // Identifica permisos de alto impacto que merecen aviso visual
    isCriticalAction (code) {
      return code === 'DELETE' || code === 'AUTHORIZE';
    },

    async handleRevokeAll () {
      if (!this.selectedWorker) return;
      const name = this.selectedWorker.fullName;
      const confirmed = await new Promise((resolve) => {
        this.$q.dialog({
          title: 'Revocar todos los permisos',
          message: '¿Confirmas revocar todos los permisos de <strong>' + name + '</strong>? El usuario perderá acceso a todos los módulos.',
          html: true,
          ok: { label: 'Revocar', color: 'negative', unelevated: true, rounded: true },
          cancel: { label: 'Cancelar', flat: true, color: 'grey-7' },
          persistent: true
        })
          .onOk(() => resolve(true))
          .onCancel(() => resolve(false))
          .onDismiss(() => resolve(false));
      });
      if (!confirmed) return;
      try {
        await this.store.revokeAllPermissions();
        this.$q.notify({
          type: 'warning',
          message: 'Todos los permisos de ' + name + ' fueron revocados',
          position: 'top-right',
          icon: 'remove_circle',
          timeout: 2500
        });
      } catch (err) {
        this.$q.notify({
          type: 'negative',
          message: 'No se pudieron revocar los permisos',
          position: 'top-right',
          icon: 'error'
        });
      }
    }
  }
};
</script>

<style scoped>
/* =====================================================
   DESIGN TOKENS
   ===================================================== */
.wp-page {
  background-color: #F1F5F9;
  min-height: 100%;
  padding: 20px 16px 100px; /* bottom padding reserva footer sticky */
}

.wp-shell {
  max-width: 1380px;
  margin-left: auto;
  margin-right: auto;
}

/* =====================================================
   HEADER + WIZARD
   ===================================================== */
.wp-header {
  padding: 4px 2px 0;
  margin-bottom: 12px;
}

.wp-title {
  font-size: 22px;
  font-weight: 700;
  color: #1E293B;
  letter-spacing: -0.02em;
}

.wp-sub {
  font-size: 14px;
  color: #94A3B8;
  line-height: 1.5;
}

.wp-summary-chip {
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  padding: 4px 10px;
}

/* Wizard bar */
.wp-wizard-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 10px 0 4px;
  border-top: 1px solid #E2E8F0;
}

.wp-wizard-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 64px;
}

.wp-wizard-bubble {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E2E8F0;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.wp-wizard-label {
  font-size: 11px;
  color: #94A3B8;
  font-weight: 500;
  transition: color 0.2s;
}

.wp-wizard-step.wp-wizard-active .wp-wizard-bubble {
  background: #6366F1;
  color: #fff;
}

.wp-wizard-step.wp-wizard-active .wp-wizard-label {
  color: #6366F1;
  font-weight: 700;
}

.wp-wizard-step.wp-wizard-done .wp-wizard-bubble {
  background: #C7D2FE;
  color: #4338CA;
}

.wp-wizard-step.wp-wizard-done .wp-wizard-label {
  color: #6366F1;
}

.wp-wizard-arrow {
  flex: 1;
  text-align: center;
  color: #CBD5E1;
  padding-bottom: 16px;
}

.wp-wizard-arrow.wp-wizard-arrow-active {
  color: #A5B4FC;
}

/* =====================================================
   CONTEXT BAR
   ===================================================== */
.wp-context-bar {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 10px 16px;
  position: sticky;
  top: 8px;
  z-index: 10;
}

.wp-context-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.wp-context-caption {
  font-size: 13px;
  color: #94A3B8;
}

.wp-context-sep {
  color: #CBD5E1;
}

.wp-revoke-btn {
  font-size: 12px;
  border-radius: 8px;
}

/* =====================================================
   COLUMNAS / CARDS
   ===================================================== */
.wp-grid {
  align-items: stretch;
}

.permission-card {
  border-radius: 16px !important;
  border: 1px solid #E9EEF4 !important;
  background-color: #FFFFFF;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.wp-col {
  height: 100%;
  min-height: 460px;
  display: flex;
  flex-direction: column;
}

/* Columna activa: más prominencia visual */
.wp-col-active {
  border-color: #C7D2FE !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08) !important;
}

/* Step label y título de columna */
.wp-step-label {
  font-size: 10px;
  font-weight: 700;
  color: #A5B4FC;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.wp-col-title {
  font-size: 15px;
  font-weight: 600;
  color: #1E293B;
}

/* =====================================================
   BÚSQUEDA Y COLABORADORES (COL 1)
   ===================================================== */
.wp-results {
  border: 1px solid #E9EEF4;
  border-radius: 12px;
  max-height: 360px;
  overflow-y: auto;
  background-color: #FAFBFC;
}

.wp-worker-checked {
  background-color: #EEF2FF;
  border-left: 3px solid #6366F1;
}

.wp-checked-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.wp-selected-card {
  background-color: #F8FAFC;
  border-radius: 0 0 16px 16px;
}

.wp-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* =====================================================
   MÓDULOS DEL SISTEMA (COL 2)
   ===================================================== */
.wp-module-list { padding: 4px 0; }

.wp-module-item {
  padding: 9px 14px;
  border-left: 3px solid transparent;
  border-radius: 0 8px 8px 0;
  transition: background-color 0.15s, border-color 0.15s;
}

.wp-module-item:hover {
  background-color: #F8FAFC;
}

.wp-module-active {
  background-color: #EEF2FF;
  border-left: 3px solid #6366F1;
}

.wp-module-subitem-selected {
  border-left: 3px solid #0D9488 !important;
  background: rgba(13, 148, 136, 0.05) !important;
}

/* sidebar section headers */
.sidebar-section {
  font-size: 11px;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* =====================================================
   VISTAS DEL MÓDULO (COL 3)
   ===================================================== */
.wp-active-header {
  background-color: #F8FAFC;
}

.wp-active-module-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.wp-permission-count {
  font-size: 12px;
  font-weight: 600;
  color: #6366F1;
  background: #EEF2FF;
  padding: 2px 8px;
  border-radius: 20px;
}

.wp-subitem-item {
  border-radius: 7px;
  transition: background 0.15s;
}

.wp-subitem-item:hover { background: rgba(13, 148, 136, 0.06); }

.wp-subitem-checked {
  background: rgba(13, 148, 136, 0.09) !important;
}

.wp-subitem-checked .q-item__label {
  color: #0D9488 !important;
  font-weight: 500;
}

/* =====================================================
   ACCIONES / PERMISOS (COL 4)
   ===================================================== */
.wp-action-group {
  background: #F8FAFC;
  border-radius: 10px;
  overflow: hidden;
}

.wp-action-group-label {
  font-size: 10px;
  font-weight: 700;
  color: #94A3B8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 6px 12px 4px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #F1F5F9;
}

.wp-action-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.13s;
  border-radius: 0;
}

.wp-action-row:hover {
  background: #EEF2FF;
}

.wp-action-row:last-child {
  border-radius: 0 0 10px 10px;
}

.wp-action-granted {
  background: #EEF2FF;
}

/* Permisos críticos (DELETE, AUTHORIZE) */
.wp-action-critical {
  background: #FFF7ED !important;
}

.wp-action-critical:hover {
  background: #FFEDD5 !important;
}

.wp-action-critical.wp-action-granted {
  background: #FEF3C7 !important;
}

.wp-action-label {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  flex: 1;
  line-height: 1.3;
}

.wp-action-cb {
  transform: scale(0.9);
}

/* =====================================================
   ESTADOS VACÍOS
   ===================================================== */
.wp-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 28px 16px;
  text-align: center;
}

.wp-empty-text {
  font-size: 13px;
  color: #94A3B8;
  line-height: 1.5;
  max-width: 180px;
  margin: 0 auto;
}

.wp-empty-module {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.wp-no-subitems-card {
  background: #F8FAFC;
  border: 1px dashed #CBD5E1;
  border-radius: 12px;
  max-width: 230px;
  width: 100%;
  padding: 20px;
}

/* =====================================================
   FOOTER STICKY
   ===================================================== */
.wp-footer-sticky {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #E9EEF4;
  border-radius: 0 0 16px 16px;
  padding: 14px 20px;
  margin: 16px -4px -4px;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.04);
  z-index: 9;
}

.wp-footer-text {
  font-size: 13px;
  color: #64748B;
}

.wp-btn-cancel {
  border-radius: 10px;
  font-weight: 500;
  font-size: 13px;
}

.wp-btn-save {
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  padding: 0 20px;
  min-height: 40px;
}

/* =====================================================
   MOBILE
   ===================================================== */
@media (max-width: 1023px) {
  .wp-col { min-height: 0; }
  .wp-wizard-bar { flex-wrap: wrap; gap: 8px; }
  .wp-wizard-arrow { display: none; }
  .wp-context-bar { position: static; }
  .wp-footer-sticky { position: static; margin: 16px 0 0; }
}
</style>
