import React, { Component, useContext, createContext, useState } from 'react';
import './App.css';
import Login from './login/Login'
import Checkout from './checkout/Checkout'
import SignUp from './register/SignUp'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Navigation } from './Navigation'
import { login } from './login/Login';

function App() {
  const [email, setUsername] = useState(null);
  return (

    <Router>
      <AuthProvider value={email}>
        <Navigation></Navigation>
        <Routes>
          <Route path='/login' element={< Login />}></Route>
          <Route path='/register' element={< SignUp />}></Route>
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={< Login />}></Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
  // }
}
const ProtectedRoute = ({ children }: any) => {
  const { email } = useAuth();
  const location = useLocation();

  if (!email) {
    return <Navigate to="/home" replace state={{ from: location }} />;
  }

  return children;
};

const AuthContext = React.createContext(null);

const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setUsername] = React.useState(null);

  const handleLogin = async (email: string, password: string) => {
    console.log('handle login')
    const usr = await login(email, password);
    console.log(`userName: ${usr}`)
    if (usr) {
      setUsername(usr);
      // const origin = location.state?.from?.pathname || '/pricing';
      const origin = '/checkout';
      console.log(`origin: ${origin}`)
      navigate(origin);
    }
  };

  const handleLogout = () => {
    setUsername(null);
  };

  const value = {
    email,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return React.useContext(AuthContext);
};
export default App;
