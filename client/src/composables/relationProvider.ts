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

  const removeRelation = async (relation: Relation) => {
    const one = relation.one?.id || relation.one;
    const type = relation.type;
    const two = relation.two?.id || relation.two;

    relations.value = relations.value.filter(x => (
      x.id !== relation.id
    ));

    const node = gun.get(`relations/${one}/${type}/${two}`);
    gun.get(one).get('relations').unset(node);
    gun.get(two).get('relations').unset(node);
    node.set('removed');

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
    return new Promise((resolve, reject) => {
      gun.get(`relations/${one}/${type}/${two}`)
      .once((data: Relation | undefined) => {
        if (data) {
          const removed = Object.entries(data).some(
            ([key, value]) => value === 'removed'
          );
          console.log(removed);
          if (removed) {
            resolve(null);
          } else {
            resolve(data);
          }//bit ugly but works
        } else {
          resolve(null);
        }
      });
    });
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