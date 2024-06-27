<template>
  <div class="search-filter">
    <input v-model="name" placeholder="Search by factory name" />
    <input v-model="chocolateName" placeholder="Search by chocolate name" />
    <input v-model="location" placeholder="Search by location" />
    <input v-model.number="rating" type="number" min="1" max="5" placeholder="Search by rating" />

    <div class="sorting">
      <label for="sortBy">Sort by:</label>
      <select v-model="sortBy" id="sortBy">
        <option value="name">Name</option>
        <option value="location">Location</option>
        <option value="rating">Rating</option>
      </select>

      <label for="order">Order:</label>
      <select v-model="order" id="order">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div class="filtering">
      <label for="chocolateType">Chocolate Type:</label>
      <select v-model="chocolateType" id="chocolateType">
        <option value="">All</option>
        <option value="Normal">Normal</option>
        <option value="Drink">Drink</option>
        <option value="Cooking">Cooking</option>
      </select>

      <label for="chocolateVariety">Chocolate Variety:</label>
      <select v-model="chocolateVariety" id="chocolateVariety">
        <option value="">All</option>
        <option value="Milk">Milk</option>
        <option value="Dark">Dark</option>
        <option value="White">White</option>
        <option value="Nuts">Nuts</option>
        <option value="Nougat">Nougat</option>
        <option value="Raisins">Raisins</option>
      </select>

      <label>
        <input type="checkbox" v-model="openOnly" />
        Show only open
      </label>
    </div>

    <button @click="search" class="search-button">Search</button>
    <button @click="resetFields" class="reset-button">Reset Fields/Factories</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      chocolateName: '',
      location: '',
      rating: '',
      sortBy: 'name',
      order: 'asc',
      chocolateType: '',
      chocolateVariety: '',
      openOnly: false
    };
  },
  methods: {
    search() {
      this.$emit('search', {
        name: this.name,
        chocolateName: this.chocolateName,
        location: this.location,
        rating: this.rating,
        sortBy: this.sortBy,
        order: this.order,
        chocolateType: this.chocolateType,
        chocolateVariety: this.chocolateVariety,
        openOnly: this.openOnly
      });
    },
    resetFields() {
    this.name = '';
    this.chocolateName = '';
    this.location = '';
    this.rating = '';
    this.sortBy = 'name';
    this.order = 'asc';
    this.chocolateType = '';
    this.chocolateVariety = '';
    this.openOnly = false;
    this.$emit('search', {}); 
  }
  }
};
</script>

<style scoped>
.search-filter {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.search-button,
.reset-button,
.reset-search-button {
  background-color: #B9770E;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px; 
}

.search-button:hover,
.reset-button:hover,
.reset-search-button:hover {
  background-color: #CB4335 ; 
}

.search-filter input,
.search-filter select,
.search-filter label {
  margin-bottom: 10px;
  width: 100%;
}

.search-button {
  background-color: #B9770E;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

.search-button:hover {
  background-color: #45a049;
}

.sorting,
.filtering {
  display: flex;
  flex-direction: column;
}
</style>
