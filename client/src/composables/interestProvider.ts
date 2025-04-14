import axios from 'axios';
import { ref, inject, provide, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import gun from '@/services/gun';

export function interestProvider() {
  const interest = ref<Interest | null>(null);
  const route = useRoute();

  const getInterest = async (interestId?: string) => {
    try {
      if (!interestId) throw new Error('Interest ID not found');
      gun.get('tribelike')
        .get('interest')
        .get(interestId)
        .on(data => {
          interest.value = data;
          console.log(data);
        });

      gun.get('tribelike')
        .get('interest')
        .get(interestId)
        .get('members')
        .map(data => {
          console.log(data);
        })
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

  const createInterest = async (formData: FormData) => {
    try {
      gun.get('tribelike')
      .get('interest')
      .get(formData.get('title'))
      .put({
        title: formData.get('title'),
        access: formData.get('access'),
      }, (ack) => {
        console.log(ack);
      });

      gun.get('tribelike')
      .get('interest')
      .get(formData.get('title'))
      .get('members')
      .set({
        username: 'Yannik',
      }, (ack) => {
        console.log(ack);
      });
    } catch (e) {
      console.error(e);
    }
  }

  onUnmounted(() => {
    if (interest.value) {
      gun.get('tribelike')
      .get('interest')
      .get(interest.value.title)
      .off();
    }
  });

  provide('interest', {
    interest,
    getInterest,
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