import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
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
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          } />
          <Route path="/" element={<Navigate to="/users" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;