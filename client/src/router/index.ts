import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

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

//Sphere
import SphereCreateView from '@/views/sphere/CreateView.vue';
import SphereDetailView from '@/views/sphere/DetailView.vue';
import SphereInfoView from '@/views/sphere/InfoView.vue';
import SphereSettingsView from '@/views/sphere/SettingsView.vue';

import GunRegisterView from '@/views/GunRegisterView.vue';
import GunLoginView from '@/views/GunLoginView.vue';
import PluginLoaderView from '@/views/PluginLoaderView.vue';

import { addPluginRoutes } from './plugins';

// Determine router mode based on environment variable
const routerMode = import.meta.env.VITE_ROUTER_MODE || 'hash';
const history = routerMode === 'history' 
  ? createWebHistory(import.meta.env.BASE_URL)
  : createWebHashHistory();

// Log router mode in development
if (import.meta.env.DEV) {
  console.log(`🔧 Router mode: ${routerMode}`);
}

const router = createRouter({
  history,
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
/*
    //Topics
    {
      path: '/topic/create',
      name: 'topicCreate',
      component: TopicCreateView,
      meta: { requiresAuth: true },
    },
    {
      path: '/topic/:id',
      name: 'topicDetail',
      component: TopicDetailView,
      props: true,
      children: [
        {
          path: '',
          name: 'topicInfo',
          component: InterestInfoView,
        },
        {
          path: 'discussions',
          name: 'topicDiscussion',
          component: InterestDiscussionView,
        },
        {
          path: 'plugins',
          name: 'topicPlugins',
          component: InterestPluginsView,
        },
        {
          path: 'settings',
          name: 'topicSettings',
          component: InterestSettingsView,
        },
        {
          path: ':pluginPath(.*)*',
          name: 'pluginLoader',
          component: PluginLoaderView,
        },
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
      ],
    },
*/
    //Spheres
    {
      path: '/sphere/create',
      name: 'sphereCreate',
      component: SphereCreateView,
      meta: { requiresAuth: true },
    },
    {
      path: '/sphere/:id',
      name: 'sphereDetail',
      component: SphereDetailView,
      props: true,
      children: [
        {
          path: '',
          name: 'sphereInfo',
          component: SphereInfoView,
        },
        {
          path: 'settings',
          name: 'sphereSettings',
          component: SphereSettingsView,
        },
        {
          path: ':pluginPath(.*)*',
          name: 'pluginLoader',
          component: PluginLoaderView,
        },
      ],
    },

  ]
});

addPluginRoutes(router);

router.beforeEach(async (to, from, next) => {
  //middleware functions here
  next();
});

export default router