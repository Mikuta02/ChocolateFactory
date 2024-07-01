<template>
  <div class="user-purchases">
    <h1>Your Purchases</h1>
    
    <!-- Search filters -->
    <div class="search-filters">
      <label>Factory Name:</label>
      <input v-model="searchFilters.factoryName" type="text" placeholder="Enter factory name">
      
      <label>Price Range:</label>
      <input v-model="searchFilters.minPrice" type="number" placeholder="Min">
      <input v-model="searchFilters.maxPrice" type="number" placeholder="Max">
      
      <label>Date Range:</label>
      <input v-model="searchFilters.startDate" type="date">
      <input v-model="searchFilters.endDate" type="date">
      
      <button @click="applyFiltersAndSort">Apply Filters & Sort</button>
      <button @click="resetFilters">Reset Filters</button>
    </div>

    <!-- Sorting options -->
    <div class="sorting-options">
      <label>Sort By:</label>
      <select v-model="sortOptions.sortBy">
        <option value="">Select</option>
        <option value="factoryName">Factory Name</option>
        <option value="totalPrice">Total Price</option>
        <option value="date">Date</option>
      </select>
      <label>Order:</label>
      <select v-model="sortOptions.sortOrder">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- Purchases list -->
    <div v-if="purchases.length">
      <div v-for="purchase in purchases" :key="purchase.id" class="purchase-item">
        <h3>Purchase ID: {{ purchase.id }}</h3>
        <p>Date: {{ new Date(purchase.date).toLocaleString() }}</p>
        <p>Total Price: {{ purchase.totalPrice }}</p>
        <p>Status: {{ purchase.status }}</p>
        <div v-for="item in purchase.chocolates" :key="item.chocolate.id" class="chocolate-item">
          <h4>{{ item.chocolate.name }}</h4>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: {{ item.chocolate.price }}</p>
          <p>Factory Name: {{ getFactoryName(purchase, item.chocolate.id) }}</p>
        </div>
        <button v-if="purchase.status === 'Obrada'" @click="cancelPurchase(purchase.id)">Cancel</button>
      </div>
    </div>
    <p v-else>You have no purchases.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watchEffect } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const purchases = ref([]);
const initialSearchFilters = {
  factoryName: '',
  minPrice: '',
  maxPrice: '',
  startDate: '',
  endDate: '',
};
const initialSortOptions = {
  sortBy: '',
  sortOrder: 'asc', // 'asc' for ascending, 'desc' for descending
};
const searchFilters = reactive({ ...initialSearchFilters });
const sortOptions = reactive({ ...initialSortOptions });

// Function to load purchases
onMounted(() => {
  loadPurchases();
});

function loadPurchases() {
  const userId = store.getters.userId;
  axios.get(`http://localhost:3001/api/purchases/user/${userId}`, {
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

// Function to apply filters and sort
function applyFiltersAndSort() {
  let filteredPurchases = purchases.value.slice(); // Create a copy of purchases
  
   if (searchFilters.factoryName) {
    filteredPurchases = filteredPurchases.filter(purchase =>
      purchase.chocolates.some(item =>
        item.factoryName && item.factoryName.includes(searchFilters.factoryName)
      )
    );
  }
  
  // Filter by price range
  if (searchFilters.minPrice !== '' && searchFilters.maxPrice !== '') {
    filteredPurchases = filteredPurchases.filter(purchase =>
      purchase.totalPrice >= parseFloat(searchFilters.minPrice) &&
      purchase.totalPrice <= parseFloat(searchFilters.maxPrice)
    );
  }
  
  // Filter by date range
  if (searchFilters.startDate && searchFilters.endDate) {
    filteredPurchases = filteredPurchases.filter(purchase =>
      new Date(purchase.date) >= new Date(searchFilters.startDate) &&
      new Date(purchase.date) <= new Date(searchFilters.endDate)
    );
  }
  
  // Apply sorting
  if (sortOptions.sortBy) {
    filteredPurchases.sort((a, b) => {
      const fieldA = a[sortOptions.sortBy];
      const fieldB = b[sortOptions.sortBy];
      if (fieldA < fieldB) {
        return sortOptions.sortOrder === 'asc' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortOptions.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  // Update purchases with filtered and sorted data
  purchases.value = filteredPurchases;
}

// Function to reset filters and sorting options
function resetFilters() {
  Object.assign(searchFilters, { ...initialSearchFilters });
  Object.assign(sortOptions, { ...initialSortOptions });
  loadPurchases(); // Reload all purchases after resetting
}

// Function to cancel a purchase
function cancelPurchase(purchaseId) {
  const userId = store.getters.userId;
  axios.post('http://localhost:3001/api/purchases/cancel', { purchaseId, userId }, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  })
    .then(response => {
      console.log('Purchase canceled:', response.data);
      loadPurchases(); // Reload purchases after canceling
    })
    .catch(error => {
      console.error('Error canceling purchase:', error);
    });
}

function getFactoryName(purchase, chocolateId) {
  if (!purchase || !purchase.factory) {
    return 'Unknown Factory';
  }
  const factory = purchase.factory.find(f => f.chocolate && f.chocolate.id === chocolateId);
  return factory ? factory.factoryName : 'Unknown Factory';
}
</script>

<style scoped>
.user-purchases {
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

.search-filters, .sorting-options {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-filters label, .sorting-options label {
  margin-right: 10px;
  font-weight: bold;
}

.search-filters input, .search-filters select, .sorting-options select {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
}

.search-filters button {
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-filters button:hover {
  background-color: #0056b3;
}

.sorting-options select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 150px;
}

.sorting-options label {
  margin-right: 10px;
  font-weight: bold;
}
</style>
