import axios from 'axios';
import { URL_API } from "../../utils/config";

const state = {
  supplyPlan: null,
  supplyPlans: [],
  planItems: [],
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
  SET_SUPPLY_PLAN(state, supplyPlan) {
    state.supplyPlan = supplyPlan;
  },
  SET_SUPPLY_PLANS(state, supplyPlans) {
    state.supplyPlans = supplyPlans;
  },
  SET_PLAN_ITEMS(state, planItems) {
    state.planItems = planItems;
  }
};

const actions = {
  async fetchSupplyPlans({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    const urlService = "api/v1/supply-plans";
    return new Promise((resolve, reject) => {
      axios
        .get(`${URL_API}/${urlService}`)
        .then(({ data }) => {
          console.log('Supply plans response: ', data);
          commit('SET_SUPPLY_PLANS', data);
          resolve(data);
        })
        .catch(error => {
          console.log(
            "Ocurrió un error al consultar los planes de abastecimiento: ",
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

  async fetchSupplyPlanById({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    const urlService = "api/v1/supply-plans";
    return new Promise((resolve, reject) => {
      axios
        .get(`${URL_API}/${urlService}/${id}/`)
        .then(({ data }) => {
          console.log('Supply plan by id response: ', data);
          commit('SET_SUPPLY_PLAN', data);
          resolve(data);
        })
        .catch(error => {
          console.log(
            "Ocurrió un error al consultar el plan de abastecimiento: ",
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

  async fetchSupplyPlanItems({ commit }, planId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    const urlService = `api/v1/supply-plans/${planId}/items`;
    return new Promise((resolve, reject) => {
      axios
        .get(`${URL_API}/${urlService}`)
        .then(({ data }) => {
          console.log('Supply plan items response: ', data);
          commit('SET_PLAN_ITEMS', data);
          resolve(data);
        })
        .catch(error => {
          console.log(
            "Ocurrió un error al consultar los items del plan de abastecimiento: ",
            error.response
          );
          commit("SET_ERROR", error.response);
          reject(error.response);
        })
        .finally(() => {
          commit('SET_LOADING', false);
        });
    });
  }
};

const getters = {
  getSupplyPlan: (state) => state.supplyPlan,
  getSupplyPlans: (state) => state.supplyPlans,
  getPlanItems: (state) => state.planItems,
  isLoading: (state) => state.loading,
  getError: (state) => state.error,
  getActiveSupplyPlans: (state) => state.supplyPlans.filter(plan => plan.status === 'ACTIVE'),
  getSupplyPlanById: (state) => (id) => state.supplyPlans.find(plan => plan.id === id)
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
} 