import CryptoJS from 'crypto-js';
import { ref, inject, provide, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import gun from '@/services/gun';

export function interestProvider() {
  const interest = ref<Interest | null>(null);
  const route = useRoute();

  const getInterest = async (title: string) => {
    return new Promise((resolve, reject) => {
      gun.get(`interest.${title}`).once((interest) => {
        if (!interest) {
          reject('Interest not found.');
        } else {
          resolve(interest);
        }
      });
    });
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

  const createInterest = async (interest: Interest, profile: Profile) => {
    return new Promise((resolve, reject) => {
      const relation = interest.relation;
      interest.id = crypto.randomUUID();
      //interest.profile = profile;
      gun.get('interests')
      .get(interest.title)
      .set(interest, (ack) => {
        if (ack.err) {
          reject('Failed to save interest:', ack.err);
        } else {
          resolve(ack);
        }
      });
    });
  }

  onUnmounted(() => { //off listen
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