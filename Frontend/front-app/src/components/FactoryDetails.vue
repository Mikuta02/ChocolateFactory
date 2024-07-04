<template>
<div id="map" class="map"></div>
  <div class="factory-details" v-if="factory">
    <h1>DETAILED VIEW</h1>
    <h2>{{ factory.name }}</h2>
    <img :src="getFactoryLogoUrl(factory.logoPath)" :alt="factory.name + ' logo'" class="factory-logo" />
    <p>Working Hours: {{ factory.workingHours }}</p>
    <p>Status: {{ factory.status }}</p>
    <p>Location: {{ factory.location.address }}</p>
    <p>Latitude: {{ factory.location.latitude }}</p>
    <p>Longitude: {{ factory.location.longitude }}</p>
    <p>Rating: {{ factory.rating }}</p>
  
    <h2>Chocolates</h2>
    <ul v-if="chocolates.length">
      <li v-for="chocolate in chocolates" :key="chocolate.id" class="chocolate-item">
        <button @click="editChocolate(chocolate.id)" v-if="canEditChocolate(chocolate)" class="edit-button">Edit</button>
        <button @click="editAmount(chocolate.id)" v-if="canEditAmount(chocolate)" class="edit-amount-button">Edit Amount</button>
        <button @click="confirmDelete(chocolate.id)" v-if="canEditChocolate(chocolate)" class="delete-button">X</button>
        <img :src="getChocolatePictureUrl(chocolate.picturePath)" :alt="chocolate.name + ' picture'" class="chocolate-picture" />
        <div class="chocolate-details">
          <h3 class="chocolate-name">{{ chocolate.name }}</h3>
          <p>Type: {{ chocolate.chocolateType }}</p>
          <p>Variety: {{ chocolate.chocolateVariety }}</p>
          <p>Price: {{ chocolate.price }}</p>
          <p>Grams: {{ chocolate.grams }}</p>
          <p class="chocolate-description">Description: {{ chocolate.description }}</p>
          <p>Status: {{ chocolate.status }}</p>
          <p>Amount: {{ chocolate.amount }}</p>
          <div  v-if="isCustomer">
            <label for="quantity">Quantity:</label>
            <input type="number" v-model.number="chocolate.quantity" :max="chocolate.amount" min="1" />
          </div>
          <button v-if="isCustomer" @click="addToCart(chocolate.id, chocolate.quantity)" class="add-to-cart-button">Add to Cart</button>
        </div>
      </li>
    </ul>
    <p v-else>No chocolates available for this factory.</p>
      
    <button @click.prevent="showRegisterForm = true" v-if="canEditChocolate()" class="add-button">Register New Worker</button>

    <div v-if="showRegisterForm" class="register-worker-form">
      <h3>Register New Worker</h3>
      <div>
        <label>Username:</label>
        <input type="text" v-model="workerUsername" placeholder="Username" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="workerPassword" placeholder="Password" />
      </div>
      <div>
        <label>First Name:</label>
        <input type="text" v-model="workerName" placeholder="First Name" />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" v-model="workerLastName" placeholder="Last Name" />
      </div>
      <div>
        <label>Gender:</label>
        <input type="text" v-model="workerGender" placeholder="Gender" />
      </div>
      <div>
        <label>Birth Date:</label>
        <input type="date" v-model="workerBirthDate" />
      </div>
      <button @click.prevent="registerWorker" class="register-button">Register Worker</button>
    </div>


    <button @click="addNewChocolate" v-if="canEditChocolate()" class="add-button">Add New Chocolate</button>


    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>Are you sure you want to remove this chocolate from the system?</p>
        <button @click="deleteChocolate" class="confirm-button">Yes</button>
        <button @click="cancelDelete" class="cancel-button">No</button>
      </div>
    </div>


    <button v-if="canDeleteFactory()" @click="confirmDeleteFactory" class="delete-factory-button">Delete Factory</button>

    
    <div v-if="showDeleteFactoryModal" class="modal-overlay">
      <div class="modal">
        <p>Are you sure you want to delete this factory?</p>
        <button @click="deleteFactory" class="confirm-button">Yes</button>
        <button @click="cancelDeleteFactory" class="cancel-button">No</button>
      </div>
    </div>


   
    <Comments v-if="isManagerOrAdmin" :factoryId="factory.id" />
    <p v-else>You do not have permission to view comments.</p>

    <h2>Approved Comments</h2>
    <div v-if="approvedComments.length">
      <div v-for="comment in approvedComments" :key="comment.id" class="comment-item">
        <p><strong>User:</strong> {{ comment.user.username }}</p>
        <p><strong>Comment:</strong> {{ comment.text }}</p>
        <p><strong>Rating:</strong> {{ comment.rating }}</p>
      </div>
    </div>
    <p v-else>No approved comments available for this factory.</p>
  </div>
</template>

<script setup>
import { ref,computed,onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Comments from './Comments.vue'; 
import { useStore } from 'vuex';

import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Icon, Style } from 'ol/style';

const store = useStore();
const route = useRoute();
const router = useRouter();
const factory = ref(null);
const chocolates = ref([]);
const approvedComments = ref([]);
const comments = ref([]);  
const managerId = ref('');
const workers = ref([]);
const loadingChocolates = ref(false);
const showModal = ref(false);
const chocolateToDelete = ref(null);
const showDeleteFactoryModal = ref(false);

const showRegisterForm = ref(false);
const workerUsername = ref('');
const workerPassword = ref('');
const workerName = ref('');
const workerLastName = ref('');
const workerGender = ref('');
const workerBirthDate = ref('');

const isManagerOrAdmin = computed(() => {
  const role = store.getters.userRole;
  return role === 'Manager' || role === 'Administrator';
});

const isCustomer = computed(() => {
  return store.getters.userRole === 'Customer';
});

onMounted(() => {
  loadFactory();
  loadComments();
});

function registerWorker() {
  const userToRegister = {
    username: workerUsername.value,
    password: workerPassword.value,
    name: workerName.value,
    lastName: workerLastName.value,
    gender: workerGender.value,
    birthDate: workerBirthDate.value,
    worksAtFactoryId: route.params.id
  };

  axios.post(`http://localhost:3001/api/signupworker`, userToRegister)
    .then(response => {
      showRegisterForm.value = false;
    })
    .catch(error => {
      console.error('There was an error registering the worker!', error);
    });
}

function initMap() {
  if (factory.value && factory.value.location) {
    const coordinates = [factory.value.location.longitude, factory.value.location.latitude];
    const transformedCoordinates = fromLonLat(coordinates);

    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: transformedCoordinates,
        zoom: 15
      })
    });

    const iconFeature = new Feature({
      geometry: new Point(transformedCoordinates),
    });

    const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'https://openlayers.org/en/latest/examples/data/icon.png'
      })
    });

    iconFeature.setStyle(iconStyle);

    const vectorSource = new VectorSource({
      features: [iconFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);
  }
}

function loadFactory() {
  const factoryId = route.params.id;
  axios.get(`http://localhost:3001/api/factories/${factoryId}`)
    .then(response => {
      factory.value = response.data;
      loadChocolates(factoryId);
      initMap();
    })
    .catch(error => {
      console.error('Error fetching factory details:', error);
    });
}

function loadComments() {
  const factoryId = route.params.id;
  axios.get(`http://localhost:3001/api/comments/factory/${factoryId}`)
    .then(response => {
      comments.value = response.data;
      approvedComments.value = comments.value.filter(comment => comment.status === 'approved');
      console.log('Fetched comments:', comments.value);
      console.log('Filtered approved comments:', approvedComments.value);
    })
    .catch(error => {
      console.error('Error fetching comments:', error);
    });
}


function loadManager(){
  const factoryId = route.params.id;
  axios.get(`http://localhost:3001/api/users/managers/${factoryId}`)
  .then(response => {
    managerId.value = response.data.id;
    })
    .catch(error => {
      console.error('Error fetching manager details:', error);
    });
}

function loadWorkers(){
  const factoryId = route.params.id;
  axios.get(`http://localhost:3001/api/users/workers/${factoryId}`)
  .then(response => {
    workers.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching worker details:', error);
    });
}

function loadChocolates(factoryId) {
  loadingChocolates.value = true;
  axios.get(`http://localhost:3001/api/chocolates?factoryId=${factoryId}`)
    .then(response => {
      chocolates.value = response.data.map(chocolate => ({ ...chocolate, quantity: 1 }));
      loadingChocolates.value = false;
    })
    .catch(error => {
      console.error('Error fetching chocolates:', error);
      loadingChocolates.value = false;
    });
}

function addNewChocolate() {
  const factoryId = route.params.id;
  router.push({ name: 'AddChocolate', query: { factoryId } });
}

function editChocolate(chocolateId) {
  router.push({ name: 'EditChocolate', params: { factoryId: factory.value.id, chocolateId } });
}

function editAmount(chocolateId) {
  router.push({ name: 'EditAmount', params: { id: chocolateId, factoryId: factory.value.id } });
}

function confirmDelete(id) {
  chocolateToDelete.value = id;
  showModal.value = true;
}

function deleteChocolate() {
  axios.delete(`http://localhost:3001/api/chocolates/${chocolateToDelete.value}`)
    .then(() => {
      chocolates.value = chocolates.value.filter(chocolate => chocolate.id !== chocolateToDelete.value);
      showModal.value = false;
      chocolateToDelete.value = null;
    })
    .catch(error => {
      console.error('Error deleting chocolate:', error);
    });
}

function cancelDelete() {
  showModal.value = false;
  chocolateToDelete.value = null;
}

function addToCart(chocolateId, quantity) {
  const chocolate = chocolates.value.find(choc => choc.id === chocolateId);
  if (quantity > chocolate.amount) {
    alert(`Cannot add more than ${chocolate.amount} of this chocolate. Please adjust the quantity.`);
    chocolate.quantity = chocolate.amount; // Reset quantity to max available
    return;
  }

  const userId = store.getters.userId;
  const tokenPayload = store.state.token ? JSON.parse(atob(store.state.token.split('.')[1])) : {};
  const username = tokenPayload.username || '';

  axios.post('http://localhost:3001/api/cart/add', { userId, username, chocolateId, quantity }, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  })
    .then(response => {
      console.log('Added to cart:', response.data);
      alert('Chocolate successfully added to the cart.');
      loadChocolates(route.params.id); // Ponovo učitaj čokolade nakon dodavanja u korpu
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Failed to add chocolate to the cart.');
    });
}

function getFactoryLogoUrl(path) {
  return `http://localhost:3001/images/${path}`;
}

function getChocolatePictureUrl(path) {
  return `http://localhost:3001/images/${path}`;
}

function goToAddComment() {
  const factoryId = route.params.id;
  router.push({ name: 'AddComment', params: { factoryId } });
}

function canEditAmount(chocolate) {
  loadWorkers(); 
  const loggedInUserId = store.getters.userId;
  const role = store.getters.userRole;
  
  const isWorker = workers.value.some(worker => worker.id === loggedInUserId);
  
  return role === 'Worker' && isWorker;
}

function canEditChocolate(chocolate) {
  loadManager();
  const loggedInUserId = store.getters.userId;
  const role = store.getters.userRole;
  return role === 'Manager' && managerId.value === loggedInUserId;
}

function canDeleteFactory(){
  const role = store.getters.userRole;
  return role === 'Administrator';
}


function confirmDeleteFactory() {
  showDeleteFactoryModal.value = true;
}

function cancelDeleteFactory() {
  showDeleteFactoryModal.value = false;
}

function deleteFactory() {
  const factoryId = route.params.id;
  axios.delete(`http://localhost:3001/api/factories/${factoryId}`)
    .then(() => {
      showDeleteFactoryModal.value = false;
      router.push('/factories'); 
    })
    .catch(error => {

    });
}
</script>

<style scoped>
.factory-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}
.factory-logo {
  width: 500px;
  height: auto;
  margin: 20px 0;
}
.chocolate-item {
  display: flex;
  align-items: center;
  margin: 20px 0;
  border: 1px solid #000;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
.chocolate-picture {
  width: 300px;
  height: auto;
  margin-right: 20px;
}
.chocolate-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.chocolate-name {
  font-size: 24px;
  font-weight: bold;
}
.chocolate-description {
  white-space: pre-line;
}
.delete-button, .edit-button {
  position: absolute;
  top: 10px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}
.delete-button {
  right: 45px;
  background-color: red;
}
.edit-button {
  right: 10px;
  background-color: blue;
}
.add-button {
  background-color: green;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
}
.add-to-cart-button {
  background-color: orange;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}
.add-comment-button {
  background-color: blue;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.confirm-button, .cancel-button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.confirm-button {
  background-color: red;
  color: white;
}
.cancel-button {
  background-color: gray;
  color: white;
}

.register-worker-form {
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

.edit-amount-button {
  position: absolute;
  top: 10px; 
  right: 10px; 
  background-color: purple;
  width: 100px; 
  height: 30px; 
  border: none;
  border-radius: 5px; 
  color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.comment-item {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  transition: transform 0.2s, box-shadow 0.2s; 
}

.comment-item:hover {
  transform: translateY(-5px); 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
}

.comment-item p {
  margin: 0;
  padding: 5px 0;
  color: #333333; 
  font-family: 'Arial', sans-serif; 
}

.comment-item p strong {
  color: #007bff; 
}

.comment-item p:first-of-type {
  font-size: 1.1em;
  font-weight: bold; 
}

.comment-item p:nth-of-type(2) {
  font-size: 1em;
  color: #555555; 
}

.comment-item p:last-of-type {
  font-size: 0.9em;
  color: #777777; 
}


.delete-factory-button {
  background-color: red;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 20px;
}
.map {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>