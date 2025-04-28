import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function relationProvider(
  one: string, //instance? work on profile or other
) {
  const relations = ref<Relation[]>([]);
  const byType = computed(() => {
    return {
      likes: relations.value.filter(x => x.type === 'like'),
      interests: relations.value.filter(x => x.type === 'interest'),
    };
  });

  const createRelation = async (
    type: string,
    two: string,
  ) => {
    const id = crypto.randomUUID();
    const relation = {
      id: id,
      type: type,
      one: one,
      two: two,
    };
    relations.value.push(relation);

    const node = gun.get(`relations/${id}`).put(relation);
    gun.get(one).get('relations').set(node);
    gun.get(two).get('relations').set(node);

    return relation;
  }

  const removeRelation = async (relation: Relation) => {
    console.log(relation);
    relations.value = relations.value.filter(x => (
      x.id !== relation.id
    ));

    const node = gun.get(`relations/${relation.id}`);
    gun.get(relation.one?.id || relation.one)
    .get('relations')
    .unset(node);

    gun.get(relation.two?.id || relation.two)
    .get('relations')
    .unset(node);

    return relations.value;
  }

  const populateRelation = async (
    key: string,
    relation: Relation,
  ) => {
    return Promise.all([
      gun.get(key).get(relation.one).then(),
      gun.get(key).get(relation.two).then()
    ]).then(([dataOne, dataTwo]) => ({
      ...relation,
      one: { id: relation.one, ...dataOne },
      two: { id: relation.two, ...dataTwo },
    }));
  }

  onMounted(() => {
    gun.get(one)
    .get('relations')
    .map()
    .once((data) => {
      console.log('ONCE', data);
      if (data) relations.value.push(data);
    })
  });

  onUnmounted(() => {
    console.log('UNMOUNT');
    relations.value = [];
  })

  provide('relation', {
    relations,
    byType,
    createRelation,
    populateRelation,
    removeRelation,
  });
}

export function useRelation() {
  const data = inject('relation');

  if (!data) {
    throw new Error('Composable must have an relation provider.');
  }

  return data;
}