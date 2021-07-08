import axios from "axios";

export function someMutation(/* state */) {}

export function SET_TOKEN_INFO(state, tokenInfo) {
  // state.tokenInfo = tokenInfo;
  state.loading = false;
  state.loaded = true;
  localStorage.setItem("token", JSON.stringify(tokenInfo.access_token));
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${tokenInfo.access_token}`;
}

export function SET_USER_DATA(state, userData) {
  state.user = userData;
  state.loading = false;
  localStorage.setItem("user", JSON.stringify(userData));
}

export function CLEAR_AUTHENTICATED_DATA(state) {
  state.user = null;
  state.tokenInfo = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  axios.defaults.headers.common["Authorization"] = "";
}

export function SET_ERROR(state, payload) {
  state.user = null;
  state.tokenInfo = null;
  state.loading = false;
  state.loaded = false;
  state.error = payload.data.message;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  axios.defaults.headers.common["Authorization"] = "";
}

export function INICIALIZAR(state) {
  state.loading = true;
  (state.loaded = false), (state.error = null);
}
export function FINALIZAR_PROCESO(state) {
  state.loading = false;
}
