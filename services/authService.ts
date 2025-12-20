
export interface UserProfile {
  username: string;
  email: string;
  password?: string; // Added for local verification
  phone: string;
  joinDate: string;
  balance: number;
  hasDeposited: boolean;
  wins: number;
  losses: number;
  totalInvested: number;
}

const ACCOUNTS_KEY = 'copytrade_accounts_db';
const SESSION_KEY = 'copytrade_active_session';

export const authService = {
  // Get all accounts from local storage
  getAllAccounts: (): Record<string, UserProfile> => {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : {};
  },

  // Save a new user or update existing in the local DB
  saveUserToDB: (user: UserProfile) => {
    const accounts = authService.getAllAccounts();
    accounts[user.email.toLowerCase()] = user;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  },

  // Register a new user
  register: (user: UserProfile): boolean => {
    const accounts = authService.getAllAccounts();
    if (accounts[user.email.toLowerCase()]) {
      return false; // Account already exists
    }
    authService.saveUserToDB(user);
    localStorage.setItem(SESSION_KEY, user.email.toLowerCase());
    return true;
  },

  // Login a user
  login: (email: string, password: string): UserProfile | null => {
    const accounts = authService.getAllAccounts();
    const user = accounts[email.toLowerCase()];
    if (user && user.password === password) {
      localStorage.setItem(SESSION_KEY, email.toLowerCase());
      return user;
    }
    return null;
  },

  // Get the currently logged in user
  getUser: (): UserProfile | null => {
    const activeEmail = localStorage.getItem(SESSION_KEY);
    if (!activeEmail) return null;
    
    const accounts = authService.getAllAccounts();
    return accounts[activeEmail] || null;
  },

  // Update specific fields for the current user
  updateUser: (updates: Partial<UserProfile>) => {
    const current = authService.getUser();
    if (current) {
      const updated = { ...current, ...updates };
      authService.saveUserToDB(updated);
      return updated;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(SESSION_KEY) !== null;
  }
};
