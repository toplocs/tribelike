import CryptoJS from 'crypto-js';
import { ref, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';

export const defaultProfiles = ['Work', 'Hobby', 'Family'];

export function profileProvider() {
  const profile = ref<Profile | null>(null);
  const relations = ref<Relation | null>(null);
  const interests = ref<Interest>([]);
  const locations = ref<Location>([]);

  const createProfile = async (data: Profile) => {
    const email = data.email.toLowerCase();
    const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
    profile.value = {
      ...data,
      id: crypto.randomUUID(),
      image: `https://gravatar.com/avatar/${hash}`,
    }

    return profile.value;
  }

  const editProfile = async (data: Profile) => {
    profile.value = data;

    return profile.value;
  }

  const removeProfile = async () => {
    profile.value = null;
  }

  const selectProfile = (id: string) => {
    localStorage.setItem('profileId', id || null);
    gun.user()
    .get('profiles')
    .get(id)
    .once(data => {
      profile.value = data;
    });
  }

  const createRelation = (key, id) => {
    relations.value.push({
      key: key,
      from: profile.value.id,
      to: id,
    });
  }

  watch(() => profile.value, (newValue) => {
    if (gun.user().is) {
      gun.user()
      .get('profiles')
      .get(newValue.id)
      .put(newValue);
    }
  });

  onMounted(() => {
    const id = localStorage.getItem('profileId');
    if (gun.user().is) {
      gun.user()
      .get('profiles')
      .get(id)
      .on(data => {
        console.log('test')
        profile.value = data;
      });

      gun.user()
      .get('profiles')
      .get(id)
      .get('interests')
      .once(data => {
        interests.value = data;
      });

      gun.user()
      .get('profiles')
      .get(id)
      .get('locations')
      .once(data => {
        locations.value = data;
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