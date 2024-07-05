<template>
  <div class="user-purchases">
    <h1>Your Purchases</h1>
    
    <!-- Search filters -->
    <div class="search-filters">
      <div v-if="isCustomer">
        <label>Factory Name:</label>
        <input v-model="searchFilters.factoryName" type="text" placeholder="Enter factory name" >
      </div>
      
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
        <option value="factoryName" v-if="isCustomer">Factory Name</option>
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
          <p>Factory Name: {{ getFactoryNameById(item.chocolate.factoryId) }}</p>
        </div>
        <div v-if="purchase.status === 'Odobreno'">
          <label>Add Comment for Factory:</label>
          <select v-model="selectedFactory" @change="navigateToAddComment(selectedFactory)">
            <option v-for="factory in getFactoryNamesFromPurchase(purchase)" :key="factory.id" :value="factory.id">
              {{ factory.name }}
            </option>
          </select>
        </div>
        <button v-if="purchase.status === 'Obrada'" @click="cancelPurchase(purchase.id)">Cancel</button>
      </div>
    </div>
    <p v-else>You have no purchases.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const purchases = ref([]);
const factories = ref([]);
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
const selectedFactory = ref('');

const isCustomer = computed(() => store.getters.userRole === 'Customer');

onMounted(() => {
  loadPurchases();
});

function loadPurchases() {
  const userId = store.getters.userId;
  const params = {
    factoryName: searchFilters.factoryName || '',
    minPrice: searchFilters.minPrice || '',
    maxPrice: searchFilters.maxPrice || '',
    startDate: searchFilters.startDate || '',
    endDate: searchFilters.endDate || '',
    sortBy: sortOptions.sortBy || '',
    sortOrder: sortOptions.sortOrder || 'asc'
  };

  console.log('Loading purchases with params:', params);

  axios.get(`http://localhost:3001/api/purchases/user/${userId}`, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    },
    params
  })
    .then(response => {
      console.log('Purchases received:', response.data);
      purchases.value = response.data;
      loadFactoriesFromPurchases(response.data);
    })
    .catch(error => {
      console.error('Error fetching purchases:', error);
    });
}

function loadFactoriesFromPurchases(purchases) {
  const factoryIds = [...new Set(purchases.flatMap(purchase => purchase.chocolates.map(chocolate => chocolate.chocolate.factoryId)))];
  console.log('Factory IDs to fetch:', factoryIds);
  axios.post('http://localhost:3001/api/factories/by-ids', { ids: factoryIds })
    .then(response => {
      console.log('Factories received:', response.data);
      factories.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching factories:', error);
    });
}

function applyFiltersAndSort() {
  loadPurchases();
}

function resetFilters() {
  Object.assign(searchFilters, { ...initialSearchFilters });
  Object.assign(sortOptions, { ...initialSortOptions });
  loadPurchases();
}

function cancelPurchase(purchaseId) {
  const userId = store.getters.userId;
  axios.post('http://localhost:3001/api/purchases/cancel', { purchaseId, userId }, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  })
    .then(response => {
      console.log('Purchase canceled:', response.data);
      loadPurchases();
    })
    .catch(error => {
      console.error('Error canceling purchase:', error);
    });
}

function getFactoryNameById(factoryId) {
  const factory = factories.value.find(factory => factory.id === factoryId);
  console.log(`Factory name for ID ${factoryId}: ${factory ? factory.name : 'Unknown Factory'}`);
  return factory ? factory.name : 'Unknown Factory';
}

function getFactoryNamesFromPurchase(purchase) {
  if (!purchase || !purchase.chocolates) {
    return [];
  }
  const factoryIds = new Set(purchase.chocolates.map(item => item.chocolate.factoryId));
  return Array.from(factoryIds).map(factoryId => ({
    id: factoryId,
    name: getFactoryNameById(factoryId)
  }));
}

function navigateToAddComment(factoryId) {
  console.log('Navigating to add comment for factory ID:', factoryId);
  if (factoryId) {
    router.push({ name: 'AddComment', params: { factoryId } });
  }
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
