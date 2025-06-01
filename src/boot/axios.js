import Vue from 'vue'
import axios from 'axios'

let tenant = JSON.parse(localStorage.getItem("tenant"));
if (tenant) {
    axios.defaults.headers.common["X-Tenantid"] = tenant;
} else {
    // Opcional: eliminar header si no hay tenant
    delete axios.defaults.headers.common["X-Tenantid"];
}


Vue.prototype.$axios = axios


