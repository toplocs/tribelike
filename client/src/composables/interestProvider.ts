import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function interestProvider() {
  const interest = ref<Interest | null>(null);
  const space = ref('global');

  const setInterest = (id: string) => {
    gun.get(`interest_${id}`)
    .once((data) => {
      interest.value = data;
    });
  }

  const createInterest = (formData: FormData) => {
    const id = crypto.randomUUID();
    const data = Object.fromEntries(formData.entries());
    interest.value = {
      id: id,
      ...data,
    };
    const node = gun.get(`interest_${id}_local`).put(interest.value);
    gun.get('interests').get(id).set(node);

    //initial relation
    const relation = gun.get(`relations/${data.profileId}/${data.relationId}/${id}`).put({
      id: crypto.randomUUID(),
      one: data.profileId,
      type: data.relationId,
      two: id,
    });
    gun.get(data.profileId).get('relations').set(relation);
    gun.get(id).get('relations').set(relation);

    return interest.value;
  }

  onMounted(() => {
    gun.get(`interest_${interest.id}`)
    .once((data) => { //listener that should be 'on'
      if (data) {
        interest.value = data;
        space.value = 'global'
      }
    });

    gun.get(`interest_${interest.id}_local`)
    .once((data) => {
       if (data) {
        interest.value = data;
        space.value = 'local';
      }
    });
  });

  provide('interest', {
    interest,
    space,
    setInterest,
    createInterest,
  });
}

export function useInterest() {
  const data = inject('interest');

  if (!data) {
    throw new Error('Composable must have an interest provider.');
  }

  return data;
}