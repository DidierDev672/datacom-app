import axios from 'axios';
import { URL_API } from "../../utils/config";

const state = {
  project: null,
  projects: [],
  loading: false,
  error: null
};

const mutations = {
  SET_LOADING(state, value) {
    state.loading = value;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_PROJECT(state, project) {
    state.project = project;
  },
  SET_PROJECTS(state, projects) {
    state.projects = projects;
  }
};

const actions = {
  async fetchProjects({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    const urlService = "api/projects";
    return new Promise((resolve, reject) => {
      axios
        .get(`${URL_API}/${urlService}/`)
        .then(({ data }) => {
          console.log('response: ', data.results)
          commit('SET_PROJECTS', data.results);
          resolve(data.results);
        })
        .catch(error => {
          console.log(
            "Ocurrió un error al consultar los proyectos: ",
            error.response
          );
          commit("SET_ERROR", error.response);
          reject(error.response);
        })
        .finally(() => {
          commit('SET_LOADING', false);
        });
    });


  },

  async fetchProjectById({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const response = await axios.get(`/api/projects/${id}`);
      commit('SET_PROJECT', response.data);
    } catch (error) {
      commit('SET_ERROR', error.response ? error.response.data : 'Error desconocido');
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const getters = {
  getProject: (state) => state.project,
  getProjects: (state) => state.projects,
  isLoading: (state) => state.loading,
  getError: (state) => state.error
};


export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
