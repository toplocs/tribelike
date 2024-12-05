import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';

import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import SettingsView from '@/views/SettingsView.vue';

//Profile
import ProfileListView from '@/views/ProfileListView.vue';
import ProfileCreateView from '@/views/ProfileCreateView.vue';
import ProfileDetailView from '@/views/ProfileDetailView.vue';
import ProfileSettingsView from '@/views/profile/SettingsView.vue';

//Interest
import InterestCreateView from '@/views/InterestCreateView.vue';
import InterestDetailView from '@/views/InterestDetailView.vue';
import InterestInfoView from '@/views/interest/InfoView.vue';
import InterestDiscussionView from '@/views/interest/DiscussionView.vue';
import InterestPluginsView from '@/views/interest/PluginsView.vue';
import InterestSettingsView from '@/views/interest/SettingsView.vue';

//Location
import LocationCreateView from '@/views/LocationCreateView.vue';
import LocationDetailView from '@/views/LocationDetailView.vue';
import LocationInfoView from '@/views/location/InfoView.vue';
import LocationDiscussionView from '@/views/location/DiscussionView.vue';
import LocationPluginsView from '@/views/location/PluginsView.vue';
import LocationSettingsView from '@/views/location/SettingsView.vue';

import {
  BasePluginRoutes,
  //ProfilePluginRoutes,
  InterestPluginRoutes,
  LocationPluginRoutes,
} from './plugins.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  },
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

    //Profiles
    {
      path: '/profiles',
      name: 'profiles',
      component: ProfileListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profiles/create',
      name: 'profileCreate',
      component: ProfileCreateView,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile/:id',
      props: true,
      children: [
        {
          path: '',
          name: 'profile',
          component: ProfileDetailView,
        },
        {
          path: 'settings',
          name: 'profileSettings',
          component: ProfileSettingsView,
        },
      ]
    },

    //Interests
    {
      path: '/interests/create',
      name: 'interestCreate',
      component: InterestCreateView,
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
          component: InterestInfoView,
        },

        {
          path: 'discussions',
          name: 'interestDiscussion',
          component: InterestDiscussionView,
        },
        {
          path: 'plugins',
          name: 'interestPlugins',
          component: InterestPluginsView,
        },
        {
          path: 'settings',
          name: 'interestSettings',
          component: InterestSettingsView,
        },
        ...InterestPluginRoutes,
      ],
    },

    //Locations
    {
      path: '/locations/create',
      name: 'locationCreate',
      component: LocationCreateView,
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
          component: LocationInfoView,
        },

        {
          path: 'discussions',
          name: 'locationDiscussion',
          component: LocationDiscussionView,
        },

        {
          path: 'plugins',
          name: 'locationPlugins',
          component: LocationPluginsView,
        },
        {
          path: 'settings',
          name: 'locationSettings',
          component: LocationSettingsView,
        },
        ...LocationPluginRoutes,
      ],
    },
    ...BasePluginRoutes,

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
