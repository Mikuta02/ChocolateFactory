<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/factories">Factories</router-link> |
      <router-link to="/add-factory">Add Factory</router-link>|
      <router-link v-if="isAuthenticated" to="/cart">Cart</router-link>|
      <router-link v-if="!isAuthenticated" to="/login">Login</router-link> |
      <router-link v-if="!isAuthenticated" to="/register">Register</router-link> |
      <button v-if="isAuthenticated" @click="logout">Logout</button>
      <router-link v-if="isAuthenticated" to="/profile">Profile</router-link> |
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

    const logout = () => {
      store.dispatch('logout');
      router.push('/login');
    };

    return {
      isAuthenticated,
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
