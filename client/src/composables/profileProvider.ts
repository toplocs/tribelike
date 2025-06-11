import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import { useUser } from '@/composables/userProvider';
import gun from '@/services/gun';

export const defaultProfiles = ['Work', 'Hobby', 'Family'];

export function profileProvider() {
  const profile = ref<Profile | null>(null);
  const relations = ref<Relation | null>(null);
  const interests = ref<Interest>([]);
  const locations = ref<Location>([]);

  const createProfile = async (formData: FormData) => {
    const id = crypto.randomUUID();
    const data = Object.fromEntries(formData.entries());
    const email = data.email.toLowerCase();
    const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
    profile.value = {
      ...data,
      id: id,
      image: `https://gravatar.com/avatar/${hash}`,
    }

    const node = gun.get(`profile/${id}`).put(profile.value);
    gun.user().get('profiles').set(node);
    gun.get('profiles').get(id).set(node);

    return node;
  }

  const editProfile = async (formData: FormData) => {
    if (gun.user().is) {
      const id = profile.value?.id;
      const data = Object.fromEntries(formData.entries());
      const email = data.email.toLowerCase();
      const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
      profile.value = {
        ...data,
        image: `https://gravatar.com/avatar/${hash}`,
      }
      const node = gun.get(`profile/${id}`).put(profile.value);

      return node;
    }
    /*
    const id = profile.value?.id;
    await removeProfile(id);
    const node = await createProfile(formData);    

    return node;
    */
  }

  const removeProfile = async (id: string) => {
    if (gun.user().is) {
      const node = gun.get(`profile/${id}`);
      node.then(() => {
        gun.user().get('profiles').unset(node);
        gun.get('profiles').get(id).unset(node);
        profile.value = null;
      });
    }
  }

  const selectProfile = (id: string) => {
    localStorage.setItem('profileId', id || null);
    if (gun.user().is) {
      gun.get(`profile/${id}`)
      .once(data => {
        if (data) {
          profile.value = data;
        }
      });
    }
  }

  onMounted(() => {
    const id = localStorage.getItem('profileId');
    if (gun.user().is) {
      gun.user()
      .get('profiles')
      .map()
      .once((data) => {
        if (data && data.id === id) {
          profile.value = data;
        }
      });

      //listeners in profileService
    }
  });

  provide('profile', {
    profile,
    interests,
    locations,
    createProfile,
    editProfile,
    removeProfile,
    selectProfile,
  });
}

export function useProfile() {
  const data = inject('profile');

  if (!data) {
    throw new Error('Composable must have an profile provider.');
  }

  return data;
}