import axios from "axios";
import { Notify } from "quasar";
import {
  URL_API,
  TOKEN_AUTH_USERNAME,
  TOKEN_AUTH_PASSWORD
} from "../../utils/config";

export function registerAction({ dispatch }, credentials) {
  dispatch("ui/activarLoading", null, { root: true });
  const url_service = "/auth/signup";

  if (credentials.accept !== true) {
    Notify.create({
      type: "negative",
      message: "Debe aceptar los términos y condiciones",
      position: "bottom-right"
    });
    dispatch("ui/desactivarLoading", null, { root: true });
  } else {
    axios
      .post(URL_API + url_service, credentials)
      .then(response => {
        dispatch("ui/desactivarLoading", null, { root: true });
        Notify.create({
          type: "positive",
          message:
            "Su cuenta se ha registrado correctamente, favor inicie sesión",
          position: "bottom-right"
        });
        this.$router.push("/auth");
      })
      .catch(error => {
        dispatch("ui/desactivarLoading", null, { root: true });
        // console.log(error.response)
        // let errores = Object.keys(JSON.parse(JSON.stringify(error.response.data)));
        // console.log(errores)
        let errores = JSON.stringify(error.response.data);
        Notify.create({
          type: "negative",
          message: errores,
          position: "bottom-right"
        });
      });
  }
}

export function loginAction({ commit }, credentials) {
  //const url_service = "/oauth/token";
  const url_service = "/login";

  //const body = `username=${credentials.username}&password=${credentials.password}`;

  commit("INICIALIZAR");

  return new Promise((resolve, reject) => {
    let tenant = JSON.parse(localStorage.getItem("tenant"));
    if (tenant) {
      axios.defaults.headers.common["X-Tenantid"] = tenant;
    } else {
      // Opcional: eliminar header si no hay tenant
      delete axios.defaults.headers.common["X-Tenantid"];
    }
    axios
      .post(URL_API + url_service, {
        username: credentials.username,
        password: credentials.password
      })
      .then(({ data }) => {
        commit("SET_TOKEN_INFO", data);
        resolve(data);
      })
      .catch(error => {
        commit("SET_ERROR", error.response);
        reject(error);
      });
  });
}

export function logoutAction({ commit }) {
  try{
    commit("CLEAR_AUTHENTICATED_DATA");
    this.$router.push("/auth").catch(navigationError => {
      if(navigationError.name === 'NavigationDuplicated'){
        console.log('Navegación duplicada ignorada');
        return;
      }
      throw navigationError;
    })
  }catch(error){
    console.error('Error en logoutAction:', error);
  }
}

// export function changePassword({ commit }, payload) {
//   const url_service = "user";
//   commit("INICIALIZAR");
//   axios
//     .post(`${URL_API}/${url_service}/${payload.user}/password`, payload)
//     .then(() => {
//       Notify.create({
//         type: "positive",
//         message: "Su contraseña se ha actualizado correctamente"
//       });
//       commit("FINALIZAR_PROCESO");
//     })
//     .catch(error => {
//       commit("SET_ERROR", error.response);
//     });
// }

// export function changeFoto({ commit }, payload) {
//   const url_service = "user";
//   commit("INICIALIZAR");

//   let formData = new FormData();
//   formData.append("avatar", payload.avatar);

//   axios
//     .post(`${URL_API}/${url_service}/${payload.user}/avatar`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data"
//       }
//     })
//     .then(({ data }) => {
//       commit("SET_USER_DATA", data.data);
//       Notify.create({
//         type: "positive",
//         message: "Su foto de perfil se ha actualizado correctamente"
//       });
//       this.$router.push("/settings");
//     });
// }
