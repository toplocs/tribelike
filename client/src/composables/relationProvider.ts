import { ref, computed, inject, provide, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function relationProvider() {
  const by = ref<string>('');
  const relations = ref<Relation[]>([]);
  const byType = computed(() => {
    return {
      likes: relations.value.filter(x => x.type === 'likes'),
      interests: relations.value.filter(x => x.type === 'interests'),
    };
  });


  const createRelation = (
    type: string,
    by: string,
    to: string,
  ) => {
    const relation = {
      type: type,
      by: by,
      to: to,
    };
    relations.value?.push(relation);

    return relation;
  }

  onMounted(() => {
    gun.get('relations')
    .get(by.value)
    .once((data) => {
      console.log(data);
    });
  });

  provide('relation', {
    by,
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