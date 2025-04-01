import axios from 'axios';
import { ref, inject, provide, watch, onMounted } from 'vue';

type Session = {
  token: string;
  expires: Date;
}

export function sessionProvider() {
  const session = ref<Session | null>(null);

  const initSession = async () => {
    try {
      const { data } = await axios.get('/api/v1/auth/session');

      return data;
    } catch (e) {
      console.error('Failed to fetch session:', e);
      session.value = null;
    }
  };

  const reloadSession = (userData: User | null) => {
    session.value = userData;
    if (userData) {
      localStorage.setItem('session', JSON.stringify(userData));
    } else {
      localStorage.removeItem('session');
    }
  };

  const clearSession = () => {
    session.value = null;
    localStorage.removeItem('session');
  };

  watch(session, (newSession) => {
    if (newSession) {
      localStorage.setItem('session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('session');
    }
  });

  onMounted(async () => {
    session.value = await initSession();
    console.log(session.value);
  });

  provide('session', {
    session,
    initSession,
    reloadSession,
    clearSession,
  });
}

export function useSession() {
  const data = inject('session');

  if (!data) {
    throw new Error('Composable must have a session provider.');
  }

  return data;
}
