<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-xl">
      <div class="col">
        <h1 class="text-h4 text-weight-bold q-my-none text-primary">
          Departamentos y Áreas
        </h1>
        <p class="text-subtitle2 text-grey-7 q-mt-xs">
          Gestión de la estructura organizacional y unidades de trabajo
        </p>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <q-card flat bordered class="q-mb-lg rounded-borders">
      <q-card-section class="row q-col-gutter-md items-center">
        <div class="col-12 col-md-6">
          <q-input
            v-model="searchQuery"
            dense
            outlined
            placeholder="Buscar por nombre o código..."
            @input="onSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="statusFilter"
            :options="['TODOS', 'ACTIVO', 'INACTIVO']"
            dense
            outlined
            label="Filtrar por estado"
            @input="onSearch"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla de Departamentos -->
    <q-table
      :data="departmentStore.departments"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :loading="departmentStore.isLoading"
      class="rounded-borders main-table"
      no-data-label="No se encontraron departamentos"
      :pagination="{ rowsPerPage: 10 }"
    >
      <!-- Slot para Estado -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge
            :color="props.value === 'ACTIVO' ? 'green-2' : 'grey-4'"
            :text-color="props.value === 'ACTIVO' ? 'green-9' : 'grey-8'"
            class="q-pa-xs text-weight-bold"
          >
            {{ props.value }}
          </q-badge>
        </q-td>
      </template>

      <!-- Slot para Código -->
      <template v-slot:body-cell-code="props">
        <q-td :props="props">
          <span class="text-weight-medium text-blue-grey-8">{{
            props.value || "—"
          }}</span>
        </q-td>
      </template>

      <!-- Slot para Áreas -->
      <template v-slot:body-cell-areas="props">
        <q-td :props="props">
          <q-chip size="sm" color="blue-1" text-color="blue-8" icon="groups">
            {{ props.value.length }}
          </q-chip>
        </q-td>
      </template>

      <!-- Slot para Acciones -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-xs">
          <q-btn
            flat
            round
            color="info"
            icon="visibility"
            size="sm"
            :to="viewDepartmentTo(props.row.id)"
          >
            <q-tooltip>Ver detalle</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            size="sm"
            :to="editDepartmentTo(props.row.id)"
          >
            <q-tooltip>Editar departamento</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            :color="props.row.status === 'ACTIVO' ? 'orange' : 'green'"
            :icon="
              props.row.status === 'ACTIVO' ? 'visibility_off' : 'visibility'
            "
            size="sm"
            @click="toggleStatus(props.row)"
          >
            <q-tooltip>{{
              props.row.status === "ACTIVO" ? "Inactivar" : "Activar"
            }}</q-tooltip>
          </q-btn>

          <q-btn
            flat
            round
            color="red"
            icon="delete"
            size="sm"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>Eliminar</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-inner-loading :showing="departmentStore.isLoading">
      <q-spinner-dots size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import { useDepartmentStore } from "../stores/department.store";
import {
  departamentoEditTo,
  departamentoViewTo,
} from "src/modules/talento-humano/ui/utils/talentoHumanoRoutes";

export default {
  name: "DepartmentsListView",
  setup(props, { root }) {
    const departmentStore = useDepartmentStore();
    const $q = root.$q;

    const searchQuery = ref("");
    const statusFilter = ref("TODOS");

    const columns = [
      {
        name: "name",
        label: "NOMBRE",
        field: "name",
        align: "left",
        sortable: true,
      },
      {
        name: "code",
        label: "CÓDIGO",
        field: "code",
        align: "left",
        sortable: true,
      },
      {
        name: "areas",
        label: "ÁREAS",
        field: (row) => row.areas,
        align: "center",
      },
      {
        name: "status",
        label: "ESTADO",
        field: "status",
        align: "center",
        sortable: true,
      },
      { name: "actions", label: "ACCIONES", field: "id", align: "right" },
    ];

    function onSearch() {
      const status =
        statusFilter.value === "TODOS" ? undefined : statusFilter.value;
      departmentStore.fetchAll({ q: searchQuery.value, status });
    }

    function viewDepartmentTo(id) {
      return departamentoViewTo(root.$route, id);
    }

    function editDepartmentTo(id) {
      return departamentoEditTo(root.$route, id);
    }

    async function toggleStatus(dept) {
      const newStatus = dept.status === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      try {
        await departmentStore.updateStatus(dept.id, newStatus);
        $q.notify({
          type: "info",
          message: `Departamento ${dept.name} ahora está ${newStatus}`,
          position: "bottom-right",
        });
      } catch (err) {
        $q.notify({ type: "negative", message: "Error al cambiar estado" });
      }
    }

    function confirmDelete(dept) {
      $q.dialog({
        title: "Confirmar eliminación",
        message: `¿Está seguro de eliminar el departamento "${dept.name}" y todas sus áreas de trabajo? Esta acción no se puede deshacer.`,
        cancel: { label: "Cancelar", flat: true, color: "grey" },
        ok: { label: "Eliminar", unelevated: true, color: "red" },
        persistent: true,
      }).onOk(async () => {
        try {
          await departmentStore.remove(dept.id);
          $q.notify({
            type: "positive",
            message: "Departamento eliminado correctamente",
          });
        } catch (err) {
          $q.notify({
            type: "negative",
            message: "No se pudo eliminar el departamento",
          });
        }
      });
    }

    onMounted(() => {
      departmentStore.fetchAll();
    });

    return {
      departmentStore,
      searchQuery,
      statusFilter,
      columns,
      onSearch,
      viewDepartmentTo,
      editDepartmentTo,
      toggleStatus,
      confirmDelete,
    };
  },
};
</script>

<style scoped>
.main-table {
  background: white;
}
.text-primary {
  color: #4e9c4c !important;
}
</style>
