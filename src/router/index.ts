import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import MainView from '@/views/MainView.vue';
import SelectProfileView from '@/views/SelectProfileView.vue';
import AddProfileView from '@/views/profiles/AddProfileView.vue';

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
      path: '/main',
      name: 'main',
      component: MainView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: SelectProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profiles/add',
      name: 'addProfile',
      component: AddProfileView,
      meta: { requiresAuth: true },
    },
  ]
});

const getSession = async () => {
  try {
    const authHeader = localStorage.getItem('authHeader');
    const res = await fetch(`http://localhost:3000/api/auth`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    const { session } = await res.json();

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
      next({ name: 'intro1' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
