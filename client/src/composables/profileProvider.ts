import CryptoJS from 'crypto-js';
import { ref, computed, inject, provide, onMounted } from 'vue';
import gun from '@/services/gun';

export const defaultProfiles = ['Work', 'Hobby', 'Family'];

export function profileProvider() {
  const profile = ref<Profile | null>(null);
  const likes = ref<Interest[]>([]);
  const gunProfile = computed(() => {
    return gun.user()
      .get('profiles')
      .get(profile.value?.id)
  });

  const getProfile = async (profileId: string) => {
    return new Promise((resolve, reject) => {
      if (gun.user().is) {
        gun.user().get('profiles').get(profileId).once((profile) => {
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

      gun.user().get('profiles').get(profile.id).put(profile, (ack) => {
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
      gunProfile.value.put(data, (ack) => {
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
      gunProfile.value.put(null, (ack) => {
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


  const like = async (key: string, value: Object) => {
    return new Promise((resolve, reject) => {
      gunProfile.value
      .get('likes')
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

  const getLikes = async () => {
    return new Promise((resolve, reject) => {
      gunProfile.value.get('likes').map().once((data) => {
        if (data) {
          likes.value.push(data);
        }
      });
    });
  }

  onMounted(async () => {
    const id = localStorage.getItem('profileId');
    if (id) {
      profile.value = await getProfile(id);
      await getLikes();
    }
  });

  provide('profile', {
    profile,
    getProfile,
    createProfile,
    editProfile,
    removeProfile,
    selectProfile,
    like,
    likes,
  });
}

export function useProfile() {
  const data = inject('profile');

  if (!data) {
    throw new Error('Composable must have an profile provider.');
  }

  return data;
}