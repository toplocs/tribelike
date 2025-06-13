import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function locationProvider() {
  const location = ref<Location | null>(null);

  const setLocation = async (id: string) => {
    gun.get(`location/${id}`)
    .once((data) => {
      if (data) {
        location.value = data;
      }
    });
  }

  const createLocation = (formData: FormData) => {
    const id = crypto.randomUUID();
    const data = Object.fromEntries(formData.entries());
    location.value = {
      id: id,
      ...data,
    };
    const node = gun.get(`location/${id}`).put(location.value);
    gun.get('locations').get(id).set(node);
    gun.get('locations/titles').get(location.value.title).set(node);

    //initial relation
    const relation = gun.get(`relations/${data.profileId}/${data.relationId}/${id}`).put({
      id: crypto.randomUUID(),
      one: data.profileId,
      type: data.relationId,
      two: id,
    });
    gun.get(data.profileId).get('relations').set(relation);
    gun.get(id).get('relations').set(relation);

    return location.value;
  }

  onMounted(() => {
    gun.get(`location/${location.value?.id}`)
    .once((data) => {
      if (data) {
        location.value = data;
      }
    });
  });

  onUnmounted(() => {
    location.value = null;
  });

  provide('location', {
    location,
    setLocation,
    createLocation,
  });
}

export function useLocation() {
  const data = inject('location');

  if (!data) {
    throw new Error('Composable must have an location provider.');
  }

  return data;
}