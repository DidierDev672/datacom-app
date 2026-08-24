<template>
  <!--
    PASO 1 — Seleccionar colaborador.

    - Al montarse: GET /api/user-access/collaborators-without-access.
    - Muestra empleados activos que aún no tienen usuario en el sistema.
    - El campo de búsqueda filtra en cliente (nombre, email, documento, cargo, área).
  -->
  <div class="ac-step">

    <!-- Buscador dominante -->
    <q-input v-if="!store.selectedCollaborator" :value="searchTerm" @input="onSearchInput" outlined
      label="Buscar colaborador por nombre, email, documento o cargo" clearable class="ac-search-input"
      :loading="store.isSearchingCollaborators">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:hint>
        {{ searchHintText }}
      </template>
    </q-input>

    <!-- Feedback de búsqueda / consulta ejecutada -->
    <div
      v-if="!store.selectedCollaborator && listHasLoadedOnce && !store.isSearchingCollaborators"
      class="ac-search-status text-caption"
      :class="searchStatusClass"
    >
      <q-icon :name="searchStatusIcon" size="14px" class="q-mr-xs" />
      {{ searchStatusText }}
    </div>

    <!-- Cabecera de lista: total visible -->
    <div v-if="!store.selectedCollaborator && listHasLoadedOnce && store.registeredCollaborators.length > 0"
      class="row items-center justify-between q-mt-sm q-mb-xs">
      <span class="text-caption text-grey-7">
        Mostrando {{ store.collaboratorSearchResults.length }}
        <span class="text-grey-5">
          {{ searchTerm ? 'coincidencias' : 'colaboradores' }}
        </span>
        <span v-if="searchTerm" class="text-grey-5">
          ({{ store.registeredCollaborators.length }} en total)
        </span>
      </span>
      <q-btn dense flat no-caps color="primary" size="sm" icon="refresh" label="Actualizar lista"
        :loading="store.isSearchingCollaborators" @click="reloadList" />
    </div>

    <!-- Resultados -->
    <div v-if="!store.selectedCollaborator && store.collaboratorSearchResults.length > 0" class="ac-results q-mt-sm">
      <q-list separator>
        <q-item v-for="c in store.collaboratorSearchResults" :key="c.id" clickable v-ripple @click="onSelect(c)"
          class="ac-result-item q-py-sm">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white" icon="person" size="40px" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-body1 text-weight-semibold text-dark">
              {{ c.fullName }}
            </q-item-label>
            <q-item-label caption class="text-grey-6">
              {{ c.position || 'Sin cargo' }}
              <span v-if="c.department"> · {{ c.department }}</span>
            </q-item-label>
            <q-item-label caption class="text-grey-5">
              <q-icon name="mail" size="12px" class="q-mr-xs" />{{ c.email || 'Sin email' }}
            </q-item-label>
            <q-item-label v-if="c.numeroDocumento" caption class="text-grey-5">
              <q-icon name="badge" size="12px" class="q-mr-xs" />{{ c.numeroDocumento }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Cargando al inicio -->
    <div v-if="!store.selectedCollaborator && store.isSearchingCollaborators && !listHasLoadedOnce"
      class="ac-loading q-mt-md row items-center justify-center q-gutter-sm">
      <q-spinner color="primary" size="28px" />
      <span class="text-body2 text-grey-7">Cargando colaboradores...</span>
    </div>

    <!-- Sin registros en el sistema (tras cargar) -->
    <div
      v-else-if="!store.selectedCollaborator && listHasLoadedOnce && store.registeredCollaborators.length === 0 && !store.isSearchingCollaborators"
      class="ac-empty q-mt-md text-center">
      <q-icon name="groups" size="48px" color="grey-4" />
      <p class="text-body2 text-grey-6 q-mt-sm q-mb-none">
        {{ emptyStateTitle }}
      </p>
      <p v-if="searchTerm" class="text-caption text-grey-5 q-mt-xs q-mb-none">
        No se encontraron resultados para «{{ searchTerm }}».
      </p>
      <p v-else-if="!store.usesHrEmployeeRegistry" class="text-caption text-grey-5 q-mt-xs q-mb-none">
        Puede que todos ya tengan acceso o aún no estén registrados en Talento Humano.
      </p>
      <p v-else class="text-caption text-grey-5 q-mt-xs q-mb-none">
        Consulta completada en el registro de Talento Humano.
      </p>
      <div class="ac-empty-actions q-mt-lg">
        <q-btn
          v-if="store.usesHrEmployeeRegistry"
          unelevated
          color="primary"
          no-caps
          class="ac-empty-primary-btn"
          icon="arrow_back"
          label="Volver a candidatos sin acceso"
          :loading="store.isSearchingCollaborators"
          @click="reloadList"
        />
        <q-btn
          v-else
          unelevated
          color="primary"
          no-caps
          class="ac-empty-primary-btn"
          icon="person_search"
          label="Buscar empleados registrados"
          :loading="store.isSearchingCollaborators"
          @click="searchRegisteredEmployees"
        />
        <q-btn
          v-if="!store.usesHrEmployeeRegistry"
          flat
          dense
          no-caps
          color="grey-7"
          class="ac-empty-secondary-btn"
          icon="refresh"
          label="Intentar de nuevo"
          :loading="store.isSearchingCollaborators"
          @click="reloadList"
        />
      </div>
    </div>

    <!-- Lista cargada pero vacía por filtro -->
    <div
      v-else-if="!store.selectedCollaborator && searchTerm && !store.isSearchingCollaborators && listHasLoadedOnce && store.collaboratorSearchResults.length === 0 && store.registeredCollaborators.length > 0"
      class="ac-empty q-mt-md text-center">
      <q-icon name="search_off" size="40px" color="grey-4" />
      <p class="text-body2 text-grey-6 q-mt-sm q-mb-xs">
        No hay coincidencias con «{{ searchTerm }}»
      </p>
      <p class="text-caption text-grey-5 q-mb-none">
        Prueba otro nombre, email o documento
      </p>
    </div>


    <!-- Colaborador seleccionado: card compacta -->
    <q-card v-if="store.selectedCollaborator" flat bordered class="ac-selected-card q-pa-md">
      <q-banner
        v-if="store.isEditingExistingAccess"
        class="bg-blue-1 text-blue-9 q-mb-md"
        rounded
        dense
      >
        <template v-slot:avatar>
          <q-icon name="lock_reset" color="primary" />
        </template>
        Acceso existente: actualizará username y contraseña.
      </q-banner>
      <div class="row items-center q-col-gutter-md">
        <q-avatar color="primary" text-color="white" icon="person" size="56px" />
        <div class="col">
          <div class="text-body1 text-weight-semibold text-dark">
            {{ store.selectedCollaborator.fullName }}
          </div>
          <div class="text-caption text-grey-6">
            {{ store.selectedCollaborator.position || 'Sin cargo' }}
            <span v-if="store.selectedCollaborator.department">
              · {{ store.selectedCollaborator.department }}
            </span>
          </div>
          <div class="text-caption text-grey-5 q-mt-xs">
            <q-icon name="mail" size="12px" class="q-mr-xs" />{{ store.selectedCollaborator.email }}
          </div>
        </div>
        <div class="col-auto">
          <q-btn flat dense round color="grey-7" icon="close" @click="onClear">
            <q-tooltip>Cambiar colaborador</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { useAccessStore } from 'src/stores/accessStore';

const SEARCH_DEBOUNCE_MS = 400;

export default {
  name: 'CollaboratorSearch',

  data() {
    return {
      searchTerm: '',
      searchDebounce: null,
      listHasLoadedOnce: false
    };
  },

  mounted() {
    this.reloadList();
  },

  computed: {
    store() {
      return useAccessStore();
    },
    emptyStateTitle() {
      if (this.store.usesHrEmployeeRegistry) {
        return 'No se encontraron empleados activos en el registro de Talento Humano';
      }
      return 'No hay colaboradores activos sin acceso al sistema';
    },
    searchHintText() {
      if (!this.listHasLoadedOnce) {
        return this.store.usesHrEmployeeRegistry
          ? 'Empleados activos del registro de Talento Humano. Escribe para acotar resultados.'
          : 'Colaboradores sin acceso al sistema. Escribe para acotar resultados.';
      }
      if (this.searchTerm) {
        return 'Filtrando por «' + this.searchTerm + '».';
      }
      if (this.store.registeredCollaborators.length === 0) {
        return 'Consulta completada · 0 colaboradores disponibles.';
      }
      return this.store.usesHrEmployeeRegistry
        ? 'Empleados activos del registro de Talento Humano. Escribe para acotar resultados.'
        : 'Colaboradores sin acceso al sistema. Escribe para acotar resultados.';
    },
    searchStatusText() {
      if (this.searchTerm) {
        return 'Búsqueda: «' + this.searchTerm + '» · ' +
          this.store.collaboratorSearchResults.length + ' resultado(s)';
      }
      if (this.store.registeredCollaborators.length === 0) {
        return 'Consulta completada · 0 colaboradores disponibles';
      }
      return this.store.collaboratorSearchResults.length + ' colaborador(es) disponible(s)';
    },
    searchStatusIcon() {
      if (this.store.registeredCollaborators.length === 0 || this.searchTerm) {
        return 'info_outline';
      }
      return 'check_circle_outline';
    },
    searchStatusClass() {
      if (this.store.registeredCollaborators.length === 0) {
        return 'ac-search-status--empty';
      }
      return 'ac-search-status--ok';
    }
  },

  methods: {
    async reloadList() {
      this.searchTerm = '';
      await this.store.fetchRegisteredCollaborators();
      this.listHasLoadedOnce = true;
    },

    async searchRegisteredEmployees() {
      this.searchTerm = '';
      await this.store.searchRegisteredEmployees('');
      this.listHasLoadedOnce = true;
    },

    onSearchInput(value) {
      this.searchTerm = value || '';
      if (this.searchDebounce) clearTimeout(this.searchDebounce);
      this.searchDebounce = setTimeout(async () => {
        await this.store.filterCollaboratorsList(this.searchTerm);
      }, SEARCH_DEBOUNCE_MS);
    },

    async onSelect(collaborator) {
      var ok = await this.store.selectCollaborator(collaborator);
      if (!ok) return;
      // Notificamos al padre para que el QStepper avance al paso 2
      this.$emit('selected', collaborator);
    },

    onClear() {
      this.store.selectedCollaborator = null;
      this.store.isEditingExistingAccess = false;
      this.store.existingAccessId = null;
      this.store.originalUsername = '';
      this.searchTerm = '';
      this.store.filterCollaboratorsList('');
      this.$emit('cleared');
    }
  }
};
</script>

<style scoped>
/* Input dominante (UX: foco visual claro en la primera decisión) */
.ac-search-input>>>.q-field__control {
  min-height: 48px;
  border-radius: 12px;
}

.ac-search-input>>>.q-field__native {
  font-size: 15px;
}

/* Card de resultados con respiración visual */
.ac-results {
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  background: #fff;
  max-height: 360px;
  overflow-y: auto;
}

.ac-result-item {
  transition: background-color 0.15s;
}

.ac-result-item:hover {
  background-color: #F8FAFC;
}

/* Card del colaborador seleccionado: más compacta y prominente */
.ac-selected-card {
  border-radius: 14px;
  background: #F8FAFC;
  border-color: #DBEAFE !important;
}

.ac-empty {
  padding: 32px 24px;
  color: #64748B;
}

.ac-search-status {
  margin-top: 6px;
  color: #64748B;
}

.ac-search-status--empty {
  color: #94A3B8;
}

.ac-search-status--ok {
  color: #4E9C4C;
}

.ac-empty-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.ac-empty-primary-btn {
  min-width: 300px;
  min-height: 44px;
  font-size: 15px;
  font-weight: 600;
}

.ac-empty-secondary-btn {
  font-size: 13px;
  opacity: 0.7;
  padding: 4px 8px;
}

.ac-empty-secondary-btn:hover {
  opacity: 1;
  background: transparent !important;
}
</style>
