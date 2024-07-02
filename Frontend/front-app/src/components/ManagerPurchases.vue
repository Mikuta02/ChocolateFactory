<template>
  <div class="manager-purchases">
    <h1>Manager's Purchases</h1>
    <div v-if="purchases.length">
      <div v-for="purchase in purchases" :key="purchase.id" class="purchase-item">
        <h3>Purchase ID: {{ purchase.id }}</h3>
            <p>Date: {{ new Date(purchase.date).toLocaleString() }}</p>
            <p>Total Price: {{ purchase.totalPrice }}</p>
            <p>Status: {{ purchase.status }}</p>
            <p>Customer Name: {{ purchase.customerName }}</p>
            <div v-for="item in purchase.chocolates" :key="item.chocolate.id" class="chocolate-item">
                <h4>{{ item.chocolate.name }}</h4>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Price: {{ item.chocolate.price }}</p>
        </div>
      </div>
    </div>
    <p v-else>No purchases found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const purchases = ref([]);

onMounted(() => {
  loadPurchases();
});

function loadPurchases() {
  axios.get('http://localhost:3001/api/purchases/manager', {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  })
    .then(response => {
      purchases.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching purchases:', error);
    });
}
</script>

<style scoped>
.manager-purchases {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.purchase-item {
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chocolate-item {
  margin-top: 10px;
  padding: 5px;
  border-top: 1px solid #eee;
}
</style>
