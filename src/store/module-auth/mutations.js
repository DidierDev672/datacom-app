import axios from "axios";
import { Notify } from "quasar";

export function someMutation(/* state */) { }

export function SET_TOKEN_INFO(state, tokenInfo) {
  // state.tokenInfo = tokenInfo;
  state.loading = false;
  state.loaded = true;
  localStorage.setItem("token", JSON.stringify(tokenInfo));
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${tokenInfo.token}`;

  Notify.create({
    type: "positive",
    position: "bottom-right",
    message: "Bienvenido a Datacom"
  });
}

export function SET_USER_DATA(state, userData) {
  state.user = userData;
  state.loading = false;
  localStorage.setItem("user", JSON.stringify(userData));
}

export function SET_TENANT_DATA(state, tenantData) {
  console.log('SET_TENANT_DATA: ', tenantData)
  state.tenant = tenantData;
  state.loading = false;
  localStorage.setItem("tenant", JSON.stringify(tenantData));
}

export function CLEAR_AUTHENTICATED_DATA(state) {
  state.user = null;
  state.tenant = null;
  state.tokenInfo = null;
  localStorage.removeItem("token");
  localStorage.removeItem("tenant");
  localStorage.removeItem("user");
  localStorage.removeItem("filtroJac");
  localStorage.removeItem("filtroIco");
  axios.defaults.headers.common["Authorization"] = "";
  axios.defaults.headers.common["X-Tenantid"] = "";
}

export function SET_ERROR(state, payload) {
  state.user = null;
  state.tenant = null;
  state.tokenInfo = null;
  state.loading = false;
  state.loaded = false;
  state.error = payload.data.message;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  axios.defaults.headers.common["Authorization"] = "";
  axios.defaults.headers.common["X-Tenantid"] = "";
  Notify.create({
    type: "negative",
    position: "bottom-right",
    message: "Usuario y/o contraseña incorrecto"
  });
}

export function INICIALIZAR(state) {
  state.loading = true;
  (state.loaded = false), (state.error = null);
}
export function FINALIZAR_PROCESO(state) {
  state.loading = false;
}
