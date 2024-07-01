<template>
    <form @submit.prevent="register" class="register-form">
      <h2>Please register a Manager</h2>
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" placeholder="Username"/>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" />
      </div>
      <div>
        <label>Name:</label>
        <input type="text" v-model="name" placeholder="Name"/>
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" v-model="lastName" placeholder="Lastname"/>
      </div>
      <div>
      <label>Gender:</label>
      <select name="gender" id="gender" form="gender" v-model="gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
      </select>
    </div>
    <div>
        <label>Date of Birth:</label>
        <input type="date" v-model="birthDate"/>
      </div>
      <button type="submit">Register</button>
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
  const name = ref('');
  const lastName = ref('');
  const gender = ref('');
  const birthDate = ref('');
  const role = "Manager";

  function register() {
    const userToRegister = {
    username: username.value,
    password: password.value,
    name: name.value,
    lastName: lastName.value,
    gender: gender.value,
    birthDate: birthDate.value
    };

    axios.post(`http://localhost:3001/api/signup/${role}`, userToRegister)
      .then(response => {
        router.push('/login');
      })
      .catch(error => {
        console.error('There was an error registering!', error);
      });
    }
  </script>
  
  <style scoped>
  .register-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .register-form h2 {
    text-align: center;
    color: #4b3832;
    font-family: 'Arial', sans-serif;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase; 
    font-style: italic;
  }
  
  .register-form div {
    margin-bottom: 15px;
  }
  
  .register-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .register-form input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .register-form button {
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
  
  .register-form button:hover {
    background-color: #3a9d70;
  }
  
  .error {
    color: red;
    font-size: 0.8em;
  }
  </style>
  