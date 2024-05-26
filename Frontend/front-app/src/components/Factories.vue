<template>
  <div class="factories">
    <h2>All Factories</h2>
    <ul>
      <li v-for="factory in factories" :key="factory.id" class="factory-item">
        <img :src="getFactoryLogoUrl(factory.logoPath)" :alt="factory.name + ' logo'" class="factory-logo" />
        <div class="factory-details">
          <h3>{{ factory.name }}</h3>
          <p>Working Hours: {{ factory.workingHours }}</p>
          <p>Status: {{ factory.status }}</p>
          <p>Location: {{ factory.location }}</p>
          <p>Rating: {{ factory.rating }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

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
</script>

<style scoped>
h2 {
  margin: 20px 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li.factory-item {
  display: flex;
  align-items: center;
  margin: 20px 0;
  border: 1px solid #000; /* Tanak crni okvir oko celog elementa */
  padding: 10px; /* Dodavanje unutrašnje margine */
  border-radius: 8px; /* Zaobljeni uglovi */
}
.factory-logo {
  width: 200px; /* Fiksna širina slike */
  height: auto;
  margin-right: 20px;
}
.factory-details {
  display: flex;
  flex-direction: column;
}
</style>
