import { RelationKey } from '@/model/relation';
import type { RelationType } from '@/model/relation';

const relationKeys: Record<RelationType, RelationKey[]> = {
  'profile-profile': [
    new RelationKey('friends_with', 'Friend', 'Friendship', 'Indicates a friendship between people'),
  ],
  'profile-location': [
    new RelationKey('current', 'Current', 'Current Location', 'Where you are right now'),
    new RelationKey('like', 'Likes', 'Favorite', 'A persons favorite locations'),
  ],
  'profile-interest': [
    new RelationKey('like', 'Likes', 'Favorite', 'A persons favorite topics'),
    new RelationKey('doing', 'Does', 'Doing', 'A person is doing this topics'),
    new RelationKey('expert', 'Expert', 'Expert', 'A person is an expert for this topic'),
    new RelationKey('curious', 'Curious', 'Curious', 'A person is curious about this topic'),
  ],
  'location-location': [
    new RelationKey('in', 'Child of', 'In', 'Indicates in which location this is'),
  ],
  'location-interest': [
    new RelationKey('isA', 'is a', 'Category', 'The category of a location'),
  ],
  'interest-interest': [
    new RelationKey('childOf', 'is in', 'Children', 'Top category of an interest'),
    new RelationKey('isA', 'is a', 'Category', 'The category of an interest'),
  ]
};

export default relationKeys;
