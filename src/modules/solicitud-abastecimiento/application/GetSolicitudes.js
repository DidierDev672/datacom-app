export class GetSolicitudes {
    /**
     * @param {import('../domain/ISolicitudRepository').ISolicitudRepository} repository
     */
    constructor(repository) {
        this.repository = repository;
    }

    async execute() {
        return await this.repository.obtenerTodas();
    }
}
