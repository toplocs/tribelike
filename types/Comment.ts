import { Uuid, GenericObject } from './Uuid';

export interface Comment extends GenericObject {
  id: Uuid;
  text: string;
  authorId: Uuid;
  sphereId: Uuid;
  parentId: Uuid | null;
  createdAt: string;
}

export interface Vote extends GenericObject {
  id: Uuid;
  commentId: Uuid;
  profileId: Uuid;
  value: number;
  createdAt: string;
}

export interface CommentWithVotes extends Comment {
  voteCount: number;
  userVote: number | null;
  replyCount: number;
}
