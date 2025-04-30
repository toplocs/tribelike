import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function relationProvider(
  instance: string,
) {
  const relations = ref<Relation[]>([]);
  const byType = computed(() => {
    return {
      likes: relations.value.filter(x => x.type === 'like'),
      interests: relations.value.filter(x => x.type === 'interest'),
    };
  });

  const createRelation = async (
    one: string = instance,
    type: string,
    two: string,
  ) => {
    const relation = {
      id: crypto.randomUUID(),
      one: one,
      type: type,
      two: two,
    };
    relations.value.push(relation);

    const node = gun.get(`relations/${one}/${type}/${two}`).put(relation);
    gun.get(one).get('relations').set(node);
    gun.get(two).get('relations').set(node);

    return relation;
  }

  const removeRelation = async (
    one: string = instance,
    type: string,
    two: string
  ) => {
    const path = `relations/${one}/${type}/${two}`;
    relations.value = relations.value.filter(x => (
      `relations/${x.one}/${x.type}/${x.two}` !== path
    ));

    const node = gun.get(path);
    gun.get(one).get('relations').unset(node);
    gun.get(two).get('relations').unset(node);

    return relations.value;
  }

  const populateRelation = async (
    keys: string[],
    relation: Relation,
  ) => {
    return Promise.all([
      gun.get(keys[0]).get(relation.one).then(),
      gun.get(keys[1] || keys[0]).get(relation.two).then()
    ]).then(([dataOne, dataTwo]) => ({
      ...relation,
      one: { id: relation.one, ...dataOne },
      two: { id: relation.two, ...dataTwo },
    }));
  }

  const compareRelation = async (
    one: string,
    two: string,
    type?: string
  ): Promise<Relation | undefined> => {
    const chain = await gun.get(one)
    .get('relations')
    .then();
    return chain[`relations/${one}/${type}/${two}`]? true: false;
  }

  onMounted(() => {
    gun.get(instance)
    .get('relations')
    .map()
    .once((data) => {
      if (data) {
        const exists = relations.value.some(x => x.id === data.id);
        if (!exists) {
          relations.value.push(data);
        }
      }
    });
  });

  onUnmounted(() => {
    console.log('UNMOUNT');
    relations.value = [];
  })

  provide('relation', {
    relations,
    byType,
    createRelation,
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