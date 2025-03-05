const events = [
  {
    id: 1,
    title: 'Beach cleaning',
    date: new Date(),
    description: 'We will be cleaning the beach in Ponta do sol',
    location: { id: 1, title: 'Ponta do Sol'},
    interests: [
      { id: 1, title: 'Nature' },
      { id: 2, title: 'Beach' },
      { id: 3, title: 'Volunteers' }
    ],
  },
  {
    id: 2,
    title: 'Dog sitting',
    date: new Date(),
    description: 'Looking for a dog sitter',
    location: { id: 1, title: 'Ponta do Sol'},
    interests: [
      { id: 1, title: 'House' },
      { id: 2, title: 'Animals' }
    ],
  },
  {
    id: 3,
    title: 'Tree planting',
    date: new Date(),
    description: 'Gathering people for a tree planting',
    location: { id: 1, title: 'Ponta do Sol'},
    interests: [
      { id: 1, title: 'Nature' },
      { id: 2, title: 'Tree' },
      { id: 3, title: 'Forest' }
    ],
  },
];

export default events;