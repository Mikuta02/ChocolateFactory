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
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const text = ref('');
    const rating = ref(5);
    const factoryId = ref(null);
    const errorMessage = ref('');

    onMounted(() => {
      if (route.params.factoryId) {
        factoryId.value = Number(route.params.factoryId);
      }
    });

    const submitComment = () => {
      const userId = store.getters.userId;
      const token = store.state.token;

      if (!userId) {
        console.error('User is not defined or user.id is missing');
        return;
      }

      if (rating.value < 1 || rating.value > 5) {
        errorMessage.value = 'Rating must be between 1 and 5';
        return;
      }

      axios.post('http://localhost:3001/api/comments', {
        userId,
        factoryId: factoryId.value,
        text: text.value,
        rating: rating.value,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Comment added:', response.data);
        router.push('/purchases');
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
    };

    return { text, rating, errorMessage, submitComment };
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
