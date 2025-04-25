import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function relationProvider(
  one: string,
) {
  const relations = ref<Relation[]>([]);
  const byType = computed(() => {
    return {
      likes: relations.value.filter(x => x.type === 'likes'),
      interests: relations.value.filter(x => x.type === 'interests'),
    };
  });

  const createRelation = async (
    type: string,
    two: string,
  ) => {
    const relation = {
      type: type,
      one: one,
      two: two,
    };
    relations.value = [...relations.value, relation];

    return relation;
  }

  watch(relations, (newVal) => {
    const latest = newVal[newVal.length - 1];
    if (!latest) return;

    gun.get('relations') //save for first entry
    .get(latest.one)
    .set(latest);

    gun.get('relations') //save for second entry
    .get(latest.two)
    .set(latest)
  });

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
  });
}

export function useRelation() {
  const data = inject('relation');

  if (!data) {
    throw new Error('Composable must have an relation provider.');
  }

  return data;
}