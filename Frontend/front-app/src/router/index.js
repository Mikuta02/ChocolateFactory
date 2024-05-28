import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Factories from '../components/Factories.vue';
import AddFactory from '../components/AddFactory.vue';
import FactoryDetails from '../components/FactoryDetails.vue';
import AddChocolate from '../components/AddChocolate.vue';

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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
