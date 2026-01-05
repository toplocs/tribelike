import { ref, computed, inject, provide, watch, onMounted, onUnmounted } from 'vue';
import gun from '@/services/gun';
import { bufferDecode, bufferEncode } from '@/lib/utils';
import { generateAccountNumber, storeAccountNumber, verifyAccountNumber } from '@/lib/accountNumber';

export function userProvider() {
  const user = ref<User | null>(null);
  const profiles = ref<Profile[]>([]);
  const isAuthenticated = computed(() => user.value !== null);
  let userRef: any = null;
  let profilesRef: any = null;

  const register = async (formData: FormData) => {
    return new Promise(async (resolve, reject) => {
      const email = formData.get('email');
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const chain = gun.get('credentials').get(email);
      chain.once(async (data) => {
        if (!data) {
          try {
            const publicKey = {
              challenge,
              rp: { name: 'Toplocs' },
              user: {
                id: new Uint8Array(8),
                name: email,
                displayName: email,
              },
              pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
              authenticatorSelection: { userVerification: 'preferred' },
              timeout: 60000,
              attestation: 'none'
            };

            const cred = await navigator.credentials.create({ publicKey });
            const rawId = cred.rawId;
            const emailDerived = bufferEncode(cred.rawId);

            const hashBuffer = await crypto.subtle.digest('SHA-256', rawId);
            const passwordDerived = bufferEncode(hashBuffer);

            // Generate unique account number
            const accountNumber = await generateAccountNumber();

            chain.put({
              id: bufferEncode(rawId),
              credential: JSON.stringify({
                clientDataJSON: bufferEncode(cred.clientDataJSON),
                attestationObject: bufferEncode(cred.attestationObject),
              }),
              accountNumber: accountNumber,
              hasRecovery: true,
              createdAt: Date.now()
            });

            // Store account number mappings
            await storeAccountNumber(accountNumber, email);

            gun.user().create(emailDerived, passwordDerived, (ack) => {
              if (ack.err) {
                reject(new Error(`Create failed: ${ack.err}`));
              } else {
                // Return account number along with acknowledgement
                resolve({ ...ack, accountNumber });
              }
            });
          } catch(e) {
            reject(new Error(`Create failed: ${e}`));
          }
        } else {
          reject(new Error('Create failed: Email is already registered'));
        }

      });
    });
  }

  const login = async (formData: FormData) => {
    return new Promise((resolve, reject) => {
      const email = formData.get('email');
      gun.get('credentials')
      .get(email)
      .once(async (data) => {
        if (data) {
          try {
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
            const emailDerived = bufferEncode(rawId);

            const hashBuffer = await crypto.subtle.digest('SHA-256', rawId);
            const passwordDerived = bufferEncode(hashBuffer);

            gun.user().auth(emailDerived, passwordDerived, (ack) => {
              if (ack.err) {
                reject(new Error(`Auth failed: ${ack.err}`));
              } else {
                // Clean up old subscriptions before setting up new ones
                if (userRef) userRef.off();
                if (profilesRef) profilesRef.off();

                // Clear profiles array for new user
                profiles.value = [];

                // Set up user subscription with .on() for reactive updates
                userRef = gun.user().on((data) => {
                  user.value = data;
                });

                // Load profiles once - avoid continuous map().on() which syncs all profiles
                gun.user()
                  .get('profiles')
                  .map()
                  .once((data, key) => {
                    if (data) {
                      const exists = profiles.value.some(x => x.id === data.id);
                      if (!exists) profiles.value.push(data);
                    }
                  });

                resolve(ack.get);
              }
            });
          } catch(e) {
            reject(new Error(`Login failed: ${e}`));
          }
        } else {
          reject(new Error('Login failed: User does not exist'));
        }
      });
    });
  }

  const recoverAccount = async (email: string, accountNumber: number) => {
    return new Promise(async (resolve, reject) => {
      // 1. Verify email + account number combination
      gun.get('credentials')
        .get(email)
        .once(async (data) => {
          if (!data) {
            reject(new Error('Account not found'));
            return;
          }

          if (data.accountNumber !== accountNumber) {
            reject(new Error('Invalid account number'));
            return;
          }

          try {
            // 2. Create new WebAuthn credential
            const challenge = crypto.getRandomValues(new Uint8Array(32));
            const publicKey = {
              challenge,
              rp: { name: 'Toplocs' },
              user: {
                id: new Uint8Array(8),
                name: email,
                displayName: email,
              },
              pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
              authenticatorSelection: { userVerification: 'preferred' },
              timeout: 60000,
              attestation: 'none'
            };

            const cred = await navigator.credentials.create({ publicKey });
            const rawId = cred.rawId;
            const emailDerived = bufferEncode(rawId);

            const hashBuffer = await crypto.subtle.digest('SHA-256', rawId);
            const passwordDerived = bufferEncode(hashBuffer);

            // 3. Update credentials with new passkey
            gun.get('credentials').get(email).put({
              id: bufferEncode(rawId),
              credential: JSON.stringify({
                clientDataJSON: bufferEncode(cred.clientDataJSON),
                attestationObject: bufferEncode(cred.attestationObject),
              }),
              accountNumber: accountNumber, // Keep same account number
              hasRecovery: true,
              recoveredAt: Date.now() // Track recovery event
            });

            // 4. Authenticate with Gun using new credentials
            gun.user().auth(emailDerived, passwordDerived, (ack) => {
              if (ack.err) {
                reject(new Error(`Recovery auth failed: ${ack.err}`));
              } else {
                // Clean up old subscriptions before setting up new ones
                if (userRef) userRef.off();
                if (profilesRef) profilesRef.off();

                // Clear profiles array for new user
                profiles.value = [];

                // Set up user subscription
                userRef = gun.user().on((data) => {
                  user.value = data;
                });

                // Load profiles
                gun.user()
                  .get('profiles')
                  .map()
                  .once((data, key) => {
                    if (data) {
                      const exists = profiles.value.some(x => x.id === data.id);
                      if (!exists) profiles.value.push(data);
                    }
                  });

                resolve(ack.get);
              }
            });
          } catch (e) {
            reject(new Error(`Recovery failed: ${e}`));
          }
        });
    });
  }

  const logout = async () => {
    try {
      // Clean up subscriptions first
      if (userRef) {
        userRef.off();
        userRef = null;
      }
      if (profilesRef) {
        profilesRef.off();
        profilesRef = null;
      }

      // Clear local state
      user.value = null;
      profiles.value = [];

      // Leave Gun session
      gun.user().leave();

      // Clear session storage (Gun uses localStorage for persistence)
      sessionStorage.clear();

      // Clear profileId from localStorage to prevent profile from being shown after logout
      localStorage.removeItem('profileId');

      console.log('Logout completed successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  watch(() => user.value, (newValue) => {
    // Only write to Gun if user is authenticated (not null/logging out)
    if (newValue) {
      gun.user().put(newValue);
    }
  });

  onMounted(() => {
    gun.user().recall({ sessionStorage: true });
    if (gun.user().is && !userRef) {
      // Only set up subscriptions if not already authenticated
      // This prevents duplicate subscriptions after login
      userRef = gun.user().on((data) => {
        user.value = data;
      });

      // Load profiles once - avoid continuous map().on() which syncs all profiles
      gun.user()
        .get('profiles')
        .map()
        .once((data, key) => {
          if (data) {
            const exists = profiles.value.some(x => x.id === data.id);
            if (!exists) profiles.value.push(data);
          }
        });
    }
  });

  onUnmounted(() => {
    // Clean up subscriptions
    if (userRef) userRef.off();
    if (profilesRef) profilesRef.off();
  });

  provide('user', {
    user,
    profiles,
    isAuthenticated,
    register,
    login,
    logout,
    recoverAccount
  });
}

export function useUser() {
  const data = inject('user');

  if (!data) {
    throw new Error('Composable must have an user provider.');
  }
  
  return data;
}