<template>
  <div class="manager-comments">
    <h1>Manage Comments</h1>
    <div v-if="comments.length">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <p><strong>Comment ID:</strong> {{ comment.id }}</p>
        <p><strong>User:</strong> {{ comment.user.username }}</p>
        <p><strong>Text:</strong> {{ comment.text }}</p>
        <p><strong>Rating:</strong> {{ comment.rating }}</p>
        <p><strong>Status:</strong> {{ comment.status }}</p>
        <div>
          <label for="status">Update Status:</label>
          <select v-model="comment.newStatus">
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button @click="updateCommentStatus(comment)">Update</button>
        </div>
      </div>
    </div>
    <p v-else>No comments found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();
const comments = ref([]);
const factoryId = ref(parseInt(route.params.factoryId, 10)); // Ensure factoryId is a number

const token = store.state.token; // Get token from the store
const payload = JSON.parse(atob(token.split('.')[1]));
const userId = payload.userId;

onMounted(() => {
  if (!factoryId.value) {
    console.log('Factory ID is missing in route, fetching from backend');
    loadFactory();
  } else {
    loadComments();
  }
});

function loadFactory() {
  axios.get(`http://localhost:3001/api/factories/manager/${userId}`)
    .then(response => {
      factoryId.value = response.data.id;
      console.log(`Factory ID set to: ${factoryId.value}`); // Log to check factoryId
      loadComments();
    })
    .catch(error => {
      console.error('There was an error fetching the factory ID!', error);
    });
}

function loadComments() {
  console.log(`Factory ID set to: ${factoryId.value}`); // Log to check factoryId

  axios.get(`http://localhost:3001/api/comments/factory/${factoryId.value}/all`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log('Comments fetched from API:', response.data); // Log
      comments.value = response.data.map(comment => ({
        ...comment,
        newStatus: comment.status
      }));
    })
    .catch(error => {
      console.error('Error fetching comments:', error);
    });
}

function updateCommentStatus(comment) {
  axios.post('http://localhost:3001/api/comments/update-status', {
    commentId: comment.id,
    status: comment.newStatus
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      console.log('Comment status updated:', response.data);
      loadComments();
    })
    .catch(error => {
      console.error('Error updating comment status:', error);
    });
}
</script>

<style scoped>
.manager-comments {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.comment-item {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
