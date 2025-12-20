
export interface UserProfile {
  username: string;
  email: string;
  phone: string;
  joinDate: string;
  balance: number;
  hasDeposited: boolean;
  wins: number;
  losses: number;
  totalInvested: number;
}

const STORAGE_KEY = 'copytrade_user_profile';

export const authService = {
  saveUser: (user: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  updateUser: (updates: Partial<UserProfile>) => {
    const current = authService.getUser();
    if (current) {
      const updated = { ...current, ...updates };
      authService.saveUser(updated);
      return updated;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
};
