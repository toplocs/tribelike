import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { relationTypeIds } from '@/assets/relationKeys';
import gun from '@/services/gun';

export function relationProvider(
  instance: string,
) {
  const relations = ref<Relation[]>([]);
  const byType = computed(() => {
    const result: Record<string, any[]> = {};
    for (const id of relationTypeIds) {
      result[id || 'relation'] = relations.value.filter(x => x.type === id);
    }
    return result;
  });

  const createRelation = async (
    one: string = instance,
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
    one: string = instance,
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
    const chain = await gun.get(one)
    .get('relations')
    .then();

    if (!chain) return false;

    return chain[`relations/${one}/${type}/${two}`]? true: false;
  }
  
  onMounted(() => {
    gun.get(instance)
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
          `relations/${x.one}/${x.type}/${x.two}` !== key
        ));
      }
    });
  });

  onUnmounted(() => {
    relations.value = [];
  })

  provide('relation', {
    relations,
    byType,
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