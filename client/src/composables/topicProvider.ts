import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function topicProvider() {
  const topic = ref<Topic | null>(null);
  const space = ref('local');
  const journal = ref([]);

  const setTopic = (id: string) => {
    gun.get(`topic/${id}/${space.value}`)
    .once((data) => { //listener that should be 'on'
      if (data) {
        topic.value = data;
      }
    });
  }

  const setGlobal = () => {
    const node = gun.get(`topic/${topic.value?.id}/global`).put(topic.value);
    gun.get('topics').get(topic.value?.id).set(node);
    console.log('globally saved!')
  }

  const createTopic = (formData: FormData) => {
    const id = crypto.randomUUID();
    const data = Object.fromEntries(formData.entries());
    topic.value = {
      id: id,
      ...data,
    };
    const node = gun.get(`topic/${id}/local`).put(topic.value);
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
    gun.get(`topic/${topic.value?.id}/${space.value}`)
    .once((data) => { //listener that should be 'on'
      if (data) {
        topic.value = data;
      }
    });
  });

  onUnmounted(() => {
    topic.value = null;
  });

  provide('topic', {
    topic,
    space,
    setTopic,
    setGlobal,
    createTopic,
  });
}

export function useTopic() {
  const data = inject('topic');

  if (!data) {
    throw new Error('Composable must have an topic provider.');
  }

  return data;
}