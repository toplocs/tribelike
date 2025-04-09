import axios from 'axios';
import { ref, inject, provide, onMounted } from 'vue';

export function interestProvider() {
  const interest = ref<Interest | null>(null);

  const getInterest = async (interestId?: string) => {
    try {
      if (!interestId) throw new Error('Interest ID not found');
      const { data } = await axios.get(`/api/interest/${interestId}`);

      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const setInterest = async (formData: FormData) => {
    try {
      const interestId = formData.get('interestId');
      const { data } = await axios.put(`/api/interest/${interestId}`, {
        
      });

      return data;
    } catch (e) {
      console.error(e);
    }
  }

  provide('interest', {
    interest,
    getInterest,
    setInterest,
  });
}

export function useInterest() {
  const data = inject('interest');

  if (!data) {
    throw new Error('Composable must have an interest provider.');
  }

  return data;
}