// src/pages/UserManagement.jsx
import { useState, useEffect } from 'react';
import { Layout, Button, message, Tabs, Row, Col } from 'antd';
import { PlusOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import TeamManagement from '../components/TeamManagement';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import { useMediaQuery } from 'react-responsive';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState(['admin', 'otp', 'team']);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (values) => {
    try {
      await createUser({
        ...values,
        isWebAdmin: values.isWebAdmin || false
      });
      fetchUsers();
      setModalVisible(false);
      message.success('User added successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleEditUser = async (values) => {
    try {
      await updateUser(editingUser._id, {
        ...values,
        isWebAdmin: values.isWebAdmin || false
      });
      fetchUsers();
      setModalVisible(false);
      setEditingUser(null);
      message.success('User updated successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsers();
      message.success('User deleted successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleAddTeam = (team) => {
    if (!teams.includes(team)) {
      setTeams([...teams, team]);
      message.success('Team added successfully');
    } else {
      message.error('Team already exists');
    }
  };

  const handleDeleteTeam = (team) => {
    if (['admin', 'otp', 'team'].includes(team)) {
      message.error('Cannot delete default teams');
      return;
    }
    const usersInTeam = users.some(user => user.team === team);
    if (usersInTeam) {
      message.error('Cannot delete team with active users');
      return;
    }
    setTeams(teams.filter(t => t !== team));
    message.success('Team deleted successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Responsive styles
  const headerStyle = {
    position: 'fixed',
    width: '100%',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? '0 16px' : '0 24px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    height: isMobile ? '56px' : '64px'
  };

  const contentStyle = {
    marginTop: isMobile ? '56px' : '64px',
    padding: isMobile ? '16px' : '24px',
    minHeight: `calc(100vh - ${isMobile ? '56px' : '64px'})`
  };

  const buttonStyle = {
    fontSize: isMobile ? '14px' : '16px',
    height: isMobile ? '32px' : '40px',
    padding: isMobile ? '0 12px' : '0 16px'
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={headerStyle}>
        {isMobile ? (
          <>
            <MenuOutlined 
              onClick={() => setMobileMenuVisible(!mobileMenuVisible)} 
              style={{ fontSize: '20px' }}
            />
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h3 style={{ margin: 0 }}>User Management</h3>
            </div>
            <Button 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              style={buttonStyle}
            />
          </>
        ) : (
          <>
            <h2 style={{ margin: 0 }}>User Management</h2>
            <div>
              <span style={{ marginRight: '16px' }}>
                Welcome, {user?.username}
              </span>
              <Button 
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
                style={buttonStyle}
              >
                Logout
              </Button>
            </div>
          </>
        )}
      </Header>

      <Content style={contentStyle}>
        <Tabs 
          defaultActiveKey="users"
          size={isMobile ? 'small' : 'middle'}
          style={{ marginBottom: isMobile ? '16px' : '24px' }}
        >
          <TabPane tab="Users" key="users">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setEditingUser(null);
                    setModalVisible(true);
                  }}
                  style={buttonStyle}
                >
                  Add User
                </Button>
              </Col>
              <Col span={24}>
                <UserTable
                  users={users}
                  loading={loading}
                  onEdit={(user) => {
                    setEditingUser(user);
                    setModalVisible(true);
                  }}
                  onDelete={handleDeleteUser}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Teams" key="teams">
            <TeamManagement
              teams={teams}
              onAddTeam={handleAddTeam}
              onDeleteTeam={handleDeleteTeam}
              isMobile={isMobile}
            />
          </TabPane>
        </Tabs>

        <UserForm
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingUser(null);
          }}
          onSubmit={editingUser ? handleEditUser : handleAddUser}
          initialValues={editingUser}
          teams={teams}
          isMobile={isMobile}
        />
      </Content>
    </Layout>
  );
};

export default UserManagement;