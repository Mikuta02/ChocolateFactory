// src/store/index.js

import { createStore } from 'vuex';

const store = createStore({
  state: {
    token: null
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
    }
  }
});

export default store;
