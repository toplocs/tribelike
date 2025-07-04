import { Uuid, GenericObject as IGenericObject } from '@tribelike/types/Uuid';

export class GenericObject implements IGenericObject {
    id: Uuid;
    constructor(id: Uuid) {
        this.id = id;
    }
}
