// src/pages/Login.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const Login = () => {
  const { user } = useAuth();

  if (user?.token) {
    return <Navigate to="/users" replace />;
  }

  return (
    <div style={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5',
      padding: '16px' // Add padding for smaller screens
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px' // Limit maximum width
      }}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;