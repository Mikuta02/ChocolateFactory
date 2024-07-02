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
        <div v-if="purchase.status === 'Obrada'" class="status-update">
          <label for="status" class="status-label">Update Status:</label>
          <select v-model="purchase.newStatus" class="status-select">
            <option value="Odobreno">Odobreno</option>
            <option value="Odbijeno">Odbijeno</option>
          </select>
          <div v-if="purchase.newStatus === 'Odbijeno'" class="reason-container">
            <label for="reason" class="reason-label">Reason:</label>
            <textarea v-model="purchase.reason" class="reason-textarea"></textarea>
          </div>
          <button @click="updatePurchaseStatus(purchase)" class="update-button">Update</button>
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
      purchases.value = response.data.map(purchase => ({
        ...purchase,
        newStatus: '',
        reason: ''
      }));
    })
    .catch(error => {
      console.error('Error fetching purchases:', error);
    });
}

function updatePurchaseStatus(purchase) {
  const updateData = {
    purchaseId: purchase.id,
    status: purchase.newStatus,
    reason: purchase.newStatus === 'Odbijeno' ? purchase.reason : ''
  };

  axios.post('http://localhost:3001/api/purchases/update-status', updateData, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  })
    .then(response => {
      console.log('Purchase status updated:', response.data);
      loadPurchases();
    })
    .catch(error => {
      console.error('Error updating purchase status:', error);
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
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chocolate-item {
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #eee;
}

.status-update {
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.status-label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

.status-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.reason-container {
  margin-top: 15px;
}

.reason-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.reason-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
}

.update-button {
  margin-top: 15px;
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.update-button:hover {
  background-color: #0056b3;
}
</style>
