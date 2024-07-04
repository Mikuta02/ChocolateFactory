import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import Factories from '../components/Factories.vue';
import AddFactory from '../components/AddFactory.vue';
import FactoryDetails from '../components/FactoryDetails.vue';
import AddChocolate from '../components/AddChocolate.vue';
import EditChocolate from '../components/EditChocolate.vue';
import EditAmount from '../components/EditAmount.vue';
import Cart from '../components/Cart.vue';
import AddComment from '../components/AddComment.vue'; 
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import UserPurchases from '../components/UserPurchases.vue';
import Profile from '../components/Profile.vue';
import RegisterManager from '../components/RegisterManager.vue';
import RegisterWorker from '../components/RegisterWorker.vue';
import ManagerPurchases from '../components/ManagerPurchases.vue';
import ManagerComments from '../components/ManagerComments.vue';
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
    path: '/edit-amount/:id/:factoryId', 
    name: 'EditAmount',
    component: EditAmount,
    props: true
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/purchases',
    name: 'UserPurchases',
    component: UserPurchases,
    meta: { requiresAuth: true }
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
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'my-purchases',
        name: 'MyPurchases',
        component: UserPurchases,
        meta: { requiresAuth: true }
      },
      {
        path: 'factory-purchases',
        name: 'FactoryPurchases',
        component: ManagerPurchases,
        meta: { requiresAuth: true, requiresManager: true }
      },
      {
        path: 'manage-comments',
        name: 'ManageComments',
        component: ManagerComments,
        meta: { requiresAuth: true, requiresManager: true }
      },
      {
        path: 'register-manager',
        name: 'RegisterManager',
        component: RegisterManager,
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'register-worker',
        name: 'RegisterWorker',
        component: RegisterWorker,
        meta: { requiresAuth: true, requiresManager: true }
      },
      {
        path: 'add-factory',
        name: 'AddFactory',
        component: AddFactory,
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresManager = to.matched.some(record => record.meta.requiresManager);

  if (requiresAuth && !store.getters.isAuthenticated) {
    next('/login');
  } else if (requiresAdmin && !store.getters.isAdministrator) {
    next('/login');
  } else if (requiresManager && !store.getters.isManager) {
    next('/login');
  } else {
    next();
  }
});

export default router;
