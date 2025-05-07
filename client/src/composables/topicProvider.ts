import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function topicProvider() {
  const topic = ref<Interest | null>(null);

  const setInterest = (id: string) => {
    gun.get(`topic_${id}`)
    .once((data) => {
      topic.value = data;
    });
  }

  const createInterest = (formData: FormData) => {
    const id = crypto.randomUUID();
    const data = Object.fromEntries(formData.entries());
    topic.value = {
      id: id,
      ...data,
    };
    const node = gun.get(`topic_${id}`).put(topic.value);
    gun.get('topics').get(id).set(node);

    //initial relation
    const relation = gun.get(`relations/${data.profileId}/${data.relationId}/${id}`).put({
      id: crypto.randomUUID(),
      one: data.profileId,
      type: data.relationId,
      two: id,
    });
    gun.get(data.profileId).get('relations').set(relation);
    gun.get(id).get('relations').set(relation);

    return topic.value;
  }

  onMounted(() => {
    gun.get(`topic_${topic.id}`)
    .once((data) => { //listener that should be 'on'
      console.log(topic.value);
      topic.value = data;
    });
  });

  provide('topic', {
    topic,
    setInterest,
    createInterest,
  });
}

export function useInterest() {
  const data = inject('topic');

  if (!data) {
    throw new Error('Composable must have an topic provider.');
  }

  return data;
}