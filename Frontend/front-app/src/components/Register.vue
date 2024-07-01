<template>
    <form @submit.prevent="register" class="register-form">
      <h2>Please enter your credentials to register</h2>
      <div>
        <label>Username:</label>
        <input type="text" v-model="username" placeholder="Username" @blur="validateUsername"/>
        <span v-if="errors.username" class="error">{{ errors.username }}</span>
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="password" @input="validatePassword"/>
        <span v-if="errors.password" class="error">{{ errors.password }}</span>
      </div>
      <div>
        <label>Confirm Password:</label>
        <input type="password" v-model="confirmPassword" @input="validatePassword"/>
        <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
      </div>
      <div>
        <label>Name:</label>
        <input type="text" v-model="name" placeholder="Name" @blur="validateName"/>
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" v-model="lastName" placeholder="Lastname" @blur="validateLastName"/>
        <span v-if="errors.lastName" class="error">{{ errors.lastName }}</span>
      </div>
      <div>
        <label>Gender:</label>
        <select v-model="gender">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" v-model="birthDate" @blur="validateBirthDate"/>
        <span v-if="errors.birthDate" class="error">{{ errors.birthDate }}</span>
      </div>
      <button type="submit">Register</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const username = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const name = ref('');
  const lastName = ref('');
  const gender = ref('Male');
  const birthDate = ref('');
  const errors = ref({});
  
  function validateUsername() {
    if (!username.value) {
      errors.value.username = 'Username is required';
    } else {
      errors.value.username = '';
    }
  }
  
  function validatePassword() {
    if (!password.value) {
      errors.value.password = 'Password is required';
    } else if (password.value !== confirmPassword.value) {
      errors.value.confirmPassword = 'Passwords do not match';
    } else {
      errors.value.password = '';
      errors.value.confirmPassword = '';
    }
  }
  
  function validateName() {
    if (!name.value) {
      errors.value.name = 'Name is required';
    } else {
      errors.value.name = '';
    }
  }
  
  function validateLastName() {
    if (!lastName.value) {
      errors.value.lastName = 'Last Name is required';
    } else {
      errors.value.lastName = '';
    }
  }
  
  function validateBirthDate() {
    if (!birthDate.value) {
      errors.value.birthDate = 'Date of Birth is required';
    } else {
      errors.value.birthDate = '';
    }
  }
  
  function register() {
    validateUsername();
    validatePassword();
    validateName();
    validateLastName();
    validateBirthDate();
  
    if (
      errors.value.username ||
      errors.value.password ||
      errors.value.confirmPassword ||
      errors.value.name ||
      errors.value.lastName ||
      errors.value.birthDate
    ) {
      return;
    }
  
    const userToRegister = {
      username: username.value,
      password: password.value,
      name: name.value,
      lastName: lastName.value,
      gender: gender.value,
      birthDate: birthDate.value,
    };
  
    axios
      .post('http://localhost:3001/api/signup', userToRegister)
      .then((response) => {
        router.push('/login');
      })
      .catch((error) => {
        if (error.response && error.response.data.error === 'Username already exists') {
          errors.value.username = 'Username already taken';
        } else {
          console.error('There was an error registering!', error);
        }
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
  
  .register-form input,
  .register-form select {
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
  