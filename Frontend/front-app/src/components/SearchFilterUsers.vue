<template>
    <div class="search-filter">
      <input v-model="name" placeholder="Search by first name" />
      <input v-model="lastName" placeholder="Search by last name" />
      <input v-model="username" placeholder="Search by username" />
  
      <div class="sorting">
        <label for="sortBy">Sort by:</label>
        <select v-model="sortBy" id="sortBy">
          <option value="name">First Name</option>
          <option value="lastName">Last Name</option>
          <option value="username">Username</option>
          <option value="accumulatedPoints">Accumulated Points</option>
        </select>
  
        <label for="order">Order:</label>
        <select v-model="order" id="order">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
  
      <div class="filtering">
        <label for="role">Role:</label>
        <select v-model="role" id="role">
          <option value="">All</option>
          <option value="Manager">Manager</option>
          <option value="Administrator">Administrator</option>
          <option value="Customer">Customer</option>
          <option value="Worker">Worker</option>
        </select>
  
        <label for="customerType">Customer Type:</label>
        <select v-model="customerType" id="customerType">
          <option value="">All</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
  
        <label>
          <input type="checkbox" v-model="filterByCancellation" />
          Show suspicious users
        </label>
      </div>
  
      <button @click="search" class="search-button">Search</button>
      <button @click="resetFields" class="reset-button">Reset Fields/Users</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        lastName: '',
        username: '',
        sortBy: 'name',
        order: 'asc',
        role: '',
        customerType: '',
        filterByCancellation: false
      };
    },
    methods: {
      search() {
        this.$emit('search', {
          name: this.name,
          lastName: this.lastName,
          username: this.username,
          sortBy: this.sortBy,
          order: this.order,
          role: this.role,
          customerType: this.customerType,
          filterByCancellation: this.filterByCancellation
        });
      },
      resetFields() {
        this.name = '';
        this.lastName = '';
        this.username = '';
        this.sortBy = 'name';
        this.order = 'asc';
        this.role = '';
        this.customerType = '';
        this.filterByCancellation = false;
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
  .reset-button {
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
  .reset-button:hover {
    background-color: #CB4335;
  }
  
  .search-filter input,
  .search-filter select,
  .search-filter label {
    margin-bottom: 10px;
    width: 100%;
  }
  
  .sorting,
  .filtering {
    display: flex;
    flex-direction: column;
  }
  </style>
  