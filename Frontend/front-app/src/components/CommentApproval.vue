<template>
  <div class="comment-approval">
    <h1>Approve Comments</h1>
    <div v-if="comments.length">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <h3>Comment by {{ comment.user.username }}</h3>
        <p>{{ comment.text }}</p>
        <p>Rating: {{ comment.rating }}</p>
        <select v-model="comment.status" class="status-select">
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <button @click="updateCommentStatus(comment)" class="update-button">Update</button>
      </div>
    </div>
    <p v-else>No comments found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const comments = ref([]);

onMounted(() => {
  loadComments();
});

function loadComments() {
  axios.get(`http://localhost:3001/api/comments/factory/${store.state.factoryId}/all`, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
    }
  })
    .then(response => {
      comments.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching comments:', error);
    });
}

function updateCommentStatus(comment) {
  const updateData = {
    commentId: comment.id,
    status: comment.status
  };

  axios.post('http://localhost:3001/api/comments/update-status', updateData, {
    headers: {
      'Authorization': `Bearer ${store.state.token}`
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
.comment-approval {
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.status-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  margin-top: 10px;
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
</style>
