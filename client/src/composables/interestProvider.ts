import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function interestProvider() {
  const interest = ref<Interest | null>(null);

  const setInterest = (id: string) => {
    gun.user()
    gun.get('interests')
    .get(id)
    .once(data => {
      interest.value = data;
    });
  }

  const createInterest = (formData: FormData) => {
    const data = Object.fromEntries(formData.entries());
    interest.value = {
      id: crypto.randomUUID(),
      ...data,
    };

    return interest.value;
  }

  watch(() => interest.value, (newValue) => {
    if (interest.value) {
      gun.get('interests')
      .get(newValue.id)
      .put(newValue);
    }
  });

  onMounted(() => {
    gun.get('interests')
    .get(interest.id) //title later on??
    .once((data) => {
      console.log(data);
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