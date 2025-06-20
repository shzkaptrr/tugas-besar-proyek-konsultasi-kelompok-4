import { createContext } from 'react';

// Membuat context untuk autentikasi
const AuthContext = createContext({
  isAuthenticated: false,
  token: null,
  refreshAuth: () => {}
});

export default AuthContext;