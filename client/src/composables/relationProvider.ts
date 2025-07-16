import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { relationKeyIds } from '@/assets/relationKeys';
import gun from '@/services/gun';

const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

export function relationProvider(
  base: string,
) {
  const instance = ref<String>(base);
  const relations = ref<Relation[]>([]);

  const createRelation = async (
    one: string = instance.value,
    type: string,
    two: string,
  ) => {
     const exists = relations.value.find(
      x => x.one === one && x.type === type && x.two === two
    );

    if (exists) {
      console.error('Relation already exists.');
      return;
    }
    const relation = {
      id: crypto.randomUUID(),
      one: one,
      type: type,
      two: two,
    };
    
    const node = gun.get(`relations/${one}/${type}/${two}`).put(relation);
    gun.get(one).get('relations').set(node);
    gun.get(two).get('relations').set(node);

    return node;
  }

  const updateRelation = async (
    id: string,
    type: string,
  ) => {
    const update = relations.value.find(x => x.id == id);
    if (update) {
      await removeRelation(update.one, update.type, update.two);
      const node = await createRelation(update.one, type, update.two);

      return node;
    } else {
      console.error('Update data was not found', id)
    }
  }


  const removeRelation = async (
    one: string = instance.value,
    type: string,
    two: string
  ) => {
    const path = `relations/${one}/${type}/${two}`;
    const node = gun.get(path);
    node.then(() => {
      gun.get(one).get('relations').unset(node);
      gun.get(two).get('relations').unset(node);
    });

    return relations.value;
  }


  const populateRelation = async (
    keys: string[],
    relation: Relation,
  ) => {
    const [dataOne, dataTwo] = await Promise.all([
      gun.lookup(keys[0], relation.one),
      gun.lookup((keys[1] || keys[0]), relation.two)
    ]);

    return {
      ...relation,
      one: dataOne || { id: relation.one },
      two: dataTwo || { id: relation.two },
    };
  }

  const compareRelation = async (
    one: string,
    type: string,
    two: string,
  ): Promise<Relation | undefined> => {
    const chain = await gun.get(one).get('relations').then();
    if (!chain) return false;

    return chain[`toplocs_v${APP_VERSION}/relations/${one}/${type}/${two}`]? true: false;
  }

  const listen = (id: String) => {
    gun.get(id)
    .get('relations')
    .map()
    .on((data, key) => {
      if (data) {
        const exists = relations.value.some(x => x.id === data.id);
        if (!exists) {
          relations.value.push(data);
        }
      } else {
        relations.value = relations.value.filter(x => (
          `toplocs_v${APP_VERSION}/relations/${x.one}/${x.type}/${x.two}` !== key
        ));
      }
    });
  }

  const clear = (id) => {
    relations.value = [];
    gun.get(id)
    .get('relations')
    .map()
    .off();
  }

  watch(() => instance.value, (newId) => {
    clear(instance.value);
    listen(newId);
  });
  
  onMounted(() => {
    listen(instance.value);
  });

  onUnmounted(() => {
    clear(instance.value);
  });

  provide('relation', {
    instance,
    relations,
    createRelation,
    updateRelation,
    removeRelation,
    populateRelation,
    compareRelation,
  });
}

export function useRelation() {
  const data = inject('relation');

  if (!data) {
    throw new Error('Composable must have a relation provider.');
  }

  return data;
}