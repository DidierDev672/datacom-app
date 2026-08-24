<template>
  <div class="home-container">
    <!-- Header del dashboard -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title">Inicio</h1>
        <p class="page-subtitle">
          Bienvenido,
          {{ (authStore.user && authStore.user.username) || "Usuario" }}
        </p>
      </div>
      <div class="header-stats" v-if="accessibleModules.length > 0">
        <q-chip color="primary" text-color="white" icon="apps">
          {{ accessibleModules.length }} módulos disponibles
        </q-chip>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <q-spinner-dots color="primary" size="48px" />
      <p class="loading-text">Cargando tus permisos...</p>
    </div>

    <!-- Sin permisos -->
    <q-banner
      v-else-if="accessibleModules.length === 0"
      class="no-permissions-banner"
    >
      <template v-slot:avatar>
        <q-icon name="lock" color="warning" size="md" />
      </template>
      <div class="text-h6">No tienes permisos asignados</div>
      <div class="text-body2">
        Contacta al administrador del sistema para solicitar acceso a los
        módulos necesarios.
      </div>
    </q-banner>

    <!-- Grid de módulos -->
    <div v-else class="modules-grid">
      <!-- Gestión General -->
      <div v-if="gestionGeneralModules.length > 0" class="module-section">
        <h2 class="section-title">
          <q-icon name="dashboard" class="q-mr-sm" />
          Gestión General
        </h2>
        <div class="row q-col-gutter-md">
          <div
            v-for="mod in gestionGeneralModules"
            :key="mod.code"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              class="module-card"
              flat
              bordered
              @click="navigateTo(mod.link)"
            >
              <q-card-section class="card-content">
                <div class="card-icon" :style="{ background: mod.color }">
                  <q-icon :name="mod.icon" size="28px" color="white" />
                </div>
                <div class="card-info">
                  <h3 class="card-title">{{ mod.name }}</h3>
                  <p class="card-description">{{ mod.description }}</p>
                </div>
                <q-icon
                  name="chevron_right"
                  class="card-arrow"
                  color="grey-4"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Talento Humano -->
      <div v-if="talentoHumanoModules.length > 0" class="module-section">
        <h2 class="section-title">
          <q-icon name="people" class="q-mr-sm" />
          Talento Humano
        </h2>
        <div class="row q-col-gutter-md">
          <div
            v-for="mod in talentoHumanoModules"
            :key="mod.code"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              class="module-card"
              flat
              bordered
              @click="navigateTo(mod.link)"
            >
              <q-card-section class="card-content">
                <div class="card-icon" :style="{ background: mod.color }">
                  <q-icon :name="mod.icon" size="28px" color="white" />
                </div>
                <div class="card-info">
                  <h3 class="card-title">{{ mod.name }}</h3>
                  <p class="card-description">{{ mod.description }}</p>
                </div>
                <q-icon
                  name="chevron_right"
                  class="card-arrow"
                  color="grey-4"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Abastecimiento -->
      <div v-if="abastecimientoModules.length > 0" class="module-section">
        <h2 class="section-title">
          <q-icon name="inventory_2" class="q-mr-sm" />
          Abastecimiento
        </h2>
        <div class="row q-col-gutter-md">
          <div
            v-for="mod in abastecimientoModules"
            :key="mod.code"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              class="module-card"
              flat
              bordered
              @click="navigateTo(mod.link)"
            >
              <q-card-section class="card-content">
                <div class="card-icon" :style="{ background: mod.color }">
                  <q-icon :name="mod.icon" size="28px" color="white" />
                </div>
                <div class="card-info">
                  <h3 class="card-title">{{ mod.name }}</h3>
                  <p class="card-description">{{ mod.description }}</p>
                </div>
                <q-icon
                  name="chevron_right"
                  class="card-arrow"
                  color="grey-4"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Administración -->
      <div v-if="adminModules.length > 0" class="module-section">
        <h2 class="section-title">
          <q-icon name="admin_panel_settings" class="q-mr-sm" />
          Administración
        </h2>
        <div class="row q-col-gutter-md">
          <div
            v-for="mod in adminModules"
            :key="mod.code"
            class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
          >
            <q-card
              class="module-card"
              flat
              bordered
              @click="navigateTo(mod.link)"
            >
              <q-card-section class="card-content">
                <div class="card-icon" :style="{ background: mod.color }">
                  <q-icon :name="mod.icon" size="28px" color="white" />
                </div>
                <div class="card-info">
                  <h3 class="card-title">{{ mod.name }}</h3>
                  <p class="card-description">{{ mod.description }}</p>
                </div>
                <q-icon
                  name="chevron_right"
                  class="card-arrow"
                  color="grey-4"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de encuestas rápidas (si tiene permiso) -->
    <div v-if="hasModuleAccess('SURVEYS')" class="quick-access-section q-mt-xl">
      <h2 class="section-title">
        <q-icon name="poll" class="q-mr-sm" />
        Acceso Rápido a Encuestas
      </h2>
      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card
            class="survey-card bg-green-1"
            flat
            @click="navigateTo('/encuestas')"
          >
            <q-card-section class="text-center">
              <q-icon name="home" size="48px" color="green" />
              <div class="text-h6 q-mt-sm">Vivienda</div>
              <div class="text-caption text-grey">Encuestas de vivienda</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card
            class="survey-card bg-blue-1"
            flat
            @click="navigateTo('/encuestas')"
          >
            <q-card-section class="text-center">
              <q-icon name="location_city" size="48px" color="blue" />
              <div class="text-h6 q-mt-sm">Municipios</div>
              <div class="text-caption text-grey">Encuestas municipales</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card
            class="survey-card bg-orange-1"
            flat
            @click="navigateTo('/encuestas')"
          >
            <q-card-section class="text-center">
              <q-icon name="groups" size="48px" color="orange" />
              <div class="text-h6 q-mt-sm">Comunidades</div>
              <div class="text-caption text-grey">Encuestas comunitarias</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-3">
          <q-card
            class="survey-card bg-purple-1"
            flat
            @click="navigateTo('/encuestas')"
          >
            <q-card-section class="text-center">
              <q-icon name="add_circle" size="48px" color="purple" />
              <div class="text-h6 q-mt-sm">Nueva Encuesta</div>
              <div class="text-caption text-grey">Crear nueva encuesta</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  useRouter,
} from "@vue/composition-api";
import { useAuthStore } from "src/stores/authStore";

export default defineComponent({
  name: "PageHomePermissions",

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const loading = ref(true);

    // Definición de todos los módulos disponibles
    const allModules = [
      // Gestión General
      {
        code: "HOME",
        name: "Dashboard",
        description: "Vista general del sistema",
        icon: "dashboard",
        link: "/",
        color: "#0066cc",
        category: "gestion",
      },
      {
        code: "SURVEYS",
        name: "Encuestas",
        description: "Gestión de encuestas",
        icon: "poll",
        link: "/encuestas",
        color: "#10b981",
        category: "gestion",
      },
      {
        code: "MUNICIPALITIES",
        name: "Municipios",
        description: "Caracterización municipal",
        icon: "location_city",
        link: "/app/municipios",
        color: "#3b82f6",
        category: "gestion",
      },
      {
        code: "COMMUNITIES",
        name: "Comunidades",
        description: "Caracterización comunitaria",
        icon: "groups",
        link: "/app/comunidad",
        color: "#f59e0b",
        category: "gestion",
      },
      {
        code: "HOUSING",
        name: "Vivienda",
        description: "Encuestas de vivienda",
        icon: "home",
        link: "/app/vivienda",
        color: "#8b5cf6",
        category: "gestion",
      },

      // Talento Humano
      {
        code: "HR_EMPLOYEES",
        name: "Colaboradores",
        description: "Gestión de colaboradores",
        icon: "people",
        link: "/talento-humano/colaboradores",
        color: "#06b6d4",
        category: "talento",
      },
      {
        code: "HR_POSITIONS",
        name: "Puestos de Trabajo",
        description: "Catálogo de cargos",
        icon: "work",
        link: "/talento-humano/puestos",
        color: "#6366f1",
        category: "talento",
      },
      {
        code: "HR_DEPARTMENTS_LIST",
        name: "Lista de departamentos",
        description: "Consulta de departamentos y áreas registradas",
        icon: "corporate_fare",
        link: "/talento-humano/departamentos",
        color: "#0284c7",
        category: "talento",
      },
      {
        code: "HR_DEPARTMENTS",
        name: "Registrar departamentos",
        description: "Alta de departamentos y áreas de trabajo",
        icon: "domain_add",
        link: "/talento-humano/departamentos/nuevo",
        color: "#0ea5e9",
        category: "talento",
      },
      {
        code: "HR_OPERATIONAL_PERMISSIONS",
        name: "Asignar permisos operativos",
        description: "Permisos de compras, aprobaciones, usuarios y eliminaciones",
        icon: "admin_panel_settings",
        link: "/talento-humano/permisos-operativos",
        color: "#7c3aed",
        category: "talento",
      },
      {
        code: "HR_CREATE_SYSTEM_USER",
        name: "Crear usuario del sistema",
        description: "Habilitar credenciales de acceso para un empleado registrado",
        icon: "person_add",
        link: "/talento-humano/usuarios/crear",
        color: "#2563eb",
        category: "talento",
      },
      {
        code: "HR_EMPLOYEE_LIST",
        name: "Lista de empleados",
        description: "Consulta de empleados registrados en el sistema",
        icon: "badge",
        link: "/talento-humano/empleados/lista",
        color: "#0891b2",
        category: "talento",
      },

      // Abastecimiento
      {
        code: "SUPPLY_REQUESTS",
        name: "Solicitudes",
        description: "Gestión de solicitudes",
        icon: "inventory_2",
        link: "/abastecimiento",
        color: "#f97316",
        category: "abastecimiento",
      },
      {
        code: "SUPPLY_PLANS",
        name: "Planes de Abastecimiento",
        description: "Planificación",
        icon: "event_note",
        link: "/abastecimiento/planes",
        color: "#ef4444",
        category: "abastecimiento",
      },
      {
        code: "SUPPLY_ORDERS",
        name: "Órdenes de Compra",
        description: "Órdenes y compras",
        icon: "shopping_cart",
        link: "/abastecimiento/ordenes",
        color: "#ec4899",
        category: "abastecimiento",
      },
      {
        code: "SUPPLY_APPROVALS",
        name: "Aprobaciones",
        description: "Pendientes de aprobación",
        icon: "approval",
        link: "/abastecimiento/aprobaciones",
        color: "#84cc16",
        category: "abastecimiento",
      },

      // Administración
      {
        code: "ADMIN_PERMISSIONS",
        name: "Permisos",
        description: "Permisos por colaborador",
        icon: "security",
        link: "/admin/permissions",
        color: "#a855f7",
        category: "admin",
      },
      {
        code: "ADMIN_REPORTS",
        name: "Reportes",
        description: "Reportes del sistema",
        icon: "assessment",
        link: "/reportes",
        color: "#64748b",
        category: "admin",
      },
    ];

    // Módulos a los que el usuario tiene acceso
    const accessibleModules = computed(() => {
      // Si es admin, mostrar todo
      if (authStore.isAdmin) {
        return allModules;
      }

      // Filtrar por permisos o roles
      return allModules.filter((mod) => {
        // Verificar si tiene permiso READ para este módulo
        return (
          authStore.hasPermission(mod.code, "READ") ||
          authStore.hasModuleAccess(mod.code)
        );
      });
    });

    // Módulos por categoría
    const gestionGeneralModules = computed(() =>
      accessibleModules.value.filter((m) => m.category === "gestion")
    );

    const talentoHumanoModules = computed(() =>
      accessibleModules.value.filter((m) => m.category === "talento")
    );

    const abastecimientoModules = computed(() =>
      accessibleModules.value.filter((m) => m.category === "abastecimiento")
    );

    const adminModules = computed(() =>
      accessibleModules.value.filter((m) => m.category === "admin")
    );

    // Verificar acceso a un módulo específico
    const hasModuleAccess = (code) => {
      if (authStore.isAdmin) return true;
      return accessibleModules.value.some((m) => m.code === code);
    };

    // Navegación
    const navigateTo = (link) => {
      router.push(link);
    };

    // Cargar permisos al montar
    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        await authStore.restoreSession();
      }
      loading.value = false;
    });

    return {
      authStore,
      loading,
      accessibleModules,
      gestionGeneralModules,
      talentoHumanoModules,
      abastecimientoModules,
      adminModules,
      hasModuleAccess,
      navigateTo,
    };
  },
});
</script>

<style scoped>
.home-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.loading-text {
  margin-top: 16px;
  color: #6b7280;
}

.no-permissions-banner {
  margin: 40px 0;
  border-radius: 12px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
}

.module-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.modules-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.module-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #d1d5db;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-description {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-arrow {
  font-size: 20px;
  transition: transform 0.2s ease;
}

.module-card:hover .card-arrow {
  transform: translateX(4px);
  color: #9ca3af;
}

.survey-card {
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.survey-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.quick-access-section {
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .home-container {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 12px;
  }

  .page-title {
    font-size: 24px;
  }

  .card-content {
    padding: 16px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>
