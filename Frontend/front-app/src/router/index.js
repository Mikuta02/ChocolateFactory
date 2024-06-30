import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Factories from '../components/Factories.vue';
import AddFactory from '../components/AddFactory.vue';
import FactoryDetails from '../components/FactoryDetails.vue';
import AddChocolate from '../components/AddChocolate.vue';
import EditChocolate from '../components/EditChocolate.vue';
import Cart from '../components/Cart.vue';
import AddComment from '../components/AddComment.vue'; 
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import store from '../store';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/factories',
    name: 'Factories',
    component: Factories
  },
  {
    path: '/add-factory',
    name: 'AddFactory',
    component: AddFactory
  },
  {
    path: '/factory-detailed/:id',
    name: 'FactoryDetailed',
    component: FactoryDetails,
    props: true
  },
  {
    path: '/add-chocolate',
    name: 'AddChocolate',
    component: AddChocolate,
    props: route => ({ factoryId: route.query.factoryId }) 
  },
  {
    path: '/edit-chocolate/:id/:factoryId',
    name: 'EditChocolate',
    component: EditChocolate,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart 
  },
  {
    path: '/add-comment/:factoryId',
    name: 'AddComment',
    component: AddComment,
    props: true
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: true
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Route guard
router.beforeEach((to, from, next) => {
  if (to.name === 'AddFactory') {
    const token = store.state.token; // Get token from the store
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'Administrator') {
        next();
      } else {
        next('/login'); // Redirect to login if not an Administrator
      }
    } else {
      next('/login'); // Redirect to login if not logged in
    }
  } else {
    next();
  }
});

export default router;
