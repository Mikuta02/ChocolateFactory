<template>
  <div class="manager-purchases">
    <h1>Manager's Purchases</h1>

    <!-- Search filters -->
    <div class="search-filters">
      <label>Price Range:</label>
      <input v-model="searchFilters.minPrice" type="number" placeholder="Min Price">
      <input v-model="searchFilters.maxPrice" type="number" placeholder="Max Price">
      
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
    <div v-if="filteredPurchases.length">
      <div v-for="purchase in filteredPurchases" :key="purchase.id" class="purchase-item">
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
import { ref, onMounted, reactive, computed } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const purchases = ref([]);
const filteredPurchases = ref([]);

const initialSearchFilters = {
  minPrice: '',
  maxPrice: '',
  startDate: '',
  endDate: '',
};

const initialSortOptions = {
  sortBy: '',
  sortOrder: 'asc',
};

const searchFilters = reactive({ ...initialSearchFilters });
const sortOptions = reactive({ ...initialSortOptions });

onMounted(() => {
  loadPurchases();
});

function loadPurchases() {
  const params = {
    minPrice: searchFilters.minPrice || '',
    maxPrice: searchFilters.maxPrice || '',
    startDate: searchFilters.startDate || '',
    endDate: searchFilters.endDate || '',
    sortBy: sortOptions.sortBy || '',
    sortOrder: sortOptions.sortOrder || 'asc'
  };

  console.log('Loading purchases with params:', params);

  axios.get('http://localhost:3001/api/purchases/manager', {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    },
    params
  })
    .then(response => {
      console.log('Purchases received:', response.data);
      purchases.value = response.data.map(purchase => ({
        ...purchase,
        newStatus: '',
        reason: ''
      }));
      applyFiltersAndSort(); // Apply filters and sort immediately after loading
    })
    .catch(error => {
      console.error('Error fetching purchases:', error);
    });
}

function applyFiltersAndSort() {
  console.log('Applying filters and sorting with params:', searchFilters, sortOptions);
  
  // Apply filters
  let tempPurchases = purchases.value.filter(purchase => {
    let matchesPrice = true;
    let matchesDate = true;

    if (searchFilters.minPrice) {
      matchesPrice = purchase.totalPrice >= Number(searchFilters.minPrice);
    }
    if (searchFilters.maxPrice) {
      matchesPrice = matchesPrice && purchase.totalPrice <= Number(searchFilters.maxPrice);
    }
    if (searchFilters.startDate) {
      matchesDate = new Date(purchase.date) >= new Date(searchFilters.startDate);
    }
    if (searchFilters.endDate) {
      matchesDate = matchesDate && new Date(purchase.date) <= new Date(searchFilters.endDate);
    }

    return matchesPrice && matchesDate;
  });

  // Apply sorting
  if (sortOptions.sortBy) {
    tempPurchases.sort((a, b) => {
      let fieldA = a[sortOptions.sortBy];
      let fieldB = b[sortOptions.sortBy];

      if (fieldA < fieldB) return sortOptions.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOptions.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  filteredPurchases.value = tempPurchases;
}

function resetFilters() {
  Object.assign(searchFilters, { ...initialSearchFilters });
  Object.assign(sortOptions, { ...initialSortOptions });
  console.log('Filters reset');
  applyFiltersAndSort();
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

.status-label, .reason-label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.status-select, .reason-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.reason-container {
  margin-top: 15px;
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

.search-filters button, .sorting-options button {
  padding: 8px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.search-filters button:hover, .sorting-options button:hover {
  background-color: #0056b3;
}
</style>
