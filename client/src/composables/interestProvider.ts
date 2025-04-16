import CryptoJS from 'crypto-js';
import { ref, inject, provide, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import gun from '@/services/gun';

export function interestProvider() {
  const interest = ref<Interest | null>(null);
  const route = useRoute();

  const getInterest = async (title: string) => {
    /*try {
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
    }*/
    return new Promise((resolve, reject) => {
      if (gun.user().is) {
        gun.get(`interest.${title}`).once((interest) => {
          if (!interest) {
            reject('Interest not found.');
          } else {
            resolve(interest);
          }
        });
      }
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

  const createInterest = async (interest: Interest) => {
    return new Promise((resolve, reject) => {
      const relation = interest.relation;
      interest.id = crypto.randomUUID();
      interest.profile = {
        username: 'Yannik',
        test: 'hi',
      }
      gun.get(`interest.${interest.title}`)
      .put(interest, (ack) => {
        if (ack.err) {
          reject('Failed to save interest:', ack.err);
        } else {
          resolve(ack);
        }
      });
    });
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