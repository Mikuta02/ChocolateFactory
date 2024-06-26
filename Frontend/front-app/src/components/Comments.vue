<template>
  <div class="comments-section">
    <h2>Comments</h2>
    <ul v-if="comments.length">
      <li v-for="comment in comments" :key="comment.id">
        <p><strong>{{ comment.user.username }}:</strong> {{ comment.text }}</p>
        <p>Rating: {{ comment.rating }}</p>
      </li>
    </ul>
    <p v-else>No comments available.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    factoryId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      comments: []
    };
  },
  created() {
    this.fetchComments();
  },
  methods: {
    fetchComments() {
      axios.get(`http://localhost:3001/api/comments/factory/${this.factoryId}`)
        .then(response => {
          this.comments = response.data;
        })
        .catch(error => {
          console.error('Error fetching comments:', error);
        });
    }
  }
};
</script>

<style scoped>
.comments-section {
  margin: 20px;
}
.comments-section h2 {
  margin-bottom: 10px;
}
.comments-section ul {
  list-style-type: none;
  padding: 0;
}
.comments-section li {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
</style>
