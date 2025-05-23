import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';

import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import EmailLoginView from '@/views/EmailLoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import RegisterFinishView from '@/views/RegisterFinishView.vue';
import RegisterExpiredView from '@/views/RegisterExpiredView.vue';
import SettingsView from '@/views/SettingsView.vue';
import PasskeyView from '@/views/PasskeyView.vue';
import MagicLinkView from '@/views/MagicLinkView.vue';

//Profile
import ProfileListView from '@/views/profile/ProfileListView.vue';
import ProfileCreateView from '@/views/profile/ProfileCreateView.vue';
import ProfileDetailView from '@/views/profile/ProfileDetailView.vue';
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

import GunRegisterView from '@/views/GunRegisterView.vue';
import GunLoginView from '@/views/GunLoginView.vue';

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
      component: LandingView,
      meta: { title: "TOPLOCS" },
    },
    {
      path: '/login',
      children: [
        {
          path: '',
          name: 'login',
          component: GunLoginView,
        },
        {
          path: 'passkey',
          name: 'passkey',
          component: LoginView,
        },
        {
          path: 'email',
          name: 'emailLogin',
          component: EmailLoginView,
        },
      ]
    },
    {
      path: '/register',
      children: [
        {
          path: '',
          name: 'register',
          component: GunRegisterView,
        },
        {
          path: 'finish',
          name: 'registerFinish',
          component: RegisterFinishView,
        },
        {
          path: 'expired',
          name: 'registerExpired',
          component: RegisterExpiredView,
        },
      ]
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/passkeys',
      name: 'passkeys',
      component: PasskeyView
    },
    {
      path: '/magicLink/:token',
      name: 'magicLink',
      component: MagicLinkView
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
      path: '/interest/create',
      name: 'interestCreate',
      component: InterestCreateView,
      //meta: { requiresAuth: true },
    },
    {
      path: '/interest/:title',
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
      path: '/location/create',
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

router.beforeEach(async (to, from, next) => {

  next();
});

export default router