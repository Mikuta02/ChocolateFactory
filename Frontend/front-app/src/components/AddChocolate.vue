<template>
    <form @submit.prevent="handleSubmit" class="add-chocolate-form">
      <h2>Add New Chocolate</h2>
      <div>
        <label>Name:</label>
        <input type="text" v-model="name" />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" v-model="price" />
      </div>
      <div>
        <label>Grams:</label>
        <input type="number" v-model="grams" />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" v-model="description" />
      </div>
      <div>
        <label>Photo URL:</label>
        <input type="text" v-model="picturePath" />
      </div>
      <div>
        <label>Chocolate Type:</label>
        <select name="type" id="type" form="type" v-model="chocolateType">
            <option value="Normal">Normal</option>
            <option value="Drink">Drink</option>
            <option value="Cooking">Cooking</option>
        </select>
      </div>
      <div>
        <label>Chocolate Variety:</label>
        <select name="variety" id="variety" form="variety" v-model="chocolateVariety">
            <option value="Milk">Milk</option>
            <option value="Dark">Dark</option>
            <option value="White">White</option>
            <option value="Nuts">Nuts</option>
            <option value="Nougat">Nougat</option>
            <option value="Raisins">Raisins</option>
        </select>
      </div>
      <button type="submit">Add Factory</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const name = ref('');
  const price = ref('');
  const chocolateType = ref('Normal');
  const chocolateVariety = ref('Dark');
  const grams = ref('');
  const description = ref('');
  const picturePath = ref('');
  const status = ref("unavailable");
  const amount = ref(0);
  
function handleSubmit() {
  const newChocolate = {
    name: name.value,
    price: price.value,
    chocolateType: chocolateType.value,
    factoryId: 1,
    chocolateVariety: chocolateVariety.value,
    grams: grams.value,
    description: description.value,
    picturePath: picturePath.value,
    status: "unavailable",
    amount: 0
  };

  console.log('Payload:', newChocolate); // Log the payload for debugging

  axios.post('http://localhost:3001/api/chocolates', newChocolate)
    .then(response => {
      console.log('Chocolate successfully added:', response.data);
      router.push(`/factory-detailed/${route.query.factoryId}`);
    })
    .catch(error => {
      console.error('There was an error adding the chocolate!', error);
    });
}
  </script>
  
  <style scoped>
  .add-chocolate-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .add-chocolate-form h2 {
    text-align: center;
    color: #4b3832;
    font-family: 'Arial', sans-serif;
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 20px;
    text-transform: uppercase; 
    font-style:italic
  }
  
  .add-chocolate-form div {
    margin-bottom: 15px;
  }
  
  .add-chocolate-form label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .add-chocolate-form input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .add-chocolate-form button {
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
  
  .add-chocolate-form button:hover {
    background-color: #3a9d70;
  }
  </style>
  