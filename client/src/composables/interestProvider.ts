import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function interestProvider() {
  const interest = ref<Interest | null>(null);

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
    const node = gun.get(`interest_${id}`).put(interest.value);
    gun.get('interests').get(id).set(node);

    return interest.value;
  }

  onMounted(() => {
    gun.get(`interest_${interest.id}`)
    .once((data) => {
      console.log(interest.value);
      interest.value = data;
    });
  });

  provide('interest', {
    interest,
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