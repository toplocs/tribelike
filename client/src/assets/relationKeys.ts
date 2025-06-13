export const profileToTopic = [
  {
    id: 'like',
    active: 'liking',
    passive: 'liked by',
    color: 'green',
    icon: 'heart',
  }, {
    id: 'love',
    active: 'loving',
    passive: 'loved by',
    color: 'red',
    icon: 'heart',
  }, {
    id: 'learn',
    active: 'learning',
    passive: 'learned by',
    color: 'blue',
    icon: 'study',
  }, {
    id: 'teach',
    active: 'teaching',
    passive: 'teached by',
    color: 'yellow',
    icon: 'study',
  }, 
];

export const profileToLocation = [
  {
    id: 'visit',
    active: 'visiting',
    passive: 'visited by',
    color: 'green',
    icon: 'heart',
  }, {
    id: 'live',
    active: 'living in',
    passive: 'living here',
    color: 'red',
    icon: 'house',
  }, {
    id: 'going',
    active: 'going to',
    passive: 'the destination of',
    color: 'blue',
    icon: 'shoe',
  }, {
    id: 'work',
    active: 'working in',
    passive: 'workingplace of',
    color: 'yellow',
    icon: 'study',
  }, 
];

export const topicToTopic = [
  {
    id: 'child',
    active: 'child of',
    passive: 'parent of',
    color: 'green',
    icon: '',
  }, {
    id: 'category',
    active: 'a',
    passive: 'contains',
    color: 'blue',
    icon: '',
  },
];

export const topicToLocation = [
  {
    id: 'in',
    active: 'in',
    passive: 'contains',
    color: 'blue',
    icon: '',
  }
];

export const locationToLocation = [
  {
    id: 'child',
    active: 'child of',
    passive: 'parent of',
    color: 'green',
    icon: '',
  }, {
    id: 'category',
    active: 'a',
    passive: 'contains',
    color: 'blue',
    icon: '',
  },
];

export const relationTypes = [
  ...profileToTopic,
  ...profileToLocation,
  ...topicToLocation,
  ...topicToTopic,
  ...locationToLocation,
];

export const relationTypeIds = Array.from(new Set(relationTypes.map(r => r.id)));

