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
    console.log(one, two)
    const relation = {
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
    relations.value = relations.value.filter(x => (
      x.id !== relation.id
    ));

    const node = gun.get(`relations/${relation.id}`);
    gun.get(relation.instance?.id || relation.instance)
    .get('relations')
    .unset(node);

    gun.get(relation.two?.id || relation.two)
    .get('relations')
    .unset(node);

    return relations.value;
  }

  const populateRelation = async (
    keys: string[],
    relation: Relation,
  ) => {
    return Promise.all([
      gun.get(keys[0]).get(relation.instance).then(),
      gun.get(keys[1] || keys[0]).get(relation.two).then()
    ]).then(([dataOne, dataTwo]) => ({
      ...relation,
      instance: { id: relation.instance, ...dataOne },
      two: { id: relation.two, ...dataTwo },
    }));
  }

  const compareRelation = async (
    instance: string,
    two: string,
    type?: string
  ): Promise<Relation | undefined> => {
    return new Promise((resolve) => {
      gun.get(`relations/${instance}/${type}/${two}`)
      .once((data: Relation | undefined) => {
        resolve(data);
      });
    });
  }

  onMounted(() => {
    gun.get(instance)
    .get('relations')
    .map()
    .once((data) => {
      if (data) {
        const alreadyExists = relations.value.some(item => item.id === data.id);
        if (!alreadyExists) {
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