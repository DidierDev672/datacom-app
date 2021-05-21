import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import categoria from './module-parametrizacion/categoria'
import parametros from './module-parametrizacion/parametros'
import fichaVivienda from './module-vivienda'
import municipios from './module-municipios'
import poblacion from './module-municipios/poblacion'
import calidadDeVida from './module-municipios/calidad-de-vida'
import viviendas from './module-municipios/viviendas'
import educacion from './module-municipios/educacion'
import coberturaServicios from './module-municipios/cobertura-servicios'
import secretarias from './module-municipios/secretarias'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      parametros,
      categoria,
      fichaVivienda,
      municipios,
      poblacion,
      calidadDeVida,
      viviendas,
      educacion,
      coberturaServicios,
      secretarias
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
