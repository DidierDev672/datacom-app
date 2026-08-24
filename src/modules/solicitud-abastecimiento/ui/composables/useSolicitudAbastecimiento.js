import { reactive, ref } from '@vue/composition-api';
import { CreateSolicitud } from '../../application/CreateSolicitud';
import { SolicitudHttpRepository } from '../../infrastructure/SolicitudHttpRepository';

export function useSolicitudAbastecimiento() {
  // Instanciar dependencias de forma sencilla
  const repository = new SolicitudHttpRepository();
  const createSolicitudUseCase = new CreateSolicitud(repository);

  // Estado reactivo (Tercera Ley: El sistema debe proteger su integridad)
  const solicitud = reactive({
    subdireccion: '',
    descripcionNecesidad: '',
    proyectos: [],
    presupuestoDisponible: 0,
    nivelAprobacion: '',
    productosServicios: [],
    observacionesProductos: '',
    aprobadores: [],
  });

  const loading = ref(false);
  const error = ref(null);

  const submit = async () => {
    loading.value = true;
    error.value = null;
    try {
      // 1ra y 3ra Ley aplicadas: Proteger los datos, y si algo falla mostrar error al usuario
      await createSolicitudUseCase.execute(solicitud);
      alert('¡Orden creada de manera exitosa!');
    } catch (e) {
      error.value = e.message;
      alert(`Error: ${e.message}`);
    } finally {
      loading.value = false;
    }
  };

  return {
    solicitud,
    loading,
    error,
    submit,
  };
}
