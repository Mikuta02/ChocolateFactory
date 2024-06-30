<template>
    <form @submit.prevent="login" class="login-form">
      <h2>Please enter your credentials to log in</h2>
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" placeholder="Username"/>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" />
      </div>
      <button type="submit">Log in</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const store = useStore();

  function login() {
    const userToLogin = {
    username: username.value,
    password: password.value
    };

    axios.post('http://localhost:3001/api/login', userToLogin, { withCredentials: true })
      .then(response => {
        store.commit('setToken', response.data.token);
        router.push('/factories');
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
      });
    }
  </script>
  
  <style scoped>
  .login-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .login-form h2 {
    text-align: center;
    color: #4b3832;
    font-family: 'Arial', sans-serif;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase; 
    font-style: italic;
  }
  
  .login-form div {
    margin-bottom: 15px;
  }
  
  .login-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .login-form input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .login-form button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
  }
  
  .login-form button:hover {
    background-color: #3a9d70;
  }
  
  .error {
    color: red;
    font-size: 0.8em;
  }
  </style>
  