import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function sphereProvider() {
  const sphere = ref<Sphere | null>(null);
  const space = ref('local');
  const journal = ref([]);

  const setSphere = async (id: string) => {
    gun.get(`sphere/${id}/${space.value}`)
    .once((data) => {
      if (data) {
        sphere.value = data;
      }
    });
  }

  /*const setGlobal = () => {
    const node = gun.get(`sphere/${sphere.value?.id}/global`).put(sphere.value);
    gun.get('spheres').get(sphere.value?.id).set(node);
    space.value = 'global';
    console.log('globally saved!')
  }*/

  const createSphere = (formData: FormData) => {
    const id = crypto.randomUUID();
    const data = Object.fromEntries(formData.entries());
    sphere.value = {
      id: id,
      ...data,
    };
    const node = gun.get(`sphere/${id}/local`).put(sphere.value);
    gun.get('spheres').get(id).set(node);
    gun.get('spheres/titles').get(sphere.value.title).set(node);

    return sphere.value;
  }

  onMounted(() => {
    gun.get(`sphere/${sphere.value?.id}/${space.value}`)
    .once((data) => {
      if (data) {
        sphere.value = data;
      }
    });
  });

  onUnmounted(() => {
    sphere.value = null;
  });

  provide('sphere', {
    sphere,
    space,
    setSphere,
    createSphere,
  });
}

export function useSphere() {
  const data = inject('sphere');

  if (!data) {
    throw new Error('Composable must have an sphere provider.');
  }

  return data;
}