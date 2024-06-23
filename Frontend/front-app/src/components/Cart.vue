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
            <p>Quantity: {{ item.quantity }}</p>
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

const cart = ref({
  chocolates: [],
  totalPrice: 0
});

onMounted(() => {
  loadCart();
});

function loadCart() {
  axios.get('http://localhost:3001/api/cart')
    .then(response => {
      cart.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching cart:', error);
    });
}

function removeFromCart(chocolateId) {
  axios.post('http://localhost:3001/api/cart/remove', { chocolateId })
    .then(response => {
      cart.value = response.data;
    })
    .catch(error => {
      console.error('Error removing chocolate from cart:', error);
    });
}

function clearCart() {
  axios.post('http://localhost:3001/api/cart/clear')
    .then(response => {
      cart.value = response.data;
    })
    .catch(error => {
      console.error('Error clearing cart:', error);
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
