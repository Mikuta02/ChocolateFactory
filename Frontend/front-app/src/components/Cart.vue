<template>
  <div class="cart">
    <h1>Your Cart</h1>
    <div v-if="cart.chocolates.length > 0">
      <ul>
        <li v-for="item in cart.chocolates" :key="item.chocolate.id" class="cart-item">
          <img :src="getChocolatePictureUrl(item.chocolate.picturePath)" :alt="item.chocolate.name" class="chocolate-picture" />
          <div class="cart-details">
            <h3>{{ item.chocolate.name }}</h3>
            <p>Type: {{ item.chocolate.chocolateType }}</p>
            <p>Variety: {{ item.chocolate.chocolateVariety }}</p>
            <p>Price: {{ item.chocolate.price }}</p>
            <div class="quantity-control">
              <label for="quantity">Quantity:</label>
              <input type="number" v-model.number="item.quantity" min="1" :max="item.chocolate.amount" @change="validateAndUpdateQuantity(item.chocolate.id, item.quantity, item.chocolate.amount)">
              <button @click="updateQuantity(item.chocolate.id, item.quantity)">Update</button>
            </div>
            <button @click="removeFromCart(item.chocolate.id)">Remove</button>
          </div>
        </li>
      </ul>
      <p>Total Price: {{ cart.totalPrice }}</p>
      <button @click="clearCart">Clear Cart</button>
      <button @click="createPurchase">Purchase</button>
    </div>
    <p v-else>Your cart is empty.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const cart = ref({
  chocolates: [],
  totalPrice: 0
});

onMounted(() => {
  loadCart();
});

function loadCart() {
  const userId = store.getters.userId;
  axios.get(`http://localhost:3001/api/cart/${userId}`)
    .then(response => {
      cart.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching cart:', error);
    });
}

function removeFromCart(chocolateId) {
  const userId = store.getters.userId;
  axios.post('http://localhost:3001/api/cart/remove', { userId, chocolateId })
    .then(response => {
      cart.value = response.data;
    })
    .catch(error => {
      console.error('Error removing chocolate from cart:', error);
    });
}

function clearCart() {
  const userId = store.getters.userId;
  axios.post(`http://localhost:3001/api/cart/clear/${userId}`)
    .then(response => {
      cart.value = response.data;
    })
    .catch(error => {
      console.error('Error clearing cart:', error);
    });
}

function createPurchase() {
  const userId = store.getters.userId;
  axios.post('http://localhost:3001/api/purchases', { userId }, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  })
    .then(response => {
      console.log('Purchase created:', response.data);
      alert('Purchase successfully created.');
      loadCart();  
    })
    .catch(error => {
      console.error('Error creating purchase:', error);
      alert('Failed to create purchase.');
    });
}

function updateQuantity(chocolateId, quantity) {
  const userId = store.getters.userId;
  axios.post('http://localhost:3001/api/cart/update-quantity', { userId, chocolateId, quantity })
    .then(response => {
      cart.value = response.data;
    })
    .catch(error => {
      console.error('Error updating chocolate quantity:', error);
      alert('Failed to update chocolate quantity.');
    });
}

function validateAndUpdateQuantity(chocolateId, quantity, maxQuantity) {
  if (quantity < 1) {
    quantity = 1;
  }
  if (quantity > maxQuantity) {
    quantity = maxQuantity;
  }
  updateQuantity(chocolateId, quantity);
}

function getChocolatePictureUrl(path) {
  return `http://localhost:3001/images/${path}`;
}
</script>

<style scoped>
.cart {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.cart-item {
  display: flex;
  align-items: center;
  margin: 20px 0;
  border: 1px solid #000;
  padding: 10px;
  border-radius: 8px;
  position: relative;
}
.chocolate-picture {
  width: 100px;
  height: auto;
  margin-right: 20px;
}
.cart-details {
  flex-grow: 1;
}
.quantity-control {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.quantity-control input {
  width: 50px;
  margin-right: 10px;
}
.quantity-control button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}
.quantity-control button:hover {
  background-color: #0056b3;
}
</style>
