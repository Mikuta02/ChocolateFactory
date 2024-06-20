<template>
  <form @submit.prevent="handleSubmit" class="add-factory-form">
    <h2>Add New Factory</h2>
    <div>
      <label>Name:</label>
      <input type="text" v-model="name" placeholder="Factory Name"/>
    </div>
    <div>
      <label>Working Hours:</label>
      <input type="text" v-model="workingHours" placeholder="e.g., 9am-5pm"/>
    </div>
    <div>
      <label>Status:</label>
      <input type="text" v-model="status" placeholder="e.g., open/closed"/>
    </div>
    <div>
      <label>Latitude:</label>
      <input type="number" v-model="latitude" step="any" placeholder="e.g., 44.7866"/>
      <span v-if="latitudeError" class="error">{{ latitudeError }}</span>
    </div>
    <div>
      <label>Longitude:</label>
      <input type="number" v-model="longitude" step="any" placeholder="e.g., 20.4489"/>
      <span v-if="longitudeError" class="error">{{ longitudeError }}</span>
    </div>
    <div>
      <label>Address:</label>
      <input type="text" v-model="address" placeholder="e.g., Ulica 123, Grad, 11000 or Ulica 123, Grad 11000"/>
      <span v-if="addressError" class="error">{{ addressError }}</span>
    </div>
    <div>
      <label>Logo URL:</label>
      <input type="text" v-model="logoPath" placeholder="e.g., http://example.com/logo.jpg"/>
    </div>
    <div>
      <label>Rating:</label>
      <input type="number" v-model="rating" step="any" placeholder="e.g., 4.5"/>
    </div>
    <button type="submit">Add Factory</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const workingHours = ref('');
const status = ref('');
const latitude = ref('');
const longitude = ref('');
const address = ref('');
const logoPath = ref('');
const rating = ref(0);

const latitudeError = ref('');
const longitudeError = ref('');
const addressError = ref('');

function validateAddress(address) {
  const regex = /^[a-zA-Z0-9\s,.'-]+, [a-zA-Z\s]+ ?\d{5}$/;
  return regex.test(address);
}

function handleSubmit() {
  latitudeError.value = '';
  longitudeError.value = '';
  addressError.value = '';

  if (isNaN(latitude.value) || latitude.value === '') {
    latitudeError.value = 'Latitude must be a number';
    return;
  }

  if (isNaN(longitude.value) || longitude.value === '') {
    longitudeError.value = 'Longitude must be a number';
    return;
  }

  if (!validateAddress(address.value)) {
    addressError.value = 'Invalid address format (e.g., Ulica 123, Grad, 11000 or Ulica 123, Grad 11000)';
    return;
  }

  const newFactory = {
    name: name.value,
    workingHours: workingHours.value,
    status: status.value,
    latitude: parseFloat(latitude.value),
    longitude: parseFloat(longitude.value),
    address: address.value,
    logoPath: logoPath.value,
    rating: rating.value
  };

  axios.post('http://localhost:3001/api/factories', newFactory)
    .then(response => {
      console.log('Factory successfully added:', response.data);
      router.push('/factories');
    })
    .catch(error => {
      console.error('There was an error adding the factory!', error);
    });
}
</script>

<style scoped>
.add-factory-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.add-factory-form h2 {
  text-align: center;
  color: #4b3832;
  font-family: 'Arial', sans-serif;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase; 
  font-style: italic;
}

.add-factory-form div {
  margin-bottom: 15px;
}

.add-factory-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.add-factory-form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-factory-form button {
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

.add-factory-form button:hover {
  background-color: #3a9d70;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>
