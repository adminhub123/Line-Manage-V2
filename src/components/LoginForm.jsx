// src/components/LoginForm.jsx
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import { useMediaQuery } from 'react-responsive'; // Need to install: npm install react-responsive

const LoginForm = () => {
  const { login: authLogin } = useAuth();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const onFinish = async (values) => {
    try {
      const response = await login(values.username, values.password);
      if (response.username) {
        authLogin(response);
        message.success('Login successful');
      } else {
        message.error('Login failed');
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message || 'Login failed');
      } else {
        message.error('Network error, please try again');
      }
    }
  };

  // Responsive styles
  const cardStyles = {
    width: '100%',
    margin: '0 auto',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  };

  const titleStyles = {
    textAlign: 'center',
    fontSize: isMobile ? '20px' : '24px',
    marginBottom: '24px',
    color: '#1890ff'
  };

  const inputStyles = {
    height: isMobile ? '40px' : '45px',
    fontSize: isMobile ? '14px' : '16px'
  };

  return (
    <Card 
      bordered={false}
      style={cardStyles}
      bodyStyle={{ padding: isMobile ? '16px' : '24px' }}
    >
      <h1 style={titleStyles}>User Management Login V2.0</h1>
      
      <Form
        name="login"
        onFinish={onFinish}
        size={isMobile ? 'middle' : 'large'}
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, message: 'Username must be at least 3 characters!' }
          ]}
        >
          <Input 
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} 
            placeholder="Username (Web Admin)"
            style={inputStyles}
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="Password"
            style={inputStyles}
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: isMobile ? '12px' : '24px' }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            block
            size={isMobile ? 'middle' : 'large'}
            style={{
              height: isMobile ? '40px' : '45px',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '500'
            }}
          >
            Login to Web Management
          </Button>
        </Form.Item>
      </Form>

      {/* Optional: Add a responsive footer */}
      <div style={{
        textAlign: 'center',
        fontSize: isMobile ? '12px' : '14px',
        color: '#8c8c8c',
        marginTop: isMobile ? '12px' : '24px'
      }}>
        Protected by User Management System
      </div>
    </Card>
  );
};

export default LoginForm;