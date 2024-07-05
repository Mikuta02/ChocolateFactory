// src/store/index.js

import { createStore } from 'vuex';

const store = createStore({
  state: {
    token: null,
    factories: []
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    clearToken(state) {
      state.token = null;
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    isManager(state){
        if (state.token) {
            const payload = JSON.parse(atob(state.token.split('.')[1]));
            return payload.role === "Manager";
            }
    },
    isAdministrator(state){
        if (state.token) {
            const payload = JSON.parse(atob(state.token.split('.')[1]));
            return payload.role === "Administrator";
        }
    },
    userRole(state) {
      if (state.token) {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        return payload.role;
      }
      return null;
    },
    userId(state) {
      if (state.token) {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        return payload.userId;
      }
      return null;
    },
    userFactoryId(state) {
      if (state.token) {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        return payload.factoryId; // Ensure this is correctly set in your token payload
      }
      return null;
    },
    getFactoryById: (state) => (id) => {

      return state.factories.find(factory => factory.id === id);
    }
  }
});

export default store;
