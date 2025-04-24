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
      // TODO: should be email. Suggest to hash(email) and use the hash to store the data.
      // gun.get('credentials').get(emailHash).put(...);

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
      console.log('Registration credential:', cred);

      // Should we use the email hash as the derived username?
      const rawId = cred.rawId;
      const usernameDerived = bufferEncode(cred.rawId);
      // I assume this isn't secure. Needs sea.work(id,salt)
      // Then it can't be brute forced or rainbow table attacked.
      // Why not use cred.id? It is a string already
      const hashBuffer = await crypto.subtle.digest('SHA-256', rawId);
      const passwordDerived = bufferEncode(hashBuffer);
      console.log('rawid', rawId);
      console.log(passwordDerived)

      gun.get('credentials').get(username).put({
        id: bufferEncode(rawId),
        // Q: This is basically empty. Why?
        // The attestationObject is containing import infos: 
        // credentialID, publicKey, counter, credentialPublicKey, ...
        credential: JSON.stringify({
          clientDataJSON: bufferEncode(cred.clientDataJSON),
          attestationObject: bufferEncode(cred.attestationObject),
        })
      });

      gun.user().create(usernameDerived, passwordDerived, (ack) => {
        if (ack.err) {
          reject('Create failed:', ack.err);
        } else {
          // Q: No there isa key pair created - and we need to store it encrypted??
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
        console.log('Login credential:', publicKey, cred);
        // cred returns a cred.response.signature which needs to be verified.
        // verify(pubKey, signature, challenge) needs to ensure the signature is valid.
        // https://github.com/mylofi/webauthn-local-client?tab=readme-ov-file#verifying-an-authentication-response
        // https://github.com/mylofi/webauthn-local-client/blob/main/src/walc.js#L419
        const rawId = cred.rawId;  // Why not use id? It is a string already
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
    // gun.user().leave(); ??
    localStorage.removeItem('user');
    user.value = null;
  }

  watch(() => user.value, (newValue) => {
    gun.user().put(newValue)
  });

  onMounted(() => {
    // The recall function attempts to restore the user's authentication session 
    // without requiring them to log in again. It checks for stored session data
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