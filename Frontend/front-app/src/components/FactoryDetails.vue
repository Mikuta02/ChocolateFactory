<template>
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
        <button @click="editChocolate(chocolate.id)" class="edit-button">Edit</button>
        <button @click="editAmount(chocolate.id)" v-if="canEditAmount(chocolate)" class="edit-amount-button">Edit Amount</button>
        <button @click="confirmDelete(chocolate.id)" class="delete-button">X</button>
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
          <div>
            <label for="quantity">Quantity:</label>
            <input type="number" v-model.number="chocolate.quantity" :max="chocolate.amount" min="1" />
          </div>
          <button @click="addToCart(chocolate.id, chocolate.quantity)" class="add-to-cart-button">Add to Cart</button>
        </div>
      </li>
    </ul>
    <p v-else>No chocolates available for this factory.</p>
      
    <button @click="addNewChocolate" class="add-button">Add New Chocolate</button>

    <button @click="goToAddComment" class="add-comment-button">Add Comment</button>

    <Comments :factoryId="factory.id" />

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>Are you sure you want to remove this chocolate from the system?</p>
        <button @click="deleteChocolate" class="confirm-button">Yes</button>
        <button @click="cancelDelete" class="cancel-button">No</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Comments from './Comments.vue'; 
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const router = useRouter();
const factory = ref(null);
const chocolates = ref([]);
const loadingChocolates = ref(false);
const showModal = ref(false);
const chocolateToDelete = ref(null);

onMounted(() => {
  loadFactory();
});

function loadFactory() {
  const factoryId = route.params.id;
  axios.get(`http://localhost:3001/api/factories/${factoryId}`)
    .then(response => {
      factory.value = response.data;
      loadChocolates(factoryId);
    })
    .catch(error => {
      console.error('Error fetching factory details:', error);
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
  const role = store.getters.userRole;
  return role === 'Worker';
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
  width: 300px;
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
  width: 100px;
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
</style>
