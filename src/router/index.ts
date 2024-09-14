import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import SelectProfileView from '@/views/SelectProfileView.vue';
import SelectLocationView from '@/views/SelectLocationView.vue';
import MainView from '@/views/MainView.vue';
import InterestView from '@/views/InterestView.vue';
import LocationView from '@/views/LocationView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: SelectProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/locations',
      name: 'locations',
      component: SelectLocationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/main',
      name: 'main',
      component: MainView,
      meta: { requiresAuth: true },
    },
    {
      path: '/interests/:id',
      name: 'interest',
      component: InterestView,
      props: true,
    },
    {
      path: '/locations/:id',
      name: 'location',
      component: LocationView,
      props: true,
    }
  ]
});

const getSession = async () => {
  try {
    const authHeader = localStorage.getItem('authHeader');
    const response = await axios.get(`/api/auth`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    const { session } = response.data;

    return session;
  } catch (e) {
    console.error(e);
  }
}

router.beforeEach(async (to, from, next) => {
  const session = await getSession();
  const isAuthenticated = session?.user ? true : false;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
