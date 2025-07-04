export const profileRelations = [
  {
    id: 'like',
    active: 'liking',
    passive: 'liked by',
    color: 'green',
    icon: 'heart',
    accepts: ['topic'],
  }, {
    id: 'love',
    active: 'loving',
    passive: 'loved by',
    color: 'red',
    icon: 'heart',
    accepts: ['topic'],
  }, {
    id: 'learn',
    active: 'learning',
    passive: 'learned by',
    color: 'blue',
    icon: 'study',
    accepts: ['topic'],
  }, {
    id: 'teach',
    active: 'teaching',
    passive: 'teached by',
    color: 'yellow',
    icon: 'study',
    accepts: ['topic'],
  }, {
    id: 'visit',
    active: 'visiting',
    passive: 'visited by',
    color: 'green',
    icon: 'heart',
    accepts: ['location'],
  }, {
    id: 'live',
    active: 'living in',
    passive: 'living here',
    color: 'red',
    icon: 'house',
    accepts: ['location'],
  }, {
    id: 'going',
    active: 'going to',
    passive: 'the destination of',
    color: 'blue',
    icon: 'shoe',
    accepts: ['location'],
  }, {
    id: 'work',
    active: 'working in',
    passive: 'workingplace of',
    color: 'yellow',
    icon: 'study',
    accepts: ['location'],
  }, 
];

export const topicRelations = [
  {
    id: 'child',
    active: 'child of',
    passive: 'parent of',
    color: 'green',
    icon: '',
    accepts: ['topic'],
  }, {
    id: 'category',
    active: 'category of',
    passive: 'contains',
    color: 'blue',
    icon: '',
    accepts: ['topic'],
  },
];


export const locationRelations = [
  {
    id: 'child',
    active: 'child of',
    passive: 'parent of',
    color: 'green',
    icon: '',
    accepts: ['location'],
  }, {
    id: 'category',
    active: 'category of',
    passive: 'contains',
    color: 'blue',
    icon: '',
    accepts: ['topic'],
  },
];

export const relationKeys = [
  ...profileRelations,
  ...topicRelations,
  ...locationRelations,
];

export const relationKeyIds = Array.from(new Set(relationKeys.map(r => r.id)));

// Filtered exports for specific relation types
export const profileToTopic = profileRelations.filter(r => r.accepts.includes('topic'));
export const profileToLocation = profileRelations.filter(r => r.accepts.includes('location'));
export const topicToTopic = topicRelations.filter(r => r.accepts.includes('topic'));
export const locationToLocation = locationRelations.filter(r => r.accepts.includes('location'));
