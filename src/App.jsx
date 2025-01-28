import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/users" 
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/users" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;