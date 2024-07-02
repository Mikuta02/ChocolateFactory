<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/factories">Factories</router-link> |
      <router-link to="/add-factory">Add Factory</router-link>|
      <router-link v-if="isAuthenticated" to="/cart">Cart</router-link>|
      <router-link v-if="isAuthenticated" to="/purchases">My Purchases</router-link>|
      <router-link v-if="isAuthenticated && isManager" to="/manager-purchases">Factory Purchases</router-link> <!-- Dodata nova ruta za menadžera -->
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link> |
      <router-link v-if="!isAuthenticated" to="/register">Register</router-link> |
      <button v-if="isAuthenticated" @click="logout">Logout</button>
      <router-link v-if="isAuthenticated" to="/profile">Profile</router-link> |
      <router-link v-if="isAuthenticated && isAdministrator" to="/registerManager">Register Manager</router-link>
      <router-link v-if="isAuthenticated && isManager" to="/registerWorker">Register Worker</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const isManager = computed(() => store.getters.isManager);
    const isAdministrator = computed(() => store.getters.isAdministrator);

    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
    };

    return {
      isAuthenticated,
      isAdministrator,
      isManager,
      logout
    };
  }
};
</script>

<style>
#app {
  font-family: 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #D2B48C; /* svetlija braon boja */
  min-height: 100vh;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  padding: 0 15px;
  font-size: 1.2em; /* povećan font */
  transition: color 0.3s;
}

nav a.router-link-exact-active {
  color: #4b3832; /* tamno braon boja */
}

nav a:hover {
  color: #FFD700; /* zlatna boja na hover */
}
</style>
