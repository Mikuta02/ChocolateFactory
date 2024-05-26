<template>
  <div class="factories">
    <h2>All Factories</h2>
    <ul>
      <li v-for="factory in factories" :key="factory.id">
        <h3>{{ factory.name }}</h3>
        <p>Working Hours: {{ factory.workingHours }}</p>
        <p>Status: {{ factory.status }}</p>
        <p>Location: {{ factory.location }}</p>
        <img :src="factory.logoPath" :alt="factory.name + ' logo'" />
        <p>Rating: {{ factory.rating }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const factories = ref([]);

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
li {
  margin: 20px 0;
}
img {
  max-width: 100px;
  height: auto;
}
</style>
