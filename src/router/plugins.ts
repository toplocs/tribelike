import { defineAsyncComponent } from 'vue';
import ErrorView from '../views/ErrorView.vue';

const ChatCreateView = defineAsyncComponent({
  loader: () => import('chat_plugin/ChatCreateView'),
  errorComponent: ErrorView,
});
const ChatView = defineAsyncComponent({
  loader: () => import('chat_plugin/ChatView'),
  errorComponent: ErrorView,
});

const WikiCreateView = defineAsyncComponent({
  loader: () => import('wiki_plugin/WikiCreateView'),
  errorComponent: ErrorView,
});
const WikiView = defineAsyncComponent({
  loader: () => import('wiki_plugin/WikiView'),
  errorComponent: ErrorView,
});

const EventCreateView = defineAsyncComponent({
  loader: () => import('event_plugin/EventCreateView'),
  errorComponent: ErrorView,
});
const EventListView = defineAsyncComponent({
  loader: () => import('event_plugin/EventListView'),
  errorComponent: ErrorView,
});
const EventDetailView = defineAsyncComponent({
  loader: () => import('event_plugin/EventDetailView'),
  errorComponent: ErrorView,
});

const BasePluginRoutes = [
  {
    path: '/chat/create',
    name: 'chatCreateView',
    props: route => ({
      interest: route.query.interest,
      location: route.query.location
    }),
    component: ChatCreateView,
    meta: { requiresAuth: true },
  },
  {
    path: '/wiki/create',
    name: 'wikiCreateView',
    props: route => ({
      interest: route.query.interest,
      location: route.query.location
    }),
    component: WikiCreateView,
    meta: { requiresAuth: true },
  },
  {
    path: '/event/create',
    name: 'eventCreateView',
    props: route => ({
      interest: route.query.interest,
      location: route.query.location
    }),
    component: EventCreateView,
    meta: { requiresAuth: true },
  },
    {
    path: '/event/:id',
    name: 'eventDetailView',
    props: route => ({
      id: route.params.id
    }),
    component: EventDetailView,
  },
];

const ProfilePluginRoutes = [

];

const InterestPluginRoutes = [
	{
    path: 'chat',
    name: 'interestChatView',
    component: ChatView,
  },
  {
    path: 'wiki',
    name: 'wikiView',
    component: WikiView,
  },
  {
    path: 'events',
    name: 'interestEventView',
    component: EventListView,
  },
];

const LocationPluginRoutes = [
	{
    path: 'chat',
    name: 'locationChatView',
    component: ChatView,
  },
  {
    path: 'wiki',
    name: 'locationWikiView',
    component: WikiView,
  },
  {
    path: 'events',
    name: 'locationtEventView',
    component: EventListView,
  },
];

export {
  BasePluginRoutes,
  ProfilePluginRoutes,
	InterestPluginRoutes,
	LocationPluginRoutes,
}