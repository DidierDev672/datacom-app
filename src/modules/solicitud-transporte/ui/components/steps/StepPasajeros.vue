<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <h3 class="sta-section-title q-my-none">Lista de Pasajeros</h3>
        <p class="text-caption text-grey-7 q-my-none">Agregue al menos un pasajero para continuar</p>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          label="Agregar Pasajero"
          unelevated
          @click="agregarPasajero"
          class="sta-btn"
        />
      </div>
    </div>

    <q-table
      :data="store.solicitudActual.pasajeros"
      :columns="columns"
      row-key="numeroPasajero"
      flat
      bordered
      hide-pagination
      class="sta-table"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="numeroPasajero" :props="props">
            {{ props.row.numeroPasajero }}
          </q-td>
          
          <q-td key="nombre" :props="props">
            <q-input v-model="props.row.nombre" dense outlined class="sta-table-input" />
          </q-td>

          <q-td key="documento" :props="props">
            <q-input 
              v-model="props.row.documento" 
              dense 
              outlined 
              class="sta-table-input"
              maxlength="20"
              hide-bottom-space
            />
          </q-td>

          <q-td key="fechaNacimiento" :props="props">
            <q-input v-model="props.row.fechaNacimiento" dense outlined type="date" class="sta-table-input" />
          </q-td>

          <q-td key="cargo" :props="props">
            <q-input v-model="props.row.cargo" dense outlined class="sta-table-input" />
          </q-td>

          <q-td key="contacto" :props="props">
            <q-input v-model="props.row.contacto" dense outlined class="sta-table-input" />
          </q-td>

          <q-td key="acciones" :props="props" class="text-center">
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="eliminarPasajero(props.rowIndex)"
            >
              <q-tooltip>Eliminar fila</q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-lg text-grey-6">
          <q-icon name="group_add" size="48px" />
          <div class="q-ml-md">No hay pasajeros registrados</div>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import { useSolicitudTransporteStore } from '../../../store/solicitudTransporte.store';

export default {
  name: 'StepPasajeros',
  setup() {
    const store = useSolicitudTransporteStore();

    const columns = [
      { name: 'numeroPasajero', label: 'N°', align: 'left', field: 'numeroPasajero' },
      { name: 'nombre', label: 'Nombre Completo', align: 'left', field: 'nombre' },
      { name: 'documento', label: 'Documento', align: 'left', field: 'documento' },
      { name: 'fechaNacimiento', label: 'F. Nacimiento', align: 'left', field: 'fechaNacimiento' },
      { name: 'cargo', label: 'Cargo', align: 'left', field: 'cargo' },
      { name: 'contacto', label: 'Contacto', align: 'left', field: 'contacto' },
      { name: 'acciones', label: 'Acciones', align: 'center' }
    ];

    const agregarPasajero = () => {
      const nextNum = store.solicitudActual.pasajeros.length + 1;
      store.solicitudActual.pasajeros.push({
        numeroPasajero: nextNum,
        nombre: '',
        documento: '',
        fechaNacimiento: '',
        cargo: '',
        contacto: ''
      });
    };

    const eliminarPasajero = (index) => {
      store.solicitudActual.pasajeros.splice(index, 1);
      // Re-indexar
      store.solicitudActual.pasajeros.forEach((p, i) => {
        p.numeroPasajero = i + 1;
      });
    };

    return {
      store,
      columns,
      agregarPasajero,
      eliminarPasajero
    };
  }
}
</script>

<style scoped>
.sta-section-title {
  font-size: var(--text-seccion);
  font-weight: var(--weight-seccion);
  color: var(--color-text-secondary);
}
.sta-table :deep(th) {
  font-size: var(--text-header-tb);
  font-weight: var(--weight-header-tb);
  color: var(--color-label);
  text-transform: uppercase;
}
.sta-table :deep(td) {
  font-size: var(--text-tabla);
  font-weight: var(--weight-tabla);
}
.sta-table-input {
  min-width: 140px;
}
.sta-btn {
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
}
</style>
