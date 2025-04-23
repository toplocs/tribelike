import axios from 'axios';
import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';
import { bufferDecode, bufferEncode } from '@/lib/utils';

export function userProvider() {
  const user = ref<User | null>(null);
  const profiles = ref<Profile[]>([]);
  const isAuthenticated = computed(user.value !== null);

  const register = async (formData: FormData) => {
    return new Promise(async (resolve, reject) => {
      const username = formData.get('username');
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const publicKey = {
        challenge,
        rp: { name: 'Toplocs' },
        user: {
          id: new Uint8Array(8),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: { userVerification: 'preferred' },
        timeout: 60000,
        attestation: 'none'
      };

      const cred = await navigator.credentials.create({ publicKey });
      const rawId = cred.rawId;
      const usernameDerived = bufferEncode(cred.rawId);

      const hashBuffer = await crypto.subtle.digest('SHA-256', rawId);
      const passwordDerived = bufferEncode(hashBuffer);
      console.log('rawid', rawId);
      console.log(passwordDerived)

      gun.get('credentials').get(username).put({
        id: bufferEncode(rawId),
        credential: JSON.stringify({
          clientDataJSON: bufferEncode(cred.clientDataJSON),
          attestationObject: bufferEncode(cred.attestationObject),
        })
      });

      gun.user().create(usernameDerived, passwordDerived, (ack) => {
        if (ack.err) {
          reject('Create failed:', ack.err);
        } else {
          resolve(ack);
        }
      });
    });
  }

  const login = async (formData: FormData) => {
    return new Promise((resolve, reject) => {
      const username = formData.get('username');
      gun.get('credentials')
      .get(username)
      .once(async (data) => {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const publicKey = {
          challenge,
          allowCredentials: [{
            id: bufferDecode(data.id),
            type: 'public-key',
          }],
          timeout: 60000,
          userVerification: 'preferred'
        };

        const cred = await navigator.credentials.get({ publicKey });
        const rawId = cred.rawId;
        const usernameDerived = bufferEncode(rawId);

        const hashBuffer = await crypto.subtle.digest('SHA-256', rawId);
        const passwordDerived = bufferEncode(hashBuffer);

        gun.user().auth(usernameDerived, passwordDerived, (ack) => {
          if (ack.err) {
            reject('Auth failed:', ack.err);
          } else {
            resolve(ack.get);
          }
        });
      });
    });
  }

  const logout = async () => {
    localStorage.removeItem('user');
    user.value = null;
  }

  watch(() => user.value, (newValue) => {
    gun.user().put(newValue)
  });

  onMounted(() => {
    gun.user().recall({ sessionStorage: true });
    if (gun.user().is) {
      gun.user()
      .once(data => {
        user.value = data;
      });

      gun.user()
      .get('profiles')
      .map()
      .once((data) => {
        if (data) profiles.value.push(data);
      });
    }
    //put the listeners in a service
  });

  provide('user', {
    user,
    profiles,
    isAuthenticated,
    register,
    login,
    logout
  });
}

export function useUser() {
  const data = inject('user');

  if (!data) {
    throw new Error('Composable must have an user provider.');
  }
  
  return data;
}