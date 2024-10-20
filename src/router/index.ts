import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import SettingsView from '@/views/SettingsView.vue';

//Profile
import ProfileListView from '@/views/ProfileListView.vue';
import ProfileDetailView from '@/views/ProfileDetailView.vue';
import ProfileSettingsView from '@/views/profile/SettingsView.vue';

//Interest
import InterestCreateView from '@/views/InterestCreateView.vue';
import InterestDetailView from '@/views/InterestDetailView.vue';
import InterestPluginsView from '@/views/interest/PluginsView.vue';
import InterestSettingsView from '@/views/interest/SettingsView.vue';
import InterestActivityView from '@/views/interest/ActivityView.vue';
import InterestChatView from '@/views/interest/ChatView.vue';
import InterestWikiView from '@/views/interest/WikiView.vue';
import InterestEventsView from '@/views/interest/EventsView.vue';
import InterestDiscussionView from '@/views/interest/DiscussionView.vue';

//Location
import LocationCreateView from '@/views/LocationCreateView.vue';
import LocationDetailView from '@/views/LocationDetailView.vue';
import LocationPluginsView from '@/views/location/PluginsView.vue';
import LocationSettingsView from '@/views/location/SettingsView.vue';
import LocationActivityView from '@/views/location/ActivityView.vue';
import LocationChatView from '@/views/location/ChatView.vue';
import LocationWikiView from '@/views/location/WikiView.vue';
import LocationEventsView from '@/views/location/EventsView.vue';
import LocationDiscussionView from '@/views/location/DiscussionView.vue';

//Plugins
import EventDetailView from '@/components/plugins/event/EventDetailView.vue';
import WikiPageView from '@/components/plugins/wiki/views/WikiPageView.vue';
import WikiCreateView from '@/components/plugins/wiki/views/WikiCreateView.vue';

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
    {
      path: '/profiles',
      name: 'profiles',
      component: ProfileListView,
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

    //interests
    {
      path: '/interest/create',
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
        {
          path: 'discussion',
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
        
      ],
    },

    //locations
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
        {
          path: 'discussion',
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

    //Plugins
    {
      path: '/events/:id',
      name: 'event',
      component: EventDetailView,
      props: true,
    },
    {
      path: '/wiki/:id',
      name: 'wiki',
      component: WikiPageView,
      props: true,
    },
    {
      path: '/wiki/create',
      name: 'wikiCreate',
      component: WikiCreateView,
      meta: { requiresAuth: true },
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
