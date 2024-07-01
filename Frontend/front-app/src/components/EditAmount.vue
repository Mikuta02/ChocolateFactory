<template>
  <div class="edit-amount">
    <h1>Edit Chocolate Amount</h1>
    <form @submit.prevent="updateAmount">
      <div>
        <label for="amount">Amount:</label>
        <input type="number" v-model.number="chocolate.amount" required />
      </div>
      <button type="submit">Update Amount</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const chocolateId = Number(route.params.id);

const chocolate = ref({
  id: chocolateId,
  amount: 0
});

onMounted(() => {
  loadChocolate();
});

function loadChocolate() {
  axios.get(`http://localhost:3001/api/chocolates/${chocolateId}`)
    .then(response => {
      chocolate.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching chocolate details:', error);
    });
}

async function updateAmount() {
  try {
    const { amount } = chocolate.value;
    await axios.put(`http://localhost:3001/api/chocolates/${chocolateId}/amount`, { amount });
    console.log('Chocolate amount successfully updated');
    router.push({ name: 'FactoryDetailed', params: { id: route.params.factoryId } });
  } catch (error) {
    console.error('Error updating chocolate amount:', error);
  }
}
</script>

<style scoped>
.edit-amount {
  max-width: 600px;
  margin: 0 auto;
}
</style>
