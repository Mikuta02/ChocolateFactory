<template>
  <div class="factories-page">
    <div class="factories">
      <h2>All Factories</h2>
      <ul>
        <li v-for="factory in factories" :key="factory.id" class="factory-item" @click="goToFactoryDetails(factory.id)">
          <img :src="getFactoryLogoUrl(factory.logoPath)" :alt="factory.name + ' logo'" class="factory-logo" />
          <div class="factory-details">
            <h3>{{ factory.name }}</h3>
            <div class="location-info">
              <p>{{ factory.location.address }}</p>
              <p class="coordinates">{{ factory.location.latitude }}, {{ factory.location.longitude }}</p>
            </div>
            <p>Rating: {{ factory.rating }}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="sidebar">
      <div class="sidebar-title">Search</div>
      <SearchFilter @search="handleSearch" /></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import SearchFilter from './SearchFilter.vue';

const router = useRouter();
const factories = ref([]);

// Funkcija za generisanje URL-a za slike
function getFactoryLogoUrl(path) {
  return `http://localhost:3001/images/${path}`;
}

onMounted(() => {
  loadFactories();
});

function loadFactories(params = {}) {
  console.log('Search parameters:', params);
  axios.get('http://localhost:3001/api/search/factories', { params })
    .then(response => {
      console.log('Factories fetched:', response.data);
      factories.value = response.data;
    })
    .catch(error => {
      console.error('There was an error fetching the factories!', error);
    });
}

function goToFactoryDetails(id) {
  router.push({ name: 'FactoryDetailed', params: { id } });
}

function handleSearch(searchParams) {
  console.log('Search params:', searchParams);
  loadFactories(searchParams);
}

function resetSearch() {
  handleSearch({}); // Prazan objekat za resetovanje pretrage
}
</script>

<style scoped>
.factories-page {
  display: flex;
  justify-content: space-between;
}

.sidebar {
  width: 300px;
  padding: 20px;
  border: 2px solid #ccc; /* Dodavanje lepog okvira */
  border-radius: 8px; /* Zaobljeni uglovi */
  background-color: #FAE5D3 ;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Dodavanje senke */
  margin-top: 86px; /* Veći odmak od vrha */
  margin-right: 20px; /* Odmak od desne strane */
  height: 550px; /* Sprečavanje da sidebar ide skroz do kraja */
}

.sidebar-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.factories {
  flex: 1;
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li.factory-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #FAE5D3 ;
}

.factory-logo {
  width: 400px;
  height: 200px;
  margin-right: 40px; /* Povećanje razmaka između slike i teksta */
}

.factory-details {
  display: flex;
  flex-direction: column;
}

.factory-details h3 {
  font-size: 24px;
  font-weight: bold;
}

.location-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.location-info p {
  margin: 0;
}

.coordinates {
  margin-top: 5px;
  color: gray;
}

.reset-button {
  background-color: #B9770E; /* Boja */
  color: white;
  padding: 10px 20px; /* Padding */
  border: none;
  border-radius: 5px; /* Zaobljeni uglovi */
  cursor: pointer;
  margin-top: 20px;
}

.reset-button:hover {
  background-color: #cc0000;
}

</style>
