import { defineStore } from "pinia";
import client from "src/api/client";
import { colaboradoresApi } from "src/api/colaboradores.api";

const EMPTY_COLABORADOR = {
      // 1. Información Personal
      nombreCompleto: "",
      tipoDocumento: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      genero: "",
      nacionalidad: "Colombiana",

      // 2. Datos de contacto
      telefono: "",
      correoElectronico: "",
      direccionResidencia: "",

      // 3. Información Laboral
      fechaIngreso: "",
      tipoContrato: "",
      estado: "Activo",

      // 4. Formación y Experiencia
      nivelEducativo: "",
      profesion: "",
      experienciaLaboral: "",
      urlCertificadoPdf: "",

      // 5. Información administrativa
      eps: "",
      fondoPension: "",
      arl: "",
};

export const useTalentoHumanoStore = defineStore("talentoHumano", {
  state: () => ({
    colaborador: { ...EMPTY_COLABORADOR },
    colaboradores: [],
    loading: false,
    error: null,
    step: 1,
  }),
  actions: {
    async registrarColaborador() {
      this.loading = true;
      this.error = null;
      try {
        console.log(
          "📤 Enviando payload al backend:",
          JSON.stringify(this.colaborador, null, 2)
        );
        const response = await client.post(
          "/api/v1/colaboradores",
          this.colaborador
        );
        console.log("✅ Respuesta del servidor:", response.data);
        this.resetForm();
        return response.data;
      } catch (e) {
        this.error =
          (e.response && e.response.data && e.response.data.message) ||
          "Error al registrar colaborador";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async fetchColaboradores() {
      this.loading = true;
      this.error = null;
      try {
        const data = await colaboradoresApi.getAll();
        this.colaboradores = Array.isArray(data) ? data : [];
        return this.colaboradores;
      } catch (e) {
        this.error =
          (e.response && e.response.data && e.response.data.message) ||
          "Error al obtener la lista de colaboradores";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async createColaborador(payload) {
      this.loading = true;
      this.error = null;
      try {
        const created = await colaboradoresApi.create(payload);
        if (created && created.id) {
          const index = this.colaboradores.findIndex(function (c) {
            return c.id === created.id;
          });
          if (index >= 0) {
            this.colaboradores.splice(index, 1, created);
          } else {
            this.colaboradores.push(created);
          }
        }
        return created;
      } catch (e) {
        this.error =
          (e.response && e.response.data && e.response.data.message) ||
          "Error al registrar colaborador";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async updateColaborador(id, payload) {
      this.loading = true;
      this.error = null;
      try {
        const updated = await colaboradoresApi.update(id, payload);
        const index = this.colaboradores.findIndex(function (c) {
          return c.id === id;
        });
        if (index >= 0) {
          this.colaboradores.splice(index, 1, updated);
        } else {
          this.colaboradores.push(updated);
        }
        return updated;
      } catch (e) {
        this.error =
          (e.response && e.response.data && e.response.data.message) ||
          "Error al actualizar colaborador";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async deleteColaborador(id) {
      this.loading = true;
      this.error = null;
      try {
        await client.delete("/api/v1/colaboradores/" + id);
        this.colaboradores = this.colaboradores.filter(function (colaborador) {
          return colaborador.id !== id;
        });
      } catch (e) {
        this.error =
          (e.response && e.response.data && e.response.data.message) ||
          "Error al eliminar colaborador";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.colaborador = { ...EMPTY_COLABORADOR };
      this.step = 1;
      this.error = null;
    },
  },
});
