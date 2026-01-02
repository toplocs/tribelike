import type { Uuid } from './Uuid';

export interface Discussion {
    id: Uuid;
    type: string;
    text: string;
    limit: number;
    options: Options[];
    interestIds?: Uuid[];
    locationIds?: Uuid[];
    createdAt: Date;
}

export interface Options {
    id: Uuid;
    discussionId: Uuid;
    profileId: Uuid;
    votes: number;
    action: Action;
}

export interface Action {
    id: Uuid;
    pluginId: Uuid;
    name: string;
    description: string;
    args: Record<string, any>;
}