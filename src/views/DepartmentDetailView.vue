<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- ═══ Header ═══ -->
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="onBack" />
      <div class="q-ml-sm">
        <h1 class="text-h4 text-weight-bold q-my-none text-primary">
          Detalle del Departamento
        </h1>
        <div class="row items-center q-gutter-x-sm q-mt-xs">
          <q-badge
            v-if="dept"
            :color="dept.status === 'ACTIVO' ? 'green' : 'grey-7'"
            class="text-weight-bold"
          >
            {{ dept.status }}
          </q-badge>
          <span class="text-subtitle2 text-grey-7">
            {{ dept ? dept.code : '...' }}
          </span>
        </div>
      </div>
      <q-space />
      <q-btn
        v-if="dept"
        unelevated color="primary"
        icon="edit" label="Editar"
        :to="departamentoEditTo($route, dept.id)"
      />
    </div>

    <!-- ═══ Loading ═══ -->
    <div v-if="departmentStore.isLoading" class="flex flex-center q-pa-xl">
      <q-spinner-dots size="50px" color="primary" />
    </div>

    <!-- ═══ Contenido ═══ -->
    <div v-else-if="dept" class="detail-grid row q-col-gutter-lg items-stretch">

      <!-- ─── Información General ─── -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="detail-card full-height">
          <q-card-section>
            <div class="detail-card__header">
              <q-icon name="info" size="20px" color="green-6" />
              <span class="detail-card__title">Información General</span>
            </div>

            <div class="detail-field">
              <div class="detail-field__label">Nombre</div>
              <div class="detail-field__value text-weight-medium">{{ dept.name }}</div>
            </div>

            <div class="detail-field">
              <div class="detail-field__label">Descripción</div>
              <div class="detail-field__value detail-field__value--muted">
                {{ dept.description || 'Sin descripción disponible.' }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- ─── Áreas de Trabajo ─── -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="detail-card full-height">
          <q-card-section class="detail-card__section--areas">
            <div class="detail-card__header">
              <div class="row items-center">
                <q-icon name="groups" size="20px" color="green-6" class="q-mr-sm" />
                <span class="detail-card__title">
                  Áreas de Trabajo
                  <span class="detail-card__count">({{ areasCount }})</span>
                </span>
              </div>
              <q-btn
                v-if="areasCount > 0"
                flat dense no-caps color="primary" icon="add" label="Agregar área"
                class="text-caption"
                :to="departamentoEditTo($route, dept.id)"
              />
            </div>

            <!-- Empty state -->
            <div v-if="areasCount === 0" class="empty-state text-center q-pa-xl">
              <q-icon name="domain" size="48px" class="q-mb-sm empty-state__icon" />
              <div class="text-body1 text-grey-7">No hay áreas agregadas.</div>
              <div class="text-caption text-grey-5 q-mt-xs">
                Un departamento puede funcionar sin áreas de trabajo.
              </div>
            </div>

            <!-- Lista de áreas (scroll si > 5) -->
            <div v-else :class="areasScrollClass">
              <div
                v-for="(area, index) in dept.areas"
                :key="index"
                class="area-item"
              >
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="area-item__name">{{ area.name }}</div>
                    <div class="area-item__meta">
                      <q-icon name="person" size="12px" />
                      {{ area.manager || 'Sin responsable' }}
                    </div>
                  </div>
                  <q-badge
                    :color="area.status === 'ACTIVO' ? 'green' : 'grey'"
                    outline class="area-item__badge"
                  >
                    {{ area.status === 'ACTIVO' ? 'Activo' : 'Inactivo' }}
                  </q-badge>
                </div>
                <div v-if="area.description" class="area-item__desc">
                  {{ area.description }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script>
import { computed, onMounted } from '@vue/composition-api';
import { useDepartmentStore } from '../stores/department.store';
import {
  departamentoEditTo,
  talentoHumanoRouteNames,
} from 'src/modules/talento-humano/ui/utils/talentoHumanoRoutes';

export default {
  name: 'DepartmentDetailView',
  setup(props, { root }) {
    const departmentStore = useDepartmentStore();
    const router = root.$router;
    const id = root.$route.params.id;

    const dept = computed(function () {
      return departmentStore.currentDepartment;
    });

    const areasCount = computed(function () {
      var d = dept.value;
      return d && Array.isArray(d.areas) ? d.areas.length : 0;
    });

    const areasScrollClass = computed(function () {
      return areasCount.value > 5 ? 'areas-scroll' : '';
    });

    function onBack() {
      router.back();
    }

    onMounted(async function () {
      try {
        await departmentStore.fetchById(id);
      } catch (error) {
        root.$q.notify({
          type: 'negative',
          message: 'No se pudo cargar la información del departamento'
        });
        router.push({
          name: talentoHumanoRouteNames(root.$route).departamentosLista,
        });
      }
    });

    return {
      departmentStore,
      dept,
      areasCount,
      areasScrollClass,
      onBack,
      departamentoEditTo,
    };
  }
};
</script>

<style scoped>
.detail-grid {
  align-items: stretch;
}

.detail-card {
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

.detail-card__section--areas {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.detail-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.detail-card__title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #334155;
}

.detail-card__count {
  font-weight: 400;
  color: #64748b;
  text-transform: none;
  letter-spacing: 0;
}

/* ═══ Campos de información ═══ */
.detail-field {
  margin-bottom: 16px;
}

.detail-field:last-child {
  margin-bottom: 0;
}

.detail-field__label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 4px;
}

.detail-field__value {
  font-size: 15px;
  color: #1e293b;
  line-height: 1.5;
}

.detail-field__value--muted {
  color: #64748b;
  font-style: italic;
}

/* ═══ Empty state ═══ */
.empty-state {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-state__icon {
  color: #cbd5e1;
}

/* ═══ Áreas ═══ */
.areas-scroll {
  max-height: 420px;
  overflow-y: auto;
}

.area-item {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #e8ecf1;
  background: #f8fafc;
  margin-bottom: 10px;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.area-item:last-child {
  margin-bottom: 0;
}

.area-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.area-item__name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.area-item__meta {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.area-item__badge {
  font-size: 11px;
  flex-shrink: 0;
}

.area-item__desc {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e8ecf1;
  font-size: 13px;
  color: #475569;
  line-height: 1.4;
}
</style>
