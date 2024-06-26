<template>
  <div class="add-comment-form">
    <h2>Add Comment</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="text">Comment:</label>
        <textarea v-model="text" id="text" required></textarea>
      </div>
      <div>
        <label for="rating">Rating:</label>
        <select v-model="rating" id="rating" required>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const text = ref('');
const rating = ref(1);
const userId = ref(1); // Hard-coded user ID for now

const handleSubmit = () => {
  const factoryId = route.params.factoryId;
  const newComment = {
    userId: userId.value,
    factoryId: factoryId,
    text: text.value,
    rating: rating.value
  };
  axios.post('http://localhost:3001/api/comments', newComment)
    .then(response => {
      console.log('Comment added:', response.data);
      router.push(`/factory-detailed/${factoryId}`);
    })
    .catch(error => {
      console.error('Error adding comment:', error);
    });
};
</script>

<style scoped>
.add-comment-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.add-comment-form h2 {
  text-align: center;
  color: #333;
}
.add-comment-form div {
  margin-bottom: 15px;
}
.add-comment-form label {
  display: block;
  margin-bottom: 5px;
}
.add-comment-form textarea,
.add-comment-form select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.add-comment-form button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.add-comment-form button:hover {
  background-color: #3a9d70;
}
</style>
