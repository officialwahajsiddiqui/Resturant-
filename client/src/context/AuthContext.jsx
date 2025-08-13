import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setLoading(false);
          return;
        }

        // Fetch user data
        const response = await fetch('http://localhost:5000/api/auth/user', {
          headers: {
            'x-auth-token': token
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
          setIsAuthenticated(true);
        } else {
          // If token is invalid, remove it
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        await loadUser();
        return true;
      } else {
        setError(data.msg || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Server error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        await loadUser();
        return true;
      } else {
        setError(data.msg || 'Invalid credentials');
        return false;
      }
    } catch (err) {
      setError('Server error. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load user data
  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/user', {
        headers: {
          'x-auth-token': token
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error loading user:', err);
      logout();
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is admin
  const isAdmin = user?.type === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};