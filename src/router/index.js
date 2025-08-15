import Vue from "vue";
import VueRouter from "vue-router";
import money from "v-money";
import VueJWT from "vuejs-jwt";
import VueTour from "vue-tour";

import VueApexCharts from 'vue-apexcharts'

import routes from "./routes";

require("vue-tour/dist/vue-tour.css");

Vue.use(VueApexCharts);

Vue.use(VueRouter);

Vue.use(money, { precision: 4 });

Vue.use(VueJWT, { keyName: "token" });
Vue.use(VueTour);
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem("token");
    console.log("toRoute: ", to.fullPath);

    // const payload = VueJWT.jwt.decode();

    // console.log("TokenInfo: " + payload);

    //Validar fecha de caducidad del token

    // Si el usuario ya está autenticado y navega al login, redirigirlo a la ruta original o al home
    if (to.path.startsWith('/auth') && loggedIn) {
      const target = to.query.from || '/';
      next(target);
      return;
    }

    if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
      console.log("Pasa por el guard");

      try {
        sessionStorage.setItem('redirectAfterLogin', to.fullPath);
      } catch (e) { }

      next({
        path: '/auth',
        query: { from: to.fullPath } // Guarda la ruta completa (path + parámetros)
      });
    } else {
      next();
    }
  });

  return Router;
}
