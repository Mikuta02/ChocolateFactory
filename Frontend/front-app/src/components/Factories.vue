<template>
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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const factories = ref([]);

// Funkcija za generisanje URL-a za slike
function getFactoryLogoUrl(path) {
  return `http://localhost:3001/images/${path}`;
}

onMounted(() => {
  loadFactories();
});

function loadFactories() {
  axios.get('http://localhost:3001/api/factories')
    .then(response => {
      factories.value = response.data;
    })
    .catch(error => {
      console.error('There was an error fetching the factories!', error);
    });
}

function goToFactoryDetails(id) {
  router.push({ name: 'FactoryDetailed', params: { id } });
}
</script>

<style scoped>
.factories {
  display: flex;
  flex-direction: column;
  align-items: center;
}

ul {
  list-style-type: none;
  padding: 0;
}

li.factory-item {
  display: flex;
  align-items: center;
  margin: 20px 0;
  border: 1px solid #000;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 95%; /* Increased width for better layout */
  max-width: 1400px; /* Increased max-width for better control */
}

.factory-logo {
  width: 350px; /* Increased width for better visibility */
  height: auto;
  margin-right: 40px; /* Increased margin for better separation */
}

.factory-details {
  display: flex;
  flex-direction: column;
}

.factory-details h3 {
  font-weight: bold; /* Bold factory name */
}

.location-info {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center align items */
  margin-bottom: 10px; /* Added margin-bottom for spacing */
}

.location-info p {
  margin: 0;
}

.coordinates {
  margin-top: 5px; /* Added margin-top for spacing */
  color: gray;
}
</style>
