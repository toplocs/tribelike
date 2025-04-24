import { ref, computed, inject, provide, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function relationProvider() {
  const relations = ref<Relation | null>(null);
  const byType = computed(() => {
    return {
      likes: relations.value.filter(x => x.type === 'likes'),
      interests: relations.value.filter(x => x.type === 'interests'),
    };
  });


  const createRelation = (
    type: string,
    from: string,
    to: string,
  ) => {
    const relation = {
      type: type,
      from: from,
      to: to,
    };
    relations.push(relation);

    return relation;
  }

  onMounted(() => {
    gun.get('relations')
    .get(relation.id) //title?
    .once((data) => {
      console.log(data);
      relation.value = data;
    });
  });

  provide('relation', {
    relations,
    byType,
  });
}

export function useInterest() {
  const data = inject('relation');

  if (!data) {
    throw new Error('Composable must have an relation provider.');
  }

  return data;
}