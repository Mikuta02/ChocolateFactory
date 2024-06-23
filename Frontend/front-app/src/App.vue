<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/factories">Factories</router-link> |
      <router-link to="/add-factory">Add Factory</router-link>|
      <router-link to="/cart">Cart</router-link>
    </nav>
    <router-view/>
  </div>
</template>

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
