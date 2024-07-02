<template>
  <div>
    <h2>Add Comment</h2>
    <form @submit.prevent="submitComment">
      <div>
        <label for="text">Comment:</label>
        <textarea id="text" v-model="text" required></textarea>
      </div>
      <div>
        <label for="rating">Rating:</label>
        <input id="rating" type="number" v-model="rating" min="1" max="5" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      text: '',
      rating: 5,
      factoryId: 1, // Pretpostavljamo da imate factoryId iz nekog izvora
    };
  },
  setup() {
    const store = useStore();
    const router = useRouter(); // Dodajemo router
    return { store, router };
  },
  methods: {
    submitComment() {
      const userId = this.store.getters.userId; // Koristimo getter za userId
      const token = this.store.state.token; // Dobijamo token iz store-a

      if (!userId) {
        console.error('User is not defined or user.id is missing');
        return;
      }

      axios.post('http://localhost:3001/api/comments', {
        userId,
        factoryId: this.factoryId,
        text: this.text,
        rating: this.rating,
      }, {
        headers: {
          'Authorization': `Bearer ${token}` // Dodajemo Authorization header
        }
      })
      .then(response => {
        console.log('Comment added:', response.data);
        this.router.push('/purchases'); // Preusmeravanje na stranicu sa kupovinama
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
    },
  },
};
</script>

<style scoped>
/* Stilizacija */
</style>
