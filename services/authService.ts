
export interface UserProfile {
  username: string;
  email: string;
  password?: string;
  phone: string;
  joinDate: string;
  balance: number;
  hasDeposited: boolean;
  wins: number;
  losses: number;
  totalInvested: number;
}

const SESSION_KEY = 'copytrade_active_session';
const USER_CACHE_KEY = 'copytrade_user_data';

export const authService = {
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(USER_CACHE_KEY);
    return data ? JSON.parse(data) : null;
  },

  register: async (user: UserProfile): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', payload: user })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem(SESSION_KEY, user.email.toLowerCase());
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(result.user));
        return true;
      }
      return false;
    } catch (e) {
      localStorage.setItem(SESSION_KEY, user.email.toLowerCase());
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
      return true;
    }
  },

  login: async (email: string, password: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', payload: { email, password } })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem(SESSION_KEY, email.toLowerCase());
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(result.user));
        return result.user;
      }
      return null;
    } catch (e) {
      const local = authService.getUser();
      if (local && local.email.toLowerCase() === email.toLowerCase() && local.password === password) {
        localStorage.setItem(SESSION_KEY, email.toLowerCase());
        return local;
      }
      return null;
    }
  },

  updateUser: (updates: Partial<UserProfile>) => {
    const current = authService.getUser();
    if (current) {
      const updated = { ...current, ...updates };
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(updated));
      
      // TARGET DEDICATED SYNC ENDPOINT
      fetch('/api/save-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: current.email, 
          updates: {
            balance: updated.balance,
            hasDeposited: updated.hasDeposited,
            wins: updated.wins,
            losses: updated.losses,
            totalInvested: updated.totalInvested
          } 
        })
      }).catch(() => console.debug("Queueing cloud update..."));

      return updated;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(SESSION_KEY) !== null;
  }
};
