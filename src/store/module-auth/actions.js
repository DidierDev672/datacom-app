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

export function loginAction({ commit, dispatch }, credentials) {
  const url_service = "/oauth/token";

  const body = `grant_type=password&username=${encodeURIComponent(
    credentials.username
  )}&password=${encodeURIComponent(credentials.password)}`;

  commit("INICIALIZAR");

  return new Promise((resolve, reject) => {
    axios
      .post(URL_API + url_service, body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Authorization:
            "Basic " + btoa(TOKEN_AUTH_USERNAME + ":" + TOKEN_AUTH_PASSWORD)
        }
      })
      .then(({ data }) => {
        console.log("Response: ", data);
        commit("SET_TOKEN_INFO", data);
        resolve(data);
      })
      .catch(error => {
        // console.log("Error: ", error);
        // console.log("Error Response: ", error.response["data"]);
        commit("SET_ERROR", error.response);
        Notify.create({
          type: "negative",
          message: "Usuario y/o contraseña incorrecto"
        });
        reject(error);
      });
  });
}

export function logoutAction({ commit }) {
  commit("CLEAR_AUTHENTICATED_DATA");
  this.$router.push("/auth");
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
