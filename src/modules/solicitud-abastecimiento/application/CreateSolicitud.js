import { SolicitudAbastecimiento } from '../domain/Solicitud';
import { ISolicitudRepository } from '../domain/ISolicitudRepository';

export class CreateSolicitud {
  // SOLID - Dependency Inversion: Dependence on abstraction (ISolicitudRepository)
  constructor(solicitudRepository) {
    this.solicitudRepository = solicitudRepository;
  }

  async execute(datosSolicitud) {
    try {
      const solicitud = new SolicitudAbastecimiento(datosSolicitud);
      
      // Valida la solictiud usando las reglas de dominio
      // (1ra Ley: validación para prevenir daños/corrupción de datos)
      if (solicitud.validar()) {
        await this.solicitudRepository.crearSolicitud(solicitud);
        console.log('✅ Orden de Solicitud de Abastecimiento creada correctamente:', solicitud);
      }
    } catch (error) {
      // Manejo claro de errores, sin ocultarlos
      console.error('❌ Error al crear la solicitud:', error.message);
      throw error;
    }
  }
}
