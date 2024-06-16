<template>
  <form @submit.prevent="handleSubmit" class="edit-chocolate-form">
    <h2>Edit Chocolate</h2>
    <div>
      <label>Name:</label>
      <input type="text" v-model="chocolate.name" />
    </div>
    <div>
      <label>Price:</label>
      <input type="number" v-model="chocolate.price" />
    </div>
    <div>
      <label>Grams:</label>
      <input type="number" v-model="chocolate.grams" />
    </div>
    <div>
      <label>Description:</label>
      <input type="text" v-model="chocolate.description" />
    </div>
    <div>
      <label>Photo URL:</label>
      <input type="text" v-model="chocolate.picturePath" />
    </div>
    <div>
      <label>Chocolate Type:</label>
      <select v-model="chocolate.chocolateType">
        <option value="Normal">Normal</option>
        <option value="Drink">Drink</option>
        <option value="Cooking">Cooking</option>
      </select>
    </div>
    <div>
      <label>Chocolate Variety:</label>
      <select v-model="chocolate.chocolateVariety">
        <option value="Milk">Milk</option>
        <option value="Dark">Dark</option>
        <option value="White">White</option>
        <option value="Nuts">Nuts</option>
        <option value="Nougat">Nougat</option>
        <option value="Raisins">Raisins</option>
      </select>
    </div>
    <button type="submit">Update Chocolate</button>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const chocolateId = Number(route.params.id);
const factoryId = Number(route.params.factoryId);

const chocolate = ref({
  id: chocolateId,
  name: '',
  price: '',
  chocolateType: 'Normal',
  chocolateVariety: 'Dark',
  grams: '',
  description: '',
  picturePath: '',
  status: 'unavailable',
  amount: 0,
  factoryId: factoryId
});

onMounted(() => {
  loadChocolate();
});

function loadChocolate() {
  axios.get(`http://localhost:3001/api/chocolates/${chocolateId}`)
    .then(response => {
      chocolate.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching chocolate details:', error);
    });
}

function handleSubmit() {
  const url = `http://localhost:3001/api/chocolates/${chocolate.value.id}`;
  const updatedChocolate = { ...chocolate.value, factoryId: Number(chocolate.value.factoryId), id: Number(chocolate.value.id) };
  axios.put(url, updatedChocolate)
    .then(response => {
      console.log('Chocolate successfully updated:', response.data);
      router.push(`/factory-detailed/${chocolate.value.factoryId}`);
    })
    .catch(error => {
      console.error('There was an error updating the chocolate!', error);
    });
}
</script>

<style scoped>
.edit-chocolate-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.edit-chocolate-form h2 {
  text-align: center;
  color: #4b3832;
  font-family: 'Arial', sans-serif;
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase; 
  font-style: italic;
}

.edit-chocolate-form div {
  margin-bottom: 15px;
}

.edit-chocolate-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.edit-chocolate-form input, .edit-chocolate-form select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.edit-chocolate-form button {
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

.edit-chocolate-form button:hover {
  background-color: #3a9d70;
}
</style>
