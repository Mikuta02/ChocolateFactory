<template>
  <form @submit.prevent="handleSubmit" class="add-factory-form">
    <h2>Add New Factory</h2>
    <div>
      <label>Name:</label>
      <input type="text" v-model="name" placeholder="Factory Name" />
    </div>
    <div>
      <label>Working Hours:</label>
      <input type="text" v-model="workingHours" placeholder="e.g., 9am-5pm" />
    </div>
    <div>
      <label>Status:</label>
      <input type="text" v-model="status" placeholder="e.g., open/closed" />
    </div>
    <div>
      <label>Latitude:</label>
      <input type="number" v-model="latitude" step="any" placeholder="e.g., 44.7866" />
      <span v-if="latitudeError" class="error">{{ latitudeError }}</span>
    </div>
    <div>
      <label>Longitude:</label>
      <input type="number" v-model="longitude" step="any" placeholder="e.g., 20.4489" />
      <span v-if="longitudeError" class="error">{{ longitudeError }}</span>
    </div>
    <div id="map" class="map"></div>
    <div>
      <label>Address:</label>
      <input type="text" v-model="address" placeholder="e.g., Ulica 123, Grad, 11000 or Ulica 123, Grad 11000" />
      <span v-if="addressError" class="error">{{ addressError }}</span>
    </div>
    <div>
      <label>Logo URL:</label>
      <input type="text" v-model="logoPath" placeholder="e.g., http://example.com/logo.jpg" />
    </div>
    <div>
      <label>Rating:</label>
      <input type="number" v-model="rating" step="any" placeholder="e.g., 4.5" />
    </div>
    <div>
      <label>Manager:</label>
      <select v-model="managerId">
        <option value="" disabled>Select a manager</option>
        <option v-for="manager in freeManagers" :key="manager.id" :value="manager.id">
          {{ manager.name }} {{ manager.lastName }}
        </option>
      </select>
      <button v-if="freeManagers.length === 0" @click.prevent="showRegisterForm = true" class="register-button">Register New Manager</button>
    </div>
    <div v-if="showRegisterForm" class="register-manager-form">
      <h3>Register New Manager</h3>
      <div>
        <label>Username:</label>
        <input type="text" v-model="managerUsername" placeholder="Username" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="managerPassword" placeholder="Password" />
      </div>
      <div>
        <label>First Name:</label>
        <input type="text" v-model="managerName" placeholder="First Name" />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" v-model="managerLastName" placeholder="Last Name" />
      </div>
      <div>
        <label>Gender:</label>
        <input type="text" v-model="managerGender" placeholder="Gender" />
      </div>
      <div>
        <label>Birth Date:</label>
        <input type="date" v-model="managerBirthDate" />
      </div>
      <button @click.prevent="registerManager" class="register-button">Register Manager</button>
    </div>
    <button type="submit">Add Factory</button>
  </form>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';

const router = useRouter();
const name = ref('');
const workingHours = ref('');
const status = ref('');
const latitude = ref('');
const longitude = ref('');
const address = ref('');
const logoPath = ref('');
const managerId = ref('');
const rating = ref(0);
const freeManagers = ref([]);

const role = "Manager";

const showRegisterForm = ref(false);
const managerUsername = ref('');
const managerPassword = ref('');
const managerName = ref('');
const managerLastName = ref('');
const managerGender = ref('');
const managerBirthDate = ref('');

const latitudeError = ref('');
const longitudeError = ref('');
const addressError = ref('');

const apiKey = 'b37e021a32e1470785f50fce7fb07b2d';

let map;

function validateAddress(address) {
  const regex = /^[a-zA-Z0-9\s,.'-]+, [a-zA-Z\s]+ ?\d{5}$/;
  return true;
}

function registerManager() {
  const userToRegister = {
    username: managerUsername.value,
    password: managerPassword.value,
    name: managerName.value,
    lastName: managerLastName.value,
    gender: managerGender.value,
    birthDate: managerBirthDate.value
  };

  axios.post(`http://localhost:3001/api/signup/${role}`, userToRegister)
    .then(response => {
      managerId.value = response.data.id;
      showRegisterForm.value = false;
      loadManagers();
    })
    .catch(error => {
      console.error('There was an error registering the manager!', error);
    });
}

function loadManagers() {
  axios.get('http://localhost:3001/api/users/freeManagers')
    .then(response => {
      freeManagers.value = response.data;
    })
    .catch(error => {
      console.error('There was an error fetching the managers!', error);
    });
}

async function getAddressFromCoordinates(lat, lon) {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: `${lat},${lon}`,
        key: apiKey
      }
    });
    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results[0].formatted;
    } else {
      return 'Address not found';
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Error fetching address';
  }
}

onMounted(() => {
  loadManagers();

  // Initialize the OpenLayers map
  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat([20.4489, 44.7866]),
      zoom: 6
    })
  });

  // Add a click event listener to the map
  map.on('click', async function (evt) {
    const coords = toLonLat(evt.coordinate);
    longitude.value = coords[0].toFixed(6);
    latitude.value = coords[1].toFixed(6);

    address.value = await getAddressFromCoordinates(latitude.value, longitude.value);
  });
});

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
    rating: rating.value,
    managerId: managerId.value
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

.add-factory-form input,
.add-factory-form select {
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

#map {
  width: 100%;
  height: 400px;
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.register-manager-form {
  margin-top: 20px;
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 5px;
}

.register-button {
  background-color: #007bff;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>

