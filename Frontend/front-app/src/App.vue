<template>
  <div id="app">
    <nav>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <template v-if="isAuthenticated">
          |
          <router-link to="/profile">Profile</router-link>
        </template>
        <template v-else>
          |
          <router-link to="/login">Login</router-link>
          |
          <router-link to="/register">Register</router-link>
        </template>
        |
        <router-link to="/factories">Factories</router-link>
        <router-link v-if="isAuthenticated && isCustomer" to="/cart">| Cart</router-link>
      </div>
      <button v-if="isAuthenticated" class="logout-button" @click="logout">Logout</button>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import 'ol/ol.css';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isAuthenticated = computed(() => store.getters.isAuthenticated);
    const isManager = computed(() => store.getters.isManager);
    const isAdministrator = computed(() => store.getters.isAdministrator);
    const isCustomer = computed(() => store.getters.userRole === 'Customer');

    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
    };

    return {
      isAuthenticated,
      isAdministrator,
      isManager,
      isCustomer,
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
}

.nav-links {
  display: flex;
  align-items: center;
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

.logout-button {
  padding: 8px 16px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
}

.logout-button:hover {
  background-color: #c9302c;
}
</style>
