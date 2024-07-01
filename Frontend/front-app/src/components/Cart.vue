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
            <div>
              <label for="quantity">Quantity:</label>
              <input type="number" v-model.number="item.quantity" @change="updateQuantity(item)" min="1" :max="item.chocolate.amount" />
            </div>
            <button @click="removeFromCart(item.chocolate.id)">Remove</button>
          </div>
        </li>
      </ul>
      <p>Total Price: {{ cart.totalPrice }}</p>
      <button @click="clearCart">Clear Cart</button>
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

function updateQuantity(item) {
  const userId = store.getters.userId;
  const quantity = item.quantity;
  if (quantity > item.chocolate.amount) {
    item.quantity = item.chocolate.amount;
    alert(`Quantity exceeds available stock. Maximum available: ${item.chocolate.amount}`);
    return;
  }
  axios.post('http://localhost:3001/api/cart/update-quantity', { userId, chocolateId: item.chocolate.id, quantity })
    .then(response => {
      cart.value = response.data;
      alert('Quantity updated successfully');
    })
    .catch(error => {
      console.error('Error updating quantity:', error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to update quantity');
      }
    });
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
</style>
