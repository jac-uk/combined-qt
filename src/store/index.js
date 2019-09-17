import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations } from "vuexfire";

// Modules
import app from "@/store/modules/app";
import counters from "@/store/modules/counters";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  namespaced: true,
  modules: {
    app,
    counters,
  },
  mutations: vuexfireMutations
});

export default store;
