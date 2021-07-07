import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'
import departamento from "./module-departamento";
import encuesta from "./module-encuesta";
import informacionGeneral from "./module-municipios/informacion-general";
import tipoEncuesta from "./module-tipo-encuesta";
import categoria from "./module-parametrizacion/categoria";
import parametros from "./module-parametrizacion/parametros";
import fichaVivienda from "./module-vivienda";
import municipios from "./module-municipios";
import poblacion from "./module-municipios/poblacion";
import calidadDeVida from "./module-municipios/calidad-de-vida";
import viviendas from "./module-municipios/viviendas";
import educacion from "./module-municipios/educacion";
import coberturaServicios from "./module-municipios/cobertura-servicios";
import secretarias from "./module-municipios/secretarias";
import seguridad from "./module-municipios/seguridad";
import politicasPublicas from "./module-municipios/politicas-publicas";
import organizacion from "./module-municipios/organizaciones";
import infraestructura from "./module-municipios/infraestructura";
import finanza from "./module-municipios/finanzas";
import indicador from "./module-municipios/indicadores";
import territorio from "./module-municipios/territorio";
import medio from "./module-municipios/medios";
import producto from "./module-municipios/productos";
// ModuloComunidad
import comunidad from "./module-comunidad";
import vias from "./module-comunidad/vias-acceso";
import ecosistema from "./module-comunidad/ecosistema";
import infrasalud from "./module-comunidad/infrasalud";
import personalInfrasalud from "./module-comunidad/infrasalud/personal-infrasalud";
import servicioInfrasalud from "./module-comunidad/infrasalud/servicio-infrasalud";
import poblacionInfantil from "./module-comunidad/poblacion-infantil";
import comiteEmergencia from "./module-comunidad/comite-emergencia";
import actividadEconomica from "./module-comunidad/actividad-economica";
import participacionCiudadana from "./module-comunidad/participacion-ciudadana";
import programasEducativos from "./module-comunidad/programas-educativos";
import personalInstitucionEducativa from "./module-comunidad/programas-educativos/personal-institucion-educativa";
import personalComiteEmergencia from "src/store/module-comunidad/comite-emergencia/personal-comite-emergencia";

import contratos from "./module-jac/contratos/";
import habilidades from "./module-jac/habilidades";
import jacInfo from "./module-jac/jac-info";
import juntaDirectiva from "./module-jac/junta-directiva";
import participacion from "./module-jac/participacion";
import proyectosProductivos from "./module-jac/proyectos-productivos";

//ModuleJac
import jac from "./module-jac";
import detalleAutoevaluacion from "./module-jac/autoevaluacion";
import planTrabajo from "./module-jac/plan-trabajo";
import planTrabajoDetalle from "./module-jac/plan-trabajo-detalle";
//ModuleVivienda
import datosVivienda from "./module-vivienda/datos-vivienda";
import persona from "./module-vivienda/personas";
import productoVivienda from "./module-vivienda/productos";
//ModuleFileManager
import fileManager from "./module-file-manager";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      departamento,
      encuesta,
      informacionGeneral,
      tipoEncuesta,
      parametros,
      categoria,
      fichaVivienda,
      municipios,
      poblacion,
      calidadDeVida,
      viviendas,
      educacion,
      coberturaServicios,
      secretarias,
      seguridad,
      politicasPublicas,
      organizacion,
      infraestructura,
      finanza,
      indicador,
      territorio,
      medio,
      producto,
      //ModuloComunidad
      comunidad,
      vias,
      ecosistema,
      infrasalud,
      personalInfrasalud,
      servicioInfrasalud,
      poblacionInfantil,
      comiteEmergencia,
      actividadEconomica,
      participacionCiudadana,
      programasEducativos,
      personalInstitucionEducativa,
      personalComiteEmergencia,

      //modulo jac
      contratos,
      habilidades,
      jacInfo,
      juntaDirectiva,
      participacion,
      proyectosProductivos,
      jac,
      detalleAutoevaluacion,
      planTrabajo,
      planTrabajoDetalle,
      //ModuleVivienda
      datosVivienda,
      persona,
      productoVivienda,
      //ModuleFileManager
      fileManager
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  });

  return Store;
}
