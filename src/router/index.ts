import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import SettingsView from '@/views/SettingsView.vue';
import ProfileListView from '@/views/ProfileListView.vue';
import ProfileDetailView from '@/views/ProfileDetailView.vue';
import InterestFindView from '@/views/InterestFindView.vue';
import LocationFindView from '@/views/LocationFindView.vue';

import LocationDetailView from '@/views/LocationDetailView.vue';
import LocationActivityView from '@/views/location/ActivityView.vue';
import LocationChatView from '@/views/location/ChatView.vue';
import LocationWikiView from '@/views/location/WikiView.vue';
import LocationEventsView from '@/views/location/EventsView.vue';

import InterestDetailView from '@/views/InterestDetailView.vue';
import InterestActivityView from '@/views/interest/ActivityView.vue';
import InterestChatView from '@/views/interest/ChatView.vue';
import InterestWikiView from '@/views/interest/WikiView.vue';
import InterestEventsView from '@/views/interest/EventsView.vue';

//Plugin
import EventDetailView from '@/components/plugins/event/EventDetailView.vue';

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
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: ProfileListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profiles/:id',
      name: 'profile',
      component: ProfileDetailView,
      props: true,
    },
    {
      path: '/interests',
      name: 'interests',
      component: InterestFindView,
      meta: { requiresAuth: true },
    },
    {
      path: '/interest/:id',
      component: InterestDetailView,
      props: true,
      children: [
        {
          path: '',
          name: 'interestActivity',
          component: InterestActivityView,
        },
        {
          path: 'chat',
          name: 'interestChat',
          component: InterestChatView,
        },
        {
          path: 'wiki',
          name: 'interestWiki',
          component: InterestWikiView,
        },
        {
          path: 'events',
          name: 'interestEvents',
          component: InterestEventsView,
        },
      ],
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationFindView,
      meta: { requiresAuth: true },
    },
    {
      path: '/location/:id',
      component: LocationDetailView,
      props: true,
      children: [
        {
          path: '',
          name: 'locationActivity',
          component: LocationActivityView,
        },
        {
          path: 'chat',
          name: 'locationChat',
          component: LocationChatView,
        },
        {
          path: 'wiki',
          name: 'locationWiki',
          component: LocationWikiView,
        },
        {
          path: 'events',
          name: 'locationEvents',
          component: LocationEventsView,
        },
      ],
    },

    //Plugins
    {
      path: '/events/:id',
      name: 'event',
      component: EventDetailView,
      props: true,
    },
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
