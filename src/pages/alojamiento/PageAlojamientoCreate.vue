<template>
  <div class="alojamiento-page">
    <!-- Header con gradiente verde cromático y animación slide-in -->
    <header class="alojamiento-header">
      <div class="header-container">
        <div class="header-box">
          <h1 class="alojamiento-title">Registro de Alojamiento</h1>
          <p class="alojamiento-subtitle">
            ¡Bienvenido! Completa los datos del alojamiento y tu solicitud quedará lista para gestionarse.
          </p>
        </div>
      </div>
    </header>

    <!-- Card del formulario con aparición gradual -->
    <Transition name="fade" appear>
      <div class="alojamiento-card">
        <form class="alojamiento-form" novalidate @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-field">
              <label class="field-label" for="fechaSolicitud">Fecha de solicitud *</label>
              <input
                id="fechaSolicitud"
                v-model="form.fechaSolicitud"
                type="date"
                class="field-input"
                :class="{ 'field-error': errors.fechaSolicitud }"
              />
              <span v-if="errors.fechaSolicitud" class="field-error-message">
                {{ errors.fechaSolicitud }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="fechaReserva">Fecha de reserva *</label>
              <input
                id="fechaReserva"
                v-model="form.fechaReserva"
                type="date"
                class="field-input"
                :class="{ 'field-error': errors.fechaReserva }"
              />
              <span v-if="errors.fechaReserva" class="field-error-message">
                {{ errors.fechaReserva }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="nombreEmpleadoContratista">
                Nombre empleado / contratista *
              </label>
              <input
                id="nombreEmpleadoContratista"
                v-model="form.nombreEmpleadoContratista"
                type="text"
                class="field-input"
                placeholder="Ej: Carlos Pérez"
                :class="{ 'field-error': errors.nombreEmpleadoContratista }"
              />
              <span v-if="errors.nombreEmpleadoContratista" class="field-error-message">
                {{ errors.nombreEmpleadoContratista }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="cedula">Cédula *</label>
              <input
                id="cedula"
                v-model="form.cedula"
                type="text"
                inputmode="numeric"
                maxlength="12"
                class="field-input"
                placeholder="Ej: 1234567890"
                :class="{ 'field-error': errors.cedula }"
              />
              <span v-if="errors.cedula" class="field-error-message">
                {{ errors.cedula }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="correo">Correo electrónico *</label>
              <input
                id="correo"
                v-model="form.correo"
                type="email"
                class="field-input"
                placeholder="Ej: correo@dominio.com"
                :class="{ 'field-error': errors.correo }"
              />
              <span v-if="errors.correo" class="field-error-message">
                {{ errors.correo }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="municipio">Municipio *</label>
              <input
                id="municipio"
                v-model="form.municipio"
                type="text"
                class="field-input"
                placeholder="Ej: Neiva"
                :class="{ 'field-error': errors.municipio }"
              />
              <span v-if="errors.municipio" class="field-error-message">
                {{ errors.municipio }}
              </span>
            </div>

            <div class="form-field form-field-full">
              <label class="field-label" for="motivoViaje">Motivo del viaje *</label>
              <textarea
                id="motivoViaje"
                v-model="form.motivoViaje"
                rows="3"
                class="field-input field-textarea"
                placeholder="Breve descripción del motivo del viaje"
                :class="{ 'field-error': errors.motivoViaje }"
              ></textarea>
              <span v-if="errors.motivoViaje" class="field-error-message">
                {{ errors.motivoViaje }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="fechaIngreso">Fecha de ingreso *</label>
              <input
                id="fechaIngreso"
                v-model="form.fechaIngreso"
                type="date"
                class="field-input"
                :class="{ 'field-error': errors.fechaIngreso }"
              />
              <span v-if="errors.fechaIngreso" class="field-error-message">
                {{ errors.fechaIngreso }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label" for="fechaSalida">Fecha de salida *</label>
              <input
                id="fechaSalida"
                v-model="form.fechaSalida"
                type="date"
                class="field-input"
                :class="{ 'field-error': errors.fechaSalida }"
              />
              <span v-if="errors.fechaSalida" class="field-error-message">
                {{ errors.fechaSalida }}
              </span>
            </div>

            <div class="form-field form-field-full">
              <label class="field-label" for="proyectoCentroCostoPertenece">
                Proyecto / Centro de costo al que pertenece
              </label>
              <input
                id="proyectoCentroCostoPertenece"
                v-model="form.proyectoCentroCostoPertenece"
                type="text"
                class="field-input"
                placeholder="Ej: Proyecto Datacom - CC 0012"
              />
            </div>

            <div class="form-field form-field-full">
              <label class="field-label" for="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                v-model="form.observaciones"
                rows="3"
                class="field-input field-textarea"
                placeholder="Notas adicionales (opcional)"
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="reset" class="btn btn-secondary" @click="resetForm">
              Limpiar
            </button>
            <button type="submit" class="btn btn-primary">Registrar alojamiento</button>
          </div>
        </form>

        <!-- Resultado simulado del envío -->
        <Transition name="fade">
          <div v-if="mostrarResultado" class="result-panel">
            <p class="result-title">✅ Solicitud lista para enviar:</p>
            <pre class="result-json">{{ resultadoEnvio }}</pre>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'PageAlojamientoCreate',
  setup(props, { root }) {
    const form = reactive({
      fechaSolicitud: '',
      fechaReserva: '',
      nombreEmpleadoContratista: '',
      cedula: '',
      correo: '',
      motivoViaje: '',
      municipio: '',
      fechaIngreso: '',
      fechaSalida: '',
      proyectoCentroCostoPertenece: '',
      observaciones: ''
    });

    const errors = reactive({
      fechaSolicitud: '',
      fechaReserva: '',
      nombreEmpleadoContratista: '',
      cedula: '',
      correo: '',
      motivoViaje: '',
      municipio: '',
      fechaIngreso: '',
      fechaSalida: ''
    });

    const mostrarResultado = ref(false);
    const resultadoEnvio = ref('');

    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    function validateForm() {
      let valid = true;

      errors.fechaSolicitud = form.fechaSolicitud ? '' : 'La fecha de solicitud es requerida.';
      errors.fechaReserva = form.fechaReserva ? '' : 'La fecha de reserva es requerida.';

      errors.nombreEmpleadoContratista = form.nombreEmpleadoContratista
        ? ''
        : 'El nombre del empleado o contratista es requerido.';

      if (!form.cedula) {
        errors.cedula = 'La cédula es requerida.';
      } else if (!/^\d{6,12}$/.test(form.cedula.replace(/[.\s-]/g, ''))) {
        errors.cedula = 'La cédula debe contener entre 6 y 12 dígitos.';
      } else {
        errors.cedula = '';
      }

      if (!form.correo) {
        errors.correo = 'El correo electrónico es requerido.';
      } else if (!validateEmail(form.correo)) {
        errors.correo = 'Ingrese un correo electrónico válido.';
      } else {
        errors.correo = '';
      }

      errors.municipio = form.municipio ? '' : 'El municipio es requerido.';
      errors.motivoViaje = form.motivoViaje ? '' : 'El motivo del viaje es requerido.';

      errors.fechaIngreso = form.fechaIngreso ? '' : 'La fecha de ingreso es requerida.';
      errors.fechaSalida = form.fechaSalida ? '' : 'La fecha de salida es requerida.';

      if (form.fechaIngreso && form.fechaSalida && form.fechaSalida < form.fechaIngreso) {
        errors.fechaSalida = 'La fecha de salida no puede ser anterior al ingreso.';
      }

      const keys = Object.keys(errors);
      for (let i = 0; i < keys.length; i++) {
        if (errors[keys[i]]) {
          valid = false;
        }
      }

      return valid;
    }

    function handleSubmit() {
      if (!validateForm()) {
        root.$q.notify({
          type: 'negative',
          message: 'Revisa los campos marcados en rojo.'
        });
        return;
      }

      const datosEnvio = JSON.parse(JSON.stringify(form));
      console.log('Datos del alojamiento:', datosEnvio);
      console.log('JSON de envío:', JSON.stringify(datosEnvio, null, 2));

      resultadoEnvio.value = JSON.stringify(datosEnvio, null, 2);
      mostrarResultado.value = true;

      root.$q.notify({
        type: 'positive',
        message: 'Alojamiento registrado correctamente.'
      });
    }

    function resetForm() {
      const keys = Object.keys(form);
      for (let i = 0; i < keys.length; i++) {
        form[keys[i]] = '';
      }
      const errorKeys = Object.keys(errors);
      for (let j = 0; j < errorKeys.length; j++) {
        errors[errorKeys[j]] = '';
      }
      mostrarResultado.value = false;
      resultadoEnvio.value = '';
    }

    return {
      form,
      errors,
      mostrarResultado,
      resultadoEnvio,
      handleSubmit,
      resetForm
    };
  }
});
</script>

<style scoped>
.alojamiento-page {
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  color: #1f2937;
}

/* Header con gradiente lineal verde cromático */
.alojamiento-header {
  background: linear-gradient(135deg, #14532d 0%, #16a34a 50%, #4ade80 100%);
  color: #ffffff;
  border-radius: 14px;
  padding: 32px 28px;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.35);
  /* Slide-in: entra deslizándose desde la izquierda */
  animation: slide-in-left 0.6s ease-out;
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.header-container {
  display: flex;
}

.header-box {
  padding: 6px 14px;
  border-left: 4px solid rgba(255, 255, 255, 0.65);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  width: 100%;
}

.alojamiento-title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.alojamiento-subtitle {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #d9f99d;
  opacity: 0.95;
}

/* Card del formulario */
.alojamiento-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-field-full {
  grid-column: 1 / -1;
}

.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  font-size: 14px;
  color: #1f2937;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);
  background: #ffffff;
}

.field-textarea {
  resize: vertical;
  font-family: inherit;
}

.field-error {
  border-color: #dc2626;
}

.field-input.field-error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.field-error-message {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #dc2626;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: #ffffff;
}

.btn-primary:hover {
  opacity: 0.92;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Panel de resultado de la simulación */
.result-panel {
  margin-top: 20px;
  padding: 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
}

.result-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #166534;
}

.result-json {
  margin: 0;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  color: #166534;
}

/* Efecto fade in (aparición gradual) */
.fade-enter-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

/* Responsive */
@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>