import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function relationProvider(
  one: string,
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
    console.log(relations.value)

    gun.get('relations')
    .get(relation.one)  //save type:id for unique types
    .get(id)
    .put(relation);

    gun.get('relations')
    .get(relation.two)
    .get(id)
    .put(relation)

    return relation;
  }

  const removeRelation = async (
    id: string,
    one: string,
    two: string,
  ) => {
    relations.value = relations.value.filter(x => x.id != id);

    gun.get('relations')
    .get(one)
    .get(id)
    .put(null)
    .then(data => console.log(data))

    gun.get('relations')
    .get(two)
    .get(id)
    .put(null);

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
      one: dataOne,
      two: dataTwo
    }));
  }

  onMounted(() => {
    gun.get('relations')
    .get(one)
    .map()
    .once((data) => {
      if (data) relations.value.push(data);
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