import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Factories from '../components/Factories.vue';
import AddFactory from '../components/AddFactory.vue';
import FactoryDetails from '../components/FactoryDetails.vue';
import AddChocolate from '../components/AddChocolate.vue';
import EditChocolate from '../components/EditChocolate.vue';
import Cart from '../components/Cart.vue';
import AddComment from '../components/AddComment.vue'; 

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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
