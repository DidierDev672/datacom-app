<template>
  <div class="card">
    <div class="card-header">
      <h5>5. Proceso de autorización</h5>
    </div>
    <div class="card-body">
      
      <div class="actions">
        <button type="button" class="btn-primary" @click="abrirModal">
          <span>+</span> Agregar aprobador
        </button>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="solicitud.aprobadores.length === 0">
              <td colspan="4" class="empty">No se han designado aprobadores</td>
            </tr>
            <tr v-for="(aprobador, index) in solicitud.aprobadores" :key="index">
              <td>{{ aprobador.usuario }}</td>
              <td>{{ aprobador.rol }}</td>
              <td>{{ aprobador.email }}</td>
              <td>
                <button type="button" class="btn-delete" @click="removerAprobador(index)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-overlay" v-if="state.showModal" @click.self="cerrarModal">
      <div class="modal">
        <div class="modal-header">
          <h5>Agregar aprobador</h5>
          <button type="button" class="btn-close" @click.prevent="cerrarModal">×</button>
        </div>
        <div class="modal-body">
          <label>
            Seleccionar aprobador
            <select v-model="nuevoAprobador.usuario">
              <option value="" disabled>Seleccione usuario</option>
              <option value="Juan Perez">Juan Perez</option>
              <option value="Maria Gomez">Maria Gomez</option>
            </select>
          </label>
          <label>
            Rol de aprobador
            <select v-model="nuevoAprobador.rol">
              <option value="" disabled>Seleccione rol</option>
              <option value="Director Finanzas">Director Finanzas</option>
              <option value="Gerente Abastecimiento">Gerente Abastecimiento</option>
            </select>
          </label>
          <label>
            Correo electrónico
            <input type="email" v-model="nuevoAprobador.email" placeholder="ejemplo@empresa.com" />
          </label>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click.prevent="cerrarModal">Cancelar</button>
          <button type="button" class="btn-primary" @click="agregarAprobador">Guardar Aprobador</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudStore } from '../store/useSolicitudStore';

export default {
  name: 'ProcesoAutorizacion',
  data() {
    return {
      state: { showModal: false },
      nuevoAprobador: {
        usuario: '',
        rol: '',
        email: ''
      }
    };
  },
  computed: {
    solicitud() {
      return useSolicitudStore().solicitud;
    }
  },
  methods: {
    abrirModal() {
      Object.assign(this.nuevoAprobador, { usuario: '', rol: '', email: '' });
      this.state.showModal = true;
    },
    cerrarModal() {
      this.state.showModal = false;
    },
    agregarAprobador() {
      if (!this.nuevoAprobador.usuario || !this.nuevoAprobador.rol || !this.nuevoAprobador.email) {
        alert("Todos los campos del aprobador son obligatorios.");
        return;
      }
      if (!this.nuevoAprobador.email.includes('@')) {
        alert("Proporcione un correo válido.");
        return;
      }
      this.solicitud.aprobadores.push({ ...this.nuevoAprobador });
      this.cerrarModal();
    },
    removerAprobador(index) {
      this.solicitud.aprobadores.splice(index, 1);
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.card-header {
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
  padding: 1rem;
  border-bottom: 2px solid #4E9C4C;
}

.card-header h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.card-body {
  padding: 1.5rem;
}

.actions {
  margin-bottom: 1.5rem;
}

button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #4A5A63;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #3a474e;
}

.btn-primary span {
  margin-right: 0.25rem;
  font-weight: 700;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  color: #444;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.025em;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
  color: #555;
}

tr:hover {
  background: #fafafa;
}

.empty {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 2rem;
}

.btn-delete {
  background: transparent;
  color: #c0392b;
  border: 1px solid #c0392b;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
}

.btn-delete:hover {
  background: #c0392b;
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 6px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #555;
  font-weight: 500;
}

select,
input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
}

select:focus,
input:focus {
  outline: none;
  border-color: #c0392b;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e0e0e0;
}

.btn-secondary {
  background: transparent;
  color: #666;
  border: 1px solid #ccc;
}

.btn-secondary:hover {
  background: #f0f0f0;
}
</style>