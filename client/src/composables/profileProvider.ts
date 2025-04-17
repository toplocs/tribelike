import CryptoJS from 'crypto-js';
import { ref, computed, inject, provide, onMounted } from 'vue';
import gun from '@/services/gun';

export const defaultProfiles = ['Work', 'Hobby', 'Family'];

export function profileProvider() {
  const profile = ref<Profile | null>(null);
  const relations = ref<Interest[]>([]);

  const listener = computed(() => {
    return gun.user()
    .get('profiles')
    .get(profile.value?.id)
    .get('interests')
  });

  const getProfile = async (profileId: string) => {
    return new Promise((resolve, reject) => {
      if (gun.user().is) {
        gun.user()
        .get('profiles')
        .get(profileId)
        .once((profile) => {
          if (!profile) {
            reject('Profile not found.');
          } else {
            resolve(profile as Profile);
          }
        });
      }
    });
  }

  const createProfile = async (profile: Profile) => {
    return new Promise((resolve, reject) => {
      const email = profile.email.toLowerCase();
      const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
      profile.id = crypto.randomUUID();
      profile.image = `https://gravatar.com/avatar/${hash}`;

      gun.user()
      .get('profiles')
      .get(profile.id)
      .put(profile, (ack) => {
        if (ack.err) {
          reject('Failed to save profile:', ack.err);
        } else {
          resolve(ack);
        }
      });
    });
  }

  const editProfile = async (data: Profile) => {
    return new Promise((resolve, reject) => {
      gun.user()
      .get('profiles')
      .get(profile.value?.id)
      .put(data, (ack) => {
        if (ack.err) {
          reject('Failed to edit profile:', ack.err);
        } else {
          resolve(ack);
        }
      });
    });
  }

  const removeProfile = async () => {
    return new Promise((resolve, reject) => {
      gun.user()
      .get('profiles')
      .get(profile.value?.id)
      .put(null, (ack) => {
        if (ack.err) {
          reject('Failed to delete profile:', ack.err);
        } else {
          resolve(ack);
        }
      });
    });
  }

  const selectProfile = async (id: string) => {
    localStorage.setItem('profileId', id || null);
    profile.value = await getProfile(id);
  }


  const relates = async (
    key: string,
    value: Object
  ) => {
    return new Promise((resolve, reject) => {
      gun.user()
      .get('profiles')
      .get(profile.value?.id)
      .get('interests')
      .set(value, (ack) => {
        if (ack.err) {
          reject('Failed:', ack.err);
        } else {
          console.log(ack);
          resolve(ack);
        }
      });
    });
  }

  const listenOnRelations = async (key: string) => {
    gun.user()
    .get('profiles')
    .get(profile.value?.id)
    .get('interests')
    //.get(key)
    .map()
    .on((ack) => {
      console.log(ack);
      relations.push(ack);
    });
  }


  onMounted(async () => {
    const id = localStorage.getItem('profileId');
    if (id) {
      profile.value = await getProfile(id);
      //listeners
      listenOnRelations('likes');
      listenOnRelations('interests');
    }
  });

  provide('profile', {
    profile,
    listener,
    getProfile,
    createProfile,
    editProfile,
    removeProfile,
    selectProfile,
    relates,
    relations
  });
}

export function useProfile() {
  const data = inject('profile');

  if (!data) {
    throw new Error('Composable must have an profile provider.');
  }

  return data;
}