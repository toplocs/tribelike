import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export function sphereProvider() {
  const sphere = ref<Sphere | null>(null);
  const space = ref('local');
  const journal = ref([]);

  const setSphere = (id: string) => {
    gun.get(`sphere/${id}`)
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
    const node = gun.get(`sphere/${id}`).put(sphere.value);
    gun.get('spheres').get(id).set(node);
    gun.get(`sphere_${sphere.value?.title.toLowerCase()}`).put(node);

    return sphere.value;
  }


  const searchSphereByTitle = async (term: string): Promise<any[]> => {
    return new Promise((resolve) => {
      const results: any[] = [];

      const start = 'sphere_'+term.toLowerCase();
      const end = incrementLastChar(start);

      gun.get({ '.': { '>': start, '<': end }, '%': 50000 }) //50kb
      .map()
      .once((data, key) => {
        if (data && !results.find(x => x.id === data.id)) {
          results.push(data);
        }
      });

      setTimeout(() => resolve(results), 600);
    });
  }

  function incrementLastChar(str: string) { //utils
    const last = str.slice(-1);
    const inc = String.fromCharCode(last.charCodeAt(0) + 1);
    return str.slice(0, -1) + inc;
  }

  onMounted(() => {
    gun.get(`sphere/${sphere.value?.id}`)
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
    searchSphereByTitle
  });
}

export function useSphere() {
  const data = inject('sphere');

  if (!data) {
    throw new Error('Composable must have an sphere provider.');
  }

  return data;
}