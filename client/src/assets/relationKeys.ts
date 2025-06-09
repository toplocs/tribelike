export const profileToTopic = [
  {
    id: 'like',
    active: 'likes',
    passive: 'is liked by',
    color: 'green',
    icon: 'heart',
  }, {
    id: 'love',
    active: 'loves',
    passive: 'is loved by',
    color: 'red',
    icon: 'heart',
  }, {
    id: 'learn',
    active: 'learns',
    passive: 'is learned by',
    color: 'blue',
    icon: 'study',
  }, {
    id: 'teach',
    active: 'teaches',
    passive: 'is teached by',
    color: 'yellow',
    icon: 'study',
  }, 
];

export const profileToLocation = [
  {
    id: 'visit',
    active: 'is visiting',
    passive: 'is visited by',
    color: 'green',
    icon: 'heart',
  }, {
    id: 'live',
    active: 'is living in',
    passive: 'is living here',
    color: 'red',
    icon: 'house',
  }, {
    id: 'going',
    active: 'is going to',
    passive: 'is the destination of',
    color: 'blue',
    icon: 'shoe',
  }, {
    id: 'work',
    active: 'is working in',
    passive: 'is workingplace of',
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
    active: 'is a',
    passive: 'contains',
    color: 'blue',
    icon: '',
  },
];

export const topicToLocation = [
  {
    id: 'in',
    active: 'is in',
    passive: 'contains',
    color: 'blue',
    icon: '',
  }
];

export const relationTypes = [
  ...profileToTopic,
  ...profileToLocation,
  ...topicToLocation,
  ...topicToTopic,
];

export const relationTypeIds = Array.from(new Set(relationTypes.map(r => r.id)));

