<template>
    <div class="profile-page">
      <div class="profile-info" v-if="!isEditing">
        <h2>User Profile</h2>
        <div>
          <label>Username:</label>
          <span>{{ username }}</span>
        </div>
        <div>
          <label>Name:</label>
          <span>{{ name }}</span>
        </div>
        <div>
          <label>Last Name:</label>
          <span>{{ lastName }}</span>
        </div>
        <div>
          <label>Gender:</label>
          <span>{{ gender }}</span>
        </div>
        <button @click="editProfile">Edit</button>
      </div>
      
      <div class="edit-profile" v-else>
        <h2>Edit Profile</h2>
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" />
        </div>
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="name" />
        </div>
        <div>
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="lastName" />
        </div>
        <div>
          <label for="gender">Gender:</label>
          <input type="text" id="gender" v-model="gender" />
        </div>
        <button @click="saveProfile">Save</button>
        <button @click="cancelEdit">Cancel</button>
      </div>
  
      <div v-if="userRole === 'Administrator'" class="user-list">
        <h2>User List</h2>
        <div v-for="user in users" :key="user.id" class="user-item">
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Last Name:</strong> {{ user.lastName }}</p>
          <p><strong>Gender:</strong> {{ user.gender }}</p>
          <p><strong>Birth Date:</strong> {{ user.birthDate }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          <p><strong>Cart ID:</strong> {{ user.cartId }}</p>
          <p><strong>Accumulated Points:</strong> {{ user.accumulatedPoints }}</p>
          <p><strong>Customer Type:</strong> {{ user.customerType }}</p>
          <p><strong>Banned:</strong> {{ user.isBanned ? 'Yes' : 'No' }}</p>
          <hr />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { useStore } from 'vuex';
  
  const store = useStore();
  const router = useRouter();
  const users = ref([]);
  const username = ref('');
  const name = ref('');
  const lastName = ref('');
  const gender = ref('');
  const isEditing = ref(false);
  const token = store.state.token; // Get token from the store
  
  const payload = JSON.parse(atob(token.split('.')[1]));
  const userId = payload.userId;
  const userRole = payload.role;
  
  onMounted(() => {
    loadUser();
  
    if(userRole === "Administrator"){
      loadUsers();
    }
  });
  
  function loadUsers(){
    axios.get(`http://localhost:3001/api/users`)
      .then(response => {
        console.log('Users fetched:', response.data);
        users.value = response.data;
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }
  
  function loadUser() {
    axios.get(`http://localhost:3001/api/user/${userId}`)
      .then(response => {
        console.log('User fetched:', response.data);
        username.value = response.data.username;
        name.value = response.data.name;
        lastName.value = response.data.lastName;
        gender.value = response.data.gender;
      })
      .catch(error => {
        console.error('There was an error fetching the user!', error);
      });
  }
  
  function editProfile() {
    isEditing.value = true;
  }
  
  function cancelEdit() {
    isEditing.value = false;
    loadUser(); 
  }
  
  function saveProfile() {
    axios.put(`http://localhost:3001/api/users/${userId}`, {
      username: username.value,
      name: name.value,
      lastName: lastName.value,
      gender: gender.value
    })
      .then(response => {
        console.log('User updated:', response.data);
        isEditing.value = false;
      })
      .catch(error => {
        console.error('There was an error updating the user!', error);
      });
  }
  </script>
  
  <style scoped>
  .profile-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .profile-page h2 {
    text-align: center;
    color: #4b3832;
    font-family: 'Arial', sans-serif;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase; 
    font-style: italic;
  }
  
  .profile-info div,
  .edit-profile div {
    margin-bottom: 15px;
  }
  
  .profile-info label,
  .edit-profile label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .profile-info span {
    display: block;
    padding: 8px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .edit-profile input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .profile-info button,
  .edit-profile button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    margin-top: 10px;
  }
  
  .profile-info button:hover,
  .edit-profile button:hover {
    background-color: #3a9d70;
  }
  
  .edit-profile button:last-child {
    background-color: #d9534f;
  }
  
  .edit-profile button:last-child:hover {
    background-color: #c9302c;
  }
  
  .user-list {
    margin-top: 30px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .user-list h2 {
    text-align: center;
    color: #4b3832;
    font-family: 'Arial', sans-serif;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase; 
    font-style: italic;
  }
  
  .user-item {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .user-item p {
    margin: 5px 0;
  }
  
  .user-item hr {
    margin-top: 10px;
  }
  </style>
  